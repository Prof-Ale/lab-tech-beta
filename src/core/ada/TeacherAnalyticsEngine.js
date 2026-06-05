/**
 * @fileoverview TeacherAnalyticsEngine.js
 * @description Motor de Explicabilidade (XAI) e Tradução Pedagógica de Telemetria Docente.
 * VERSÃO 12.2.0 (Sprint Limpo): Acoplamento estrito aos ContratosPedagogicos.js unificados, 
 * correção de typos, interpretação descritiva do ITC e injeção da Matriz de Transferência Semiótica.
 * @package LabTech / Core Analytics Layer
 */

import { 
    REPRESENTACOES_SEMIOTICAS, 
    OBSTACULOS_COGNITIVOS, 
    ESTAGIOS_CONCEITUAIS, 
    FASES_GALPERIN 
} from './ContratosPedagogicos.js';

// Enum Local de Controle de Objetivos Macro (Caso não instanciado externamente)
const OBJETIVOS_PEDAGOGICOS = {
    DIAGNOSTICO_INICIAL: "DIAGNOSTICO_INICIAL",
    REDUZIR_DEPENDENCIA_VISUAL: "REDUZIR_DEPENDENCIA_VISUAL",
    QUEBRA_DE_MECANIZACAO: "QUEBRA_DE_MECANIZACAO",
    INIBICAO_ARITMETICA: "INIBICAO_ARITMETICA",
    RECONSTRUCAO_ESTRUTURAL: "RECONSTRUCAO_ESTRUTURAL",
    AUTOMATIZACAO_CONSCIENTE: "AUTOMATIZACAO_CONSCIENTE"
};

export class TeacherAnalyticsEngine {

    /**
     * Gera o relatório diagnóstico estruturado para leitura do painel do professor (XAI Puro).
     * @param {Object} perfilCognitivo - Perfil histórico longitudinal vindo do ProfileEngine.
     */
    static gerarRelatorioEstudante(perfilCognitivo) { // 🔧 CIRURGIA 2: Correção idiomática (generar -> gerar)
        if (!perfilCognitivo) return null;

        const relatorio = {
            estudanteId: perfilCognitivo.id || perfilCognitivo.estudanteId || "UID_ANONIMO",
            confiancaGeralDaIA: perfilCognitivo.confiancaDiagnostica ?? 0.5,
            riscoCritico: this._avaliarRiscoGlobal(perfilCognitivo),
            habilidades: {}
        };

        if (perfilCognitivo.habilidades && typeof perfilCognitivo.habilidades === 'object') {
            for (const [bncc, hab] of Object.entries(perfilCognitivo.habilidades)) {
                relatorio.habilidades[bncc] = this._traduzirHabilidade(bncc, hab);
            }
        }

        return relatorio;
    }

