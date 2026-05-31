/**
 * @fileoverview BaseOrientadoraAtiva.js
 * @description Estrutura de Mediação Baseada em Galperin (BOA v1.2).
 * Modela a fase da mediação (o que a ADA deve oferecer) e não o status passivo do aluno.
 * EVOLUÇÃO 11.2.0: Consumo total de Contratos Pedagógicos (Objetivos e Estratégias).
 * @package LabTech Core Environment
 */

import { 
    FASES_GALPERIN, 
    REPRESENTACOES_SEMIOTICAS, 
    OBSTACULOS_COGNITIVOS,
    OBJETIVOS_PEDAGOGICOS,
    ESTRATEGIAS_MEDIACAO
} from './ContratosPedagogicos.js';

export class BaseOrientadoraAtiva {
    
    static criarNova(conceitoAlvo = "INDEFINIDO", invarianteAlvo = "INDEFINIDO") {
        return {
            versao: "BOA_v1.2",
            
            estadoAtual: {
                faseMediacao: FASES_GALPERIN.MATERIALIZADA, 
                estagioConceitual: "EVIDENCIA_INSUFICIENTE",
                perfilOperacional: "INDEFINIDO",
                itc: 0.0,
                estabilidade: 0.0
            },
            
            focoConceitual: {
                conceitoAlvo: conceitoAlvo,
                invarianteAlvo: invarianteAlvo,
                obstaculoPrincipal: OBSTACULOS_COGNITIVOS.NENHUM,
                objetivoAtual: OBJETIVOS_PEDAGOGICOS.DIAGNOSTICO_INICIAL
            },
            
            planoDeMediacao: {
                estrategia: ESTRATEGIAS_MEDIACAO.EXPLORATORIA,
                representacaoPreferencial: REPRESENTACOES_SEMIOTICAS.VISUAL,
                tipoIntervencao: "DIAGNOSTICO",
                proximaAcao: "PADRAO",
                mensagemMetacognitiva: "Observe as características principais."
            },
            
            // 🧠 Hipóteses para v2 (Inferência Bayesiana)
            hipotesesPedagogicas: [
                /* Exemplo futuro:
                { hipotese: OBSTACULOS_COGNITIVOS.PSEUDOCONCEITO, confianca: 0.83 },
                { hipotese: OBSTACULOS_COGNITIVOS.DEPENDENCIA_VISUAL, confianca: 0.62 }
                */
            ], 
            
            historico: {
                criadoEm: new Date().toISOString(),
                ultimaAtualizacao: new Date().toISOString(),
                intervencoesAplicadas: 0,
                transferenciasObservadas: 0
            }
        };
    }

    static atualizarBase(boa, perfil, hab) {
        boa.historico.ultimaAtualizacao = new Date().toISOString();
        
        boa.estadoAtual.estagioConceitual = hab.evidenciasConceituais.estagioConceitual;
        boa.estadoAtual.perfilOperacional = hab.perfilDominante;
        boa.estadoAtual.itc = hab.evidenciasConceituais.indiceTransferenciaConceitual;
        boa.estadoAtual.estabilidade = hab.evidenciasConceituais.indiceEstabilidadeConceitual;

        this._identificarObstaculo(boa, perfil, hab);
        this._mapearEstrategiaMediacao(boa);

        return boa;
    }

    static _identificarObstaculo(boa, perfil, hab) {
        if (perfil.indicePseudoconceito > 0.6 || boa.estadoAtual.estagioConceitual === "PSEUDOCONCEITO_ESTAVEL") {
            boa.focoConceitual.obstaculoPrincipal = OBSTACULOS_COGNITIVOS.PSEUDOCONCEITO;
        } else if (hab.evidenciasConceituais.indiceDependenciaVisual > 0.4) {
            boa.focoConceitual.obstaculoPrincipal = OBSTACULOS_COGNITIVOS.DEPENDENCIA_VISUAL;
        } else if (hab.perfilDominante === "IMPULSIVO_ARITMETICO") {
            boa.focoConceitual.obstaculoPrincipal = OBSTACULOS_COGNITIVOS.MECANIZACAO_IMPULSIVA;
        } else if (hab.errosSequenciais >= 2) {
            boa.focoConceitual.obstaculoPrincipal = OBSTACULOS_COGNITIVOS.FRICCAO_COGNITIVA_ALTA;
        } else {
            boa.focoConceitual.obstaculoPrincipal = OBSTACULOS_COGNITIVOS.NENHUM;
        }
    }

