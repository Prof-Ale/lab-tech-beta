/**
 * @fileoverview gameState.js
 * @description Estado Global Centralizado (Single Source of Truth) do LabTech v15.0.
 * Gerencia buffers de telemetria, configurações DUA e estados adaptativos da ADA.
 * EVOLUÇÃO: Encapsulamento reativo e rastreamento de telemetria pedagógica obrigatória.
 * @version 15.1.0
 * @package LabTech / Engine Architecture
 */

export const G = {
    // ==========================================
    // 1. STATUS DE EXECUÇÃO EM RUNTIME (Blindados)
    // ==========================================
    _vida: 100,
    _energia: 100,
    
    get vida() { return this._vida; },
    set vida(v) { this._vida = Math.max(0, Math.min(100, v)); },

    get energia() { return this._energia; },
    set energia(v) { this._energia = Math.max(0, Math.min(100, v)); },

    combo: 0,
    nivel: 1,
    respondeu: false,          // Trava de segurança (Debounce)
    tempoInicialQuestao: 0,    // Timestamp Unix para latência

    // ==========================================
    // 2. CONTADORES ACUMULATIVOS DA SESSÃO CORRENTE
    // ==========================================
    acertos: 0,
    erros: 0,
    consec_erros: 0,

    // ==========================================
    // 3. DADOS DE IDENTIFICAÇÃO E PROGRESSÃO CURRICULAR
    // ==========================================
    nome: "Cientista",
    turma: "7ºA",
    currentBlock: null,
    trilha: 1,                 // 1: Reconhecimento, 2: Aplicação, 3: Investigação

    // ==========================================
    // 4. DIAGNÓSTICO CLÍNICO LONGITUDINAL (Histórico-Cultural)
    // ==========================================
    historico: {},             // Ex: EF06MA07: { acertos: 0, erros_conceito: 0, latencia_media: 0 }
    
    diagnostico: {
        scores: {},            // Pontuações ponderadas por clusters conceituais
        logs: []               // Telemetria bruta para a ADA
    },

    // ==========================================
    // 5. CACHE DE INTELIGÊNCIA DA ADA & PRONTUÁRIO
    // ==========================================
    perfilCognitivo: null,
    adaState: {
        perfilCognitivoAtual: "INDEFINIDO_EM_CALIBRAGEM",
        scaffold: {
            acao: "STANDBY",
            representacao: "ICONICO_VISUAL",
            reduzirCargaCognitiva: false,
            mensagemADA: "ADA inicializando sistemas de rastreamento cognitivo..."
        },
        ultimaAtualizacao: null,
        comandoInterface: "PADRAO"
    },

    // ==========================================
    // 6. PREFERÊNCIAS ACESSIBILIDADE E UX (DUA)
    // ==========================================
    musica: true,
    voz: true,

    // ==========================================
    // 7. MÉTODOS DE CONTROLE E TELEMETRIA
    // ==========================================
    
    /**
     * Reseta os parâmetros de runtime para inicialização segura.
     * @param {number|string} blocoId 
     */
    reiniciarParaNovoBloco(blocoId) {
        this.currentBlock = blocoId;
        this.vida = 100;
        this.energia = 100;
        this.combo = 0;
        this.acertos = 0;
        this.erros = 0;
        this.consec_erros = 0;
        this.respondeu = false;
        this.tempoInicialQuestao = Date.now();
        
        if (this.adaState) {
            this.adaState.comandoInterface = "PADRAO";
        }
    },

    /**
     * Registra uma interação atômica, alimentando o pipeline de Learning Analytics.
     * Vital para a mediação no tempo certo (ZDP) e detecção de pseudoconceitos.
     * 
     * @param {string} bncc - Código da habilidade (ex: EF06MA07)
     * @param {boolean} acertou - Resultado da interação
     * @param {string} tipoErro - Categoria do erro (ex: 'SINAL', 'MECANIZACAO', 'NULO')
     * @param {number} cargaCognitiva - Tempo de resposta em ms
     */
    registrarInteracao(bncc, acertou, tipoErro = 'NULO', cargaCognitiva = 0) {
        // 1. Atualiza contadores gerais
        if (acertou) {
            this.acertos++;
            this.consec_erros = 0;
            this.combo++;
        } else {
            this.erros++;
            this.consec_erros++;
            this.combo = 0;
        }

        // 2. Inicializa o tracking do eixo BNCC se não existir
        if (!this.historico[bncc]) {
            this.historico[bncc] = { acertos: 0, erros: 0, perfilErros: {} };
        }

        // 3. Atualiza o histórico curricular local
        if (acertou) {
            this.historico[bncc].acertos++;
        } else {
            this.historico[bncc].erros++;
            this.historico[bncc].perfilErros[tipoErro] = (this.historico[bncc].perfilErros[tipoErro] || 0) + 1;
        }

        // 4. Salva o Log bruto para o Profile Engine da ADA analisar assincronamente
        this.diagnostico.logs.push({
            timestamp: Date.now(),
            bloco: this.currentBlock,
            bncc,
            acertou,
            tipoErro,
            latenciaMs: cargaCognitiva,
            trilhaAtual: this.trilha
        });
    }
};
