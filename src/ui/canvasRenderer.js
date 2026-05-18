/**
 * @fileoverview CanvasRenderer.js
 * @description Motor Gráfico Modular do LabTech (DUA).
 * Rastreia e renderiza Isomorfismos Matemáticos na Reta Numérica e Frações.
 * CORREÇÃO V15.3: Failsafe Sincronizado de Animação e Blindagem Matemática Total.
 * @version 3.3.0
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
        const style = getComputedStyle(this.canvas);
        this.W = parseInt(style.width);
        this.H = parseInt(style.height);
        this.dpi = window.devicePixelRatio || 1;

        if (this.canvas.width !== this.W * this.dpi) {
            this.canvas.width = this.W * this.dpi;
            this.canvas.height = this.H * this.dpi;
            this.ctx.scale(this.dpi, this.dpi);
        }
    }

    _limpar() {
        if (this.ctx) this.ctx.clearRect(0, 0, this.W, this.H);
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

        // 🧠 Triage Inteligente: Pula reta numérica para questões literárias (Álgebra)
        let rep = representacao;
        const strA = String(questao.a || questao.valorInicial);
        if (rep === 'visual' && strA.match(/[a-zA-Z]/)) rep = 'algebra';

        try {
            if (rep === 'reta' || rep === 'abstrato') {
                this._desenharRetaNumerica(questao, rep);
            } else if (rep === 'visual') {
                this._desenharFraçãoBarra(questao);
            } else {
                this._desenharFallback(questao);
            }
        } catch(e) {
            console.error("[CanvasRenderer] Erro contornado:", e);
            this._desenharFallback(questao);
        }
    }

    _desenharRetaNumerica(q, modo) {
        const ctx = this.ctx;
        const Y_RET = this.H * 0.7;
        const PADDING_W = 60;

        // Viewport Matemático robusto
        let valMin = 0;
        const strA = String(q.a || q.valorInicial);
        if (String(q.display).includes('-') || strA.includes('-')) valMin = -10;

        const valA_Math = parseFloat(strA.replace(/[^\d.-]/g, '')) || 0;
        const valRes_Math = parseFloat(String(q.res).replace(/[^\d.-]/g, '')) || 0;
        const valAlt_Math = parseFloat(String(q.alternativas?.[0]?.valor).replace(/[^\d.-]/g, '')) || 0;
        
        const valMax = Math.max(10, valA_Math, valRes_Math, valAlt_Math);
        
        ctx.beginPath(); ctx.strokeStyle = '#222'; ctx.lineWidth = 4;
        ctx.moveTo(PADDING_W, Y_RET); ctx.lineTo(this.W - PADDING_W, Y_RET); ctx.stroke();

        if (valA_Math !== 0) {
            ctx.beginPath(); ctx.strokeStyle = this.cores.gold; ctx.lineWidth = (modo === 'reta' ? 6 : 2);
            const x0 = this._mapX(0, valMin, valMax, PADDING_W);
            const xA = this._mapX(valA_Math, valMin, valMax, PADDING_W);
            ctx.moveTo(x0, Y_RET); ctx.lineTo(xA, Y_RET); ctx.stroke();
        }

        if (modo === 'reta') {
            this._desenharTicksReta(valMin, valMax, PADDING_W, Y_RET);
        }

        this._desenharPonto(valA_Math, valMin, valMax, PADDING_W, Y_RET, this.cores.gold, 'A');
    }

    _desenharTicksReta(min, max, padding, y) {
        const ctx = this.ctx;
        ctx.fillStyle = '#444'; ctx.font = '12px monospace'; ctx.textAlign = 'center';
        const range = max - min;
        let step = 1; if (range > 20) step = 5; if (range > 100) step = 10;

        for (let i = min; i <= max; i += step) {
            const x = this._mapX(i, min, max, padding);
            if (!isFinite(x)) continue;
            
            ctx.fillRect(x, y - 5, 1, 10);
            if (i === 0 || i === min || i === max || i % step === 0) {
                ctx.fillStyle = this.cores.subt; ctx.fillText(i, x, y + 25); ctx.fillStyle = '#444';
            }
        }
    }

    _desenharPonto(val, min, max, padding, y, cor, label) {
        const x = this._mapX(val, min, max, padding);
        if (!isFinite(x) || isNaN(x)) return; // Failsafe Vital

        this.ctx.beginPath();
        this.ctx.fillStyle = '#111'; this.ctx.strokeStyle = cor; this.ctx.lineWidth = 3;
        this.ctx.arc(x, y, 8, 0, Math.PI * 2);
        this.ctx.fill(); this.ctx.stroke();

        this.ctx.font = 'bold 12px Orbitron'; this.ctx.fillStyle = cor; ctx.textAlign = 'center';
        this.ctx.fillText(label, x, y - 13);
    }

    _desenharFraçãoBarra(q) {
        const barW = this.W * 0.8; const barH = 50;
        const x = (this.W - barW) / 2; const y = (this.H - barH) / 2;
        const num = parseFloat(String(q.a).replace(/[^\d.-]/g, '')) || 0;
        const den = parseFloat(String(q.b || q.fim).replace(/[^\d.-]/g, '')) || 1;

        this.ctx.fillStyle = '#111'; this.ctx.fillRect(x, y, barW, barH);
        this.ctx.fillStyle = this.cores.gold; this.ctx.fillRect(x, y, barW * (num/Math.max(1, den)), barH);
        this.ctx.strokeStyle = '#444'; this.ctx.strokeRect(x, y, barW, barH);
    }

    _desenharFallback(q) {
        this.ctx.fillStyle = this.cores.subt; this.ctx.textAlign = 'center'; this.ctx.font = '14px Nunito';
        this.ctx.fillText("Análise Semiótica em Processamento...", this.W/2, this.H/2);
    }

    // =========================================================================
    // ─── MÉTODOS DE ANIMAÇÃO DINÂMICA (animarArcos) ───
    // =========================================================================

    /**
     * 🧠 A NOVA CURA: Sincronismo total e failsafe anti-travamento.
     * @returns {Promise<void>} Resolvida SEMPRE que a animação acaba ou falha.
     */
    async animarArcos(questao, deslocamento, representacao) {
        this._autoresize();
        const ctx = this.ctx;
        
        // Proteção contra chamadas redundantes
        if (!ctx || this.isAnimating) { return; }

        // Triage: Pula animação para frações ou álgebra literal
        const strA = String(questao.a || questao.valorInicial);
        if (representacao === 'visual' || strA.match(/[a-zA-Z]/)) { return; }

        this.isAnimating = true; // 🔐 Tranca o estado
        const startTime = performance.now();

        // Viewport Matemático idêntico ao renderCv
        let valMin = 0; if (String(questao.display).includes('-') || strA.includes('-')) valMin = -10;
        const valA_Math = parseFloat(strA.replace(/[^\d.-]/g, '')) || 0;
        const valRes_Math = parseFloat(String(questao.res).replace(/[^\d.-]/g, '')) || 0;
        const valAlt_Math = parseFloat(String(questao.alternativas?.[0]?.valor).replace(/[^\d.-]/g, '')) || 0;
        const valDest_Math = valA_Math + (parseFloat(String(deslocamento).replace(/[^\d.-]/g, '')) || 0);

        const valMax = Math.max(10, valA_Math, valRes_Math, valAlt_Math, valDest_Math);
        const PADDING_W = 60;
        const Y_RET = this.H * 0.7;

        // Pontos em pixel centrados
        const startX = this._mapX(valA_Math, valMin, valMax, PADDING_W);
        const endX = this._mapX(valDest_Math, valMin, valMax, PADDING_W);

        // Failsafe vital se a matemática quebrar
        if (!isFinite(startX) || !isFinite(endX)) { this.isAnimating = false; return; }

        // Mapeamento Bézier
        const distPx = Math.abs(endX - startX);
        const arcH = Math.min(this.H * 0.6, Math.max(30, distPx * 0.8));
        const cpX = (startX + endX) / 2;
        const cpY = Y_RET - arcH;

        // Retorna a Promise que o maestro (main.js) está esperando
        return new Promise((resolve) => {
            const DURACAO = 600;

            const anim = (now) => {
                const elapsed = now - startTime;
                const p = Math.min(1, elapsed / DURACAO);
                const pEase = p * (2 - p);

                try {
                    this._limpar();
                    this._desenharRetaNumerica(questao, representacao);

                    ctx.beginPath(); ctx.lineWidth = 3; ctx.strokeStyle = this.cores.cyan; ctx.moveTo(startX, Y_RET);
                    for (let i = 0.01; i <= pEase; i += 0.01) {
                        const t = i;
                        const x = Math.pow(1-t, 2) * startX + 2 * (1-t) * t * cpX + Math.pow(t, 2) * endX;
                        const y = Math.pow(1-t, 2) * Y_RET + 2 * (1-t) * t * cpY + Math.pow(t, 2) * Y_RET;
                        if(isFinite(x) && isFinite(y)) ctx.lineTo(x, y);
                    }
                    ctx.stroke();

                } catch (e) {
                    console.error("[CanvasRenderer] Erro na RAF:", e);
                    // Não para o sistema, continua a animação ou quebra para o resolve()
                }

                if (p < 1) {
                    requestAnimationFrame(anim);
                } else {
                    // 🎉 FIM DA ANIMAÇÃO. Sincroniza estado e resolve a Promise.
                    this._desenharPonto(valDest_Math, valMin, valMax, PADDING_W, Y_RET, this.cores.cyan, 'B');
                    this.isAnimating = false; // 🔓 Destranca estado
                    resolve(); // ✅ Libera o Maestro (main.js)
                }
            };

            // Inicia o pipeline de renderização
            requestAnimationFrame(anim);
        });
    }
}
