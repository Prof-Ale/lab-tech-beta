/**
 * LABTECH ADAPTIVE ECOSYSTEM & GOVERNANCE LAYER
 * Arquitetura unificada de microserviços para processamento cognitivo baseado na Teoria Histórico-Cultural.
 */

// ==========================================
// 1. GOVERNANCE LAYER (Question Normalizer)
// ==========================================
class QuestionNormalizer {
    constructor() {}

    /**
     * Valida, tipa e higieniza a estrutura de um Sensor Cognitivo bruto vindo de bases antigas.
     * @param {Object} rawQuestion 
     * @returns {Object} JSON normalizado pronto para ingestão e processamento analítico.
     */
    normalize(rawQuestion) {
        const requiredFields = ['id', 'bncc', 'misconception_principal', 'alternativas', 'scaffolds_adaptativos'];
        
        requiredFields.forEach(field => {
            if (!rawQuestion[field]) {
                throw new Error(`[Governance Error] Campo crítico ausente no Sensor Cognitivo: ${field}`);
            }
        });

        const hasCorrect = rawQuestion.alternativas.some(alt => alt.tipo === 'acerto');
        if (!hasCorrect) {
            throw new Error(`[Governance Error] O Sensor ${rawQuestion.id} não possui uma alternativa de 'acerto'.`);
        }

        return {
            id: String(rawQuestion.id),
            bncc: String(rawQuestion.bncc),
            misconception_principal: String(rawQuestion.misconception_principal),
            display: {
                text: rawQuestion.display?.text || "Questão sem enunciado textual.",
                accessibility_alt: rawQuestion.display?.accessibility_alt || "Sensor cognitivo matemático visual acessível."
            },
            alternativas: rawQuestion.alternativas.map(alt => ({
                id_alternativa: String(alt.id_alternativa || Math.random().toString(36).substr(2, 5)),
                valor: String(alt.valor),
                tipo: alt.tipo, // 'acerto' ou 'erro'
                categoria: alt.categoria || 'erro_generico', // 'estrategia_aditiva', 'pseudoconceito', etc.
                diagnostico_cognitivo: alt.diagnostico_cognitivo || 'Sem diagnóstico mapeado.',
                peso_gravidade: Number(alt.peso_gravidade || 0)
            })),
            scaffolds_adaptativos: {
                VISUAL_SCHEMATIC: rawQuestion.scaffolds_adaptativos.VISUAL_SCHEMATIC || null,
                VERBALIZATION: rawQuestion.scaffolds_adaptativos.VERBALIZATION || null,
                ABSTRACT_SYMBOLIC: rawQuestion.scaffolds_adaptativos.ABSTRACT_SYMBOLIC || null
            },
            normalizedAt: new Date().toISOString()
        };
    }
}

// ==========================================
// 2. DIAGNOSTIC ENGINE
// ==========================================
class DiagnosticEngine {
    constructor() {}

