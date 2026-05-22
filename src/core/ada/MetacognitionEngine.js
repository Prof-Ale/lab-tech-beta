/**
 * @fileoverview MetacognitionEngine.js
 * @description Converte métricas da ADA em feedback formativo metacognitivo.
 */

export class MetacognitionEngine {
    
    static gerarFeedback(perfil) {
        // Regra de ouro: Só intervir se a confiança da IA for alta
        if (perfil.confiancaDiagnostica < 60) return null;

        const feedbacks = [];

        // 1. Feedback sobre a Estilo de Aprendizagem
        if (perfil.perfilDominante === 'DEPENDENTE_CONCRETO') {
            feedbacks.push("Notei que você se sente mais seguro com as imagens. Que tal tentar imaginar o desenho na sua cabeça antes de marcar a resposta?");
        }

        // 2. Feedback sobre Pseudoconceito (Risco)
        if (perfil.indicePseudoconceito > 0.5) {
            feedbacks.push("Você está acertando muito rápido! Mas cuidado: o conhecimento sólido às vezes exige uma pausa para conferir o conceito, não apenas o cálculo.");
        }

        // 3. Feedback sobre a Estabilidade
        if (perfil.estabilidadeConceitual === 'BAIXA_RISCO_PSEUDOCONCEITO') {
            feedbacks.push("Identifiquei que você domina o procedimento, mas o contexto novo te confunde. Tente focar em 'o que' a pergunta pede, não apenas no número.");
        }

        // Retorna um feedback aleatório do banco de feedbacks elegíveis
        return feedbacks.length > 0 ? feedbacks[Math.floor(Math.random() * feedbacks.length)] : null;
    }
}
