/**
 * @fileoverview MetacognitionEngine.js (Refatorada)
 * Evolução: Configuração por injeção e foco na Base Orientadora da Ação.
 */

const FEEDBACK_CONFIG = {
    INTERVALO_INTERVENCAO: 5,
    CONFIANCA_MINIMA: 50,
    THRESHOLDS: {
        RISCO_PSEUDOCONCEITO: 0.5
    }
};

const MENSAGENS_MEDIACAO = {
    RISCO_PSEUDOCONCEITO: "🧠 [Mediação] Percebi que você está focando nos números. Tente descrever o problema com suas palavras antes de realizar o cálculo. O que o problema realmente está pedindo?",
    BAIXA_RISCO_PSEUDOCONCEITO: "🧠 [Orientação] Você domina o cálculo. Agora, observe a relação entre as grandezas antes de armar a conta.",
    DEPENDENTE_CONCRETO: "🧠 [Desafio] Você usou bem as representações visuais. Consegue prever o resultado sem olhar o desenho agora?",
    IMPULSIVO_ARITMETICO: "🧠 [Reflexão] Velocidade é importante, mas o controle é fundamental. Qual passo do seu raciocínio pode ter sido pulado?",
    PROCEDURAL_MECANICO: "🧠 [Estrutural] Você aplicou a regra corretamente. Como essa regra se aplica se mudássemos o contexto da pergunta?",
    CONCEITUAL_TEORICO: "⭐ [Expansão] Você demonstrou domínio. Vamos elevar a complexidade das relações conceituais?"
};

export class MetacognitionEngine {
    
    static gerarFeedback(perfil) {
        if (!this._deveIntervir(perfil)) return null;

        return this._selecionarMensagem(perfil);
    }

    static _deveIntervir(perfil) {
        if (!perfil || perfil.confiancaDiagnostica < FEEDBACK_CONFIG.CONFIANCA_MINIMA) return false;
        return perfil.itensRespondidos > 0 && perfil.itensRespondidos % FEEDBACK_CONFIG.INTERVALO_INTERVENCAO === 0;
    }

    static _selecionarMensagem(perfil) {
        // Prioridade 1: Risco Pedagógico (Pseudoconceito)
        if (perfil.indicePseudoconceito > FEEDBACK_CONFIG.THRESHOLDS.RISCO_PSEUDOCONCEITO) {
            return MENSAGENS_MEDIACAO.RISCO_PSEUDOCONCEITO;
        }

        // Prioridade 2: Perfil Cognitivo
        return MENSAGENS_MEDIACAO[perfil.perfilDominante] || null;
    }
}
