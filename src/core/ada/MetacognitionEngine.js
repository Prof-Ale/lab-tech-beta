/**
 * @fileoverview MetacognitionEngine.js
 * @description Motor de Base Orientadora da Ação (BOA) baseado em Galperin e Davýdov.
 * Atua mediando a atenção do aluno para invariantes conceituais e estruturais.
 * EVOLUÇÃO 10.7.1: Orientação Baseada em Eventos Persistentes, delegação de estagnação 
 * para o ProfileEngine e rastreamento robusto do Estágio Conceitual.
 */

const BOA_CONFIG = {
    CONFIANCA_MINIMA_IA: 40.0, // Exige que o perfil tenha alguma estabilidade
    JANELA_EVENTOS_RECENTES: 1, // Analisa apenas a última rodada para eventos síncronos
    LIMITE_ERROS_SEQUENCIAIS: 3, // Queda vertiginosa de performance operacional
    LIMITE_ESTAGNACAO_ESTAGIO: 5 // Qtd. de itens preso no mesmo estágio conceitual
};

// 🧠 MATRIZ DE ORIENTAÇÃO DA AÇÃO (Galperin/Davýdov)
const MATRIZ_ORIENTACAO = {
    
    // PRIORIDADE 1: EVENTOS COGNITIVOS (Gatilhos Ativos)
    EVENTOS: {
        PRIMEIRA_TRANSFERENCIA_OK: "🚀 [Descolamento] Excelente! Você aplicou a ideia em uma representação totalmente diferente. O que garante que essa lógica funciona nas duas situações?",
        MUDANCA_ESTAGIO_TRANSICAO: "🧠 [Transferência] Você está começando a enxergar além do desenho. Qual relação matemática continua existindo mesmo quando a imagem muda?",
        QUEDA_ESTABILIDADE: "⚠️ [Alinhamento] Notei que a estratégia funcionou em um formato, mas falhou no outro. Volte um passo: qual é a regra principal que une esses dois tipos de problema?"
    },

    // PRIORIDADE 2: ESTÁGIO CONCEITUAL (Camada B)
    ESTAGIOS_CONCEITUAIS: {
        PSEUDOCONCEITO_ESTAVEL: "🧠 [Orientação] Você encontrou uma forma eficiente de resolver este formato específico. Agora, tente identificar o que permanece igual se os números ou a representação mudarem.",
        EM_TRANSICAO_CONCEITUAL: "🧠 [Reflexão] Você já percebeu que o conceito se mantém. Para não errar nos detalhes, tente descrever o problema com suas palavras antes de calcular.",
        GENERALIZACAO_CONSOLIDADA: "⭐ [Síntese] Você demonstra domínio sobre a estrutura do problema. Tente explicar por que essa regra funciona sempre, e não apenas como aplicá-la."
    },

    // PRIORIDADE 3: PERFIL OPERACIONAL (Camada A - Fallback)
    PERFIS_OPERACIONAIS: {
        DEPENDENTE_CONCRETO: "🧠 [Abstração] O apoio visual ajudou até aqui. Qual parte da imagem representa a regra que podemos escrever no papel?",
        IMPULSIVO_ARITMETICO: "🧠 [Controle] A velocidade está ótima, mas o controle é fundamental. Qual passo estrutural do seu raciocínio pode ter sido pulado?",
        PROCEDURAL_MECANICO: "🧠 [Estrutura] A regra foi aplicada corretamente. Como essa mesma regra se comportaria se invertêssemos o problema?"
    }
};

export class MetacognitionEngine {
    
