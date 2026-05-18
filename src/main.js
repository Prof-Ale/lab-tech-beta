/**
 * src/main.js — CONFIGURAÇÃO DE ROTAS DE IMPORTAÇÃO (v15.0 MASTER)
 * Correção estrita de caminhos para resolução dos erros 404 do ecossistema.
 */

// ⚙️ 1. ESTADO GLOBAL E MOTORES DE JOGO
import { G } from './engine/gameState.js';
import { initDebugMode } from './engine/debugMode.js';

// 🧠 2. O CÉREBRO DA ADA (Camada Core Pedagógica)
import { QuestionNormalizer } from './core/ada/QuestionNormalizer.js';
import { DiagnosticEngine } from './core/ada/DiagnosticEngine.js';
import { ProfileEngine } from './core/ada/ProfileEngine.js';
import { AdaptiveSelector } from './core/ada/AdaptiveSelector.js';
import { LearningAnalytics } from './core/ada/LearningAnalytics.js';
import { AdaptiveAudioEngine } from './core/ada/AdaptiveAudioEngine.js';

// 📺 3. CAMADA DE INTERFACE E RENDERIZAÇÃO GRÁFICA (Substitui o antigo game-engine.js)
import { CanvasRenderer } from './ui/canvasRenderer.js';
import { updHUD, narrarContexto, toggleVoz, exibirGameOver } from './ui/uiManager.js';

// Auxiliares de manipulação de DOM de escopo local
const $ = (id) => document.getElementById(id);
const on = (id, fn) => { const el = $(id); if (el) el.onclick = fn; };
const abrirM = (id) => $(id)?.classList.add('active');
const fecharM = (id) => $(id)?.classList.remove('active');

/**
 * Executa a atualização completa do painel estatístico e telemetria da BNCC
 */
function atualizarDashboard() {
    const content = $('dash-content');
    if (!content) return;
    
    if (!G.historico || Object.keys(G.historico).length === 0) {
        content.innerHTML = "<p style='text-align:center; opacity:0.5; padding:20px;'>Aguardando coleta de dados de sensores cognitivos...</p>";
        return;
    }

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
    
    // Inicializa o histórico se inexistente
    if (!G.historico) G.historico = {};

    // Carga via Engine de Perfil Cognitivo Histórico-Cultural
    G.perfilCognitivo = ProfileEngine.carregarPerfil(G.nome, G.turma);

    // Inicialização da camada de explicabilidade algorítmica da ADA
    if (!G.diagnosticoADA) {
        G.diagnosticoADA = DiagnosticEngine.inicializarLogADA();
    }

    AudioCtrl.init();
    AudioCtrl.play();

    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
    $('block-selector')?.classList.remove('hidden');
    $('ada-command-post')?.classList.remove('active'); 

    const msgBoasVindas = G.perfilCognitivo.novoUsuario
        ? `Olá, ${G.nome}. Detectei que esta é sua primeira calibração lógica no LabTech. Eu sou a ADA. Vamos mapear sua estrutura conceitual.`
        : `Bem-vindo de volta ao ecossistema, ${G.nome}. Seu perfil da turma ${G.turma} foi restaurado. Pronto para expandir sua Zona de Desenvolvimento Proximal?`;
    
    narrarContexto(msgBoasVindas, true);
}

/**
 * Configura as variáveis de controle e inicia um módulo específico de aprendizagem
 * @param {number|string} id - Identificador do bloco/módulo
 */
function iniciarBloco(id) {
    G.currentBlock = id;
    G.vida = 100;
    G.acertos = 0;
    G.combo = 0;
    G.tempoInicialQuestao = Date.now(); // Marca temporal atômica para telemetria de latência
    
    AdaptiveSelector.limparHistoricoSessao();

    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
    $('game-screen')?.classList.remove('hidden');
    $('ada-command-post')?.classList.add('active');
    
    atualizarHudVisual();
    proximaQ();
}

/**
 * Sincroniza os dados internos do motor de jogo com os elementos de UI/UX pedagógicos
 */
