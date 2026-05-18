/**
 * @fileoverview canvasRenderer.js
 * @description Motor gráfico vetorial baseado em HTML5 Canvas para o ecossistema LabTech.
 * Renderiza de forma síncrona e isolada as diferentes representações semióticas (balanças, retas e arcos).
 * Atua estritamente como a camada de expressão visual governada pelas decisões da ADA.
 * * @version 3.0.0
 * @package LabTech / UI Architecture
 */

export class CanvasRenderer {
    /**
     * Instancia o renderizador associando-o a um elemento Canvas específico.
     * @param {HTMLCanvasElement|string} canvasTarget - O elemento canvas ou o ID string do DOM.
     */
    constructor(canvasTarget) {
        this.canvas = typeof canvasTarget === 'string' ? document.getElementById(canvasTarget) : canvasTarget;
        if (!this.canvas) {
            console.warn("[CanvasRenderer] Elemento Canvas alvo não localizado no DOM.");
            this.ctx = null;
            return;
        }
        this.ctx = this.canvas.getContext('2d');
        
        // Cores do Tema capturadas dinamicamente do style.css
        this.styles = Object.freeze({
            cyan: this._getCssVariable('--neon-cyan', '#00eaff'),
            gold: this._getCssVariable('--choco-gold', '#d4af37'),
            red: this._getCssVariable('--neon-red', '#ff3333'),
            green: this._getCssVariable('--neon-green', '#00ff66'),
            bg: '#060610'
        });
    }

    /**
     * Recupera variáveis de cores nativas do arquivo CSS da aplicação para o Canvas context.
     * @private
     */
    _getCssVariable(variableName, fallback) {
        const value = getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
        return value || fallback;
    }

    /**
     * Limpa a tela inteira do Canvas preparando o frame para nova renderização.
     */
    clear() {
        if (!this.ctx) return;
        this.ctx.fillStyle = this.styles.bg;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * RENDERIZADOR MESTRE (Entrada unificada do pipeline visual)
     * Decide qual metáfora visual desenhar com base na parametrização da ADA.
     * @param {Object} questao - Metadados e dados do sensor cognitivo atual.
     * @param {Object} state - Estado complementar (opcional).
     * @param {string} modoRepresentacao - 'visual' (balança/blocos), 'normal' (reta) ou 'abstrato' (notação sintática pura).
     */
    renderCv(questao, state, modoRepresentacao) {
        this.clear();
        if (!this.ctx) return;

        const modo = String(modoRepresentacao).toLowerCase();

        if (modo === 'visual') {
            // Se a questão possuir dados de balança ou pratos, renderiza a Balança Hidrostática
            if (questao.estruturaMatematica?.tipoVisual === 'BALANCA' || questao.tipoVisual === 'BALANCA' || questao.balanca) {
                const dados = questao.balanca || { esq: 10, dir: 10, equilibrado: true };
                this.drawBalanceScale(dados.esq, dados.dir, dados.equilibrado);
            } else {
                // Padrão: Se for fração ou vetores aditivos em estágio materializado
                this.drawAreaFractionGrid(questao.particoes || 6, questao.pintados || 2);
            }
        } else if (modo === 'normal' || modo === 'visual_schematic') {
            // Renderiza a reta decimal vetorial com pontos coordenados direcionados
            const min = questao.minReta !== undefined ? questao.minReta : -10;
            const max = questao.maxReta !== undefined ? questao.maxReta : 10;
            const atual = questao.valorInicial !== undefined ? questao.valorInicial : 0;
            this.drawNumberLine(min, max, atual);
        } else {
            // Modo Abstrato / Interno Puro: Renderiza apenas uma malha sutil ou grid matricial
            this.drawAbstractGrid();
        }
    }

    /**
     * METÁFORA VISUAL A: Balança Hidrostática de Dois Pratos (Equivalência/Isomorfismo de Equações)
     */
    drawBalanceScale(leftWeight, rightWeight, isBalanced = true) {
        const ctx = this.ctx;
        const W = this.canvas.width;
        const H = this.canvas.height;
        const cX = W / 2;
        const cY = H * 0.6; // Ponto de apoio central da haste

        // Cálculo dinâmico da inclinação física baseada na diferença de cargas (Atuação dialética)
        let inclinacao = 0;
        if (!isBalanced) {
            inclinacao = leftWeight > rightWeight ? -0.12 : 0.12; 
        }

        ctx.save();
        
        // 1. Desenho da Base e Coluna Central Fixa
        ctx.strokeStyle = this.styles.gold;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(cX, cY);
        ctx.lineTo(cX, H * 0.85); // Haste vertical
        ctx.moveTo(cX - 50, H * 0.85);
        ctx.lineTo(cX + 50, H * 0.85); // Base horizontal do chão
        ctx.stroke();

        // Pináculo central de apoio
        ctx.fillStyle = this.styles.gold;
        ctx.beginPath();
        ctx.arc(cX, cY, 6, 0, Math.PI * 2);
        ctx.fill();

        // 2. Aplicação da Translação de Rotação para a Haste Móvel
        ctx.translate(cX, cY);
        ctx.rotate(inclinacao);

        const comprimentoHaste = W * 0.3;

        // Haste Balançante Principal
        ctx.beginPath();
        ctx.moveTo(-comprimentoHaste, 0);
        ctx.lineTo(comprimentoHaste, 0);
        ctx.stroke();

        // Prato Esquerdo e Cabos de Suspensão
        this._drawPlateAndWeights(-comprimentoHaste, 0, leftWeight, this.styles.cyan);

        // Prato Direito e Cabos de Suspensão
        this._drawPlateAndWeights(comprimentoHaste, 0, rightWeight, isBalanced ? this.styles.cyan : this.styles.red);

        ctx.restore();
    }

    /**
     * Desenha um prato e empilha blocos quantitativos proporcionais dentro dele.
     * @private
     */
    _drawPlateAndWeights(x, y, weight, color) {
        const ctx = this.ctx;
        const raioPrato = 40;
        const quedaPrato = 50;

        // Cabos de suspensão vetoriais
        ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x - raioPrato, y + quedaPrato);
        ctx.moveTo(x, y);
        ctx.lineTo(x + raioPrato, y + quedaPrato);
        ctx.stroke();

        // Base do Prato Física
        ctx.strokeStyle = this.styles.gold;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x - raioPrato, y + quedaPrato);
        ctx.lineTo(x + raioPrato, y + quedaPrato);
        ctx.stroke();

