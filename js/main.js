/**
 * main.js — v14.0 "LabTech Academic Beta Engine"
 * Prioridade: Governança Pedagógica, Mastery Learning e Inteligência Explicável (XAI).
 * Fluxo: Validação de Banco -> Carga de Perfil Cognitivo -> Rastreamento Longitudinal de Erros -> Log de Decisão.
 */
import { G } from './engine/gameState.js';
import { selQ, limparHistoricoSessao, carregarBancoDeQuestoes } from './engine/selector.js';
import { analisarAlternativa, registrarErro } from './engine/diagnostic-engine.js';
import { renderCv, setAnimando, animarArcos } from './game-engine.js';
import { AudioCtrl } from './engine/audioController.js'; 
import { updHUD, narrarContexto, toggleVoz, exibirGameOver } from './ui-manager.js';
import { initDebugMode, setDebug } from './engine/debug-mode.js';
import { carregarPerfil, salvarPerfil, registrarEvolucaoLongitudinal, gerarMicroIntervencao, extrairRelatorioProfessor } from './engine/cognitive-profile.js';
// 🛡️ NOVO: Importação do Guardião de Dados Pedagógicos para o ciclo Beta V11
import { validarBancoCompleto } from './engine/question-validator.js';

const $ = (id) => document.getElementById(id);
const on = (id, fn) => { const el = $(id); if (el) el.onclick = fn; };

const abrirM = (id) => $(id)?.classList.add('active');
const fecharM = (id) => $(id)?.classList.remove('active');

/* ============================================================
   TELEMETRIA E DASHBOARD (PREMIUM EDITION)
   ============================================================ */
function atualizarDashboard() {
    const content = $('dash-content');
    if (!content) return;
    
    if (!G.historico || Object.keys(G.historico).length === 0) {
        content.innerHTML = "<p style='text-align:center; opacity:0.5; padding:20px;'>Aguardando coleta de dados BNCC...</p>";
        return;
    }

    let html = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; border-bottom: 1px solid var(--choco-gold); padding-bottom: 10px;">
            <h3 style="color:var(--choco-gold); margin:0; font-family: var(--font-display); font-size: 14px;">RELATÓRIO BNCC</h3>
            <button id="btn-export-csv" style="background:var(--neon-cyan); color:#000; border:none; padding:6px 12px; border-radius:8px; cursor:pointer; font-weight:900; font-family: var(--font-display); font-size:10px; transition: 0.2s;">📥 EXPORTAR CSV</button>
        </div>
        <div style="max-height: 60vh; overflow-y: auto; padding-right: 5px;">
    `;

    Object.entries(G.historico).forEach(([hab, dados]) => {
        const total = (dados.acertos || 0) + (dados.erros_conceito || 0) + (dados.erros_calculo || 0);
        if (total === 0) return;

        const txAcerto = Math.round(((dados.acertos || 0) / total) * 100);

        let diagnostico = "";
        if (dados.erros_conceito > dados.acertos) {
            diagnostico = `<div style="color: var(--neon-red); margin-top:6px; font-size:11px; font-weight:bold;">⚠️ Bloqueio Conceitual (Exige Revisão de Base)</div>`;
        } else if (dados.erros_calculo > 0) {
            diagnostico = `<div style="color: #ffbb33; margin-top:6px; font-size:11px; font-weight:bold;">📐 Falha Operacional (Erro de Atenção/Cálculo)</div>`;
        } else {
            diagnostico = `<div style="color: var(--neon-green); margin-top:6px; font-size:11px; font-weight:bold;">✅ Domínio Estabilizado</div>`;
        }

        html += `
            <div class="dash-card" style="background:rgba(255,255,255,0.05); border-left:4px solid var(--choco-gold); padding:12px; margin-bottom:12px; border-radius:6px;">
                <div style="display:flex; justify-content:space-between; font-weight:bold;">
                    <span style="color:var(--choco-gold); font-size:13px;">${hab}</span>
                    <span style="color:var(--neon-cyan); font-size:13px;">${txAcerto}% Precisão</span>
                </div>
                <div style="font-size:11px; margin-top:6px; opacity:0.8; display: flex; gap: 10px;">
                    <span style="color: var(--neon-green)">Acertos: ${dados.acertos || 0}</span> | 
                    <span style="color: var(--neon-red)">Erros Conceito: ${dados.erros_conceito || 0}</span> | 
                    <span style="color: #ffbb33">Erros Cálculo: ${dados.erros_calculo || 0}</span>
                </div>
                <div style="width:100%; height:6px; background:#222; border-radius:3px; margin-top:8px; overflow:hidden;">
                    <div style="width:${txAcerto}%; height:100%; background:var(--neon-green);"></div>
                </div>
                ${diagnostico}
            </div>`;
    });

    html += `</div>`; 
    content.innerHTML = html;

    const btnCsv = $('btn-export-csv');
    if (btnCsv) {
        btnCsv.onclick = exportarCSV;
    }
}

function exportarCSV() {
    if (!G.historico) return;
    let csv = "Habilidade BNCC;Acertos;Erros de Conceito;Erros de Calculo;Precisao (%)\n";
    
    Object.entries(G.historico).forEach(([hab, dados]) => {
        const total = (dados.acertos || 0) + (dados.erros_conceito || 0) + (dados.erros_calculo || 0);
        if (total === 0) return;
        const txAcerto = Math.round(((dados.acertos || 0) / total) * 100);
        csv += `${hab};${dados.acertos || 0};${dados.erros_conceito || 0};${dados.erros_calculo || 0};${txAcerto}%\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", `Telemetria_LabTech_${G.nome.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function mostrarSeletorBlocos() {
    G.nome = $('nome-cientista')?.value.trim() || 'Cientista';
    G.turma = $('turma-cientista')?.value.trim() || '7ºA';
    if (!G.historico) G.historico = {};

    G.perfilCognitivo = carregarPerfil(G.nome, G.turma);

    // 🧠 INICIALIZAÇÃO DO LOG DE EXPLICABILIDADE DA ADA (V11-BETA)
    if (!G.diagnosticoADA) {
        G.diagnosticoADA = {
            ultimaIntervencaoMotivo: "Ignorão e calibração inicial do sistema.",
            historicoDecisoes: []
        };
    }

    AudioCtrl.init();
    AudioCtrl.play();

    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
    $('block-selector')?.classList.remove('hidden');
    $('ada-command-post')?.classList.remove('active'); 

    let mensagemBoasVindas = "";
    
    if (G.perfilCognitivo.novoUsuario) {
        mensagemBoasVindas = `Olá, ${G.nome}. É sua primeira vez no laboratório. Meu nome é ADA. Escolha um módulo e vamos começar sua calibração lógica.`;
    } else {
        mensagemBoasVindas = `Bem-vindo de volta à base, ${G.nome}! Seus registros da turma ${G.turma} foram carregados. Pronto para continuar nossa evolução?`;
    }
    
    narrarContexto(mensagemBoasVindas, true);
}

