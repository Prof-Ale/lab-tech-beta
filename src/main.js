/**
 * @fileoverview main.js — MESTRE DE ORQUESTRAÇÃO (v1.6.5 - CONEXÃO TOTAL)
 * CIRURGIA DE COUPLING: Conexão síncrona do DiagnosticEngine real, eliminação 
 * definitiva do laudo simulado e amarração estrita das assinaturas do seletor.
 * @package LabTech Core Environment
 */

import { G } from './engine/gameState.js';
import { initDebugMode } from './engine/debugMode.js';
import { ProfileEngine } from './core/ada/ProfileEngine.js';
import { DiagnosticEngine } from './core/ada/DiagnosticEngine.js'; // 💉 INJEÇÃO OBRIGATÓRIA
import { MetacognitionEngine } from './core/ada/MetacognitionEngine.js';
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

// ⚡ VETORES DE CONTROLE CLÍNICO DE SESSÃO (PRODUÇÃO STI)
let ultimoLaudoRealADA = null;
let questaoAtivaNoCanvas = null;

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

    // Instanciação Global dos Motores Unificados (Consumindo a Ontologia do Objeto window)
    G.motorPerfil = new ProfileEngine(window.familyRegistry || {}); 
    G.motorDiagnostico = new DiagnosticEngine(window.familyRegistry || {}); // 🧠 CONEXÃO FIXADA DO MOTOR REAL
    
    G.perfilCognitivo = G.motorPerfil.inicializarEstudante(`${G.nome}_${G.turma}`);

    if (!renderizadorGrafico) renderizadorGrafico = new CanvasRenderer('canvas-game'); 

    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
    $('block-selector')?.classList.remove('hidden');
    $('ada-command-post')?.classList.add('active'); 

    const msg = G.perfilCognitivo.itensRespondidos === 0 ? `Olá, ${G.nome}. Iniciando mapeamento.` : `Bem-vindo de volta, ${G.nome}.`;
    if (uiManager.narrarContexto) {
        uiManager.narrarContexto(msg, true).catch(e => console.warn("TTS Bypass:", e));
    }
}

