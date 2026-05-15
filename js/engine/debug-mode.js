/**
 * debug-mode.js — v1.0 "LabTech X-Ray"
 * Painel flutuante de engenharia para monitoramento em tempo real.
 * Ativação secreta: Pressione as teclas [Alt] + [D] no teclado.
 */

import { G } from './gameState.js';

// Objeto global para receber dados dos outros módulos
window.__LABTECH_DEBUG__ = {
    qId: '-', qTipo: '-', qBncc: '-', qDif: '-', 
    jumpDelta: '-', adaState: 'Ociosa'
};

export function initDebugMode() {
    // 1. Cria a janela do painel dinamicamente
    const painel = document.createElement('div');
    painel.id = 'labtech-debug-panel';
    painel.style.cssText = `
        position: fixed; top: 15px; left: 15px; width: 280px;
        background: rgba(0, 5, 15, 0.9); border: 1px solid var(--neon-cyan, #00eaff);
        color: #00eaff; font-family: monospace; font-size: 11px;
        padding: 15px; border-radius: 8px; z-index: 999999;
        pointer-events: none; display: none; box-shadow: 0 0 15px rgba(0, 234, 255, 0.3);
    `;
    document.body.appendChild(painel);

    // 2. Cria o ouvinte do atalho secreto (Alt + D)
    document.addEventListener('keydown', (e) => {
        if (e.altKey && e.key.toLowerCase() === 'd') {
            const atual = painel.style.display;
            painel.style.display = atual === 'none' ? 'block' : 'none';
            if (painel.style.display === 'block') renderizarDebug();
        }
    });

    // 3. Inicia o loop de atualização (a cada 300ms)
    setInterval(renderizarDebug, 300);
    console.log("🛠️ [LabTech Debug] Painel de Engenharia injetado. Pressione Alt + D para abrir.");
}

// Atualiza um dado específico no painel
export function setDebug(chave, valor) {
    if (window.__LABTECH_DEBUG__) {
        window.__LABTECH_DEBUG__[chave] = valor;
    }
}

// Desenha as informações na tela
function renderizarDebug() {
    const painel = document.getElementById('labtech-debug-panel');
    if (!painel || painel.style.display === 'none') return;

    const d = window.__LABTECH_DEBUG__;
    
    painel.innerHTML = `
        <div style="font-weight:900; text-align:center; margin-bottom:10px; border-bottom:1px solid #00eaff; padding-bottom:5px; text-transform:uppercase;">
            ⚙️ Modo Engenheiro
        </div>
        <div style="display:flex; flex-direction:column; gap:6px;">
            <p><b>[STATE]</b> Módulo: ${G.currentBlock || '-'} | Vida: ${Math.round(G.vida || 0)}</p>
            <p><b>[QUESTÃO]</b> ID: ${d.qId}</p>
            <p><b>[TIPO]</b> ${d.qTipo}</p>
            <p><b>[TAXONOMIA]</b> BNCC: ${d.qBncc} | Peso: ${d.qDif}</p>
            <p><b>[MOTOR]</b> Último Salto (Delta): ${d.jumpDelta}</p>
            <p><b>[ADA]</b> ${d.adaState}</p>
        </div>
        <div style="margin-top:10px; border-top:1px dashed #00eaff; padding-top:5px; opacity:0.6; text-align:center; font-size:9px;">
            Atalho: Alt + D para fechar
        </div>
    `;
}