    /**
     * Analisa a resposta em tempo real cruzando dados cronométricos e semióticos.
     * @param {Object} normalizedQuestion 
     * @param {String} selectedAltId 
     * @param {Number} timeSpentMs 
     * @returns {Object} Diagnóstico de inferência cognitiva processado.
     */
    evaluateResponse(normalizedQuestion, selectedAltId, timeSpentMs) {
        const alternativa = normalizedQuestion.alternativas.find(alt => alt.id_alternativa === selectedAltId);
        
        if (!alternativa) {
            throw new Error(`[Diagnostic Error] Alternativa selecionada inválida ou inexistente: ${selectedAltId}`);
        }

        const isImpulsive = timeSpentMs < 1800; // Inferência baseada em tempo de latência crítico
        let estadoCognitivoInferido = 'PENSAMENTO_TEORICO_ESTÁVEL';

        if (alternativa.tipo === 'erro') {
            if (alternativa.categoria === 'pseudoconceito') {
                estadoCognitivoInferido = 'PSEUDOCONCEITO_DETECTADO';
            } else if (alternativa.categoria === 'estrategia_aditiva') {
                estadoCognitivoInferido = 'MISCONCEPTION_ESTRUTURAL_ADITIVA';
            } else {
                estadoCognitivoInferido = 'DOMINIO_PROCEDURAL_INSTÁVEL';
            }
        }

        return {
            sensor_id: normalizedQuestion.id,
            bncc: normalizedQuestion.bncc,
            outcome: alternativa.tipo,
            categoria_erro: alternativa.categoria,
            diagnostico: alternativa.diagnostico_cognitivo,
            gravidade: alternativa.peso_gravidade,
            telemetria: {
                tempo_resposta_ms: timeSpentMs,
                sinal_impulsividade: isImpulsive,
                carga_cognitiva_estimada: isImpulsive ? 'ALTA_COMPORTAMENTAL' : 'ADAPTATIVA'
            },
            inferencia: {
                estado_cognitivo: estadoCognitivoInferido,
                estagio_galperin_sugerido: alternativa.tipo === 'acerto' ? 'MENTAL_PURO' : 'NECESSITA_MATERIALIZADO'
            }
        };
    }
}

// ==========================================
// 3. PROFILE ENGINE (Longitudinal Tracking)
// ==========================================
class ProfileEngine {
    constructor() {}

    /**
     * Atualiza o prontuário cognitivo do aluno com base na nova evidência gerada.
     * @param {Object} currentProfile 
     * @param {Object} diagnosticResult 
     * @returns {Object} Perfil histórico-cultural atualizado do estudante.
     */
    updateProfile(currentProfile, diagnosticResult) {
        const updated = { ...currentProfile };
        
        // Inicialização de segurança caso seja um perfil novo
        updated.historico_estados = updated.historico_estados || [];
        updated.misconceptions_persistentes = updated.misconceptions_persistentes || {};
        
        // Ingestão do novo estado na linha temporal
        updated.historico_estados.push({
            timestamp: new Date().toISOString(),
            estado: diagnosticResult.inferencia.estado_cognitivo,
            outcome: diagnosticResult.outcome
        });

        // Atualização do vetor longitudinal de erros estruturais
        if (diagnosticResult.outcome === 'erro') {
            const cat = diagnosticResult.categoria_erro;
            updated.misconceptions_persistentes[cat] = (updated.misconceptions_persistentes[cat] || 0) + 1;
        }

        // Determinação do nível atual da ZDP com base na persistência de erros
        if (updated.misconceptions_persistentes['estrategia_aditiva'] >= 2) {
            updated.zdp_status = 'NECESSITA_CONFLITO_GEOMETRICO';
            updated.estagio_atual_aprendizagem = 'CONCRETO_MATERIALIZADO';
        } else if (updated.misconceptions_persistentes['pseudoconceito'] >= 2) {
            updated.zdp_status = 'NECESSITA_VERBALIZACAO_LÓGICA';
            updated.estagio_atual_aprendizagem = 'VERBAL_EXTERNO';
        } else {
            updated.zdp_status = 'AUTONOMIA_CONCEITUAL';
            updated.estagio_atual_aprendizagem = 'MENTAL_INTERNALIZADO';
        }

        return updated;
    }
}

// ==========================================
// 4. SELECTOR ADAPTATIVO & PEDAGOGICAL MOTOR
// ==========================================
class AdaptiveSelector {
    constructor() {}

