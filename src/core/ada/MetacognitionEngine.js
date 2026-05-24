/**
 * @fileoverview MetacognitionEngine.js
 * @description Converte métricas da ADA em feedback formativo metacognitivo.
 */

export class MetacognitionEngine {
    
    static gerarFeedback(perfil) {
        // Regra 0: Segurança contra dados nulos
        if (!perfil || !perfil.confiancaDiagnostica) return null;

        // Regra 1: Só intervir se a certeza da IA for robusta (> 60%)
        if (perfil.confiancaDiagnostica < 60) return null;

        // 🛡️ Regra 2: Controle de Frequência (Filtro Anti-Spam)
        // Mesmo que a IA tenha um conselho, ela só o dá em 20% das vezes (1 a cada 5 questões, em média).
        // Isso preserva o engajamento e não pausa o jogo o tempo todo.
        if (Math.random() > 0.20) return null;

        const feedbacks = [];

        // 1. Feedback sobre a Estilo de Aprendizagem
        if (perfil.perfilDominante === 'DEPENDENTE_CONCRETO') {
            feedbacks.push("Notei que você se sente mais seguro com as imagens. Que tal tentar imaginar o desenho na sua cabeça antes de marcar a resposta?");
        } else if (perfil.perfilDominante === 'IMPULSIVO_ARITMETICO') {
            feedbacks.push("Sua velocidade de cálculo é ótima! Mas alguns erros recentes parecem ser pressa. Respire 3 segundos antes do próximo clique.");
        }

        // 2. Feedback sobre Pseudoconceito (Risco)
        if (perfil.indicePseudoconceito > 0.5) {
            feedbacks.push("Você está avançando rápido! Mas cuidado: o conhecimento sólido às vezes exige uma pausa para conferir a lógica da pergunta, não apenas os números.");
        }

        // 3. Feedback sobre a Estabilidade
        if (perfil.estabilidadeConceitual === 'BAIXA_RISCO_PSEUDOCONCEITO') {
            feedbacks.push("Identifiquei que você domina a operação mecânica, mas o contexto de texto te confunde. Tente focar em 'o que' a história pede.");
        }

        // Retorna um feedback aleatório do banco de feedbacks elegíveis
        return feedbacks.length > 0 ? feedbacks[Math.floor(Math.random() * feedbacks.length)] : null;
    }
}
