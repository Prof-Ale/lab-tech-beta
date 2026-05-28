/**
 * @fileoverview gameState.js
 * @description Estado Global Centralizado (Single Source of Truth) do LabTech v15.2.0.
 * IMPLEMENTAÇÃO: Event Bus Reativo e Gestão de Memória de Telemetria.
 * @version 1.5.2.0
 */

export const G = {
    // ==========================================
    // CONFIGURAÇÕES DE PERFORMANCE
    // ==========================================
    MAX_LOGS: 100, // Limite de logs na memória antes do dump/purge

    // ==========================================
    // 1. STATUS DE EXECUÇÃO (Reativos)
    // ==========================================
    _vida: 100,
    _energia: 100,
    
    get vida() { return this._vida; },
    set vida(v) { 
        this._vida = Math.max(0, Math.min(100, v)); 
        this._dispararEvento('vida-alterada', { valor: this._vida });
    },

    get energia() { return this._energia; },
    set energia(v) { 
        this._energia = Math.max(0, Math.min(100, v)); 
        this._dispararEvento('energia-alterada', { valor: this._energia });
    },

    combo: 0,
    nivel: 1,
    respondeu: false,
    tempoInicialQuestao: 0,

    // ==========================================
    // 2. MÉTODOS DE EVENT BUS (SISTEMA REATIVO)
    // ==========================================
    /**
     * Notifica a UI sobre mudanças de estado. 
     * O Canvas ou HUD podem escutar isso com: window.addEventListener('vida-alterada', ...)
     */
    _dispararEvento(nome, dados) {
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent(nome, { detail: dados }));
        }
    },

    // ==========================================
    // 3. TELEMETRIA E GESTÃO DE MEMÓRIA
    // ==========================================
    acertos: 0,
    erros: 0,
    consec_erros: 0,
    historico: {},
    diagnostico: { scores: {}, logs: [] },

    /**
     * Limpa a memória de logs, salvando antes no Storage para não perder dados.
     */
    limparLogs() {
        console.log("[LabTech] Memória de telemetria cheia. Realizando dump e limpeza...");
        // Salva logs existentes no LocalStorage antes de limpar
        const logsAntigos = JSON.parse(localStorage.getItem('lt_logs') || '[]');
        localStorage.setItem('lt_logs', JSON.stringify([...logsAntigos, ...this.diagnostico.logs]));
        
        // Limpa a memória ativa
        this.diagnostico.logs = [];
    },

    registrarInteracao(bncc, acertou, tipoErro = 'NULO', cargaCognitiva = 0) {
        // Atualiza contadores
        if (acertou) { this.acertos++; this.consec_erros = 0; this.combo++; } 
        else { this.erros++; this.consec_erros++; this.combo = 0; }

        // Atualiza histórico
        if (!this.historico[bncc]) this.historico[bncc] = { acertos: 0, erros: 0, perfilErros: {} };
        acertou ? this.historico[bncc].acertos++ : this.historico[bncc].erros++;

        // Log com Gestão de Memória
        this.diagnostico.logs.push({
            timestamp: Date.now(),
            bloco: this.currentBlock,
            bncc, acertou, tipoErro, latenciaMs: cargaCognitiva
        });

        // Purge automático
        if (this.diagnostico.logs.length >= this.MAX_LOGS) {
            this.limparLogs();
        }
    },

    // ==========================================
    // 4. PERSISTÊNCIA DE SESSÃO
    // ==========================================
    salvarProgresso() {
        localStorage.setItem('lt_historico', JSON.stringify(this.historico));
    },

    reiniciarParaNovoBloco(blocoId) {
        this.currentBlock = blocoId;
        this.vida = 100;
        this.energia = 100;
        this.combo = 0;
        this.acertos = 0;
        this.erros = 0;
        this.respondeu = false;
        this.tempoInicialQuestao = Date.now();
    }
};
