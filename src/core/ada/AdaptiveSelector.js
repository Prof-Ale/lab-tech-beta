/**
 * @fileoverview AdaptiveSelector.js
 * @description O Tutor Cirúrgico da ADA. Motor Experimental de Diagnóstico e Transferência.
 * EVOLUÇÃO 10.6.0: Consumidor puro do ProfileEngine (XAI) + Telemetria Granular + Alternância Determinística.
 * @package LabTech / Core ADA
 */

export class AdaptiveSelector {
    
    static limparHistoricoSessao() {
        if (window.__LABTECH_DEBUG__) {
            window.__LABTECH_DEBUG__.jumpDelta = 0;
            console.log("[ADA] Histórico transitório de sessão limpo.");
        }
    }

    /**
     * Helper determinístico para substituir a aleatoriedade (Math.random) no treino de transferência.
     * Analisa o histórico recente de representações para forçar a alternância estruturada.
     */
    static _deveAlternarParaAbstrato(historicoRepresentacoes = []) {
        if (historicoRepresentacoes.length < 2) return false;
        const ultimasDuas = historicoRepresentacoes.slice(-2);
        // Se as duas últimas foram visuais, força abstrato (e vice-versa).
        return ultimasDuas.every(rep => rep === 'visual');
    }

    /**
     * 🧠 MOTOR EXPERIMENTAL (Camada B)
     * Agora retorna um Objeto de Decisão Completo (Payload Auditável) em vez de apenas uma string.
     * Consome estritamente o Estágio Conceitual, sem recalcular limites matemáticos de ITC.
     */
    static determinarEstrategiaIntervencao(perfilCognitivo, questaoAtual) {
        const repPadrao = questaoAtual.representacao || questaoAtual.suporteVisual || 'visual';
        const bncc = questaoAtual.bncc || "GERAL";
        const hab = perfilCognitivo?.habilidades?.[bncc];

        // Objeto de Decisão Padrão (Manutenção)
        let decisaoADA = {
            representacao: repPadrao,
            tipoIntervencao: "MANUTENCAO",
            motivo: "EVIDENCIA_INSUFICIENTE_OU_ZDP_PADRAO",
            estagioConceitual: "EVIDENCIA_INSUFICIENTE",
            itc: 0.0
        };

        if (!perfilCognitivo) return decisaoADA;

        // 🛟 Scaffold de Emergência (Prioridade de Sobrevivência/Engajamento)
        if (hab && hab.errosSequenciais >= 2) {
            decisaoADA.representacao = 'visual';
            decisaoADA.tipoIntervencao = "SCAFFOLD_EMERGENCIA";
            decisaoADA.motivo = "ALTA_FRUSTRACAO_COGNITIVA";
            return decisaoADA;
        }

        // =========================================================
        // 🔬 EXPERIMENTOS DE INFERÊNCIA CONCEITUAL (Consumidor Puro)
        // =========================================================
        const estagioConceitual = hab?.evidenciasConceituais?.estagioConceitual || "EVIDENCIA_INSUFICIENTE";
        decisaoADA.estagioConceitual = estagioConceitual;
        decisaoADA.itc = hab?.evidenciasConceituais?.indiceTransferenciaConceitual ?? 0.0;

        if (estagioConceitual !== "EVIDENCIA_INSUFICIENTE") {
            
            switch (estagioConceitual) {
                case "GENERALIZACAO_CONSOLIDADA":
                    decisaoADA.representacao = repPadrao; // Minimiza intervenção.
                    decisaoADA.tipoIntervencao = "EXPANSAO";
                    decisaoADA.motivo = "GENERALIZACAO_CONSOLIDADA";
                    return decisaoADA;

                case "EM_TRANSICAO_CONCEITUAL":
                    // Substitui a aleatoriedade por alternância controlada
                    const historico = hab?.evidenciasConceituais?.historicoRepresentacoes || [];
                    const forcarAbstrato = this._deveAlternarParaAbstrato(historico);
                    
                    decisaoADA.representacao = forcarAbstrato ? "abstrato" : "visual";
                    decisaoADA.tipoIntervencao = "TRANSFERENCIA";
                    decisaoADA.motivo = "TRANSICAO_CONCEITUAL";
                    return decisaoADA;

                case "PSEUDOCONCEITO_ESTAVEL":
                    decisaoADA.representacao = "abstrato"; 
                    decisaoADA.tipoIntervencao = "DIAGNOSTICO"; 
                    decisaoADA.motivo = "QUEBRA_DE_PSEUDOCONCEITO";
                    return decisaoADA;
            }
        }

        // =========================================================
        // 🛠️ FALLBACK OPERACIONAL (Camada A)
        // =========================================================
        const perfilLocal = hab?.perfilDominante || perfilCognitivo.perfilDominante || 'INDEFINIDO';

        if (perfilLocal === 'DEPENDENTE_CONCRETO') {
            decisaoADA.representacao = 'visual';
            decisaoADA.tipoIntervencao = "SCAFFOLD_PERFIL";
            decisaoADA.motivo = "PERFIL_DEPENDENTE_CONCRETO";
        } else if (perfilLocal === 'PROCEDURAL_MECANICO' && (hab?.acertos || 0) > 3) {
            decisaoADA.representacao = 'abstrato';
            decisaoADA.tipoIntervencao = "DESMAME_SEMIOTICO";
            decisaoADA.motivo = "PREVENCAO_MECANIZACAO";
        }

        return decisaoADA;
    }

