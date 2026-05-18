/**
 * @fileoverview ProfileEngine.js
 * @description Motor de Inferência Cognitiva e Rastreamento de Deriva Semiótica.
 * AGORA COM MEMÓRIA DE LONGO PRAZO: Persistência ofuscada no Local Storage.
 * @version 6.0.0
 * @package LabTech Core Environment
 */

import { QuestionNormalizer } from './QuestionNormalizer.js';

export class ProfileEngine {
    constructor() {
        this._estadosEstudantes = new Map();

        this._CONFIG = Object.freeze({
            LIMIAR_LATENCIA_IMPULSIVA_MS: 3500,
            LIMIAR_FRICCION_ERRATICA: 5,
            MIN_ITENS_PARA_DIAGNOSTICO: 3
        });
    }

    // 🔒 ROTINAS DE PERSISTÊNCIA OFUSCADA (Anti-Cheating)
    _salvarLocal(estudanteId, perfil) {
        try {
            const jsonStr = JSON.stringify(perfil);
            const b64 = btoa(encodeURIComponent(jsonStr)); // Ofuscação Base64
            localStorage.setItem(`labtech_p_${estudanteId}`, b64);
        } catch (e) {
            console.warn("[ProfileEngine] Falha ao persistir dados na memória local:", e);
        }
    }

    _carregarLocal(estudanteId) {
        try {
            const b64 = localStorage.getItem(`labtech_p_${estudanteId}`);
            if (!b64) return null;
            const jsonStr = decodeURIComponent(atob(b64));
            return JSON.parse(jsonStr);
        } catch (e) {
            console.warn("[ProfileEngine] Storage corrompido ou adulterado. Iniciando perfil limpo.");
            return null;
        }
    }

    inicializarEstudante(estudanteId) {
        if (!estudanteId) throw new Error('ID inválido.');

        // 🧠 Tenta resgatar a memória do aluno antes de criar um novo
        const perfilSalvo = this._carregarLocal(estudanteId);
        if (perfilSalvo) {
            console.log(`[ADA] Memória recuperada para: ${estudanteId}`);
            this._estadosEstudantes.set(estudanteId, perfilSalvo);
            return JSON.parse(JSON.stringify(perfilSalvo));
        }

        const novoPerfil = {
            id: estudanteId,
            timestampCriacao: new Date().toISOString(),
            itensRespondidos: 0,
            perfilDominante: 'INDEFINIDO',
            derivaPedagogicaGeral: 0.0,
            metricasAcumuladas: { totalLatenciaConceptual: 0, totalFriccaoAjustes: 0, errosSequenciais: 0, taxaAcertoGeral: 0.0 },
            scoreMatrizesPerfeitas: { PROCEDURAL_MECANICO: 0.0, DEPENDENTE_CONCRETO: 0.0, IMPULSIVO_ARITMETICO: 0.0, CONCEITUAL_TEORICO: 0.0 },
            historicoEstagiosGalperin: { MATERIALIZADA: { acertos: 0, total: 0 }, ICONICA: { acertos: 0, total: 0 }, VERBAL_EXTERNA: { acertos: 0, total: 0 }, INTERNA_PURA: { acertos: 0, total: 0 } },
            mapaEtiologiaErros: { VIES_ARITMETICO: 0, ETIQUETA_ESTATICA: 0, INVERSAO_TOPOLOGICA: 0, DOMINIO_PROCEDURAL: 0, AUSENCIA_GENERALIZACAO: 0, IMPULSIVIDADE_CONCRETE: 0, ERRO_GENERICO: 0 }
        };

        this._estadosEstudantes.set(estudanteId, novoPerfil);
        this._salvarLocal(estudanteId, novoPerfil); // Grava a criação no HD
        return JSON.parse(JSON.stringify(novoPerfil));
    }

