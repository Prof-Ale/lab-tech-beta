/**
 * @fileoverview BaseOrientadoraAtiva.js
 * @description Mecanismo de Arbitragem Pedagógica e Otimização da ZDP (BOA v2.1.0).
 * AGORA COM: Justificativa clínica explicável, índice de resiliência pedagógica 
 * e ramificação por estágio conceitual (Evitando retrocesso cego de fase).
 * @package LabTech / Core ADA
 */

export class BaseOrientadoraAtiva {
    /**
     * Fábrica de instanciação para novos fluxos de aprendizagem.
     * Preserva o padrão estático e determinístico client-side.
     */
    static criarNova(conceitoAlvo = "INDEFINIDO", familiaAlvo = "INDEFINIDO") {
        return {
            versao: "BOA_v2.1.0_ADA_PROD",
            timestamp: new Date().toISOString(),
            focoCurricular: {
                conceitoAlvo: conceitoAlvo,
                familiaAlvo: familiaAlvo
            },
            estadoMediacao: {
                faseGalperinEfetiva: "MENTAL_ABSTRATA",
                representacaoAtiva: "SIMBOLICA",
                choqueSemioticoAtivo: false,
                saturacaoCognitivaTratada: 0
            },
            auditoriaZDP: {
                chancelaStatus: "AGUARDANDO_INTERACAO",
                confiancaAlocada: 1.0,
                motivoDaDecisao: "Aguardando primeira interação do estudante."
            }
        };
    }

