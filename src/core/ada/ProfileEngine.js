/**
 * @fileoverview ProfileEngine.js
 * @description Motor de Inferência Cognitiva e Repositório Clínico-Conceitual.
 * VERSÃO 3.2.0 (Sprint Conectada): Integração estatística do Índice de Transferência Conceitual (ITC),
 * detecção de regressão imediata e governança do Choque Semiótico Controlado.
 * @package LabTech Core Environment
 */

import { QuestionNormalizer } from './QuestionNormalizer.js';

export class ProfileEngine {
    /**
     * @param {Object} familyRegistry - O mapa estático carregado a partir de familias_invariantes.json
     */
    constructor(familyRegistry = {}) {
        this.familyRegistry = familyRegistry;
        this._estadosEstudantes = new Map();

        // ⚙️ CONFIGURAÇÃO DE DIRETRIZES TÉCNICAS GERAIS
        this._CONFIG = Object.freeze({
            VERSAO_MODELO_CONCEITUAL: "ITC_v3.2_PRODUCTION",
            LIMIAR_LATENCIA_IMPULSIVA_MS: 3500,
            MASSA_CRITICA_CONCEITUAL: 6,
            MIN_ITENS_PARA_DIAGNOSTICO: 3,

            // Configuração de fallback caso o Registry não declare pesos específicos
            FALLBACK_PESOS_ITC: { CONCRETO: 0.10, VISUAL: 0.20, TEXTUAL: 0.30, ABSTRATO: 0.40 },
            
            LIMIAR_PSEUDOCONCEITO: 0.40,
            LIMIAR_GENERALIZACAO: 0.75,
            LIMIAR_ESTABILIDADE_CONCEITUAL: 0.70
        });
    }

    _salvarLocal(estudanteId, perfil) {
        try {
            const jsonStr = JSON.stringify(perfil);
            const b64 = btoa(encodeURIComponent(jsonStr)); 
            localStorage.setItem(`labtech_p_${estudanteId}`, b64);
        } catch (e) {
            console.warn("[ProfileEngine] Falha ao persistir dados locais:", e);
        }
    }

    _carregarLocal(estudanteId) {
        try {
            const b64 = localStorage.getItem(`labtech_p_${estudanteId}`);
            if (!b64) return null;
            return JSON.parse(decodeURIComponent(atob(b64)));
        } catch (e) {
            return null;
        }
    }

