/**
 * @fileoverview AdaptiveSelector.js
 * @description Cérebro orquestrador da ADA. Seleciona a próxima tarefa, 
 * define a representação visual (DUA) e injeta scaffolds na ZDP do estudante.
 * @version 5.0.0
 * @package LabTech / Core ADA
 */

// CORREÇÃO APLICADA: Importando o arquivo correto em CamelCase (DiagnosticEngine.js)

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
     * @param {Object} perfilCognitivo - O prontuário atual do estudante.
     * @param {number} comboAcertos - Quantidade de acertos consecutivos.
     * @param {string} representacaoPadrao - A representação default da questão.
     * @returns {string} O modo de representação que o CanvasRenderer vai usar.
     */
    static determinarRepresentacaoInterface(perfilCognitivo, comboAcertos, representacaoPadrao) {
        if (!perfilCognitivo) return representacaoPadrao || 'visual';

        const perfil = perfilCognitivo.perfilDominante || 'INDEFINIDO';

        // Se o aluno for Dependente Concreto, força a interface visual/materializada
        if (perfil === 'DEPENDENTE_CONCRETO') {
            return 'visual';
        }
        
        // Se o aluno for Procedural Mecânico e tiver combo alto, empurra para abstração
        if (perfil === 'PROCEDURAL_MECANICO' && comboAcertos > 3) {
            return 'abstrato';
        }

        // Retorna o padrão do sensor ou visual como fallback seguro
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

        // 1. Filtra as questões do bloco atual convertendo para String com segurança
        let questoesValidas = bancoGlobal.filter(q => String(q.bloco) === String(blockId));
        
        // Se o bloco estiver vazio, usa o banco inteiro para não travar o jogo
        if (questoesValidas.length === 0) {
            questoesValidas = bancoGlobal;
        }

        // 2. Trava anti-repetição: Filtra a questão que o aluno acabou de responder
        const idUltimaQuestao = window.__LABTECH_DEBUG__?.qId;
        let poolSorteio = questoesValidas.filter(q => String(q.id) !== String(idUltimaQuestao));

        // Se esgotaram as questões exclusivas, reseta o pool para evitar crash
        if (poolSorteio.length === 0) {
            poolSorteio = questoesValidas;
        }

        // Sorteia a próxima questão
        const proxima = poolSorteio[Math.floor(Math.random() * poolSorteio.length)];
        
        // Atualiza o painel X-Ray
        if (window.__LABTECH_DEBUG__) {
            window.__LABTECH_DEBUG__.qId = proxima.id;
        }

        return proxima;
    } 

        // 1. Compara transformando ambos em String (Resolve o erro do "1" === 1)
        let questoesValidas = bancoGlobal.filter(q => String(q.bloco) === String(blockId));
        
        // Se o bloco estiver vazio, usa o banco inteiro para não travar o jogo
        if (questoesValidas.length === 0) questoesValidas = bancoGlobal;

        // 2. Trava anti-repetição: Filtra a questão que o aluno acabou de responder
        const idUltimaQuestao = window.__LABTECH_DEBUG__?.qId;
        let poolSorteio = questoesValidas.filter(q => String(q.id) !== String(idUltimaQuestao));

        // Se esgotaram as questões, reseta o pool
        if (poolSorteio.length === 0) poolSorteio = questoesValidas;

        // Sorteia a próxima
        const proxima = poolSorteio[Math.floor(Math.random() * poolSorteio.length)];
        
        // Atualiza o painel X-Ray com o novo ID para a próxima trava funcionar
        if (window.__LABTECH_DEBUG__) window.__LABTECH_DEBUG__.qId = proxima.id;

        return proxima;
    }

        // Lógica simples de filtro (pode ser expandida com algoritmos de TRI no futuro)
        const questoesValidas = bancoGlobal.filter(q => q.bloco === blockId);
        return questoesValidas.length > 0 ? questoesValidas[Math.floor(Math.random() * questoesValidas.length)] : bancoGlobal[0];
    }

    /**
     * Retorna o pacote completo da próxima tarefa (compatível com o novo main.js).
     * @param {Object} gameState - Objeto G.
     * @param {Array} poolDeTarefas - Catálogo de questões disponíveis.
     * @returns {Object} Payload adaptativo.
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
     * Verifica se o aluno precisa de um aviso verbal da ADA antes da questão começar.
     * @param {Object} questaoAtual - A questão que será renderizada.
     * @param {Object} perfilCognitivo - O prontuário do aluno.
     * @returns {string|null} O texto para a ADA narrar, ou null se não precisar.
     */
    static gerarMicroIntervencao(questaoAtual, perfilCognitivo) {
        if (!perfilCognitivo) return null;

        if (perfilCognitivo.perfilDominante === 'IMPULSIVO_ARITMETICO') {
            return "Respire fundo. Analise a geometria antes de alterar os valores.";
        }

        if (perfilCognitivo.perfilDominante === 'PROCEDURAL_MECANICO' && questaoAtual.representacao === 'visual') {
            return "Observe as mudanças físicas na tela, não foque apenas nos números agora.";
        }

        return null; // Nenhuma intervenção preditiva necessária
    }

    /**
     * Simula o carregamento do banco de questões (Pode ser adaptado para fetch de um JSON real).
     * @returns {Promise<Array>}
     */
    static async carregarBancoDeQuestoes() {
        try {
            const resposta = await fetch('./data/questoes.json');
            if (!resposta.ok) throw new Error("Arquivo JSON não encontrado.");
            const dados = await resposta.json();
            window.catalogoGlobalDeQuestoes = dados;
            return dados;
        } catch (erro) {
            console.warn("[ADA] Falha ao carregar questoes.json. Usando banco em memória vazio.", erro);
            window.catalogoGlobalDeQuestoes = [];
            return [];
        }
    }
}
