/**
 * @fileoverview ProfileEngine.js
 * @description Motor de Inferência Cognitiva, Classificação de Perfis e Rastreamento de Deriva Semiótica.
 * Analisa atômica e longitudinalmente a telemetria comportamental do estudante no ecossistema LabTech.
 * Identifica a etiologia do erro, distinguindo o domínio procedural mecânico de conceitos científicos reais.
 * * @version 5.0.0
 * @package LabTech Core Environment
 */

import { QuestionNormalizer } from './QuestionNormalizer.js';

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
                IMPULSIVIDADE_CONCRETE: 0,
                ERRO_GENERICO: 0
            }
        };

        this._estadosEstudantes.set(estudanteId, novoPerfil);
        return JSON.parse(JSON.stringify(novoPerfil));
    }

    /**
     * Processa um pacote atômico de telemetria de entrada e atualiza o grafo cognitivo do estudante
     * @param {string} estudanteId - Identificador único do aluno
     * @param {Object} dadosTelemetria - Métricas capturadas em tempo real na interface do jogo
     * @param {Object} metadadosSensor - Atributos pedagógicos do item (JSON da questão)
     * @returns {Object} Perfil cognitivo atualizado com decisões de intervenção recomendadas
     */
    processarEventoTelemetria(estudanteId, dadosTelemetria, metadadosSensor) {
        // 1. Auditoria de governança do sensor via Normalizer (Arquitetura V15)
        const normalizador = new QuestionNormalizer();
        try {
            normalizador.normalize(metadadosSensor);
        } catch (erro) {
            throw new Error(`[GOVERNANCE BREACH IN PROFILE] O sensor cognitivo violou os contratos pedagógicos: ${erro.message}`);
        }

        if (!this._estadosEstudantes.has(estudanteId)) {
            this.inicializarEstudante(estudanteId);
        }

        const perfil = this._estadosEstudantes.get(estudanteId);
        perfil.itensRespondidos++;

        // 2. Extração de Métricas Atômicas e Alinhamento com o JSON Higienizado
        const { latenciaMs, totalAjustesPreConfirmacao, alternativaSelecionadaId } = dadosTelemetria;
        
        // Match robusto para suportar id ou id_alternativa
        const alternativaAlvo = metadadosSensor.alternativas.find(
            alt => alt.id_alternativa === alternativaSelecionadaId || alt.id === alternativaSelecionadaId
        );

        if (!alternativaAlvo) {
            console.warn(`[DATA INCONSISTENCY] Alternativa [${alternativaSelecionadaId}] não mapeada. Aplicando fallback genérico.`);
        }

        // Sincronia com o padrão do QuestionNormalizer.js ('tipo' e 'categoria')
        const ehCorreto = alternativaAlvo ? (alternativaAlvo.tipo === 'acerto') : false;
        const etiologiaErro = alternativaAlvo ? (alternativaAlvo.categoria || 'ERRO_GENERICO').toUpperCase() : 'ERRO_GENERICO';

        // Estágio Galperin (fallback seguro caso a questão não possua a tag estrita)
        const estagioAtual = (metadadosSensor.estagioGalperin || 'INTERNA_PURA').toUpperCase();
        if (perfil.historicoEstagiosGalperin[estagioAtual]) {
            perfil.historicoEstagiosGalperin[estagioAtual].total++;
            if (ehCorreto) perfil.historicoEstagiosGalperin[estagioAtual].acertos++;
        }

        // 3. Atualização de Métricas de Fluxo e Erros
        perfil.metricasAcumuladas.totalLatenciaConceptual += latenciaMs || 0;
        perfil.metricasAcumuladas.totalFriccaoAjustes += totalAjustesPreConfirmacao || 0;
        
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
     * Aplica as equações diferenciais de peso na matriz de scores com base na natureza dos desvios
     * @private
     */
    _computarPesosPerfis(perfil, latencia, ajustes, ehCorreto, etiologia, estagio) {
        const C = this._CONFIG;

        // Comportamento Impulsivo
        if (latencia < C.LIMIAR_LATENCIA_IMPULSIVA_MS && !ehCorreto) {
            perfil.scoreMatrizesPerfeitas.IMPULSIVO_ARITMETICO += 0.35;
            if (etiologia.includes('ADITIVA') || etiologia.includes('VIES')) {
                perfil.scoreMatrizesPerfeitas.IMPULSIVO_ARITMETICO += 0.25;
            }
        }

        // Comportamento Procedural Mecânico
        if (estagio === 'INTERNA_PURA' && ehCorreto) {
            perfil.scoreMatrizesPerfeitas.PROCEDURAL_MECANICO += 0.15;
        }
        if ((estagio === 'ICONICA' || estagio === 'VERBAL_EXTERNA') && !ehCorreto) {
            perfil.scoreMatrizesPerfeitas.PROCEDURAL_MECANICO += 0.20;
        }

        // Comportamento Dependente Concreto
        if ((estagio === 'MATERIALIZADA' || estagio === 'ICONICA') && ehCorreto) {
            perfil.scoreMatrizesPerfeitas.DEPENDENTE_CONCRETO += 0.10;
        }
        if (estagio === 'INTERNA_PURA' && !ehCorreto) {
            perfil.scoreMatrizesPerfeitas.DEPENDENTE_CONCRETO += 0.25;
        }

        // Comportamento Conceitual Teórico Estável
        if (ehCorreto && latencia >= C.LIMIAR_LATENCIA_IMPULSIVA_MS) {
            perfil.scoreMatrizesPerfeitas.CONCEITUAL_TEORICO += 0.20;
        }

        // Bounding Box (0 a 10) para evitar estouro
        const chaves = Object.keys(perfil.scoreMatrizesPerfeitas);
        chaves.forEach(key => {
            perfil.scoreMatrizesPerfeitas[key] = Math.min(Math.max(perfil.scoreMatrizesPerfeitas[key], 0), 10);
        });
    }

    /**
     * Calcula o perfil dominante e a Deriva Pedagógica (Distância Euclidiana normalizada)
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

        const desvioMecanico = scores.PROCEDURAL_MECANICO;
        const desvioConcreto = scores.DEPENDENTE_CONCRETO;
        const desvioImpulsivo = scores.IMPULSIVO_ARITMETICO;
        
        perfil.derivaPedagogicaGeral = parseFloat(
            (Math.sqrt((desvioMecanico ** 2) + (desvioConcreto ** 2) + (desvioImpulsivo ** 2)) / 17.32).toFixed(2)
        );
    }

    /**
     * Gera diretrizes pedagógicas de reconfiguração de interface para governar a ADA
     * @private
     */
    _gerarDiretrizIntervencaoADA(perfil, sensor) {
        const diretriz = {
            comandoMacro: 'PADRAO',
            ajusteInterfaceUDL: 'PADRAO_MULTIMODAL',
            scaffoldAlvo: 'NENHUM',
            justificativaExplicavelAI: 'Estudante mantém estabilidade conceitual teórica.'
        };

        if (perfil.perfilDominante === 'IMPULSIVO_ARITMETICO') {
            diretriz.comandoMacro = 'INJECT_RHYTHMIC_LOCK';
            diretriz.scaffoldAlvo = 'GALPERIN_VERBALIZATION_PROMPT';
        } else if (perfil.perfilDominante === 'PROCEDURAL_MECANICO') {
            diretriz.comandoMacro = 'FORCE_SEMIOTIC_TRANSITION';
            diretriz.scaffoldAlvo = 'DAVYDOV_CONCRETE_SCHEMATIZATION';
        } else if (perfil.perfilDominante === 'DEPENDENTE_CONCRETO') {
            diretriz.comandoMacro = 'TRIGGER_CONTROLLED_FADING';
            diretriz.scaffoldAlvo = 'TALIZINA_ORIENTATION_CARD';
        }

        if (perfil.metricasAcumuladas.errosSequenciais >= 2) {
            diretriz.comandoMacro = 'RETROCEDER_ESTAGIO_DESENVOLVIMENTO';
        }

        return diretriz;
    }

    /**
     * Retorna o estado atualizado completo para auditoria externa
     * @param {string} estudanteId
     * @returns {Object|null}
     */
    obterEstadoSnapshot(estudanteId) {
        if (!this._estadosEstudantes.has(estudanteId)) return null;
        return JSON.parse(JSON.stringify(this._estadosEstudantes.get(estudanteId)));
    }
}
