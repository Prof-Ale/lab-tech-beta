/**
 * main.js — v13.2 "LabTech Sniper Pace"
 * Prioridade: Fim das Race Conditions + Ritmo Dinâmico (Overlap).
 * Fluxo: Diagnóstico -> HUD -> ADA (Background) + Canvas (Espera Pulo) -> Liberação.
 */
import { G } from './engine/gameState.js';
import { selQ, limparHistoricoSessao, carregarBancoDeQuestoes } from './engine/selector.js';
import { analisarAlternativa, registrarErro } from './engine/diagnostic-engine.js';
import { renderCv, setAnimando, animarArcos } from './game-engine.js';
import { AudioCtrl } from './engine/audioController.js'; 
import { updHUD, narrarContexto, toggleVoz, exibirGameOver } from './ui-manager.js';
import { initDebugMode, setDebug } from './engine/debug-mode.js';
import { carregarPerfil, salvarPerfil, registrarEvolucaoLongitudinal, gerarMicroIntervencao, extrairRelatorioProfessor } from './engine/cognitive-profile.js';

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

    // Cabeçalho com o botão de Exportar
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

        // O Médico dá o diagnóstico
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

    html += `</div>`; // Fecha a div com scroll
    content.innerHTML = html;

    // Conecta o clique do botão ao gerador de CSV
    const btnCsv = $('btn-export-csv');
    if (btnCsv) {
        btnCsv.onclick = exportarCSV;
    }
}

