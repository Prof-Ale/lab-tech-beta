/**
 * @fileoverview MetacognitionEngine.js
 * @description Converte métricas da ADA em feedback formativo metacognitivo. (PRODUÇÃO)
 */

export class MetacognitionEngine {
    
    static gerarFeedback(perfil) {
        if (!perfil || perfil.confiancaDiagnostica === undefined) return null;
        
        // 1. A IA só fala se tiver certeza (> 60%)
        if (perfil.confiancaDiagnostica < 60) return null;

        // 2. Trava anti-spam: Só intervém em ~20% das oportunidades elegíveis
        if (Math.random() > 0.20) return null;

        const feedbacks = [];

        if (perfil.perfilDominante === 'DEPENDENTE_CONCRETO') {
            feedbacks.push("Notei que você se sente mais seguro com as imagens. Que tal tentar imaginar o desenho na sua cabeça antes de marcar a resposta?");
        } else if (perfil.perfilDominante === 'IMPULSIVO_ARITMETICO') {
            feedbacks.push("Sua velocidade de cálculo é ótima! Mas alguns erros recentes parecem ser pressa. Respire 3 segundos antes do próximo clique.");
        } else if (perfil.perfilDominante === 'PROCEDURAL_MECANICO') {
            feedbacks.push("Você decorou bem a regra matemática! Mas será que a imagem faz sentido com a sua resposta? Observe a geometria do problema.");
        } else if (perfil.perfilDominante === 'CONCEITUAL_TEORICO') {
            feedbacks.push("Excelente! A sua consistência mostra um domínio profundo da lógica abstrata. A ADA está impressionada.");
        } else {
            feedbacks.push("A ADA está mapeando seu padrão neural. Continue respondendo com atenção.");
        }

        if (perfil.indicePseudoconceito > 0.5) {
            feedbacks.push("Você está avançando rápido! Mas cuidado: o conhecimento sólido às vezes exige uma pausa para conferir a lógica da pergunta, não apenas os números.");
        }

        if (perfil.estabilidadeConceitual === 'BAIXA_RISCO_PSEUDOCONCEITO') {
            feedbacks.push("Identifiquei que você domina a operação mecânica, mas o contexto de texto te confunde. Tente focar em 'o que' a história pede.");
        }

        return feedbacks.length > 0 ? feedbacks[Math.floor(Math.random() * feedbacks.length)] : null;
    }
}
       