    /**
     * Determina a mediação exata e o scaffold ideal que a ADA deve injetar na interface.
     * @param {Object} studentProfile 
     * @param {Object} questionBank 
     * @returns {Object} Payload de intervenção semiótica direcionada para a ZDP.
     */
    determineNextStep(studentProfile, currentQuestion) {
        const status = studentProfile.zdp_status;
        
        let scaffoldSelecionado = null;
        let tipoMediaçãoADA = "";
        let acaoInterface = "AVANÇAR_FLUXO";

        if (status === 'NECESSITA_CONFLITO_GEOMETRICO') {
            scaffoldSelecionado = currentQuestion.scaffolds_adaptativos.VISUAL_SCHEMATIC;
            tipoMediaçãoADA = "Injeção de anomalia espacial para quebra de modelo aditivo.";
            acaoInterface = "EXIBIR_SCAFFOLD_INTERATIVO";
        } else if (status === 'NECESSITA_VERBALIZACAO_LÓGICA') {
            scaffoldSelecionado = currentQuestion.scaffolds_adaptativos.VERBALIZATION;
            tipoMediaçãoADA = "Exigência de ancoragem verbal e estruturação de argumentos conceituais.";
            acaoInterface = "ATIVAR_PROCESSO_VERBAL";
        } else {
            scaffoldSelecionado = currentQuestion.scaffolds_adaptativos.ABSTRACT_SYMBOLIC;
            tipoMediaçãoADA = "Manutenção do desafio em nível abstrato puro de alta complexidade.";
            acaoInterface = "PROMOVER_DESAFIO_SIMBÓLICO";
        }

        return {
            student_id: studentProfile.id,
            pipeline_action: acaoInterface,
            ada_mediation_narrative: tipoMediaçãoADA,
            scaffold_payload: scaffoldSelecionado,
            target_framework: {
                vysgotsky_layer: "ZDP_ACTIVE_INTERVENTION",
                galperin_stage: studentProfile.estagio_atual_aprendizagem
            }
        };
    }
}

// ==========================================
// 5. LEARNING ANALYTICS (Telemetry Pipeline)
// ==========================================
class LearningAnalytics {
    constructor() {}

    /**
     * Consolida os logs brutos de telemetria em KPIS estratégicos para o Dashboard docente.
     * @param {Object} diagnosticResult 
     * @param {Object} updatedProfile 
     * @returns {Object} Relatório analítico de alta explicabilidade.
     */
    generateMetrics(diagnosticResult, updatedProfile) {
        return {
            analytics_timestamp: new Date().toISOString(),
            metrics: {
                velocidade_processamento: `${(diagnosticResult.telemetria.tempo_resposta_ms / 1000).toFixed(2)}s`,
                alerta_impulsividade: diagnosticResult.telemetria.sinal_impulsividade,
                gravidade_erro_atual: diagnosticResult.gravidade
            },
            diagnostico_explicavel: {
                descricao_estado: diagnosticResult.diagnostico,
                diagnostico_v細gotskiano: `Estudante operando no estágio: ${updatedProfile.estagio_atual_aprendizagem}.`
            }
        };
    }
}

// ==========================================
// SIMULAÇÃO COMPLETA DE EXECUÇÃO DO MOTOR
// ==========================================

// 1. JSON antigo bruto recuperado da base legada (Sensor de Frações Equivalentes)
const rawJsonQuestionLegacy = {
    id: "SENS_MAT_06_FRA",
    bncc: "EF06MA07",
    misconception_principal: "ESTRATEGIA_ADITIVA_INCREMENTAL",
    display: {
        text: "O reator arcano precisa de calibração. A barra atual está energizada em 2/3. Se expandirmos a malha do reator para 6 partes, quantas partes devem ser ligadas para manter o fluxo idêntico?",
        accessibility_alt: "Uma barra retangular dividida em 3 partes com 2 pintadas de azul, comparada a uma barra do mesmo tamanho físico dividida em 6 partes vazias."
    },
    alternativas: [
        { id_alternativa: "alt_a", valor: "3", tipo: "erro", categoria: "estrategia_aditiva", diagnostico_cognitivo: "O estudante aplicou a propriedade aditiva (+1 no numerador e denominador), demonstrando misconception estrutural.", peso_gravidade: 3 },
        { id_alternativa: "alt_b", valor: "4", tipo: "acerto", categoria: "sucesso_teorico", diagnostico_cognitivo: "O estudante domina a invariância multiplicativa da fração.", peso_gravidade: 0 },
        { id_alternativa: "alt_c", valor: "6", tipo: "erro", categoria: "pseudoconceito", diagnostico_cognitivo: "O estudante copiou o valor do denominador novo, demonstrando automatização cega ou confusão perceptual.", peso_gravidade: 2 }
    ],
    scaffolds_adaptativos: {
        VISUAL_SCHEMATIC: { instrucao: "ADA exibe um simulador dinâmico dividindo a barra em tempo real para expor a distorção da propriedade aditiva." },
        VERBALIZATION: { instrucao: "ADA solicita que o aluno selecione a frase que valida a proporcionalidade lógica." },
        ABSTRACT_SYMBOLIC: null
    }
};

