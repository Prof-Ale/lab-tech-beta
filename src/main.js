/**
 * @fileoverview main.js — MESTRE DE ORQUESTRAÇÃO (v15.3.5 - RELEASE CANDIDATE)
 * CIRURGIA: Feedback formativo, parser matemático para Canvas, injeção de logs e blindagens de UI.
 */

import { G } from './engine/gameState.js';
import { initDebugMode } from './engine/debugMode.js';
import { ProfileEngine } from './core/ada/ProfileEngine.js';
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
    if (uiManager.narrarContexto) {
        uiManager.narrarContexto(msg, true).catch(e => console.warn("TTS Bypass:", e));
    }
}

// --- CORE: PROCESSAR RESPOSTA (BLINDADO & FORMATIVO) ---
async function processarResposta(alt, q) {
    if (G.respondeu) return;
    G.respondeu = true;

    const latenciaSessaoMs = Date.now() - G.tempoInicialQuestao;
    const isAcerto = (alt.tipo === "acerto" || alt.correta === true || String(alt.valor) === String(q.res));
    const etiologiaErro = alt.tipoErro || alt.tipo_erro || 'CONCEITO'; 

    // 1. Feedback Imediato (UI + ADA) Focado no Aluno
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
        : `Calma, ${G.nome || 'cientista'}. ${alt.descricao || 'Essa estratégia não funcionou agora.'} ${dicaLimpa ? `Pense nisto: ${dicaLimpa}` : 'Respire fundo e tente observar a imagem ou os dados antes de continuar.'}`;

    if (typeof uiManager.narrarContexto === 'function') {
        uiManager.narrarContexto(feedbackADA, isAcerto).catch(e => console.warn("Narração ADA bypass:", e));
    }

    // 2. Integração MetacognitionEngine (Segura)
    try {
        if (typeof MetacognitionEngine.gerarFeedback === 'function') {
            const reflexao = MetacognitionEngine.gerarFeedback(G.perfilCognitivo);
            if (reflexao) {
                if (typeof uiManager.mostrarAvisoMetacognitivo === 'function') {
                    uiManager.mostrarAvisoMetacognitivo(reflexao);
                } else if (typeof uiManager.exibirReflexaoMetacognitiva === 'function') {
                    uiManager.exibirReflexaoMetacognitiva(reflexao);
                }
            }
        }
    } catch (e) {
        console.warn("MetacognitionEngine bypass:", e);
    }

    // 3. Telemetria, Áudio e Log de Sessão (Replay)
    if (isAcerto) {
        G.acertos++; G.combo++;
        try { AdaptiveAudioEngine.sonarSucesso(); } catch (e) {}
    } else {
        G.combo = 0; G.erros++; 
        G.vida = Math.max(0, G.vida - 15); // PROTEÇÃO DE VIDA NEGATIVA
        try { AdaptiveAudioEngine.sonarAnomalia(); } catch (e) {}
    }

    G.registrarInteracao(q.bncc || "Geral", isAcerto, isAcerto ? 'NULO' : etiologiaErro, latenciaSessaoMs);
    localStorage.setItem(`labtech_h_${G.nome}_${G.turma}`, btoa(encodeURIComponent(JSON.stringify(G.historico))));

    // Preenchendo G.logSessao para garantir que ALT+R funcione
    if (!G.logSessao) G.logSessao = [];
    G.logSessao.push({
        tempo: new Date().toLocaleTimeString(),
        habilidade: q.bncc || "Geral",
        questao: q.display || "Questão visual",
        respostaDada: alt.valor || alt.texto || "N/A",
        correto: isAcerto,
        latencia: latenciaSessaoMs,
        etiologia: isAcerto ? 'NULO' : etiologiaErro
    });

    // 4. Animação de Mediação (Canvas) c/ Parser Matemático Seguro
    try {
        const pAdaptivo = AdaptiveSelector.selecionarProximaTarefa(G, [q]) || {};
        const modoRepresentacao = pAdaptivo.interfaceModifiers?.modoRepresentacao || 'PADRAO';

        // Parser universal (Lida com frações, decimais com vírgula e negativos)
        const extrairNumero = (val) => {
            if (val === undefined || val === null) return 0;
            if (typeof val === 'number') return val;
            const str = String(val).replace(',', '.');
            if (str.includes('/')) {
                const [num, den] = str.split('/');
                return parseFloat(num) / (parseFloat(den) || 1);
            }
            return parseFloat(str.replace(/[^\d.-]/g, '')) || 0;
        };

        const pontoA = extrairNumero(q.a !== undefined ? q.a : 0);
        const pontoB = extrairNumero(alt.valor);
        
        if (renderizadorGrafico) {
            await renderizadorGrafico.animarArcos(q, pontoB - pontoA, modoRepresentacao);
        }
    } catch (err) {
        console.warn("⚠️ Animação falhou:", err);
    }

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
    
    const pAdaptivo = AdaptiveSelector.selecionarProximaTarefa(G, [q]) || {};
    const modoRepresentacao = pAdaptivo.interfaceModifiers?.modoRepresentacao || 'PADRAO';
    renderizadorGrafico?.renderCv(q, null, modoRepresentacao);

    const alternativas = Array.isArray(q.alternativas) ? [...q.alternativas] : [];
    
    alternativas.sort(() => Math.random() - 0.5).forEach(alt => {
        const b = document.createElement('button');
        b.className = 'ba';
        b.textContent = alt.texto || alt.valor;
        b.onclick = () => processarResposta(alt, q);
        $('grid-botoes').appendChild(b);
    });
}

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', async () => {
    console.log("🚀 [SISTEMA v1.5.5] Motor LabTech Release Candidate Operante.");
    
    try { await AdaptiveSelector.carregarBancoDeQuestoes(); } catch (e) { alert("Erro de carga."); }
    initDebugMode();
    on('btn-acessar', mostrarSeletorBlocos);
    on('btn-prox', proximaQ);
    on('btn-musica', uiManager.toggleMusica);
    on('btn-voz', uiManager.toggleVoz);
    on('btn-alterar-usuario', () => location.reload());
    
    const yearSpan = $('labtech-year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();
    
    // FORÇANDO ESTILO CYBERPUNK NO MODAL SOBRE
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

    // ==========================================
    // RESTAURAÇÃO DOS ATALHOS XAI E DOCENTE
    // ==========================================
    document.addEventListener('keydown', (e) => {
        if (!e.altKey) return;
        
        // 📊 ALT + P (Painel Docente)
        if (e.key.toLowerCase() === 'p') {
            if (!G.perfilCognitivo) { alert("⚠️ Calibração pendente."); return; }
            G.perfilCognitivo.blocoAtual = G.currentBlock || 1;

            let mDoc = $('modal-docente-xai');
            if (!mDoc) {
                mDoc = document.createElement('div'); mDoc.id = 'modal-docente-xai'; mDoc.className = 'modal';
                mDoc.innerHTML = `
                <div class="mc" style="max-width: 650px; border: 2px solid var(--choco-gold, #d4af37); background: #0a0a0a; position: relative; padding: 25px 20px;">
                    <button class="mx" style="position: absolute; top: 15px; right: 35px; font-size: 22px; color: #888; background: none; border: none; cursor: pointer; z-index: 1000;" onclick="document.getElementById('modal-docente-xai').classList.remove('active')">✕</button>
                    <div id="content-docente-xai" style="max-height: 70vh; overflow-y: auto; padding-right: 15px; margin-top: 10px;"></div>
                </div>`;
                document.body.appendChild(mDoc);
            }

            const renderizarPainel = () => {
                // FALLBACK SEGURO PARA A FUNÇÃO DO LEARNING ANALYTICS
                const html = typeof LearningAnalytics.gerarPainelDocenteHTML === 'function' 
                    ? LearningAnalytics.gerarPainelDocenteHTML(G.perfilCognitivo) 
                    : (typeof LearningAnalytics.gerarPainelDocente === 'function' ? LearningAnalytics.gerarPainelDocente(G.perfilCognitivo) : "<p style='color:red;'>Painel indisponível.</p>");
                
                $('content-docente-xai').innerHTML = html;
                const btnValidar = $('btn-ia-validar');
                const btnRefutar = $('btn-ia-refutar');
                if (btnValidar) btnValidar.onclick = () => { G.perfilCognitivo.validacaoHumana = 'VALIDADO'; G.perfilCognitivo.confiancaDiagnostica = 99.9; renderizarPainel(); };
                if (btnRefutar) btnRefutar.onclick = () => { G.perfilCognitivo.validacaoHumana = 'REFUTADO'; G.perfilCognitivo.confiancaDiagnostica = 10.0; renderizarPainel(); };
                const btnExportXai = $('btn-export-xai-csv');
                if (btnExportXai) btnExportXai.onclick = () => LearningAnalytics.exportarCSV(G.nome, G.historico);
            };

            renderizarPainel();
            mDoc.classList.add('active');
        }

        // 📖 ALT + J (Glossário XAI)
        if (e.key.toLowerCase() === 'j') {
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
                                <li style="margin-bottom: 10px;"><b style="color:white;">CONCEITUAL TEÓRICO:</b> Compreende a regra profunda e aplica com segurança.</li>
                                <li style="margin-bottom: 10px;"><b style="color:white;">PROCEDURAL MECÂNICO:</b> Acerta porque decorou a regra prática, mas não entende o porquê.</li>
                                <li style="margin-bottom: 10px;"><b style="color:white;">DEPENDENTE CONCRETO:</b> Necessita de materialização gráfica constante.</li>
                                <li style="margin-bottom: 10px;"><b style="color:white;">IMPULSIVO ARITMÉTICO:</b> Erra por pressa e cliques velozes.</li>
                            </ul>
                        </div>
                    </div>
                `;
                document.body.appendChild(modalGlossario);
            }
            modalGlossario.classList.add('active');
        }

        // 🎥 ALT + R (Replay Pedagógico)
        if (e.key.toLowerCase() === 'r') {
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
                            Resposta: <b style="color: ${cor};">${step.respostaDada}</b> | Tempo: <b style="color: ${corTempo};">${latenciaSegundos}s</b>
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
});