    inicializarEstudante(estudanteId) {
        if (!estudanteId) throw new Error('ID do estudante inválido.');

        const perfilSalvo = this._carregarLocal(estudanteId);
        if (perfilSalvo) {
            if (!perfilSalvo.perfilConceitual) {
                perfilSalvo.perfilConceitual = {};
                perfilSalvo.registroPseudoconceitos = {};
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
            confiancaDiagnostica: 0.0,
            estabilidadeConceitual: 'INDEFINIDA',
            dependenciaScaffold: false,
            habilidades: {},
            
            // Repositórios Clínico-Ontológicos Centrais
            perfilConceitual: {},
            registroPseudoconceitos: {}, 

            historicoLongitudinal: [],
            metricasAcumuladas: { totalLatenciaConceptual: 0, totalFriccaoAjustes: 0, errosSequenciais: 0, taxaAcertoGeral: 0.0 },
            scoreMatrizesPerfeitas: { PROCEDURAL_MECANICO: 0.0, DEPENDENTE_CONCRETO: 0.0, IMPULSIVO_ARITMETICO: 0.0, CONCEITUAL_TEORICO: 0.0 },
            mapaEtiologiaErros: { VIES_ARITMETICO: 0, ETIQUETA_ESTATICA: 0, INVERSAO_TOPOLOGICA: 0, DOMINIO_PROCEDURAL: 0, AUSENCIA_GENERALIZACAO: 0, IMPULSIVIDADE_CONCRETE: 0, ERRO_GENERICO: 0, PSEUDOCONCEITO_EXPOSTO: 0 }
        };

        this._estadosEstudantes.set(estudanteId, novoPerfil);
        this._salvarLocal(estudanteId, novoPerfil); 
        return JSON.parse(JSON.stringify(novoPerfil));
    }

    _inicializarHabilidade(perfil, bncc, conceitoEstrutural) {
        if (!perfil.habilidades[bncc]) {
            perfil.habilidades[bncc] = {
                itensRespondidos: 0,
                perfilDominante: 'INDEFINIDO', 
                acertos: 0,
                erros: 0,
                errosSequenciais: 0,
                scoreMatrizesPerfeitas: { PROCEDURAL_MECANICO: 0.0, DEPENDENTE_CONCRETO: 0.0, IMPULSIVO_ARITMETICO: 0.0, CONCEITUAL_TEORICO: 0.0 },
                zdp: { atual: 2, minimo: 1, maximo: 4 },
                trajetoriaCognitiva: [],
                
                evidenciasConceituais: {
                    dependenciaRepresentacional: {
                        CONCRETO: { acertos: 0, total: 0, indice: 0.0 },
                        VISUAL: { acertos: 0, total: 0, indice: 0.0 },
                        TEXTUAL: { acertos: 0, total: 0, indice: 0.0 },
                        ABSTRATO: { acertos: 0, total: 0, indice: 0.0 }
                    },
                    transferenciasBemSucedidas: 0,
                    transferenciasFalhadas: 0,
                    historicoTransferencia: [],
                    indiceTransferenciaConceitual: 0.0,
                    indiceEstabilidadeConceitual: 0.0,
                    estagioConceitual: "EVIDENCIA_INSUFICIENTE",
                    itensNoEstagioAtual: 0, 
                    trajetoriaConceitual: []
                }
            };
        }

        if (!perfil.perfilConceitual[conceitoEstrutural]) {
            perfil.perfilConceitual[conceitoEstrutural] = {
                estabilidade: 0.0,
                transferencia: 0.0,
                pseudoconceitoPersistente: false,
                totalInteracoes: 0,
                tendencia: "ESTÁVEL", 
                ultimaAtualizacao: new Date().toISOString().split('T')[0]
            };
        }

        return perfil.habilidades[bncc];
    }

    processarEventoTelemetria(estudanteId, dadosTelemetria, metadadosSensor) {
        const normalizer = new QuestionNormalizer();
        try { normalizer.normalize(metadadosSensor); } 
        catch (erro) { console.warn(`[ProfileEngine] Normalização: ${erro.message}`); }

        if (!this._estadosEstudantes.has(estudanteId)) this.inicializarEstudante(estudanteId);
        const perfil = this._estadosEstudantes.get(estudanteId);
        
        perfil.itensRespondidos++;

        const { latenciaMs, alternativaSelecionadaId, foiCorreto } = dadosTelemetria;
        const ehCorreto = foiCorreto; 
        
        const alternativaAlvo = metadadosSensor.alternativas?.find(alt => alt.id_alternativa === alternativaSelecionadaId || alt.id === alternativaSelecionadaId);
        let etiologiaErro = alternativaAlvo ? (alternativaAlvo.misconception || alternativaAlvo.erro || 'ERRO_GENERICO').toUpperCase() : 'ERRO_GENERICO';
        
        const estagioAtual = (metadadosSensor.estagioGalperin || 'INTERNA_PURA').toUpperCase();
        const bncc = metadadosSensor.bncc || "GERAL";
        const familiaAlvo = metadadosSensor.familia_alvo || metadadosSensor.familiaAlvo;

        let conceitoEstrutural = "GERAL";
        if (familiaAlvo && this.familyRegistry[familiaAlvo]) {
            conceitoEstrutural = this.familyRegistry[familiaAlvo].conceitoEstrutural;
        } else {
            conceitoEstrutural = metadadosSensor.conceitoEstrutural || "VALOR_POSICIONAL"; 
        }

        const hab = this._inicializarHabilidade(perfil, bncc, conceitoEstrutural);
        hab.itensRespondidos++;
        
        const pc = perfil.perfilConceitual[conceitoEstrutural];
        pc.totalInteracoes++;
        pc.ultimaAtualizacao = new Date().toISOString().split('T')[0];

        const contextoADA = metadadosSensor.contextoADA;
        const repAtiva = contextoADA ? contextoADA.representacaoForcada : (metadadosSensor.representacao || 'VISUAL');
        
        let slotRepresentacao = "VISUAL";
        const repNormalizada = repAtiva.toUpperCase();
        if (repNormalizada.includes('CONCRETO') || repNormalizada.includes('MATERIAL')) slotRepresentacao = "CONCRETO";
        else if (repNormalizada.includes('TEXTUAL') || repNormalizada.includes('LINGUISTICA')) slotRepresentacao = "TEXTUAL";
        else if (repNormalizada.includes('ABSTRATO') || repNormalizada.includes('SIMBOLICO') || repNormalizada.includes('RETA')) slotRepresentacao = "ABSTRATO";

        const dr = hab.evidenciasConceituais.dependenciaRepresentacional[slotRepresentacao];
        dr.total++;
        if (ehCorreto) dr.acertos++;
        dr.indice = Number((dr.acertos / dr.total).toFixed(2));

        if (!ehCorreto && (etiologiaErro !== 'ERRO_GENERICO')) {
            if (!perfil.registroPseudoconceitos[etiologiaErro]) {
                perfil.registroPseudoconceitos[etiologiaErro] = { frequencia: 0, persistencia: "BAIXA", ultimaOcorrencia: "" };
            }
            const rp = perfil.registroPseudoconceitos[etiologiaErro];
            rp.frequencia++;
            rp.ultimaOcorrencia = new Date().toISOString().split('T')[0];
            
            if (rp.frequencia >= 5) rp.persistencia = "CRÍTICA";
            else if (rp.frequencia >= 3) rp.persistencia = "ALTA";
            else rp.persistencia = "MODERADA";
        }

        if (contextoADA && contextoADA.foiChoqueSemiotico) {
            if (ehCorreto) hab.evidenciasConceituais.transferenciasBemSucedidas++;
            else hab.evidenciasConceituais.transferenciasFalhadas++;

            hab.evidenciasConceituais.historicoTransferencia.push({
                data: new Date().toISOString(),
                original: contextoADA.representacaoOriginal,
                forcado: contextoADA.representacaoForcada,
                correto: ehCorreto,
                latencia: latenciaMs
            });
        }

        if (perfil.estadoADA.emboscadaArmada) {
            if (!ehCorreto || latenciaMs > 12000) {
                perfil.indicePseudoconceito = Math.min(1.0, perfil.indicePseudoconceito + 0.3);
                if (etiologiaErro === 'ERRO_GENERICO') {
                    etiologiaErro = 'PSEUDOCONCEITO_EXPOSTO';
                    perfil.mapaEtiologiaErros['PSEUDOCONCEITO_EXPOSTO'] = (perfil.mapaEtiologiaErros['PSEUDOCONCEITO_EXPOSTO'] || 0) + 1;
                }
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

        perfil.metricasAcumuladas.totalLatenciaConceptual += latenciaMs || 0;
        if (ehCorreto) {
            perfil.metricasAcumuladas.errosSequenciais = 0;
            hab.acertos++;
            hab.errosSequenciais = 0;
        } else {
            perfil.metricasAcumuladas.errosSequenciais++;
            perfil.metricasAcumuladas.totalFriccaoAjustes++;
            hab.erros++;
            hab.errosSequenciais++;
            perfil.mapaEtiologiaErros[etiologiaErro] = (perfil.mapaEtiologiaErros[etiologiaErro] || 0) + 1;
        }

        this._computarPesosPerfis(perfil, latenciaMs, ehCorreto, estagioAtual);
        this._computarPesosPerfis(hab, latenciaMs, ehCorreto, estagioAtual);

        this._estabilizarPerfilDominante(perfil); 
        this._estabilizarPerfilDominanteDaHabilidade(hab); 
        this._avaliarEstagioConceitual(hab, perfil, conceitoEstrutural, familiaAlvo);       

        this._avaliarZDP(hab); 
        this._calcularConfiancaInferencial(perfil); 

        this._estadosEstudantes.set(estudanteId, perfil);
        this._salvarLocal(estudanteId, perfil);

        return {
            estudanteId: perfil.id,
            perfilDominante: perfil.perfilDominante,
            estagioConceitualAtual: hab.evidenciasConceituais.estagioConceitual, 
            indiceTransferenciaConceitual: hab.evidenciasConceituais.indiceTransferenciaConceitual,
            derivaPedagogicaGeral: perfil.derivaPedagogicaGeral,
            confiancaIA: perfil.confiancaDiagnostica, 
            sugestaoAcaoADA: this._gerarDiretrizIntervencaoADA(perfil, hab, etiologiaErro, slotRepresentacao),
            timestampProcessamento: new Date().toISOString(),
            perfilCompleto: perfil 
        };
    }

    _calcularEstabilidade(ev) {
        const ultimosChoques = ev.historicoTransferencia.slice(-5);
        if (ultimosChoques.length > 1) {
            let transicoes = 0;
            for (let i = 1; i < ultimosChoques.length; i++) {
                if (ultimosChoques[i].correto !== ultimosChoques[i-1].correto) transicoes++;
            }
            const taxaConsistenciaOscilatoria = 1 - (transicoes / (ultimosChoques.length - 1));
            const acertosRecentes = ultimosChoques.filter(c => c.correto).length / ultimosChoques.length;
            ev.indiceEstabilidadeConceitual = Number(((acertosRecentes * 0.6) + (taxaConsistenciaOscilatoria * 0.4)).toFixed(2));
        } else if (ultimosChoques.length === 1) {
            ev.indiceEstabilidadeConceitual = ultimosChoques[0].correto ? 1.0 : 0.0;
        } else {
            ev.indiceEstabilidadeConceitual = 0.0;
        }
    }

    _avaliarEstagioConceitual(hab, perfilGlobal, conceitoEstrutural, familiaId) {
        const ev = hab.evidenciasConceituais;
        const dr = ev.dependenciaRepresentacional;
        
        const totalEvidencias = dr.CONCRETO.total + dr.VISUAL.total + dr.TEXTUAL.total + dr.ABSTRATO.total;

        if (totalEvidencias < this._CONFIG.MASSA_CRITICA_CONCEITUAL) {
            this._atualizarEstagioConceitual(hab, "EVIDENCIA_INSUFICIENTE");
            return;
        }

        let pesosConceito = this._CONFIG.FALLBACK_PESOS_ITC;
        if (familiaId && this.familyRegistry[familiaId] && this.familyRegistry[familiaId].pesosAjustadosITC) {
            pesosConceito = this.familyRegistry[familiaId].pesosAjustadosITC;
        }

        const itcBruto = (
            (dr.CONCRETO.indice * (pesosConceito.CONCRETO || 0.10)) +
            (dr.VISUAL.indice * (pesosConceito.VISUAL || 0.20)) +
            (dr.TEXTUAL.indice * (pesosConceito.TEXTUAL || 0.30)) +
            (dr.ABSTRATO.indice * (pesosConceito.ABSTRATO || 0.40))
        );
        const antigoITC = ev.indiceTransferenciaConceitual;
        ev.indiceTransferenciaConceitual = Number(itcBruto.toFixed(2));

        this._calcularEstabilidade(ev);

        let novoEstagio = ev.estagioConceitual;
        const estagioAnterior = ev.estagioConceitual;

        if (ev.indiceTransferenciaConceitual >= this._CONFIG.LIMIAR_GENERALIZACAO && 
            ev.indiceEstabilidadeConceitual >= this._CONFIG.LIMIAR_ESTABILIDADE_CONCEITUAL) {
            novoEstagio = "GENERALIZACAO_CONSOLIDADA";
        } 
        else if (ev.indiceTransferenciaConceitual >= this._CONFIG.LIMIAR_PSEUDOCONCEITO && 
                 ev.indiceTransferenciaConceitual < this._CONFIG.LIMIAR_GENERALIZACAO) {
            
            if (estagioAnterior === "GENERALIZACAO_CONSOLIDADA") {
                novoEstagio = "REGRESSAO_CONCEITUAL";
            } else {
                novoEstagio = "EM_TRANSICAO_CONCEITUAL";
            }
        } 
        else if (ev.indiceTransferenciaConceitual < this._CONFIG.LIMIAR_PSEUDOCONCEITO) {
            novoEstagio = "PSEUDOCONCEITO_ESTAVEL";
        }

        this._atualizarEstagioConceitual(hab, novoEstagio);

        const pc = perfilGlobal.perfilConceitual[conceitoEstrutural];
        
        let tendenciaCalculada = "ESTÁVEL";
        if (ev.indiceTransferenciaConceitual > antigoITC && antigoITC > 0) tendenciaCalculada = "MELHORANDO";
        else if (ev.indiceTransferenciaConceitual < antigoITC && antigoITC > 0) tendenciaCalculada = "REGREDINDO";
        else if (ev.itensNoEstagioAtual >= 4) tendenciaCalculada = "ESTAGNADO";

        pc.estabilidade = ev.indiceEstabilidadeConceitual;
        pc.transferencia = ev.indiceTransferenciaConceitual;
        pc.pseudoconceitoPersistente = (novoEstagio === "PSEUDOCONCEITO_ESTAVEL");
        pc.tendencia = tendenciaCalculada;
    }

    _atualizarEstagioConceitual(hab, novoEstagio) {
        const ev = hab.evidenciasConceituais;
        if (ev.estagioConceitual !== novoEstagio) {
            ev.trajetoriaConceitual.push({
                data: new Date().toISOString(),
                de: ev.estagioConceitual,
                para: novoEstagio,
                itc: ev.indiceTransferenciaConceitual,
                modelo: this._CONFIG.VERSAO_MODELO_CONCEITUAL
            });
            ev.estagioConceitual = novoEstagio;
            ev.itensNoEstagioAtual = 0; 
        } else {
            ev.itensNoEstagioAtual = (ev.itensNoEstagioAtual || 0) + 1;
        }
    }

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

    _estabilizarPerfilDominanteDaHabilidade(hab) {
        if (hab.itensRespondidos < this._CONFIG.MIN_ITENS_PARA_DIAGNOSTICO) return;
        const scores = hab.scoreMatrizesPerfeitas;
        let maior = -1, vencedor = 'CONCEITUAL_TEORICO';
        Object.keys(scores).forEach(k => { if (scores[k] > maior) { maior = scores[k]; vencedor = k; } });
        
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

    _avaliarZDP(hab) {
        const total = hab.acertos + hab.erros;
        if (total < 3) return;
        const taxaAcerto = hab.acertos / total;

        if (taxaAcerto >= 0.8 && hab.errosSequenciais === 0) {
            hab.zdp.minimo = Math.min(hab.zdp.minimo + 1, 4);
            hab.zdp.atual = Math.min(hab.zdp.atual + 1, 5);
        } 
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

        let somaEstabilidade = 0;
        let countHabilidades = 0;
        Object.values(perfil.habilidades).forEach(hab => {
            if (hab.evidenciasConceituais && hab.evidenciasConceituais.indiceEstabilidadeConceitual !== undefined) {
                somaEstabilidade += hab.evidenciasConceituais.indiceEstabilidadeConceitual;
                countHabilidades++;
            }
        });
        const pesoEstabilidade = countHabilidades > 0 ? (somaEstabilidade / countHabilidades) : 0;

        const confianca = (pesoVolume * 0.4) + (pesoConsistencia * 0.3) + (pesoEstabilidade * 0.3);
        perfil.confiancaDiagnostica = parseFloat((confianca * 100).toFixed(1));
    }

    _gerarDiretrizIntervencaoADA(perfil, hab, etiologiaErro, representacaoAtual) {
        const d = { 
            comandoMacro: 'PADRAO', 
            scaffoldAlvo: 'NENHUM',
            choqueSemioticoRecomendado: false,
            representacaoAlvo: representacaoAtual,
            intensidadeMediacao: "BAIXA"
        };
        
        if (perfil.confiancaDiagnostica < 30.0) return d; 

        if (hab.errosSequenciais >= 2) {
            d.comandoMacro = 'REDUZIR_CARGA_COGNITIVA';
            d.scaffoldAlvo = 'ATIVAR_REPRESENTACAO_CONCRETA';
            d.representacaoAlvo = "CONCRETO";
            d.intensidadeMediacao = "CRÍTICA";
            return d;
        }

        if (hab.perfilDominante === 'IMPULSIVO_ARITMETICO') { 
            d.comandoMacro = 'INJECT_RHYTHMIC_LOCK'; 
            d.scaffoldAlvo = 'VERBALIZATION_PROMPT'; 
            d.representacaoAlvo = "TEXTUAL";
            d.intensidadeMediacao = "MODERADA";
        }
        else if (hab.perfilDominante === 'PROCEDURAL_MECANICO') { 
            d.comandoMacro = 'FORCE_SEMIOTIC_TRANSITION'; 
            d.scaffoldAlvo = 'CONCRETE_SCHEMATIZATION'; 
            d.representacaoAlvo = "CONCRETO";
            d.choqueSemioticoRecomendado = true;
            d.intensidadeMediacao = "ALTA";
        }
        else if (hab.perfilDominante === 'DEPENDENTE_CONCRETO') { 
            d.comandoMacro = 'TRIGGER_CONTROLLED_FADING'; 
            d.scaffoldAlvo = 'ORIENTATION_CARD'; 
            d.representacaoAlvo = "VISUAL";
            d.intensidadeMediacao = "MODERADA";
        }
        
        const estagio = hab.evidenciasConceituais.estagioConceitual;
        if (perfil.indicePseudoconceito >= 0.6 || estagio === 'PSEUDOCONCEITO_ESTAVEL' || estagio === 'REGRESSAO_CONCEITUAL') {
            d.comandoMacro = 'FORCE_SEMIOTIC_TRANSITION';
            d.scaffoldAlvo = 'CONCEPTUAL_RESET';
            d.choqueSemioticoRecomendado = true;
            d.representacaoAlvo = estagio === 'REGRESSAO_CONCEITUAL' ? "TEXTUAL" : "CONCRETO";
            d.intensidadeMediacao = "ALTA";
        }
        
        return d;
    }
}
