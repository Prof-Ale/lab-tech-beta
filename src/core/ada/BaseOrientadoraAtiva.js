/**
 * @fileoverview BaseOrientadoraAtiva.js
 * @description Mecanismo de Arbitragem Pedagógica e Otimização Dinâmica da ZDP (BOA v2.2.0).
 * VERSÃO 2.2.0 (Sprint Limpo): Incorpora tratamento estrito para REGRESSAO_CONCEITUAL,
 * lê as tendências dinâmicas do perfil e consome as diretrizes do vetor expandido da ADA.
 * @package LabTech / Core ADA
 */

export class BaseOrientadoraAtiva {
    /**
     * Fábrica de instanciação para novos fluxos de aprendizagem.
     * Preserva o padrão estático e determinístico client-side.
     */
    static criarNova(conceitoAlvo = "INDEFINIDO", familiaAlvo = "INDEFINIDO") {
        return {
            versao: "BOA_v2.2.0_ADA_PROD",
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
     * @param {Object} laudoDiagnostico - Retorno integral vindo do DiagnosticEngine.js v5.1.0
     * @param {Object} perfilEstudante - Estado longitudinal extraído do ProfileEngine.js v3.1.0
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

        // --- RESGATE DE VARIÁVEIS CLINICO-SUJEITIVAS EXPANDIDAS (ProfileEngine v3.1) ---
        const confiancaDiagnostica = hipotese.nivelConfiancaDiagnostica || 0.50;
        const persistenciaConceitual = perfilEstudante.indicePersistenciaConceitual || 0;
        const cargaFrustracao = perfilEstudante.cargaFrustracaoAcumulada || 0;
        const resilienciaPedagogica = perfilEstudante.indiceResilienciaPedagogica !== undefined ? 
                                      perfilEstudante.indiceResilienciaPedagogica : 0.50;
        
        const estagioConceitual = perfilEstudante.estagioConceitual || "DISRUPÇÃO_INICIAL";
        
        // Captura os novos indicadores de tendência ontológica e diretriz macro calculados pelo perfil
        const conceitoAfetado = hipotese.conceitoAfetado || "GERAL";
        const dadosPerfilConceito = perfilEstudante.perfilConceitual?.[conceitoAfetado] || {};
        const tendenciaConceitual = dadosPerfilConceito.tendencia || "ESTÁVEL";
        const diretrizADA = perfilEstudante.sugestaoAcaoADA || {};

        // Inicializa o objeto de contrato lapidado transportando os metadados dinâmicos
        let planoCalibrado = {
            executarIntervencao: true,
            conceitoAfetado: conceitoAfetado,
            clusterTaxonomico: laudoDiagnostico.clusterTaxonomico,
            faseGalperin: planoBruto.faseGalperinSugerida || "VERBAL_EXPLICATIVA",
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

        // --- ALGORITMO DE ARBITRAGEM DA ZDP EVOLUÍDO (BOA v2.2.0) ---
        
        // REGRA A: Ramificação por Estágio Conceitual Cruzada com Tendência de Longo Prazo
        if (confiancaDiagnostica >= 0.75 && (persistenciaConceitual >= 2 || diretrizADA.comandoMacro === "FORCE_SEMIOTIC_TRANSITION")) {
            
            if (estagioConceitual === "PSEUDOCONCEITO_ESTAVEL") {
                // Caso Clássico: Automação cega cristalizada. Recuo forçado ao concreto.
                planoCalibrado.faseGalperin = "MATERIALIZADA_CONCRETA";
                planoCalibrado.representacaoPreferencial = "BLOCO_MANIPULAVEL_DIGITAL";
                planoCalibrado.gatilhoVisual = "[GATILHO_UI_FORCE_MATERIALIZADA_CONCRETA]";
                planoCalibrado.intensidadeMediacao = "ALTA";
                planoCalibrado.objetivoDaIntervencao = `Romper pseudoconceito estabilizado de ${conceitoAfetado} via regressão à fase materializada.`;
                planoCalibrado.motivoDaDecisao = "Pseudoconceito Estável com alta confiança exige desautomatização na base materializada.";
            } 
            else if (estagioConceitual === "EM_TRANSICAO_CONCEITUAL") {
                // Caso de Evolução: Segura o aluno na verbalização explicativa para que ele formule a contradição.
                planoCalibrado.faseGalperin = "VERBAL_EXPLICATIVA";
                planoCalibrado.representacaoPreferencial = "AUDIO_TEXTO_LOGICO";
                planoCalibrado.choqueSemioticoRecomendado = true; // Chacoalha os registros semióticos
                planoCalibrado.gatilhoVisual = "[GATILHO_UI_FORMULACAO_VERBAL_PROMPT]";
                planoCalibrado.intensidadeMediacao = "MODERADA";
                planoCalibrado.objetivoDaIntervencao = `Provocar conflito de registros em ${conceitoAfetado} retendo o estudante na fase verbal de transição.`;
                planoCalibrado.motivoDaDecisao = "Estudante Em Transição Conceitual. Evitou-se o retrocesso ao concreto; ativou-se choque semiótico na fase verbal.";
            }
            // 🚨 INJEÇÃO INÉDITA: TRATAMENTO CIRÚRGICO PARA REGRESSÃO CONCEITUAL LONGITUDINAL
            else if (estagioConceitual === "REGRESSAO_CONCEITUAL" || tendenciaConceitual === "REGREDINDO") {
                // O estudante já dominava a abstração, mas refluiu (esquecimento ou hiato). 
                // Jogá-lo de volta ao concreto seria ofensivo/desmotivador; mantê-lo no abstrato geraria fricção.
                // A BOA reza o manual de Galperin: ativa a Fase Verbal Externa Escrita/Linguística (Textual).
                planoCalibrado.faseGalperin = "VERBAL_EXPLICATIVA";
                planoCalibrado.representacaoPreferencial = "TEXTUAL_SQUEMATICA";
                planoCalibrado.choqueSemioticoRecomendado = false; // Desativa choque para restabelecer a segurança cognitiva
                planoCalibrado.gatilhoVisual = "[GATILHO_UI_RECONSTRUÇÃO_LINGUISTICA_CARD]";
                planoCalibrado.intensidadeMediacao = "ALTA"; 
                planoCalibrado.objetivoDaIntervencao = `Recompor o rastro de generalização de ${conceitoAfetado} afetado por volatilidade ou hiato temporal através de suporte linguístico.`;
                planoCalibrado.motivoDaDecisao = "Regressão Conceitual ou Tendência Decrescente detectada pelo ProfileEngine. Ativado resgate assistido via fase verbal esquemática para reestabilizar o rastro abstrato.";
            }
        }
        
        // REGRA B: Gestão de Atividade Cruzada com Resiliência Pedagógica Dinâmica
        const limiteFrustracaoExcedido = (resilienciaPedagogica < 0.4 && cargaFrustracao >= 2) || (cargaFrustracao >= 4) || (tendenciaConceitual === "ESTAGNADO" && cargaFrustracao >= 2);

        if (limiteFrustracaoExcedido) {
            planoCalibrado.faseGalperin = "VERBAL_EXPLICATIVA";
            planoCalibrado.representacaoPreferencial = "TEXTUAL_REFLEXIVA";
            planoCalibrado.choqueSemioticoRecomendado = false; // Aborta choques preventivamente
            planoCalibrado.gatilhoVisual = "[GATILHO_UI_DICA_SUAVE_MODAL]";
            planoCalibrado.intensidadeMediacao = "MÍNIMA";
            planoCalibrado.objetivoDaIntervencao = "Atenuar a fricção cognitiva para mitigar saturação emocional e preservar o motivo leontieviano.";
            planoCalibrado.scaffoldOperacional = `Respire fundo! Vamos olhar para o problema por outro ângulo. ${planoCalibrado.scaffoldOperacional}`;
            planoCalibrado.motivoDaDecisao = `Fricção crítica tolerada pelo perfil (Resiliência: ${resilienciaPedagogica.toFixed(2)} / Tendência: ${tendenciaConceitual}). Intervenção amortecida linguisticamente para evitar abandono da atividade.`;
        }

        // REGRA C: Prevenção de Overdiagnosis baseada em Incerteza do Sensor
        if (confiancaDiagnostica < 0.55 && !limiteFrustracaoExcedido) {
            planoCalibrado.faseGalperin = "MENTAL_ABSTRATA";
            planoCalibrado.representacaoPreferencial = "SIMBOLICA_CONCEITUAL";
            planoCalibrado.choqueSemioticoRecomendado = false;
            planoCalibrado.gatilhoVisual = "[GATILHO_UI_REVISAO_RAPIDA]";
            planoCalibrado.intensidadeMediacao = "BAIXA";
            planoCalibrado.perguntaInvariante = "Dê uma olhadinha rápida na sua escolha. O que motivou a sua seleção?";
            planoCalibrado.objetivoDaIntervencao = "Mediação de baixa intensidade ativada por margem de incerteza diagnóstica.";
            planoCalibrado.motivoDaDecisao = `Confiança do sensor abaixo do limiar de segurança (${confiancaDiagnostica.toFixed(2)}). Aplicada verificação metacognitiva leve diretamente na fase mental.`;
        }

        // --- CHANCELA EXPLICÁVEL CONSOLIDADA PARA O TEACHER ANALYTICS V2 ---
        planoCalibrado.chancelaBOA = {
            statusCalculo: limiteFrustracaoExcedido ? "ZDP_AMORTECIDA" : "ZDP_OTIMIZADA",
            faseEfetivaAlocada: planoCalibrado.faseGalperin,
            grauConfiancaValidado: confiancaDiagnostica,
            intensidadeEfetiva: planoCalibrado.intensidadeMediacao,
            tendenciaSujeitoTratada: tendenciaConceitual,
            motivoDaDecisao: planoCalibrado.motivoDaDecisao 
        };

        return planoCalibrado;
    }
}