    processarEventoTelemetria(estudanteId, dadosTelemetria, metadadosSensor) {
        const normalizador = new QuestionNormalizer();
        try { normalizador.normalize(metadadosSensor); } 
        catch (erro) { throw new Error(`Governança violada: ${erro.message}`); }

        if (!this._estadosEstudantes.has(estudanteId)) {
            this.inicializarEstudante(estudanteId);
        }

        const perfil = this._estadosEstudantes.get(estudanteId);
        perfil.itensRespondidos++;

        const { latenciaMs, totalAjustesPreConfirmacao, alternativaSelecionadaId } = dadosTelemetria;
        const alternativaAlvo = metadadosSensor.alternativas.find(alt => alt.id_alternativa === alternativaSelecionadaId || alt.id === alternativaSelecionadaId);
        const ehCorreto = alternativaAlvo ? (alternativaAlvo.tipo === 'acerto') : false;
        const etiologiaErro = alternativaAlvo ? (alternativaAlvo.categoria || 'ERRO_GENERICO').toUpperCase() : 'ERRO_GENERICO';
        const estagioAtual = (metadadosSensor.estagioGalperin || 'INTERNA_PURA').toUpperCase();

        if (perfil.historicoEstagiosGalperin[estagioAtual]) {
            perfil.historicoEstagiosGalperin[estagioAtual].total++;
            if (ehCorreto) perfil.historicoEstagiosGalperin[estagioAtual].acertos++;
        }

        perfil.metricasAcumuladas.totalLatenciaConceptual += latenciaMs || 0;
        perfil.metricasAcumuladas.totalFriccaoAjustes += totalAjustesPreConfirmacao || 0;
        
        if (ehCorreto) {
            perfil.metricasAcumuladas.errosSequenciais = 0;
        } else {
            perfil.metricasAcumuladas.errosSequenciais++;
            perfil.mapaEtiologiaErros[etiologiaErro] = (perfil.mapaEtiologiaErros[etiologiaErro] || 0) + 1;
        }

        this._computarPesosPerfis(perfil, latenciaMs, totalAjustesPreConfirmacao, ehCorreto, etiologiaErro, estagioAtual);
        this._estabilizarPerfilDominante(perfil);

        this._estadosEstudantes.set(estudanteId, perfil);
        
        // 💾 SALVA A FOTOGRAFIA DA MENTE DO ALUNO A CADA CLIQUE
        this._salvarLocal(estudanteId, perfil);

        return {
            estudanteId: perfil.id,
            perfilDominante: perfil.perfilDominante,
            derivaPedagogicaGeral: perfil.derivaPedagogicaGeral,
            sugestaoAcaoADA: this._gerarDiretrizIntervencaoADA(perfil, metadadosSensor),
            timestampProcessamento: new Date().toISOString()
        };
    }

    _computarPesosPerfis(perfil, latencia, ajustes, ehCorreto, etiologia, estagio) {
        const C = this._CONFIG;
        if (latencia < C.LIMIAR_LATENCIA_IMPULSIVA_MS && !ehCorreto) perfil.scoreMatrizesPerfeitas.IMPULSIVO_ARITMETICO += 0.35;
        if (estagio === 'INTERNA_PURA' && ehCorreto) perfil.scoreMatrizesPerfeitas.PROCEDURAL_MECANICO += 0.15;
        if ((estagio === 'ICONICA' || estagio === 'VERBAL_EXTERNA') && !ehCorreto) perfil.scoreMatrizesPerfeitas.PROCEDURAL_MECANICO += 0.20;
        if ((estagio === 'MATERIALIZADA' || estagio === 'ICONICA') && ehCorreto) perfil.scoreMatrizesPerfeitas.DEPENDENTE_CONCRETO += 0.10;
        if (estagio === 'INTERNA_PURA' && !ehCorreto) perfil.scoreMatrizesPerfeitas.DEPENDENTE_CONCRETO += 0.25;
        if (ehCorreto && latencia >= C.LIMIAR_LATENCIA_IMPULSIVA_MS) perfil.scoreMatrizesPerfeitas.CONCEITUAL_TEORICO += 0.20;

        Object.keys(perfil.scoreMatrizesPerfeitas).forEach(key => {
            perfil.scoreMatrizesPerfeitas[key] = Math.min(Math.max(perfil.scoreMatrizesPerfeitas[key], 0), 10);
        });
    }

    _estabilizarPerfilDominante(perfil) {
        if (perfil.itensRespondidos < this._CONFIG.MIN_ITENS_PARA_DIAGNOSTICO) {
            perfil.perfilDominante = 'INDEFINIDO_EM_COLETA';
            return;
        }
        const scores = perfil.scoreMatrizesPerfeitas;
        let maior = -1, vencedor = 'CONCEITUAL_TEORICO';
        Object.keys(scores).forEach(k => { if (scores[k] > maior) { maior = scores[k]; vencedor = k; } });
        perfil.perfilDominante = vencedor;
        perfil.derivaPedagogicaGeral = parseFloat((Math.sqrt((scores.PROCEDURAL_MECANICO ** 2) + (scores.DEPENDENTE_CONCRETO ** 2) + (scores.IMPULSIVO_ARITMETICO ** 2)) / 17.32).toFixed(2));
    }

    _gerarDiretrizIntervencaoADA(perfil, sensor) {
        const d = { comandoMacro: 'PADRAO', scaffoldAlvo: 'NENHUM' };
        if (perfil.perfilDominante === 'IMPULSIVO_ARITMETICO') { d.comandoMacro = 'INJECT_RHYTHMIC_LOCK'; d.scaffoldAlvo = 'VERBALIZATION_PROMPT'; }
        else if (perfil.perfilDominante === 'PROCEDURAL_MECANICO') { d.comandoMacro = 'FORCE_SEMIOTIC_TRANSITION'; d.scaffoldAlvo = 'CONCRETE_SCHEMATIZATION'; }
        else if (perfil.perfilDominante === 'DEPENDENTE_CONCRETO') { d.comandoMacro = 'TRIGGER_CONTROLLED_FADING'; d.scaffoldAlvo = 'ORIENTATION_CARD'; }
        if (perfil.metricasAcumuladas.errosSequenciais >= 2) d.comandoMacro = 'RETROCEDER_ESTAGIO';
        return d;
    }
}
