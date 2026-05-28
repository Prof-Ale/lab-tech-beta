/**
 * @fileoverview main.js — MESTRE DE ORQUESTRAÇÃO (v1.5.3.0)
 * INTEGRADO: Motor Reativo (GameState), Feedback Sonoro (ADA) e Renderização (Canvas).
 */

import { G } from './engine/gameState.js';
import { initDebugMode } from './engine/debugMode.js';
import { ProfileEngine } from './core/ada/ProfileEngine.js';
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

// --- REATIVIDADE: UI QUE ESCUTA O ESTADO ---
window.addEventListener('vida-alterada', (e) => {
    // Atualiza a barra de vida automaticamente quando G.vida mudar
    const barra = $('fv');
    if (barra) barra.style.width = `${e.detail.valor}%`;
});

// --- FUNÇÃO MOSTRAR SELETOR DE BLOCOS  ---
function mostrarSeletorBlocos() {
    let nomeRaw = $('nome-cientista')?.value.trim() || 'Cientista Anonymous';
    let turmaRaw = $('turma-cientista')?.value.trim() || '7ºA';

    G.nome = nomeRaw.charAt(0).toUpperCase() + nomeRaw.slice(1).toLowerCase();
    G.turma = turmaRaw.toUpperCase(); 
    
    // Recupera cache se existir
    const cacheBNCC = localStorage.getItem(`labtech_h_${G.nome}_${G.turma}`);
    if (cacheBNCC) {
        try { G.historico = JSON.parse(decodeURIComponent(atob(cacheBNCC))); } 
        catch (e) { G.historico = {}; }
    } else {
        G.historico = {};
    }

    const instProfile = new ProfileEngine();
    G.perfilCognitivo = instProfile.inicializarEstudante(`${G.nome}_${G.turma}`);

    // Inicializa o renderizador se ainda não estiver criado
    if (!renderizadorGrafico) {
        renderizadorGrafico = new CanvasRenderer('canvas-game'); 
    }

    // Navegação de telas
    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
    $('block-selector')?.classList.remove('hidden');
    $('ada-command-post')?.classList.add('active'); 

    const msgBoasVindas = G.perfilCognitivo.itensRespondidos === 0
        ? `Olá, ${G.nome}. Detectei que esta é sua primeira calibração no LabTech. Vamos iniciar o mapeamento.`
        : `Bem-vindo de volta, ${G.nome}. Seu perfil foi restaurado.`;
    
    if (uiManager.narrarContexto) {
        uiManager.narrarContexto(msgBoasVindas, true);
    }
}

// --- FUNÇÃO PROCESSAR RESPOSTA (JÁ EXISTENTE NO SEU ARQUIVO) ---
async function processarResposta(alt, q) {
    // ... restante do seu código

// --- FUNÇÃO PROCESSAR RESPOSTA (REFATORADA E SONIFICADA) ---
async function processarResposta(alt, q) {
    if (G.respondeu) return;
    G.respondeu = true;

    const latenciaSessaoMs = Date.now() - G.tempoInicialQuestao;
    const isAcerto = (alt.tipo === "acerto" || alt.correta === true || String(alt.valor) === String(q.res));

    // 1. LÓGICA DE PONTOS E ÁUDIO
    if (isAcerto) {
        G.acertos++; G.combo++;
        AdaptiveAudioEngine.sonarSucesso();
    } else {
        G.combo = 0; G.erros++;
        G.vida -= 15; // Aplicação da penalidade (set de G.vida dispara o evento reativo acima)
        AdaptiveAudioEngine.sonarAnomalia();
    }

    // 2. TELEMETRIA
    G.registrarInteracao(q.bncc || "Geral", isAcerto, isAcerto ? 'NULO' : 'CONCEITO', latenciaSessaoMs);
    localStorage.setItem(`labtech_h_${G.nome}_${G.turma}`, btoa(encodeURIComponent(JSON.stringify(G.historico))));

    // 3. FEEDBACK VISUAL
    uiManager.updHUD();
    const fb = $('fb');
    if (fb) {
        fb.textContent = isAcerto ? "Isso mesmo! Excelente." : (alt.descricao || "Observe a lógica com mais atenção.");
        fb.style.display = 'block';
        fb.style.borderColor = isAcerto ? '#00ff66' : '#ff3333';
        fb.style.color = isAcerto ? '#00ff66' : '#ffbb33';
    }
    $('btn-prox')?.classList.remove('hidden');

    // 4. ANIMAÇÃO E SOM DE CONCLUSÃO
    try {
        const pontoA = parseFloat(String(q.a || 0).replace(/[^\d.-]/g, ''));
        const pontoB = parseFloat(String(alt.valor || 0).replace(/[^\d.-]/g, ''));
        const pAdaptivo = AdaptiveSelector.selecionarProximaTarefa(G, [q]);
        
        if (renderizadorGrafico) {
            await renderizadorGrafico.animarArcos(q, pontoB - pontoA, pAdaptivo.interfaceModifiers.modoRepresentacao);
            // Som de conclusão disparado APENAS após a animação
            AdaptiveAudioEngine.sonarConclusao();
        }
    } catch (err) {
        console.warn("⚠️ Animação falhou:", err);
    }

    if (G.vida <= 0) setTimeout(() => uiManager.exibirGameOver(), 800);
}

// --- FLUXO DE NAVEGAÇÃO ---
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
    
    // Limpeza de modais
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
    console.log("🚀 [SISTEMA v15.3.0] Motor LabTech operante.");
    initDebugMode();
    
    // Bindings de botões
    on('btn-acessar', mostrarSeletorBlocos);
    on('btn-prox', proximaQ);
    on('btn-musica', uiManager.toggleMusica);
    on('btn-voz', uiManager.toggleVoz);
    
    const yearSpan = $('labtech-year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();
    
    // ... (restante das inicializações de modais e perfil permanecem iguais)
});

// A função mostrarSeletorBlocos e as auxiliares de modal 
// que você já tinha permanecem inalteradas, pois já estavam funcionais.