// 2. Instanciação de toda a suíte de motores da plataforma
const normalizer = new QuestionNormalizer();
const diagnosticEngine = new DiagnosticEngine();
const profileEngine = new ProfileEngine();
const adaptiveSelector = new AdaptiveSelector();
const analytics = new LearningAnalytics();

// 3. Execução do pipeline de processamento em tempo real
try {
    console.log("--- INICIANDO PROCESSAMENTO LABTECH ---\n");

    // Passo A: Normalização estrutural da questão legada
    const cleanQuestion = normalizer.normalize(rawJsonQuestionLegacy);
    console.log("[1. GOVERNANCE] Questão higienizada e normalizada com sucesso.");

    // Perfil inicial do aluno extraído do banco de dados
    let alunoPerfil = { id: "ALUNO_ALESSANDRO_01", zdp_status: "A_AVALIAR", estagio_atual_aprendizagem: "INICIAL", misconceptions_persistentes: {} };

    // Cenário: O aluno clica na Alternativa A ('alt_a') em apenas 1.2 segundos (Ação Impulsiva Aditiva)
    const idAlternativaEscolhida = "alt_a";
    const tempoDeResposta = 1200; // 1.2 segundos

    // Passo B: Diagnóstico de inferência cognitiva imediata
    const resultadoDiagnostico = diagnosticEngine.evaluateResponse(cleanQuestion, idAlternativaEscolhida, tempoDeResposta);
    console.log("[2. DIAGNOSTIC] Resposta avaliada. Estado inferido:", resultadoDiagnostico.inferencia.estado_cognitivo);

    // Passo C: Atualização do prontuário histórico do aluno
    alunoPerfil = profileEngine.updateProfile(alunoPerfil, resultadoDiagnostico);
    console.log("[3. PROFILE] Perfil atualizado. Novo status da ZDP:", alunoPerfil.zdp_status);

    // Simulando uma segunda falha consecutiva do mesmo tipo para disparar o gatilho crítico da ADA
    alunoPerfil = profileEngine.updateProfile(alunoPerfil, resultadoDiagnostico); 

    // Passo D: Seleção adaptativa da próxima ação da ADA na ZDP
    const comandoAdaptativoada = adaptiveSelector.determineNextStep(alunoPerfil, cleanQuestion);
    console.log("[4. ADAPTIVE SELECTOR] Decisão da ADA tomada. Ação de Interface:", comandoAdaptativoada.pipeline_action);
    console.log(">> Mensagem da ADA ao Motor Gráfico:", comandoAdaptativoada.ada_mediation_narrative);

    // Passo E: Geração de pacotes de dados para o Dashboard de Analytics do Professor
    const kpisProfessor = analytics.generateMetrics(resultadoDiagnostico, alunoPerfil);
    console.log("\n--- [5. LEARNING ANALYTICS - PAYLOAD DISPONÍVEL PARA DASHBOARD] ---");
    console.log(JSON.stringify(kpisProfessor, null, 2));

} catch (error) {
    console.error("Erro crítico disparado na esteira adaptativa:", error.message);
}
