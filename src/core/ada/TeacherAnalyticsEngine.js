/**
 * @fileoverview TeacherAnalyticsEngine.js
 * @description Motor de Explicabilidade (XAI) e Geração de Relatórios Docentes para o Ecossistema LabTech.
 * EVOLUÇÃO 12.1.0: XAI à prova de falhas com tratamento de nulos e acoplamento estrito à Ontologia Semiótica.
 * @package LabTech / Core Analytics Layer
 */

import { REPRESENTACOES_SEMIOTICAS } from './ContratosPedagogicos.js';

// Enums Locais de Falhas e Alvos de Mapeamento para desacoplamento de infraestrutura externa
const OBSTACULOS_COGNITIVOS = {
    PSEUDOCONCEITO: "PSEUDOCONCEITO",
    DEPENDENCIA_VISUAL: "DEPENDENCIA_VISUAL",
    MECANIZACAO_IMPULSIVA: "MECANIZACAO_IMPULSIVA",
    FRICCAO_COGNITIVA_ALTA: "FRICCAO_COGNITIVA_ALTA",
    NENHUM: "NENHUM"
};

const FASES_GALPERIN = {
    MATERIALIZADA: "MATERIALIZADA",
    MATERIALIZADA_VISUAL: "MATERIALIZADA_VISUAL",
    VERBAL_EXTERNA: "VERBAL_EXTERNA",
    VERBAL_INTERNA: "VERBAL_INTERNA",
    MENTAL: "MENTAL"
};

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
     * Gera o relatório diagnóstico estruturado para leitura do painel do professor.
     * @param {Object} perfilCognitivo - Perfil histórico vindo do ProfileEngine.
     */
    static generarRelatorioEstudante(perfilCognitivo) {
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
        const estagioConceitualRaw = ev.estagioConceitual || "DIAGNOSTICO_INICIAL";
        const obstaculoRaw = boa.focoConceitual?.obstaculoPrincipal || OBSTACULOS_COGNITIVOS.NENHUM;
        const indiceTransf = ev.indiceTransferenciaConceitual ?? ev.itc ?? 0;
        
        const faseMediacaoRaw = boa.estadoAtual?.faseMediacao || FASES_GALPERIN.MENTAL;
        const objetivoRaw = boa.focoConceitual?.objetivoAtual || OBJETIVOS_PEDAGOGICOS.DIAGNOSTICO_INICIAL;
        const estrategiaRaw = boa.planoDeMediacao?.estrategia || "FLUXO_PADRAO";
        const proximaAcaoRaw = boa.planoDeMediacao?.proximaAcao || "PADRAO";

        return {
            status: "ANALISE_CONCLUIDA",
            
            diagnostico: {
                fcoConceitual: conceitoAlvo,
                estagioFormacao: this._formatarTextoAmigavel(estagioConceitualRaw),
                obstaculoIdentificado: this._traduzirObstaculo(obstaculoRaw),
                indiceTransferencia: `${Math.round(indiceTransf * 100)}%`
            },

            evidenciasObservadas: this._extrairEvidenciasXAI(ev),

            acaoDaIA: {
                faseMediacao: this._traduzirFaseGalperin(faseMediacaoRaw),
                objetivoAtual: this._traduzirObjetivo(objetivoRaw),
                estrategia: this._formatarTextoAmigavel(estrategiaRaw),
                proximaIntervencaoPrevista: this._traduzirProximaAcao(proximaAcaoRaw)
            },

            acaoSugeridaProfessor: {
                prioridade: this._calcularPrioridadeIntervencao(obstaculoRaw),
                recomendacao: this._gerarRecomendacaoDocente(boa, ev)
            },

            evolucaoConceitual: this._mapearTrajetoria(ev.trajetoriaConceitual || ev.historicoEstagios)
        };
    }

    /**
     * 🧠 Extração Estatística de Evidências (XAI)
     * @private
     */
    static _extrairEvidenciasXAI(ev) {
        const visTotal = ev.visual?.total || 0;
        const visAcertos = ev.visual?.acertos || 0;
        const absTotal = ev.abstrata?.total || ev.abstrato?.total || 0;
        const absAcertos = ev.abstrata?.acertos || ev.abstrato?.acertos || 0;

        const txVisual = visTotal > 0 ? Math.round((visAcertos / visTotal) * 100) : 0;
        const txAbstrata = absTotal > 0 ? Math.round((absAcertos / absTotal) * 100) : 0;
        
        return {
            acertoEmQuestoesVisuais: `${txVisual}% (${visAcertos}/${visTotal})`,
            acertoEmQuestoesAbstratas: `${txAbstrata}% (${absAcertos}/${absTotal})`,
            transferenciasFalhadas: ev.transferenciasFalhadas || 0,
            transferenciasBemSucedidas: ev.transferenciasBemSucedidas || 0
        };
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
        return trajetoriaArray.map(t => ({
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
    static _gerarRecomendacaoDocente(boa, ev) {
        const obstaculo = boa.focoConceitual?.obstaculoPrincipal || OBSTACULOS_COGNITIVOS.NENHUM;
        const conceitoAlvo = boa.focoConceitual?.conceitoAlvo || "Conceito Geral";

        if (obstaculo === OBSTACULOS_COGNITIVOS.PSEUDOCONCEITO) {
            return `O aluno parece ter decorado uma regra falha para o conceito de ${conceitoAlvo}. Na próxima aula, peça para ele explicar COMO resolveu a questão, e não apenas o resultado.`;
        }
        if (obstaculo === OBSTACULOS_COGNITIVOS.DEPENDENCIA_VISUAL) {
            return `O aluno resolve os problemas quando há imagens, mas trava na versão textual. A IA está forçando a transferência. Acompanhe se ele consegue descrever o que seria desenhado.`;
        }
        if (obstaculo === OBSTACULOS_COGNITIVOS.FRICCAO_COGNITIVA_ALTA) {
            return `ALERTA: O aluno está errando repetidamente. A IA reduziu a dificuldade, mas pode ser necessária uma intervenção presencial para revisar a base de ${conceitoAlvo}.`;
        }
        if (ev.estagioConceitual === "GENERALIZACAO_CONSOLIDADA") {
            return `Excelente desempenho. O aluno já internalizou o conceito e consegue operá-lo de forma abstrata. Pronto para novos desafios.`;
        }
        return `O estudante está progredindo adequadamente na transição conceitual. A IA está alternando formatos para fortalecer o aprendizado. Nenhuma ação presencial imediata é necessária.`;
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
