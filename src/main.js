/**
 * @fileoverview main.js — MESTRE DE ORQUESTRAÇÃO (v15.3.3 - ESTÁVEL)
 * CIRURGIA: Integração do módulo MetaCognition e preservação do fluxo de feedback/animação.
 */

import { G } from './engine/gameState.js';
import { initDebugMode } from './engine/debugMode.js';
import { ProfileEngine } from './core/ada/ProfileEngine.js';
import { MetacognitionEngine } from './core/ada/MetacognitionEngine.js'; // Módulo integrado
import { AdaptiveSelector } from './core/ada/AdaptiveSelector.js';
import { LearningAnalytics } from './core/ada/LearningAnalytics.js';
import { AdaptiveAudioEngine } from './core/ada/AdaptiveAudioEngine.js';
import { CanvasRenderer } from './ui/canvasRenderer.js';
import * as uiManager from './ui/uiManager.js';

// --- HELPERS E BINDINGS ---
const $ = (id) => document.getElementById(id);
const on = (id, fn) => { const el = $(id); if (el) el.onclick = fn; };
const abrirM = (id) => $(id)?.classList.add('active');
const fecharM = (id) => $(id)?.classList.remove('active');

let renderizadorGrafico = null;

// --- FUNÇÕES DE DASHBOARD ---
function atualizarDashboard() {
    const content = $('dash-content');
    if (!content) return;
    if (!G.historico || Object.keys(G.historico).length === 0) {
        content.innerHTML = "<p style='text-align:center; opacity:0.5; padding:20px; font-family:monospace;'>Aguardando coleta de dados...</p>";
        return;
    }
    content.innerHTML = LearningAnalytics.gerarHtmlDashboardBNCC(G.historico);
    const btnCsv = $('btn-export-csv');
    if (btnCsv) btnCsv.onclick = () => LearningAnalytics.exportarCSV(G.nome, G.historico);
}

// --- FUNÇÕES DE NAVEGAÇÃO ---
function mostrarSeletorBlocos() {
    let nomeRaw = $('nome-cientista')?.value.trim() || 'Cientista Anonymous';
    let turmaRaw = $('turma-cientista')?.value.trim() || '7ºA';

    G.nome = nomeRaw.charAt(0).toUpperCase() + nomeRaw.slice(1).toLowerCase();
    G.turma = turmaRaw.toUpperCase(); 
    
    const cacheBNCC = localStorage.getItem(`labtech_h_${G.nome}_${G.turma}`);
    if (cacheBNCC) {
        try { G.historico = JSON.parse(decodeURIComponent(atob(cacheBNCC))); } 
        catch (e) { G.historico = {}; }
    } else {
        G.historico = {};
    }

    G.perfilCognitivo = new ProfileEngine().inicializarEstudante(`${G.nome}_${G.turma}`);

    if (!renderizadorGrafico) renderizadorGrafico = new CanvasRenderer('canvas-game'); 

    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
    $('block-selector')?.classList.remove('hidden');
    $('ada-command-post')?.classList.add('active'); 

    const msg = G.perfilCognitivo.itensRespondidos === 0 ? `Olá, ${G.nome}. Iniciando mapeamento.` : `Bem-vindo de volta, ${G.nome}.`;
    if (uiManager.narrarContexto) uiManager.narrarContexto(msg, true);
}

// --- CORE: PROCESSAR RESPOSTA (CIRURGIA METACOGNITIVA) ---
async function processarResposta(alt, q) {
    if (G.respondeu) return;
    G.respondeu = true;

    const latenciaSessaoMs = Date.now() - G.tempoInicialQuestao;
    const isAcerto = (alt.tipo === "acerto" || alt.correta === true || String(alt.valor) === String(q.res));

    // 1. Feedback Imediato (UI)
    uiManager.updHUD();
    const fb = $('fb');
    if (fb) {
        fb.textContent = isAcerto ? "Isso mesmo! Excelente." : (alt.descricao || "Observe a lógica.");
        fb.style.display = 'block';
        fb.style.borderColor = isAcerto ? '#00ff66' : '#ff3333';
        fb.style.color = isAcerto ? '#00ff66' : '#ffbb33';
    }

    // 2. Integração MetaCognition
    // Analisa o padrão de erro/acerto antes da animação principal
    try {
        const reflexao = MetaCognition.analisar(G, q, alt, isAcerto);
        if (reflexao) uiManager.exibirReflexaoMetacognitiva(reflexao);
    } catch (e) { console.warn("MetaCognition bypass:", e); }

    // 3. Telemetria e Áudio
    if (isAcerto) { G.acertos++; G.combo++; AdaptiveAudioEngine.sonarSucesso(); } 
    else { G.combo = 0; G.erros++; G.vida -= 15; AdaptiveAudioEngine.sonarAnomalia(); }

    G.registrarInteracao(q.bncc || "Geral", isAcerto, isAcerto ? 'NULO' : 'CONCEITO', latenciaSessaoMs);
    localStorage.setItem(`labtech_h_${G.nome}_${G.turma}`, btoa(encodeURIComponent(JSON.stringify(G.historico))));

    // 4. Animação de Mediação (Canvas)
    try {
        const pontoA = parseFloat(String(q.a || 0).replace(/[^\d.-]/g, ''));
        const pontoB = parseFloat(String(alt.valor || 0).replace(/[^\d.-]/g, ''));
        const pAdaptivo = AdaptiveSelector.selecionarProximaTarefa(G, [q]);
        
        if (renderizadorGrafico) {
            await renderizadorGrafico.animarArcos(q, pontoB - pontoA, pAdaptivo.interfaceModifiers.modoRepresentacao);
            AdaptiveAudioEngine.sonarConclusao();
        }
    } catch (err) { console.warn("⚠️ Animação falhou:", err); }

    // 5. Finalização
    $('btn-prox')?.classList.remove('hidden');
    $('ada-command-post')?.classList.add('active'); 

    if (G.vida <= 0) setTimeout(() => uiManager.exibirGameOver(), 800);
}