    /**
     * Busca a próxima questão ideal no banco baseada na ZDP Específica da Habilidade (BNCC).
     */
    static selecionarProximaQuestao(blockId, perfilCognitivo) {
        // [CÓDIGO MANTIDO IGUAL À V10.5 - Gerenciamento de ZDP e PoolSorteio]
        // ... (Para brevidade na visualização, o bloco interno é idêntico)
        const bancoGlobal = window.catalogoGlobalDeQuestoes || [];
        
        if (bancoGlobal.length === 0) return { id: 'MOCK', display: 'Banco não carregado.', alternativas: [{valor: 'A'}], res: 'A' };
        if (!perfilCognitivo) perfilCognitivo = {};
        if (!perfilCognitivo.historicoQuestoesRespondidas) perfilCognitivo.historicoQuestoesRespondidas = [];

        let questoesDoBloco = bancoGlobal.filter(q => String(q.bloco) === String(blockId));
        if (questoesDoBloco.length === 0) questoesDoBloco = bancoGlobal;

        let questoesIneditas = questoesDoBloco.filter(q => !perfilCognitivo.historicoQuestoesRespondidas.includes(q.id));

        if (questoesIneditas.length === 0) {
            const idsDoBloco = questoesDoBloco.map(q => q.id);
            perfilCognitivo.historicoQuestoesRespondidas = perfilCognitivo.historicoQuestoesRespondidas.filter(id => !idsDoBloco.includes(id));
            questoesIneditas = questoesDoBloco; 
        }

        let poolSorteio = questoesIneditas.filter(q => {
            const bncc = q.bncc || "GERAL";
            const zdpLocal = perfilCognitivo.habilidades?.[bncc]?.zdp?.atual || 1; 
            return q.dificuldade === zdpLocal;
        });

        if (poolSorteio.length === 0) {
            poolSorteio = questoesIneditas.filter(q => {
                const bncc = q.bncc || "GERAL";
                const zdpLocal = perfilCognitivo.habilidades?.[bncc]?.zdp?.atual || 1;
                return Math.abs(q.dificuldade - zdpLocal) <= 1; 
            });
        }

        if (poolSorteio.length === 0) poolSorteio = questoesIneditas;

        const proxima = poolSorteio[Math.floor(Math.random() * poolSorteio.length)];
        perfilCognitivo.historicoQuestoesRespondidas.push(proxima.id);
        
        return proxima;
    }

    /**
     * Retorna o pacote completo da próxima tarefa com Telemetria Auditável (XAI).
     */
    static selecionarProximaTarefa(gameState, poolDeTarefas) {
        const perfilCompleto = gameState?.perfilCognitivo || {};
        const questao = poolDeTarefas[0] || {};
        
        const repPadrao = questao.representacao || questao.suporteVisual || 'visual';
        
        // Recebe o Payload Auditável completo
        const decisao = this.determinarEstrategiaIntervencao(perfilCompleto, questao);
        
        // Empacota o contextoADA nativo
        const contextoADA = {
            representacaoOriginal: repPadrao,
            representacaoSelecionada: decisao.representacao,
            tipoIntervencao: decisao.tipoIntervencao,
            motivo: decisao.motivo,
            estagioConceitualOrigem: decisao.estagioConceitual,
            itcOrigem: decisao.itc,
            modeloConceitual: "ITC_v2" // Atualizado
        };

        return {
            ...questao, 
            taskId: questao.id || 'default',
            contextoADA: contextoADA,
            interfaceModifiers: {
                modoRepresentacao: decisao.representacao
            }
        };
    }

    static async carregarBancoDeQuestoes() {
        try {
            const resposta = await fetch('./data/questoes.json');
            if (!resposta.ok) throw new Error("Arquivo JSON não encontrado.");
            const dados = await resposta.json();
            window.catalogoGlobalDeQuestoes = dados;
            return dados;
        } catch (erro) {
            console.warn("[ADA] Falha ao carregar questoes.json. Usando banco vazio.", erro);
            window.catalogoGlobalDeQuestoes = [];
            return [];
        }
    }
}
