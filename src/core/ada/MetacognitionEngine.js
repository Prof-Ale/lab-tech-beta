/**
 * @fileoverview MetacognitionEngine.js
 * @description Converte métricas da ADA em feedback formativo metacognitivo. (MODO DE TESTE ATIVO)
 */

export class MetacognitionEngine {
    
    static gerarFeedback(perfil) {
        console.log("🧠 [Metacognição] ADA avaliando se deve intervir...", perfil);

        // Regra 0: Segurança contra dados nulos
        if (!perfil || perfil.confiancaDiagnostica === undefined) return null;

        // MODO TESTE: Baixamos a exigência de 60% para apenas 10% de confiança
        if (perfil.confiancaDiagnostica < 10) {
            console.log("🧠 [Metacognição] Silêncio. Confiança ainda está em:", perfil.confiancaDiagnostica + "%");
            return null;
        }

        // MODO TESTE: Removemos o filtro anti-spam (Math.random) para você SEMPRE ver o popup
        
        const feedbacks = [];

        // 1. Feedback sobre a Estilo de Aprendizagem
        if (perfil.perfilDominante === 'DEPENDENTE_CONCRETO') {
            feedbacks.push("Notei que você se sente mais seguro com as imagens. Que tal tentar imaginar o desenho na sua cabeça antes de marcar a resposta?");
        } else if (perfil.perfilDominante === 'IMPULSIVO_ARITMETICO') {
            feedbacks.push("Sua velocidade de cálculo é ótima! Mas alguns erros recentes parecem ser pressa. Respire 3 segundos antes do próximo clique.");
        } else if (perfil.perfilDominante === 'PROCEDURAL_MECANICO') {
            feedbacks.push("Você decorou bem a regra matemática! Mas será que a imagem faz sentido com a sua resposta? Observe a geometria do problema.");
        } else if (perfil.perfilDominante === 'CONCEITUAL_TEORICO') {
            feedbacks.push("Excelente! A sua consistência mostra um domínio profundo da lógica abstrata. A ADA está impressionada.");
        } else {
            // Caso caia em INDEFINIDO, mas já tenha confiança, dispara um genérico:
            feedbacks.push("A ADA está mapeando seu padrão neural. Continue respondendo com atenção.");
        }

        // 2. Feedback sobre Pseudoconceito (Risco)
        if (perfil.indicePseudoconceito > 0.5) {
            feedbacks.push("Você está avançando rápido! Mas cuidado: o conhecimento sólido às vezes exige uma pausa para conferir a lógica da pergunta, não apenas os números.");
        }

        // 3. Feedback sobre a Estabilidade
        if (perfil.estabilidadeConceitual === 'BAIXA_RISCO_PSEUDOCONCEITO') {
            feedbacks.push("Identifiquei que você domina a operação mecânica, mas o contexto de texto te confunde. Tente focar em 'o que' a história pede.");
        }

        // Sorteia o feedback
        const escolhido = feedbacks[Math.floor(Math.random() * feedbacks.length)];
        
        // Log para provar no console que a engine disparou o popup
        console.log("🧠 [Metacognição] DISPARANDO POPUP NA TELA:", escolhido);
        
        return escolhido;
    }
}
