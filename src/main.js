/**
 * @fileoverview DiagnosticEngine.js
 * @description Motor de Diagnóstico Cognitivo Atómico e Biópsia de Erros.
 * VERSÃO 5.2.0: Calcula a confiança cruzando o peso da alternativa com a persistência histórica.
 * @package LabTech / Core ADA
 */

export class DiagnosticEngine {
    constructor(familyRegistry = {}) {
        this.familyRegistry = familyRegistry;
    }

    /**
     * Realiza a biópsia síncrona do clique do estudante.
     * @param {Object} alternativa - Alternativa selecionada pelo utilizador.
     * @param {string} familiaId - Identificador da Família Invariante ativa.
     * @param {Object} perfilCognitivo - Perfil longitudinal vindo do ProfileEngine.
     */
    analisarAlternativa(alternativa, familiaId, perfilCognitivo = {}) {
        const foiCorreto = alternativa.correta === true || alternativa.tipo === "acerto";
        const etiologia = (alternativa.misconception || alternativa.erro || 'ERRO_GENERICO').toUpperCase();
        
        // Recupera dados ontológicos da família no Registry
        const dadosFamilia = this.familyRegistry[familiaId] || {};
        const conceitoAfetado = dadosFamilia.conceitoEstrutural || "VALOR_POSICIONAL";

        if (foiCorreto) {
            return {
                correto: true,
                clusterTaxonomico: "AUTONOMIA_CONCEITUAL",
                hipoteseCognitiva: { conceptoAfetado, nivelConfiancaDiagnostica: 1.0 },
                planoDeMediacao: { choqueSemioticoRecomendado: false, representacaoPreferencial: "SIMBOLICA_CONCEITUAL" }
            };
        }

        // 🚨 CIRURGIA COMPLEMENTAR: CÁLCULO DE CONFIANÇA BASEADO EM HISTÓRICO + ETIOLOGIA
        const historicoErro = perfilCognitivo.registroPseudoconceitos?.[etiologia];
        const frequenciaHistorica = historicoErro ? historicoErro.frequencia : 0;
        
        // Peso clínico base da falha (erros mapeados geram maior certeza diagnóstica)
        const pesoEtiologia = (etiologia !== 'ERRO_GENERICO' && etiologia !== 'CONCEITO') ? 0.70 : 0.40;
        
        // Modificador de recorrência: quanto mais vezes o erro aparece, maior a certeza do sensor
        const modificadorRecorrencia = Math.min(0.25, frequenciaHistorica * 0.05);
        
        const confiancaCalculada = Number((pesoEtiologia + modificadorRecorrencia).toFixed(2));

        // Determina se exige Choque Semiótico para desautomatização
        const requerChoque = etiologia !== 'ERRO_GENERICO' && (frequenciaHistorica >= 2 || perfilCognitivo.indicePseudoconceito > 0.5);

        return {
            correto: false,
            clusterTaxonomico: "AUTOMATIZAÇÃO_EMPÍRICA",
            hipoteseCognitiva: {
                conceitoAfetado: conceitoAfetado,
                etiologiaIdentificada: etiologia,
                nivelConfiancaDiagnostica: confiancaCalculada
            },
            planoDeMediacao: {
                faseGalperinSugerida: requerChoque ? "MATERIALIZADA_CONCRETA" : "VERBAL_EXPLICATIVA",
                representacaoPreferencial: requerChoque ? "CONCRETA" : "TEXTUAL_REFLEXIVA",
                scaffoldOperacional: alternativa.descricao || "Analise a estrutura conceitual do problema sob esta nova perspetiva.",
                choqueSemioticoRecomendado: requerChoque
            }
        };
    }
}