    static _mapearEstrategiaMediacao(boa) {
        const obstaculo = boa.focoConceitual.obstaculoPrincipal;

        switch (obstaculo) {
            case OBSTACULOS_COGNITIVOS.DEPENDENCIA_VISUAL:
                boa.estadoAtual.faseMediacao = FASES_GALPERIN.VERBAL_EXTERNA;
                boa.focoConceitual.objetivoAtual = OBJETIVOS_PEDAGOGICOS.REDUZIR_DEPENDENCIA_VISUAL;
                boa.planoDeMediacao.estrategia = ESTRATEGIAS_MEDIACAO.TRANSFERENCIA_SEMIOTICA;
                boa.planoDeMediacao.proximaAcao = "FORCE_SEMIOTIC_TRANSITION";
                boa.planoDeMediacao.representacaoPreferencial = REPRESENTACOES_SEMIOTICAS.ABSTRATA;
                boa.planoDeMediacao.mensagemMetacognitiva = "O que permanece igual quando a imagem muda?";
                break;
                
            case OBSTACULOS_COGNITIVOS.PSEUDOCONCEITO:
                boa.estadoAtual.faseMediacao = FASES_GALPERIN.MATERIALIZADA_VISUAL;
                boa.focoConceitual.objetivoAtual = OBJETIVOS_PEDAGOGICOS.QUEBRA_DE_MECANIZACAO;
                boa.planoDeMediacao.estrategia = ESTRATEGIAS_MEDIACAO.CONFLITO_COGNITIVO;
                boa.planoDeMediacao.proximaAcao = "TRIGGER_CONCEPTUAL_RESET";
                boa.planoDeMediacao.representacaoPreferencial = REPRESENTACOES_SEMIOTICAS.VISUAL_ATIPICA;
                boa.planoDeMediacao.mensagemMetacognitiva = "Será que essa regra funciona em todos os casos? Vamos testar.";
                break;

            case OBSTACULOS_COGNITIVOS.MECANIZACAO_IMPULSIVA:
                boa.estadoAtual.faseMediacao = FASES_GALPERIN.VERBAL_INTERNA;
                boa.focoConceitual.objetivoAtual = OBJETIVOS_PEDAGOGICOS.INIBICAO_ARITMETICA;
                boa.planoDeMediacao.estrategia = ESTRATEGIAS_MEDIACAO.DESACELERACAO_COGNITIVA;
                boa.planoDeMediacao.proximaAcao = "INJECT_RHYTHMIC_LOCK";
                boa.planoDeMediacao.representacaoPreferencial = REPRESENTACOES_SEMIOTICAS.TEXTUAL;
                boa.planoDeMediacao.mensagemMetacognitiva = "Leia o problema em voz alta antes de calcular.";
                break;
                
            case OBSTACULOS_COGNITIVOS.FRICCAO_COGNITIVA_ALTA:
                boa.estadoAtual.faseMediacao = FASES_GALPERIN.MATERIALIZADA;
                boa.focoConceitual.objetivoAtual = OBJETIVOS_PEDAGOGICOS.RECONSTRUCAO_ESTRUTURAL;
                boa.planoDeMediacao.estrategia = ESTRATEGIAS_MEDIACAO.REDUCAO_DE_CARGA_COGNITIVA;
                boa.planoDeMediacao.proximaAcao = "REDUCE_COGNITIVE_LOAD";
                boa.planoDeMediacao.representacaoPreferencial = REPRESENTACOES_SEMIOTICAS.CONCRETA;
                boa.planoDeMediacao.mensagemMetacognitiva = "Vamos voltar um passo e observar as partes que formam este problema.";
                break;
                
            default:
                boa.estadoAtual.faseMediacao = FASES_GALPERIN.MENTAL;
                boa.focoConceitual.objetivoAtual = OBJETIVOS_PEDAGOGICOS.AUTOMATIZACAO_CONSCIENTE;
                boa.planoDeMediacao.estrategia = ESTRATEGIAS_MEDIACAO.EXPOSICAO_VARIADA;
                boa.planoDeMediacao.proximaAcao = "PADRAO";
                boa.planoDeMediacao.representacaoPreferencial = REPRESENTACOES_SEMIOTICAS.QUALQUER;
                boa.planoDeMediacao.mensagemMetacognitiva = "Você dominou a essência! Tente resolver aplicando seu conhecimento em um novo contexto.";
        }
    }
}
