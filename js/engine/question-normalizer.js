/**
 * LABTECH GOVERNANCE LAYER - QUESTION NORMALIZER
 * Valida, tipa e normaliza a estrutura de um Sensor Cognitivo bruto antes da ingestão.
 */
class QuestionNormalizer {
    constructor() {}

    /**
     * Valida e normaliza o payload estrutural de uma questão matemática adaptativa.
     * @param {Object} rawQuestion 
     * @returns {Object} JSON higienizado pronto para o banco de dados e Motor Adaptativo.
     */
    normalize(rawQuestion) {
        const requiredFields = ['id', 'bncc', 'misconception_principal', 'alternativas', 'scaffolds_adaptativos'];
        
        // Validação de Campos Obrigatórios de Governança
        requiredFields.forEach(field => {
            if (!rawQuestion[field]) {
                throw new Error(`[Normalizer Error] Campo crítico ausente no Sensor Cognitivo: ${field}`);
            }
        });

        // Garantir que existe pelo menos uma alternativa de acerto e alternativas com mapeamento de erro cognitivo
        consthasCorrect = rawQuestion.alternativas.some(alt => alt.tipo === 'acerto');
        if (!hasCorrect) {
            throw new Error(`[Normalizer Error] A questão ${rawQuestion.id} não possui uma alternativa do tipo 'acerto'.`);
        }

        // Normalização de estrutura padrão (Schema Enforcement)
        return {
            id: String(rawQuestion.id),
            bncc: String(rawQuestion.bncc),
            misconception_principal: String(rawQuestion.misconception_principal),
            display: {
                text: rawQuestion.display?.text || "",
                accessibility_alt: rawQuestion.display?.accessibility_alt || "Sensor cognitivo matemático visual."
            },
            alternativas: rawQuestion.alternativas.map(alt => ({
                valor: String(alt.valor),
                tipo: alt.tipo, // 'acerto' ou 'erro'
                categoria: alt.categoria || 'erro_generico',
                diagnostico_cognitivo: alt.diagnostico_cognitivo || 'Sem diagnóstico mapeado.',
                peso_gravidade: Number(alt.peso_gravidade || 0)
            })),
            scaffolds_adaptativos: {
                VISUAL_SCHEMATIC: rawQuestion.scaffolds_adaptativos.VISUAL_SCHEMATIC || null,
                VERBALIZATION: rawQuestion.scaffolds_adaptativos.VERBALIZATION || null,
                ABSTRACT_SYMBOLIC: rawQuestion.scaffolds_adaptativos.ABSTRACT_SYMBOLIC || null
            },
            normalizedAt: new Date().toISOString()
        };
    }
}

// Exportação explícita para arquitetura de microserviços Node.js/ESM se necessário
// export { QuestionNormalizer };
