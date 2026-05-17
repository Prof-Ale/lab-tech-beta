/**
 * @fileoverview GovernanceLayer.js
 * @description Camada de governança pedagógica, validação de contratos e blindagem estrutural da ADA.
 * Garante a integridade absoluta dos Sensores Cognitivos (questões/itens) que entram no ecossistema adaptativo.
 * Atende com rigor técnico o público do 6º Ano do Ensino Fundamental até a 1ª Série do Ensino Médio.
 * Baseado estritamente nos princípios histórico-culturais e de taxonomia cognitiva explicável.
 * 
 * @version 3.4.2
 * @package LabTech Core Environment
 */

export const GovernanceLayer = (() => {

    /**
     * Esquema mestre de validação estrutural de intervalos curriculares da BNCC
     * Cobre do 6º Ano do Ensino Fundamental (EF06) até a 1ª Série do Ensino Médio (EM13)
     */
    const CODE_REGEXP_BNCC = /^(EF0[6-9]MA\d{2}|EM13MAT\d{3})$/;

    /**
     * Estágios de Desenvolvimento das Ações Mentais definidos por Galperin
     */
    const VALIDOS_ESTAGIOS_GALPERIN = [
        'MATERIALIZADA',  // Manipulação concreta ou simulação física enativa
        'ICONICA',        // Esquemas visuais, gráficos, vetores e diagramas
        'VERBAL_EXTERNA', // Descrição narrativa, argumentação textual e semiótica
        'INTERNA_PURA'    // Abstração algorítmica sintática puramente matemática
    ];

    /**
     * Perfis etiológicos válidos para classificação dos distratores (erros)
     * Impede que uma alternativa de resposta seja cadastrada sem valor analítico
     */
    const VALIDOS_PERFIS_ERRO = [
        'VIES_ARITMETICO',      // Aplicação de operações aleatórias nos números da tela
        'ETIQUETA_ESTATICA',    // Tratar a variável como mero objeto ou letra fixa
        'INVERSAO_TOPOLOGICA',  // Erro de orientação espacial/sinal na reta ou plano
        'DOMINIO_PROCEDURAL',   // Erro estrito de execução mecânica do algoritmo
        'AUSENCIA_GENERALIZACAO',// Incapacidade de estender a regra a um novo contexto
        'IMPULSIVIDADE_CONCRETE',// Resposta aleatória disparada por saturação visual
        'CORRETO'               // Marcador de integridade para a alternativa válida
    ];

    /**
     * Níveis de Carga Cognitiva Intrínseca permitidos pelo motor adaptativo da ADA
     */
    const RANGE_CARGA_COGNITIVA = { MIN: 1, MAX: 10 };

    /**
     * Executa a auditoria completa e profunda de um Sensor Cognitivo (Item de Aprendizagem)
     * @param {Object} sensor - O objeto contendo a questão e os metadados pedagógicos.
     * @returns {Object} Resultado da auditoria { valido: boolean, erros: Array<string> }
     */
    const validarSensor = (sensor) => {
        const logsErros = [];

        // 1. Verificação Primária de Existência e Tipo
        if (!sensor || typeof sensor !== 'object') {
            return { valido: false, erros: ['Sensor Cognitivo nulo, indefinido ou em formato inválido.'] };
        }

        // 2. Validação da Identificação e Rastreabilidade
        if (!sensor.id || typeof sensor.id !== 'string') {
            logsErros.push(`[ID Erro]: Sensor ausente de identificador único textual estável.`);
        }

        if (!sensor.bloco || typeof sensor.bloco !== 'number' || sensor.bloco < 1 || sensor.bloco > 7) {
            logsErros.push(`[Bloco Erro]: ID ${sensor.id || 'Desconhecido'} associado a um bloco adaptativo inválido.`);
        }

        // 3. Validação do Alinhamento Normativo Curricular (BNCC)
        if (!sensor.habilidade || !CODE_REGEXP_BNCC.test(sensor.habilidade)) {
            logsErros.push(`[BNCC Contract Breach]: Código de habilidade [${sensor.habilidade}] inválido ou fora do espectro operacional do LabTech (6º EF ao 1º EM).`);
        }

        // 4. Auditoria Taxonômica de Abordagem Teórica (Galperin & Davýdov)
        if (!sensor.estagioGalperin || !VALIDOS_ESTAGIOS_GALPERIN.includes(sensor.estagioGalperin.toUpperCase())) {
            logsErros.push(`[Galperin Taxonomy Error]: Estágio '${sensor.estagioGalperin}' não catalogado nos planos de formação mental aceitos.`);
        }

        if (typeof sensor.cargaCognitiva !== 'number' || 
            sensor.cargaCognitiva < RANGE_CARGA_COGNITIVA.MIN || 
            sensor.cargaCognitiva > RANGE_CARGA_COGNITIVA.MAX) {
            logsErros.push(`[Carga Cognitiva Out of Bounds]: Valor '${sensor.cargaCognitiva}' viola os limites de calibração da ADA (${RANGE_CARGA_COGNITIVA.MIN} a ${RANGE_CARGA_COGNITIVA.MAX}).`);
        }

        // 5. Auditoria de Estrutura de Textos e Interfaces Pedagógicas (DUA)
        if (!sensor.enunciado || typeof sensor.enunciado !== 'string' || sensor.enunciado.trim().length < 10) {
            logsErros.push(`[DUA Core Error]: Enunciado textual ausente ou insuficiente para interpretação semiótica rica.`);
        }

        if (!sensor.representaçãoDominante || typeof sensor.representaçãoDominante !== 'string') {
            logsErros.push(`[UX/UI Pedagogical Alert]: Declaração de representação de interface dominante não especificada.`);
        }

        // 6. Auditoria Crítica da Matriz de Alternativas e Rastreamento Etiológico do Erro
        if (!Array.isArray(sensor.alternativas) || sensor.alternativas.length !== 4) {
            logsErros.push(`[Symmetry Breach]: O sensor adaptativo deve possuir rigorosamente 4 alternativas para estabilização estatística de distratores.`);
        } else {
            let possuiAlternativaCorreta = false;

            sensor.alternativas.forEach((alt, index) => {
                if (!alt.valor || typeof alt.valor !== 'string') {
                    logsErros.push(`[Alternativa Estrutura Erro]: Elemento de índice [${index}] sem valor de exibição textual definido.`);
                }

                if (!alt.etiologia || !VALIDOS_PERFIS_ERRO.includes(alt.etiologia.toUpperCase())) {
                    logsErros.push(`[Etiology Missing]: Alternativa [${alt.valor || index}] sem classificação de desvio cognitivo válida.`);
                }

                if (alt.etiologia.toUpperCase() === 'CORRETO') {
                    if (possuiAlternativaCorreta) {
                        logsErros.push(`[Symmetry Breach]: Multiplicidade de respostas corretas detectada. O sensor deve ser unívoco.`);
                    }
                    possuiAlternativaCorreta = true;

                    if (!sensor.resolucaoPassoAPasso || typeof sensor.resolucaoPassoAPasso !== 'string' || sensor.resolucaoPassoAPasso.trim().length < 5) {
                        logsErros.push(`[XAI Failure]: Scaffold explicativo de resolução (passo-a-passo) ausente ou inadequado para a alternativa correta.`);
                    }
                } else {
                    if (!alt.scaffoldFeedback || typeof alt.scaffoldFeedback !== 'string' || alt.scaffoldFeedback.trim().length < 5) {
                        logsErros.push(`[Mediation Failure]: Distrator [${alt.valor}] sem trilha de retroalimentação adaptativa específica para a ADA.`);
                    }
                }
            });

            if (!possuiAlternativaCorreta) {
                logsErros.push(`[Symmetry Breach]: O sensor pedagógico não possui nenhuma alternativa configurada como CORRETA.`);
            }
        }

        const isValid = logsErros.length === 0;
        
        if (!isValid) {
            console.error(`⚠️ [GOVERNANCE CRITICAL FAILURE] Inconsistências pedagógicas no Sensor ID: ${sensor.id || 'N/A'}`);
            console.table(logsErros);
        }

        return {
            valido: isValid,
            erros: logsErros,
            timestampAuditoria: new Date().toISOString()
        };
    };

    /**
     * Audita recursivamente um banco completo de sensores antes de liberar o deploy no motor adaptativo
     * @param {Array<Object>} bancoQuestões - Vetor contendo a totalidade dos itens cadastrados.
     * @returns {Object} Relatório de governança consolidado do ecossistema
     */
    const validarBancoCompleto = (bancoQuestões) => {
        if (!Array.isArray(bancoQuestões)) {
            throw new Error("[CRITICAL DATA CORRUPTION] O repositório de sensores cognitivos não é um array válido.");
        }

        const relatorioConsolidado = {
            totalSensoresAnalisados: bancoQuestões.length,
            sensoresAprovados: 0,
            sensoresRejeitados: 0,
            mapaFalhasPorBloco: {},
            bancoIntegro: false
        };

        bancoQuestões.forEach(sensor => {
            const resultado = validarSensor(sensor);
            if (resultado.valido) {
                relatorioConsolidado.sensoresAprovados++;
            } else {
                relatorioConsolidated.sensoresRejeitados++;
                relatorioConsolidado.mapaFalhasPorBloco[sensor.bloco] = (relatorioConsolidado.mapaFalhasPorBloco[sensor.bloco] || 0) + 1;
            }
        });

        relatorioConsolidado.bancoIntegro = relatorioConsolidado.sensoresRejeitados === 0;

        console.log("📊 [GOVERNANCE REPORT] Estado Geral da Integridade Pedagógica do Ecossistema:");
        console.dir(relatorioConsolidado);

        return relatorioConsolidado;
    };

    return {
        validarSensor,
        validarBancoCompleto,
        OBTER_ESTAGIOS_VALIDOS: () => [...VALIDOS_ESTAGIOS_GALPERIN],
        OBTER_PERFIS_ERRO_VALIDOS: () => [...VALIDOS_PERFIS_ERRO]
    };

})();
