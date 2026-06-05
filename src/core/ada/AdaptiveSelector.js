/**
 * @fileoverview AdaptiveSelector.js
 * @description O Tutor Cirúrgico da ADA. Ponte Executora e Orquestradora Semiótica.
 * VERSÃO 12.4.0 (Sprint Limpo - Homologado): Substituição de variáveis globais (window) 
 * por injeção de dependência via contextoAdaptativo do GameState.
 * @package LabTech / Core ADA
 */

import { REPRESENTACOES_SEMIOTICAS, MAPEADOR_REPRESENTACAO_UI, INTERFACE_RENDERERS } from './ContratosPedagogicos.js';

export class AdaptiveSelector {
    
    static limparHistoricoSessao() {
        if (window.__LABTECH_DEBUG__) {
            window.__LABTECH_DEBUG__.jumpDelta = 0;
            console.log("[ADA] Histórico transitório de sessão limpo.");
        }
    }

    /**
     * 🧠 Filtro Tático (Camada Executora de Produção)
     * @private
     */
    static _aplicarFiltrosTaticos(candidatos, intensidade, faseGalperin) {
        if (!candidatos || candidatos.length === 0) return [];

        switch (intensidade) {
            case "MÍNIMA":
                return candidatos.filter(item => item.cargaCognitiva === "BAIXA" || item.dificuldade === 1);
                
            case "ALTA":
            case "CRÍTICA":
                return candidatos.filter(item => 
                    item.fase_galperin === faseGalperin || 
                    item.exigeLeituraAtenta === true || 
                    item.cargaCognitiva === "ALTA"
                );
                
            case "MODERADA":
            case "BAIXA":
            default:
                return candidatos.filter(item => item.cargaCognitiva !== "ALTA");
        }
    }

    /**
     * 👁️‍🗨️ Busca por Irmandade Semiótica Estrita
     * @private
     */
    static _selecionarIrmaSemiotica(banco, familiaId, representacaoAlvo, representacaoOrigem, respondidas) {
        let irmas = banco.filter(q => {
            const fId = q.familiaInvarianteId || q.familia_alvo || q.familiaAlvo;
            const repItem = (q.representacaoPrincipal || q.representacao || "VISUAL").toUpperCase();
            
            return (
                String(fId) === String(familiaId) && 
                repItem === representacaoAlvo && 
                repItem !== representacaoOrigem // Trava Antiloop: Evita colisão/repetição
            );
        });

        if (irmas.length === 0) return null;

        let irmasIneditas = irmas.filter(q => !respondidas.includes(q.id) && !respondidas.includes(q.id_questao));
        if (irmasIneditas.length === 0) irmasIneditas = irmas; 

        return irmasIneditas[Math.floor(Math.random() * irmasIneditas.length)];
    }

