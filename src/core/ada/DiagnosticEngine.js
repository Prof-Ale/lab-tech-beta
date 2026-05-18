/**
 * @fileoverview diagnostic-engine.js v4.0.0 — "LabTech Cognitive Biopsy Core"
 * @description Motor de Inteligência Pedagógica, Inferência Cognitiva e Mediação Baseada na Teoria Histórico-Cultural.
 * Sistema desacoplado, puramente funcional e imutável para gestão de ZDP, Pseudoconceitos e Mastery Learning.
 * 
 * @version 4.0.0
 * @package LabTech / ADA Architecture
 */

// ============================================================================
// 1. CONSTANTES TAXONÔMICAS E CONFIGURAÇÕES DE TRANSFERÊNCIA
// ============================================================================

export const CLUSTERS = {
    "NUMEROCENTRISMO": [
        "valorposicional_ignora_ordem", 
        "decomposicao_confunde_dezena_unidade", 
        "inteiros_confunde_sinal_adicao"
    ],
    "FRACIONARIO_DECIMAL": [
        "fracao_soma_denominadores", 
        "fracao_soma_direta_bases_diferentes", 
        "decimal_soma_desalinha_virgula"
    ],
    "MODELAGEM_E_ALGEBRA": [
        "problema_ignora_condicao_inteira", 
        "modelagem_interpreta_dobro_como_soma", 
        "equacao_mantem_sinal_transposicao",
        "funcao_leitura_estatica_incognita",
        "funcao_falha_covariancia_aditiva"
    ],
    "ESTRUTURA_ESPACIAL": [
        "geometry_confunde_perimetro_area", 
        "poligono_generaliza_triangulo"
    ],
    "LITERACIA_ESTATISTICA": [
        "media_apenas_soma", 
        "grafico_leitura_passiva"
    ]
};

export const ESTAGIOS_GALPERIN = {
    MATERIALIZADO: "MOTIVACIONAL_MATERIALIZADO",
    ICONICO_VISUAL: "PERCEPTIVO_VISUAL_ESQUEMATICO",
    VERBAL_EXTERNO: "VERBAL_LOGICO_EXTERNO",
    MENTAL_INTERNO: "MENTAL_ABSTRATO_INTERNO"
};

export const PERFIS_COGNITIVOS = {
    PROCEDURAL_MECANICO: "PROCEDURAL_MECANICO", // Executa o algoritmo mas não domina o conceito dinâmico
    DEPENDENTE_CONCRETO: "DEPENDENTE_CONCRETO", // Falha quando o andaime visual/materializado é removido
    IMPULSIVO_ARITMETICO: "IMPULSIVO_ARITMETICO", // Tenta combinar números aleatoriamente em baixa latência
    CONCEITUAL_TEORICO: "CONCEITUAL_TEORICO"     // Domínio do núcleo invariante e transferência ampla
};

// ============================================================================
// 2. MOTOR PEDAGÓGICO DE DIAGNÓSTICO (DIAGNOSTIC ENGINE)
// ============================================================================

/**
 * Analisa atomicamente a alternativa selecionada pelo estudante atuando como um sensor cognitivo.
 * @param {Object} alternativa - Dados estruturados da alternativa escolhida.
 * @returns {Object} Laudo diagnóstico atômico da resposta.
 */
export function analisarAlternativa(alternativa) {
    if (!alternativa) {
        return { 
            correto: false, 
            categoria: 'calculo', 
            erroId: 'erro_nao_catalogado', 
            descricao: 'Ausência ou inconsistência crítica de input.',
            peso: 1,
            estagioRequisitado: ESTAGIOS_GALPERIN.MATERIALIZADO
        };
    }

    if (alternativa.tipo === 'acerto' || alternativa.correto === true) {
        return { 
            correto: true, 
            estagioAlcancado: alternativa.estagio || ESTAGIOS_GALPERIN.MENTAL_INTERNO 
        };
    }

    return {
        correto: false,
        categoria: alternativa.categoria || 'calculo', 
        erroId: alternativa.erro || 'erro_generico',   
        descricao: alternativa.descricao || 'Desvio analítico não estruturado.',
        peso: Number(alternativa.peso) || 1,
        estagioFalha: alternativa.estagio || ESTAGIOS_GALPERIN.MENTAL_INTERNO,
        metadata: alternativa.metadata || {}
    };
}

