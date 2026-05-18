/**
 * @fileoverview CanvasRenderer.js
 * @description Motor Gráfico Modular do LabTech (DUA).
 * Rastreia e renderiza Isomorfismos Matemáticos na Reta Numérica e Frações.
 * CORREÇÃO V15.4: Failsafe Sincronizado, Anti-Travamento e Blindagem Matemática (Codex Refined).
 * @version 3.4.0
 * @package LabTech / UI
 */

export class CanvasRenderer {
    /**
     * @param {string} canvasId - O ID do elemento <canvas> no DOM.
     */
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            console.warn(`[CanvasRenderer] Canvas '${canvasId}' não localizado.`);
            this.ctx = null; return;
        }
        this.ctx = this.canvas.getContext('2d');
        this.cores = { gold: '#d4af37', cyan: '#00eaff', subt: '#cccccc' };
        this.isAnimating = false; // Cadeado de estado
    }

    _autoresize() {
        if (!this.canvas) return;
        const rect = this.canvas.getBoundingClientRect();
        this.W = rect.width;
        this.H = rect.height;
        this.dpi = window.devicePixelRatio || 1;

        const targetW = Math.round(this.W * this.dpi);
        const targetH = Math.round(this.H * this.dpi);

        if (this.canvas.width !== targetW || this.canvas.height !== targetH) {
            this.canvas.width = targetW;
            this.canvas.height = targetH;
            this.ctx.setTransform(this.dpi, 0, 0, this.dpi, 0, 0);
        }
    }

    _limpar() {
        if (this.ctx) {
            // Usa setTransform e resetTransform para limpar com segurança em displays Retina
            this.ctx.save();
            this.ctx.setTransform(1, 0, 0, 1, 0, 0);
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.restore();
        }
    }

    /**
     * 🛡️ BLINDAGEM MATEMÁTICA: Mapeia valor para X prevenindo NaN e Infinity.
     * @private
     */
    _mapX(value, minVal, maxVal, widthPadding) {
        if (isNaN(value) || isNaN(minVal) || isNaN(maxVal)) return this.W / 2;
        const range = maxVal - minVal;
        const usableWidth = this.W - (widthPadding * 2);
        if (range === 0 || usableWidth <= 0) return this.W / 2;
        const pct = (value - minVal) / range;
        return widthPadding + (pct * usableWidth);
    }

    // =========================================================================
    // ─── MÉTODOS DE DESENHO ESTÁTICO (renderCv) ───
    // =========================================================================

    renderCv(questao, offset, representacao) {
        this._autoresize();
        if (!this.ctx || !questao) return;
        this._limpar();

        // 🧠 TRIAGE INTELIGENTE CORRIGIDA
        let rep = representacao;
        const strA = String(questao.a ?? questao.valorInicial ?? 0);
        
        // 1. Álgebra Literal
        if (String(questao.bloco) === '4' || strA.match(/[a-zA-Z]/)) {
            rep = 'algebra';
        } 
        // 2. A Correção Crítica: O que significa 'visual'?
        else if (rep === 'visual' || rep === undefined) {
            // Se a questão tem denominador (b) ou divisor no texto, é fração (Barra).
            // Caso contrário, a interface visual básica É A RETA NUMÉRICA!
            const isFracao = questao.b !== undefined || String(questao.display).includes('/');
            if (!isFracao) {
                rep = 'reta';
            }
        }

        try {
            if (rep === 'reta' || rep === 'abstrato') {
                this._desenharRetaNumerica(questao, rep);
            } else if (rep === 'visual') {
                this._desenharFraçãoBarra(questao);
            } else if (rep === 'algebra') {
                this._desenharFallback(questao); // Álgebra não usa reta nem fração
            } else {
                this._desenharFallback(questao);
            }
        } catch(e) {
            console.error("[CanvasRenderer] Erro contornado:", e);
            this._desenharFallback(questao);
        }
    }

    _desenharRetaNumerica(q, modo) {
        const Y_RET = this.H * 0.7;
        const PADDING_W = 60;

        let valMin = 0;
        const strA = String(q.a ?? q.valorInicial ?? 0);
        if (String(q.display).includes('-') || strA.includes('-')) valMin = -10;

        const valA_Math = parseFloat(strA.replace(/[^\d.-]/g, '')) || 0;
        const valRes_Math = parseFloat(String(q.res).replace(/[^\d.-]/g, '')) || 0;
        const valAlt_Math = parseFloat(String(q.alternativas?.[0]?.valor).replace(/[^\d.-]/g, '')) || 0;
        
        const valMax = Math.max(10, valA_Math, valRes_Math, valAlt_Math);
        
        this.ctx.beginPath(); this.ctx.strokeStyle = '#222'; this.ctx.lineWidth = 4;
        this.ctx.moveTo(PADDING_W, Y_RET); this.ctx.lineTo(this.W - PADDING_W, Y_RET); this.ctx.stroke();

        if (valA_Math !== 0) {
            this.ctx.beginPath(); this.ctx.strokeStyle = this.cores.gold; this.ctx.lineWidth = (modo === 'reta' ? 6 : 2);
            const x0 = this._mapX(0, valMin, valMax, PADDING_W);
            const xA = this._mapX(valA_Math, valMin, valMax, PADDING_W);
            this.ctx.moveTo(x0, Y_RET); this.ctx.lineTo(xA, Y_RET); this.ctx.stroke();
        }

        if (modo === 'reta') {
            this._desenharTicksReta(valMin, valMax, PADDING_W, Y_RET);
        }

        this._desenharPonto(valA_Math, valMin, valMax, PADDING_W, Y_RET, this.cores.gold, 'A');
    }

    _desenharTicksReta(min, max, padding, y) {
        this.ctx.fillStyle = '#444'; this.ctx.font = '12px monospace'; this.ctx.textAlign = 'center';
        const range = max - min;
        let step = 1; if (range > 20) step = 5; if (range > 100) step = 10;

        for (let i = min; i <= max; i += step) {
            const x = this._mapX(i, min, max, padding);
            if (!isFinite(x)) continue;
            
            this.ctx.fillRect(x, y - 5, 1, 10);
            if (i === 0 || i === min || i === max || i % step === 0) {
                this.ctx.fillStyle = this.cores.subt; this.ctx.fillText(i, x, y + 25); this.ctx.fillStyle = '#444';
            }
        }
    }

    _desenharPonto(val, min, max, padding, y, cor, label) {
        const x = this._mapX(val, min, max, padding);
        if (!isFinite(x) || isNaN(x)) return;

        this.ctx.beginPath();
        this.ctx.fillStyle = '#111'; this.ctx.strokeStyle = cor; this.ctx.lineWidth = 3;
        this.ctx.arc(x, y, 8, 0, Math.PI * 2);
        this.ctx.fill(); this.ctx.stroke();

        this.ctx.font = 'bold 12px Orbitron'; 
        this.ctx.fillStyle = cor; 
        this.ctx.textAlign = 'center';
        this.ctx.fillText(label, x, y - 13);
    }

    _desenharFraçãoBarra(q) {
        const barW = this.W * 0.8; const barH = 50;
        const x = (this.W - barW) / 2; const y = (this.H - barH) / 2;
        const num = parseFloat(String(q.a ?? q.valorInicial ?? 0).replace(/[^\d.-]/g, '')) || 0;
        const den = parseFloat(String(q.b ?? q.fim ?? 1).replace(/[^\d.-]/g, '')) || 1;

        this.ctx.fillStyle = '#111'; this.ctx.fillRect(x, y, barW, barH);
        
        const ratio = Math.max(0, Math.min(1, num / Math.max(1, den)));
        
        this.ctx.fillStyle = this.cores.gold; this.ctx.fillRect(x, y, barW * ratio, barH);
        this.ctx.strokeStyle = '#444'; this.ctx.strokeRect(x, y, barW, barH);

        this.ctx.strokeStyle = '#222';
        for (let i = 1; i < den; i++) {
            this.ctx.beginPath(); this.ctx.moveTo(x + (i * barW/den), y); this.ctx.lineTo(x + (i * barW/den), y + barH); this.ctx.stroke();
        }

        this.ctx.font = 'bold 16px Orbitron'; this.ctx.fillStyle = this.cores.gold; this.ctx.textAlign = 'center';
        this.ctx.fillText(`${num} / ${den}`, this.W / 2, y - 15);
    }

    _desenharFallback(q) {
        this.ctx.fillStyle = this.cores.subt; this.ctx.textAlign = 'center'; this.ctx.font = '14px Nunito';
        this.ctx.fillText("Análise Visual Não Requerida.", this.W/2, this.H/2);
    }

    // =========================================================================
    // ─── MÉTODOS DE ANIMAÇÃO DINÂMICA (animarArcos) ───
    // =========================================================================

    async animarArcos(questao, deslocamento, representacao) {
        this._autoresize();
        if (!this.ctx || this.isAnimating) return Promise.resolve();

        // 🧠 TRIAGE INTELIGENTE CORRIGIDA (Replicação do renderCv)
        let rep = representacao;
        const strA = String(questao.a ?? questao.valorInicial ?? 0);
        if (String(questao.bloco) === '4' || strA.match(/[a-zA-Z]/)) rep = 'algebra';
        else if (rep === 'visual' || rep === undefined) {
            const isFracao = questao.b !== undefined || String(questao.display).includes('/');
            if (!isFracao) rep = 'reta';
        }

        // Pula animação geométrica para Álgebra e Frações
        if (rep === 'visual' || rep === 'algebra') return Promise.resolve();

        this.isAnimating = true;
        const startTime = performance.now();

        let valMin = 0; if (String(questao.display).includes('-') || strA.includes('-')) valMin = -10;
        const valA_Math = parseFloat(strA.replace(/[^\d.-]/g, '')) || 0;
        const valRes_Math = parseFloat(String(questao.res).replace(/[^\d.-]/g, '')) || 0;
        const valAlt_Math = parseFloat(String(questao.alternativas?.[0]?.valor).replace(/[^\d.-]/g, '')) || 0;
        const valDest_Math = valA_Math + (parseFloat(String(deslocamento).replace(/[^\d.-]/g, '')) || 0);

        const valMax = Math.max(10, valA_Math, valRes_Math, valAlt_Math, valDest_Math);
        const PADDING_W = 60;
        const Y_RET = this.H * 0.7;

        const startX = this._mapX(valA_Math, valMin, valMax, PADDING_W);
        const endX = this._mapX(valDest_Math, valMin, valMax, PADDING_W);

        if (!isFinite(startX) || !isFinite(endX)) { this.isAnimating = false; return Promise.resolve(); }

        const distPx = Math.abs(endX - startX);
        const arcH = Math.min(this.H * 0.6, Math.max(30, distPx * 0.8));
        const cpX = (startX + endX) / 2;
        const cpY = Y_RET - arcH;

        return new Promise((resolve) => {
            const DURACAO = 600;

            const anim = (now) => {
                const elapsed = now - startTime;
                const p = Math.min(1, elapsed / DURACAO);
                const pEase = p * (2 - p);

                try {
                    this._limpar();
                    this._desenharRetaNumerica(questao, rep);

                    this.ctx.beginPath(); this.ctx.lineWidth = 3; this.ctx.strokeStyle = this.cores.cyan; this.ctx.moveTo(startX, Y_RET);
                    for (let i = 0.01; i <= pEase; i += 0.01) {
                        const t = i;
                        const x = Math.pow(1-t, 2) * startX + 2 * (1-t) * t * cpX + Math.pow(t, 2) * endX;
                        const y = Math.pow(1-t, 2) * Y_RET + 2 * (1-t) * t * cpY + Math.pow(t, 2) * Y_RET;
                        if(isFinite(x) && isFinite(y)) this.ctx.lineTo(x, y);
                    }
                    this.ctx.stroke();
                } catch (e) {
                    console.error(e);
                }

                if (p < 1) {
                    requestAnimationFrame(anim);
                } else {
                    this._desenharPonto(valDest_Math, valMin, valMax, PADDING_W, Y_RET, this.cores.cyan, 'B');
                    this.isAnimating = false; 
                    resolve(); 
                }
            };
            requestAnimationFrame(anim);
        });
    
    }
}
