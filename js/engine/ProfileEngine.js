/**
 * @fileoverview ProfileEngine.js
 * @description Motor de Inferência Cognitiva, Classificação de Perfis e Rastreamento de Deriva Semiótica.
 * Analisa atômica e longitudinalmente a telemetria comportamental do estudante no ecossistema LabTech.
 * Identifica a etiologia do erro, distinguindo o domínio procedural mecânico de conceitos científicos reais.
 * Opera sob os preceitos teóricos de Vigotski, Davýdov e Galperin.
 * 
 * @version 4.1.0
 * @package LabTech Core Environment
 */

import { GovernanceLayer } from './GovernanceLayer.js';

export class ProfileEngine {
    /**
     * Inicializa o motor de inferência de perfis cognitivos.
     */
    constructor() {
        /**
         * Repositório central de estados cognitivos imutáveis por estudante
         * @private
         * @type {Map<string, Object>}
         */
        this._estadosEstudantes = new Map();

        /**
         * Limiares paramétricos para as inferências algorítmicas do sistema
         * @private
         * @readonly
         */
        this._CONFIG = Object.freeze({
            LIMIAR_LATENCIA_IMPULSIVA_MS: 3500,
            LIMIAR_FRICCION_ERRATICA: 5,
            MIN_ITENS_PARA_DIAGNOSTICO: 3,
            PESO_LONGITUDINAL_NOVO: 0.4,
            PESO_LONGITUDINAL_HISTORICO: 0.6
        });
    }

    /**
     * Cria e registra a estrutura inicial de rastreamento de um novo estudante no sistema
     * @param {string} estudanteId - Identificador único global estável do aluno
     * @returns {Object} Instância inicial do perfil gerado
     */
    inicializarEstudante(estudanteId) {
        if (!estudanteId || typeof estudanteId !== 'string') {
            throw new Error('[PROFILE INITIALIZATION ERROR] Identificador do estudante inválido.');
        }

        const novoPerfil = {
            id: estudanteId,
            timestampCriacao: new Date().toISOString(),
            itensRespondidos: 0,
            perfilDominante: 'INDEFINIDO',
            derivaPedagogicaGeral: 0.0,
            metricasAcumuladas: {
                totalLatenciaConceptual: 0,
                totalFriccaoAjustes: 0,
                errosSequenciais: 0,
                taxaAcertoGeral: 0.0
            },
            scoreMatrizesPerfeitas: {
                PROCEDURAL_MECANICO: 0.0,
                DEPENDENTE_CONCRETO: 0.0,
                IMPULSIVO_ARITMETICO: 0.0,
                CONCEITUAL_TEORICO: 0.0
            },
            historicoEstagiosGalperin: {
                MATERIALIZADA: { acertos: 0, total: 0 },
                ICONICA: { acertos: 0, total: 0 },
                VERBAL_EXTERNA: { acertos: 0, total: 0 },
                INTERNA_PURA: { acertos: 0, total: 0 }
            },
            mapaEtiologiaErros: {
                VIES_ARITMETICO: 0,
                ETIQUETA_ESTATICA: 0,
                INVERSAO_TOPOLOGICA: 0,
                DOMINIO_PROCEDURAL: 0,
                AUSENCIA_GENERALIZACAO: 0,
                IMPULSIVIDADE_CONCRETE: 0
            }
        };

        this._estadosEstudantes.set(estudanteId, novoPerfil);
        return JSON.parse(JSON.stringify(novoPerfil));
    }

