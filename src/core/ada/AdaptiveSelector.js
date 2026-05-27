/**
 * @fileoverview AdaptiveSelector.js
 * @description Cérebro orquestrador da ADA. Seleciona a próxima tarefa, 
 * define a representação visual (DUA) e injeta scaffolds na ZDP do estudante.
 * AGORA COM: Choque Semiótico, Mecanismo Anti-Overfitting e Limpeza de Estado Transiente.
 * @version 5.4.0
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
     * 🧠 INJEÇÃO XAI: Choque Semiótico ativo.
     */
    static determinarRepresentacaoInterface(perfilCognitivo, comboAcertos, representacaoPadrao) {
        if (!perfilCognitivo) return representacaoPadrao || 'visual';

        // 🚨 SE A EMBOSCADA ESTIVER ARMADA: Força a transferência semiótica!
        if (perfilCognitivo.estadoADA && perfilCognitivo.estadoADA.emboscadaArmada) {
            const repBase = representacaoPadrao || 'visual';
            // Inverte o modelo: Se era abstrato, força gráfico (reta). Se era gráfico, força abstrato.
            const modoForcado = (repBase === 'abstrato') ? 'reta' : 'abstrato';
            console.warn(`[ADA] 🔄 CHOQUE SEMIÓTICO APLICADO: Forçando modo '${modoForcado}' para testar transferência do aluno.`);
            return modoForcado;
        }

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
     * 🧠 INJEÇÃO: Mecanismo de Fallback Progressivo e Memória de Sessão.
     */
    static selecionarProximaQuestao(blockId, perfilCognitivo) {
        const bancoGlobal = window.catalogoGlobalDeQuestoes || [];
        
        if (bancoGlobal.length === 0) {
            console.warn("[ADA] Banco de questões vazio. Retornando mock.");
            return { id: 'MOCK', display: 'Banco não carregado.', alternativas: [{valor: 'A'}], res: 'A' };
        }

        // Garante a existência da memória do aluno
        if (!perfilCognitivo) perfilCognitivo = {};
        if (!perfilCognitivo.historicoQuestoesRespondidas) perfilCognitivo.historicoQuestoesRespondidas = [];

        // 🔥 EVOLUÇÃO CIRÚRGICA: Limpa o estado de erro da ADA para a nova rodada (Evita contaminação de UI)
        if (perfilCognitivo.estadoADA) {
            perfilCognitivo.estadoADA.mensagem = null;
            perfilCognitivo.estadoADA.exibir = false;
        }

        // 1. Filtra as questões do bloco atual
        let questoesDoBloco = bancoGlobal.filter(q => String(q.bloco) === String(blockId));
        if (questoesDoBloco.length === 0) {
            console.warn(`[ADA] Bloco ${blockId} vazio no banco. Liberando cofre global.`);
            questoesDoBloco = bancoGlobal;
        }

        // 2. Remove questões já respondidas (Trava Anti-Repetição Longa)
        let questoesIneditas = questoesDoBloco.filter(q => !perfilCognitivo.historicoQuestoesRespondidas.includes(q.id));

        // Se esgotou todas as inéditas do bloco, limpa O HISTÓRICO DESTE BLOCO para reciclagem
        if (questoesIneditas.length === 0) {
            console.warn("⚠️ [ADA] Banco do bloco esgotado. Reciclando questões com nova mediação.");
            const idsDoBloco = questoesDoBloco.map(q => q.id);
            perfilCognitivo.historicoQuestoesRespondidas = perfilCognitivo.historicoQuestoesRespondidas.filter(id => !idsDoBloco.includes(id));
            questoesIneditas = questoesDoBloco; // Reinicia a pool
        }

        // Prepara os parâmetros da ZDP Atual
        const repAlvo = perfilCognitivo.representacaoDominante || 'visual';
        const difAlvo = perfilCognitivo.nivelDificuldadeZDP || 1; // Assumindo nível padrão 1 se indefinido

        // 3. MATRIZ DE BUSCA (Expansão Progressiva)
        // Tentativa A: Match Perfeito (Mesma Representação + Mesma Dificuldade)
        let poolSorteio = questoesIneditas.filter(q => q.representacao === repAlvo && q.dificuldade === difAlvo);

        // Tentativa B (Fallback 1): Flexibilidade Semiótica (Ignora representação, foca na dificuldade)
        if (poolSorteio.length === 0) {
            poolSorteio = questoesIneditas.filter(q => q.dificuldade === difAlvo);
        }

        // Tentativa C (Fallback 2): Expansão Completa (Libera qualquer questão inédita do bloco)
        if (poolSorteio.length === 0) {
            poolSorteio = questoesIneditas;
        }

        // Sorteia a próxima questão da pool resultante
        const proxima = poolSorteio[Math.floor(Math.random() * poolSorteio.length)];
        
        // Grava no cérebro do aluno para não repetir
        perfilCognitivo.historicoQuestoesRespondidas.push(proxima.id);

        // Atualiza o painel radiográfico (X-Ray)
        if (window.__LABTECH_DEBUG__) {
            window.__LABTECH_DEBUG__.qId = proxima.id;
            window.__LABTECH_DEBUG__.poolAtual = poolSorteio.length;
        }

        return proxima;
    }

    /**
     * Retorna o pacote completo da próxima tarefa.
     */
    static selecionarProximaTarefa(gameState, poolDeTarefas) {
        // Envia o objeto de perfil inteiro para a ADA ler a flag da emboscada
        const perfilCompleto = gameState?.perfilCognitivo || {};
        const questao = poolDeTarefas[0] || {};
        const repPadrao = questao.representacao || 'visual';
        
        return {
            ...questao, // 🔥 CIRURGIA CORRETIVA: Spread Operator que garante o envio do gabarito (res), display e alternativas!
            taskId: questao.id || 'default',
            interfaceModifiers: {
                modoRepresentacao: this.determinarRepresentacaoInterface(perfilCompleto, gameState?.combo || 0, repPadrao)
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
