/**
 * @fileoverview TeacherAnalyticsEngine.js
 * @description Motor de Explicabilidade (XAI) e Geração de Relatórios Docentes.
 * Traduz o estado da Base Orientadora Ativa (BOA) em insights acionáveis para o professor.
 * @package LabTech Core Environment
 */

import { 
    FASES_GALPERIN, 
    OBSTACULOS_COGNITIVOS, 
    OBJETIVOS_PEDAGOGICOS 
} from './ContratosPedagogicos.js';

export class TeacherAnalyticsEngine {

    /**
     * Gera o relatório global da turma ou de um aluno específico.
     */
    static gerarRelatorioEstudante(perfilCognitivo) {
        if (!perfilCognitivo) return null;

        const relatorio = {
            estudanteId: perfilCognitivo.id,
            confiancaGeralDaIA: perfilCognitivo.confiancaDiagnostica,
            riscoCritico: this._avaliarRiscoGlobal(perfilCognitivo),
            habilidades: {}
        };

        // Processa o mapa de cada habilidade BNCC trabalhada
        for (const [bncc, hab] of Object.entries(perfilCognitivo.habilidades)) {
            relatorio.habilidades[bncc] = this._traduzirHabilidade(bncc, hab);
        }

        return relatorio;
    }

    /**
     * Traduz o estado computacional (ProfileEngine + BOA) para um idioma focado 
     * na intervenção humana do professor no mundo real.
     */
    static _traduzirHabilidade(bncc, hab) {
        const boa = hab.baseOrientadoraAtiva;
        const ev = hab.evidenciasConceituais;

        // Se a BOA ainda não foi instanciada (habilidade recém iniciada)
        if (!boa) {
            return {
                status: "COLETA_DE_DADOS",
                mensagemCurta: "A IA está mapeando a Zona de Desenvolvimento Proximal do estudante."
            };
        }

        return {
            status: "ANALISE_CONCLUIDA",
            
            // 1. O Diagnóstico Traduzido
            diagnostico: {
                focoConceitual: boa.focoConceitual.conceitoAlvo,
                estagioFormacao: this._formatarTextoAmigavel(ev.estagioConceitual),
                obstaculoIdentificado: this._traduzirObstaculo(boa.focoConceitual.obstaculoPrincipal),
                indiceTransferencia: `${Math.round(ev.indiceTransferenciaConceitual * 100)}%`
            },

            // 2. O que o LabTech (IA) está fazendo a respeito
            acaoDaIA: {
                faseMediacao: this._traduzirFaseGalperin(boa.estadoAtual.faseMediacao),
                objetivoAtual: this._traduzirObjetivo(boa.focoConceitual.objetivoAtual),
                estrategia: this._formatarTextoAmigavel(boa.planoDeMediacao.estrategia)
            },

            // 3. Recomendação para o Atendimento Humano (Transferência de Bastão)
            acaoSugeridaProfessor: this._gerarRecomendacaoDocente(boa, ev)
        };
    }

    // =========================================================
    // 🧠 DICIONÁRIOS DE TRADUÇÃO (XAI -> Humano)
    // =========================================================

    static _traduzirObstaculo(obstaculo) {
        const dicionario = {
            [OBSTACULOS_COGNITIVOS.PSEUDOCONCEITO]: "Mecanização de regra errada (Pseudoconceito)",
            [OBSTACULOS_COGNITIVOS.DEPENDENCIA_VISUAL]: "Dependência de representações visuais",
            [OBSTACULOS_COGNITIVOS.MECANIZACAO_IMPULSIVA]: "Impulsividade / Falta de leitura atenta",
            [OBSTACULOS_COGNITIVOS.FRICCAO_COGNITIVA_ALTA]: "Sobrecarga Cognitiva (Múltiplos erros)",
            [OBSTACULOS_COGNITIVOS.NENHUM]: "Nenhum obstáculo detectado"
        };
        return dicionario[obstaculo] || this._formatarTextoAmigavel(obstaculo);
    }

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
     * O ápice do sistema: O que a IA sugere que o Professor faça presencialmente.
     */
    static _gerarRecomendacaoDocente(boa, ev) {
        const obstaculo = boa.focoConceitual.obstaculoPrincipal;

        if (obstaculo === OBSTACULOS_COGNITIVOS.PSEUDOCONCEITO) {
            return `O aluno parece ter decorado uma regra falha para o conceito de ${boa.focoConceitual.conceitoAlvo}. Na próxima aula, peça para ele explicar COMO resolveu a questão, e não apenas o resultado.`;
        }
        
        if (obstaculo === OBSTACULOS_COGNITIVOS.DEPENDENCIA_VISUAL) {
            return `O aluno resolve os problemas quando há imagens, mas trava na versão textual. A IA está forçando a transferência. Acompanhe se ele consegue descrever o que seria desenhado.`;
        }

        if (obstaculo === OBSTACULOS_COGNITIVOS.FRICCAO_COGNITIVA_ALTA) {
            return `ALERTA: O aluno está errando repetidamente. A IA reduziu a dificuldade, mas pode ser necessária uma intervenção presencial para revisar a base de ${boa.focoConceitual.conceitoAlvo}.`;
        }

        if (ev.estagioConceitual === "GENERALIZACAO_CONSOLIDADA") {
            return `Excelente desempenho. O aluno já internalizou o conceito e consegue operá-lo de forma abstrata. Pronto para novos desafios.`;
        }

        return `O estudante está progredindo adequadamente na transição conceitual. A IA está alternando formatos para fortalecer o aprendizado. Nenhuma ação presencial imediata é necessária.`;
    }

    static _avaliarRiscoGlobal(perfil) {
        return perfil.indicePseudoconceito > 0.6 ? "ALTO" : "NORMAL";
    }

    static _formatarTextoAmigavel(textoStr) {
        if (!textoStr) return "Indefinido";
        return textoStr.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
    }
}