    /**
     * Processa um pacote atômico de telemetria de entrada e atualiza o grafo cognitivo do estudante
     * @param {string} estudanteId - Identificador único do aluno
     * @param {Object} dadosTelemetria - Métricas capturadas em tempo real na interface do jogo
     * @param {Object} metadadosSensor - Atributos pedagógicos do item validados pela governança
     * @returns {Object} Perfil cognitivo atualizado com decisões de intervenção recomendadas
     */
    processarEventoTelemetria(estudanteId, dadosTelemetria, metadadosSensor) {
        // Auditoria de governança do sensor de entrada antes de computar inferências
        const auditoriaSensor = GovernanceLayer.validarSensor(metadadosSensor);
        if (!auditoriaSensor.valido) {
            throw new Error(`[GOVERNANCE BREACH IN PROFILE] O sensor cognitivo ID ${metadadosSensor?.id} violou os contratos pedagógicos.`);
        }

        if (!this._estadosEstudantes.has(estudanteId)) {
            this.inicializarEstudante(estudanteId);
        }

        const perfil = this._estadosEstudantes.get(estudanteId);
        perfil.itensRespondidos++;

        // 1. Extração de Métricas Atômicas da Telemetria
        const { latenciaMs, totalAjustesPreConfirmacao, alternativaSelecionadaId } = dadosTelemetria;
        const alternativaAlvo = metadadosSensor.alternativas.find(alt => alt.id === alternativaSelecionadaId);

        if (!alternativaAlvo) {
            throw new Error(`[DATA INCONSISTENCY] Alternativa selecionada [${alternativaSelecionadaId}] não localizada no sensor.`);
        }

        const ehCorreto = alternativaAlvo.etiologia.toUpperCase() === 'CORRETO';
        const etiologiaErro = alternativaAlvo.etiologia.toUpperCase();

        // 2. Atualização de Histórico de Desempenho por Estágios de Galperin
        const estagioAtual = metadadosSensor.estagioGalperin.toUpperCase();
        if (perfil.historicoEstagiosGalperin[estagioAtual]) {
            perfil.historicoEstagiosGalperin[estagioAtual].total++;
            if (ehCorreto) perfil.historicoEstagiosGalperin[estagioAtual].acertos++;
        }

        // 3. Atualização de Métricas de Fluxo e Erros
        perfil.metricasAcumuladas.totalLatenciaConceptual += latenciaMs;
        perfil.metricasAcumuladas.totalFriccaoAjustes += totalAjustesPreConfirmacao;
        
        if (ehCorreto) {
            perfil.metricasAcumuladas.errosSequenciais = 0;
        } else {
            perfil.metricasAcumuladas.errosSequenciais++;
            perfil.mapaEtiologiaErros[etiologiaErro] = (perfil.mapaEtiologiaErros[etiologiaErro] || 0) + 1;
        }

        // 4. Execução dos Algoritmos de Inferência de Scores de Perfis
        this._computarPesosPerfis(perfil, latenciaMs, totalAjustesPreConfirmacao, ehCorreto, etiologiaErro, estagioAtual);

        // 5. Determinação Estatística do Perfil Dominante e Deriva Semiótica
        this._estabilizarPerfilDominante(perfil);

        // Salva o estado imutável atualizado no repositório privado
        this._estadosEstudantes.set(estudanteId, perfil);

        return {
            estudanteId: perfil.id,
            perfilDominante: perfil.perfilDominante,
            derivaPedagogicaGeral: perfil.derivaPedagogicaGeral,
            sugestaoAcaoADA: this._gerarDiretrizIntervencaoADA(perfil, metadadosSensor),
            timestampProcessamento: new Date().toISOString()
        };
    }

    /**
     * Aplica as equações diferenciais de peso na matriz de scores com base na natureza dos desvios capturados
     * @private
     */
    _computarPesosPerfis(perfil, latencia, ajustes, ehCorreto, etiologia, estagio) {
        const C = this._CONFIG;

        // Comportamento do Perfil Impulsivo com Viés Aritmético
        if (latencia < C.LIMIAR_LATENCIA_IMPULSIVA_MS && !ehCorreto) {
            perfil.scoreMatrizesPerfeitas.IMPULSIVO_ARITMETICO += 0.35;
            if (etiologia === 'VIES_ARITMETICO') {
                perfil.scoreMatrizesPerfeitas.IMPULSIVO_ARITMETICO += 0.25;
            }
        }

        // Comportamento do Perfil Procedural Mecânico
        // Acerta muito nos estágios puros de abstração sintática interna, mas colapsa na leitura icônica ou verbal
        if (estagio === 'INTERNA_PURA' && ehCorreto) {
            perfil.scoreMatrizesPerfeitas.PROCEDURAL_MECANICO += 0.15;
        }
        if ((estagio === 'ICONICA' || estagio === 'VERBAL_EXTERNA') && !ehCorreto && (etiologia === 'ETIQUETA_ESTATICA' || etiologia === 'DOMINIO_PROCEDURAL')) {
            perfil.scoreMatrizesPerfeitas.PROCEDURAL_MECANICO += 0.30;
        }

        // Comportamento do Perfil Dependente Concreto
        // Performance perfeita em ambientes materializados e visuais, falha crítica na remoção do suporte técnico
        if ((estagio === 'MATERIALIZADA' || estagio === 'ICONICA') && ehCorreto) {
            perfil.scoreMatrizesPerfeitas.DEPENDENTE_CONCRETO += 0.10;
        }
        if (estagio === 'INTERNA_PURA' && !ehCorreto && (etiologia === 'IMPULSIVIDADE_CONCRETE' || etiologia === 'AUSENCIA_GENERALIZACAO')) {
            perfil.scoreMatrizesPerfeitas.DEPENDENTE_CONCRETO += 0.35;
        }

        // Comportamento Conceitual Teórico Estável (Alvo do Desenvolvimento Histórico-Cultural)
        if (ehCorreto && latencia >= C.LIMIAR_LATENCIA_IMPULSIVA_MS && ajustes <= C.LIMIAR_FRICCION_ERRATICA) {
            perfil.scoreMatrizesPerfeitas.CONCEITUAL_TEORICO += 0.20;
        }

        // Normalização matemática simples para evitar estouro de ponto flutuante (Matriz de Atração bounded [0..10])
        const chaves = Object.keys(perfil.scoreMatrizesPerfeitas);
        chaves.forEach(key => {
            perfil.scoreMatrizesPerfeitas[key] = Math.min(Math.max(perfil.scoreMatrizesPerfeitas[key], 0), 10);
        });
    }

