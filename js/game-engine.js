/**
 * js/game-engine.js — Versão 8.1 "Adaptive Engine"
 * Motor de Renderização com Camadas Cognitivas.
 * INTERVENÇÃO: O Canvas agora muda de forma baseado no perfil (Visual vs Abstrato).
 */

let animState = 0;
let isAnimating = false;
let currentQ = null;
let currentB = null; 
let animId = null;
let resolveAnimacao = null; 
let currentModo = 'normal'; // Guarda o estado cognitivo atual

export function setAnimando(val) {
    isAnimating = val;
    if (!val) {
        animState = 0;
        if (animId) cancelAnimationFrame(animId);
        if (resolveAnimacao) {
            resolveAnimacao(); 
            resolveAnimacao = null;
        }
    }
}

export function animarArcos(q, bOverride = null, modo = 'normal') {
    return new Promise((resolve) => {
        if (!q || (q.tipo !== "reta" && q.tipo !== "sinais")) {
            resolve(); 
            return;
        }
        
        if (animId) cancelAnimationFrame(animId);
        if (resolveAnimacao) resolveAnimacao();
        resolveAnimacao = resolve;
        
        const params = getParams(q, bOverride);
        
        currentQ = q;
        currentB = params.b; 
        currentModo = modo; // Trava o modo durante o salto
        
        isAnimating = true;
        animState = 0;
        loopAnimacao();
    });
}

function loopAnimacao() {
    if (!isAnimating || !currentQ) {
        if (resolveAnimacao) resolveAnimacao();
        return;
    }
    
    animState += 0.03; 
    
    if (animState >= 1) {
        animState = 1;
        isAnimating = false;
        renderCv(currentQ, currentB, currentModo); 
        
        if (resolveAnimacao) {
            resolveAnimacao();
            resolveAnimacao = null;
        }
        return;
    }
    
    renderCv(currentQ, currentB, currentModo);
    animId = requestAnimationFrame(loopAnimacao);
}

export function renderCv(q, bOverride = null, modo = null) {
    const cv = document.getElementById("canvas-game");
    if (!cv) return;
    const ctx = cv.getContext("2d");

    if (modo) currentModo = modo;

    const parentWidth = cv.parentElement ? cv.parentElement.clientWidth : 580;
    const cssWidth = Math.min(parentWidth, 580) || 580;
    const cssHeight = 130;
    const dpr = window.devicePixelRatio || 1;
    
    cv.width = cssWidth * dpr;
    cv.height = cssHeight * dpr;
    cv.style.width = cssWidth + "px";
    cv.style.height = cssHeight + "px";
    
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, cssWidth, cssHeight);

    if (q && (q.tipo === "reta" || q.tipo === "sinais")) {
        desenharReta(ctx, cssWidth, cssHeight);
        
        const { a, b } = getParams(q, bOverride);
        
        if (a !== undefined && b !== undefined && (isAnimating || animState > 0)) {
            desenharArco(ctx, cssWidth, cssHeight, a, b, animState);
        } else if (a !== undefined) {
            desenharPontoPartida(ctx, cssWidth, cssHeight, a);
        }
    } else {
        desenharFundoLogico(ctx, cssWidth, cssHeight);
    }
}

function getParams(q, bOverride) {
    const a = Number(q.a ?? q.inicio ?? q.valorInicial ?? 0);
    const bRaw = bOverride !== null ? bOverride : (q.b ?? q.salto ?? q.valor ?? 0);
    const b = Number(bRaw);
    return { a, b };
}

/* ========================================================
    SISTEMA DE COORDENADAS E DESENHO
   ======================================================== */

function getX(val, width) {
    const min = -10;
    const max = 10;
    const margem = 40; 
    const areaUtil = width - (margem * 2);
    const passo = areaUtil / (max - min);
    return margem + ((val - min) * passo);
}