function atualizarHudVisual() {
    const barraVida = $('fv');
    if (barraVida) {
        barraVida.style.width = `${G.vida}%`;
        barraVida.style.background = G.vida < 30 ? "var(--neon-red)" : "var(--neon-green)";
    }
    if ($('tnv')) $('tnv').textContent = G.combo > 0 ? G.combo : "1";
    
    if (G.perfilCognitivo) {
        if ($('perfil-nome-display')) {
            $('perfil-nome-display').textContent = `Nível ${G.perfilCognitivo.nivel || 1} | ${G.nome}`;
        }
        if ($('perfil-nivel-txt')) {
            $('perfil-nivel-txt').textContent = G.perfilCognitivo.nivel || 1;
        }
        if ($('perfil-acertos-display')) {
            $('perfil-acertos-display').textContent = `${G.perfilCognitivo.xp || 0} XP`;
        }
    }
    updHUD();
}
    
/**
 * PIPELINE ASSÍNCRONO DE INTERVENÇÃO E MEDIAÇÃO COGNITIVA (O MAESTRO)
 * Gerencia o processamento das respostas atuando diretamente na ZDP do estudante.
 * @param {Object} alt - Alternativa selecionada pelo estudante
 * @param {Object} q - Sensor Cognitivo (Item/Questão corrente)
 */
async function processarResposta(alt, q) {
    if (G.respondeu) return;
    G.respondeu = true;

    // Cálculo da latência de resposta puramente focado em controle de impulsividade
    const latenciaSessao = (Date.now() - G.tempoInicialQuestao) / 1000;

    const pontoA = parseFloat(String(q.a || q.inicio || q.valorInicial).replace(/[^\d.-]/g, '')) || 0;
    const pontoB = parseFloat(String(alt.valor).replace(/[^\d.-]/g, '')) || 0;
    const deslocamento = pontoB - pontoA;
    
    // Delegação da análise semiótica do erro para o Diagnostic Engine
    const analise = DiagnosticEngine.analisarAlternativa(alt);
    const hab = q.bncc || q.habilidade || "Geral";

    // Inicialização segura de buffers estatísticos de controle curricular
    if (!G.historico[hab]) {
        G.historico[hab] = { acertos: 0, erros_conceito: 0, erros_calculo: 0 };
    }

    // Travamento visual das alternativas pós-submissão
    document.querySelectorAll('.ba').forEach(b => {
        b.classList.add('dis'); 
        if (String(b.textContent) === String(q.res)) b.classList.add('ok');
        if (String(b.textContent) === String(alt.valor) && !analise.correto) b.classList.add('no');
    });

    if (analise.correto) {
        G.acertos++; 
        G.combo++;
        G.historico[hab].acertos++;
        
        // Processamento de progressão conceitual por Mastery Learning
        ProfileEngine.computarProgressoSucesso(G.perfilCognitivo, G.combo, (msg) => {
            narrarContexto(msg, true);
        });
    } else {
        G.combo = 0;
        // Registro etiológico do desvio conceitual
        DiagnosticEngine.registrarErro(G, analise, q);
        
        // Redução proporcional de estabilidade estrutural (vida do reator)
        const penalidadeDano = 10 + (analise.peso || 1) * 5;
        G.vida = Math.max(0, G.vida - penalidadeDano);
    }

    // Registra a série temporal de interações para o acompanhamento longitudinal
    ProfileEngine.registrarEvolucaoLongitudinal(G, analise, q, latenciaSessao);
    
    // Atualiza HUD e emite feedback semiótico contextualizado
    atualizarHudVisual(); 
    const feedbackTexto = analise.correto ? q.passo : (q.dica || analise.descricao);
    narrarContexto(feedbackTexto, analise.correto);

    // ADA seleciona dinamicamente a representação semiótica ideal para o reator gráfico
    const modoRepresentacao = AdaptiveSelector.determinarRepresentacaoInterface(G.perfilCognitivo, G.combo, q.representacao);

    // Ativação do motor de renderização matemática baseada no Canvas
    await animarArcos(q, deslocamento, modoRepresentacao);

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
    setAnimando(false);

    const fbContainer = $('fb');
    if (fbContainer) {
        fbContainer.textContent = '';
        fbContainer.style.display = 'none';
    }

    // ADA calcula o próximo item ótimo com base na distância da ZDP atual
    const q = AdaptiveSelector.selecionarProximaQuestao(G.currentBlock, G.perfilCognitivo);
    if (!q) return;

    // Dispara gatilho preditivo de microintervenção preventiva se risco for computado
    const alertaPrevio = AdaptiveSelector.gerarMicroIntervencao(q, G.perfilCognitivo);
    if (alertaPrevio) {
        console.log("🔮 [XAI PREDITIVA] ADA detectou barreira epistemológica iminente. Injetando Scaffold preventivo.");
        narrarContexto(alertaPrevio, false); 
    }

    // Reinicia o relógio atômico para o cálculo preciso de latência do novo sensor
    G.tempoInicialQuestao = Date.now();
    renderQ(q);
}