    /**
     * Processa e traduz metadados matemáticos crus em inteligência pedagógica acionável.
     * @private
     */
    static _traduzirHabilidade(bncc, hab) {
        if (!hab) {
            return {
                status: "COLETA_DE_DADOS",
                mensagemCurta: "A IA está mapeando a Zona de Desenvolvimento Proximal do estudante."
            };
        }

        const boa = hab.baseOrientadoraAtiva || hab.boa;
        const ev = hab.evidenciasConceituais || hab.evidencias;

        if (!boa || !ev) {
            return {
                status: "COLETA_DE_DADOS",
                mensagemCurta: "Dados insuficientes na Base Orientadora Ativa para consolidar diagnóstico explicável."
            };
        }

        // Normalização preventiva de campos aninhados para blindagem de tempo de execução
        const conceitoAlvo = boa.focoConceitual?.conceitoAlvo || "Conceito Geral";
        const estagioConceitualRaw = ev.estagioConceitual || ESTAGIOS_CONCEITUAIS.EVIDENCIA_INSUFICIENTE;
        const obstaculoRaw = boa.focoConceitual?.obstaculoPrincipal || OBSTACULOS_COGNITIVOS.NENHUM;
        const indiceTransf = ev.indiceTransferenciaConceitual ?? ev.itc ?? 0;
        
        const faseMediacaoRaw = boa.estadoAtual?.faseMediacao || FASES_GALPERIN.MENTAL;
        const objetivoRaw = boa.focoConceitual?.objetivoAtual || OBJETIVOS_PEDAGOGICOS.DIAGNOSTICO_INICIAL;
        const estrategiaRaw = boa.planoDeMediacao?.estrategia || "FLUXO_PADRAO";
        const proximaAcaoRaw = boa.planoDeMediacao?.proximaAcao || "PADRAO";

        return {
            status: "ANALISE_CONCLUIDA",
            
            diagnostico: {
                focoConceitual: conceitoAlvo, // 🔧 CIRURGIA 6: Correção de typo (fcoConceitual -> focoConceitual)
                estagioFormacao: this._formatarTextoAmigavel(estagioConceitualRaw),
                obstaculoIdentificado: this._traduzirObstaculo(obstaculoRaw),
                
                // 🔧 CIRURGIA 3: ITC Transformado em Indicador Qualitativo e Descritivo
                indiceTransferencia: {
                    porcentagem: `${Math.round(indiceTransf * 100)}%`,
                    interpretacao: this._interpretarQualitativamenteITC(indiceTransf, estagioConceitualRaw)
                }
            },

            // 🔧 CIRURGIA 4: Acoplamento da Extração de Evidências com a Matriz de Transição Semiótica Real
            evidenciasObservadas: this._extrairEvidenciasXAI(ev),

            acaoDaIA: {
                faseMediacao: this._traduzirFaseGalperin(faseMediacaoRaw),
                objetivoAtual: this._traduzirObjetivo(objetivoRaw),
                estrategia: this._formatarTextoAmigavel(estrategiaRaw),
                proximaIntervencaoPrevista: this._traduzirProximaAcao(proximaAcaoRaw)
            },

            acaoSugeridaProfessor: {
                prioridade: this._calcularPrioridadeIntervencao(obstaculoRaw),
                // 🔧 CIRURGIA 5: Recomendação Dinâmica Cruzando Obstáculo + Estágio Conceitual Longitudinal
                recomendacao: this._gerarRecomendacaoDocenteCruzada(obstaculoRaw, estagioConceitualRaw, conceitoAlvo)
            },

            evolucaoConceitual: this._mapearTrajetoria(ev.trajetoriaConceitual || ev.historicoEstagios)
        };
    }

    /**
     * 🧠 Extração Estatística de Evidências (XAI) e Construção da Matriz de Transição
     * @private
     */
    static _extrairEvidenciasXAI(ev) {
        const dr = ev.dependenciaRepresentacional || {};
        
        const visTotal = dr.VISUAL?.total || ev.visual?.total || 0;
        const visAcertos = dr.VISUAL?.acertos || ev.visual?.acertos || 0;
        const absTotal = dr.ABSTRATO?.total || ev.abstrata?.total || ev.abstrato?.total || 0;
        const absAcertos = dr.ABSTRATO?.acertos || ev.abstrata?.acertos || ev.abstrato?.acertos || 0;

        const txVisual = visTotal > 0 ? Math.round((visAcertos / visTotal) * 100) : 0;
        const txAbstrata = absTotal > 0 ? Math.round((absAcertos / absTotal) * 100) : 0;
        
        // Constrói em tempo real a Matriz Dinâmica de Choques Executados vs Sucessos
        const matrizTransferencia = {
            "CONCRETA_PARA_VISUAL": { tentativas: 0, sucessos: 0 },
            "VISUAL_PARA_TEXTUAL": { tentativas: 0, sucessos: 0 },
            "TEXTUAL_PARA_ABSTRATA": { tentativas: 0, sucessos: 0 },
            "CONCRETA_PARA_ABSTRATA": { tentativas: 0, sucessos: 0 }
        };

        if (ev.historicoTransferencia && Array.isArray(ev.historicoTransferencia)) {
            ev.historicoTransferencia.forEach(t => {
                const chaveMatriz = `${t.original}_PARA_${t.forcado}`;
                if (matrizTransferencia[chaveMatriz]) {
                    matrizTransferencia[chaveMatriz].tentativas++;
                    if (t.correto) matrizTransferencia[chaveMatriz].sucessos++;
                }
            });
        }
        
        return {
            acertoEmQuestoesVisuais: `${txVisual}% (${visAcertos}/${visTotal})`,
            acertoEmQuestoesAbstratas: `${txAbstrata}% (${absAcertos}/${absTotal})`,
            choquesExecutadosFisicamente: ev.transferenciasBemSucedidas + ev.transferenciasFalhadas,
            choquesComTransferenciaEfetiva: ev.transferenciasBemSucedidas,
            matrizDeTransicaoSemiotica: matrizTransferencia
        };
    }