function iniciarBloco(id) {
    G.reiniciarParaNovoBloco(id);
    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
    $('game-screen')?.classList.remove('hidden');
    proximaQ();
}

function proximaQ() {
    G.respondeu = false;
    const fb = $('fb');
    if (fb) fb.style.display = 'none';
    document.querySelectorAll('.modal').forEach(m => m.classList.remove('active'));
    
    const q = AdaptiveSelector.selecionarProximaQuestao(G.currentBlock, G.perfilCognitivo);
    if (!q) return;
    
    G.tempoInicialQuestao = Date.now();
    renderQ(q);
}

function renderQ(q) {
    $('conta-display').textContent = q.display || "Resolva:";
    $('grid-botoes').innerHTML = '';
    $('btn-prox')?.classList.add('hidden');
    
    const pAdaptivo = AdaptiveSelector.selecionarProximaTarefa(G, [q]);
    renderizadorGrafico?.renderCv(q, null, pAdaptivo.interfaceModifiers.modoRepresentacao);

    q.alternativas.sort(() => Math.random() - 0.5).forEach(alt => {
        const b = document.createElement('button');
        b.className = 'ba';
        b.textContent = alt.texto || alt.valor;
        b.onclick = () => processarResposta(alt, q);
        $('grid-botoes').appendChild(b);
    });
}

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', async () => {
    // ... (restante dos bindings e inicialização inalterados)
    console.log("🚀 [SISTEMA v1.5.3] Motor LabTech com MetaCognition operante.");
    
    try { await AdaptiveSelector.carregarBancoDeQuestoes(); } catch (e) { alert("Erro de carga."); }
    initDebugMode();
    on('btn-acessar', mostrarSeletorBlocos);
    on('btn-prox', proximaQ);
    on('btn-musica', uiManager.toggleMusica);
    on('btn-voz', uiManager.toggleVoz);
    on('btn-alterar-usuario', () => location.reload());
    
    const yearSpan = $('labtech-year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();
    
    on('btn-cred', () => abrirM('mcred'));
    on('btn-dash', () => { atualizarDashboard(); abrirM('mdash'); });
    on('btn-reiniciar', () => { fecharM('go'); if (G.currentBlock) iniciarBloco(G.currentBlock); });
    
    on('btn-perfil', () => {
        if (G.perfilCognitivo) {
            const displayNivel = $('perfil-nivel-txt');
            const displayXP = $('perfil-acertos-display');
            const xpCalculado = (G.acertos || 0) * 150; 
            if (displayNivel) displayNivel.textContent = G.perfilCognitivo.nivel || 1;
            if (displayXP) displayXP.textContent = `${xpCalculado} XP`;

            let painelMeta = $('perfil-metacognicao-fixa');
            if (!painelMeta) {
                const modalContent = document.querySelector('#mperfil .mc');
                if (modalContent) {
                    painelMeta = document.createElement('div');
                    painelMeta.id = 'perfil-metacognicao-fixa';
                    Object.assign(painelMeta.style, { marginTop: '20px', padding: '15px', background: 'rgba(0, 234, 255, 0.05)', border: '1px dashed var(--neon-cyan, #00eaff)', borderRadius: '8px' });
                    modalContent.appendChild(painelMeta);
                }
            }

            if (painelMeta) {
                const dom = G.perfilCognitivo.perfilDominante;
                const textos = {
                    'DEPENDENTE_CONCRETO': "Você resolve bem com visuais. <br><br><b style='color:#00eaff;'>🎯 Objetivo:</b> Fortalecer a abstração.",
                    'IMPULSIVO_ARITMETICO': "Sua agilidade é boa, mas acelera demais. <br><br><b style='color:#00eaff;'>🎯 Objetivo:</b> Respirar fundo.",
                    'PROCEDURAL_MECÂNICO': "Ótima memória! <br><br><b style='color:#00eaff;'>🎯 Objetivo:</b> Focar no porquê.",
                    'CONCEITUAL_TEÓRICO': "Excelente! <br><br><b style='color:#00eaff;'>🎯 Objetivo:</b> Avançar para desafios mais abstratos."
                };
                painelMeta.innerHTML = `<h3 style="color: var(--neon-cyan, #00eaff); margin-top:0; font-size:13px; font-family: 'Orbitron', sans-serif;"><i class="fas fa-brain"></i> ESPELHO COGNITIVO</h3><p style="color: #ddd; font-size: 13px; line-height: 1.6;">${textos[dom] || "Seu padrão cognitivo ainda está sendo mapeado."}</p>`;
            }
        }
        abrirM('mperfil');
    });
    
    document.querySelectorAll('.mx').forEach(btn => btn.onclick = (e) => e.target.closest('.modal').classList.remove('active'));
    document.querySelectorAll('[data-action="seletor"]').forEach(btn => btn.onclick = () => { fecharM('go'); mostrarSeletorBlocos(); });
    [1,2,3,4,5,6,7].forEach(i => on(`btn-bloco-${i}`, () => iniciarBloco(i)));

    document.addEventListener('keydown', (e) => {
        if (!e.altKey) return;
        if (e.key.toLowerCase() === 'p') { /* Lógica Modal Docente */ }
        if (e.key.toLowerCase() === 'j') abrirM('modal-glossario-xai');
        if (e.key.toLowerCase() === 'r') { /* Lógica Replay */ }
    });
});