// ============================================================================
// 3. MOTOR DE PERFIS E INFERÊNCIA COGNITIVA (PROFILE ENGINE)
// ============================================================================

/**
 * Avalia o histórico longitudinal do estudante para detectar anomalias, pseudoconceitos ou fixações mecânicas.
 * @param {Object} historicoHabilidade - Sub-estado imutável da habilidade BNCC analizada.
 * @param {Array} logsRecentes - Lista de logs recentes obtidos via telemetria.
 * @returns {string} Código identificador do Perfil Cognitivo predominante na ZDP.
 */
export function inferirPerfilCognitivo(historicoHabilidade, logsRecentes) {
    if (!logsRecentes || logsRecentes.length < 3) return PERFIS_COGNITIVOS.DEPENDENTE_CONCRETO;

    const ultimosLogs = logsRecentes.slice(-5);
    const mediaLatencia = ultimosLogs.reduce((acc, log) => acc + (log.latencia || 0), 0) / ultimosLogs.length;
    
    // Aluno responde rápido demais e acumula erros de inversão estrutural algebra/aritmética
    if (mediaLatencia < 3500 && historicoHabilidade.erros_calculo + historicoHabilidade.erros_conceito > 2) {
        return PERFIS_COGNITIVOS.IMPULSIVO_ARITMETICO;
    }

    // Heurística de Pseudoconceito: Sucesso total no procedural formal, mas colapso nas fases de transferência gráfica/contextual
    const falhasConceituaisGraficas = ultimosLogs.filter(log => 
        log.categoria === 'conceito' && log.estagio === ESTAGIOS_GALPERIN.ICONICO_VISUAL
    ).length;

    const acertosProceduraisPuros = ultimosLogs.filter(log => 
        log.correto && log.estagio === ESTAGIOS_GALPERIN.MENTAL_INTERNO
    ).length;

    if (acertosProceduraisPuros >= 2 && falhasConceituaisGraficas >= 2) {
        return PERFIS_COGNITIVOS.PROCEDURAL_MECANICO;
    }

    // Se o estudante só performa positivamente quando há renderização materializada/enativa
    if (historicoHabilidade.erros_conceito > 0 && 
        ultimosLogs.every(log => !log.correto && log.estagio === ESTAGIOS_GALPERIN.MENTAL_INTERNO)) {
        return PERFIS_COGNITIVOS.DEPENDENTE_CONCRETO;
    }

    return PERFIS_COGNITIVOS.CONCEITUAL_TEORICO;
}

// ============================================================================
// 4. SELETOR ADAPTATIVO DE ANDAIME E MEDIAÇÃO (ADAPTIVE SCAFFOLD ENGINE)
// ============================================================================

/**
 * Determina a próxima ação mediadora da ADA baseada no perfil inferido e no estágio de Galperin.
 * @param {string} perfil - Perfil cognitivo inferido do estudante.
 * @param {Object} analise - Laudo da última alternativa processada.
 * @returns {Object} Configuração estruturada da ação da ADA (Scaffold Adaptativo).
 */
export function calcularScaffoldADA(perfil, analise) {
    const diretrizes = {
        [PERFIS_COGNITIVOS.IMPULSIVO_ARITMETICO]: {
            acao: "TRAVA_RITMICA_REFLEXIVA",
            representacao: ESTAGIOS_GALPERIN.VERBAL_LOGICO_EXTERNO,
            reduzirCargaCognitiva: true,
            mensagemADA: "ADA interceptou movimento impulsivo. Forçando verbalização orientada (Talízina) antes do input."
        },
        [PERFIS_COGNITIVOS.PROCEDURAL_MECANICO]: {
            acao: "CONFLITO_COGNITIVO_DIALETICO",
            representacao: ESTAGIOS_GALPERIN.ICONICO_VISUAL,
            reduzirCargaCognitiva: false,
            mensagemADA: "Pseudoconceito isolado detectado. Injetando contraposição gráfica simultânea para quebrar o modelo aditivo estático."
        },
        [PERFIS_COGNITIVOS.DEPENDENTE_CONCRETO]: {
            acao: "ESBATIMENTO_PROGRESSIVO_FADING",
            representacao: ESTAGIOS_GALPERIN.VERBAL_LOGICO_EXTERNO,
            reduzirCargaCognitiva: true,
            mensagemADA: "Retirando suporte materializado com segurança. Movendo a mediação em direção à linguagem interna pura."
        },
        [PERFIS_COGNITIVOS.CONCEITUAL_TEORICO]: {
            acao: "PROGRESSION_MASTERY",
            representacao: ESTAGIOS_GALPERIN.MENTAL_INTERNO,
            reduzirCargaCognitiva: false,
            mensagemADA: "Estabilidade conceitual validada na ZDP. Expandindo limites do pensamento conceitual teórico."
        }
    };

    return diretrizes[perfil] || { acao: "SUPORTE_PADRAO", representacao: ESTAGIOS_GALPERIN.ICONICO_VISUAL, reduzirCargaCognitiva: false };
}

