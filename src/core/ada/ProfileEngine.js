/**
 * @fileoverview ProfileEngine.js
 * @description Motor de Inferência Cognitiva e Computacional de Formação de Conceitos (Teoria Histórico-Cultural).
 * EVOLUÇÃO 10.4.0: Rigor científico, versionamento de modelo, validação de pesos e consolidação de arquitetura.
 * @package LabTech Core Environment
 */

import { QuestionNormalizer } from './QuestionNormalizer.js';

export class ProfileEngine {
    constructor() {
        this._estadosEstudantes = new Map();

        // ⚙️ CAMADA DE CONFIGURAÇÃO CIENTÍFICA
        this._CONFIG = Object.freeze({
            VERSAO_MODELO_CONCEITUAL: "ITC_v1",
            LIMIAR_LATENCIA_IMPULSIVA_MS: 3500,
            MASSA_CRITICA_CONCEITUAL: 8,
            
            // Pesos do ITC (α + β + γ = 1.0)
            PESO_ITC_ABSTRACAO: 0.50,
            PESO_ITC_TRANSFERENCIA: 0.40,
            PESO_ITC_INDEPENDENCIA: 0.10,

            // Limiares de Classificação Conceitual
            LIMIAR_PSEUDOCONCEITO: 0.35,
            LIMIAR_GENERALIZACAO: 0.70,
            LIMIAR_ESTABILIDADE_CONCEITUAL: 0.70
        });

        this._validarConfiguracao();
    }