function iniciarBloco(id) {
    G.currentBlock = id;
    G.vida = 100;
    G.acertos = 0;
    G.combo = 0;
    
    limparHistoricoSessao();

    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
    $('game-screen')?.classList.remove('hidden');
    $('ada-command-post')?.classList.add('active');
    
    atualizarHudVisual();
    proximaQ();
}

function atualizarHudVisual() {
    const barraVida = $('fv');
    if (barraVida) {
        barraVida.style.width = G.vida + "%";
        barraVida.style.background = G.vida < 30 ? "var(--neon-red)" : "var(--neon-green)";
    }
    if ($('tnv')) $('tnv').textContent = G.combo > 0 ? G.combo : "1";
    
    if (G.perfilCognitivo) {
        if ($('perfil-nome-display')) 
            $('perfil-nome-display').textContent = `Lvl ${G.perfilCognitivo.nivel || 1} | ${G.nome}`;
        
        if ($('perfil-nivel-txt')) 
            $('perfil-nivel-txt').textContent = G.perfilCognitivo.nivel || 1;

        if ($('perfil-acertos-display')) 
            $('perfil-acertos-display').textContent = `${G.perfilCognitivo.xp || 0} XP`;
    }

    updHUD();
}
    
/* ============================================================
   PIPELINE ASSÍNCRONO DE RESPOSTA (O MAESTRO)
   ============================================================ */