    /**
     * Arbitra o plano bruto cruzando a clínica do erro com as vulnerabilidades do sujeito.
     * @param {Object} laudoDiagnostico - Retorno integral vindo do DiagnosticEngine.js v5.1.0
     * @param {Object} perfilEstudante - Estado longitudinal extraído do ProfileEngine.js
     * @returns {Object} Plano de Mediação Chancelado, Calibrado e Explicável para a UI e Analytics
     */
    static otimizarPlano(laudoDiagnostico, perfilEstudante = {}) {
        // Se for um acerto ou o laudo for espúrio, desativa o scaffold ativo
        if (!laudoDiagnostico || laudoDiagnostico.correto) {
            return {
                executarIntervencao: false,
                faseGalperin: "MENTAL_ABSTRATA",
                representacaoPreferencial: "SIMBOLICA_CONCEITUAL",
                outputAda: null
            };
        }

        const planoBruto = laudoDiagnostico.planoDeMediacao;
        const hipotese = laudoDiagnostico.hipoteseCognitiva;

        // --- RESGATE DE VARIÁVEIS CLINICO-SUJEITIVAS (ProfileEngine) ---
        const confiancaDiagnostica = hipotese.nivelConfiancaDiagnostica || 0.50;
        const persistenciaConceitual = perfilEstudante.indicePersistenciaConceitual || 0;
        const cargaFrustracao = perfilEstudante.cargaFrustracaoAcumulada || 0;
        
        // CIRURGIA A: Substituição de valores absolutos por propriedades dinâmicas do sujeito
        const resilienciaPedagogica = perfilEstudante.indiceResilienciaPedagogica !== undefined ? 
                                      perfilEstudante.indiceResilienciaPedagogica : 0.50; // default médio
        
        const estagioConceitual = perfilEstudante.estagioConceitual || "DISRUPÇÃO_INICIAL";

        // Inicializa o objeto de contrato lapidado
        let planoCalibrado = {
            executarIntervencao: true,
            conceitoAfetado: hipotese.conceitoAfetado,
            clusterTaxonomico: laudoDiagnostico.clusterTaxonomico,
            faseGalperin: planoBruto.faseGalperinSugerida || "VERBAL_EXPLICATIVA",
            representacaoPreferencial: planoBruto.representacaoPreferencial || "TEXTUAL",
            choqueSemioticoRecomendado: planoBruto.choqueSemioticoRecomendado || false,
            nivelConfiancaDiagnostica: confiancaDiagnostica,
            
            objetivoDaIntervencao: planoBruto.objetivo,
            scaffoldOperacional: planoBruto.scaffoldOperacional,
            perguntaInvariante: planoBruto.perguntaInvariante,
            acaoReflexiva: planoBruto.acaoReflexiva,
            gatilhoVisual: planoBruto.gatilhoVisual,
            motivoDaDecisao: "Configuração padrão baseada no laudo do diagnóstico."
        };

        // --- ALGORITMO DE ARBITRAGEM DA ZDP (O MOTOR DA BOA v2.1.0) ---
        
        // REGRA A (CIRURGIA B): Ramificação Avançada baseada no Estágio Conceitual do Sujeito
        // Evita empurrar o aluno em transição de volta para o concreto se ele já demonstra sinais de verbalização.
        if (confiancaDiagnostica >= 0.75 && persistenciaConceitual >= 2) {
            
            if (estagioConceitual === "PSEUDOCONCEITO_ESTAVEL") {
                // Erro enraizado e automatizado. Força regressão radical de fase.
                planoCalibrado.faseGalperin = "MATERIALIZADA_CONCRETA";
                planoCalibrado.representacaoPreferencial = "BLOCO_MANIPULAVEL_DIGITAL";
                planoCalibrado.gatilhoVisual = "[GATILHO_UI_FORCE_MATERIALIZADA_CONCRETA]";
                planoCalibrado.objetivoDaIntervencao = `Romper pseudoconceito estabilizado de ${hipotese.conceitoAfetado} via regressão à fase materializada.`;
                planoCalibrado.motivoDaDecisao = "Alta confiança diagnóstica combinada com Pseudoconceito Estável exige quebra empírica na fase materializada.";
            } 
            else if (estagioConceitual === "EM_TRANSICAO_CONCEITUAL") {
                // Aluno em evolução. Jogá-lo no concreto seria um retrocesso clínico destrutivo. 
                // A BOA segura o aluno na fase verbal externa para que ele formule logicamente.
                planoCalibrado.faseGalperin = "VERBAL_EXPLICATIVA";
                planoCalibrado.representacaoPreferencial = "AUDIO_TEXTO_LOGICO";
                planoCalibrado.choqueSemioticoRecomendado = true; // Mantém o choque semiótico para chacoalhar a transição
                planoCalibrado.gatilhoVisual = "[GATILHO_UI_FORMULACAO_VERBAL_PROMPT]";
                planoCalibrado.objetivoDaIntervencao = `Estimular a autoverificação liguística de ${hipotese.conceitoAfetado} mantendo o aluno na fase verbal de transição.`;
                planoCalibrado.motivoDaDecisao = "O estudante está Em Transição Conceitual. Evitou-se o recuo para a fase materializada; ativou-se mediação verbal expressiva.";
            }
        }
        
        // REGRA B (CIRURGIA A): Gestão de Atividade Cruzada com Resiliência Pedagógica Dinâmica
        // Alunos com baixa resiliência toleram menos erros antes da quebra do motivo leontieviano.
        // Alunos altamente resilientes toleram o conflito por mais tempo sem necessitar de amortecimento.
        const limiteFrustracaoExcedido = (resilienciaPedagogica < 0.4 && cargaFrustracao >= 2) || (cargaFrustracao >= 4);

        if (limiteFrustracaoExcedido) {
            planoCalibrado.faseGalperin = "VERBAL_EXPLICATIVA";
            planoCalibrado.representacaoPreferencial = "TEXTUAL_REFLEXIVA";
            planoCalibrado.choqueSemioticoRecomendado = false; // Aborta choque preventivamente
            planoCalibrado.gatilhoVisual = "[GATILHO_UI_DICA_SUAVE_MODAL]";
            planoCalibrado.objetivoDaIntervencao = "Atenuar a fricção cognitiva para mitigar saturação emocional e preservar o motivo da atividade.";
            planoCalibrado.scaffoldOperacional = `Respire fundo! Vamos olhar para o problema por outro ângulo. ${planoCalibrado.scaffoldOperacional}`;
            planoCalibrado.motivoDaDecisao = `Limite de fricção cognitiva excedido para o perfil de resiliência do sujeito (Nível: ${resilienciaPedagogica.toFixed(2)} / Carga: ${cargaFrustracao}). Intervenção amortecida.`;
        }

        // REGRA C: Baixa Confiança Diagnóstica (Prevenção de Overdiagnosis)
        // Se a certeza do diagnóstico for pífia, não aplica o plano severo do item. Força reflexão leve.
        if (confiancaDiagnostica < 0.55 && !limiteFrustracaoExcedido) {
            planoCalibrado.faseGalperin = "MENTAL_ABSTRATA";
            planoCalibrado.representacaoPreferencial = "SIMBOLICA_CONCEITUAL";
            planoCalibrado.choqueSemioticoRecomendado = false;
            planoCalibrado.gatilhoVisual = "[GATILHO_UI_REVISAO_RAPIDA]";
            planoCalibrado.perguntaInvariante = "Dê uma olhadinha rápida na sua escolha. O que motivou a sua seleção?";
            planoCalibrado.objetivoDaIntervencao = "Mediação de baixa intensidade baseada em incerteza do sensor diagnóstico.";
            planoCalibrado.motivoDaDecisao = `Confiança diagnóstica abaixo do limiar de segurança (${confiancaDiagnostica.toFixed(2)}). Aplicada verificação metacognitiva simples na fase mental.`;
        }

        // --- CIRURGIA C: INJEÇÃO DA CHANCELA EXPLICÁVEL PARA O TEACHER ANALYTICS ---
        planoCalibrado.chancelaBOA = {
            statusCalculo: limiteFrustracaoExcedido ? "ZDP_AMORTECIDA" : "ZDP_OTIMIZADA",
            cargaFrustracaoTratada: cargaFrustracao,
            faseEfetivaAlocada: planoCalibrado.faseGalperin,
            grauConfiancaValidado: confiancaDiagnostica,
            motivoDaDecisao: planoCalibrado.motivoDaDecisao // XAI pedagógico puro na ponta
        };

        return planoCalibrado;
    }
}
