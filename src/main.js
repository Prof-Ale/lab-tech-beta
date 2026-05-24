/**
 * src/main.js — MESTRE DE ORQUESTRAÇÃO (RESTAURADO COMPLETO + VAR PEDAGÓGICO + VALIDATOR ENGINE)
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

// --- FUNÇÕES DE DASHBOARD E LOGIN ---
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

// --- FUNÇÕES DE DASHBOARD E LOGIN ---
function mostrarSeletorBlocos() {
    let nomeRaw = $('nome-cientista')?.value.trim() || 'Cientista Anonymous';
    let turmaRaw = $('turma-cientista')?.value.trim() || '7ºA';

    // 🛡️ CIRURGIA DE UX: Converte para "Title Case" (Primeira maiúscula, resto minúscula).
    // Ex: "ALÊ" ou "alê" viram "Alê". Isso evita que a voz soletre siglas e unifica o perfil!
    G.nome = nomeRaw.charAt(0).toUpperCase() + nomeRaw.slice(1).toLowerCase();
    G.turma = turmaRaw.toUpperCase(); // Turmas costumam ser siglas (7ºA), então fica maiúsculo
    
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

    // 🎥 INÍCIO DO GRAVADOR (VAR PEDAGÓGICO)
    if (!G.logSessao) G.logSessao = [];
    G.logSessao.push({
        questao: q.display || q.texto || "Desafio Visual",
        habilidade: hab,
        respostaDada: alt.valor,
        correto: analise.correto,
        etiologia: analise.correto ? "N/A" : (analise.categoria || "Erro Genérico"),
        latencia: latenciaSessaoMs,
        tempo: new Date().toLocaleTimeString()
    });
    // 🎥 FIM DO GRAVADOR

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

    // 🧠 INJEÇÃO DO FEEDBACK METACOGNITIVO (BLINDADA)
    try {
        const feedbackMeta = MetacognitionEngine.gerarFeedback(G.perfilCognitivo);
        if (feedbackMeta) {
            uiManager.mostrarAvisoMetacognitivo(feedbackMeta);
        }
    } catch (err) {
        console.warn("⚠️ [Metacognição] Motor isolado por falha técnica. O jogo continuará.", err);
    }

    // Feedback Visual e Atualização do HUD
    uiManager.updHUD();
    const feedbackTexto = analise.correto ? q.passo : (q.dica || analise.descricao);
    uiManager.narrarContexto(feedbackTexto, analise.correto);

    // 🚀 LIBERAÇÃO GARANTIDA DA INTERFACE (O Botão Próximo nunca mais trava)
    const fbContainer = $('fb');
    if (fbContainer) { 
        fbContainer.textContent = feedbackTexto; 
        fbContainer.style.display = 'block'; 
    }
    $('btn-prox')?.classList.remove('hidden'); // Botão revelado antes da animação!

    // 🎨 RENDERIZAÇÃO GRÁFICA (BLINDADA)
    try {
        const pontoA = parseFloat(String(q.a || q.inicio || q.valorInicial).replace(/[^\d.-]/g, '')) || 0;
        const pontoB = parseFloat(String(alt.valor).replace(/[^\d.-]/g, '')) || 0;
        const deslocamento = pontoB - pontoA;

        const payloadAdaptive = AdaptiveSelector.selecionarProximaTarefa(G, [q]);
        if (renderizadorGrafico) {
            await renderizadorGrafico.animarArcos(q, deslocamento, payloadAdaptive.interfaceModifiers.modoRepresentacao);
        }
    } catch (err) {
        console.warn("⚠️ [Renderização] Falha na animação vetorial, mas o jogo não vai travar:", err);
    }

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
    G.logSessao = []; // 🎥 NOVA LINHA: Zera a fita de gravação a cada novo bloco
    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
    $('game-screen')?.classList.remove('hidden');
    proximaQ();
}

// --- INITIALIZATION E BINDINGS ---
document.addEventListener('DOMContentLoaded', async () => { 
    console.log("🚀 [SISTEMA] Motor LabTech operante.");
    
    try {
        const banco = await AdaptiveSelector.carregarBancoDeQuestoes();
        console.log(`✅ [SISTEMA] Cofre de questões carregado. Total: ${banco ? banco.length : 0} itens detectados no JSON.`);
    } catch (e) {
        console.error("❌ [SISTEMA CRÍTICO] Falha no cofre:", e);
    }
    
    initDebugMode();
    
    on('btn-acessar', mostrarSeletorBlocos);
    on('btn-prox', proximaQ);
    on('btn-musica', uiManager.toggleMusica);
    on('btn-voz', uiManager.toggleVoz);
    
    // RESTAURADO: Botões do HUD do Estudante
    on('btn-cred', () => abrirM('mcred'));
    on('btn-dash', () => { atualizarDashboard(); abrirM('mdash'); });
    on('btn-reiniciar', () => { fecharM('go'); if (G.currentBlock) iniciarBloco(G.currentBlock); });
    
   // --- O ESPELHO DO ALUNO (METACOGNIÇÃO EXPLÍCITA FIXA) ---
    on('btn-perfil', () => {
        if (G.perfilCognitivo) {
            const displayNivel = $('perfil-nivel-txt');
            const displayXP = $('perfil-acertos-display');
            const xpCalculado = (G.acertos || 0) * 150; 
            if (displayNivel) displayNivel.textContent = G.perfilCognitivo.nivel || 1;
            if (displayXP) displayXP.textContent = `${xpCalculado} XP`;

            // Injeta o painel de diagnóstico metacognitivo no modal do aluno
            let painelMeta = $('perfil-metacognicao-fixa');
            if (!painelMeta) {
                const modalContent = document.querySelector('#mperfil .mc');
                if (modalContent) {
                    painelMeta = document.createElement('div');
                    painelMeta.id = 'perfil-metacognicao-fixa';
                    painelMeta.style.marginTop = '20px';
                    painelMeta.style.padding = '15px';
                    painelMeta.style.background = 'rgba(0, 234, 255, 0.05)';
                    painelMeta.style.border = '1px dashed var(--neon-cyan, #00eaff)';
                    painelMeta.style.borderRadius = '8px';
                    modalContent.appendChild(painelMeta);
                }
            }

            if (painelMeta) {
                let textoEspelho = "";
                const dom = G.perfilCognitivo.perfilDominante;
                
                if (dom === 'DEPENDENTE_CONCRETO') {
                    textoEspelho = "Você resolve muito bem os problemas quando usa representações visuais. Sua precisão costuma cair quando o visual é retirado. <br><br><b style='color:#00eaff;'>🎯 Objetivo:</b> Fortalecer a abstração e tentar imaginar a figura na mente.";
                } else if (dom === 'IMPULSIVO_ARITMETICO') {
                    textoEspelho = "Sua agilidade de cálculo é excelente! Porém, você parece acelerar demais e acabar errando por impulso. <br><br><b style='color:#00eaff;'>🎯 Objetivo:</b> Respirar fundo por 3 segundos e reler a pergunta antes de confirmar.";
                } else if (dom === 'PROCEDURAL_MECANICO') {
                    textoEspelho = "Você tem uma ótima memória para regras e fórmulas matemáticas! O desafio agora é conectar essa regra com o problema real. <br><br><b style='color:#00eaff;'>🎯 Objetivo:</b> Focar em entender o 'porquê' da questão.";
                } else if (dom === 'CONCEITUAL_TEORICO') {
                    textoEspelho = "Excelente! Sua consistência mostra um domínio profundo da lógica matemática. Você consegue adaptar seu raciocínio. <br><br><b style='color:#00eaff;'>🎯 Objetivo:</b> Manter o foco e avançar para desafios mais abstratos.";
                } else {
                    textoEspelho = "Seu padrão cognitivo ainda está sendo mapeado. <br><br><b style='color:#00eaff;'>🎯 Objetivo:</b> Continue resolvendo os desafios com atenção para a ADA revelar sua radiografia.";
                }

                painelMeta.innerHTML = `
                    <h3 style="color: var(--neon-cyan, #00eaff); margin-top:0; font-size:13px; font-family: 'Orbitron', sans-serif;"><i class="fas fa-brain"></i> ESPELHO COGNITIVO</h3>
                    <p style="color: #ddd; font-size: 13px; line-height: 1.6; margin-bottom:0; font-family: 'Nunito', sans-serif;">${textoEspelho}</p>
                `;
            }
        }
        abrirM('mperfil');
    });
    
    document.querySelectorAll('.mx').forEach(btn => {
        btn.onclick = (e) => e.target.closest('.modal').classList.remove('active');
    });

    document.querySelectorAll('[data-action="seletor"]').forEach(btn => {
        btn.onclick = () => { fecharM('go'); mostrarSeletorBlocos(); };
    });

    [1,2,3,4,5,6,7].forEach(i => on(`btn-bloco-${i}`, () => iniciarBloco(i)));

    // ATALHOS DO DOCENTE (Alt+P, Alt+J e NOVO Alt+R)
    document.addEventListener('keydown', (e) => {
        
        // 📊 ALT + P (Painel Clínico + Inference Validator Engine)
        if (e.altKey && e.key.toLowerCase() === 'p') {
            if (!G.perfilCognitivo) { alert("⚠️ Calibração pendente."); return; }
            let mDoc = $('modal-docente-xai');
            if (!mDoc) {
                mDoc = document.createElement('div'); mDoc.id = 'modal-docente-xai'; mDoc.className = 'modal';
                // AJUSTE: right mudado de 20px para 35px para liberar a barra de rolagem
                mDoc.innerHTML = `
                <div class="mc" style="max-width: 650px; border: 2px solid var(--choco-gold, #d4af37); background: #0a0a0a; position: relative; padding: 25px 20px;">
                    <button class="mx" style="position: absolute; top: 15px; right: 35px; font-size: 22px; color: #888; background: none; border: none; cursor: pointer; z-index: 1000;" onclick="document.getElementById('modal-docente-xai').classList.remove('active')">✕</button>
                    <div id="content-docente-xai" style="max-height: 70vh; overflow-y: auto; padding-right: 15px; margin-top: 10px;"></div>
                </div>`;
                document.body.appendChild(mDoc);
            }

            // Função recursiva para atualizar o painel e religar os cliques após validação/refutação
            const renderizarPainel = () => {
                $('content-docente-xai').innerHTML = LearningAnalytics.gerarPainelDocenteHTML(G.perfilCognitivo);
                
                // 🧠 Conectando os gatilhos da Inference Validator Engine
                const btnValidar = $('btn-ia-validar');
                const btnRefutar = $('btn-ia-refutar');
                
                if (btnValidar) {
                    btnValidar.onclick = () => {
                        G.perfilCognitivo.validacaoHumana = 'VALIDADO';
                        G.perfilCognitivo.confiancaDiagnostica = 99.9; // Crava a confiança da IA
                        console.log("✅ [Inference Validator] O Professor chancelou a hipótese diagnóstica da ADA.");
                        renderizarPainel(); // Recarrega o HTML interno para mostrar o selo verde
                    };
                }
                
                if (btnRefutar) {
                    btnRefutar.onclick = () => {
                        G.perfilCognitivo.validacaoHumana = 'REFUTADO';
                        G.perfilCognitivo.confiancaDiagnostica = 10.0; // Aplica punição estatística
                        console.log("❌ [Inference Validator] O Professor refutou a hipótese. ADA forçada a reiniciar calibração.");
                        renderizarPainel(); // Recarrega o HTML interno para mostrar o aviso vermelho
                    };
                }

                const btnExportXai = $('btn-export-xai-csv');
                if (btnExportXai) btnExportXai.onclick = () => LearningAnalytics.exportarCSV(G.nome, G.historico);
            };

            renderizarPainel();
            mDoc.classList.add('active');
        }

        // 📖 ALT + J (Glossário de IA)
        if (e.altKey && e.key.toLowerCase() === 'j') {
            let modalGlossario = $('modal-glossario-xai');
            if (!modalGlossario) {
                modalGlossario = document.createElement('div');
                modalGlossario.id = 'modal-glossario-xai';
                modalGlossario.className = 'modal';
                modalGlossario.innerHTML = `
                    <div class="mc" style="max-width: 650px; border: 2px solid var(--neon-cyan, #00eaff); background: #0a0a0a; text-align: left; padding: 25px; position: relative;">
                        <button class="mx" style="position: absolute; top: 15px; right: 20px; font-size: 22px; color: #888; background: none; border: none; cursor: pointer;" onclick="document.getElementById('modal-glossario-xai').classList.remove('active')">✕</button>
                        
                        <h2 style="color: var(--neon-cyan, #00eaff); text-align: center; font-family: 'Orbitron', sans-serif; margin-top: 0;">📖 GLOSSÁRIO DA I.A. (XAI)</h2>
                        <hr style="border: 1px solid #333; margin: 15px 0;">
                        
                        <div style="max-height: 60vh; overflow-y: auto; padding-right: 15px; font-family: 'Nunito', sans-serif; color: #ddd; font-size: 13px; line-height: 1.6;">
                            <h3 style="color: var(--choco-gold, #d4af37); font-size: 15px; border-bottom: 1px dashed #444; padding-bottom: 5px;">1. OS QUATRO PERFIS COGNITIVOS</h3>
                            <ul style="padding-left: 15px; margin-bottom: 20px;">
                                <li style="margin-bottom: 10px;"><b style="color:white;">CONCEITUAL TEÓRICO:</b> O aluno ideal. Compreende a regra profunda e aplica com segurança. A ADA não interfere.</li>
                                <li style="margin-bottom: 10px;"><b style="color:white;">PROCEDURAL MECÂNICO:</b> O aluno "papagaio". Acerta porque decorou a regra prática, mas não entende o porquê. A ADA força modelos visuais para ele entender a lógica.</li>
                                <li style="margin-bottom: 10px;"><b style="color:white;">DEPENDENTE CONCRETO:</b> O aluno que precisa "contar nos dedos". A ADA fornece materialização gráfica constante (frações em barra, retas).</li>
                                <li style="margin-bottom: 10px;"><b style="color:white;">IMPULSIVO ARITMÉTICO:</b> Erra por pressa. A ADA aplica "Travamento Rítmico" (microintervenções e respiração).</li>
                            </ul>

                            <h3 style="color: var(--neon-red, #ff3333); font-size: 15px; border-bottom: 1px dashed #444; padding-bottom: 5px;">2. ETIOLOGIA DO ERRO (A Raiz)</h3>
                            <p style="margin-bottom: 20px;">A ADA audita o "porquê" do erro. Exemplos: <b>Viés Aritmético</b> (soma denominadores na pressa), <b>Inversão Topológica</b> ou <b>Etiqueta Estática</b>. A intervenção muda para cada raiz.</p>

                            <h3 style="color: #00ff66; font-size: 15px; border-bottom: 1px dashed #444; padding-bottom: 5px;">3. DERIVA PEDAGÓGICA (Risco)</h3>
                            <p>É um radar de <b>0.0 a 1.0</b>. Se passar de <b>0.5</b>, o aluno está frustrado. A ADA retrocederá a dificuldade automaticamente (scaffolding regressivo).</p>
                        </div>
                    </div>
                `;
                document.body.appendChild(modalGlossario);
            }
            modalGlossario.classList.add('active');
        }

        // 🎥 ALT + R (REPLAY / VAR PEDAGÓGICO)
        if (e.altKey && e.key.toLowerCase() === 'r') {
            if (!G.logSessao || G.logSessao.length === 0) {
                alert("⚠️ Nenhuma ação gravada nesta sessão ainda.");
                return;
            }

            let mVar = $('modal-var-pedagogico');
            if (!mVar) {
                mVar = document.createElement('div'); 
                mVar.id = 'modal-var-pedagogico'; 
                mVar.className = 'modal';
                document.body.appendChild(mVar);
            }

            let htmlTimeline = '';
            G.logSessao.forEach((step, index) => {
                const cor = step.correto ? '#00ff66' : '#ff3333';
                const icone = step.correto ? '✅' : '⚠️';
                const latenciaSegundos = (step.latencia / 1000).toFixed(1);
                
                let corTempo = '#ccc';
                if (latenciaSegundos < 3.0 && !step.correto) corTempo = '#ffbb33'; 
                if (latenciaSegundos > 15.0) corTempo = '#00eaff'; 
                
                htmlTimeline += `
                    <div style="border-left: 2px solid ${cor}; padding-left: 15px; margin-bottom: 15px; position: relative;">
                        <div style="position: absolute; left: -10px; top: 0; background: #0a0a0a; font-size: 14px;">${icone}</div>
                        <div style="font-size: 11px; color: #888;">Passo ${index + 1} | ${step.tempo} | Hab: ${step.habilidade}</div>
                        <div style="font-size: 14px; color: #fff; margin: 4px 0;">Desafio: <span style="color:var(--choco-gold);">${step.questao}</span></div>
                        <div style="font-size: 12px; color: #aaa;">
                            Resposta: <b style="color: ${cor};">${step.respostaDada}</b> | 
                            Tempo: <b style="color: ${corTempo};">${latenciaSegundos}s</b>
                            ${!step.correto ? `<br><span style="color:var(--neon-red);">Causa RAIZ: ${step.etiologia}</span>` : ''}
                        </div>
                    </div>
                `;
            });

            mVar.innerHTML = `
            <div class="mc" style="max-width: 600px; border: 2px solid #00ff66; background: #0a0a0a; position: relative; padding: 25px 20px;">
                <button class="mx" style="position: absolute; top: 15px; right: 20px; font-size: 22px; color: #888; background: none; border: none; cursor: pointer; z-index: 1000;" onclick="document.getElementById('modal-var-pedagogico').classList.remove('active')">✕</button>
                <h2 style="color: #00ff66; text-align: center; font-family: 'Orbitron', sans-serif; margin-top: 0;">🎥 REPLAY DA SESSÃO</h2>
                <hr style="border: 1px solid #333; margin: 15px 0;">
                <div style="max-height: 65vh; overflow-y: auto; padding-right: 15px; text-align: left; font-family: 'Nunito', sans-serif;">
                    ${htmlTimeline}
                </div>
            </div>`;
            
            mVar.classList.add('active');
        }
    });

    console.log("🛠️ [SISTEMA] Interfaces vinculadas. Pronto para a calibração.");
});