        // Renderização dos blocos de carga (Cada bloco representa 1 unidade conceptual)
        ctx.fillStyle = color;
        const tamanhoBloco = 12;
        const blocosPorLinha = 3;
        
        for (let i = 0; i < Math.min(weight, 9); i++) {
            const linha = Math.floor(i / blocosPorLinha);
            const coluna = i % blocosPorLinha;
            const bx = x - ((blocosPorLinha * tamanhoBloco) / 2) + (coluna * tamanhoBloco) + 2;
            const by = y + quedaPrato - (linha * tamanhoBloco) - tamanhoBloco;
            
            ctx.fillRect(bx, by, tamanhoBloco - 2, tamanhoBloco - 2);
        }
    }

    /**
     * METÁFORA VISUAL B: Reta Numérica Coordenada Unidimensional (Topologia e Deslocamentos)
     */
    drawNumberLine(min, max, currentVal) {
        const ctx = this.ctx;
        const W = this.canvas.width;
        const H = this.canvas.height;
        const yEixo = H * 0.6;
        const margem = 40;

        // Linha mestre horizontal da reta decimal
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(margem, yEixo);
        ctx.lineTo(W - margem, yEixo);
        ctx.stroke();

        // Setas direcionais nas extremidades (Invariância espacial)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        this._drawArrowhead(margem, yEixo, Math.PI);
        this._drawArrowhead(W - margem, yEixo, 0);

        // Renderização das marcas de escala graduada (Ticks)
        const totalPassos = max - min;
        const espacamento = (W - (margem * 2)) / totalPassos;

        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.font = '10px monospace';
        ctx.textAlign = 'center';

        for (let i = 0; i <= totalPassos; i++) {
            const xTick = margem + (i * espacamento);
            const valorCalculado = min + i;

            ctx.strokeStyle = valorCalculado === 0 ? this.styles.gold : 'rgba(255,255,255,0.2)';
            ctx.lineWidth = valorCalculado === 0 ? 3 : 1;

            ctx.beginPath();
            ctx.moveTo(xTick, yEixo - 6);
            ctx.lineTo(xTick, yEixo + 6);
            ctx.stroke();

            // Exibe os números em intervalos ou se for o ponto central zero
            if (valorCalculado === 0 || totalPassos <= 10 || valorCalculado % 5 === 0) {
                ctx.fillText(String(valorCalculado), xTick, yEixo + 20);
            }
        }

        // Desenho do nó marcador da coordenada atual do estudante
        const xEstudante = margem + ((currentVal - min) * espacamento);
        if (xEstudante >= margem && xEstudante <= W - margem) {
            ctx.fillStyle = this.styles.cyan;
            ctx.shadowBlur = 10;
            ctx.shadowColor = this.styles.cyan;
            
            ctx.beginPath();
            ctx.arc(xEstudante, yEixo, 7, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.shadowBlur = 0; // Reseta efeito de Glow neon
        }
    }

    /**
     * Auxiliar vetorial para desenho de pontas de seta na reta.
     * @private
     */
    _drawArrowhead(x, y, angle) {
        const ctx = this.ctx;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-8, -4);
        ctx.lineTo(-8, 4);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    /**
     * METÁFORA VISUAL C: Matriz Fracionária de Área Co-variante (Foco no 6º Ano EF06MA07)
     */
    drawAreaFractionGrid(totalPartitions, paintedPartitions) {
        const ctx = this.ctx;
        const W = this.canvas.width;
        const H = this.canvas.height;
        
        const larguraGrid = W * 0.6;
        const alturaGrid = H * 0.3;
        const xStart = (W - larguraGrid) / 2;
        const yStart = (H - alturaGrid) / 2;

        const larguraParticao = larguraGrid / totalPartitions;

        // Renderiza as partições e preenche os blocos ativos
        for (let i = 0; i < totalPartitions; i++) {
            const xBlock = xStart + (i * larguraParticao);

            if (i < paintedPartitions) {
                ctx.fillStyle = 'rgba(0, 234, 255, 0.25)'; // Preenchimento semiótico ativo
                ctx.fillRect(xBlock, yStart, larguraParticao, alturaGrid);
                ctx.strokeStyle = this.styles.cyan;
                ctx.lineWidth = 2;
            } else {
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
                ctx.lineWidth = 1;
            }

            ctx.strokeRect(xBlock, yStart, larguraParticao, alturaGrid);
        }

        // Borda mestre de contenção estrutural (Invariante do Inteiro)
        ctx.strokeStyle = this.styles.gold;
        ctx.lineWidth = 3;
        ctx.strokeRect(xStart, yStart, larguraGrid, alturaGrid);
    }

    /**
     * METÁFORA VISUAL D: Grid Abstrato Matricial (Estágio Mental Interno Puro)
     * Renderiza apenas uma malha sutil de fundo para indicar ambiente de cálculo analítico formal.
     */
    drawAbstractGrid() {
        const ctx = this.ctx;
        const W = this.canvas.width;
        const H = this.canvas.height;
        const step = 30;

        ctx.strokeStyle = 'rgba(0, 234, 255, 0.03)';
        ctx.lineWidth = 1;

        for (let x = 0; x < W; x += step) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
        }
        for (let y = 0; y < H; y += step) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
        }
    }

    /**
     * PIPELINE DE ANIMAÇÃO DE DESLOCAMENTO EM ARCO (Chama os arcos acumulativos vetoriais)
     * Modos gráficos integrados ao pipeline assíncrono do main.js
     */
    async animarArcos(q, deslocamento, modoGrafico) {
        return new Promise((resolve) => {
            // Renderiza o estado final correspondente imediatamente
            this.renderCv(q, null, modoGrafico);
            
            // Tratamento simplificado de frame-delay para simulação de fluxo assíncrono vetorial
            if (this.ctx && modoGrafico !== 'abstrato') {
                const ctx = this.ctx;
                const W = this.canvas.width;
                const H = this.canvas.height;
                
                // Renderização de arco indicador de salto direcional na reta
                ctx.strokeStyle = deslocamento >= 0 ? this.styles.green : this.styles.red;
                ctx.lineWidth = 3;
                ctx.setLineDash([4, 4]); // Linha tracejada de movimento rítmico
                
                ctx.beginPath();
                ctx.arc(W / 2, H * 0.5, Math.abs(deslocamento) * 15, Math.PI, 0, false);
                ctx.stroke();
                ctx.setLineDash([]); // Reseta tracejado
            }
            
            setTimeout(() => { resolve(true); }, 600); // Libera o travamento do pipeline do maestro após 600ms
        });
    }
}
