/**
 * src/main.js — MESTRE DE ORQUESTRAÇÃO (RECONSTRUÍDO V2)
 */

import { G } from './engine/gameState.js';
import { initDebugMode } from './engine/debugMode.js';
import { QuestionNormalizer } from './core/ada/QuestionNormalizer.js';
import { DiagnosticEngine } from './core/ada/DiagnosticEngine.js';
import { ProfileEngine } from './core/ada/ProfileEngine.js';
import { AdaptiveSelector } from './core/ada/AdaptiveSelector.js';
import { LearningAnalytics } from './core/ada/LearningAnalytics.js';
import { AdaptiveAudioEngine } from './core/ada/AdaptiveAudioEngine.js';
import { MetacognitionEngine } from './core/ada/MetacognitionEngine.js';
import { CanvasRenderer } from './ui/canvasRenderer.js';
import * as uiManager from './ui/uiManager.js';

const $ = (id) => document.getElementById(id);
const on = (id, fn) => { const el = $(id); if (el) el.onclick = fn; };
const abrirM = (id) => $(id)?.classList.add('active');
const fecharM = (id) => $(id)?.classList.remove('active');

let renderizadorGrafico = null;

// --- FUNÇÕES DE DASHBOARD E LOGIN (RECUPERADAS) ---
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

function mostrarSeletorBlocos() {
    G.nome = $('nome-cientista')?.value.trim() || 'Cientista Anonymous';
    G.turma = $('turma-cientista')?.value.trim() || '7ºA';
    
    const cacheBNCC = localStorage.getItem(`labtech_h_${G.nome}_${G.turma}`);
    if (cacheBNCC) {
        try { G.historico = JSON.parse(decodeURIComponent(atob(cacheBNCC))); } 
        catch (e) { G.historico = {}; }
    } else {
        G.historico = {};
    }

    const instProfile = new ProfileEngine();
    G.perfilCognitivo = instProfile.inicializarEstudante(`${G.nome}_${G.turma}`);

    if (!renderizadorGrafico) {
        renderizadorGrafico = new CanvasRenderer('canvas-game'); 
    }

    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
    $('block-selector')?.classList.remove('hidden');
    $('ada-command-post')?.classList.remove('active'); 

    const msgBoasVindas = G.perfilCognitivo.itensRespondidos === 0
        ? `Olá, ${G.nome}. Detectei que esta é sua primeira calibração no LabTech. Vamos iniciar o mapeamento.`
        : `Bem-vindo de volta, ${G.nome}. Seu perfil foi restaurado.`;
    
    uiManager.narrarContexto(msgBoasVindas, true);
}


// --- FUNÇÃO PROCESSAR RESPOSTA ---
async function processarResposta(alt, q) {
    if (G.respondeu) return;
    G.respondeu = true;

    const latenciaSessaoMs = Date.now() - G.tempoInicialQuestao;
    const diagEngine = new DiagnosticEngine();
    const profEngine = new ProfileEngine();
    const analise = diagEngine.analisarAlternativa(alt);
    const hab = q.bncc || q.habilidade || "Geral";

    if (!G.historico[hab]) {
        G.historico[hab] = { acertos: 0, erros_conceito: 0, erros_calculo: 0, desc: "Habilidade Monitorada" };
    }

    if (analise.correto) {
        G.acertos++; G.combo++;
        G.historico[hab].acertos++;
        AdaptiveAudioEngine.sonarSucesso();
    } else {
        G.combo = 0; G.erros++;
        if (analise.categoria === 'conceito') G.historico[hab].erros_conceito++;
        else G.historico[hab].erros_calculo++;
        G.vida = Math.max(0, G.vida - (10 + (analise.peso || 1) * 5));
        AdaptiveAudioEngine.sonarAnomalia();
    }

    localStorage.setItem(`labtech_h_${G.nome}_${G.turma}`, btoa(encodeURIComponent(JSON.stringify(G.historico))));

    const payloadTelemetria = { latenciaMs: latenciaSessaoMs, totalAjustesPreConfirmacao: 1, alternativaSelecionadaId: alt.id };
    const updateResultado = profEngine.processarEventoTelemetria(`${G.nome}_${G.turma}`, payloadTelemetria, q);
    
    G.perfilCognitivo = updateResultado.perfilCompleto; 
    G.adaState.comandoInterface = updateResultado.sugestaoAcaoADA.comandoMacro;

    const feedbackMeta = MetacognitionEngine.gerarFeedback(G.perfilCognitivo);
    if (feedbackMeta) uiManager.mostrarAvisoMetacognitivo(feedbackMeta);

    uiManager.updHUD();
    const feedbackTexto = analise.correto ? q.passo : (q.dica || analise.descricao);
    uiManager.narrarContexto(feedbackTexto, analise.correto);

    // 🛡️ MATEMÁTICA DEFENSIVA INJETADA AQUI:
    // Extrai apenas os números da pergunta e da resposta, ignorando textos.
    const pontoA = parseFloat(String(q.a || q.inicio || q.valorInicial).replace(/[^\d.-]/g, '')) || 0;
    const pontoB = parseFloat(String(alt.valor).replace(/[^\d.-]/g, '')) || 0;
    const deslocamento = pontoB - pontoA;

    const payloadAdaptive = AdaptiveSelector.selecionarProximaTarefa(G, [q]);
    if (renderizadorGrafico) {
        // Agora usamos a variável 'deslocamento' limpa, evitando o NaN
        await renderizadorGrafico.animarArcos(q, deslocamento, payloadAdaptive.interfaceModifiers.modoRepresentacao);
    }

    const fbContainer = $('fb');
    if (fbContainer) { fbContainer.textContent = feedbackTexto; fbContainer.style.display = 'block'; }
    $('btn-prox')?.classList.remove('hidden');

    if (G.vida <= 0) setTimeout(() => uiManager.exibirGameOver(), 800);
}

