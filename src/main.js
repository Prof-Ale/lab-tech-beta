/**
 * src/main.js — CONFIGURAÇÃO DE ROTAS DE IMPORTAÇÃO E MAESTRO (v15.0)
 * Orquestrador do fluxo cognitivo, telemetria e renderização do LabTech.
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
import { AdaptiveAudioEngine } from './core/ada/AdaptiveAudioEngine.js'; // 🎵 INJEÇÃO DO MOTOR DE ÁUDIO

// 📺 3. CAMADA DE INTERFACE E RENDERIZAÇÃO GRÁFICA
import { CanvasRenderer } from './ui/canvasRenderer.js';
import { updHUD, narrarContexto, toggleVoz, toggleMusica, exibirGameOver } from './ui/uiManager.js';

// Auxiliares de manipulação de DOM de escopo local
const $ = (id) => document.getElementById(id);
const on = (id, fn) => { const el = $(id); if (el) el.onclick = fn; };
const abrirM = (id) => $(id)?.classList.add('active');
const fecharM = (id) => $(id)?.classList.remove('active');

// Instanciação Única do Motor Gráfico 
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
    
   // Tenta puxar o histórico BNCC do HD do navegador
    const cacheBNCC = localStorage.getItem(`labtech_h_${G.nome}_${G.turma}`);
    if (cacheBNCC) {
        try { G.historico = JSON.parse(decodeURIComponent(atob(cacheBNCC))); } 
        catch (e) { G.historico = {}; }
    } else {
        G.historico = {};
    }

    // Carga via Engine de Perfil Cognitivo
    const instProfile = new ProfileEngine();
    G.perfilCognitivo = instProfile.inicializarEstudante(`${G.nome}_${G.turma}`);

    // Vinculação correta ao ID do HTML para o motor gráfico
   if (!renderizadorGrafico) {
        renderizadorGrafico = new CanvasRenderer('canvas-game'); 
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
 * Sincroniza os dados internos do motor de jogo com os elements de UI/UX
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

      // Dentro do seu main.js, na função processarResposta:

const feedbackMetacognitivo = MetacognitionEngine.gerarFeedback(updateResultado.perfilCompleto);

if (feedbackMetacognitivo) {
    // 💡 Dispara o modal ou aviso na tela do aluno
    uiManager.mostrarAvisoMetacognitivo(feedbackMetacognitivo);
}  
    }

    // Travamento visual de UX
    document.querySelectorAll('.ba').forEach(b => {
        b.classList.add('dis'); 
        if (String(b.textContent) === String(q.res)) b.classList.add('ok');
        if (String(b.textContent) === String(alt.valor) && !analise.correto) b.classList.add('no');
    });

    // ─── LÓGICA DE PONTUAÇÃO E SOM (LIMPA E CORRIGIDA) ───
    if (analise.correto) {
        G.acertos++; 
        G.combo++;
        G.historico[hab].acertos++;
        AdaptiveAudioEngine.sonarSucesso(); // 🎵 Som de Acerto!
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
        AdaptiveAudioEngine.sonarAnomalia(); // 🎵 Som de Erro!
    }

    // 💾 Grava a telemetria BNCC no HD do navegador APÓS a pontuação ser atualizada
    localStorage.setItem(`labtech_h_${G.nome}_${G.turma}`, btoa(encodeURIComponent(JSON.stringify(G.historico))));

    // 1. Processa a telemetria e altera o estado do Estudante e da ADA
    const payloadTelemetria = { latenciaMs: latenciaSessaoMs, totalAjustesPreConfirmacao: 1, alternativaSelecionadaId: alt.id };
    const updateResultado = profEngine.processarEventoTelemetria(`${G.nome}_${G.turma}`, payloadTelemetria, q);
    
    // 🚨 A CURA DO ALT+P: Sincroniza a memória global do jogo com a memória atualizada da ADA!
    G.perfilCognitivo = updateResultado.perfilCompleto; 
    
    // Atualiza globalmente as diretrizes da ADA baseadas no erro recém cometido
    G.adaState.comandoInterface = updateResultado.sugestaoAcaoADA.comandoMacro;

    // 2. Feedback Físico-Visual e Sonoro Narrativo
    atualizarHudVisual(); 
    const feedbackTexto = analise.correto ? q.passo : (q.dica || analise.descricao);
    narrarContexto(feedbackTexto, analise.correto);

    // 3. Renderização Dinâmica do Isomorfismo
    const payloadAdaptive = AdaptiveSelector.selecionarProximaTarefa(G, [q]);
    
    if (renderizadorGrafico) {
        AdaptiveAudioEngine.sonarDeslocamento(deslocamento); // 🎵 Som vetorial posicionado CORRETAMENTE aqui!
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

    const q = AdaptiveSelector.selecionarProximaQuestao(G.currentBlock, G.perfilCognitivo);
    
    if (!q) return;

    // Dispara gatilho preditivo de microintervenção se risco for computado pela ADA
    const alertaPrevio = AdaptiveSelector.gerarMicroIntervencao(q, G.perfilCognitivo);
    if (alertaPrevio) {
        console.log("🔮 [XAI PREDITIVA] ADA detectou barreira epistemológica iminente. Injetando Scaffold preventivo.");
        narrarContexto(alertaPrevio, false); 
    }
    
    G.tempoInicialQuestao = Date.now();
    renderQ(q);
}

/**
 * Renderiza o Sensor Cognitivo na tela, injetando representações DUA e alternativas
 */