    /**
     * Seleciona a próxima tarefa injetando o resultado no contexto adaptativo da sessão.
     * @param {string|number} blockId - ID do bloco ou BNCC.
     * @param {Object} perfilCognitivo - Estado do estudante.
     * @param {Object} planoChanceladoBOA - Plano da Base Orientadora.
     * @param {Object} contextoAdaptativo - Objeto injetado pelo main.js para rastreio de estado puro.
     */
    static selecionarProximaQuestao(blockId, perfilCognitivo, planoChanceladoBOA = null, contextoAdaptativo = {}) {
        const bancoGlobal = window.catalogoGlobalDeQuestoes || [];
        
        if (bancoGlobal.length === 0) {
            return { id: 'MOCK_ERR', bloco: blockId, enunciado: 'Catálogo vazio.', alternativas: [] };
        }
        
        if (!perfilCognitivo) perfilCognitivo = {};
        if (!perfilCognitivo.historicoQuestoesRespondidas) perfilCognitivo.historicoQuestoesRespondidas = [];
        const respondidas = perfilCognitivo.historicoQuestoesRespondidas;

        // Limpeza de estado: pressupõe que o choque não ocorreu até confirmação física
        contextoAdaptativo.choqueExecutado = false;
        
        // Lê a origem de forma pura via referência injetada
        const questaoAnterior = contextoAdaptativo.questaoOrigem;
        const repOrigem = questaoAnterior ? (questaoAnterior.representacaoPrincipal || questaoAnterior.representacao || 'VISUAL').toUpperCase() : null;

        let repAlvoChoque = null;
        if (planoChanceladoBOA && planoChanceladoBOA.representacaoDestinoChoque) {
            repAlvoChoque = MAPEADOR_REPRESENTACAO_UI[planoChanceladoBOA.representacaoDestinoChoque] || planoChanceladoBOA.representacaoDestinoChoque;
        }

        // ⚡ EXTRA-PRIORIDADE: Execução do Choque Semiótico com Injeção de Confirmação Local
        if (planoChanceladoBOA && planoChanceladoBOA.choqueSemioticoRecomendado && questaoAnterior && repAlvoChoque) {
            const familiaInvarianteId = questaoAnterior.familiaInvarianteId || questaoAnterior.familia_alvo || questaoAnterior.familiaAlvo;
            
            if (familiaInvarianteId) {
                const itemIrmao = this._selecionarIrmaSemiotica(bancoGlobal, familiaInvarianteId, repAlvoChoque, repOrigem, respondidas);
                if (itemIrmao) {
                    // Cache de confirmação acoplado exclusivamente ao Contexto Local Injetado
                    contextoAdaptativo.choqueExecutado = true;
                    
                    const idRegistrar = itemIrmao.id || itemIrmao.id_questao || 'ERR_ID';
                    respondidas.push(idRegistrar);
                    return itemIrmao;
                }
            }
        }

        // Fluxo ZDP normal (fallback)
        let poolDoBloco = bancoGlobal.filter(q => 
            String(q.bloco) === String(blockId) || 
            String(q.codigoBNCC) === String(blockId) ||
            String(q.conceitoEstrutural) === String(blockId)
        );
        if (poolDoBloco.length === 0) poolDoBloco = bancoGlobal;

        let itensIneditos = poolDoBloco.filter(q => !respondidas.includes(q.id) && !respondidas.includes(q.id_questao));
        if (itensIneditos.length === 0) {
            const idsBloco = poolDoBloco.map(q => q.id || q.id_questao);
            perfilCognitivo.historicoQuestoesRespondidas = respondidas.filter(id => !idsBloco.includes(id));
            itensIneditos = poolDoBloco; 
        }

        let poolZDP = itensIneditos.filter(q => {
            const conceito = q.conceitoEstrutural || "GERAL";
            const zdpLocal = perfilCognitivo.habilidades?.[conceito]?.zdp?.atual || perfilCognitivo.habilidades?.[blockId]?.zdp?.atual || 1; 
            const dificuldadeItem = q.dificuldade || q.nivel || 1;
            return dificuldadeItem === zdpLocal;
        });

        if (poolZDP.length === 0) poolZDP = itensIneditos;
        let poolSorteio = poolZDP;

        let repPreferencialBOA = "QUALQUER";
        if (planoChanceladoBOA && planoChanceladoBOA.representacaoPreferencial) {
            repPreferencialBOA = MAPEADOR_REPRESENTACAO_UI[planoChanceladoBOA.representacaoPreferencial] || planoChanceladoBOA.representacaoPreferencial;
        }

        if (planoChanceladoBOA && planoChanceladoBOA.executarIntervencao) {
            let candidatosSemiotic = poolZDP.filter(item => {
                const repItem = (item.representacaoPrincipal || item.representacao || "VISUAL").toUpperCase();
                return repPreferencialBOA === "QUALQUER" || repItem === repPreferencialBOA;
            });
            
            if (candidatosSemiotic.length === 0) candidatosSemiotic = poolZDP;

            poolSorteio = this._aplicarFiltrosTaticos(candidatosSemiotic, planoChanceladoBOA.intensidadeMediacao, planoChanceladoBOA.faseGalperin);
            if (poolSorteio.length === 0) poolSorteio = candidatosSemiotic; 
        }

        const proximaQuestao = poolSorteio[Math.floor(Math.random() * poolSorteio.length)];
        const idRegistrar = proximaQuestao.id || proximaQuestao.id_questao || 'ERR_ID';
        respondidas.push(idRegistrar);
        
        return proximaQuestao;
    }