// O Gerador de CSV (Pode colar logo abaixo do atualizarDashboard)
function exportarCSV() {
    if (!G.historico) return;
    let csv = "Habilidade BNCC;Acertos;Erros de Conceito;Erros de Calculo;Precisao (%)\n";
    
    Object.entries(G.historico).forEach(([hab, dados]) => {
        const total = (dados.acertos || 0) + (dados.erros_conceito || 0) + (dados.erros_calculo || 0);
        if (total === 0) return;
        const txAcerto = Math.round(((dados.acertos || 0) / total) * 100);
        csv += `${hab};${dados.acertos || 0};${dados.erros_conceito || 0};${dados.erros_calculo || 0};${txAcerto}%\n`;
    });

    // Mágica do navegador para forçar download
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

    // --- MAGIA AQUI: O despertar da memória de longo prazo ---
    G.perfilCognitivo = carregarPerfil(G.nome, G.turma);

    AudioCtrl.init();
    AudioCtrl.play();

    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
    $('block-selector')?.classList.remove('hidden');
    $('ada-command-post')?.classList.remove('active'); 

    // --- A ADA REAGE AO PERFIL DO ALUNO ---
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
    
    // --- NOVO: Atualiza os dados do Modal de Perfil silenciosamente ---
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

    const hab = q.bncc || "Geral";
    if (!G.historico[hab]) G.historico[hab] = { acertos: 0, erros_conceito: 0, erros_calculo: 0 };

   if (analise.correto) {
        G.acertos++; G.combo++;
        G.historico[hab].acertos++;
        
        // --- NOVO: SISTEMA DE RPG (GANHO DE XP E LEVEL UP) ---
        if (G.perfilCognitivo) {
            // Se o perfil antigo não tiver XP, inicializa agora
            if (G.perfilCognitivo.xp === undefined) {
                G.perfilCognitivo.xp = 0;
                G.perfilCognitivo.nivel = 1;
            }

            // Ganha 10 XP base + 5 XP extra por cada ponto de Combo
            const ganhoXp = 10 + (G.combo * 5); 
            G.perfilCognitivo.xp += ganhoXp;

            // Curva de Nível: Precisa de 100 XP pro Lvl 2, 200 pro Lvl 3, etc.
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

    // --- LEITURA DO ESTADO PARA A ANIMAÇÃO ---
    let modoGrafico = 'normal';
    if (G.perfilCognitivo && G.perfilCognitivo.errosHistoricos.conceito >= 3) modoGrafico = 'visual';
    if (G.combo >= 3) modoGrafico = 'abstrato';

    // Dispara a animação passando o humor da tela
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
/* ============================================================ */

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
    
    // --- MÁGICA AQUI: Define como o Canvas vai nascer ---
    let modoGrafico = 'normal';
    if (G.perfilCognitivo && G.perfilCognitivo.errosHistoricos.conceito >= 3) {
        modoGrafico = 'visual'; // Aluno tem bloqueio de base, liga âncora visual
    }
    if (G.combo >= 3) {
        modoGrafico = 'abstrato'; // Aluno tá em flow, esconde a régua pra forçar cálculo
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
        await carregarBancoDeQuestoes(); 
        console.log("✅ [SISTEMA] Banco carregado e pronto para o combate!");
    } catch (e) {
        console.error("❌ [SISTEMA] Falha catastrófica ao carregar questões:", e);
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

    // --- ATALHO SECRETO: Painel do Professor (Alt + P) ---
    document.addEventListener('keydown', (e) => {
        if (e.altKey && e.key.toLowerCase() === 'p') {
            if (!G.perfilCognitivo) {
                alert("Identifique um aluno primeiro para carregar o mapa cognitivo.");
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
    
    // --- NOVO: Botão de Reconectar no Game Over ---
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
   PAINEL DO PROFESSOR (Alt + P)
   ============================================================ */
function gerarPainelProfessor() {
    const dados = extrairRelatorioProfessor(G.perfilCognitivo);
    
    let modalProf = $('m-professor');
    if (!modalProf) {
        modalProf = document.createElement('div');
        modalProf.id = 'm-professor';
        modalProf.className = 'modal'; 
        document.body.appendChild(modalProf);
    }

    modalProf.innerHTML = `
        <div class="mc" style="max-width: 500px; border: 2px solid var(--choco-gold); background: #060610; position: relative;">
            
            <button class="mx" style="position: absolute; top: 15px; right: 15px; background: transparent; color: var(--choco-gold); border: 1px solid var(--choco-gold); border-radius: 50%; width: 30px; height: 30px; font-size: 14px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: 0.2s; padding: 0;">✕</button>

            <h2 style="color:var(--choco-gold); border-bottom: 1px solid; padding-bottom: 10px; margin-top: 0; padding-right: 30px;">MAPA COGNITIVO: ${dados.identificacao}</h2>
            
            <div style="text-align:left; margin-top:20px; font-family: monospace; font-size:12px;">
                <p>📊 <strong>Histórico Longitudinal:</strong></p>
                <ul style="list-style:none; padding:0; color: var(--neon-cyan);">
                    <li>• Ativo há: ${dados.tempoVida} dias</li>
                    <li>• Desafios vencidos: ${dados.totalResolvidas}</li>
                </ul>

                <p style="margin-top:15px;">🔍 <strong>Natureza das Falhas (Acumulado):</strong></p>
                <div style="display:flex; gap:10px; height:20px; background:#222; border-radius:10px; overflow:hidden; margin-bottom:5px;">
                    <div style="width:${dados.distribuicaoErros.conceito}%; background:var(--neon-red);" title="Conceito"></div>
                    <div style="width:${dados.distribuicaoErros.procedimento}%; background:#ffbb33;" title="Procedimento"></div>
                    <div style="width:${dados.distribuicaoErros.calculo}%; background:var(--neon-green);" title="Cálculo"></div>
                </div>
                <div style="font-size:10px; display:flex; justify-content:space-between; opacity:0.7;">
                    <span>Conceito (${dados.distribuicaoErros.conceito}%)</span>
                    <span>Cálculo (${dados.distribuicaoErros.calculo}%)</span>
                </div>

                <p style="margin-top:15px;">🚩 <strong>Alertas de Habilidade (Febre):</strong></p>
                ${dados.pontosCriticos.length > 0 ? 
                    dados.pontosCriticos.map(([hab, score]) => `
                        <div style="display:flex; justify-content:space-between; margin-bottom:4px; color: ${score > 5 ? 'var(--neon-red)' : 'white'}">
                            <span>${hab}</span>
                            <span>Intensidade: ${score.toFixed(1)}</span>
                        </div>
                    `).join('') : '<p style="color:var(--neon-green)">Nenhuma defasagem crítica registrada.</p>'
                }
            </div>
        </div>
    `;

    modalProf.classList.add('active');
    
    const btnX = modalProf.querySelector('.mx');
    btnX.onmouseover = () => { btnX.style.background = 'var(--choco-gold)'; btnX.style.color = '#000'; };
    btnX.onmouseout = () => { btnX.style.background = 'transparent'; btnX.style.color = 'var(--choco-gold)'; };
    btnX.onclick = () => modalProf.classList.remove('active');
}
