/**
 * @fileoverview gameState.js
 * @description Estado Global Centralizado (Single Source of Truth) do LabTech v15.0.
 * Gerencia buffers de telemetria, configurações DUA e estados adaptativos da ADA.
 * * @version 15.0.0
 * @package LabTech / Engine Architecture
 */

export const G = {
    // ==========================================
    // 1. STATUS DE EXECUÇÃO EM RUNTIME
    // ==========================================
    vida: 100,
    energia: 100,
    combo: 0,
    nivel: 1,
    respondeu: false,          // Trava de segurança (Debounce) contra cliques múltiplos síncronos
    tempoInicialQuestao: 0,    // Carimbo temporal (Timestamp Unix) para cálculo milimétrico de latência

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
    trilha: 1,                 // Complexidade interna (1: Reconhecimento, 2: Aplicação, 3: Investigação)

    // ==========================================
    // 4. DIAGNÓSTICO CLÍNICO LONGITUDINAL (Histórico-Cultural)
    // ==========================================
    historico: {},             // Agrupamento por códigos BNCC (Ex: EF06MA07: { acertos: 0, erros_conceito: 0... })
    
    diagnostico: {
        scores: {},            // Pontuações ponderadas por agrupamentos conceituais (Clusters)
        logs: []               // Série temporal de todas as interações atômicas da sessão
    },

    // ==========================================
    // 5. CACHE DE INTELIGÊNCIA DA ADA & PRONTUÁRIO
    // ==========================================
    perfilCognitivo: null,     // Prontuário gerado/recuperado pelo ProfileEngine
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
    // 6. PREFERÊNCIAS ACESSIBILIDADE E UX (Diretrizes DUA)
    // ==========================================
    musica: true,
    voz: true,

    // ==========================================
    // 7. MÉTODOS DE CONTROLE DE FLUXO DO ESTADO
    // ==========================================
    
    /**
     * Reseta os parâmetros de runtime para inicialização segura de um novo bloco de aprendizagem.
     * Limpa os acumuladores de sessão sem apagar o histórico de eixos da BNCC.
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
    }
};
