/**
 * @fileoverview LearningAnalytics.js v4.2.0 — "LabTech Cognitive Sensor Processor"
 * @description Mecanismo central de telemetria, inferência cognitiva e detecção de pseudoconceitos.
 * Analisa streams imutáveis de eventos de interação para extrair perfis e misconceptions na ZDP.
 * 
 * @version 4.2.0
 * @package LabTech / ADA Intelligent Tutoring System
 */

// Enums Estritos de Classificação Pedagógica
export const CONFIG_ANALYTICS = Object.freeze({
    PERFIS: {
        PROCEDURAL_MECANICO: 'PROCEDURAL_MECANICO',
        DEPENDENTE_CONCRETO: 'DEPENDENTE_CONCRETO',
        IMPULSIVO_LINEAR: 'IMPULSIVO_LINEAR',
        CONCEITUAL_TEORICO: 'CONCEITUAL_TEORICO'
    },
    MISCONCEPTIONS: {
        LINEARIZACAO_PROPORCIONAL: 'LINEARIZACAO_PROPORCIONAL',
        QUEBRA_VERTICE_DESCONTINUO: 'QUEBRA_VERTICE_DESCONTINUO',
        DESCONEXAO_RAMO_SIMETRICO: 'DESCONEXAO_RAMO_SIMETRICO'
    },
    ESTAGIOS_GALPERIN: {
        MATERIAL_CONCRETO: 'MATERIAL_CONCRETO',
        ICONICO_VISUAL: 'ICONICO_VISUAL',
        VERBAL_EXTERNO: 'VERBAL_EXTERNO',
        LINGUAGEM_INTERNA: 'LINGUAGEM_INTERNA'
    }
});

/**
 * Processa o histórico imutável de interações do estudante e extrai uma biópsia cognitiva completa.
 * 
 * @param {Array<Object>} interactionEvents - Stream de eventos coletados pelos sensores da interface.
 * @param {Object} currentProfileState - Estado atual de classificação do perfil do estudante.
 * @returns {Object} Novo estado analítico consolidado e imutável (Explicabilidade Total).
 */
