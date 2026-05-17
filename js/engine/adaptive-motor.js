/**
 * LABTECH ADAPTIVE ENGINE - MOTOR CORRESPONDENTE À INTERVENÇÃO EM RUNTIME DA ADA
 * Processa telemetria ativa e orquestra a transição de estágios cognitivos de Galperin e ZDP.
 */

// --- PROFILE ENGINE ---
class ProfileEngine {
    constructor(studentId) {
        this.studentId = studentId;
        this.state = {
            currentGalperinStage: 'ABSTRACT_SYMBOLIC', // Inicia no topo, regride se necessário
            operationalBiasScore: 0.0,
            activeMisconceptions: new Set(),
            performanceLogs: []
        };
    }

    mutateProfile(inference) {
        this.state.currentGalperinStage = inference.recommendedStage;
        this.state.operationalBiasScore = (this.state.operationalBiasScore + inference.biasDelta) / 2;
        if (inference.detectedMisconception) {
            this.state.activeMisconceptions.add(inference.detectedMisconception);
        }
        this.state.performanceLogs.push({
            timestamp: Date.now(),
            wasCorrect: inference.isCorrect
        });
    }

    getSnapshot() { return this.state; }
}

// --- DIAGNÓSTICO ENGINE ---
class DiagnosticEngine {
    static analyze(telemetry, normalizedQuestion) {
        const { selectedValue, latencyMs } = telemetry;
        const matchedAlt = normalizedQuestion.alternativas.find(alt => alt.valor === selectedValue);

        let inference = {
            isCorrect: matchedAlt.tipo === 'acerto',
            biasDelta: 0,
            detectedMisconception: null,
            recommendedStage: 'ABSTRACT_SYMBOLIC',
            logDescription: matchedAlt.diagnostico_cognitivo
        };

        if (!inference.isCorrect) {
            inference.detectedMisconception = normalizedQuestion.misconception_principal;
            
            // Mapeamento de transições de estágio com base na natureza do erro
            switch (matchedAlt.categoria) {
                case 'viess_operacional_aditivo':
                    inference.biasDelta = 0.8;
                    inference.recommendedStage = 'VISUAL_SCHEMATIC'; // Regressão para suporte visual da balança
                    break;
                case 'erro_transito_sinal':
                    inference.biasDelta = 0.4;
                    inference.recommendedStage = 'VERBALIZATION'; // Prompt de autoexplicação linguística
                    break;
                default:
                    inference.recommendedStage = 'VISUAL_SCHEMATIC';
            }
        }
        return inference;
    }
}

// --- ADAPTIVE SELECTOR ---
class AdaptiveSelector {
    static orchestrate(inference, normalizedQuestion, currentProfile) {
        if (inference.isCorrect) {
            return {
                action: 'ADVANCE_CURRICULUM',
                payload: { targetCluster: 'algebra_avancada', removeScaffolds: true }
            };
        }

        // Entrega o scaffold correspondente ao estágio de Galperin determinado pelo diagnóstico
        const targetStage = inference.recommendedStage;
        const activeScaffold = normalizedQuestion.scaffolds_adaptativos[targetStage];

        return {
            action: 'TRIGGER_ADA_MEDIATION',
            stageTarget: targetStage,
            scaffold: activeScaffold,
            reasoning: inference.logDescription
        };
    }
}

// --- ENGINE CONTROLLER (FACADE PRINCIPAL DO MOTOR ADAPTATIVO) ---
class AdaptiveMotor {
    constructor(studentId) {
        this.profile = new ProfileEngine(studentId);
    }

    /**
     * Ingestão em tempo real de ações do usuário confrontadas com o Sensor Cognitivo Normalizado
     */
    evaluateTelemetry(telemetryData, normalizedQuestion) {
        console.log(`[ADA Motor] Processando telemetria para: ${this.profile.studentId}`);

        // 1. Executa Diagnóstico Baseado em Evidências
        const cognitiveInference = DiagnosticEngine.analyze(telemetryData, normalizedQuestion);

        // 2. Atualiza Perfil Longitudinal do Usuário
        this.profile.mutateProfile(cognitiveInference);

        // 3. Seleciona Intervenção na ZDP do Aluno
        const adaDecision = AdaptiveSelector.orchestrate(
            cognitiveInference, 
            normalizedQuestion, 
            this.profile.getSnapshot()
        );

        // 4. Retorna a ação de UI mapeada e explicável
        return {
            telemetrySummary: telemetryData,
            inferenceEngine: cognitiveInference,
            adaAction: adaDecision
        };
    }
}