    /**
     * Envelopa o item consumindo estritamente as propriedades do contextoAdaptativo injetado.
     */
    static prepararTarefaParaInterface(questaoSelecionada, planoChanceladoBOA = null, contextoAdaptativo = {}) {
        if (!questaoSelecionada) return null;

        const repOriginalItem = (questaoSelecionada.representacaoPrincipal || questaoSelecionada.representacao || 'VISUAL').toUpperCase();
        let repForcadaUI = repOriginalItem;
        
        // Lê a flag de execução física direta do Contexto
        const choqueEfetivamenteExecutado = !!contextoAdaptativo.choqueExecutado;
        const questaoAnterior = contextoAdaptativo.questaoOrigem;

        let contextoADAOutput = {};

        if (planoChanceladoBOA && planoChanceladoBOA.executarIntervencao) {
            if (choqueEfetivamenteExecutado && planoChanceladoBOA.representacaoDestinoChoque) {
                repForcadaUI = MAPEADOR_REPRESENTACAO_UI[planoChanceladoBOA.representacaoDestinoChoque] || repOriginalItem;
            } else {
                repForcadaUI = MAPEADOR_REPRESENTACAO_UI[planoChanceladoBOA.representacaoPreferencial] || repOriginalItem;
            }

            if (repForcadaUI === "QUALQUER") repForcadaUI = repOriginalItem;

            contextoADAOutput = {
                representacaoOriginal: questaoAnterior ? (questaoAnterior.representacaoPrincipal || questaoAnterior.representacao || 'VISUAL').toUpperCase() : repOriginalItem,
                representacaoForcada: repForcadaUI,
                
                // Variável limpa baseada no sucesso mecânico da busca no banco
                foiChoqueSemiotico: choqueEfetivamenteExecutado, 
                choqueSemioticoAtivado: choqueEfetivamenteExecutado,
                
                faseGalperinEfetiva: planoChanceladoBOA.faseGalperin,
                intensidadeAplicada: planoChanceladoBOA.intensidadeMediacao,
                objetivoDaIntervencao: planoChanceladoBOA.objetivoDaIntervencao,
                scaffoldOperacional: planoChanceladoBOA.scaffoldOperacional,
                perguntaInvariante: planoChanceladoBOA.perguntaInvariante,
                acaoReflexiva: planoChanceladoBOA.acaoReflexiva,
                gatilhoVisual: planoChanceladoBOA.gatilhoVisual,
                statusBOA: planoChanceladoBOA.chancelaBOA?.statusCalculo || "ZDP_OTIMIZADA",
                motivoDecisaoXAI: planoChanceladoBOA.chancelaBOA?.motivoDaDecisao || "Mediação ativa chancelada."
            };
        } else {
            contextoADAOutput = {
                representacaoOriginal: repOriginalItem,
                representacaoForcada: repOriginalItem,
                foiChoqueSemiotico: false,
                faseGalperinEfetiva: "MENTAL_ABSTRATA",
                intensidadeAplicada: "NENHUMA",
                choqueSemioticoAtivado: false,
                scaffoldOperacional: null,
                statusBOA: "PRODUÇÃO_AUTÔNOMA",
                motivoDecisaoXAI: "Estudante opera em autonomia estável de conceito."
            };
        }

        return {
            ...questaoSelecionada,
            id_questao: questaoSelecionada.id_questao || questaoSelecionada.id,
            contextoADA: contextoADAOutput,
            interfaceModifiers: {
                modoRepresentacao: repForcadaUI.toLowerCase(),
                renderizadorUI: INTERFACE_RENDERERS[repForcadaUI] || "canvas_esquema_grafico",
                forcarGatilhoUI: contextoADAOutput.gatilhoVisual,
                exibirPainelScaffold: planoChanceladoBOA ? planoChanceladoBOA.executarIntervencao : false
            }
        };
    }

    static async carregarBancoDeQuestoes() {
        try {
            const resposta = await fetch('./src/data/questoes.json');
            if (!resposta.ok) throw new Error("Ficheiro json não localizado.");
            const dados = await resposta.json();
            window.catalogoGlobalDeQuestoes = dados;
            return dados;
        } catch (erro) {
            console.warn("[ADA] Fallback carregado.", erro);
            window.catalogoGlobalDeQuestoes = [];
            return [];
        }
    }
}
