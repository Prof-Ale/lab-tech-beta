/**
 * @fileoverview DiagnosticEngine.js
 * @description Motor de Biópsia Cognitiva e Diagnóstico Pedagógico do LabTech.
 * Recebe o clique do aluno e classifica a natureza matemática do erro antes
 * de enviar os dados para o rastreamento longitudinal (ProfileEngine).
 * @version 3.0.0
 * @package LabTech / Core ADA
 */

export class DiagnosticEngine {
    constructor() {
        /**
         * Clusters taxonômicos para mapeamento de acúmulo de carga de erro.
         */
        this.CLUSTERS = {
            "NUMEROCENTRISMO": ["valorposicional_ignora_ordem", "decomposicao_confunde_dezena_unidade", "inteiros_confunde_sinal_adicao"],
            "FRACIONARIO_DECIMAL": ["fracao_soma_denominadores", "fracao_soma_direta_bases_diferentes", "decimal_soma_desalinha_virgula"],
            "MODELAGEM_E_ALGEBRA": ["problema_ignora_condicao_inteira", "modelagem_interpreta_dobro_como_soma", "equacao_mantem_sinal_transposicao"],
            "ESTRUTURA_ESPACIAL": ["geometry_confunde_perimetro_area", "poligono_generaliza_triangulo"],
            "LITERACIA_ESTATISTICA": ["media_apenas_soma", "grafico_leitura_passiva"]
        };

        this.INTERVENCOES = {
            conceito: "Precisamos voltar à base. O conceito por trás dessa operação ainda não está claro.",
            procedimento: "Você entendeu a ideia, mas o 'passo a passo' falhou. Vamos revisar o método?",
            calculo: "Atenção aos detalhes! Foi apenas um pequeno deslize na conta final.",
            interpretacao: "O desafio aqui é traduzir o problema para a matemática. Vamos ler de novo?"
        };
    }

    /**
     * Analisa atomicamente a alternativa selecionada atuando como um sensor cognitivo.
     * Compatível com o formato legado e o novo JSON do QuestionNormalizer.
     * * @param {Object} alternativa - Dados estruturados da alternativa clicada.
     * @returns {Object} Laudo diagnóstico atômico da resposta.
     */
    analisarAlternativa(alternativa) {
        // Proteção contra payload nulo ou cliques fantasmas
        if (!alternativa) {
            return { 
                correto: false, 
                categoria: 'ERRO_GENERICO', 
                descricao: 'Falha na leitura do sensor.',
                peso: 1
            };
        }

        // Validação de sucesso (Suporta padrão antigo 'correto: true' e novo 'tipo: acerto')
        if (alternativa.tipo === 'acerto' || alternativa.correto === true) {
            return { 
                correto: true,
                categoria: alternativa.categoria || 'SUCESSO_TEORICO',
                descricao: alternativa.diagnostico_cognitivo || 'Conceito aplicado com sucesso.',
                peso: 0
            };
        }

        // Se for erro, constrói a biópsia detalhada da etiologia
        return {
            correto: false,
            categoria: alternativa.categoria || 'calculo', 
            erroId: alternativa.erro || alternativa.id_alternativa || 'erro_generico',   
            descricao: alternativa.diagnostico_cognitivo || alternativa.descricao || 'Análise técnica em andamento.',
            peso: alternativa.peso_gravidade !== undefined ? alternativa.peso_gravidade : (alternativa.peso || 1)
        };
    }
}
