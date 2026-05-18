/**
 * @fileoverview AdaptiveSelector.js
 * @description Cérebro orquestrador da ADA. Seleciona a próxima tarefa, 
 * define a representação visual (DUA) e injeta scaffolds na ZDP do estudante.
 * @version 5.1.0
 * @package LabTech / Core ADA
 */

export class AdaptiveSelector {
    
    /**
     * Limpa o histórico transitório da sessão atual quando um novo bloco é iniciado.
     */
    static limparHistoricoSessao() {
        if (window.__LABTECH_DEBUG__) {
            window.__LABTECH_DEBUG__.jumpDelta = 0;
            console.log("[ADA] Histórico transitório de sessão limpo.");
        }
    }

    /**
     * Determina qual interface semiótica (visual, abstrata, reta) o Canvas deve renderizar.
     */
    static determinarRepresentacaoInterface(perfilCognitivo, comboAcertos, representacaoPadrao) {
        if (!perfilCognitivo) return representacaoPadrao || 'visual';

        const perfil = perfilCognitivo.perfilDominante || 'INDEFINIDO';

        if (perfil === 'DEPENDENTE_CONCRETO') {
            return 'visual';
        }
        
        if (perfil === 'PROCEDURAL_MECANICO' && comboAcertos > 3) {
            return 'abstrato';
        }

        return representacaoPadrao || 'visual';
    }

    /**
     * Busca a próxima questão ideal no banco baseada na ZDP do aluno.
     */
    static selecionarProximaQuestao(blockId, perfilCognitivo) {
        const bancoGlobal = window.catalogoGlobalDeQuestoes || [];
        
        if (bancoGlobal.length === 0) {
            console.warn("[ADA] Banco de questões vazio. Retornando mock.");
            return { id: 'MOCK', display: 'Banco não carregado.', alternativas: [{valor: 'A'}], res: 'A' };
        }

        // Filtra as questões do bloco atual
        let questoesValidas = bancoGlobal.filter(q => String(q.bloco) === String(blockId));
        
        // Se o bloco estiver vazio, usa o banco inteiro para não travar o jogo
        if (questoesValidas.length === 0) {
            questoesValidas = bancoGlobal;
        }

        // Trava anti-repetição
        const idUltimaQuestao = window.__LABTECH_DEBUG__?.qId;
        let poolSorteio = questoesValidas.filter(q => String(q.id) !== String(idUltimaQuestao));

        // Se esgotaram as questões exclusivas, reseta o pool
        if (poolSorteio.length === 0) {
            poolSorteio = questoesValidas;
        }

        // Sorteia a próxima
        const proxima = poolSorteio[Math.floor(Math.random() * poolSorteio.length)];
        
        // Atualiza o X-Ray
        if (window.__LABTECH_DEBUG__) {
            window.__LABTECH_DEBUG__.qId = proxima.id;
        }

        return proxima;
    }

    /**
     * Retorna o pacote completo da próxima tarefa.
     */
    static selecionarProximaTarefa(gameState, poolDeTarefas) {
        const perfil = gameState?.adaState?.perfilCognitivoAtual || 'DEPENDENTE_CONCRETO';
        
        return {
            taskId: poolDeTarefas[0]?.id || 'default',
            interfaceModifiers: {
                modoRepresentacao: this.determinarRepresentacaoInterface({ perfilDominante: perfil }, gameState?.combo || 0, 'visual')
            }
        };
    }

    /**
     * Verifica se o aluno precisa de um aviso verbal da ADA.
     */
    static gerarMicroIntervencao(questaoAtual, perfilCognitivo) {
        if (!perfilCognitivo) return null;

        if (perfilCognitivo.perfilDominante === 'IMPULSIVO_ARITMETICO') {
            return "Respire fundo. Analise a geometria antes de alterar os valores.";
        }

        if (perfilCognitivo.perfilDominante === 'PROCEDURAL_MECANICO' && questaoAtual.representacao === 'visual') {
            return "Observe as mudanças físicas na tela, não foque apenas nos números agora.";
        }

        return null; 
    }

    /**
     * Fetch assíncrono para carregar o cofre de dados cognitivos.
     */
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