// --- CORE: PROCESSAR RESPOSTA (PIPELINE REAL DE ARBITRAGEM SÍNCRONA) ---
async function processarResposta(alt, q) {
    if (G.respondeu) return;
    G.respondeu = true;

    const latenciaSessaoMs = Date.now() - G.tempoInicialQuestao;
    const isAcerto = (alt.tipo === "acerto" || alt.correta === true || String(alt.valor) === String(q.res));
    
    // Extrai a ID da família de forma segura, blindando fallbacks
    const familiaIdActiva = q.familiaInvarianteId || q.familia_alvo || q.familiaAlvo || "GERAL";

    // =========================================================================
    // 🩸 PASSO 1: DIAGNÓSTICO COGNITIVO ATÓMICO REAL (ABANDONO DA SIMULAÇÃO)
    // =========================================================================
    if (G.motorDiagnostico) {
        ultimoLaudoRealADA = G.motorDiagnostico.analisarAlternativa(alt, familiaIdActiva, G.perfilCognitivo);
    } else {
        console.error("[ADA CRITICAL] Motor de diagnóstico indisponível. Ativando escape.");
        ultimoLaudoRealADA = { correto: isAcerto, planoDeMediacao: { choqueSemioticoRecomendado: false } };
    }

    // Guardamos o rastro físico imutável para a computação semiótica da próxima rodada
    window.__QUESTAO_ORIGEM_CHOQUE__ = JSON.parse(JSON.stringify(q));

    // ==========================================
    // 1. REAÇÃO DE INTERFACE E DISPARO DE ÁUDIO
    // ==========================================
    uiManager.updHUD();
    const fb = $('fb');
    if (fb) {
        fb.textContent = isAcerto ? "Isso mesmo! Excelente." : (alt.descricao || "Observe a lógica com mais atenção.");
        fb.style.display = 'block';
        fb.style.borderColor = isAcerto ? '#00ff66' : '#ff3333';
        fb.style.color = isAcerto ? '#00ff66' : '#ffbb33';
    }

    const dicaLimpa = String(q.dica || q.passo || q.exp || '').replace(/<[^>]*>?/gm, '');
    const feedbackADA = isAcerto
        ? `Muito bem, ${G.nome || 'cientista'}! ${q.passo || q.exp || 'Sua linha de raciocínio está correta.'}`
        : `Calma, ${G.nome || 'cientista'}. ${alt.descricao || 'Essa estratégia não funcionou agora.'} ${dicaLimpa ? `Pense nisto: ${dicaLimpa}` : 'Respire fundo e observe os dados antes de continuar.'}`;

    if (typeof uiManager.narrarContexto === 'function') {
        uiManager.narrarContexto(feedbackADA, isAcerto).catch(e => console.warn("Narração ADA bypass:", e));
    }

    if (isAcerto) {
        G.acertos++; G.combo++;
        try { AdaptiveAudioEngine.sonarSucesso(); } catch (e) {}
    } else {
        G.combo = 0; G.erros++; 
        G.vida = Math.max(0, G.vida - 15);
        try { AdaptiveAudioEngine.sonarAnomalia(); } catch (e) {}
    }

    // =========================================================
    // 2. REGISTRO LONGITUDINAL E COMPUTAÇÃO DE VARIÁVEIS NO PERFIL
    // =========================================================
    const etiologiaMapeada = (alt.misconception || alt.erro || 'ERRO_GENERICO').toUpperCase();
    G.registrarInteracao(q.bncc || "Geral", isAcerto, isAcerto ? 'NULO' : etiologiaMapeada, latenciaSessaoMs);

    try {
        if (G.motorPerfil) {
            const dadosTelemetria = {
                latenciaMs: latenciaSessaoMs,
                alternativaSelecionadaId: alt.id_alternativa || alt.id || alt.valor,
                foiCorreto: isAcerto
            };
            
            // Envelopa metadados garantindo compatibilidade estrita com as propriedades que alimentam o ITC
            const metadadosSensorEnvelopados = {
                ...q,
                familiaAlvo: familiaIdActiva,
                contextoADA: {
                    representacaoOriginal: (q.representacaoPrincipal || 'VISUAL').toUpperCase(),
                    representacaoForcada: ultimoLaudoRealADA.planoDeMediacao?.representacaoPreferencial || (q.representacaoPrincipal || 'VISUAL').toUpperCase(),
                    foiChoqueSemiotico: !!ultimoLaudoRealADA.planoDeMediacao?.choqueSemioticoRecomendado
                }
            };
            
            const atualizacao = G.motorPerfil.processarEventoTelemetria(
                `${G.nome}_${G.turma}`, 
                dadosTelemetria, 
                metadadosSensorEnvelopados
            );
            
            if (atualizacao?.perfilCompleto) {
                G.perfilCognitivo = atualizacao.perfilCompleto;
            }
        }
    } catch (e) {
        console.warn("⚠️ Falha ao computar telemetria no ProfileEngine:", e);
    }

    localStorage.setItem(`labtech_h_${G.nome}_${G.turma}`, btoa(encodeURIComponent(JSON.stringify(G.historico))));

    // ==========================================
    // 3. METACOGNIÇÃO (ALINHADA COM O ESTADO FRESCO)
    // ==========================================
    try {
        if (typeof MetacognitionEngine.gerarFeedback === 'function') {
            const reflexao = MetacognitionEngine.gerarFeedback(G.perfilCognitivo);
            if (reflexao && typeof uiManager.mostrarAvisoMetacognitivo === 'function') {
                uiManager.mostrarAvisoMetacognitivo(reflexao);
            }
        }
    } catch (e) {
        console.warn("MetacognitionEngine bypass:", e);
    }

    // ==========================================
    // 4. LOG DE FEEDBACK DE TELA & GRÁFICOS
    // ==========================================
    if (!G.logSessao) G.logSessao = [];
    G.logSessao.push({
        tempo: new Date().toLocaleTimeString(),
        habilidade: q.bncc || "Geral",
        questao: q.display || q.enunciado || "Desafio Ontológico",
        respostaDada: alt.valor || alt.texto || "N/A",
        correto: isAcerto,
        latencia: latenciaSessaoMs,
        etiologia: isAcerto ? 'NULO' : etiologiaMapeada
    });

    try {
        const modoRepresentacaoUI = (q.representacaoPrincipal || 'VISUAL').toLowerCase();
        const extrairNumero = (val) => {
            if (val === undefined || val === null) return 0;
            if (typeof val === 'number') return val;
            const str = String(val).replace(',', '.');
            if (str.includes('/')) {
                const [num, den] = str.split('/');
                return parseFloat(num) / (parseFloat(den) || 1);
            }
            return parseFloat(str.match(/-?\d+(\.\d+)?/)?.[0]) || 0; 
        };

        const pontoA = extrairNumero(q.a || q.display);
        const pontoB = extrairNumero(alt.valor || alt.texto);
        
        if (renderizadorGrafico) {
            await renderizadorGrafico.animarArcos(q, pontoB - pontoA, modoRepresentacaoUI);
        }
    } catch (err) {
        console.warn("⚠️ Pipeline visual Canvas bypass:", err);
    }

    $('btn-prox')?.classList.remove('hidden');
    $('ada-command-post')?.classList.add('active'); 

    if (G.vida <= 0) setTimeout(() => uiManager.exibirGameOver(), 800);
}