    /**
     * Calcula e estabiliza estatisticamente o perfil dominante do estudante e o nível de desvio conceitual
     * @private
     */
    _estabilizarPerfilDominante(perfil) {
        if (perfil.itensRespondidos < this._CONFIG.MIN_ITENS_PARA_DIAGNOSTICO) {
            perfil.perfilDominante = 'INDEFINIDO_EM_COLETA';
            return;
        }

        const scores = perfil.scoreMatrizesPerfeitas;
        let maiorScore = -1;
        let perfilVencedor = 'CONCEITUAL_TEORICO';

        Object.keys(scores).forEach(perfilChave => {
            if (scores[perfilChave] > maiorScore) {
                maiorScore = scores[perfilChave];
                perfilVencedor = perfilChave;
            }
        });

        perfil.perfilDominante = perfilVencedor;

        // Cálculo da Deriva Pedagógica (Distância Euclidiana normalizada em relação ao perfil teórico ideal)
        const desvioMecanico = scores.PROCEDURAL_MECANICO;
        const desvioConcreto = scores.DEPENDENTE_CONCRETO;
        const desvioImpulsivo = scores.IMPULSIVO_ARITMETICO;
        
        perfil.derivaPedagogicaGeral = parseFloat(
            (Math.sqrt((desvioMecanico ** 2) + (desvioConcreto ** 2) + (desvioImpulsivo ** 2)) / 17.32).toFixed(2)
        );
    }

    /**
     * Gera diretrizes pedagógicas de reconfiguração de interface para governar as ações da ADA na ZDP
     * @private
     */
    _gerarDiretrizIntervencaoADA(perfil, sensor) {
        const diretriz = {
            comandoMacro: 'MANTER_FLUXO_CURRICULAR',
            ajusteInterfaceUDL: 'PADRAO_MULTIMODAL',
            scaffoldAlvo: 'NENHUM',
            justificativaExplicavelAI: 'Estudante mantém estabilidade conceitual teórica no bloco avaliado.'
        };

        if (perfil.perfilDominante === 'IMPULSIVO_ARITMETICO') {
            diretriz.comandoMacro = 'INJECT_RHYTHMIC_LOCK';
            diretriz.ajusteInterfaceUDL = 'SUPRESS_IMMEDIATE_INPUTS';
            diretriz.scaffoldAlvo = 'GALPERIN_VERBALIZATION_PROMPT';
            diretriz.justificativaExplicavelAI = 'Alta taxa de erros em baixa latência com viés aritmético. Necessário quebrar automatismo cego.';
        } else if (perfil.perfilDominante === 'PROCEDURAL_MECANICO') {
            diretriz.comandoMacro = 'FORCE_SEMIOTIC_TRANSITION';
            diretriz.ajusteInterfaceUDL = 'GENERATE_VISUAL_REPRESENTATION';
            diretriz.scaffoldAlvo = 'DAVYDOV_CONCRETE_SCHEMATIZATION';
            diretriz.justificativaExplicavelAI = 'Estudante opera a álgebra abstrata de forma puramente mecânica sem correspondência gráfica. Forçando transição semiótica.';
        } else if (perfil.perfilDominante === 'DEPENDENTE_CONCRETO') {
            diretriz.comandoMacro = 'TRIGGER_CONTROLLED_FADING';
            diretriz.ajusteInterfaceUDL = 'REDUCE_VISUAL_DENSITY_GRADUALLY';
            diretriz.scaffoldAlvo = 'TALIZINA_ORIENTATION_CARD';
            diretriz.justificativaExplicavelAI = 'Demonstra paralisia com a retirada dos suportes materiais visuais. Iniciando desvanecimento de andaimes cognitivos.';
        }

        if (perfil.metricasAcumuladas.errosSequenciais >= 2) {
            diretriz.comandoMacro = 'RETROCEDER_ESTAGIO_DESENVOLVIMENTO';
            diretriz.scaffoldAlvo = 'SCAFFOLD_ZDP_DIRETO';
        }

        return diretriz;
    }

    /**
     * Retorna o estado atualizado completo de um aluno específico do repositório para fins de auditoria externa
     * @param {string} estudanteId - Identificador único do aluno
     * @returns {Object|null} Cópia profunda do perfil ou nulo se não localizado
     */
    obterEstadoSnapshot(estudanteId) {
        if (!this._estadosEstudantes.has(estudanteId)) return null;
        return JSON.parse(JSON.stringify(this._estadosEstudantes.get(estudanteId)));
    }
}