async function processarResposta(alt, q) {
    if (G.respondeu) return;
    G.respondeu = true;

    const getNum = (val) => parseFloat(String(val).replace(/[^\d.-]/g, '')) || 0;
    const pontoA = getNum(q.a || q.inicio || q.valorInicial);
    const pontoB = getNum(alt.valor);
    const deslocamento = pontoB - pontoA;
    
    const analise = analisarAlternativa(alt);
    const feedbackTexto = analise.correto ? q.passo : (q.dica || analise.descricao);

    document.querySelectorAll('.ba').forEach(b => {
        b.classList.add('dis'); 
        if (String(b.textContent) === String(q.res)) b.classList.add('ok');
        if (String(b.textContent) === String(alt.valor) && !analise.correto) b.classList.add('no');
    });

    const hab = q.bncc || q.habilidade || "Geral";
    if (!G.historico[hab]) G.historico[hab] = { acertos: 0, erros_conceito: 0, erros_calculo: 0 };

    if (analise.correto) {
        G.acertos++; G.combo++;
        G.historico[hab].acertos++;
        
        if (G.perfilCognitivo) {
            if (G.perfilCognitivo.xp === undefined) {
                G.perfilCognitivo.xp = 0;
                G.perfilCognitivo.nivel = 1;
            }

            const ganhoXp = 10 + (G.combo * 5); 
            G.perfilCognitivo.xp += ganhoXp;

            const nivelCalculado = Math.floor(G.perfilCognitivo.xp / 100) + 1;
            
            if (nivelCalculado > G.perfilCognitivo.nivel) {
                G.perfilCognitivo.nivel = nivelCalculado;
                console.log(`🎉 LEVEL UP! ${G.nome} subiu para o Nível ${nivelCalculado}!`);
                narrarContexto(`Evolução confirmada. Parabéns, ${G.nome}. Você atingiu o nível ${nivelCalculado} de cognição.`, true);
            }
        }
    } else {
        G.combo = 0;
        registrarErro(G, analise, q); 
        const dano = 10 + (analise.peso || 1) * 5;
        G.vida = Math.max(0, G.vida - dano);
    }
    registrarEvolucaoLongitudinal(G, analise, q);
    
    atualizarHudVisual(); 

    narrarContexto(feedbackTexto, analise.correto);

    let modoGrafico = q.representacao || 'normal';
    if (G.perfilCognitivo && G.perfilCognitivo.errosHistoricos?.conceito >= 3) modoGrafico = 'visual';
    if (G.combo >= 3) modoGrafico = 'abstrato';

    await animarArcos(q, deslocamento, modoGrafico);

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

function proximaQ() {
    G.respondeu = false;
    setAnimando(false);

    const fbContainer = $('fb');
    if (fbContainer) {
        fbContainer.textContent = '';
        fbContainer.style.display = 'none';
    }

    const q = selQ(G.currentBlock);
    if (!q) return;

    const alertaPrevio = gerarMicroIntervencao(q, G.perfilCognitivo);
    if (alertaPrevio) {
        console.log("🔮 [PREDIÇÃO] ADA detectou risco! Disparando Microintervenção.");
        narrarContexto(alertaPrevio, false); 
    }

    renderQ(q);
}

function renderQ(q) {
    if ($('conta-display')) $('conta-display').textContent = q.display;
    const grid = $('grid-botoes');
    if (grid) grid.innerHTML = '';
    $('btn-prox')?.classList.add('hidden');
    
    let modoGrafico = q.representacao || 'normal';
    if (G.perfilCognitivo && G.perfilCognitivo.errosHistoricos?.conceito >= 3) {
        modoGrafico = 'visual'; 
    }
    if (G.combo >= 3) {
        modoGrafico = 'abstrato'; 
    }

    renderCv(q, null, modoGrafico);

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

document.addEventListener('DOMContentLoaded', async () => { 
    console.log("🚀 [SISTEMA] Iniciando ignição do banco de dados...");
    
    try {
        const banco = await carregarBancoDeQuestoes(); 
        console.log("✅ [SISTEMA] Banco de dados carregado na memória física.");
        
        // 🛡️ SHIELD DE GOVERNANÇA: Auditoria compulsória e estrita de Data Quality
        validarBancoCompleto(banco);
        
    } catch (e) {
        console.error("❌ [SISTEMA] Falha catastrófica no carregamento/validação de dados:", e);
    }

    initDebugMode();
  
    on('btn-acessar', mostrarSeletorBlocos);
    [1,2,3,4,5,6,7].forEach(i => on(`btn-bloco-${i}`, () => iniciarBloco(i)));
    
    on('btn-prox', proximaQ);
    on('btn-musica', () => AudioCtrl.toggle('btn-musica', 'tsom'));
      
    on('btn-voz', () => {
        toggleVoz();
        if ($('tvoz')) $('tvoz').textContent = G.voz ? "ON" : "OFF";
    });

    // --- ATALHO SECRETO DOCENTE: Painel do Professor (Alt + P) ---
    document.addEventListener('keydown', (e) => {
        if (e.altKey && e.key.toLowerCase() === 'p') {
            if (!G.perfilCognitivo) {
                alert("Identifique um estudante na base para carregar a telemetria.");
                return;
            }
            gerarPainelProfessor();
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
            console.log(`[SISTEMA] Reiniciando o Módulo ${G.currentBlock}...`);
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

/* ============================================================
   PAINEL DO PROFESSOR (Alt + P — GOVERNANÇA VISUAL XAI V11)
   ============================================================ */
function gerarPainelProfessor() {
    // Garante que os dados do perfil existem antes de abrir
    if (!G.perfilCognitivo) {
        alert("Identifique um estudante na base para carregar a telemetria.");
        return;
    }

    const dados = extrairRelatorioProfessor(G.perfilCognitivo);

    let modalProf = $('m-professor');
    if (!modalProf) {
        modalProf = document.createElement('div');
        modalProf.id = 'm-professor';
        modalProf.className = 'modal'; 
        document.body.appendChild(modalProf);
    }

    // 1. Extração do último pulso de decisão da ADA
    const historicoADA = G.diagnosticoADA?.historicoDecisoes || [];
    const ultimaDecisao = historicoADA.length > 0 ? historicoADA[historicoADA.length - 1] : null;

    // 2. Tradução Visual da Etiologia do Erro (Parser XAI)
    let cardGatilho = "";
    let cardDiagnostico = "";
    let cardIntervencao = "";

    if (ultimaDecisao) {
        // Lógica de parser visual baseada no texto gerado pela ADA
        let corAlerta = "var(--neon-cyan)";
        let tipoErro = "Cruzeiro Linear";
        let acaoADA = "Manutenção de Ritmo";

        if (ultimaDecisao.motivoDecisao.includes("impulsiva") || ultimaDecisao.motivoDecisao.includes("Impulsivo")) {
            corAlerta = "#ffbb33"; // Laranja/Amarelo
            tipoErro = "Resposta Impulsiva (< 5s)";
            acaoADA = "Trava de Tempo + Alívio de Carga";
        } else if (ultimaDecisao.motivoDecisao.includes("barreira") || ultimaDecisao.motivoDecisao.includes("Emergência") || ultimaDecisao.motivoDecisao.includes("risco extremo")) {
            corAlerta = "var(--neon-red)"; // Vermelho
            tipoErro = "Bloqueio Conceitual (Risco)";
            acaoADA = "Recuo Abstrato + Resgate Clínico";
        } else if (ultimaDecisao.motivoDecisao.includes("Mastery") || ultimaDecisao.motivoDecisao.includes("proficiência")) {
            corAlerta = "var(--neon-green)"; // Verde
            tipoErro = "Consolidação de Domínio";
            acaoADA = "Elevação de Dificuldade (Flow)";
        }

        cardGatilho = `<div style="color:${corAlerta}; font-size:14px; font-weight:bold;">⚡ GATILHO DETECTADO</div><div style="color:#fff; font-size:12px; margin-top:5px;">${tipoErro}</div>`;
        cardDiagnostico = `<div style="color:var(--choco-gold); font-size:14px; font-weight:bold;">🧠 INFERÊNCIA ADA</div><div style="color:rgba(255,255,255,0.8); font-size:11px; margin-top:5px; line-height:1.4;">"${ultimaDecisao.motivoDecisao}"</div>`;
        cardIntervencao = `<div style="color:var(--neon-green); font-size:14px; font-weight:bold;">🛠️ TRATAMENTO PEDAGÓGICO</div><div style="color:#fff; font-size:12px; margin-top:5px;">${acaoADA}</div><div style="color:var(--neon-cyan); font-size:10px; margin-top:8px;">↳ Próximo Item: [${ultimaDecisao.proximaQuestaoId || 'Dinâmico'}]</div>`;
    } else {
        const placeholder = `<div style="color:rgba(255,255,255,0.3); text-align:center;">Aguardando primeira interação...</div>`;
        cardGatilho = placeholder;
        cardDiagnostico = placeholder;
        cardIntervencao = placeholder;
    }

    modalProf.innerHTML = `
        <div class="mc" style="max-width: 800px; border: 2px solid var(--choco-gold); background: #04040a; position: relative; border-radius: 12px; box-shadow: 0 0 30px rgba(212,175,55,0.15); max-height: 90vh; overflow-y: auto;">
            
            <button class="mx" style="position: absolute; top: 15px; right: 15px; background: transparent; color: var(--choco-gold); border: 1px solid var(--choco-gold); border-radius: 50%; width: 30px; height: 30px; font-size: 14px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: 0.2s; padding: 0;">✕</button>

            <div style="border-bottom: 1px dashed rgba(212,175,55,0.4); padding-bottom: 15px; margin-bottom: 20px;">
                <h2 style="color:var(--choco-gold); margin: 0; font-family: var(--font-display); font-size: 20px; letter-spacing: 1px;">ADA EXPLAINABLE AI (XAI)</h2>
                <div style="color:var(--neon-cyan); font-size:11px; font-family:monospace; margin-top:5px;">TARGET: ${dados.identificacao} | ATIVIDADE: ${dados.tempoVida} dias | RESOLVIDAS: ${dados.totalResolvidas}</div>
            </div>
            
            <div style="display: flex; justify-content: space-between; align-items: stretch; gap: 10px; font-family: monospace;">
                
                <div style="flex: 1; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 15px; text-align:center; display:flex; flex-direction:column; justify-content:center;">
                    ${cardGatilho}
                </div>

                <div style="display: flex; align-items: center; color: rgba(212,175,55,0.5); font-size: 24px;">➔</div>

                <div style="flex: 1.5; background: rgba(212,175,55,0.05); border: 1px solid var(--choco-gold); border-radius: 8px; padding: 15px; text-align:center; box-shadow: inset 0 0 15px rgba(212,175,55,0.1);">
                    ${cardDiagnostico}
                </div>

                <div style="display: flex; align-items: center; color: rgba(212,175,55,0.5); font-size: 24px;">➔</div>

                <div style="flex: 1; background: rgba(0,255,128,0.05); border: 1px solid var(--neon-green); border-radius: 8px; padding: 15px; text-align:center; display:flex; flex-direction:column; justify-content:center;">
                    ${cardIntervencao}
                </div>

            </div>

            <div style="margin-top: 25px; display:flex; justify-content: space-between; font-family: monospace; font-size: 11px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 15px; gap: 20px;">
                
                <div style="flex: 1; background: #060610; padding: 10px; border-radius: 8px; border: 1px solid #222;">
                    <div style="text-align:center; margin-bottom: 10px; color:var(--choco-gold); font-weight:bold;">DISTRIBUIÇÃO ETIOLÓGICA</div>
                    <div style="display:flex; justify-content: space-around;">
                        <div style="text-align:center;">
                            <div style="color:rgba(255,255,255,0.5);">Atenção</div>
                            <div style="color:#ffbb33; font-size: 16px; font-weight:bold;">${dados.distribuicaoErros?.atencao || 0}%</div>
                        </div>
                        <div style="text-align:center;">
                            <div style="color:rgba(255,255,255,0.5);">Procedimento</div>
                            <div style="color:var(--neon-cyan); font-size: 16px; font-weight:bold;">${dados.distribuicaoErros?.procedimento || 0}%</div>
                        </div>
                        <div style="text-align:center;">
                            <div style="color:rgba(255,255,255,0.5);">Conceito</div>
                            <div style="color:var(--neon-red); font-size: 16px; font-weight:bold;">${dados.distribuicaoErros?.conceito || 0}%</div>
                        </div>
                    </div>
                </div>

                <div style="flex: 1; background: #060610; padding: 10px; border-radius: 8px; border: 1px solid #222; max-height: 100px; overflow-y: auto;">
                    <div style="text-align:center; margin-bottom: 10px; color:var(--choco-gold); font-weight:bold;">ALERTAS DE HABILIDADE (BNCC)</div>
                    ${dados.pontosCriticos.length > 0 ? 
                        dados.pontosCriticos.map(([hab, score]) => `
                            <div style="display:flex; justify-content:space-between; margin-bottom:4px; color: ${score > 5 ? 'var(--neon-red)' : 'white'}">
                                <span>• ${hab}</span>
                                <span>Risco: ${score.toFixed(1)}</span>
                            </div>
                        `).join('') : '<div style="color:var(--neon-green); text-align:center; margin-top:10px;">Nenhuma defasagem crítica mapeada.</div>'
                    }
                </div>

            </div>
        </div>
    `;

    modalProf.classList.add('active');
    
    const btnX = modalProf.querySelector('.mx');
    btnX.onmouseover = () => { btnX.style.background = 'var(--choco-gold)'; btnX.style.color = '#000'; };
    btnX.onmouseout = () => { btnX.style.background = 'transparent'; btnX.style.color = 'var(--choco-gold)'; };
    btnX.onclick = () => modalProf.classList.remove('active');
}
