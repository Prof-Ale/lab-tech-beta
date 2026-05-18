/**
 * @fileoverview CanvasRenderer.js
 * @description Motor Gráfico Modular do LabTech (DUA).
 * CORREÇÃO V15.2: Blindagem Anti-NaN (Not a Number), Failsafe de Animação
 * e Renderização específica para Álgebra (Sistemas de Equações).
 * @version 3.2.0
 * @package LabTech / UI
 */

export class CanvasRenderer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
        this.id = canvasId;
        this.cores = { gold: '#d4af37', cyan: '#00eaff', subt: '#cccccc' };
        this.isAnimating = false;
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
     * 🛡️ BLINDAGEM ANTI-NaN: Extrai apenas números seguros de textos como "x=7, y=3"
     */
    _safeFloat(val) {
        if (val === undefined || val === null) return 0;
        const parsed = parseFloat(String(val).replace(/[^\d.-]/g, ''));
        return isNaN(parsed) ? 0 : parsed;
    }

    _mapX(value, minVal, maxVal, widthPadding) {
        if (isNaN(value) || isNaN(minVal) || isNaN(maxVal)) return this.W / 2; // Failsafe
        const range = maxVal - minVal;
        const usableWidth = this.W - (widthPadding * 2);
        if (range === 0) return this.W / 2;
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

        // 🧠 INTELIGÊNCIA DE RENDERIZAÇÃO: Proteção para questões de Álgebra
        let repFinal = representacao;
        if (String(questao.bloco) === '4' || String(questao.display).includes('x +') || String(questao.display).includes('y =')) {
            repFinal = 'algebra';
        }

        try {
            if (repFinal === 'reta' || repFinal === 'abstrato') {
                this._desenharRetaNumerica(questao, repFinal);
            } else if (repFinal === 'visual') {
                this._desenharFraçãoBarra(questao);
            } else if (repFinal === 'algebra') {
                this._desenharAlgebra(questao);
            } else {
                this._desenharFallback(questao);
            }
        } catch(e) {
            console.error("[CanvasRenderer] Erro contornado. Acionando Fallback:", e);
            this._desenharFallback(questao);
        }
    }

    _desenharAlgebra(q) {
        const ctx = this.ctx;
        ctx.fillStyle = this.cores.cyan;
        ctx.textAlign = 'center';
        ctx.font = 'bold 20px Orbitron';
        ctx.fillText("MODELAGEM ALGÉBRICA", this.W / 2, this.H / 2 - 10);
        
        ctx.fillStyle = this.cores.subt;
        ctx.font = '14px Nunito';
        ctx.fillText("A representação visual ocorre no painel principal.", this.W / 2, this.H / 2 + 15);
    }

    _desenharRetaNumerica(q, modo) {
        const ctx = this.ctx;
        const Y_RET = this.H * 0.7;
        const PADDING_W = 60;

        let valMin = 0;
        const strA = String(q.a || q.valorInicial);
        if (String(q.display).includes('-') || strA.includes('-')) valMin = -10;

        // Cálculos seguros com _safeFloat
        const valA_Math = this._safeFloat(q.a || q.valorInicial);
        const valRes = this._safeFloat(q.res);
        const valAlt = this._safeFloat(q.alternativas?.[0]?.valor);
        const valMax = Math.max(10, valRes, valA_Math, valAlt);

        ctx.beginPath();
        ctx.strokeStyle = '#222';
        ctx.lineWidth = 4;
        ctx.moveTo(PADDING_W, Y_RET);
        ctx.lineTo(this.W - PADDING_W, Y_RET);
        ctx.stroke();

        if (valA_Math !== 0) {
            ctx.beginPath();
            ctx.strokeStyle = this.cores.gold;
            ctx.lineWidth = modo === 'reta' ? 6 : 2;
            const x0 = this._mapX(0, valMin, valMax, PADDING_W);
            const xA = this._mapX(valA_Math, valMin, valMax, PADDING_W);
            ctx.moveTo(x0, Y_RET);
            ctx.lineTo(xA, Y_RET);
            ctx.stroke();
        }

        if (modo === 'reta') {
            this._desenharTicksReta(valMin, valMax, PADDING_W, Y_RET);
        }

        this._desenharPonto(valA_Math, valMin, valMax, PADDING_W, Y_RET, this.cores.gold, 'A');
    }

    _desenharTicksReta(min, max, padding, y) {
        const ctx = this.ctx;
        ctx.fillStyle = '#444'; ctx.font = '12px monospace'; ctx.textAlign = 'center';
        const tickH = 10;
        const range = max - min;
        let step = 1;
        if (range > 20) step = 5;
        if (range > 100) step = 10;

        for (let i = min; i <= max; i += step) {
            const x = this._mapX(i, min, max, padding);
            if(isNaN(x)) continue; // Ignora se o cálculo matemático falhar
            
            ctx.fillRect(x, y - (tickH / 2), 1, tickH);
            if (i === 0 || i === min || i === max || i % step === 0) {
                ctx.fillStyle = this.cores.subt;
                ctx.fillText(i, x, y + 25);
                ctx.fillStyle = '#444';
            }
        }
    }

    _desenharPonto(val, min, max, padding, y, cor, label) {
        const ctx = this.ctx;
        const x = this._mapX(val, min, max, padding);
        if (isNaN(x) || !isFinite(x)) return; // Failsafe Vital!

        const raio = 8;
        ctx.beginPath();
        ctx.fillStyle = '#111';
        ctx.strokeStyle = cor;
        ctx.lineWidth = 3;
        ctx.arc(x, y, raio, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        ctx.font = 'bold 12px Orbitron';
        ctx.fillStyle = cor;
        ctx.fillText(label, x, y - raio - 5);
    }

    _desenharFraçãoBarra(q) {
        const ctx = this.ctx;
        const barW = this.W * 0.8;
        const barH = 50;
        const x = (this.W - barW) / 2;
        const y = (this.H - barH) / 2;

        const num = this._safeFloat(q.a) || 0;
        let den = this._safeFloat(q.b) || this._safeFloat(q.fim) || 1;
        if (den === 0) den = 1; // Proteção contra divisão por zero

        ctx.fillStyle = '#111'; ctx.fillRect(x, y, barW, barH);
        ctx.fillStyle = this.cores.gold; ctx.fillRect(x, y, barW * (num/den), barH);
        ctx.strokeStyle = '#444'; ctx.strokeRect(x, y, barW, barH);

        ctx.strokeStyle = '#222';
        for (let i = 1; i < den; i++) {
            ctx.beginPath(); ctx.moveTo(x + (i * barW/den), y); ctx.lineTo(x + (i * barW/den), y + barH); ctx.stroke();
        }

        ctx.font = 'bold 16px Orbitron'; ctx.fillStyle = this.cores.gold; ctx.textAlign = 'center';
        ctx.fillText(`${num} / ${den}`, this.W / 2, y - 15);
    }

    _desenharFallback(q) {
        const ctx = this.ctx;
        ctx.fillStyle = this.cores.subt; ctx.textAlign = 'center'; ctx.font = '14px Nunito';
        ctx.fillText("Análise Semiótica em Processamento...", this.W/2, this.H/2);
    }

    // =========================================================================
    // ─── MÉTODOS DE ANIMAÇÃO DINÂMICA (animarArcos) ───
    // =========================================================================

    async animarArcos(questao, deslocamento, representacao) {
        this._autoresize();
        
        // Avaliação inteligente de modo (Pula animação geométrica para Álgebra e Frações)
        let rep = representacao;
        if (String(questao.bloco) === '4' || String(questao.display).includes('x +')) rep = 'algebra';
        if (!this.ctx || this.isAnimating || rep === 'visual' || rep === 'algebra') return;
        
        this.isAnimating = true;

        try {
            const DURACAO_MS = 600;
            const PADDING_W = 60;
            const Y_RET = this.H * 0.7;

            let valMin = 0;
            if (String(questao.display).includes('-') || String(questao.a).includes('-')) valMin = -10;

            const valA_Math = this._safeFloat(questao.a || questao.valorInicial);
            const valDestino_Math = valA_Math + this._safeFloat(deslocamento);
            const valRes = this._safeFloat(questao.res);
            const valAlt = this._safeFloat(questao.alternativas?.[0]?.valor);
            const valMax = Math.max(10, valRes, valA_Math, valAlt, valDestino_Math);

            const startX = this._mapX(valA_Math, valMin, valMax, PADDING_W);
            const endX = this._mapX(valDestino_Math, valMin, valMax, PADDING_W);

            if (isNaN(startX) || isNaN(endX)) return;

            const distanciaPx = Math.abs(endX - startX);
            const ALTURA_MAXIMA_ARCO = this.H * 0.6;
            const arcH = Math.min(ALTURA_MAXIMA_ARCO, Math.max(30, distanciaPx * 0.8));

            const cpX = (startX + endX) / 2;
            const cpY = Y_RET - arcH;

            const startTime = performance.now();

            // Usando Promise para garantir sincronia temporal estrita
            await new Promise(resolve => {
                const anim = (now) => {
                    const elapsed = now - startTime;
                    const p = Math.min(1, elapsed / DURACAO_MS);
                    const pEase = p * (2 - p);

                    this._limpar();
                    this._desenharRetaNumerica(questao, rep);

                    this.ctx.beginPath();
                    this.ctx.lineWidth = 3;
                    this.ctx.strokeStyle = this.cores.cyan;
                    this.ctx.moveTo(startX, Y_RET);

                    for (let i = 0.01; i <= pEase; i += 0.01) {
                        const x = Math.pow(1-i, 2) * startX + 2 * (1-i) * i * cpX + Math.pow(i, 2) * endX;
                        const y = Math.pow(1-i, 2) * Y_RET + 2 * (1-i) * i * cpY + Math.pow(i, 2) * Y_RET;
                        if(!isNaN(x) && !isNaN(y)) this.ctx.lineTo(x, y);
                    }
                    this.ctx.stroke();

                    if (p < 1) requestAnimationFrame(anim);
                    else resolve();
                };
                requestAnimationFrame(anim);
            });

            this._desenharPonto(valDestino_Math, valMin, valMax, PADDING_W, Y_RET, this.cores.cyan, 'B');

        } catch (e) {
            console.error("[CanvasRenderer] Erro na animação amortecido:", e);
        } finally {
            // 🔓 A CURA DO TRAVAMENTO: O 'finally' garante que o cadeado SEMPRE abre.
            this.isAnimating = false;
        }
    }
}
