/**
 * @fileoverview AdaptiveSelector.js v4.0.0 — "LabTech Cognitive Orchestrator"
 * @description Motor de Seleção Adaptativa, Distribuição Estocástica-Determinista de Scaffold
 * e Alternância Semiótica Baseada na Teoria Histórico-Cultural e DUA.
 * Garantia de imutabilidade estrita e isolamento arquitetural contra efeitos colaterais.
 * 
 * @version 4.0.0
 * @package LabTech / ADA Intelligent Tutoring System
 */

import { CLUSTERS, ESTAGIOS_GALPERIN, PERFIS_COGNITIVOS } from './diagnostic-engine.js';

/**
 * Interface de Configuração de Saída do Seletor Adaptativo (Contrato de Design)
 * @typedef {Object} TaskPayload
 * @property {string} taskId - ID único da questão/sensor selecionado.
 * @property {string} bnccTarget - Habilidade da BNCC sendo avaliada e mediada.
 * @property {string} estagioGalperin - Estágio de interiorização da ação mental imposto.
 * @property {Object} interfaceModifiers - Modificadores de UI para adequação ao perfil cognitivo.
 * @property {Object} duaAccessibility - Configurações ativas de acessibilidade e representação múltipla.
 * @property {Object} scaffoldMetadata - Parâmetros internos do nível de ajuda fornecido pela ADA.
 */

/**
 * Orquestrador Adaptativo Core da ADA. Seleciona a próxima atividade e customiza
 * sua camada semiótica e de scaffold com base na biopsia cognitiva do estudante.
 * 
 * @param {Object} estadoConsolidado - Estado imutável retornado pela Governance Layer.
 * @param {Array<Object>} poolDeTarefas - Catálogo global de sensores/questões disponíveis no sistema.
 * @param {Object} restricoesAcessibilidade - Preferências ou necessidades físicas declaradas pelo usuário.
 * @returns {TaskPayload} Configuração atômica customizada para renderização imediata na UI.
 */