    /**
     * Traduz o ITC em uma interpretação pedagógica clara baseada no rastro de Galperin.
     * @private
     */
    static _interpretarQualitativamenteITC(itc, estagio) {
        if (estagio === ESTAGIOS_CONCEITUAIS.GENERALIZACAO_CONSOLIDADA) {
            return "Compreensão teórica plena. O estudante transfere o conceito imutável livremente entre registros concretos, textuais e simbólicos abstratos.";
        }
        if (estagio === ESTAGIOS_CONCEITUAIS.REGRESSAO_CONCEITUAL) {
            return "Alerta de Volatilidade. O estudante possuía o domínio formal abstrato, mas sofreu colapso conceitual recente, demandando resgate linguístico (fase verbal).";
        }
        if (itc >= 0.55) {
            return "Transição Semiótica em Curso. O estudante consegue operar com sucesso em suportes gráficos e interpreta enunciados com contextualização, mas oscila sob abstração pura.";
        }
        if (estagio === ESTAGIOS_CONCEITUAIS.PSEUDOCONCEITO_ESTAVEL) {
            return "Cristalização Empírica Fixa. O estudante não realiza transferência. Ele depende exclusivamente da pista visual ou memorizou uma rotina procedimental cega.";
        }
        return "Coletando rastro representacional volumétrico para consolidar a assinatura de transferência semiótica.";
    }

    /**
     * Matriz de Decisão Dinâmica para Recomendação Docente Cruzada (Obstáculo * Estágio)
     * @private
     */
    static _gerarRecomendacaoDocenteCruzada(obstaculo, estagio, conceitoAlvo) {
        // Cenário Crítico: Aluno Cristalizado em Erro Automatizado
        if (estagio === ESTAGIOS_CONCEITUAIS.PSEUDOCONCEITO_ESTAVEL) {
            return `O estudante cristalizou um pseudoconceito (regra falsa decorada) em ${conceitoAlvo}. Ação Recomendada: NÃO adianta passar mais exercícios abstratos idênticos. Promova uma quebra empírica presencial forçando o aluno a confrontar o resultado com material concreto/dourado e peça para ele verbalizar a contradição encontrada.`;
        }
        
        // Cenário de Oscilação de Transição
        if (estagio === ESTAGIOS_CONCEITUAIS.EM_TRANSICAO_CONCEITUAL) {
            if (obstaculo === OBSTACULOS_COGNITIVOS.DEPENDENCIA_VISUAL) {
                return `O estudante demonstra bom desempenho quando há suporte gráfico em ${conceitoAlvo}, mas falha no formato puramente textual ou abstrato. Ação Recomendada: Estimule o fading controlado. Peça para o aluno desenhar o problema textual no papel e, gradativamente, peça para ele substituir os desenhos pelas variáveis numéricas isoladas.`;
            }
            return `Estudante em evolução ativa na Zona de Desenvolvimento Proximal de ${conceitoAlvo}. A IA está aplicando variações e choques de formato para consolidar a fixação. Monitore sem interrupções frontais necessárias.`;
        }

        // Cenário de Regressão Longitudinal Crítica
        if (estagio === ESTAGIOS_CONCEITUAIS.REGRESSAO_CONCEITUAL) {
            return `Atenção: Foi detectada uma Regressão Conceitual em ${conceitoAlvo}. O estudante já dominava a operação formal abstrata, mas refluiu (esquecimento ou hiato de tempo). Ação Recomendada: Ative o resgate liguístico. Peça para o aluno ditar ou escrever em linguagem natural o passo a passo da regra matemática antes de tentar montar a equação diretamente.`;
        }

        if (estagio === ESTAGIOS_CONCEITUAIS.GENERALIZACAO_CONSOLIDADA) {
            return `Excelente desempenho verificado. O estudante atingiu o pensamento teórico abstrato estável em ${conceitoAlvo} e superou os choques de registros. Ação Recomendada: Forneça desafios complexos de aplicação prática em outras disciplinas (Física, Química ou Ciências) para expandir a interdisciplinaridade do conceito.`;
        }

        return `A IA está mapeando os registros representacionais do estudante em ${conceitoAlvo}. Mantenha o fluxo regular de atividades cotidianas.`;
    }

    /**
     * @private
     */
    static _calcularPrioridadeIntervencao(obstaculo) {
        switch(obstaculo) {
            case OBSTACULOS_COGNITIVOS.PSEUDOCONCEITO:
            case OBSTACULOS_COGNITIVOS.FRICCAO_COGNITIVA_ALTA:
                return "ALTA";
            case OBSTACULOS_COGNITIVOS.DEPENDENCIA_VISUAL:
            case OBSTACULOS_COGNITIVOS.MECANIZACAO_IMPULSIVA:
                return "MÉDIA";
            default:
                return "BAIXA";
        }
    }

