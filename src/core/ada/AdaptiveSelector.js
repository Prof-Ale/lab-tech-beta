/**
 * @fileoverview AdaptiveSelector.js
 * @description Executor da Interface ADA e Orquestrador Semiótico.
 * VERSÃO 12.1.0 (Sprint Limpo): Acoplamento estrito à Ontologia 6.0.0 e BOA v2.2.
 * Executa Choques Semióticos controlados via Famílias Invariantes e unifica telemetria.
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
                return candidatos.filter(item => item.cargaCognitiva === "BAIXA" || item.dificuldade_interna === "FACIL");
                
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
     * 👁️‍🗨️ Mecanismo de Busca por Irmandade Semiótica
     * Localiza uma questão com a mesma invariante conceitual, porém com a representação destino exigida.
     * @private
     */
    static _selecionarIrmaSemiotica(banco, familiaId, representacaoDestino, respondidas) {
        // Encontra candidatas da mesma família invariante com a representação alvo
        let irmas = banco.filter(q => {
            const fId = q.familiaInvarianteId || q.familia_alvo || q.familiaAlvo;
            const repItem = (q.representacaoPrincipal || q.representacao || "VISUAL").toUpperCase();
            return String(fId) === String(familiaId) && repItem === representacaoDestino;
        });

        if (irmas.length === 0) return null;

        // Prioriza as inéditas para evitar loops
        let irmasIneditas = irmas.filter(q => !respondidas.includes(q.id) && !respondidas.includes(q.id_questao));
        if (irmasIneditas.length === 0) irmasIneditas = irmas; // Recicla se necessário

        return irmasIneditas[Math.floor(Math.random() * irmasIneditas.length)];
    }

    /**
     * Busca a próxima questão ideal no banco baseada na ZDP e no plano chancelado pela BOA.
     * @param {string|number} blockId - ID do Bloco de Diagnóstico Ativo ou Código BNCC.
     * @param {Object} perfilCognitivo - O Estado longitudinal vindo do ProfileEngine.
     * @param {Object} planoChanceladoBOA - O plano de mediação gerado pela BOA v2.2.0.
     * @param {Object} questaoAtual - A última questão respondida pelo aluno (origem do choque).
     */
    static selecionarProximaQuestao(blockId, perfilCognitivo, planoChanceladoBOA = null, questaoAtual = null) {
        const bancoGlobal = window.catalogoGlobalDeQuestoes || [];
        
        if (bancoGlobal.length === 0) {
            return { id: 'MOCK_01', bloco: blockId, enunciado: 'Carregando...', alternativas: [{id_alternativa: 'alt_a', texto: 'A'}] };
        }
        
        if (!perfilCognitivo) perfilCognitivo = {};
        if (!perfilCognitivo.historicoQuestoesRespondidas) perfilCognitivo.historicoQuestoesRespondidas = [];
        const respondidas = perfilCognitivo.historicoQuestoesRespondidas;

        // Traduz a representação solicitada pela BOA usando o contrato ontológico único
        let repPreferencialBOA = "QUALQUER";
        if (planoChanceladoBOA && planoChanceladoBOA.representacaoPreferencial) {
            repPreferencialBOA = MAPEADOR_REPRESENTACAO_UI[planoChanceladoBOA.representacaoPreferencial] || planoChanceladoBOA.representacaoPreferencial;
        }

        // ⚡ CRITÉRIO DE ULTRA-PRIORIDADE: Execução do Choque Semiótico Controlado
        if (planoChanceladoBOA && planoChanceladoBOA.choqueSemioticoRecomendado && questaoAtual) {
            const familiaInvarianteId = questaoAtual.familiaInvarianteId || questaoAtual.familia_alvo || questaoAtual.familiaAlvo;
            
            if (familiaInvarianteId) {
                const questaoIrma = this._selecionarIrmaSemiotica(bancoGlobal, familiaInvarianteId, repPreferencialBOA, respondidas);
                if (questaoIrma) {
                    const idRegistrar = questaoIrma.id || questaoIrma.id_questao || 'ERR_ID';
                    respondidas.push(idRegistrar);
                    return questaoIrma;
                }
            }
        }

        // Fluxo de Sorteio Padrão Orientado à ZDP (Se não for choque ou falhar a busca por irmã)
        let questoesDoBloco = bancoGlobal.filter(q => 
            String(q.bloco) === String(blockId) || 
            String(q.modulo) === String(blockId) || 
            String(q.codigoBNCC) === String(blockId) ||
            String(q.conceitoEstrutural) === String(blockId)
        );
        if (questoesDoBloco.length === 0) questoesDoBloco = bancoGlobal;

        let questoesIneditas = questoesDoBloco.filter(q => !respondidas.includes(q.id) && !respondidas.includes(q.id_questao));
        if (questoesIneditas.length === 0) {
            const idsDoBloco = questoesDoBloco.map(q => q.id || q.id_questao);
            perfilCognitivo.historicoQuestoesRespondidas = respondidas.filter(id => !idsDoBloco.includes(id));
            questoesIneditas = questoesDoBloco; 
        }

        // Alinhamento estrutural por Proficiência / Conceito Estrutural
        let poolZDP = questoesIneditas.filter(q => {
            const conceito = q.conceitoEstrutural || "GERAL";
            const zdpLocal = perfilCognitivo.habilidades?.[conceito]?.zdp?.atual || perfilCognitivo.habilidades?.[blockId]?.zdp?.atual || 1; 
            const dificuldadeItem = q.dificuldade || q.nivel || 1;
            return dificuldadeItem === zdpLocal;
        });

        if (poolZDP.length === 0) poolZDP = questoesIneditas;

        let poolSorteio = poolZDP;

        // Filtro Semiótico e Tático Ordinário (Sem Choque)
        if (planoChanceladoBOA && planoChanceladoBOA.executarIntervencao) {
            let candidatosSemiotic = poolZDP.filter(item => {
                const repItem = (item.representacaoPrincipal || item.representacao || "VISUAL").toUpperCase();
                return repPreferencialBOA === "QUALQUER" || repItem === repPreferencialBOA;
            });
            
            if (candidatosSemiotic.length === 0) candidatosSemiotic = poolZDP;

            poolSorteio = this._aplicarFiltrosTaticos(candidatosSemiotic, planoChanceladoBOA.intensidadeMediacao, planoChanceladoBOA.faseGalperin);
            if (poolSorteio.length === 0) poolSorteio = candidatosSemiotic; 
        }

        const proxima = poolSorteio[Math.floor(Math.random() * poolSorteio.length)];
        const idRegistrar = proxima.id || proxima.id_questao || 'ERR_ID';
        respondidas.push(idRegistrar);
        
        return proxima;
    }

    /**
     * Envelopa a tarefa convertendo metadados cognitivos em flags explícitas para os renderizadores da UI.
     * Garantia de compatibilidade estrita com a telemetria do ProfileEngine.
     */
    static prepararTarefaParaInterface(questaoSelecionada, planoChanceladoBOA = null, questaoAnterior = null) {
        if (!questaoSelecionada) return null;

        const repOriginalItem = (questaoSelecionada.representacaoPrincipal || questaoSelecionada.representacao || 'VISUAL').toUpperCase();
        let repForcadaUI = repOriginalItem;
        let foiChoqueSemiotico = false;
        let contextoADAOutput = {};

        if (planoChanceladoBOA && planoChanceladoBOA.executarIntervencao) {
            const repTraduzidaBOA = MAPEADOR_REPRESENTACAO_UI[planoChanceladoBOA.representacaoPreferencial] || planoChanceladoBOA.representacaoPreferencial;
            repForcadaUI = repTraduzidaBOA !== "QUALQUER" ? repTraduzidaBOA : repOriginalItem;
            foiChoqueSemiotico = !!planoChanceladoBOA.choqueSemioticoRecomendado;

            contextoADAOutput = {
                representacaoOriginal: questaoAnterior ? (questaoAnterior.representacaoPrincipal || questaoAnterior.representacao || 'VISUAL').toUpperCase() : repOriginalItem,
                representacaoForcada: repForcadaUI,
                foiChoqueSemiotico: foiChoqueSemiotico,
                faseGalperinEfetiva: planoChanceladoBOA.faseGalperin,
                intensidadeAplicada: planoChanceladoBOA.intensidadeMediacao,
                choqueSemioticoAtivado: foiChoqueSemiotico, // Retrocompatibilidade de exibição
                
                objetivoDaIntervencao: planoChanceladoBOA.objetivoDaIntervencao,
                scaffoldOperacional: planoChanceladoBOA.scaffoldOperacional,
                perguntaInvariante: planoChanceladoBOA.perguntaInvariante,
                acaoReflexiva: planoChanceladoBOA.acaoReflexiva,
                gatilhoVisual: planoChanceladoBOA.gatilhoVisual,
                
                statusBOA: planoChanceladoBOA.chancelaBOA?.statusCalculo || "SUCESSO",
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
                perguntaInvariante: null,
                gatilhoVisual: null,
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
            const resposta = await fetch('./questoes.json');
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