function desenharReta(ctx, w, h) {
    const yCenter = h - 40; 
    
    // --- INTELIGÊNCIA DE RENDERIZAÇÃO: Camadas Visuais ---
    if (currentModo === 'visual') {
        ctx.save();
        // Âncora Vermelha (Dívida/Negativo)
        ctx.fillStyle = "rgba(255, 68, 68, 0.08)";
        ctx.fillRect(20, yCenter - 25, (w/2) - 20, 50);
        // Âncora Verde (Lucro/Positivo)
        ctx.fillStyle = "rgba(0, 255, 136, 0.08)";
        ctx.fillRect(w/2, yCenter - 25, (w/2) - 20, 50);
        ctx.restore();
    }

    ctx.beginPath();
    ctx.moveTo(20, yCenter);
    ctx.lineTo(w - 20, yCenter);
    ctx.strokeStyle = "rgba(0, 229, 255, 0.3)"; 
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.textAlign = "center";
    ctx.font = "bold 11px 'Nunito', sans-serif";

    for (let i = -10; i <= 10; i++) {
        const x = getX(i, w);
        ctx.beginPath();
        ctx.moveTo(x, yCenter - 6);
        ctx.lineTo(x, yCenter + 6);
        ctx.strokeStyle = (i === 0) ? "#00e5ff" : "rgba(255, 255, 255, 0.4)";
        ctx.lineWidth = (i === 0) ? 3 : 1.5;
        ctx.stroke();

        ctx.fillStyle = (i === 0) ? "#00e5ff" : "rgba(255, 255, 255, 0.8)";
        
        // --- DECISÃO DO QUE ESCREVER NA RETA ---
        let deveDesenharTexto = false;
        if (currentModo === 'abstrato') {
            deveDesenharTexto = (i === -10 || i === 0 || i === 10); // Hardcore: Esconde quase tudo
        } else if (currentModo === 'visual') {
            deveDesenharTexto = true; // Boia de salvação: Desenha todos os números
        } else {
            deveDesenharTexto = (i % 2 === 0 || i === 0); // Padrão
        }

        if (deveDesenharTexto) {
            ctx.fillText(i, x, yCenter + 22);
        }
    }
}

function desenharPontoPartida(ctx, w, h, a) {
    const startX = getX(a, w);
    const yCenter = h - 40;
    ctx.save();
    ctx.beginPath();
    ctx.arc(startX, yCenter, 7, 0, Math.PI * 2);
    ctx.fillStyle = "#00e5ff";
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#00e5ff";
    ctx.fill();
    ctx.restore();
}

function desenharArco(ctx, w, h, a, b, progresso) {
    const startX = getX(a, w);
    const destino = a + b; 
    const endX = getX(destino, w);
    
    const yCenter = h - 40;
    const alturaArco = 60; 
    const corArco = b >= 0 ? "#00ff88" : "#ff4444"; 

    ctx.save();
    
    ctx.beginPath();
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    ctx.lineWidth = 2;
    for (let t = 0; t <= 1; t += 0.05) {
        let cx = startX + (endX - startX) * t;
        let cy = yCenter - alturaArco * (1 - Math.pow(2 * t - 1, 2));
        if (t === 0) ctx.moveTo(cx, cy); else ctx.lineTo(cx, cy);
    }
    ctx.stroke();

    ctx.beginPath();
    ctx.setLineDash([]);
    ctx.strokeStyle = corArco;
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.shadowBlur = 10;
    ctx.shadowColor = corArco;

    for (let t = 0; t <= progresso; t += 0.01) {
        let cx = startX + (endX - startX) * t;
        let cy = yCenter - alturaArco * (1 - Math.pow(2 * t - 1, 2));
        if (t === 0) ctx.moveTo(cx, cy); else ctx.lineTo(cx, cy);
    }
    ctx.stroke();

    let atualX = startX + (endX - startX) * progresso;
    let atualY = yCenter - alturaArco * (1 - Math.pow(2 * progresso - 1, 2));

    ctx.beginPath();
    ctx.arc(atualX, atualY, 8, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.strokeStyle = corArco;
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.restore();
}

function desenharFundoLogico(ctx, w, h) {
    ctx.save();
    ctx.fillStyle = "rgba(0, 229, 255, 0.03)";
    ctx.fillRect(10, h/2 - 20, w - 20, 40);
    ctx.textAlign = "center";
    ctx.font = "italic 13px 'Nunito'";
    ctx.fillStyle = "rgba(0, 229, 255, 0.5)";
    ctx.fillText("SISTEMA DE PROCESSAMENTO ATIVO", w / 2, h / 2 + 5);
    ctx.restore();
}
