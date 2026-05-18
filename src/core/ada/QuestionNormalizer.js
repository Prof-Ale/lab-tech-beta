/**
 * @fileoverview QuestionNormalizer.js
 * @description Camada de Governança (Governance Layer) do LabTech.
 * Responsável por higienizar, tipar e validar os JSONs das questões (Sensores Cognitivos)
 * vindos do banco de dados antigo, garantindo que a ADA não sofra crashes.
 * @version 2.0.0
 * @package LabTech / Core ADA
 */

export class QuestionNormalizer {
    constructor() {}

    /**
     * Valida e normaliza o payload estrutural de uma questão matemática adaptativa.
     * Mapeia atributos legados para o novo padrão exigido pelo ProfileEngine.
     * @param {Object} rawQuestion - O JSON bruto da questão.
     * @returns {Object} JSON higienizado e padronizado.
     */
    normalize(rawQuestion) {
        if (!rawQuestion) {
            throw new Error("[Governance Error] Payload do Sensor Cognitivo está nulo ou indefinido.");
        }

        const requiredFields = ['id', 'alternativas'];
        
        // 1. Validação de Campos Obrigatórios
        requiredFields.forEach(field => {
            if (!rawQuestion[field]) {
                throw new Error(`[Governance Error] Campo crítico ausente no Sensor Cognitivo ID ${rawQuestion.id || 'Desconhecido'}: ${field}`);
            }
        });

        // 2. Garantir que existe pelo menos uma alternativa correta mapeada
        const hasCorrect = rawQuestion.alternativas.some(alt => 
            alt.tipo === 'acerto' || alt.correto === true || alt.etiologia === 'CORRETO'
        );
        
        if (!hasCorrect) {
            console.warn(`[Governance Warning] A questão ${rawQuestion.id} não possui uma alternativa do tipo 'acerto'.`);
        }

        // 3. Normalização de estrutura padrão (Schema Enforcement)
        // Transforma chaves antigas em novas chaves para o ProfileEngine não quebrar
        return {
            id: String(rawQuestion.id),
            bncc: String(rawQuestion.bncc || rawQuestion.habilidade || 'GERAL'),
            misconception_principal: String(rawQuestion.misconception_principal || 'NAO_MAPEADA'),
            
            display: rawQuestion.display?.text || rawQuestion.display || "Questão sem enunciado explícito.",
            representacao: rawQuestion.representacao || 'visual',
            estagioGalperin: rawQuestion.estagioGalperin || 'INTERNA_PURA',

            alternativas: rawQuestion.alternativas.map(alt => {
                // Descobre se a alternativa é correta usando os padrões antigos ou novos
                const isAcerto = alt.tipo === 'acerto' || alt.correto === true || alt.etiologia === 'CORRETO';
                
                return {
                    id_alternativa: String(alt.id_alternativa || alt.id || Math.random().toString(36).substring(2, 7)),
                    valor: String(alt.valor),
                    tipo: isAcerto ? 'acerto' : 'erro',
                    
                    // Transforma 'etiologia' antiga em 'categoria' nova
                    categoria: alt.categoria || alt.etiologia || (isAcerto ? 'SUCESSO_TEORICO' : 'ERRO_GENERICO'),
                    
                    diagnostico_cognitivo: alt.diagnostico_cognitivo || 'Sem diagnóstico mapeado.',
                    peso_gravidade: Number(alt.peso_gravidade || (isAcerto ? 0 : 1))
                };
            }),
            
            scaffolds_adaptativos: rawQuestion.scaffolds_adaptativos || {
                VISUAL_SCHEMATIC: null,
                VERBALIZATION: null,
                ABSTRACT_SYMBOLIC: null
            },
            
            normalizedAt: new Date().toISOString()
        };
    }
}
