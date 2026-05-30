/**
 * @fileoverview ProfileEngine.js
 * @description Motor de Inferência Cognitiva, ZDP Dinâmica e Trajetória Epistemológica.
 * EVOLUÇÃO 10.0.0: Perfis por Habilidade (BNCC), Rastreamento de Trajetória e ZDP Local.
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
            ITENS_IDEAIS_CONFIANCA: 25
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
            console.warn("[ProfileEngine] Storage corrompido. Iniciando perfil limpo.");
            return null;
        }
    }

    inicializarEstudante(estudanteId) {
        if (!estudanteId) throw new Error('ID inválido.');

        const perfilSalvo = this._carregarLocal(estudanteId);
        if (perfilSalvo) {
            console.log(`[ADA] Memória recuperada para: ${estudanteId}`);
            
            // 🛠️ MIGRATION PATCH V10: Injeta a arquitetura de Habilidades e ZDP
            if (!perfilSalvo.habilidades) {
                perfilSalvo.habilidades = {};
                perfilSalvo.confiancaDiagnostica = perfilSalvo.confiancaDiagnostica || 0.0;
                perfilSalvo.estadoADA = perfilSalvo.estadoADA || { acertosRapidosCombo: 0, emboscadaArmada: false };
                console.log(`[ADA] 🔄 Mente veterana atualizada para Múltiplas Habilidades (V10).`);
            }

            this._estadosEstudantes.set(estudanteId, perfilSalvo);
            return JSON.parse(JSON.stringify(perfilSalvo));
        }

        const novoPerfil = {
            id: estudanteId,
            timestampCriacao: new Date().toISOString(),
            itensRespondidos: 0,
            
            // Atributos Globais (Mantidos para Dashboards e Compatibilidade)
            perfilDominante: 'INDEFINIDO',
            derivaPedagogicaGeral: 0.0,
            indicePseudoconceito: 0.0, 
            estadoADA: { acertosRapidosCombo: 0, emboscadaArmada: false },
            confiancaDiagnostica: 0.0,
            estabilidadeConceitual: 'INDEFINIDA',
            dependenciaScaffold: false,
            
            // 🎯 NOVO CORAÇÃO: Mapa de Habilidades BNCC
            habilidades: {},

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

    // Inicializa o sub-perfil de uma habilidade específica se não existir
    _inicializarHabilidade(perfil, bncc) {
        if (!perfil.habilidades[bncc]) {
            perfil.habilidades[bncc] = {
                itensRespondidos: 0,
                perfilDominante: 'INDEFINIDO',
                acertos: 0,
                erros: 0,
                errosSequenciais: 0,
                scoreMatrizesPerfeitas: { PROCEDURAL_MECANICO: 0.0, DEPENDENTE_CONCRETO: 0.0, IMPULSIVO_ARITMETICO: 0.0, CONCEITUAL_TEORICO: 0.0 },
                zdp: { atual: 2, minimo: 1, maximo: 4 }, // ZDP Padrão Inicial
                trajetoriaCognitiva: [] // Rastreia as mudanças de perfil ao longo do tempo!
            };
        }
        return perfil.habilidades[bncc];
    }
    
    _registrarSnapshotTemporal(perfil) {
        if (perfil.itensRespondidos % 10 === 0 && perfil.itensRespondidos > 0) {
            const snapshot = {
                marcoTemporal: `Sessão ${Math.floor(perfil.itensRespondidos / 10)}`,
                data: new Date().toISOString(),
                perfilGlobal: perfil.perfilDominante,
                riscoPseudoconceito: perfil.indicePseudoconceito.toFixed(2),
                confiancaIA: perfil.confiancaDiagnostica
            };
            perfil.historicoLongitudinal.push(snapshot);
        }
    }

    processarEventoTelemetria(estudanteId, dadosTelemetria, metadadosSensor) {
        const normalizador = new QuestionNormalizer();
        try { normalizador.normalize(metadadosSensor); } 
        catch (erro) { console.warn(`[ProfileEngine] Aviso de Normalização: ${erro.message}`); }

        if (!this._estadosEstudantes.has(estudanteId)) {
            this.inicializarEstudante(estudanteId);
        }

        const perfil = this._estadosEstudantes.get(estudanteId);
        perfil.itensRespondidos++;

        const { latenciaMs, totalAjustesPreConfirmacao, alternativaSelecionadaId, foiCorreto } = dadosTelemetria;
        const ehCorreto = foiCorreto; 
        
        const alternativaAlvo = metadadosSensor.alternativas?.find(alt => alt.id_alternativa === alternativaSelecionadaId || alt.id === alternativaSelecionadaId || alt.valor === alternativaSelecionadaId);
        let etiologiaErro = alternativaAlvo ? (alternativaAlvo.misconception || alternativaAlvo.categoria || 'ERRO_GENERICO').toUpperCase() : 'ERRO_GENERICO';
        
        const estagioAtual = (metadadosSensor.estagioGalperin || 'INTERNA_PURA').toUpperCase();
        const representacaoAtual = (metadadosSensor.representacao || 'visual').toLowerCase();
        
        // Extrai a habilidade (fallback para "GERAL" se a questão não tiver BNCC)
        const bncc = metadadosSensor.bncc || "GERAL";
        const hab = this._inicializarHabilidade(perfil, bncc);

        hab.itensRespondidos++;

        // 🧠 EMBOSCADA PEDAGÓGICA GLOBAL (Mantida para controle de fadiga/spam)
        if (perfil.estadoADA.emboscadaArmada) {
            if (!ehCorreto || latenciaMs > 12000) {
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
                if (perfil.estadoADA.acertosRapidosCombo >= 3) perfil.estadoADA.emboscadaArmada = true;
            } else if (!ehCorreto) {
                perfil.estadoADA.acertosRapidosCombo = 0;
            }
        }

        // 📊 MÉTRICAS GLOBAIS E LOCAIS
        perfil.metricasAcumuladas.totalLatenciaConceptual += latenciaMs || 0;
        
        if (ehCorreto) {
            perfil.metricasAcumuladas.errosSequenciais = 0;
            hab.acertos++;
            hab.errosSequenciais = 0;
        } else {
            perfil.metricasAcumuladas.errosSequenciais++;
            hab.erros++;
            hab.errosSequenciais++;
            perfil.mapaEtiologiaErros[etiologiaErro] = (perfil.mapaEtiologiaErros[etiologiaErro] || 0) + 1;
        }

        // Processa pesos tanto para o Perfil Global quanto para a Habilidade Específica
        this._computarPesosPerfis(perfil, latenciaMs, ehCorreto, estagioAtual);
        this._computarPesosPerfis(hab, latenciaMs, ehCorreto, estagioAtual);

        this._estabilizarPerfilDominante(perfil); 
        this._estabilizarPerfilDominanteDaHabilidade(hab, bncc); // Aqui nasce a trajetória cognitiva!

        this._avaliarZDP(hab); // Ajusta a Zona de Desenvolvimento Proximal
        
        this._calcularConfiancaInferencial(perfil); 
        this._registrarSnapshotTemporal(perfil); 

        this._estadosEstudantes.set(estudanteId, perfil);
        this._salvarLocal(estudanteId, perfil);

        return {
            estudanteId: perfil.id,
            perfilDominante: perfil.perfilDominante, // Global
            derivaPedagogicaGeral: perfil.derivaPedagogicaGeral,
            confiancaIA: perfil.confiancaDiagnostica, 
            sugestaoAcaoADA: this._gerarDiretrizIntervencaoADA(perfil, hab, etiologiaErro), // ADA agora olha pra Habilidade
            timestampProcessamento: new Date().toISOString(),
            perfilCompleto: perfil 
        };
    }

    // Funciona de forma polimórfica (aceita tanto o Perfil Global quanto o objeto da Habilidade)
    _computarPesosPerfis(alvo, latencia, ehCorreto, estagio) {
        const C = this._CONFIG;
        if (latencia < C.LIMIAR_LATENCIA_IMPULSIVA_MS && !ehCorreto) alvo.scoreMatrizesPerfeitas.IMPULSIVO_ARITMETICO += 0.35;
        if (estagio === 'INTERNA_PURA' && ehCorreto) alvo.scoreMatrizesPerfeitas.PROCEDURAL_MECANICO += 0.15;
        if ((estagio === 'ICONICA' || estagio === 'VERBAL_EXTERNA') && !ehCorreto) alvo.scoreMatrizesPerfeitas.PROCEDURAL_MECANICO += 0.20;
        if ((estagio === 'MATERIALIZADA' || estagio === 'ICONICA') && ehCorreto) alvo.scoreMatrizesPerfeitas.DEPENDENTE_CONCRETO += 0.10;
        if (estagio === 'INTERNA_PURA' && !ehCorreto) alvo.scoreMatrizesPerfeitas.DEPENDENTE_CONCRETO += 0.25;
        if (ehCorreto && latencia >= C.LIMIAR_LATENCIA_IMPULSIVA_MS) alvo.scoreMatrizesPerfeitas.CONCEITUAL_TEORICO += 0.20;

        Object.keys(alvo.scoreMatrizesPerfeitas).forEach(key => {
            alvo.scoreMatrizesPerfeitas[key] = Math.min(Math.max(alvo.scoreMatrizesPerfeitas[key], 0), 10);
        });
    }

    _estabilizarPerfilDominante(perfil) {
        if (perfil.itensRespondidos < this._CONFIG.MIN_ITENS_PARA_DIAGNOSTICO) return;
        const scores = perfil.scoreMatrizesPerfeitas;
        let maior = -1, vencedor = 'CONCEITUAL_TEORICO';
        Object.keys(scores).forEach(k => { if (scores[k] > maior) { maior = scores[k]; vencedor = k; } });
        perfil.perfilDominante = vencedor;
        perfil.derivaPedagogicaGeral = parseFloat((Math.sqrt((scores.PROCEDURAL_MECANICO ** 2) + (scores.DEPENDENTE_CONCRETO ** 2) + (scores.IMPULSIVO_ARITMETICO ** 2)) / 17.32).toFixed(2));
    }

    // 🧬 GERAÇÃO DA TRAJETÓRIA COGNITIVA
    _estabilizarPerfilDominanteDaHabilidade(hab, bncc) {
        if (hab.itensRespondidos < this._CONFIG.MIN_ITENS_PARA_DIAGNOSTICO) return;
        const scores = hab.scoreMatrizesPerfeitas;
        let maior = -1, vencedor = 'CONCEITUAL_TEORICO';
        Object.keys(scores).forEach(k => { if (scores[k] > maior) { maior = scores[k]; vencedor = k; } });
        
        // Se o perfil mudou, registra a transição epistemológica para a pesquisa!
        if (hab.perfilDominante !== 'INDEFINIDO' && hab.perfilDominante !== vencedor) {
            hab.trajetoriaCognitiva.push({
                data: new Date().toISOString(),
                de: hab.perfilDominante,
                para: vencedor,
                gatilho: hab.acertos > hab.erros ? "PROGRESSAO_CONCEITUAL" : "REGRESSAO_FRICCAO"
            });
        }
        hab.perfilDominante = vencedor;
    }

    // 📈 CÁLCULO DA ZONA DE DESENVOLVIMENTO PROXIMAL (ZDP)
    _avaliarZDP(hab) {
        const total = hab.acertos + hab.erros;
        if (total < 3) return;

        const taxaAcerto = hab.acertos / total;

        // Se o aluno está voando (Acima de 80%), o limite ZDP sobe
        if (taxaAcerto >= 0.8 && hab.errosSequenciais === 0) {
            hab.zdp.minimo = Math.min(hab.zdp.minimo + 1, 4);
            hab.zdp.atual = Math.min(hab.zdp.atual + 1, 5);
        } 
        // Se o aluno travou (Erros sequenciais), o limite ZDP desce para ancoragem
        else if (hab.errosSequenciais >= 2) {
            hab.zdp.atual = Math.max(hab.zdp.atual - 1, hab.zdp.minimo);
        }
    }

    _calcularConfiancaInferencial(perfil) {
        if (perfil.itensRespondidos < this._CONFIG.MIN_ITENS_PARA_DIAGNOSTICO) {
            perfil.confiancaDiagnostica = 0.0;
            return;
        }
        const pesoVolume = 1 - Math.exp(-perfil.itensRespondidos / 15);
        const scores = Object.values(perfil.scoreMatrizesPerfeitas).sort((a, b) => b - a);
        const top1 = scores[0], top2 = scores[1] || 0;
        
        let pesoConsistencia = 0;
        if (top1 > 0) {
            const margem = (top1 - top2) / top1; 
            pesoConsistencia = Math.min(1.0, margem * 2); 
        }

        const confianca = (pesoVolume * 0.6) + (pesoConsistencia * 0.4);
        perfil.confiancaDiagnostica = parseFloat((confianca * 100).toFixed(1));
    }

    _gerarDiretrizIntervencaoADA(perfil, hab, etiologiaErro) {
        const d = { comandoMacro: 'PADRAO', scaffoldAlvo: 'NENHUM' };
        if (perfil.confiancaDiagnostica < 30.0) return d; 

        // O AdaptiveSelector usará isso para intervir de acordo com o Erro Específico (Vigotski)
        if (hab.errosSequenciais >= 2) {
            d.comandoMacro = 'REDUZIR_CARGA_COGNITIVA';
            d.scaffoldAlvo = 'ATIVAR_REPRESENTACAO_CONCRETA';
            return d;
        }

        if (hab.perfilDominante === 'IMPULSIVO_ARITMETICO') { d.comandoMacro = 'INJECT_RHYTHMIC_LOCK'; d.scaffoldAlvo = 'VERBALIZATION_PROMPT'; }
        else if (hab.perfilDominante === 'PROCEDURAL_MECANICO') { d.comandoMacro = 'FORCE_SEMIOTIC_TRANSITION'; d.scaffoldAlvo = 'CONCRETE_SCHEMATIZATION'; }
        else if (hab.perfilDominante === 'DEPENDENTE_CONCRETO') { d.comandoMacro = 'TRIGGER_CONTROLLED_FADING'; d.scaffoldAlvo = 'ORIENTATION_CARD'; }
        
        if (perfil.indicePseudoconceito >= 0.6) {
            d.comandoMacro = 'FORCE_SEMIOTIC_TRANSITION';
            d.scaffoldAlvo = 'CONCEPTUAL_RESET';
        }
        
        return d;
    }
}
