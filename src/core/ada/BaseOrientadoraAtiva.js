/**
 * @fileoverview BaseOrientadoraAtiva.js
 * @description Mecanismo de Arbitragem Pedagógica e Otimização Dinâmica da ZDP (BOA v2.2.1).
 * VERSÃO 2.2.1: Consumo da propriedade unificada faseGalperin vinda do laudo do DiagnosticEngine.
 * @package LabTech / Core ADA
 */

export class BaseOrientadoraAtiva {
    static criarNova(conceitoAlvo = "INDEFINIDO", familiaAlvo = "INDEFINIDO") {
        return {
            versao: "BOA_v2.2.1_ADA_PROD",
            timestamp: new Date().toISOString(),
            focoCurricular: {
                conceitoAlvo: conceitoAlvo,
                familiaAlvo: familiaAlvo
            },
            estadoMediacao: {
                faseGalperinEfetiva: "MENTAL_ABSTRATA",
                representacaoAtiva: "SIMBOLICA",
                choqueSemioticoAtivo: false,
                saturacaoCognitivaTratada: 0,
                intensidadeAplicada: "BAIXA"
            },
            auditoriaZDP: {
                chancelaStatus: "AGUARDANDO_INTERACAO",
                confiancaAlocada: 1.0,
                motivoDaDecisao: "Aguardando primeira interação do estudante."
            }
        };
    }

