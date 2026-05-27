/**
 * @fileoverview MetacognitionEngine.js
 * @description Converte métricas da ADA em feedback formativo metacognitivo.
 * EVOLUÇÃO: Cadência Determinística, Gestão de Carga Cognitiva e Triagem de Risco.
 * @version 2.0.0
 * @package LabTech / Core ADA
 */

export class MetacognitionEngine {
    
    static gerarFeedback(perfil) {
        if (!perfil || perfil.confiancaDiagnostica === undefined) return null;
        
        // 1. A IA só fala se tiver certeza razoável do padrão (> 50%)
        if (perfil.confiancaDiagnostica < 50) return null;

        // 2. Trava Anti-Spam Determinística (Gestão de Carga Cognitiva - DUA)
        // Intervém exatamente a cada 5 questões. Evita silêncios longos ou spam sequencial.
        if (perfil.itensRespondidos === 0 || perfil.itensRespondidos % 5 !== 0) return null;

        // 3. PRIORIDADE MÁXIMA: Triagem de Risco Pedagógico (Pseudoconceitos)
        if (perfil.indicePseudoconceito > 0.5) {
            return "🧠 [Reflexão] Você está avançando rápido! Mas cuidado: o conhecimento profundo exige uma pausa para conferir a lógica da pergunta, e não apenas os números soltos.";
        }

        if (perfil.estabilidadeConceitual === 'BAIXA_RISCO_PSEUDOCONCEITO') {
            return "🧠 [Dica da ADA] Identifiquei que você domina a operação de cálculo, mas a interpretação te confunde. Tente focar em 'o que' a história pede antes de montar a conta.";
        }

        // 4. FEEDBACK DE ESPELHO COGNITIVO (Se não houver risco iminente)
        if (perfil.perfilDominante === 'DEPENDENTE_CONCRETO') {
            return "🧠 [Metacognição] Notei que você se sente mais seguro com as imagens. Que tal tentar imaginar o desenho na sua cabeça antes de clicar na resposta?";
        } 
        
        if (perfil.perfilDominante === 'IMPULSIVO_ARITMETICO') {
            return "🧠 [Autorregulação] Sua velocidade de cálculo é ótima! Mas alguns erros recentes parecem ser pressa. Respire fundo por 3 segundos antes do próximo clique.";
        } 
        
        if (perfil.perfilDominante === 'PROCEDURAL_MECANICO') {
            return "🧠 [Lógica] Você decorou bem as regras matemáticas! Mas será que a conta faz sentido no mundo real? Observe o contexto e a imagem do problema.";
        } 
        
        if (perfil.perfilDominante === 'CONCEITUAL_TEORICO') {
            return "⭐ [Excelência] Sua consistência mostra um domínio profundo do pensamento abstrato. A ADA está calibrando desafios mais complexos para você.";
        }

        // Fallback silencioso se o perfil ainda estiver indefinido
        return null;
    }
}
