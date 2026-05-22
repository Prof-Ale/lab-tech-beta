/**
 * src/main.js — MESTRE DE ORQUESTRAÇÃO (RECONSTRUÍDO)
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

// --- FUNÇÃO PROCESSAR RESPOSTA (A QUE VOCÊ JÁ TINHA) ---
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

    const payloadAdaptive = AdaptiveSelector.selecionarProximaTarefa(G, [q]);
    if (renderizadorGrafico) {
        await renderizadorGrafico.animarArcos(q, alt.valor - (parseFloat(q.a) || 0), payloadAdaptive.interfaceModifiers.modoRepresentacao);
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

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', async () => {
    console.log("🚀 LabTech Reiniciado com sucesso.");
    await AdaptiveSelector.carregarBancoDeQuestoes();
    initDebugMode();
    on('btn-acessar', () => { /* lógica de login */ });
    on('btn-prox', proximaQ);
    // Adicione os outros listeners conforme seu layout
});
