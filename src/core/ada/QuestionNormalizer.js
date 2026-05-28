/**
 * @fileoverview QuestionNormalizer.js
 * @description Camada de Governança (Governance Layer) do LabTech.
 * ADAPTADO PARA O BANCO DE QUESTÕES (Mapeamento de Legados Dinâmico).
 * @version 2.2.0
 * @package LabTech / Core ADA
 */

export class QuestionNormalizer {
    constructor() {}

    /**
     * Valida e normaliza o payload estrutural de uma questão matemática adaptativa.
     * Traduz o esquema do banco de 511 itens para as chaves nativas do motor.
     * @param {Object} rawQuestion - O JSON bruto da questão.
     * @returns {Object} JSON higienizado e padronizado.
     */
    normalize(rawQuestion) {
        if (!rawQuestion) {
            throw new Error("[Governance Error] Payload do Sensor Cognitivo está nulo ou indefinido.");
        }

        // Validação de segurança básica
        if (!rawQuestion.id || !rawQuestion.alternativas) {
            throw new Error(`[Governance Error] Estrutura corrompida no item ID: ${rawQuestion.id || 'Desconhecido'}`);
        }

        // Mapeamento dinâmico de blocos/aulas
        const blocoCalculado = rawQuestion.bloco || rawQuestion.aula || 1;

        // Tradução semiótica do suporte visual do banco antigo para o CanvasRenderer
        let representacaoSuportada = 'abstrato';
        const supVisual = String(rawQuestion.suporteVisual || rawQuestion.representacao || '').toUpperCase();
        
        if (supVisual.includes('RETA') || supVisual.includes('LINEAL')) {
            representacaoSuportada = 'reta';
        } else if (supVisual.includes('BARRA') || supVisual.includes('FRA') || supVisual.includes('SIMBOLICO')) {
            // VIEWPORT_SIMBOLICO ou itens de dinheiro/frações acionam o renderizador visual
            representacaoSuportada = 'visual'; 
        }

        // Tradução dos estágios de Galperin com base nos tipos do banco
        let estagioCalculado = 'INTERNA_PURA';
        const tipoPedago = String(rawQuestion.tipoPedagogico || '').toUpperCase();
        if (tipoPedago === 'RECOMPOSICAO' || representacaoSuportada === 'visual') {
            estagioCalculado = 'MATERIALIZADA'; // Foco em manipulação de objetos/dinheiro
        }

        return {
            id: String(rawQuestion.id),
            bloco: Number(blocoCalculado),
            bncc: String(rawQuestion.bncc || 'GERAL'),
            bncc_desc: String(rawQuestion.bncc_desc || 'Mapeamento Curricular Ativo'),
            tipo: String(rawQuestion.tipo || 'aritmetica'),
            dificuldade: Number(rawQuestion.dificuldade || 1),
            
            // Enunciado unificado
            display: rawQuestion.display || rawQuestion.texto || "Desafio sem enunciado explícito.",
            passo: rawQuestion.passo || "Excelente raciocínio lógico.",
            dica: rawQuestion.dica || "Analise os detalhes com atenção.",
            
            representacao: representacaoSuportada,
            estagioGalperin: estagioCalculado,

            // Padronização e Blindagem Absoluta de Alternativas
            alternativas: rawQuestion.alternativas.map(alt => {
                const isAcerto = alt.tipo === 'acerto' || alt.tipo === 'correto' || alt.correta === true || alt.correto === true;
                
                return {
                    id_alternativa: String(alt.id || Math.random().toString(36).substring(2, 7)),
                    // Suporta tanto o seu formato "valor" quanto o formato "texto" do main
                    valor: String(alt.valor || alt.texto || alt.label || ""),
                    tipo: isAcerto ? 'acerto' : 'erro',
                    
                    // Fallbacks inteligentes de categorização de erro
                    categoria: alt.categoria || (isAcerto ? 'SUCESSO_TEORICO' : 'calculo'),
                    misconception: alt.erro || alt.misconception || (isAcerto ? 'N/A' : 'ERRO_GENERICO'),
                    
                    // Alimenta o DiagnosticEngine com as descrições ricas que você já escreveu
                    diagnostico_cognitivo: alt.descricao || alt.diagnostico_cognitivo || (isAcerto ? 'Conceito aplicado com sucesso.' : 'Análise técnica em andamento.'),
                    peso_gravidade: Number(alt.peso || alt.peso_gravidade || (isAcerto ? 0 : 1))
                };
            }),
            
            scaffolds_adaptativos: rawQuestion.scaffolds_adaptativos || {
                VISUAL_SCHEMATIC: rawQuestion.dica || null,
                VERBALIZATION: rawQuestion.passo || null,
                ABSTRACT_SYMBOLIC: null
            },
            
            normalizedAt: new Date().toISOString()
        };
    }
}