function iniciarBloco(id) {
    G.reiniciarParaNovoBloco(id);
    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
    $('game-screen')?.classList.remove('hidden');
    
    // Reseta rastros de memória operacional de transição ao reiniciar blocos
    ultimoLaudoRealADA = null;
    questaoAtivaNoCanvas = null;
    window.__QUESTAO_ORIGEM_CHOQUE__ = null;

    proximaQ();
}

function proximaQ() {
    G.respondeu = false;
    const fb = $('fb');
    if (fb) fb.style.display = 'none';
    document.querySelectorAll('.modal').forEach(m => m.classList.remove('active'));
    
    // --- PASSO A: INTERCEPÇÃO E ARBITRAGEM PELA BOA v2.2 ---
    // Passa o laudo real produzido pelo clique anterior síncrono
    const planoChanceladoBOA = BaseOrientadoraAtiva.otimizarPlano(ultimoLaudoRealADA, G.perfilCognitivo);
    
    // --- PASSO B: SELEÇÃO TÁTICA ONTOLÓGICA COMPLETANDO A ASSINATURA ---
    const q = AdaptiveSelector.selecionarProximaQuestao(
        G.currentBlock, 
        G.perfilCognitivo, 
        planoChanceladoBOA, 
        window.__QUESTAO_ORIGEM_CHOQUE__ // Envia a questão de origem exata para viabilizar busca de irmã semiótica
    );
    
    if (!q) {
        console.warn("⚠️ Pool de itens esgotado para os critérios ontológicos.");
        return;
    }
    
    questaoAtivaNoCanvas = q;
    G.tempoInicialQuestao = Date.now();
    renderQ(q, planoChanceladoBOA);
}