// ============================================================================
// 5. CAMADA DE GOVERNANÇA E IMUTABILIDADE DE ESTADO (GOVERNANCE LAYER)
// ============================================================================

/**
 * Cria uma cópia profunda defensiva do estado para evitar mutações e efeitos colaterais.
 * @param {Object} obj - Estado original.
 * @returns {Object} Estado clonado de forma limpa.
 */
function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

/**
 * Registra as ocorrências de erro e muta o estado de forma determinista através de retorno puro.
 * @param {Object} estadoAtual - Estado global atualizado do ecossistema.
 * @param {Object} analise - Resultado do processamento da alternativa.
 * @param {Object} questao - Objeto contendo os metadados da questão-sensor ativa.
 * @param {number} latencia - Tempo decorrido de processamento da resposta em milisegundos.
 * @returns {Object} Novo estado consolidado, puramente imutável.
 */
export function registrarInteracao(estadoAtual, analise, questao, latencia) {
    // Validação profunda de barreira sanitária contra Crashes
    const G = deepClone(estadoAtual || {});
    if (!G.historico) G.historico = {};
    if (!G.diagnostico) G.diagnostico = {};
    if (!G.diagnostico.logs) G.diagnostico.logs = [];
    if (!G.diagnostico.scores) G.diagnostico.scores = {};

    const hab = (questao && questao.bncc) ? questao.bncc : "Geral";

    if (!G.historico[hab]) {
        G.historico[hab] = { 
            acertos: 0, 
            erros_conceito: 0, 
            erros_calculo: 0, 
            desc: "Rastreamento de Habilidade BNCC" 
        };
    }

    // Atualização de métricas com base no laudo do sensor cognitivo
    if (analise.correto) {
        G.historico[hab].acertos++;
    } else {
        if (analise.categoria === 'conceito') {
            G.historico[hab].erros_conceito++;
        } else {
            G.historico[hab].erros_calculo++;
        }
    }

    const logEntrada = {
        bncc: hab,
        erro: analise.erroId || null,
        categoria: analise.categoria || (analise.correto ? 'sucesso' : 'calculo'),
        estagio: analise.correto ? analise.estagioAlcancado : analise.estagioFalha,
        latencia: Number(latencia) || 0,
        correto: analise.correto,
        timestamp: Date.now()
    };
    
    G.diagnostico.logs.push(logEntrada);

    // Mapeamento dinâmico nos clusters acumuladores de carga conceitual
    if (!analise.correto && analise.erroId) {
        for (const [cluster, listaErros] of Object.entries(CLUSTERS)) {
            if (listaErros.includes(analise.erroId)) {
                G.diagnostico.scores[cluster] = (G.diagnostico.scores[cluster] || 0) + (analise.peso || 1);
            }
        }
    }

    // Dispara inferência em tempo de execução para reorientação da ADA
    const perfilInferido = inferirPerfilCognitivo(G.historico[hab], G.diagnostico.logs);
    const scaffoldCalculado = calcularScaffoldADA(perfilInferido, analise);

    // Consolida o estado adaptativo da ADA no payload de retorno
    G.adaState = {
        perfilCognitivoAtual: perfilInferido,
        scaffold: scaffoldCalculado,
        ultimaAtualizacao: Date.now(),
        comandoInterface: scaffoldCalculado.acao
    };

    return G;
}
