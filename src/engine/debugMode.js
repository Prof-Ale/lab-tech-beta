/**
 * @fileoverview debugMode.js
 * @description Painel flutuante de telemetria "X-Ray" para depuração em tempo real.
 * EVOLUÇÃO: Sincronizado com a Single Source of Truth (G) e Motor de Confiança.
 * Ativação: Pressione [Alt] + [D] no terminal.
 * @version 2.1.0
 * @package LabTech / Engine Architecture
 */

import { G } from './gameState.js';

// Objeto global para metadados efêmeros que não pertencem ao gameState (ex: IDs de tela)
window.__LABTECH_DEBUG__ = {
    qId: '-',
    qBncc: '-',
    latenciaUltima: '-'
};

let intervaloAtualizacao = null;

/**
 * Inicializa o ciclo de vida do painel de engenharia injetando os listeners no DOM.
 */
export function initDebugMode() {
    // 1. Criação dinâmica do container flutuante
    const painel = document.createElement('div');
    painel.id = 'labtech-debug-panel';
    painel.style.cssText = `
        position: fixed; top: 15px; left: 15px; width: 310px;
        background: rgba(4, 6, 18, 0.95); border: 1px solid var(--neon-cyan, #00eaff);
        color: var(--neon-cyan, #00eaff); font-family: monospace; font-size: 11px;
        padding: 15px; border-radius: 6px; z-index: 999999;
        display: none; box-shadow: 0 0 20px rgba(0, 234, 255, 0.2);
        line-height: 1.5; pointer-events: auto; user-select: text;
    `;
    document.body.appendChild(painel);

    // 2. Interceptador de atalho de teclado (Alt + D)
    document.addEventListener('keydown', (e) => {
        if (e.altKey && e.key.toLowerCase() === 'd') {
            const estaInvisivel = painel.style.display === 'none';
            
            if (estaInvisivel) {
                painel.style.display = 'block';
                renderizarDebug();
                // Inicia o loop de renderização APENAS quando o painel for aberto
                intervaloAtualizacao = setInterval(renderizarDebug, 350);
            } else {
                painel.style.display = 'none';
                // Derruba o intervalo imediatamente para poupar memória e processamento
                if (intervaloAtualizacao) {
                    clearInterval(intervaloAtualizacao);
                    intervaloAtualizacao = null;
                }
            }
        }
    });

    console.log("🛠️ [X-Ray] Terminal de Engenharia instanciado. Pressione Alt+D para ativar.");
}

/**
 * Atualiza metadados efêmeros de tela.
 * @param {string} chave 
 * @param {any} valor 
 */
export function setDebug(chave, valor) {
    if (window.__LABTECH_DEBUG__) {
        window.__LABTECH_DEBUG__[chave] = valor;
    }
}

/**
 * Atualiza e renderiza os nós textuais internos do painel com os dados reais do GameState.
 * @private
 */
function renderizarDebug() {
    const painel = document.getElementById('labtech-debug-panel');
    if (!painel || painel.style.display === 'none') return;

    const d = window.__LABTECH_DEBUG__;
    const pc = G.perfilCognitivo || {}; // Garantia contra nulos antes da calibração
    
    // Captura e normalização segura da Single Source of Truth
    const perfilADA = pc.perfilDominante || 'CALIBRANDO_DADOS';
    const confianca = pc.confiancaDiagnostica !== undefined ? `${pc.confiancaDiagnostica}%` : '0%';
    const comandoAtivo = G.adaState?.comandoInterface || 'STANDBY';
    const estagioGalperin = G.adaState?.scaffold?.representacao || 'N/A';
    
    const idxPseudoconceito = pc.indicePseudoconceito !== undefined ? `${(pc.indicePseudoconceito * 100).toFixed(1)}%` : '0.0%';
    const derivaPedagogica = pc.derivaPedagogicaGeral !== undefined ? pc.derivaPedagogicaGeral.toFixed(2) : '0.00';

    painel.innerHTML = `
        <div style="font-weight:900; text-align:center; margin-bottom:10px; border-bottom:1px solid var(--neon-cyan, #00eaff); padding-bottom:5px; letter-spacing: 1px;">
            ⚙️ TERMINAL ENGENHARIA X-RAY
        </div>
        <div style="display:flex; flex-direction:column; gap:4px;">
            <p><span style="color:#fff;">[REATOR]</span> Bloco: ${G.currentBlock || '-'} | Integridade: ${Math.round(G.vida || 0)}%</p>
            <p><span style="color:#fff;">[SENSOR]</span> ID Item: ${d.qId}</p>
            <p><span style="color:#fff;">[CURRÍCULO]</span> BNCC: ${d.qBncc || '-'}</p>
            <p><span style="color:#fff;">[CINÉTICA]</span> Última Latência: ${d.latenciaUltima}s</p>
            
            <hr style="border:0; border-top:1px dashed rgba(0, 234, 255, 0.3); margin: 6px 0;">
            
            <p><span style="color:var(--choco-gold, #d4af37);">[PERFIL ADA]</span> ${perfilADA}</p>
            <p><span style="color:var(--choco-gold, #d4af37);">[CERTEZA DA IA]</span> ${confianca}</p>
            <p><span style="color:var(--choco-gold, #d4af37);">[MANOBRA ATUAL]</span> ${comandoAtivo}</p>
            
            <hr style="border:0; border-top:1px dashed rgba(0, 234, 255, 0.3); margin: 6px 0;">
            
            <p><span style="color:#ffbb33;">[RISCO PSEUDOCONCEITO]</span> ${idxPseudoconceito}</p>
            <p><span style="color:#ffbb33;">[DERIVA PEDAGÓGICA]</span> ${derivaPedagogica}</p>
            <p><span style="color:#ffbb33;">[SUPORTE GALPERIN]</span> ${estagioGalperin}</p>
        </div>
        <div style="margin-top:12px; border-top:1px solid rgba(0, 234, 255, 0.3); padding-top:6px; opacity:0.5; text-align:center; font-size:9px;">
            Atalho ativo: Alt + D para fechar terminal
        </div>
    `;
}