function renderQ(q, planoBOA) {
    $('conta-display').textContent = q.display || q.enunciado || "Resolva:";
    $('grid-botoes').innerHTML = '';
    $('btn-prox')?.classList.add('hidden');
    
    // Envelopa e traduz o item estrito aplicando as propriedades preferidas de renderização da BOA
    const tarefaPronta = AdaptiveSelector.prepararTarefaParaInterface(q, planoBOA, window.__QUESTAO_ORIGEM_CHOQUE__);
    const modoRepresentacao = tarefaPronta.interfaceModifiers?.modoRepresentacao || 'visual';
    
    // Gerenciamento e injeção dos painéis estruturais de Scaffold Instrucional na View
    const painelScaffold = $('ada-scaffold-container');
    if (painelScaffold) {
        if (tarefaPronta.interfaceModifiers.exibirPainelScaffold && tarefaPronta.contextoADA?.scaffoldOperacional) {
            painelScaffold.style.display = 'block';
            const txtScaffold = $('ada-scaffold-text');
            if (txtScaffold) txtScaffold.innerHTML = `<b>Suporte ADA:</b> ${tarefaPronta.contextoADA.scaffoldOperacional}`;
        } else {
            painelScaffold.style.display = 'none';
        }
    }

    renderizadorGrafico?.renderCv(q, null, modoRepresentacao);

    const alternativas = Array.isArray(q.alternativas) ? [...q.alternativas] : [];
    
    alternativas.sort(() => Math.random() - 0.5).forEach(alt => {
        const b = document.createElement('button');
        b.className = 'ba';
        b.innerHTML = alt.texto || alt.valor;
        b.onclick = () => processarResposta(alt, q);
        $('grid-botoes').appendChild(b);
    });
}

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', async () => {
    console.log("🚀 [SISTEMA v1.6.5] Motor LabTech Gold Master Operante. Conexão Total Estabilizada.");
    
    try { await AdaptiveSelector.carregarBancoDeQuestoes(); } catch (e) { alert("Falha na leitura física do catálogo."); }
    initDebugMode();
    on('btn-acessar', mostrarSeletorBlocos);
    on('btn-prox', proximaQ);
    on('btn-musica', uiManager.toggleMusica);
    on('btn-voz', uiManager.toggleVoz);
    on('btn-alterar-usuario', () => location.reload());
    
    const yearSpan = $('labtech-year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();
    
    on('btn-cred', () => {
        const m = $('mcred');
        if (m) {
            const mc = m.querySelector('.mc');
            if (mc) {
                mc.style.border = '2px solid var(--neon-cyan, #00eaff)';
                mc.style.background = '#0a0a0a';
                mc.style.color = '#ddd';
                mc.style.boxShadow = '0 0 15px rgba(0, 234, 255, 0.2)';
            }
        }
        abrirM('mcred');
    });

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
                    'DEPENDENTE_CONCRETO': "Você resolve bem com visuais. <br><br><b style='color:#00eaff;'>🎯 Objetivo:</b> Fortalecer a abstraction.",
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

// ============================================================================
    // 🎛️ CAPTURA DE ATALHOS GLOBAIS DE ENGENHARIA E INTERFACE DOCENTE (XAI)
    // ============================================================================
    document.addEventListener('keydown', (e) => {
        if (!e.altKey) return;
        
        // 👁️‍🗨️ ALT + P: Dispara o Painel Diagnóstico Docente Rico com a Matriz de Transição
        if (e.key.toLowerCase() === 'p') {
            if (!G.perfilCognitivo) { 
                alert("⚠️ Calibração pendente. Inicialize o bloco e responda a pelo menos um item."); 
                return; 
            }
            G.perfilCognitivo.blocoAtual = G.currentBlock || 1;

            // Importação assíncrona limpa para evitar sobrecarga de bundle no cliente
            import('./ui/TeacherAnalyticsView.js').then(({ TeacherAnalyticsView }) => {
                TeacherAnalyticsView.renderizarPainelDocente(G.perfilCognitivo);
                
                // Amarra síncronamente os botões de validação humana gerados dinamicamente na View
                const btnValidar = document.getElementById('btn-ia-validar');
                const btnRefutar = document.getElementById('btn-ia-refutar');
                
                if (btnValidar) btnValidar.onclick = () => { 
                    G.perfilCognitivo.validacaoHumana = 'VALIDADO'; 
                    G.perfilCognitivo.confiancaDiagnostica = 99.9; 
                    TeacherAnalyticsView.renderizarPainelDocente(G.perfilCognitivo); 
                };
                if (btnRefutar) btnRefutar.onclick = () => { 
                    G.perfilCognitivo.validacaoHumana = 'REFUTADO'; 
                    G.perfilCognitivo.confiancaDiagnostica = 10.0; 
                    TeacherAnalyticsView.renderizarPainelDocente(G.perfilCognitivo); 
                };
            });
        }

        // 📖 ALT + J: Dispara o Novo Glossário de Fundamentação Teórica da IA (XAI Docente)
        if (e.key.toLowerCase() === 'j') {
            import('./ui/TeacherAnalyticsView.js').then(({ TeacherAnalyticsView }) => {
                TeacherAnalyticsView.renderizarGlossarioDocente();
            });
        }

        // 🎥 ALT + R: Mantém o Replay/Timeline cru de passos da sessão atual
        if (e.key.toLowerCase() === 'r') {
            if (!G.logSessao || G.logSessao.length === 0) {
                alert("⚠️ Nenhuma ação gravada nesta sessão ainda.");
                return;
            }

            let mVar = document.getElementById('modal-var-pedagogico');
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
                            Resposta: <b style="color: ${cor};">${step.respostaDada}</b> | Tempo: <b style="color: ${corTempo};">${latenciaSegundos}s</b>
                            ${!step.correto ? `<br><span style="color:var(--neon-red);">Etiologia Clínica: ${step.etiologia}</span>` : ''}
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
    }); // <-- Fecha corretamente o keydown listener
}); // <-- Fecha corretamente o DOMContentLoaded da inicialização do main.js
