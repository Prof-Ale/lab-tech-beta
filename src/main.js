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
    
   
    
// --- UNIFICAÇÃO DE EVENTOS E POLICIAMENTO DE ANO ---

// 1. Botão Alterar Usuário
on('btn-alterar-usuario', () => {
    location.reload();
});

// 2. Atualização do Ano (De forma única e limpa)
const yearSpan = $('labtech-year');
if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
}
    
    on('btn-cred', () => abrirM('mcred'));
    on('btn-dash', () => { atualizarDashboard(); abrirM('mdash'); });
    on('btn-reiniciar', () => { fecharM('go'); if (G.currentBlock) iniciarBloco(G.currentBlock); });
    
   // --- O ESPELHO DO ALUNO ---
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
                    textoEspelho = "Você resolve muito bem os problemas quando usa representações visuais. Sua precisão costuma cair quando o visual é retirado. <br><br><b style='font-family: monospace; color:#00eaff;'>🎯 Objetivo:</b> Fortalecer a abstração e tentar imaginar a figura na mente.";
                } else if (dom === 'IMPULSIVO_ARITMETICO') {
                    textoEspelho = "Sua agilidade de cálculo é excelente! Porém, você parece acelerar demais e acabar errando por impulso. <br><br><b style='font-family: monospace; color:#00eaff;'>🎯 Objetivo:</b> Respirar fundo por 3 segundos e reler a pergunta antes de confirmar.";
                } else if (dom === 'PROCEDURAL_MECÂNICO') {
                    textoEspelho = "Você tem uma ótima memória para regras e fórmulas matemáticas! O desafio agora é conectar essa regra com o problem real. <br><br><b style='font-family: monospace; color:#00eaff;'>🎯 Objetivo:</b> Focar em entender o 'porquê' da questão.";
                } else if (dom === 'CONCEITUAL_TEÓRICO') {
                    textoEspelho = "Excelente! Sua consistência mostra um domínio profundo da lógica matemática. Você consegue adaptar seu raciocínio. <br><br><b style='font-family: monospace; color:#00eaff;'>🎯 Objetivo:</b> Manter o foco e avançar para desafios mais abstratos.";
                } else {
                    textoEspelho = "Seu padrão cognitivo ainda está sendo mapeado. <br><br><b style='font-family: monospace; color:#00eaff;'>🎯 Objetivo:</b> Continue resolvendo os desafios com atenção para a ADA revelar sua radiografia.";
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
        
        // 📊 ALT + P
        if (e.altKey && e.key.toLowerCase() === 'p') {
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
                $('content-docente-xai').innerHTML = LearningAnalytics.gerarPainelDocenteHTML(G.perfilCognitivo);
                const btnValidar = $('btn-ia-validar');
                const btnRefutar = $('btn-ia-refutar');
                if (btnValidar) {
                    btnValidar.onclick = () => {
                        G.perfilCognitivo.validacaoHumana = 'VALIDADO';
                        G.perfilCognitivo.confiancaDiagnostica = 99.9; 
                        renderizarPainel(); 
                    };
                }
                if (btnRefutar) {
                    btnRefutar.onclick = () => {
                        G.perfilCognitivo.validacaoHumana = 'REFUTADO';
                        G.perfilCognitivo.confiancaDiagnostica = 10.0; 
                        renderizarPainel(); 
                    };
                }
                const btnExportXai = $('btn-export-xai-csv');
                if (btnExportXai) btnExportXai.onclick = () => LearningAnalytics.exportarCSV(G.nome, G.historico);
            };

            renderizarPainel();
            mDoc.classList.add('active');
        }

        // 📖 ALT + J
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

        // 🎥 ALT + R
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