    _validarConfiguracao() {
        const somaPesos = this._CONFIG.PESO_ITC_ABSTRACAO + 
                          this._CONFIG.PESO_ITC_TRANSFERENCIA + 
                          this._CONFIG.PESO_ITC_INDEPENDENCIA;

        if (Math.abs(somaPesos - 1.0) > 0.001) {
            throw new Error(`[ProfileEngine] Falha na calibração: Pesos do ITC somam ${somaPesos}, esperado 1.0.`);
        }
    }

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
            return JSON.parse(decodeURIComponent(atob(b64)));
        } catch (e) {
            return null;
        }
    }

    inicializarEstudante(estudanteId) {
        if (!estudanteId) throw new Error('ID inválido.');

        const perfilSalvo = this._carregarLocal(estudanteId);
        if (perfilSalvo) {
            if (!perfilSalvo.habilidades) {
                perfilSalvo.habilidades = {};
                perfilSalvo.confiancaDiagnostica = perfilSalvo.confiancaDiagnostica || 0.0;
                perfilSalvo.estadoADA = perfilSalvo.estadoADA || { acertosRapidosCombo: 0, emboscadaArmada: false };
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

    _inicializarHabilidade(perfil, bncc) {
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
                
                // 🧠 CAMADA B: Motor Computacional de Formação de Conceitos
                evidenciasConceituais: {
                    visual: { acertos: 0, total: 0 },
                    abstrata: { acertos: 0, total: 0 },
                    transferenciasBemSucedidas: 0,
                    transferenciasFalhadas: 0,
                    historicoTransferencia: [],
                    indiceTransferenciaConceitual: 0.0,
                    indiceDependenciaVisual: 0.0,
                    indiceEstabilidadeConceitual: 0.0,
                    estagioConceitual: "EVIDENCIA_INSUFICIENTE",
                    trajetoriaConceitual: []
                }
            };
        }
        return perfil.habilidades[bncc];
    }
    
    _registrarSnapshotTemporal(perfil) {
        if (perfil.itensRespondidos % 10 === 0 && perfil.itensRespondidos > 0) {
            perfil.historicoLongitudinal.push({
                marcoTemporal: `Sessão ${Math.floor(perfil.itensRespondidos / 10)}`,
                data: new Date().toISOString(),
                perfilGlobal: perfil.perfilDominante,
                riscoPseudoconceito: perfil.indicePseudoconceito.toFixed(2),
                confiancaIA: perfil.confiancaDiagnostica
            });
        }
    }

    processarEventoTelemetria(estudanteId, dadosTelemetria, metadadosSensor) {
        const normalizador = new QuestionNormalizer();
        try { normalizador.normalize(metadadosSensor); } 
        catch (erro) { console.warn(`[ProfileEngine] Aviso: ${erro.message}`); }

        if (!this._estadosEstudantes.has(estudanteId)) this.inicializarEstudante(estudanteId);
        const perfil = this._estadosEstudantes.get(estudanteId);
        
        perfil.itensRespondidos++;

        const { latenciaMs, alternativaSelecionadaId, foiCorreto } = dadosTelemetria;
        const ehCorreto = foiCorreto; 
        
        const alternativaAlvo = metadadosSensor.alternativas?.find(alt => alt.id_alternativa === alternativaSelecionadaId || alt.id === alternativaSelecionadaId || alt.valor === alternativaSelecionadaId);
        let etiologiaErro = alternativaAlvo ? (alternativaAlvo.misconception || alternativaAlvo.categoria || 'ERRO_GENERICO').toUpperCase() : 'ERRO_GENERICO';
        
        const estagioAtual = (metadadosSensor.estagioGalperin || 'INTERNA_PURA').toUpperCase();
        const bncc = metadadosSensor.bncc || "GERAL";
        const hab = this._inicializarHabilidade(perfil, bncc);
        hab.itensRespondidos++;

        // -------------------------------------------------------------
        // 🧩 MOTOR DE TRANSFERÊNCIA CONCEITUAL
        // -------------------------------------------------------------
        const contextoADA = metadadosSensor.contextoADA;
        const repAtiva = contextoADA ? contextoADA.representacaoForcada : (metadadosSensor.representacao || 'visual');
        const isAbstrata = repAtiva.includes('abstrato') || repAtiva.includes('SIMBOLICO') || repAtiva === 'reta';
        const categoriaRep = isAbstrata ? 'abstrata' : 'visual';

        hab.evidenciasConceituais[categoriaRep].total++;
        if (ehCorreto) hab.evidenciasConceituais[categoriaRep].acertos++;

        if (contextoADA && contextoADA.foiChoqueSemiotico) {
            if (ehCorreto) {
                hab.evidenciasConceituais.transferenciasBemSucedidas++;
            } else {
                hab.evidenciasConceituais.transferenciasFalhadas++;
            }

            hab.evidenciasConceituais.historicoTransferencia.push({
                data: new Date().toISOString(),
                original: contextoADA.representacaoOriginal,
                forcado: contextoADA.representacaoForcada,
                correto: ehCorreto,
                latencia: latenciaMs
            });
        }

        // MANUTENÇÃO DA EMBOSCADA GLOBAL
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

        this._computarPesosPerfis(perfil, latenciaMs, ehCorreto, estagioAtual);
        this._computarPesosPerfis(hab, latenciaMs, ehCorreto, estagioAtual);

        this._estabilizarPerfilDominante(perfil); 
        this._estabilizarPerfilDominanteDaHabilidade(hab); 
        this._avaliarEstagioConceitual(hab, perfil);       

        this._avaliarZDP(hab); 
        this._calcularConfiancaInferencial(perfil); 
        this._registrarSnapshotTemporal(perfil); 

        this._estadosEstudantes.set(estudanteId, perfil);
        this._salvarLocal(estudanteId, perfil);

        return {
            estudanteId: perfil.id,
            perfilDominante: perfil.perfilDominante,
            estagioConceitualAtual: hab.evidenciasConceituais.estagioConceitual, 
            indiceTransferenciaConceitual: hab.evidenciasConceituais.indiceTransferenciaConceitual,
            derivaPedagogicaGeral: perfil.derivaPedagogicaGeral,
            confiancaIA: perfil.confiancaDiagnostica, 
            sugestaoAcaoADA: this._gerarDiretrizIntervencaoADA(perfil, hab, etiologiaErro),
            timestampProcessamento: new Date().toISOString(),
            perfilCompleto: perfil 
        };
    }

    // =========================================================
    // 🧠 CAMADA B: MOTOR COMPUTACIONAL DE FORMAÇÃO DE CONCEITOS
    // =========================================================
    
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

    _avaliarEstagioConceitual(hab, perfilGlobal) {
        const ev = hab.evidenciasConceituais;
        const totalEvidencias = ev.visual.total + ev.abstrata.total;
        const totalTransferencias = ev.transferenciasBemSucedidas + ev.transferenciasFalhadas;

        // Trava científica
        if (totalEvidencias < this._CONFIG.MASSA_CRITICA_CONCEITUAL || totalTransferencias < 2) {
            this._atualizarEstagioConceitual(hab, "EVIDENCIA_INSUFICIENTE");
            return;
        }

        const txVisual = ev.visual.total > 0 ? (ev.visual.acertos / ev.visual.total) : 0;
        const txAbstrata = ev.abstrata.total > 0 ? (ev.abstrata.acertos / ev.abstrata.total) : 0;
        const txTransferencia = totalTransferencias > 0 ? (ev.transferenciasBemSucedidas / totalTransferencias) : 0;
        
        ev.indiceDependenciaVisual = Math.max(0, txVisual - txAbstrata);
        
        // Cálculo do ITC com pesos configuráveis
        const itcBruto = (
            (txAbstrata * this._CONFIG.PESO_ITC_ABSTRACAO) + 
            (txTransferencia * this._CONFIG.PESO_ITC_TRANSFERENCIA) + 
            ((1 - ev.indiceDependenciaVisual) * this._CONFIG.PESO_ITC_INDEPENDENCIA)
        );
        ev.indiceTransferenciaConceitual = Number(itcBruto.toFixed(2));

        this._calcularEstabilidade(ev);

        // Inferência baseada em limiares configuráveis (versão final)
        let novoEstagio = ev.estagioConceitual;

        if (ev.indiceTransferenciaConceitual >= this._CONFIG.LIMIAR_GENERALIZACAO && 
            ev.indiceEstabilidadeConceitual >= this._CONFIG.LIMIAR_ESTABILIDADE_CONCEITUAL) {
            novoEstagio = "GENERALIZACAO_CONSOLIDADA";
        } 
        else if (ev.indiceTransferenciaConceitual >= this._CONFIG.LIMIAR_PSEUDOCONCEITO && 
                 ev.indiceTransferenciaConceitual < this._CONFIG.LIMIAR_GENERALIZACAO) {
            novoEstagio = "EM_TRANSICAO_CONCEITUAL";
        } 
        else if (ev.indiceTransferenciaConceitual < this._CONFIG.LIMIAR_PSEUDOCONCEITO) {
            novoEstagio = "PSEUDOCONCEITO_ESTAVEL";
        }

        this._atualizarEstagioConceitual(hab, novoEstagio);
    }

    _atualizarEstagioConceitual(hab, novoEstagio) {
        const ev = hab.evidenciasConceituais;
        if (ev.estagioConceitual !== novoEstagio) {
            ev.trajetoriaConceitual.push({
                data: new Date().toISOString(),
                de: ev.estagioConceitual,
                para: novoEstagio,
                itc: ev.indiceTransferenciaConceitual,
                modelo: this._CONFIG.VERSAO_MODELO_CONCEITUAL // Rastreamento de versão
            });
            ev.estagioConceitual = novoEstagio;
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

    // 🧠 CIRURGIA 7: Confiança Inferencial afetada por Estabilidade Conceitual
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

        // Distribuição de pesos: 40% Volume, 30% Consistência do Perfil, 30% Estabilidade Conceitual
        const confianca = (pesoVolume * 0.4) + (pesoConsistencia * 0.3) + (pesoEstabilidade * 0.3);
        perfil.confiancaDiagnostica = parseFloat((confianca * 100).toFixed(1));
    }

    _gerarDiretrizIntervencaoADA(perfil, hab, etiologiaErro) {
        const d = { comandoMacro: 'PADRAO', scaffoldAlvo: 'NENHUM' };
        if (perfil.confiancaDiagnostica < 30.0) return d; 

        if (hab.errosSequenciais >= 2) {
            d.comandoMacro = 'REDUZIR_CARGA_COGNITIVA';
            d.scaffoldAlvo = 'ATIVAR_REPRESENTACAO_CONCRETA';
            return d;
        }

        if (hab.perfilDominante === 'IMPULSIVO_ARITMETICO') { d.comandoMacro = 'INJECT_RHYTHMIC_LOCK'; d.scaffoldAlvo = 'VERBALIZATION_PROMPT'; }
        else if (hab.perfilDominante === 'PROCEDURAL_MECANICO') { d.comandoMacro = 'FORCE_SEMIOTIC_TRANSITION'; d.scaffoldAlvo = 'CONCRETE_SCHEMATIZATION'; }
        else if (hab.perfilDominante === 'DEPENDENTE_CONCRETO') { d.comandoMacro = 'TRIGGER_CONTROLLED_FADING'; d.scaffoldAlvo = 'ORIENTATION_CARD'; }
        
        if (perfil.indicePseudoconceito >= 0.6 || hab.evidenciasConceituais.estagioConceitual === 'PSEUDOCONCEITO_ESTAVEL') {
            d.comandoMacro = 'FORCE_SEMIOTIC_TRANSITION';
            d.scaffoldAlvo = 'CONCEPTUAL_RESET';
        }
        
        return d;
    }
}