// --- FUNÇÕES DE NAVEGAÇÃO E SETUP ---
function proximaQ() {
    G.respondeu = false;
    $('fb').style.display = 'none';
    const q = AdaptiveSelector.selecionarProximaQuestao(G.currentBlock, G.perfilCognitivo);
    if (!q) return;
    
    const alerta = AdaptiveSelector.gerarMicroIntervencao(q, G.perfilCognitivo);
    if (alerta) uiManager.narrarContexto(alerta, false);
    
    G.tempoInicialQuestao = Date.now();
    renderQ(q);
}

function renderQ(q) {
    $('conta-display').textContent = q.display;
    $('grid-botoes').innerHTML = '';
    $('btn-prox')?.classList.add('hidden');
    
    const pAdaptivo = AdaptiveSelector.selecionarProximaTarefa(G, [q]);
    renderizadorGrafico?.renderCv(q, null, pAdaptivo.interfaceModifiers.modoRepresentacao);

    q.alternativas.sort(() => Math.random() - 0.5).forEach(alt => {
        const b = document.createElement('button');
        b.className = 'ba';
        b.textContent = alt.valor;
        b.onclick = () => processarResposta(alt, q);
        $('grid-botoes').appendChild(b);
    });
}

function iniciarBloco(id) {
    G.reiniciarParaNovoBloco(id);
    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
    $('game-screen')?.classList.remove('hidden');
    proximaQ();
}

// --- INITIALIZATION E BINDINGS ---
document.addEventListener('DOMContentLoaded', async () => { 
    console.log("🚀 [SISTEMA] Motor LabTech operante.");
    
    try {
        await AdaptiveSelector.carregarBancoDeQuestoes();
        console.log(`✅ [SISTEMA] Cofre de questões carregado.`);
    } catch (e) {
        console.error("❌ [SISTEMA CRÍTICO] Falha no cofre:", e);
    }
    
    initDebugMode();
    
    // Liga os botões de controle principal
    on('btn-acessar', mostrarSeletorBlocos);
    on('btn-prox', proximaQ);
    on('btn-musica', uiManager.toggleMusica);
    on('btn-voz', uiManager.toggleVoz);
    
    // Liga os botões de interface e modais
    on('btn-cred', () => abrirM('mcred'));
    on('btn-dash', () => { atualizarDashboard(); abrirM('mdash'); });
    on('btn-reiniciar', () => { fecharM('go'); if (G.currentBlock) iniciarBloco(G.currentBlock); });
    
    document.querySelectorAll('.mx').forEach(btn => {
        btn.onclick = (e) => e.target.closest('.modal').classList.remove('active');
    });

    document.querySelectorAll('[data-action="seletor"]').forEach(btn => {
        btn.onclick = () => { fecharM('go'); mostrarSeletorBlocos(); };
    });

    // Liga os botões de bloco (do 1 ao 7)
    [1,2,3,4,5,6,7].forEach(i => on(`btn-bloco-${i}`, () => iniciarBloco(i)));

    // ATALHOS DO DOCENTE (Alt+P e Alt+J)
    document.addEventListener('keydown', (e) => {
        if (e.altKey && e.key.toLowerCase() === 'p') {
            if (!G.perfilCognitivo) { alert("⚠️ Calibração pendente."); return; }
            let mDoc = $('modal-docente-xai');
            if (!mDoc) {
                mDoc = document.createElement('div'); mDoc.id = 'modal-docente-xai'; mDoc.className = 'modal';
                mDoc.innerHTML = `<div class="mc" style="max-width: 600px; border: 2px solid var(--choco-gold, #d4af37); background: #0a0a0a;"><button class="mx" onclick="document.getElementById('modal-docente-xai').classList.remove('active')">✕</button><div id="content-docente-xai" style="max-height: 70vh; overflow-y: auto;"></div></div>`;
                document.body.appendChild(mDoc);
            }
            $('content-docente-xai').innerHTML = LearningAnalytics.gerarPainelDocenteHTML(G.perfilCognitivo);
            mDoc.classList.add('active');
        }
    });

    console.log("🛠️ [SISTEMA] Interfaces vinculadas. Pronto para a calibração.");
});
