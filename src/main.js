/**
 * src/main.js — MESTRE DE ORQUESTRAÇÃO
 */

import { G } from './engine/gameState.js';
import { initDebugMode } from './engine/debugMode.js';
import { QuestionNormalizer } from './core/ada/QuestionNormalizer.js';
import { DiagnosticEngine } from './core/ada/DiagnosticEngine.js';
import { ProfileEngine } from './core/ada/ProfileEngine.js';
import { AdaptiveSelector } from './core/ada/AdaptiveSelector.js';
import { LearningAnalytics } from './core/ada/LearningAnalytics.js';
import { AdaptiveAudioEngine } from './core/ada/AdaptiveAudioEngine.js';
import { MetacognitionEngine } from './core/ada/MetacognitionEngine.js'; // 🧠 MOTOR METACOGNITIVO
import { CanvasRenderer } from './ui/canvasRenderer.js';
import * as uiManager from './ui/uiManager.js';

const $ = (id) => document.getElementById(id);
const on = (id, fn) => { const el = $(id); if (el) el.onclick = fn; };
const abrirM = (id) => $(id)?.classList.add('active');
const fecharM = (id) => $(id)?.classList.remove('active');

let renderizadorGrafico = null;

async function processarResposta(alt, q) {
    if (G.respondeu) return;
    G.respondeu = true;

    const latenciaSessaoMs = Date.now() - G.tempoInicialQuestao;
    const diagEngine = new DiagnosticEngine();
    const profEngine = new ProfileEngine();
    const analise = diagEngine.analisarAlternativa(alt);
    const hab = q.bncc || q.habilidade || "Geral";

    // Inicializa histórico se não existir
    if (!G.historico[hab]) {
        G.historico[hab] = { acertos: 0, erros_conceito: 0, erros_calculo: 0, desc: "Habilidade Monitorada" };
    }

    // Lógica de Pontuação e Som
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

    // Telemetria ADA e Atualização de Estado
    const payloadTelemetria = { latenciaMs: latenciaSessaoMs, totalAjustesPreConfirmacao: 1, alternativaSelecionadaId: alt.id };
    const updateResultado = profEngine.processarEventoTelemetria(`${G.nome}_${G.turma}`, payloadTelemetria, q);
    
    G.perfilCognitivo = updateResultado.perfilCompleto; 
    G.adaState.comandoInterface = updateResultado.sugestaoAcaoADA.comandoMacro;

    // 🧠 INJEÇÃO DO FEEDBACK METACOGNITIVO
    const feedbackMeta = MetacognitionEngine.gerarFeedback(G.perfilCognitivo);
    if (feedbackMeta) {
        uiManager.mostrarAvisoMetacognitivo(feedbackMeta);
    }

    // Feedback Visual
    uiManager.updHUD();
    const feedbackTexto = analise.correto ? q.passo : (q.dica || analise.descricao);
    uiManager.narrarContexto(feedbackTexto, analise.correto);

    // Renderização
    const payloadAdaptive = AdaptiveSelector.selecionarProximaTarefa(G, [q]);
    if (renderizadorGrafico) {
        await renderizadorGrafico.animarArcos(q, alt.valor - (parseFloat(q.a) || 0), payloadAdaptive.interfaceModifiers.modoRepresentacao);
    }

    const fbContainer = $('fb');
    if (fbContainer) { fbContainer.textContent = feedbackTexto; fbContainer.style.display = 'block'; }
    $('btn-prox')?.classList.remove('hidden');

    if (G.vida <= 0) setTimeout(() => uiManager.exibirGameOver(), 800);
}

// ... (Restante do seu código main.js, mantendo as ligações dos eventos no final)
