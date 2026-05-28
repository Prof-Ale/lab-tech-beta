/**
 * @fileoverview CanvasRenderer.js
 * @description Motor Gráfico Modular do LabTech (DUA).
 * Rastreia e renderiza Isomorfismos Matemáticos na Reta Numérica e Frações.
 * VERSÃO 4.0.0: Inteligência Semântica, Ticks Hierárquicos e Física Pedagógica.
 * @package LabTech / UI
 */

import { AdaptiveAudioEngine } from '../core/ada/AdaptiveAudioEngine.js';

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
        this.cores = {
            gold: '#d4af37',
            cyan: '#00eaff',
            subt: '#f2f2f2',
            danger: '#ff3333',
            axis: '#cfcfcf',
            axisSoft: '#7a7a7a',
            bgGrid: 'rgba(255,255,255,0.02)'
        };
        this.isAnimating = false;
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
            
            this.ctx.setTransform(1, 0, 0, 1, 0, 0);
            this.ctx.scale(this.dpi, this.dpi);
            
            // Suavização Anti-serrilhado (Anti-aliasing visual)
            this.ctx.imageSmoothingEnabled = true;
            this.ctx.imageSmoothingQuality = 'high';
        }
    }

    _limpar() {
        if (this.ctx) {
            this.ctx.save();
            this.ctx.setTransform(1, 0, 0, 1, 0, 0);
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.restore();
        }
    }

    _mapX(value, minVal, maxVal, widthPadding) {
        if (isNaN(value) || isNaN(minVal) || isNaN(maxVal)) return this.W / 2;
        const range = maxVal - minVal;
        const usableWidth = this.W - (widthPadding * 2);
        if (range === 0 || usableWidth <= 0) return this.W / 2;
        const pct = (value - minVal) / range;
        return widthPadding + (pct * usableWidth);
    }

    _calcularEscalaPedagogica(q, customMin = null, customMax = null) {
        const parseNumero = (v) => {
            const n = parseFloat(String(v ?? 0).replace(/[^\d.-]/g, ''));
            return isNaN(n) ? 0 : n;
        };

        const valA = parseNumero(q.a ?? q.valorInicial ?? 0);
        const valRes = parseNumero(q.res ?? q.gabarito ?? 0);

        const alternativasValidas = (q.alternativas || [])
            .map(a => parseNumero(a.valor || a.texto))
            .filter(v => Math.abs(v) <= 50);

        const maiorAlt = alternativasValidas.length
            ? Math.max(...alternativasValidas)
            : 10;

        const menorAlt = alternativasValidas.length
            ? Math.min(...alternativasValidas)
            : 0;

        let min = customMin;
        let max = customMax;

        if (min === null) {
            min = Math.min(valA, valRes, menorAlt);
            if (min > 0) min = 0;
            min -= 2;
        }

        if (max === null) {
            max = Math.max(valA, valRes, maiorAlt);
            max += 2;
        }

        if ((max - min) < 12) {
            max += 6;
        }

        return { min, max };
    }

    // =========================================================================
    // ─── MOTOR DE INFERÊNCIA SEMÂNTICA (Detecção de Operação) ───
    // =========================================================================
    _detectarTipoOperacao(q) {
        const texto = String(q.display || '').toLowerCase();

        if (texto.includes('x') || texto.includes('*') || texto.includes('vezes') || texto.includes('cada')) {
            return 'multiplicacao';
        }
        if (texto.includes('÷') || texto.includes('/') || texto.includes('divid') || texto.includes('metade')) {
            return 'divisao';
        }
        if (texto.includes('-') || texto.includes('menos') || texto.includes('subtra')) {
            return 'subtracao';
        }
        return 'soma';
    }

    renderCv(questao, offset, representacao) {
        this._autoresize();
        if (!this.ctx || !questao) return;
        this._limpar();

        let rep = representacao;
        const strA = String(questao.a ?? questao.valorInicial ?? 0);
        
        if (String(questao.bloco) === '4' || strA.match(/[a-zA-Z]/)) {
            rep = 'algebra';
        } else if (rep === 'visual' || rep === undefined) {
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
            } else {
                this._desenharFallback(questao);
            }
        } catch(e) {
            console.error("[CanvasRenderer] Erro contornado:", e);
            this._desenharFallback(questao);
        }
    }

    _desenharRetaNumerica(q, modo, customMin = null, customMax = null) {
        const Y_RET = this.H * 0.58;
        const PADDING_W = Math.max(50, this.W * 0.12);

        const strA = String(q.a ?? q.valorInicial ?? 0);
        const valA_Math = parseFloat(strA.replace(/[^\d.-]/g, '')) || 0;

        const escala = this._calcularEscalaPedagogica(q, customMin, customMax);
        const valMin = escala.min;
        const valMax = escala.max;

        // EIXO PRINCIPAL
        this.ctx.beginPath();
        this.ctx.strokeStyle = this.cores.axis;
        this.ctx.lineWidth = 3;

        this.ctx.moveTo(PADDING_W, Y_RET);
        this.ctx.lineTo(this.W - PADDING_W, Y_RET);
        this.ctx.stroke();

        // SETA DIREITA
        const fimRetaX = this.W - PADDING_W;
        this.ctx.beginPath();
        this.ctx.fillStyle = this.cores.axis;
        this.ctx.moveTo(fimRetaX, Y_RET);
        this.ctx.lineTo(fimRetaX - 12, Y_RET - 7);
        this.ctx.lineTo(fimRetaX - 12, Y_RET + 7);
        this.ctx.fill();

        // SEGMENTO INICIAL (Mais elegante: espessura 4 ao invés de 6)
        if (valA_Math !== 0) {
            this.ctx.beginPath();
            this.ctx.strokeStyle = this.cores.gold;
            this.ctx.lineWidth = (modo === 'reta' ? 4 : 2);

            const x0 = this._mapX(0, valMin, valMax, PADDING_W);
            const xA = this._mapX(valA_Math, valMin, valMax, PADDING_W);

            this.ctx.moveTo(x0, Y_RET);
            this.ctx.lineTo(xA, Y_RET);
            this.ctx.stroke();
        }

        if (modo === 'reta') {
            this._desenharTicksReta(valMin, valMax, PADDING_W, Y_RET);
        }

        this._desenharPonto(valA_Math, valMin, valMax, PADDING_W, Y_RET, this.cores.gold, 'A');
    }

    _desenharTicksReta(min, max, padding, y) {
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'top';

        const range = max - min;
        let step = 1;

        if (range > 20) step = 2;
        if (range > 40) step = 5;
        if (range > 80) step = 10;

        for (let i = min; i <= max; i += step) {
            const x = this._mapX(i, min, max, padding);

            if (!isFinite(x)) continue;

            const isZero = (i === 0);
            const isMult5 = (i % 5 === 0);

            // TICK HIERÁRQUICO (Forte para 0 e múltiplos de 5, suave para o resto)
            this.ctx.beginPath();
            this.ctx.strokeStyle = isZero ? this.cores.gold : (isMult5 ? this.cores.axis : this.cores.axisSoft);
            this.ctx.lineWidth = isZero ? 3 : (isMult5 ? 2 : 1);

            const tickLen = isZero ? 10 : (isMult5 ? 8 : 5);
            this.ctx.moveTo(x, y - tickLen);
            this.ctx.lineTo(x, y + tickLen);
            this.ctx.stroke();

            // LABELS HUMANIZADOS (Nunito)
            if (isZero || isMult5 || step >= 5) {
                this.ctx.font = isZero ? 'bold 15px Nunito' : 'bold 13px Nunito';
                
                if (isZero) {
                    this.ctx.shadowBlur = 4;
                    this.ctx.shadowColor = this.cores.gold;
                    this.ctx.fillStyle = this.cores.gold;
                } else {
                    this.ctx.fillStyle = this.cores.subt;
                    this.ctx.shadowBlur = 0; 
                }
                
                this.ctx.fillText(String(i), x, y + 14);
                this.ctx.shadowBlur = 0; 
            }
        }
    }

    _desenharPonto(val, min, max, padding, y, cor, label) {
        const x = this._mapX(val, min, max, padding);
        if (!isFinite(x) || isNaN(x)) return;

        this.ctx.beginPath();
        this.ctx.fillStyle = '#000'; 
        this.ctx.strokeStyle = cor; 
        this.ctx.lineWidth = 3;
        this.ctx.arc(x, y, 7, 0, Math.PI * 2);

        // GLOW COGNITIVO REDUZIDO (Sensação pedagógica, menos "gamer")
        this.ctx.shadowBlur = 6;
        this.ctx.shadowColor = cor;

        this.ctx.fill(); 
        this.ctx.stroke();

        this.ctx.shadowBlur = 0; 

        // FONTE HUMANIZADA
        this.ctx.font = 'bold 13px Nunito'; 
        this.ctx.fillStyle = cor; 
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'alphabetic';
        this.ctx.fillText(label, x, y - 15);
    }

    _desenharFraçãoBarra(q) {
        const barW = this.W * 0.8; const barH = 50;
        const x = (this.W - barW) / 2; const y = (this.H - barH) / 2;
        const num = parseFloat(String(q.a ?? q.valorInicial ?? 0).replace(/[^\d.-]/g, '')) || 0;
        const den = parseFloat(String(q.b ?? q.fim ?? 1).replace(/[^\d.-]/g, '')) || 1;

        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.05)'; 
        this.ctx.fillRect(x, y, barW, barH);
        
        const ratio = Math.max(0, Math.min(1, num / Math.max(1, den)));
        
        this.ctx.fillStyle = this.cores.gold; 
        this.ctx.fillRect(x, y, barW * ratio, barH);
        this.ctx.strokeStyle = this.cores.cyan; 
        this.ctx.lineWidth = 2; 
        this.ctx.strokeRect(x, y, barW, barH);

        this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.lineWidth = 3;
        for (let i = 1; i < den; i++) {
            this.ctx.beginPath(); 
            this.ctx.moveTo(x + (i * barW/den), y); 
            this.ctx.lineTo(x + (i * barW/den), y + barH); 
            this.ctx.stroke();
        }

        this.ctx.font = 'bold 18px Nunito'; 
        this.ctx.fillStyle = this.cores.gold; 
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'alphabetic';
        this.ctx.fillText(`${num} / ${den}`, this.W / 2, y - 20);
    }

    _desenharFallback(q) {
        this.ctx.fillStyle = this.cores.subt; 
        this.ctx.textAlign = 'center'; 
        this.ctx.textBaseline = 'middle';
        this.ctx.font = '14px Nunito';
        this.ctx.fillText("[ Representação Abstrata Requerida ]", this.W/2, this.H/2);
    }

    async animarArcos(questao, deslocamento, representacao) {
        this._autoresize();
        if (!this.ctx || this.isAnimating) return Promise.resolve();

        let rep = representacao;
        const strA = String(questao.a ?? questao.valorInicial ?? 0);
        if (String(questao.bloco) === '4' || strA.match(/[a-zA-Z]/)) rep = 'algebra';
        else if (rep === 'visual' || rep === undefined) {
            const isFracao = questao.b !== undefined || String(questao.display).includes('/');
            if (!isFracao) rep = 'reta';
        }

        if (rep === 'visual' || rep === 'algebra') return Promise.resolve();

        this.isAnimating = true;

        const valA_Math = parseFloat(strA.replace(/[^\d.-]/g, '')) || 0;
        const valRes_Math = parseFloat(String(questao.res).replace(/[^\d.-]/g, '')) || 0;
        const deslocFloat = parseFloat(String(deslocamento).replace(/[^\d.-]/g, '')) || 0;
        const valDest_Math = valA_Math + deslocFloat;

        const escala = this._calcularEscalaPedagogica(
            questao,
            null,
            Math.max(valDest_Math + 2, valRes_Math + 2)
        );

        const valMin = escala.min;
        const valMax = escala.max;
        
        const PADDING_W = Math.max(50, this.W * 0.12);
        const Y_RET = this.H * 0.58;

        // ANÁLISE DE OPERAÇÃO PARA ANIMAÇÃO SEMÂNTICA
        const operacao = this._detectarTipoOperacao(questao);
        let direcao = deslocFloat >= 0 ? 1 : -1;
        let tamanhoSalto = Math.abs(deslocFloat);
        let qtdSaltos = 1;

        if (operacao === 'multiplicacao') {
            const texto = String(questao.display || '');
            const numeros = texto.match(/\d+/g);
            if (numeros && numeros.length >= 2) {
                const n1 = parseInt(numeros[0]);
                const n2 = parseInt(numeros[1]);
                if (n1 * n2 === Math.abs(deslocFloat)) {
                    qtdSaltos = n1;
                    tamanhoSalto = n2;
                }
            }
        }

        if (qtdSaltos === 0 || isNaN(qtdSaltos) || tamanhoSalto === 0) {
            this.isAnimating = false;
            return Promise.resolve();
        }

        const corVetor = deslocFloat >= 0 ? this.cores.cyan : this.cores.danger;

        const animarPassoUnitario = (valorAtual, valorProximo) => {
            return new Promise((resolvePasso) => {
                const startTime = performance.now();
                const DURACAO_PASSO = 220; 

                if (typeof AdaptiveAudioEngine !== 'undefined') {
                    AdaptiveAudioEngine.sonarDeslocamento(direcao);
                }

                const startX = this._mapX(valorAtual, valMin, valMax, PADDING_W);
                const endX = this._mapX(valorProximo, valMin, valMax, PADDING_W);
                const distPx = Math.abs(endX - startX);
                
                // ARCO FÍSICO PEDAGÓGICO (Mais achatado/natural, menos balístico)
                const arcH = Math.max(18, distPx * 0.55); 
                const cpX = (startX + endX) / 2;
                const cpY = Y_RET - arcH;

                const tickAnim = (now) => {
                    const elapsed = now - startTime;
                    const p = Math.min(1, elapsed / DURACAO_PASSO);
                    const pEase = p * (2 - p);

                    this._limpar();
                    this._desenharRetaNumerica(questao, rep, valMin, valMax);

                    // EFEITOS DE RASTRO E PULSO
                    const globalStartX = this._mapX(valA_Math, valMin, valMax, PADDING_W);
                    let currentProgressX = Math.pow(1-pEase, 2) * startX + 2 * (1-pEase) * pEase * cpX + Math.pow(pEase, 2) * endX;
                    
                    // Brilho na linha de avanço
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = corVetor;
                    this.ctx.lineWidth = 4;
                    this.ctx.shadowBlur = 8;
                    this.ctx.shadowColor = corVetor;
                    this.ctx.moveTo(globalStartX, Y_RET);
                    this.ctx.lineTo(currentProgressX, Y_RET);
                    this.ctx.stroke();

                    // Acende o tick atual fixo
                    this.ctx.fillStyle = corVetor;
                    this.ctx.fillRect(startX - 2, Y_RET - 8, 4, 16);

                    // Pulso orgânico no destino
                    const pulse = 12 + (Math.sin(p * Math.PI) * 6);
                    this.ctx.globalAlpha = 0.4 + (0.6 * pEase);
                    this.ctx.fillRect(endX - 2, Y_RET - (pulse/2), 4, pulse);
                    
                    this.ctx.globalAlpha = 1.0;
                    this.ctx.shadowBlur = 0;

                    this._desenharPonto(valA_Math, valMin, valMax, PADDING_W, Y_RET, this.cores.gold, 'A');
                    
                    // Desenho da curva
                    this.ctx.beginPath(); 
                    this.ctx.lineWidth = 3; 
                    this.ctx.strokeStyle = corVetor; 
                    this.ctx.moveTo(startX, Y_RET);

                    let lastX = startX;
                    let lastY = Y_RET;

                    for (let i = 0.01; i <= pEase; i += 0.01) {
                        const t = i;
                        lastX = Math.pow(1-t, 2) * startX + 2 * (1-t) * t * cpX + Math.pow(t, 2) * endX;
                        lastY = Math.pow(1-t, 2) * Y_RET + 2 * (1-t) * t * cpY + Math.pow(t, 2) * Y_RET;
                        if(isFinite(lastX) && isFinite(lastY)) this.ctx.lineTo(lastX, lastY);
                    }
                    this.ctx.stroke();

                    // Seta dinâmica apontando a direção da progressão
                    if (pEase > 0.1) {
                        const angle = Math.atan2(lastY - cpY, lastX - cpX);
                        this.ctx.beginPath();
                        this.ctx.fillStyle = corVetor;
                        this.ctx.moveTo(lastX, lastY);
                        this.ctx.lineTo(lastX - 10 * Math.cos(angle - Math.PI / 6), lastY - 10 * Math.sin(angle - Math.PI / 6));
                        this.ctx.lineTo(lastX - 10 * Math.cos(angle + Math.PI / 6), lastY - 10 * Math.sin(angle + Math.PI / 6));
                        this.ctx.fill();
                    }

                    if (p < 1) {
                        requestAnimationFrame(tickAnim);
                    } else {
                        resolvePasso();
                    }
                };
                requestAnimationFrame(tickAnim);
            });
        };

        for (let i = 0; i < qtdSaltos; i++) {
            const pontoAtual = valA_Math + (i * tamanhoSalto * direcao);
            const pontoProximo = pontoAtual + (tamanhoSalto * direcao);
            await animarPassoUnitario(pontoAtual, pontoProximo);
        }

        this._desenharPonto(valDest_Math, valMin, valMax, PADDING_W, Y_RET, corVetor, 'B');
        this.isAnimating = false;
        return Promise.resolve();
    }
}