    /**
     * Avalia o estado atual do estudante e retorna a Base Orientadora da Ação (BOA) adequada.
     * @param {Object} perfilCognitivo - O perfil global gerado pelo ProfileEngine.
     * @param {String} habilidadeId - O código da BNCC atual.
     * @returns {String|null} A mensagem de orientação metacognitiva ou null.
     */
    static gerarFeedback(perfilCognitivo, habilidadeId = "GERAL") {
        if (!perfilCognitivo || perfilCognitivo.confiancaDiagnostica < BOA_CONFIG.CONFIANCA_MINIMA_IA) {
            return null; // Evita mediação com baixa confiança de diagnóstico
        }

        const hab = perfilCognitivo.habilidades?.[habilidadeId];
        if (!hab) return null;

        const ev = hab.evidenciasConceituais;
        
        // Inicializa o controle de consumo de eventos, se não existir
        if (!hab.metaEventosConsumidos) {
            hab.metaEventosConsumidos = {};
        }
        
        // 1. AVALIAÇÃO DE EVENTOS COGNITIVOS (Disparo Imediato)
        const eventoAtivo = this._detectarEventoCognitivo(hab, ev);
        if (eventoAtivo) {
            return MATRIZ_ORIENTACAO.EVENTOS[eventoAtivo];
        }

        // 2. AVALIAÇÃO DE ESTADO ESTAGNADO (Delegação para o ProfileEngine)
        if (this._deveOrientarPorEstagnacao(hab, ev)) {
            
            // Prioridade da Camada B
            if (MATRIZ_ORIENTACAO.ESTAGIOS_CONCEITUAIS[ev.estagioConceitual]) {
                return MATRIZ_ORIENTACAO.ESTAGIOS_CONCEITUAIS[ev.estagioConceitual];
            }
            
            // Fallback para Camada A
            if (MATRIZ_ORIENTACAO.PERFIS_OPERACIONAIS[hab.perfilDominante]) {
                return MATRIZ_ORIENTACAO.PERFIS_OPERACIONAIS[hab.perfilDominante];
            }
        }

        return null;
    }

    /**
     * Lê o rastro do ProfileEngine de forma resiliente a recarregamentos,
     * detectando se ocorreu uma mudança epistemológica não consumida.
     */
    static _detectarEventoCognitivo(hab, ev) {
        // A. Primeira transferência bem-sucedida (Resiliente)
        if (ev.transferenciasBemSucedidas > 0 && ev.historicoTransferencia.length > 0) {
            const ultimoChoque = ev.historicoTransferencia[ev.historicoTransferencia.length - 1];
            
            if (ultimoChoque.correto && !hab.metaEventosConsumidos.primeiraTransferencia) {
                hab.metaEventosConsumidos.primeiraTransferencia = Date.now(); 
                return 'PRIMEIRA_TRANSFERENCIA_OK';
            }
        }

        // B. Mudanças na Trajetória Conceitual (Resiliente)
        if (ev.trajetoriaConceitual && ev.trajetoriaConceitual.length > 0) {
            const ultimaTransicao = ev.trajetoriaConceitual[ev.trajetoriaConceitual.length - 1];
            
            if (!hab.metaEventosConsumidos.ultimaTransicao || hab.metaEventosConsumidos.ultimaTransicao !== ultimaTransicao.data) {
                hab.metaEventosConsumidos.ultimaTransicao = ultimaTransicao.data;
                
                if (ultimaTransicao.para === 'EM_TRANSICAO_CONCEITUAL') return 'MUDANCA_ESTAGIO_TRANSICAO';
                if (ultimaTransicao.de === 'GENERALIZACAO_CONSOLIDADA' && ultimaTransicao.para !== 'GENERALIZACAO_CONSOLIDADA') return 'QUEDA_ESTABILIDADE';
            }
        }

        return null;
    }

    /**
     * Verifica se o aluno precisa de mediação da BOA por estagnação operacional
     * ou por aprisionamento em um estágio conceitual, consumindo do ProfileEngine.
     */
    static _deveOrientarPorEstagnacao(hab, ev) {
        // 1. Queda vertiginosa de performance no operacional
        if (hab.errosSequenciais >= BOA_CONFIG.LIMITE_ERROS_SEQUENCIAIS) return true;

        // 2. Estagnação baseada no Estado Conceitual (Fonte: ProfileEngine)
        const presoNoEstagio = (ev.itensNoEstagioAtual || 0) >= BOA_CONFIG.LIMITE_ESTAGNACAO_ESTAGIO;

        return presoNoEstagio;
    }
}
