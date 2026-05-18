/**
 * @fileoverview CanvasRenderer.js
 * @description Motor Gráfico Modular do LabTech (DUA).
 * Renderiza e anima representações visuais matemáticas (Reta Numérica, Frações).
 * CORREÇÃO V15.1: Sistema de coordenadas robusto, Viewport centering e clamping de arcos.
 * @version 3.1.0
 * @package LabTech / UI
 */

export class CanvasRenderer {
    /**
     * @param {string} canvasId - O ID do elemento <canvas> no DOM.
     */
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            console.warn(`[CanvasRenderer] Elemento Canvas com ID '${canvasId}' não localizado.`);
            this.ctx = null;
            return;
        }
        this.ctx = this.canvas.getContext('2d');
        this.id = canvasId;

        // Cores base do design do LabTech
        this.cores = {
            gold: '#d4af37', // Choco Gold
            cyan: '#00eaff', // Neon Cyan
            subt: '#cccccc'
        };

        this.isAnimating = false;
    }

    /**
     * Ajusta a resolução lógica do canvas baseado no tamanho de exibição CSS.
     * @private
     */
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
        if (!this.ctx) return;
        this.ctx.clearRect(0, 0, this.W, this.H);
    }

    /**
     * 🧠 A CURA: Mapeia um valor matemático para uma coordenada X no canvas com Viewport Centering.
     * @private
     */
    _mapX(value, minVal, maxVal, widthPadding) {
        const range = maxVal - minVal;
        const usableWidth = this.W - (widthPadding * 2);
        if (range === 0) return this.W / 2; // Evita divisão por zero
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

        // Seletor de modo de renderização DUA
        if (representacao === 'reta' || representacao === 'abstrato') {
            this._desenharRetaNumerica(questao, representacao);
        } else if (representacao === 'visual') {
            this._desenharFraçãoBarra(questao);
        } else {
            this._desenharFallback(questao);
        }
    }

    /**
     * Desenha a estrutura da Reta Numérica (Linha, Isomorfismo e Ponto A).
     * @private
     */
    _desenharRetaNumerica(q, modo) {
        const ctx = this.ctx;
        const Y_RET = this.H * 0.7; // Altura da linha base (70% do canvas)
        const PADDING_W = 60; // Padding lateral para labels não cortarem

        // 1. Define o Viewport Matemático de forma robusta
        let valMin = 0;
        // Se houver números negativos no display ou em 'a', expande para esquerda
        if (String(q.display).includes('-') || (parseFloat(q.a) < 0)) valMin = -10;

        // Acha o valor máximo para definir o range direito
        const valA_Math = parseFloat(q.a || q.valorInicial) || 0;
        const valMax = Math.max(10, q.res, valA_Math, q.alternativas[0]?.valor || 0);
        
        // Desenha a linha base (Sombra/Pista)
        ctx.beginPath();
        ctx.strokeStyle = '#222';
        ctx.lineWidth = 4;
        ctx.moveTo(PADDING_W, Y_RET);
        ctx.lineTo(this.W - PADDING_W, Y_RET);
        ctx.stroke();

        // 2. Desenha o Isomorfismo (Caminho percorrido) - De 0 até valorInicial/q.a
        if (valA_Math !== 0) {
            ctx.beginPath();
            ctx.strokeStyle = this.cores.gold; // Choco Gold
            ctx.lineWidth = modo === 'reta' ? 6 : 2; // Reta é mais grossa que abstrato
            const x0 = this._mapX(0, valMin, valMax, PADDING_W);
            const xA = this._mapX(valA_Math, valMin, valMax, PADDING_W);
            ctx.moveTo(x0, Y_RET);
            ctx.lineTo(xA, Y_RET);
            ctx.stroke();
        }

        // 3. Desenha os Ticks (marcas de subdivisão) e números se for modo 'reta'
        if (modo === 'reta') {
            this._desenharTicksReta(valMin, valMax, PADDING_W, Y_RET);
        }

        // 4. Desenha o ponto fixo 'A' (valorInicial)
        this._desenharPonto(valA_Math, valMin, valMax, PADDING_W, Y_RET, this.cores.gold, 'A');
    }

    /**
     * Desenha marcas e números na reta numérica com Viewport Centering.
     * @private
     */
    _desenharTicksReta(min, max, padding, y) {
        const ctx = this.ctx;
        ctx.fillStyle = '#444';
        ctx.font = '12px monospace';
        ctx.textAlign = 'center';
        const tickH = 10;
        
        const range = max - min;
        let step = 1;
        // Ajusta step dinamicamente se o range for enorme
        if (range > 20) step = 5;
        if (range > 100) step = 10;

        for (let i = min; i <= max; i += step) {
            const x = this._mapX(i, min, max, padding);
            ctx.fillRect(x, y - (tickH / 2), 1, tickH);
            // Legenda de números principais (0, min, max e múltiplos de step)
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
        const raio = 8;
        
        ctx.beginPath();
        ctx.fillStyle = '#111'; // Fundo do ponto
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
        
        const num = parseFloat(q.a) || 0;
        const den = parseFloat(q.b) || q.fim || 1; // Fallback para denominador

        ctx.fillStyle = '#111'; ctx.fillRect(x, y, barW, barH); // Fundo
        ctx.fillStyle = this.cores.gold; ctx.fillRect(x, y, barW * (num/den), barH); // Preenchimento
        ctx.strokeStyle = '#444'; ctx.strokeRect(x, y, barW, barH); // Borda

        // Subdivisões
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
        ctx.fillText("Modo DUA não mapeado graficamente.", this.W/2, this.H/2);
    }

    // =========================================================================
    // ─── MÉTODOS DE ANIMAÇÃO DINÂMICA (animarArcos) ───
    // =========================================================================

    async animarArcos(questao, deslocamento, representacao) {
        this._autoresize();
        if (!this.ctx || this.isAnimating || representacao === 'visual') return;
        this.isAnimating = true;

        const ctx = this.ctx;
        const DURACAO_MS = 600; // Tempo total do pulo
        const PADDING_W = 60;
        const Y_RET = this.H * 0.7; // Base da reta numérica

        // Computa o Viewport Matemático idêntico ao renderCv para consistência
        let valMin = 0;
        if (String(questao.display).includes('-') || (parseFloat(questao.a) < 0)) valMin = -10;
        const valA_Math = parseFloat(questao.a || questao.valorInicial) || 0;
        const valMax = Math.max(10, questao.res, valA_Math, questao.alternativas[0]?.valor || 0);
        const valDestino_Math = valA_Math + deslocamento;
        
        // Mapeamento para pixels (🧠 CURA: Usando o mesmo _mapX centrado)
        const startX = this._mapX(valA_Math, valMin, valMax, PADDING_W);
        const endX = this._mapX(valDestino_Math, valMin, valMax, PADDING_W);
        
        // 🧠 CURA DOS ARCOS GIGANTES: Clamping robusto da altura do arco baseado na altura do canvas.
        const distanciaPx = Math.abs(endX - startX);
        const ALTURA_MAXIMA_ARCO = this.H * 0.6; // No máximo 60% da altura da tela
        const arcH = Math.min(ALTURA_MAXIMA_ARCO, Math.max(30, distanciaPx * 0.8)); // Mínimo 30px, máximo H*0.6
        
        // Ponto de controle Bézier Quadrático
        const cpX = (startX + endX) / 2;
        const cpY = Y_RET - arcH;

        const startTime = performance.now();

        const anim = async (now) => {
            const elapsed = now - startTime;
            const p = Math.min(1, elapsed / DURACAO_MS); // Porcentagem (0 a 1)
            const pEase = p * (2 - p); // Easing quadrativo (desaceleração)

            this._limpar();
            this._desenharRetaNumerica(questao, representacao); // Redesenha a base estática

            // Desenha arco Bézier Parcial
            ctx.beginPath(); ctx.lineWidth = 3; ctx.strokeStyle = this.cores.cyan; ctx.moveTo(startX, Y_RET);
            for (let i = 0.01; i <= pEase; i += 0.01) {
                const x = Math.pow(1-i, 2) * startX + 2 * (1-i) * i * cpX + Math.pow(i, 2) * endX;
                const y = Math.pow(1-i, 2) * Y_RET + 2 * (1-i) * i * cpY + Math.pow(i, 2) * Y_RET;
                ctx.lineTo(x, y);
            }
            ctx.stroke();

            if (p < 1) {
                requestAnimationFrame(anim);
            } else {
                // Fim da animação. Desenha o ponto B (Destino) em Neon Cyan
                this._desenharPonto(valDestino_Math, valMin, valMax, PADDING_W, Y_RET, this.cores.cyan, 'B');
                this.isAnimating = false;
            }
        };
        requestAnimationFrame(anim);
    }
}