    /**
     * Arbitra o plano bruto cruzando a clínica do erro com as vulnerabilidades e tendências do sujeito.
     * @param {Object} laudoDiagnostico - Retorno integral vindo do DiagnosticEngine.js v5.2.1
     * @param {Object} perfilEstudante - Estado longitudinal extraído do ProfileEngine.js v3.1.0
     * @returns {Object} Plano de Mediação Chancelado, Calibrado e Explicável para a UI e Analytics
     */
    static otimizarPlano(laudoDiagnostico, perfilEstudante = {}) {
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

        const confiancaDiagnostica = hipotese.nivelConfiancaDiagnostica || 0.50;
        const persistenciaConceitual = perfilEstudante.indicePersistenciaConceitual || 0;
        const cargaFrustracao = perfilEstudante.cargaFrustracaoAcumulada || 0;
        const resilienciaPedagogica = perfilEstudante.indiceResilienciaPedagogica !== undefined ? 
                                      perfilEstudante.indiceResilienciaPedagogica : 0.50;
        
        const estagioConceitual = perfilEstudante.estagioConceitual || "DISRUPÇÃO_INICIAL";
        
        const conceitoAfetado = hipotese.conceitoAfetado || "GERAL";
        const dadosPerfilConceito = perfilEstudante.perfilConceitual?.[conceitoAfetado] || {};
        const tendenciaConceitual = dadosPerfilConceito.tendencia || "ESTÁVEL";
        const diretrizADA = perfilEstudante.sugestaoAcaoADA || {};

        let planoCalibrado = {
            executarIntervencao: true,
            conceitoAfetado: conceitoAfetado,
            clusterTaxonomico: laudoDiagnostico.clusterTaxonomico,
            // CORREÇÃO: Consome diretamente a propriedade tratada faseGalperin do plano bruto
            faseGalperin: planoBruto.faseGalperin || "VERBAL_EXPLICATIVA",
            representacaoPreferencial: planoBruto.representacaoPreferencial || "TEXTUAL",
            choqueSemioticoRecomendado: planoBruto.choqueSemioticoRecomendado || false,
            nivelConfiancaDiagnostica: confiancaDiagnostica,
            intensidadeMediacao: diretrizADA.intensidadeMediacao || "MODERADA",
            
            objetivoDaIntervencao: planoBruto.objetivo,
            scaffoldOperacional: planoBruto.scaffoldOperacional,
            perguntaInvariante: planoBruto.perguntaInvariante,
            acaoReflexiva: planoBruto.acaoReflexiva,
            gatilhoVisual: planoBruto.gatilhoVisual,
            motivoDaDecisao: "Configuração balanceada com base na biópsia inicial do erro."
        };

        // --- ALGORITMO DE ARBITRAGEM DA ZDP (BOA v2.2.1) ---
        if (confiancaDiagnostica >= 0.75 && (persistenciaConceitual >= 2 || diretrizADA.comandoMacro === "FORCE_SEMIOTIC_TRANSITION")) {
            if (estagioConceitual === "PSEUDOCONCEITO_ESTAVEL") {
                planoCalibrado.faseGalperin = "MATERIALIZADA_CONCRETA";
                planoCalibrado.representacaoPreferencial = "BLCO_MANIPULAVEL_DIGITAL";
                planoCalibrado.gatilhoVisual = "[GATILHO_UI_FORCE_MATERIALIZADA_CONCRETA]";
                planoCalibrado.intensidadeMediacao = "ALTA";
                planoCalibrado.objetivoDaIntervencao = `Romper pseudoconceito estabilizado de ${conceitoAfetado} via regressão à fase materializada.`;
                planoCalibrado.motivoDaDecisao = "Pseudoconceito Estável com alta confiança exige desautomatização na base materializada.";
            } 
            else if (estagioConceitual === "EM_TRANSICAO_CONCEITUAL") {
                planoCalibrado.faseGalperin = "VERBAL_EXPLICATIVA";
                planoCalibrado.representacaoPreferencial = "AUDIO_TEXTO_LOGICO";
                planoCalibrado.choqueSemioticoRecomendado = true;
                planoCalibrado.gatilhoVisual = "[GATILHO_UI_FORMULACAO_VERBAL_PROMPT]";
                planoCalibrado.intensidadeMediacao = "MODERADA";
                planoCalibrado.objetivoDaIntervencao = `Provocar conflito de registros em ${conceitoAfetado} retendo o estudante na fase verbal de transição.`;
                planoCalibrado.motivoDaDecisao = "Estudante Em Transição Conceitual. Evitou-se o retrocesso ao concreto; ativou-se choque semiótico na fase verbal.";
            }
            else if (estagioConceitual === "REGRESSAO_CONCEITUAL" || tendenciaConceitual === "REGREDINDO") {
                planoCalibrado.faseGalperin = "VERBAL_EXPLICATIVA";
                planoCalibrado.representacaoPreferencial = "TEXTUAL_SQUEMATICA";
                planoCalibrado.choqueSemioticoRecomendado = false;
                planoCalibrado.gatilhoVisual = "[GATILHO_UI_RECONSTRUÇÃO_LINGUISTICA_CARD]";
                planoCalibrado.intensidadeMediacao = "ALTA"; 
                planoCalibrado.objetivoDaIntervencao = `Recompor o rastro de generalização de ${conceitoAfetado} afetado por volatilidade através de suporte linguístico.`;
                planoCalibrado.motivoDaDecisao = "Regressão Conceitual detectada. Ativado resgate assistido via fase verbal esquemática.";
            }
        }
        
        const limiteFrustracaoExcedido = (resilienciaPedagogica < 0.4 && cargaFrustracao >= 2) || (cargaFrustracao >= 4) || (tendenciaConceitual === "ESTAGNADO" && cargaFrustracao >= 2);

        if (limiteFrustracaoExcedido) {
            planoCalibrado.faseGalperin = "VERBAL_EXPLICATIVA";
            planoCalibrado.representacaoPreferencial = "TEXTUAL_REFLEXIVA";
            planoCalibrado.choqueSemioticoRecomendado = false;
            planoCalibrado.gatilhoVisual = "[GATILHO_UI_DICA_SUAVE_MODAL]";
            planoCalibrado.intensidadeMediacao = "MÍNIMA";
            planoCalibrado.objetivoDaIntervencao = "Atenuar a fricção cognitiva para mitigar saturação emocional.";
            planoCalibrado.scaffoldOperacional = `Respire fundo! Vamos olhar para o problema por outro ângulo. ${planoCalibrado.scaffoldOperacional}`;
            planoCalibrado.motivoDaDecisao = `Fricção crítica tolerada pelo perfil. Intervenção amortecida linguisticamente para evitar abandono.`;
        }

        if (confiancaDiagnostica < 0.55 && !limiteFrustracaoExcedido) {
            planoCalibrado.faseGalperin = "MENTAL_ABSTRATA";
            planoCalibrado.representacaoPreferencial = "SIMBOLICA_CONCEITUAL";
            planoCalibrado.choqueSemioticoRecomendado = false;
            planoCalibrado.gatilhoVisual = "[GATILHO_UI_REVISAO_RAPIDA]";
            planoCalibrado.intensidadeMediacao = "BAIXA";
            planoCalibrado.perguntaInvariante = "Dê uma olhadinha rápida na sua escolha. O que motivou a sua seleção?";
            planoCalibrado.objetivoDaIntervencao = "Mediação de baixa intensidade ativada por margem de incerteza diagnóstica.";
            planoCalibrado.motivoDaDecisao = `Confiança do sensor abaixo do limiar de segurança (${confiancaDiagnostica.toFixed(2)}).`;
        }

        planoCalibrado.chancelaBOA = {
            statusCalculo: limiteFrustracaoExcedido ? "ZDP_AMORTECIDA" : "ZDP_OTIMIZADA",
            faseEfetivaAlocada: planoCalibrado.faseGalperin, // Garantia de consistência
            grauConfiancaValidado: confiancaDiagnostica,
            intensidadeEfetiva: planoCalibrado.intensidadeMediacao,
            tendenciaSujeitoTratada: tendenciaConceitual,
            motivoDaDecisao: planoCalibrado.motivoDaDecisao 
        };

        return planoCalibrado;
    }
}
