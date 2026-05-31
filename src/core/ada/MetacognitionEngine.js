/**
 * @fileoverview MetacognitionEngine.js
 * @description Motor de Base Orientadora da Ação (BOA) baseado em Galperin e Davýdov.
 * Atua mediando a atenção do aluno para invariantes conceituais e estruturais.
 * EVOLUÇÃO 10.7.0: Orientação Baseada em Eventos, Estágio Conceitual e Invariantes.
 */

const BOA_CONFIG = {
    CONFIANCA_MINIMA_IA: 40.0, // Exige que o perfil tenha alguma estabilidade
    JANELA_EVENTOS_RECENTES: 1 // Analisa apenas a última rodada para eventos síncronos
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
        
        // 1. AVALIAÇÃO DE EVENTOS COGNITIVOS (Disparo Imediato)
        const eventoAtivo = this._detectarEventoCognitivo(hab);
        if (eventoAtivo) {
            return MATRIZ_ORIENTACAO.EVENTOS[eventoAtivo];
        }

        // 2. AVALIAÇÃO DE ESTADO ESTAGNADO (Substitui o intervalo fixo)
        // Só orientamos com base no estágio se ele estiver estagnado nele há algum tempo,
        // para não poluir a tela a cada questão.
        if (this._deveOrientarPorEstagnacao(hab)) {
            
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
     * Lê o rastro do ProfileEngine para detectar se ocorreu uma mudança epistemológica agora.
     */
    static _detectarEventoCognitivo(hab) {
        const ev = hab.evidenciasConceituais;
        const totalItens = hab.itensRespondidos;

        // A. Primeira transferência bem-sucedida confirmada agora?
        if (ev.transferenciasBemSucedidas === 1 && ev.historicoTransferencia.length > 0) {
            const ultimoChoque = ev.historicoTransferencia[ev.historicoTransferencia.length - 1];
            // Se o último choque foi correto e ocorreu nesta exata rodada (aproximação via array)
            if (ultimoChoque.correto && ev.historicoTransferencia.length === ev.transferenciasBemSucedidas + ev.transferenciasFalhadas) {
                // Marca temporal simples para não repetir o evento
                if (!hab._metaFlag_PrimeiraTransf) {
                    hab._metaFlag_PrimeiraTransf = true;
                    return 'PRIMEIRA_TRANSFERENCIA_OK';
                }
            }
        }

        // B. Mudança de estágio conceitual nesta rodada?
        if (ev.trajetoriaConceitual.length > 0) {
            const ultimaTransicao = ev.trajetoriaConceitual[ev.trajetoriaConceitual.length - 1];
            if (!hab._metaFlag_UltimaTransicao || hab._metaFlag_UltimaTransicao !== ultimaTransicao.data) {
                hab._metaFlag_UltimaTransicao = ultimaTransicao.data;
                
                if (ultimaTransicao.para === 'EM_TRANSICAO_CONCEITUAL') return 'MUDANCA_ESTAGIO_TRANSICAO';
                // Queda de generalização para pseudoconceito/transição
                if (ultimaTransicao.de === 'GENERALIZACAO_CONSOLIDADA' && ultimaTransicao.para !== 'GENERALIZACAO_CONSOLIDADA') return 'QUEDA_ESTABILIDADE';
            }
        }

        return null;
    }

    /**
     * Em vez de intervalos matemáticos arbitrários (ex: % 5 === 0),
     * verifica se o aluno precisa de um "empurrão" da BOA por estar preso em um perfil.
     */
    static _deveOrientarPorEstagnacao(hab) {
        // Dispara se acumulou muitos erros sequenciais
        if (hab.errosSequenciais === 3) return true;

        // Dispara de tempos em tempos, mas atrelado ao volume de exposição àquela habilidade,
        // garantindo que não colida com os eventos ativos.
        return hab.itensRespondidos > 0 && hab.itensRespondidos % 6 === 0;
    }
}