    /**
     * @private
     */
    static _mapearTrajetoria(trajetoriaArray) {
        if (!trajetoriaArray || !Array.isArray(trajetoriaArray) || trajetoriaArray.length === 0) return [];
        return Array.from(trajetoriaArray).map(t => ({
            data: t.data ? new Date(t.data).toLocaleDateString('pt-BR') : new Date().toLocaleDateString('pt-BR'),
            estagio: this._formatarTextoAmigavel(t.para || t.estagio || "Coleta")
        }));
    }

    /**
     * @private
     */
    static _traduzirProximaAcao(acaoCode) {
        const dicionario = {
            "FORCE_SEMIOTIC_TRANSITION": "Forçar transferência semiótica para formato abstrato",
            "TRIGGER_CONCEPTUAL_RESET": "Aplicar representação atípica para gerar conflito cognitivo",
            "INJECT_RHYTHMIC_LOCK": "Inserir bloqueio rítmico para forçar leitura atenta",
            "REDUCE_COGNITIVE_LOAD": "Reduzir carga cognitiva e oferecer apoio estrutural concreto",
            "PADRAO": "Manter exposição variada (Fluxo padrão)"
        };
        return dicionario[acaoCode] || this._formatarTextoAmigavel(acaoCode);
    }

    /**
     * @private
     */
    static _traduzirObstaculo(obstaculo) {
        const dicionario = {
            [OBSTACULOS_COGNITIVOS.PSEUDOCONCEITO]: "Mecanização de regra errada (Pseudoconceito)",
            [OBSTACULOS_COGNITIVOS.DEPENDENCIA_VISUAL]: "Dependência de representações visuais/concretas",
            [OBSTACULOS_COGNITIVOS.MECANIZACAO_IMPULSIVA]: "Impulsividade / Falta de leitura atenta",
            [OBSTACULOS_COGNITIVOS.FRICCAO_COGNITIVA_ALTA]: "Sobrecarga Cognitiva (Múltiplos erros)",
            [OBSTACULOS_COGNITIVOS.NENHUM]: "Nenhum obstáculo detectado"
        };
        return dicionario[obstaculo] || this._formatarTextoAmigavel(obstaculo);
    }

    /**
     * @private
     */
    static _traduzirFaseGalperin(fase) {
        const dicionario = {
            [FASES_GALPERIN.MATERIALIZADA]: "Apoio Concreto (Baixa Abstração)",
            [FASES_GALPERIN.MATERIALIZADA_VISUAL]: "Apoio Visual / Gráfico",
            [FASES_GALPERIN.VERBAL_EXTERNA]: "Verbalização (Exigindo justificativas)",
            [FASES_GALPERIN.VERBAL_INTERNA]: "Processamento Interno / Desaceleração",
            [FASES_GALPERIN.MENTAL]: "Automatização (Alta Abstração)"
        };
        return dicionario[fase] || fase;
    }

    /**
     * @private
     */
    static _traduzirObjetivo(objetivo) {
        const dicionario = {
            [OBJETIVOS_PEDAGOGICOS.DIAGNOSTICO_INICIAL]: "Diagnóstico Inicial da ZDP",
            [OBJETIVOS_PEDAGOGICOS.REDUZIR_DEPENDENCIA_VISUAL]: "Reduzir o apego a desenhos e gráficos",
            [OBJETIVOS_PEDAGOGICOS.QUEBRA_DE_MECANIZACAO]: "Quebrar regras decoradas erroneamente",
            [OBJETIVOS_PEDAGOGICOS.INIBICAO_ARITMETICA]: "Frear impulsividade e incentivar interpretação",
            [OBJETIVOS_PEDAGOGICOS.RECONSTRUCAO_ESTRUTURAL]: "Recuar um passo para reconstruir conceitos base",
            [OBJETIVOS_PEDAGOGICOS.AUTOMATIZACAO_CONSCIENTE]: "Aprofundar a generalização do conceito"
        };
        return dicionario[objetivo] || this._formatarTextoAmigavel(objetivo);
    }

    /**
     * @private
     */
    static _avaliarRiscoGlobal(perfil) {
        if (!perfil) return "NORMAL";
        const idxP = perfil.indicePseudoconceito ?? 0;
        return idxP > 0.6 ? "ALTO" : "NORMAL";
    }

    /**
     * @private
     */
    static _formatarTextoAmigavel(textoStr) {
        if (!textoStr) return "Indefinido";
        return String(textoStr).replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
    }
}