export function selecionarProximaTarefa(estadoConsolidado, poolDeTarefas, restricoesAcessibilidade = {}) {
    // 1. Defesas Sanitárias Absolutas contra Estados Corrompidos ou Vazios
    const S = estadoConsolidado || {};
    const adaState = S.adaState || { perfilCognitivoAtual: PERFIS_COGNITIVOS.DEPENDENTE_CONCRETO, scaffold: { representacao: ESTAGIOS_GALPERIN.ICONICO_VISUAL } };
    const logs = (S.diagnostico && S.diagnostico.logs) ? S.diagnostico.logs : [];
    
    if (!poolDeTarefas || poolDeTarefas.length === 0) {
        throw new Error("Erro Crítico de Arquitetura: Pool de tarefas vazio ou corrompido no LabTech Core.");
    }

    // 2. Identificar a Habilidade BNCC Ativa sob Intervenção na ZDP
    const ultimoLog = logs.length > 0 ? logs[logs.length - 1] : null;
    const bnccAlvo = ultimoLog ? ultimoLog.bncc : Object.keys(S.historico || {})[0] || "EM13MAT302";

    // 3. Filtragem de Tarefas Viáveis para a Habilidade Requisitada
    const tarefasFiltradas = poolDeTarefas.filter(tarefa => tarefa.bncc === bnccAlvo);
    const tarefasValidas = tarefasFiltradas.length > 0 ? tarefasFiltradas : poolDeTarefas;

    // 4. Determinação do Nível de Complexidade Estrutural Baseado em Mastery Learning
    const historicoHabilidade = S.historico && S.historico[bnccAlvo] ? S.historico[bnccAlvo] : { acertos: 0, erros_conceito: 0, erros_calculo: 0 };
    const totalInteracoes = historicoHabilidade.acertos + historicoHabilidade.erros_conceito + historicoHabilidade.erros_calculo;
    const taxaAcertoLongitudinal = totalInteracoes > 0 ? (historicoHabilidade.acertos / totalInteracoes) : 0;

    let complexidadeAlvo = 1;
    if (taxaAcertoLongitudinal > 0.80) complexidadeAlvo = 3;
    else if (taxaAcertoLongitudinal > 0.50) complexidadeAlvo = 2;

    // 5. Aplicação das Diretrizes de Transposição Semiótica da ADA baseadas no Perfil Cognitivo
    const perfil = adaState.perfilCognitivoAtual;
    const estagioExigido = adaState.scaffold.representacao;

    // Localizar a tarefa que melhor se ajusta ao cruzamento de Complexidade e Estágio Pedagógico
    let tarefaSelecionada = tarefasValidas.find(t => 
        t.complexidade === complexidadeAlvo && t.estagioPredominante === estagioExigido
    );

    // Fallback estratégico caso o cruzamento exato crie um conjunto vazio no catálogo
    if (!tarefaSelecionada) {
        tarefaSelecionada = tarefasValidas.find(t => t.complexidade === complexidadeAlvo) || tarefasValidas[0];
    }

    // 6. Construção Dinâmica dos Modificadores de Interface (UX/UI Pedagógica Interveniente)
    const interfaceModifiers = {
        exibirRastroParticulas: perfil !== PERFIS_COGNITIVOS.PROCEDURAL_MECANICO,
        travaReflexaoObrigatoria: perfil === PERFIS_COGNITIVOS.IMPULSIVO_ARITMETICO,
        tempoMinimoExigidoMs: perfil === PERFIS_COGNITIVOS.IMPULSIVO_ARITMETICO ? 4000 : 0,
        camposEntradaSimbolicaBloqueados: perfil === PERFIS_COGNITIVOS.PROCEDURAL_MECANICO,
        exibirEixoSimetriaInvisivel: perfil === PERFIS_COGNITIVOS.DEPENDENTE_CONCRETO || taxaAcertoLongitudinal < 0.40,
        modoFadingAtivo: perfil === PERFIS_COGNITIVOS.DEPENDENTE_CONCRETO && totalInteracoes > 4
    };

    // 7. Orquestração de Múltiplas Camadas do DUA (Desenho Universal para Aprendizagem)
    const duaAccessibility = {
        sonificationActive: !!restricoesAcessibilidade.visualImpairment || perfil === PERFIS_COGNITIVOS.DEPENDENTE_CONCRETO,
        audioFrequenciaFoco: "TAXA_DE_VARIACAO_QUADRATICA",
        altoContrasteGeometrico: !!restricoesAcessibilidade.altoContraste,
        inputAlternativoVoz: !!restricoesAcessibilidade.motorImpairment,
        legendaNarrativaExplicativa: true,
        leituraMatrizPontosTabular: perfil === PERFIS_COGNITIVOS.IMPULSIVO_ARITMETICO
    };

    // 8. Customização de Metadados de Scaffold da ADA (Andaimes Histórico-Culturais)
    const scaffoldMetadata = {
        tipoIntervencaoADA: adaState.scaffold.acao,
        mensagemSuporteNarrativo: obterMensagemADAContextual(perfil, tarefaSelecionada.contextoNarrativo),
        reducaoCargaCognitivaAtiva: adaState.scaffold.reduzirCargaCognitiva,
        ZDP_Status: taxaAcertoLongitudinal >= 0.95 ? "MASTERY_CONSOLIDATED" : "IN_TRANSITION"
    };

    // 9. Retorno do Payload Imutável com Isolamento Total de Referência
    return Object.freeze({
        taskId: tarefaSelecionada.id,
        bnccTarget: bnccAlvo,
        estagioGalperin: estagioExigido,
        interfaceModifiers: Object.freeze(interfaceModifiers),
        duaAccessibility: Object.freeze(duaAccessibility),
        scaffoldMetadata: Object.freeze(scaffoldMetadata)
    });
}

/**
 * Função Auxiliar Interna Pura para geração de micro-narrativas de suporte psicológico da ADA.
 * Rejeita acoplamentos sintáticos duros e strings estáticas globais.
 * 
 * @param {string} perfil - Perfil cognitivo inferido do estudante.
 * @param {string} contextoQuestao - Fragmento da narrativa ativa da tarefa.
 * @returns {string} Mensagem instrucional personalizada para mediação.
 */
function obterMensagemADAContextual(perfil, contextoQuestao) {
    const dicionarioMensagens = {
        [PERFIS_COGNITIVOS.IMPULSIVO_ARITMETICO]: 
            "ADA detectou velocidade crítica de resposta. Respire. Antes de alterar os motores, descreva textualmente o impacto esperado no ponto máximo de curvatura.",
        [PERFIS_COGNITIVOS.PROCEDURAL_MECANICO]: 
            "Esqueça as fórmulas por um instante. Observe o movimento real do fluido. Onde o sistema atinge o ponto de equilíbrio geométrico antes de começar a cair?",
        [PERFIS_COGNITIVOS.DEPENDENTE_CONCRETO]: 
            "Os guias visuais de partículas estão diminuindo de intensidade. Confie na lei matemática que você modelou nas rodadas anteriores.",
        [PERFIS_COGNITIVOS.CONCEITUAL_TEORICO]: 
            "Estabilidade de órbita validada. Expandindo os limites paramétricos do reator para transposição de modelos complexos de gravidade não-uniforme."
    };

    return dicionarioMensagens[perfil] || `ADA monitorando a atividade em andamento no contexto: ${contextoQuestao || "Geral"}.`;
}
