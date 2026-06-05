/**
 * @fileoverview AdaptiveSelector.js
 * @description Seletor Adaptativo de Itens baseado em Choque Semiótico e Fases de Galperin.
 * @package LabTech / Core Adaptive Layer
 */

export class AdaptiveSelector {
    /**
     * @param {Array} bancoQuestoes - Lista completa de questões do arquivo questoes.json
     */
    constructor(bancoQuestoes) {
        this.bancoQuestoes = bancoQuestoes;
        this.ordemRepresentacoes = ["CONCRETA", "VISUAL", "TEXTUAL", "ABSTRATA"];
    }

    /**
     * Seleciona o próximo item com base na resposta anterior e no estado atual da BOA.
     * @param {Object} perfilCognitivo - Perfil do estudante vindo do ProfileEngine.
     * @param {string} ultimaQuestaoId - ID da última questão respondida.
     * @param {boolean} foiAcerto - Indica se a última resposta foi correta.
     * @returns {Object} Próxima questão mapeada e metadados de mediação.
     */
    selecionarProximoItem(perfilCognitivo, ultimaQuestaoId, foiAcerto) {
        const questaoAtual = this.bancoQuestoes.find(q => q.id === ultimaQuestaoId);
        if (!questaoAtual) return this._obterItemInicial();

        const familiaId = questaoAtual.familiaInvarianteId;
        const representacaoAtual = questaoAtual.representacaoPrincipal;
        const indiceAtual = this.ordemRepresentacoes.indexOf(representacaoAtual);

        let proximaRepresentacao;
        let acaoMediacao;

        if (foiAcerto) {
            if (representacaoAtual === "ABSTRATA") {
                // Consolidação de Mastery Learning na Família Atual
                acaoMediacao = "CONSOLIDACAO_MASTERY";
                return this._avancarParaNovaFamilia(familiaId, perfilCognitivo);
            }
            // 🚀 CHOQUE SEMIÓTICO AVANÇADO: Sobe a barra de abstração mantendo o invariante
            proximaRepresentacao = this.ordemRepresentacoes[indiceAtual + 1];
            acaoMediacao = "FORCE_SEMIOTIC_TRANSITION";
        } else {
            // 🛡️ RECUO ESTRUTÉGICO (Scaffolding): Reduz nível semiótico para reorientar a ação
            if (indiceAtual === 0) {
                acaoMediacao = "TRIGGER_CONCEPTUAL_RESET";
                return this._oferecerItemAncoraSuporte(questaoAtual.codigoBNCC);
            }
            proximaRepresentacao = this.ordemRepresentacoes[indiceAtual - 1];
            acaoMediacao = "REDUCE_COGNITIVE_LOAD";
        }

        const proximaQuestao = this.bancoQuestoes.find(q => 
            q.familiaInvarianteId === familiaId && 
            q.representacaoPrincipal === proximaRepresentacao
        );

        // Fallback robusto caso não exista a variante exata no banco
        return proximaQuestao 
            ? { questao: proximaQuestao, acaoMediacao } 
            : { questao: this._obterItemInicial(), acaoMediacao: "FLUXO_PADRAO" };
    }

    /**
     * @private
     */
    _obterItemInicial() {
        return this.bancoQuestoes[0];
    }

    /**
     * @private
     */
    _avancarParaNovaFamilia(familiaAtualId, perfil) {
        const proximaQuestao = this.bancoQuestoes.find(q => 
            q.familiaInvarianteId !== familiaAtualId && 
            q.representacaoPrincipal === "CONCRETA"
        );
        return {
            questao: proximaQuestao || this._obterItemInicial(),
            acaoMediacao: "AVANCO_COMPREENSÃO_TEORICA"
        };
    }

    /**
     * @private
     */
    _oferecerItemAncoraSuporte(bncc) {
        // Retorna uma questão de nível/ano anterior (Recomposição da Aprendizagem)
        const questaoSuporte = this.bancoQuestoes.find(q => q.codigoBNCC !== bncc && q.dificuldade === 1);
        return {
            questao: questaoSuporte || this._obterItemInicial(),
            acaoMediacao: "RECONSTRUCAO_ESTRUTURAL"
        };
    }
}