/**
 * Renderiza o Sensor Cognitivo na tela, injetando as representações visuais DUA e alternativas
 * @param {Object} q - Objeto estruturado do sensor cognitivo (questão)
 */
function renderQ(q) {
    if ($('conta-display')) $('conta-display').textContent = q.display;
    
    const grid = $('grid-botoes');
    if (grid) grid.innerHTML = '';
    $('btn-prox')?.classList.add('hidden');
    
    const modoRepresentacao = AdaptiveSelector.determinarRepresentacaoInterface(G.perfilCognitivo, G.combo, q.representacao);

    // Renderização do Canvas Gráfico Pedagógico
    renderCv(q, null, modoRepresentacao);

    // Quebra do viés de memorização por posição posicional via desordem estocástica (Shuffle)
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
    console.log("🚀 [SISTEMA] Iniciando ignição e setup do motor LabTech...");
    
    try {
        const banco = await AdaptiveSelector.carregarBancoDeQuestoes(); 
        console.log("✅ [SISTEMA] Banco de dados instanciado com sucesso na memória.");
        
        // 🛡️ SHIELD DE GOVERNANÇA: Auditoria compulsória estrutural do Data Quality dos Sensores
        GovernanceLayer.validarBancoCompleto(banco);
        
    } catch (e) {
        console.error("❌ [SISTEMA CRÍTICO] Falha catastrófica na validação estrutural do banco:", e);
    }

    initDebugMode();
  
    // Configurações de bindings de ações de interface
    on('btn-acessar', mostrarSeletorBlocos);
    [1,2,3,4,5,6,7].forEach(i => on(`btn-bloco-${i}`, () => iniciarBloco(i)));
    
    on('btn-prox', proximaQ);
    on('btn-musica', () => AudioCtrl.toggle('btn-musica', 'tsom'));
      
    on('btn-voz', () => {
        toggleVoz();
        if ($('tvoz')) $('tvoz').textContent = G.voz ? "ON" : "OFF";
    });

    // ─── ATALHO INTEGRADO DOCENTE: MAPA CLÍNICO COGNITIVO (Alt + P) ───
    document.addEventListener('keydown', (e) => {
        if (e.altKey && e.key.toLowerCase() === 'p') {
            if (!G.perfilCognitivo) {
                alert("Nenhum registro ativo de estudante na sessão corrente para análise clínica.");
                return;
            }
            DiagnosticEngine.gerarPainelProfessor(G, ProfileEngine.extrairRelatorioProfessor);
        }
    });
  
    on('btn-perfil', () => {
        if ($('perfil-nome-display')) $('perfil-nome-display').textContent = `${G.nome} | ${G.turma}`;
        if ($('perfil-acertos-display')) $('perfil-acertos-display').textContent = G.acertos;
        if ($('perfil-vida-display')) $('perfil-vida-display').textContent = Math.round(G.vida);
        abrirM('mperfil');
    });
    
    on('btn-dash', () => {
        atualizarDashboard();
        abrirM('mdash');
    });
    
    on('btn-cred', () => abrirM('mcred'));
    
    on('btn-reiniciar', () => {
        fecharM('go'); 
        if (G.currentBlock) {
            console.log(`[SISTEMA] Reinicializando Módulo Adaptativo ${G.currentBlock} por falha estrutural.`);
            iniciarBloco(G.currentBlock); 
        }
    });
    
    document.querySelectorAll('.mx').forEach(btn => {
        btn.onclick = (e) => e.target.closest('.modal').classList.remove('active');
    });

    document.querySelectorAll('[data-action="seletor"]').forEach(el => {
        el.onclick = () => {
            fecharM('go');
            fecharM('mperfil');
            document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
            $('block-selector')?.classList.remove('hidden');
            $('ada-command-post')?.classList.remove('active');
        };
    });
});
