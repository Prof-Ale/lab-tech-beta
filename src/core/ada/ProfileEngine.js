/**
 * @fileoverview ProfileEngine.js
 * @description Motor de Inferência Cognitiva e Rastreamento de Deriva Semiótica.
 * AGORA COM: SISTEMA DE CONFIANÇA INFERENCIAL (Certeza Estatística da IA).
 * @version 9.0.0
 * @package LabTech Core Environment
 */

import { QuestionNormalizer } from './QuestionNormalizer.js';

export class ProfileEngine {
    constructor() {
        this._estadosEstudantes = new Map();

        this._CONFIG = Object.freeze({
            LIMIAR_LATENCIA_IMPULSIVA_MS: 3500,
            LIMIAR_FRICCION_ERRATICA: 5,
            MIN_ITENS_PARA_DIAGNOSTICO: 3,
            ITENS_IDEAIS_CONFIANCA: 25 // Ponto de saturação da curva de volume
        });
    }

    // 🔒 ROTINAS DE PERSISTÊNCIA OFUSCADA
    _salvarLocal(estudanteId, perfil) {
        try {
            const jsonStr = JSON.stringify(perfil);
            const b64 = btoa(encodeURIComponent(jsonStr)); 
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

        const perfilSalvo = this._carregarLocal(estudanteId);
        if (perfilSalvo) {
            console.log(`[ADA] Memória recuperada para: ${estudanteId}`);
            
            // 🛠️ MIGRATION PATCH V4: Injeta a Confiança Inferencial
            if (perfilSalvo.confiancaDiagnostica === undefined) {
                perfilSalvo.estadoADA = perfilSalvo.estadoADA || { acertosRapidosCombo: 0, emboscadaArmada: false };
                perfilSalvo.indicePseudoconceito = perfilSalvo.indicePseudoconceito || 0.0;
                perfilSalvo.mapaEtiologiaErros = perfilSalvo.mapaEtiologiaErros || {};
                perfilSalvo.matrizTransferencia = perfilSalvo.matrizTransferencia || { procedural: { acertos: 0, total: 0 }, transferencia: { acertos: 0, total: 0 }, generalizacao: { acertos: 0, total: 0 } };
                perfilSalvo.estabilidadeConceitual = perfilSalvo.estabilidadeConceitual || 'INDEFINIDA';
                perfilSalvo.dependenciaScaffold = perfilSalvo.dependenciaScaffold || false;
                perfilSalvo.historicoLongitudinal = perfilSalvo.historicoLongitudinal || [];
                
                // NOVO: Grau de Certeza da IA
                perfilSalvo.confiancaDiagnostica = 0.0;
                
                console.log(`[ADA] 🔄 Mente veterana atualizada com Sistema de Confiança Inferencial.`);
            }

            this._estadosEstudantes.set(estudanteId, perfilSalvo);
            return JSON.parse(JSON.stringify(perfilSalvo));
        }

        const novoPerfil = {
            id: estudanteId,
            timestampCriacao: new Date().toISOString(),
            itensRespondidos: 0,
            perfilDominante: 'INDEFINIDO',
            derivaPedagogicaGeral: 0.0,
            
            indicePseudoconceito: 0.0, 
            estadoADA: { acertosRapidosCombo: 0, emboscadaArmada: false },

            // 🔬 Laboratório Longitudinal & Confiança
            confiancaDiagnostica: 0.0,
            matrizTransferencia: { procedural: { acertos: 0, total: 0 }, transferencia: { acertos: 0, total: 0 }, generalizacao: { acertos: 0, total: 0 } },
            estabilidadeConceitual: 'INDEFINIDA',
            dependenciaScaffold: false,
            historicoLongitudinal: [],

            metricasAcumuladas: { totalLatenciaConceptual: 0, totalFriccaoAjustes: 0, errosSequenciais: 0, taxaAcertoGeral: 0.0 },
            scoreMatrizesPerfeitas: { PROCEDURAL_MECANICO: 0.0, DEPENDENTE_CONCRETO: 0.0, IMPULSIVO_ARITMETICO: 0.0, CONCEITUAL_TEORICO: 0.0 },
            historicoEstagiosGalperin: { MATERIALIZADA: { acertos: 0, total: 0 }, ICONICA: { acertos: 0, total: 0 }, VERBAL_EXTERNA: { acertos: 0, total: 0 }, INTERNA_PURA: { acertos: 0, total: 0 } },
            mapaEtiologiaErros: { VIES_ARITMETICO: 0, ETIQUETA_ESTATICA: 0, INVERSAO_TOPOLOGICA: 0, DOMINIO_PROCEDURAL: 0, AUSENCIA_GENERALIZACAO: 0, IMPULSIVIDADE_CONCRETE: 0, ERRO_GENERICO: 0, PSEUDOCONCEITO_EXPOSTO: 0 }
        };

        this._estadosEstudantes.set(estudanteId, novoPerfil);
        this._salvarLocal(estudanteId, novoPerfil); 
        return JSON.parse(JSON.stringify(novoPerfil));
    }
    
    // 🕒 GRAVAÇÃO DO SNAPSHOT LONGITUDINAL
    _registrarSnapshotTemporal(perfil) {
        if (perfil.itensRespondidos % 10 === 0 && perfil.itensRespondidos > 0) {
            const snapshot = {
                marcoTemporal: `Sessão ${Math.floor(perfil.itensRespondidos / 10)}`,
                data: new Date().toISOString(),
                perfilDominante: perfil.perfilDominante,
                estabilidadeConceitual: perfil.estabilidadeConceitual,
                dependenciaScaffold: perfil.dependenciaScaffold,
                riscoPseudoconceito: perfil.indicePseudoconceito.toFixed(2),
                confiancaIA: perfil.confiancaDiagnostica, // 🚨 Registra a certeza na linha do tempo
                taxaTransferencia: perfil.matrizTransferencia.transferencia.total > 0 ? (perfil.matrizTransferencia.transferencia.acertos / perfil.matrizTransferencia.transferencia.total).toFixed(2) : 0
            };
            perfil.historicoLongitudinal.push(snapshot);
            console.log(`[ADA 🔬] Snapshot Gravado (Confiança: ${snapshot.confiancaIA}%)`);
        }
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
        
        let etiologiaErro = alternativaAlvo ? (alternativaAlvo.misconception || 'ERRO_GENERICO').toUpperCase() : 'ERRO_GENERICO';
        const estagioAtual = (metadadosSensor.estagioGalperin || 'INTERNA_PURA').toUpperCase();
        const representacaoAtual = (metadadosSensor.representacao || 'visual').toLowerCase();

        // 🧠 EMBOSCADA PEDAGÓGICA (PSEUDOCONCEITO)
        if (perfil.estadoADA.emboscadaArmada) {
            if (!ehCorreto || latenciaMs > 12000) {
                console.warn(`🚨 [XAI] Pseudoconceito Detectado em ${perfil.id}!`);
                perfil.indicePseudoconceito = Math.min(1.0, perfil.indicePseudoconceito + 0.3);
                etiologiaErro = 'PSEUDOCONCEITO_EXPOSTO';
            } else {
                perfil.indicePseudoconceito = Math.max(0.0, perfil.indicePseudoconceito - 0.2);
            }
            perfil.estadoADA.emboscadaArmada = false;
            perfil.estadoADA.acertosRapidosCombo = 0;
        } else {
            if (ehCorreto && latenciaMs < 7000) {
                perfil.estadoADA.acertosRapidosCombo++;
                if (perfil.estadoADA.acertosRapidosCombo >= 3) {
                    perfil.estadoADA.emboscadaArmada = true;
                }
            } else if (!ehCorreto) {
                perfil.estadoADA.acertosRapidosCombo = 0;
            }
        }

        // 📊 MATRIZ DE TRANSFERÊNCIA
        if (estagioAtual === 'MATERIALIZADA' || representacaoAtual === 'visual' || representacaoAtual === 'concreta') {
            perfil.matrizTransferencia.procedural.total++;
            if (ehCorreto) perfil.matrizTransferencia.procedural.acertos++;
        } else if (estagioAtual === 'VERBAL_EXTERNA') {
            perfil.matrizTransferencia.transferencia.total++;
            if (ehCorreto) perfil.matrizTransferencia.transferencia.acertos++;
        } else if (estagioAtual === 'INTERNA_PURA' || representacaoAtual === 'simbolica' || representacaoAtual === 'abstrato') {
            perfil.matrizTransferencia.generalizacao.total++;
            if (ehCorreto) perfil.matrizTransferencia.generalizacao.acertos++;
        }

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
        this._avaliarEstabilidadeEScaffold(perfil); 
        this._calcularConfiancaInferencial(perfil); // 📊 Roda o Motor de Certeza Estatística
        this._registrarSnapshotTemporal(perfil); 

        this._estadosEstudantes.set(estudanteId, perfil);
        this._salvarLocal(estudanteId, perfil);

        return {
            estudanteId: perfil.id,
            perfilDominante: perfil.perfilDominante,
            derivaPedagogicaGeral: perfil.derivaPedagogicaGeral,
            confiancaIA: perfil.confiancaDiagnostica, // Devolve a certeza para a Interface
            sugestaoAcaoADA: this._gerarDiretrizIntervencaoADA(perfil, metadadosSensor),
            timestampProcessamento: new Date().toISOString(),
            perfilCompleto: perfil 
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

    // 🧮 NOVO MOTOR: CÁLCULO DE CERTEZA DA IA
    _calcularConfiancaInferencial(perfil) {
        if (perfil.itensRespondidos < this._CONFIG.MIN_ITENS_PARA_DIAGNOSTICO) {
            perfil.confiancaDiagnostica = 0.0;
            return;
        }

        // 1. Fator Volume (Curva de aprendizado da própria IA)
        // Quanto mais questões, mais a IA confia. Chega a ~85% de peso de volume com 25 questões.
        const pesoVolume = 1 - Math.exp(-perfil.itensRespondidos / 15);

        // 2. Fator Consistência (Distância do 1º colocado para o 2º colocado)
        const scores = Object.values(perfil.scoreMatrizesPerfeitas).sort((a, b) => b - a);
        const top1 = scores[0];
        const top2 = scores[1] || 0;
        
        let pesoConsistencia = 0;
        if (top1 > 0) {
            const margem = (top1 - top2) / top1; // Diferença percentual
            pesoConsistencia = Math.min(1.0, margem * 2); // Multiplicador para acentuar a distância
        }

        // Confiança final: 60% baseado em quantas questões o aluno fez, 40% baseado na clareza do perfil
        const confianca = (pesoVolume * 0.6) + (pesoConsistencia * 0.4);
        
        perfil.confiancaDiagnostica = parseFloat((confianca * 100).toFixed(1));
    }

    _avaliarEstabilidadeEScaffold(perfil) {
        const mat = perfil.matrizTransferencia;
        const txProc = mat.procedural.total > 0 ? mat.procedural.acertos / mat.procedural.total : 0;
        const txTransf = mat.transferencia.total > 0 ? mat.transferencia.acertos / mat.transferencia.total : 0;
        const txGen = mat.generalizacao.total > 0 ? mat.generalizacao.acertos / mat.generalizacao.total : 0;

        if (mat.procedural.total >= 3 && mat.transferencia.total >= 2) {
            if (txProc >= 0.7 && txTransf < 0.4) perfil.estabilidadeConceitual = 'BAIXA_RISCO_PSEUDOCONCEITO';
            else if (txProc >= 0.7 && txTransf >= 0.6) perfil.estabilidadeConceitual = 'ALTA_ESTABILIZADA';
            else perfil.estabilidadeConceitual = 'EM_CONSTRUCAO';
        }

        if (mat.procedural.total >= 3 && mat.generalizacao.total >= 2) {
            if (txProc > 0.75 && txGen < 0.4) perfil.dependenciaScaffold = true;
            else if (txGen >= 0.5) perfil.dependenciaScaffold = false;
        }
    }

    _gerarDiretrizIntervencaoADA(perfil, sensor) {
        const d = { comandoMacro: 'PADRAO', scaffoldAlvo: 'NENHUM' };
        
        // Se a ADA não tem certeza do que está vendo (< 40%), ela não arrisca intervenções fortes.
        if (perfil.confiancaDiagnostica < 40.0) return d; 

        if (perfil.dependenciaScaffold) {
            d.comandoMacro = 'TRIGGER_CONTROLLED_FADING';
            d.scaffoldAlvo = 'REDUCAO_GRADUAL_DE_SUPORTE';
            return d; 
        }

        if (perfil.perfilDominante === 'IMPULSIVO_ARITMETICO') { d.comandoMacro = 'INJECT_RHYTHMIC_LOCK'; d.scaffoldAlvo = 'VERBALIZATION_PROMPT'; }
        else if (perfil.perfilDominante === 'PROCEDURAL_MECANICO') { d.comandoMacro = 'FORCE_SEMIOTIC_TRANSITION'; d.scaffoldAlvo = 'CONCRETE_SCHEMATIZATION'; }
        else if (perfil.perfilDominante === 'DEPENDENTE_CONCRETO') { d.comandoMacro = 'TRIGGER_CONTROLLED_FADING'; d.scaffoldAlvo = 'ORIENTATION_CARD'; }
        
        if (perfil.indicePseudoconceito >= 0.6 || perfil.estabilidadeConceitual === 'BAIXA_RISCO_PSEUDOCONCEITO') {
            d.comandoMacro = 'FORCE_SEMIOTIC_TRANSITION';
            d.scaffoldAlvo = 'CONCEPTUAL_RESET';
        }
        
        if (perfil.metricasAcumuladas.errosSequenciais >= 2) d.comandoMacro = 'RETROCEDER_ESTAGIO';
        return d;
    }
}