export function analisarEventosInteracao(interactionEvents, currentProfileState) {
    // Defesa sanitária contra estruturas ausentes ou corrompidas
    const eventos = Array.isArray(interactionEvents) ? interactionEvents : [];
    if (eventos.length === 0) {
        return Object.freeze({
            indicePseudoconceito: 0,
            friccionCognitiva: 0,
            viesLinear: 0,
            perfilInferido: CONFIG_ANALYTICS.PERFIS.DEPENDENTE_CONCRETO,
            estagioGalperinAtual: CONFIG_ANALYTICS.ESTAGIOS_GALPERIN.MATERIAL_CONCRETO,
            misconceptionsDetectadas: [],
            metaExplicabilidade: "Histórico vazio. Inicializando calibragem adaptativa básica."
        });
    }

    // 1. Extração de Métricas de Latência e Padrões de Movimento
    const totalEventos = eventos.length;
    let somaLatencias = 0;
    let eventosImpulsivos = 0;
    let correcoesLinearesAditivas = 0;
    let alteracoesDirecaoSeletor = 0;
    let ultimoValorSeletor = null;
    let ultimaDirecao = null;

    let acertosProcedurais = 0;
    let falhasConceituaisGraficas = 0;

    for (let i = 0; i < totalEventos; i++) {
        const e = eventos[i];
        somaLatencias += e.latencyMs || 0;

        // Rastreamento de Impulsividade (Latência crítica de reação abaixo de 2500ms)
        if (e.latencyMs && e.latencyMs < 2500) {
            eventosImpulsivos++;
        }

        // Rastreamento de Viés Linear (Ajustes repetitivos de incremento fixo ex: +1, +1, +1)
        if (e.tipoAcao === 'AJUSTE_PARAMETRICO') {
            if (ultimoValorSeletor !== null) {
                const delta = e.valor - ultimoValorSeletor;
                const direcaoAtual = Math.sign(delta);
                
                if (direcaoAtual !== ultimaDirecao && ultimaDirecao !== null) {
                    alteracoesDirecaoSeletor++; // Fricção cinética detectada
                }
                if (Math.abs(delta) === 1 || Math.abs(delta) === 10) {
                    correcoesLinearesAditivas++; // Indicativo de raciocínio aditivo simples
                }
                ultimaDirecao = direcaoAtual;
            }
            ultimoValorSeletor = e.valor;
        }

        // Mapeamento de Pseudoconceito (Sucesso em equações formais vs Erro em gráficos dinâmicos)
        if (e.contextoAvaliacao === 'ALGEBRICO_FORMAL' && e.sucesso === true) acertosProcedurais++;
        if (e.contextoAvaliacao === 'GRAFICO_DINAMICO' && e.sucesso === false) falhasConceituaisGraficas++;
    }

    // 2. Cálculos Matemáticos dos Índices Proprietários da ADA
    const mediaLatencia = somaLatencias / totalEventos;
    const taxaImpulsividade = eventosImpulsivos / totalEventos;
    
    // Cálculo do Índice de Pseudoconceito (Discrepância procedural vs conceitual)
    const totalTestesCruzados = acertosProcedurais + falhasConceituaisGraficas;
    const indicePseudoconceito = totalTestesCruzados > 0 
        ? (acertosProcedurais * falhasConceituaisGraficas) / Math.pow(totalTestesCruzados, 2) * 4 // Normalizado entre 0 e 1
        : 0.5;

    // Cálculo da Fricção Cognitiva baseada na volatilidade das tentativas do usuário
    const friccionCognitiva = Math.min(alteracoesDirecaoSeletor / totalEventos, 1);
    
    // Cálculo do Viés Linear
    const viesLinear = correcoesLinearesAditivas / totalEventos;

    // 3. Mecanismo de Inferência de Misconceptions Estruturais
    const misconceptionsDetectadas = [];
    if (viesLinear > 0.6 && indicePseudoconceito > 0.4) {
        misconceptionsDetectadas.push(CONFIG_ANALYTICS.MISCONCEPTIONS.LINEARIZACAO_PROPORCIONAL);
    }
    if (friccionCognitiva > 0.7 && mediaLatencia < 3000) {
        misconceptionsDetectadas.push(CONFIG_ANALYTICS.MISCONCEPTIONS.DESCONEXAO_RAMO_SIMETRICO);
    }

    // 4. Classificação Conclusiva do Perfil Cognitivo Atual (Engine de Decisão da ADA)
    let perfilInferido = CONFIG_ANALYTICS.PERFIS.DEPENDENTE_CONCRETO;
    let estagioGalperinAtual = CONFIG_ANALYTICS.ESTAGIOS_GALPERIN.MATERIAL_CONCRETO;

    if (indicePseudoconceito > 0.65 && taxaImpulsividade < 0.3) {
        perfilInferido = CONFIG_ANALYTICS.PERFIS.PROCEDURAL_MECANICO;
        estagioGalperinAtual = CONFIG_ANALYTICS.ESTAGIOS_GALPERIN.ICONICO_VISUAL;
    } else if (taxaImpulsividade > 0.60 && viesLinear > 0.5) {
        perfilInferido = CONFIG_ANALYTICS.PERFIS.IMPULSIVO_LINEAR;
        estagioGalperinAtual = CONFIG_ANALYTICS.ESTAGIOS_GALPERIN.MATERIAL_CONCRETO;
    } else if (indicePseudoconceito < 0.25 && friccionCognitiva < 0.3 && mediaLatencia > 4000) {
        perfilInferido = CONFIG_ANALYTICS.PERFIS.CONCEITUAL_TEORICO;
        estagioGalperinAtual = CONFIG_ANALYTICS.ESTAGIOS_GALPERIN.LINGUAGEM_INTERNA;
    } else if (mediaLatencia > 5000 && friccionCognitiva > 0.4) {
        perfilInferido = CONFIG_ANALYTICS.PERFIS.DEPENDENTE_CONCRETO;
        estagioGalperinAtual = CONFIG_ANALYTICS.ESTAGIOS_GALPERIN.VERBAL_EXTERNO;
    }

    // 5. Geração da Camada de Explicabilidade Detalhada para Auditoria do Professor
    const metaExplicabilidade = `Estudante classificado como ${perfilInferido} com base em um índice de pseudoconceito de ${(indicePseudoconceito * 100).toFixed(1)}% e viés linear de ${(viesLinear * 100).toFixed(1)}%. Latência média observada: ${(mediaLatencia / 1000).toFixed(2)}s.`;

    // Retorno do objeto de biópsia cognitiva blindado contra mutações externas
    return Object.freeze({
        indicePseudoconceito: Number(indicePseudoconceito.toFixed(4)),
        friccionCognitiva: Number(friccionCognitiva.toFixed(4)),
        viesLinear: Number(viesLinear.toFixed(4)),
        perfilInferido,
        estagioGalperinAtual,
        misconceptionsDetectadas: Object.freeze(misconceptionsDetectadas),
        metaExplicabilidade
    });
}