function renderQ(q) {
    if ($('conta-display')) $('conta-display').textContent = q.display || "Processando análise cognitiva...";
    
    const grid = $('grid-botoes');
    if (grid) grid.innerHTML = '';
    $('btn-prox')?.classList.add('hidden');
    
    const pAdaptivo = AdaptiveSelector.selecionarProximaTarefa(G, [q]);

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
    
    try {
        const banco = await AdaptiveSelector.carregarBancoDeQuestoes(); 
        console.log(`✅ [SISTEMA] Base de dados instanciada com sucesso. Itens carregados: ${banco.length}`);
    } catch (e) {
        console.error("❌ [SISTEMA CRÍTICO] Falha na ingestão primária do cofre de questões:", e);
    }
    
    initDebugMode();
  
    on('btn-acessar', mostrarSeletorBlocos);
    [1,2,3,4,5,6,7].forEach(i => on(`btn-bloco-${i}`, () => iniciarBloco(i)));
    
    on('btn-prox', proximaQ);
    on('btn-musica', toggleMusica);
    on('btn-voz', toggleVoz);

  // ─── ATALHOS INTEGRADOS DO DOCENTE (Alt+P e Alt+J) ───
    document.addEventListener('keydown', (e) => {
        // 📊 ALT + P: PAINEL CLÍNICO VISUAL (MAPA DO ALUNO)
        if (e.altKey && e.key.toLowerCase() === 'p') {
            if (!G.perfilCognitivo) {
                alert("⚠️ Acesso Negado: Nenhum estudante calibrou o sistema.");
                return;
            }

            let modalDocente = $('modal-docente-xai');
            if (!modalDocente) {
                modalDocente = document.createElement('div');
                modalDocente.id = 'modal-docente-xai';
                modalDocente.className = 'modal'; 
                modalDocente.innerHTML = `
                    <div class="mc" style="max-width: 600px; border: 2px solid var(--choco-gold, #d4af37); background: #0a0a0a;">
                        <button class="mx" onclick="document.getElementById('modal-docente-xai').classList.remove('active')">✕</button>
                        <div id="content-docente-xai" style="max-height: 70vh; overflow-y: auto;"></div>
                    </div>
                `;
                document.body.appendChild(modalDocente);
            }

            const relatorioHTML = LearningAnalytics.gerarPainelDocenteHTML(G.perfilCognitivo);
            $('content-docente-xai').innerHTML = relatorioHTML;
            modalDocente.classList.add('active');
        }

        // 📖 ALT + J: GLOSSÁRIO DE EXPLICABILIDADE DA IA (BULA)
        if (e.altKey && e.key.toLowerCase() === 'j') {
            let modalGlossario = $('modal-glossario-xai');
            if (!modalGlossario) {
                modalGlossario = document.createElement('div');
                modalGlossario.id = 'modal-glossario-xai';
                modalGlossario.className = 'modal';
                modalGlossario.innerHTML = `
                    <div class="mc" style="max-width: 650px; border: 2px solid var(--neon-cyan, #00eaff); background: #0a0a0a; text-align: left; padding: 25px;">
                        <button class="mx" onclick="document.getElementById('modal-glossario-xai').classList.remove('active')" style="top: 10px; right: 10px;">✕</button>
                        
                        <h2 style="color: var(--neon-cyan, #00eaff); text-align: center; font-family: 'Orbitron', sans-serif; margin-top: 0;">📖 GLOSSÁRIO DA I.A. (XAI)</h2>
                        <hr style="border: 1px solid #333; margin: 15px 0;">
                        
                        <div style="max-height: 60vh; overflow-y: auto; padding-right: 15px; font-family: 'Nunito', sans-serif; color: #ddd; font-size: 13px; line-height: 1.6;">
                            
                            <h3 style="color: var(--choco-gold, #d4af37); font-size: 15px; border-bottom: 1px dashed #444; padding-bottom: 5px;">1. OS QUATRO PERFIS COGNITIVOS</h3>
                            <ul style="padding-left: 15px; margin-bottom: 20px;">
                                <li style="margin-bottom: 10px;"><b style="color:white;">CONCEITUAL TEÓRICO:</b> O aluno ideal. Compreende a regra matemática profunda e aplica com segurança. A ADA não interfere.</li>
                                <li style="margin-bottom: 10px;"><b style="color:white;">PROCEDURAL MECÂNICO:</b> O aluno "papagaio". Acerta a conta porque decorou o algoritmo (a regra prática), mas não entende o porquê da operação. A ADA força modelos visuais para ele entender a lógica.</li>
                                <li style="margin-bottom: 10px;"><b style="color:white;">DEPENDENTE CONCRETO:</b> O aluno que precisa "contar nos dedos". Não consegue abstrair. A ADA fornece materialização gráfica constante (frações em barra, retas).</li>
                                <li style="margin-bottom: 10px;"><b style="color:white;">IMPULSIVO ARITMÉTICO:</b> Responde rápido demais (latência baixa) e erra por pressa, não por falta de conhecimento. A ADA aplica "Travamento Rítmico" (microintervenções e respiração).</li>
                            </ul>

                            <h3 style="color: var(--neon-red, #ff3333); font-size: 15px; border-bottom: 1px dashed #444; padding-bottom: 5px;">2. ETIOLOGIA DO ERRO (A Raiz)</h3>
                            <p style="margin-bottom: 20px;">Em vez de dizer "errou", a ADA audita o "porquê". Exemplos: <b>Viés Aritmético</b> (somou denominadores de fração na pressa), <b>Inversão Topológica</b> (confundiu área com perímetro), ou <b>Etiqueta Estática</b> (ignorou o sinal de menos). A intervenção muda para cada raiz.</p>

                            <h3 style="color: #00ff66; font-size: 15px; border-bottom: 1px dashed #444; padding-bottom: 5px;">3. DERIVA PEDAGÓGICA (Risco)</h3>
                            <p>É um radar matemático de <b>0.0 a 1.0</b> (Distância Euclidiana). Se passar de <b>0.5</b> (em vermelho), significa que o aluno está se desviando muito da rota de aprendizagem e está frustrado. A ADA retrocederá a dificuldade automaticamente (scaffolding regressivo).</p>

                        </div>
                    </div>
                `;
                document.body.appendChild(modalGlossario);
            }

            modalGlossario.classList.add('active');
        }
    });
   
    // ─── LIGAÇÃO DOS BOTÕES LATERAIS DE INTERFACE ───
    on('btn-cred', () => { abrirM('mcred'); });
    
    // 🚨 BOTAO DO DASHBOARD REATIVADO
    on('btn-dash', () => { 
        atualizarDashboard(); 
        abrirM('mdash'); // Se o ID da sua janela modal for diferente, me avise! Geralmente é 'mdash'
    });

   
    
    on('btn-perfil', () => {
        if (G.perfilCognitivo) {
            const displayNivel = $('perfil-nivel-txt');
            const displayXP = $('perfil-acertos-display');
            
            // Simulação matemática de XP baseada nos acertos do aluno
            const xpCalculado = (G.acertos || 0) * 150; 
            
            if (displayNivel) displayNivel.textContent = G.perfilCognitivo.nivel || 1;
            if (displayXP) displayXP.textContent = `${xpCalculado} XP`;
        }
        abrirM('mperfil');
    });

    // ─── BOTÕES DE RETORNO AO MENU PRINCIPAL (SELETOR DE BLOCOS) ───
    document.querySelectorAll('[data-action="seletor"]').forEach(btn => {
        btn.onclick = () => {
            // Se o modal de Game Over estiver aberto, ele fecha
            fecharM('go'); 
            
            // Pausa qualquer som de erro/acerto que estiver tocando
            if (G.musica) {
                // Opcional: Você pode colocar uma lógica de transição de som aqui se quiser
            }

            // Volta para a tela de seleção
            mostrarSeletorBlocos();
        };
    });
    
    on('btn-reiniciar', () => {
        fecharM('go'); 
        if (G.currentBlock) iniciarBloco(G.currentBlock); 
    });
    
    document.querySelectorAll('.mx').forEach(btn => {
        btn.onclick = (e) => e.target.closest('.modal').classList.remove('active');
    });
});
