/**
 * src/main.js — CONFIGURAÇÃO DE ROTAS DE IMPORTAÇÃO E MAESTRO (v15.0)
 * Orquestrador do fluxo cognitivo, telemetria e renderização do LabTech.
 */

// ⚙️ 1. ESTADO GLOBAL E MOTORES DE JOGO
import { G } from './engine/gameState.js';
import { initDebugMode } from './engine/debugMode.js';

// 🧠 2. O CÉREBRO DA ADA (Camada Core Pedagógica)
// Usando chaves e verifique se as classes estão exportadas no arquivo de origem
import { QuestionNormalizer } from './core/ada/QuestionNormalizer.js';
import { DiagnosticEngine } from './core/ada/DiagnosticEngine.js';
import { ProfileEngine } from './core/ada/ProfileEngine.js';
import { AdaptiveSelector } from './core/ada/AdaptiveSelector.js';
import { LearningAnalytics } from './core/ada/LearningAnalytics.js';

// 📺 3. CAMADA DE INTERFACE E RENDERIZAÇÃO GRÁFICA
import { CanvasRenderer } from './ui/canvasRenderer.js';
import { updHUD, narrarContexto, toggleVoz, toggleMusica, exibirGameOver } from './ui/uiManager.js';

// Auxiliares de manipulação de DOM de escopo local
const $ = (id) => document.getElementById(id);
const on = (id, fn) => { const el = $(id); if (el) el.onclick = fn; };
const abrirM = (id) => $(id)?.classList.add('active');
const fecharM = (id) => $(id)?.classList.remove('active');

// Instanciação Única do Motor Gráfico 
// O parâmetro 'canvas' é o ID do elemento no seu index.html onde os gráficos serão desenhados
let renderizadorGrafico = null;

/**
 * Executa a atualização completa do painel estatístico e telemetria da BNCC
 */
function atualizarDashboard() {
    const content = $('dash-content');
    if (!content) return;
    
    if (!G.historico || Object.keys(G.historico).length === 0) {
        content.innerHTML = "<p style='text-align:center; opacity:0.5; padding:20px; font-family:monospace;'>Aguardando coleta de dados de sensores cognitivos...</p>";
        return;
    }

    // A classe LearningAnalytics agora possui o método exposto para gerar o HTML
    let html = LearningAnalytics.gerarHtmlDashboardBNCC(G.historico);
    content.innerHTML = html;

    const btnCsv = $('btn-export-csv');
    if (btnCsv) {
        btnCsv.onclick = () => LearningAnalytics.exportarCSV(G.nome, G.historico);
    }
}

/**
 * Inicializa a sessão do estudante na base, carregando o perfil histórico longitudinal
 */
function mostrarSeletorBlocos() {
    G.nome = $('nome-cientista')?.value.trim() || 'Cientista Anonymous';
    G.turma = $('turma-cientista')?.value.trim() || '7ºA';
    
    if (!G.historico) G.historico = {};

    // Carga via Engine de Perfil Cognitivo
    const instProfile = new ProfileEngine();
    G.perfilCognitivo = instProfile.inicializarEstudante(`${G.nome}_${G.turma}`);

    // Inicialização do motor gráfico no DOM ativo
    if (!renderizadorGrafico) {
        renderizadorGrafico = new CanvasRenderer('meuCanvasGrafico'); // ALERTA: Troque pelo ID real do seu canvas
    }

    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
    $('block-selector')?.classList.remove('hidden');
    $('ada-command-post')?.classList.remove('active'); 

    const msgBoasVindas = G.perfilCognitivo.itensRespondidos === 0
        ? `Olá, ${G.nome}. Detectei que esta é sua primeira calibração no LabTech. Vamos iniciar o mapeamento.`
        : `Bem-vindo de volta, ${G.nome}. Seu perfil foi restaurado. Pronto para expandir suas capacidades lógicas?`;
    
    narrarContexto(msgBoasVindas, true);
}

/**
 * Configura as variáveis de controle e inicia um módulo específico de aprendizagem
 */
function iniciarBloco(id) {
    G.reiniciarParaNovoBloco(id);
    
    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
    $('game-screen')?.classList.remove('hidden');
    $('ada-command-post')?.classList.add('active');
    
    atualizarHudVisual();
    proximaQ();
}

/**
 * Sincroniza os dados internos do motor de jogo com os elementos de UI/UX
 */
function atualizarHudVisual() {
    updHUD(); // Delegação limpa para o uiManager.js
    
    if (G.perfilCognitivo) {
        if ($('perfil-nome-display')) {
            $('perfil-nome-display').textContent = `Nível ${G.perfilCognitivo.nivel || 1} | ${G.nome}`;
        }
    }
}
    
/**
 * PIPELINE ASSÍNCRONO DE INTERVENÇÃO E MEDIAÇÃO COGNITIVA (O MAESTRO)
 */
