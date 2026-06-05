/**
 * @fileoverview QuestionNormalizer.js
 * @description Camada de Governança (Governance Layer) do LabTech.
 * VERSÃO 2.3.0: Alinhamento ontológico estrito com DiagnosticEngine v5.2.1 e BOA v2.2.1.
 * @package LabTech / Core ADA
 */

export class QuestionNormalizer {
    constructor() {}

    /**
     * Valida, higieniza e normaliza o payload estrutural de uma questão matemática.
     * Garante o mapeamento estrito do legado para as chaves nativas dos motores.
     * @param {Object} rawQuestion - O JSON bruto da questão vindo do banco.
     * @returns {Object} JSON higienizado, padronizado e blindado.
     */
    normalize(rawQuestion) {
        if (!rawQuestion) {
            throw new Error("[Governance Error] Payload do Sensor Cognitivo está nulo ou indefinido.");
        }

        if (!rawQuestion.id || !rawQuestion.alternativas) {
            throw new Error(`[Governance Error] Estrutura corrompida no item ID: ${rawQuestion.id || 'Desconhecido'}`);
        }

        const blocoCalculado = rawQuestion.bloco || rawQuestion.aula || 1;

        // 1. Tradução semiótica do suporte visual antigo para o CanvasRenderer
        let representacaoSuportada = 'SIMBOLICA_CONCEITUAL';
        const supVisual = String(rawQuestion.suporteVisual || rawQuestion.representacao || '').toUpperCase();
        
        if (supVisual.includes('RETA') || supVisual.includes('LINEAL')) {
            representacaoSuportada = 'TEXTUAL_SQUEMATICA';
        } else if (supVisual.includes('BARRA') || supVisual.includes('FRA') || supVisual.includes('SIMBOLICO') || supVisual.includes('VISUAL')) {
            representacaoSuportada = 'CONCRETA'; 
        }

        // 2. Alinhamento Estrito com a Ontologia Galperin dos Motores Core V5
        let estagioCalculado = 'MENTAL_ABSTRATA';
        const tipoPedago = String(rawQuestion.tipoPedagogico || '').toUpperCase();
        if (tipoPedago === 'RECOMPOSICAO' || representacaoSuportada === 'CONCRETA') {
            estagioCalculado = 'MATERIALIZADA_CONCRETA';
        } else if (tipoPedago === 'TRANSICAO' || tipoPedago === 'EXPLICA') {
            estagioCalculado = 'VERBAL_EXPLICATIVA';
        }

        return {
            id: String(rawQuestion.id),
            bloco: Number(blocoCalculado),
            // Acoplamento seguro com o Registro de Famílias Invariantes de Davýdov
            familiaId: rawQuestion.familiaId || rawQuestion.familia || "FAMILIA_GERAL",
            bncc: String(rawQuestion.bncc || 'GERAL'),
            bncc_desc: String(rawQuestion.bncc_desc || 'Mapeamento Curricular Ativo'),
            tipo: String(rawQuestion.tipo || 'aritmetica'),
            dificuldade: Number(rawQuestion.dificuldade || 1),
            
            display: rawQuestion.display || rawQuestion.texto || "Desafio sem enunciado explícito.",
            passo: rawQuestion.passo || "Excelente raciocínio lógico.",
            dica: rawQuestion.dica || "Analise os detalhes com atenção.",
            
            representacao: representacaoSuportada,
            faseGalperin: estagioCalculado, // Sincronizado com a propriedade real do core

            // 3. Padronização e Blindagem de Alternativas (Biópsia de Erros)
            alternativas: rawQuestion.alternativas.map(alt => {
                const isAcerto = alt.tipo === 'acerto' || alt.tipo === 'correto' || alt.correta === true || alt.correto === true;
                const misconceptionTratada = alt.erro || alt.misconception || (isAcerto ? 'N/A' : 'ERRO_GENERICO');
                const descricaoTratada = alt.descricao || alt.diagnostico_cognitivo || (isAcerto ? 'Conceito aplicado com sucesso.' : 'Análise técnica em andamento.');
                
                return {
                    id_alternativa: String(alt.id || Math.random().toString(36).substring(2, 7)),
                    valor: String(alt.valor || alt.texto || alt.label || ""),
                    tipo: isAcerto ? 'acerto' : 'erro',
                    correta: isAcerto, // Retrocompatibilidade direta com o DiagnosticEngine
                    
                    categoria: alt.categoria || (isAcerto ? 'SUCESSO_TEORICO' : 'calculo'),
                    misconception: misconceptionTratada,
                    erro: misconceptionTratada, // Duplo mapeamento defensivo (Garantia de barramento)
                    
                    // Alimenta o scanner síncrono do DiagnosticEngine
                    descricao: descricaoTratada,
                    diagnostico_cognitivo: descricaoTratada,
                    peso_gravidade: Number(alt.peso || alt.peso_gravidade || (isAcerto ? 0 : 1))
                };
            }),
            
            scaffolds_adaptativos: rawQuestion.scaffolds_adaptativos || {
                MATERIALIZADA_CONCRETA: rawQuestion.dica || null,
                VERBAL_EXPLICATIVA: rawQuestion.passo || null,
                MENTAL_ABSTRATA: null
            },
            
            normalizedAt: new Date().toISOString()
        };
    }
}
