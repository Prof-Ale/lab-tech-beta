/**
 * @fileoverview QuestionNormalizer.js
 * @description Camada de Governança (Governance Layer) do LabTech.
 * BLINDAGEM EVOLUÍDA: Sincronização de Chaves Legadas, Fallbacks Textuais e Mapeamento de Etiologia.
 * @version 2.1.0
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
        
        requiredFields.forEach(field => {
            if (!rawQuestion[field]) {
                throw new Error(`[Governance Error] Campo crítico ausente no Sensor Cognitivo ID ${rawQuestion.id || 'Desconhecido'}: ${field}`);
            }
        });

        // Garantia expandida: varre todos os padrões possíveis de acerto oriundos do banco
        const hasCorrect = rawQuestion.alternativas.some(alt => 
            alt.tipo === 'acerto' || alt.tipo === 'correto' || alt.correta === true || alt.correto === true
        );
        
        if (!hasCorrect) {
            console.warn(`[Governance Warning] A questão ${rawQuestion.id} não possui uma alternativa do tipo 'acerto'.`);
        }

        return {
            id: String(rawQuestion.id),
            bncc: String(rawQuestion.bncc || rawQuestion.habilidade || 'GERAL'),
            misconception_principal: String(rawQuestion.misconception_principal || 'NAO_MAPEADA'),
            
            display: rawQuestion.display?.text || rawQuestion.display || rawQuestion.texto || "Desafio sem enunciado explícito.",
            representacao: rawQuestion.representacao || 'visual',
            estagioGalperin: rawQuestion.estagioGalperin || 'INTERNA_PURA',

            alternativas: rawQuestion.alternativas.map(alt => {
                // Alinhamento absoluto com a validação do main.js
                const isAcerto = alt.tipo === 'acerto' || alt.tipo === 'correto' || alt.correta === true || alt.correto === true;
                
                return {
                    id_alternativa: String(alt.id_alternativa || alt.id || Math.random().toString(36).substring(2, 7)),
                    valor: String(alt.valor || alt.texto || alt.label || ""),
                    tipo: isAcerto ? 'acerto' : 'erro',
                    
                    // Transforma 'etiologia' e 'erro' antigas em 'categoria' e 'misconception' nova
                    categoria: alt.categoria || alt.etiologia || alt.erro || (isAcerto ? 'SUCESSO_TEORICO' : 'ERRO_GENERICO'),
                    misconception: alt.erro || alt.misconception || alt.categoria || (isAcerto ? 'N/A' : 'ERRO_GENERICO'),
                    
                    diagnostico_cognitivo: alt.descricao || alt.diagnostico_cognitivo || 'Sem diagnóstico mapeado.',
                    peso_gravidade: Number(alt.peso || alt.peso_gravidade || (isAcerto ? 0 : 1))
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