async function processarResposta(alt, q) {
    if (G.respondeu) return;
    G.respondeu = true;

    // Cálculo da latência exata
    const latenciaSessaoMs = Date.now() - G.tempoInicialQuestao;

    const pontoA = parseFloat(String(q.a || q.inicio || q.valorInicial).replace(/[^\d.-]/g, '')) || 0;
    const pontoB = parseFloat(String(alt.valor).replace(/[^\d.-]/g, '')) || 0;
    const deslocamento = pontoB - pontoA;
    
    // Análise do erro e processamento de telemetria longitudinal
    const diagEngine = new DiagnosticEngine();
    const profEngine = new ProfileEngine();
    
    const analise = diagEngine.analisarAlternativa(alt);
    const hab = q.bncc || q.habilidade || "Geral";

    if (!G.historico[hab]) {
        G.historico[hab] = { acertos: 0, erros_conceito: 0, erros_calculo: 0, desc: "Habilidade Monitorada" };
    }

    // Travamento visual de UX
    document.querySelectorAll('.ba').forEach(b => {
        b.classList.add('dis'); 
        if (String(b.textContent) === String(q.res)) b.classList.add('ok');
        if (String(b.textContent) === String(alt.valor) && !analise.correto) b.classList.add('no');
    });

    if (analise.correto) {
        G.acertos++; 
        G.combo++;
        G.historico[hab].acertos++;
    } else {
        G.combo = 0;
        G.erros++;
        if (analise.categoria === 'conceito') {
            G.historico[hab].erros_conceito++;
        } else {
            G.historico[hab].erros_calculo++;
        }
        
        const penalidadeDano = 10 + (analise.peso || 1) * 5;
        G.vida = Math.max(0, G.vida - penalidadeDano);
    }

    // 1. Processa a telemetria e altera o estado do Estudante e da ADA
    const payloadTelemetria = { latenciaMs: latenciaSessaoMs, totalAjustesPreConfirmacao: 1, alternativaSelecionadaId: alt.id };
    const updateResultado = profEngine.processarEventoTelemetria(`${G.nome}_${G.turma}`, payloadTelemetria, q);
    
    // Atualiza globalmente as diretrizes da ADA baseadas no erro recém cometido
    G.adaState.comandoInterface = updateResultado.sugestaoAcaoADA.comandoMacro;

    // 2. Feedback Físico-Visual e Sonoro Narrativo
    atualizarHudVisual(); 
    const feedbackTexto = analise.correto ? q.passo : (q.dica || analise.descricao);
    narrarContexto(feedbackTexto, analise.correto);

    // 3. Renderização Dinâmica do Isomorfismo
    const adpSelector = new AdaptiveSelector();
    const payloadAdaptive = adpSelector.selecionarProximaTarefa(G, [q]);
    
    if (renderizadorGrafico) {
        await renderizadorGrafico.animarArcos(q, deslocamento, payloadAdaptive.interfaceModifiers.modoRepresentacao || 'visual');
    }

    const fbContainer = $('fb');
    if (fbContainer) {
        fbContainer.textContent = feedbackTexto;
        fbContainer.style.display = 'block';
    }

    $('btn-prox')?.classList.remove('hidden');

    if (G.vida <= 0) {
        setTimeout(() => { exibirGameOver(); }, 800);
    }
}

/**
 * Avança o pipeline de execução adaptativa para o próximo sensor cognitivo do bloco
 */
function proximaQ() {
    G.respondeu = false;

    const fbContainer = $('fb');
    if (fbContainer) {
        fbContainer.textContent = '';
        fbContainer.style.display = 'none';
    }

    // ADA calcula o próximo item ótimo baseada no erro anterior
    const adpSelector = new AdaptiveSelector();
    // Exemplo: fetch global ou catálogo injetado
    // const q = adpSelector.selecionarProximaTarefa(G, window.catalogoGlobalDeQuestoes);
    
    // [SIMULAÇÃO PARA PREVENIR ERRO] Para não quebrar por falta de banco:
    const qFicticia = { id: 'sim_1', bncc: 'simulada', representacao: 'visual', alternativas: [{valor: 'A'}, {valor: 'B'}], res: 'A' };
    
    G.tempoInicialQuestao = Date.now();
    renderQ(qFicticia);
}

/**
 * Renderiza o Sensor Cognitivo na tela, injetando representações DUA e alternativas
 */
function renderQ(q) {
    if ($('conta-display')) $('conta-display').textContent = q.display || "Processando análise cognitiva...";
    
    const grid = $('grid-botoes');
    if (grid) grid.innerHTML = '';
    $('btn-prox')?.classList.add('hidden');
    
    const adpSelector = new AdaptiveSelector();
    const pAdaptivo = adpSelector.selecionarProximaTarefa(G, [q]);

    if (renderizadorGrafico) {
        renderizadorGrafico.renderCv(q, null, pAdaptivo.interfaceModifiers.modoRepresentacao || 'visual');
    }

    const alternativas = [...(q.alternativas || [])].sort(() => Math.random() - 0.5);

    alternativas.forEach(alt => {
        const b = document.createElement('button');
        b.className = 'ba';
        b.textContent = alt.valor;
        b.onclick = (e) => {
            e.preventDefault();
            processarResposta(alt, q);
        };
        grid?.appendChild(b);
    });
}

/**
 * Inicialização e ligação estrutural dos manipuladores de eventos globais
 */
document.addEventListener('DOMContentLoaded', async () => { 
    console.log("🚀 [SISTEMA] Iniciando ignição e setup do motor LabTech (Arquitetura Modular)...");
    
    initDebugMode();
  
    on('btn-acessar', mostrarSeletorBlocos);
    [1,2,3,4,5,6,7].forEach(i => on(`btn-bloco-${i}`, () => iniciarBloco(i)));
    
    on('btn-prox', proximaQ);
    on('btn-musica', toggleMusica);
    on('btn-voz', toggleVoz);

    document.addEventListener('keydown', (e) => {
        if (e.altKey && e.key.toLowerCase() === 'p') {
            alert("Painel Docente de Explicabilidade em Construção. (Modulo Alt+P)");
        }
    });
  
    on('btn-dash', () => {
        atualizarDashboard();
        abrirM('mdash');
    });
    
    on('btn-reiniciar', () => {
        fecharM('go'); 
        if (G.currentBlock) iniciarBloco(G.currentBlock); 
    });
    
    document.querySelectorAll('.mx').forEach(btn => {
        btn.onclick = (e) => e.target.closest('.modal').classList.remove('active');
    });
});
