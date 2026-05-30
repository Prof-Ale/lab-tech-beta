/**
 * @fileoverview AdaptiveSelector.js
 * @description O Tutor Cirúrgico da ADA. Seleciona tarefas baseadas na ZDP específica 
 * de cada habilidade BNCC e injeta scaffolds dinâmicos em tempo real.
 * EVOLUÇÃO 10.0.0: Seleção por ZDP Local, Expansão Proximal e Scaffold de Emergência.
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
     * Determina qual interface semiótica o Canvas deve renderizar para a próxima tarefa.
     * 🧠 INJEÇÃO VIGOTSKIANA: Redução de Carga e Choque Semiótico.
     */
    static determinarRepresentacaoInterface(perfilCognitivo, questaoAtual) {
        const repPadrao = questaoAtual.representacao || questaoAtual.suporteVisual || 'visual';
        if (!perfilCognitivo) return repPadrao;

        // 🚨 1. Choque Semiótico (Emboscada armada pelo perfil global)
        if (perfilCognitivo.estadoADA && perfilCognitivo.estadoADA.emboscadaArmada) {
            const modoForcado = (repPadrao.includes('abstrato') || repPadrao.includes('SIMBOLICO')) ? 'reta' : 'abstrato';
            console.warn(`[ADA] 🔄 CHOQUE SEMIÓTICO APLICADO: Forçando modo '${modoForcado}' para testar abstração.`);
            return modoForcado;
        }

        // 🚨 2. Scaffold de Emergência (Redução de Carga Cognitiva por Fricção Local)
        const bncc = questaoAtual.bncc || "GERAL";
        const hab = perfilCognitivo.habilidades?.[bncc];
        
        if (hab && hab.errosSequenciais >= 2) {
            console.warn(`[ADA] 🛟 SCAFFOLD DE EMERGÊNCIA: 2 erros na habilidade ${bncc}. Forçando representação visual.`);
            return 'visual'; // Força o materializado/icônico para ancoragem
        }

        // 📊 3. Adaptação baseada na Trajetória Dominante da Habilidade
        const perfilLocal = hab?.perfilDominante || perfilCognitivo.perfilDominante || 'INDEFINIDO';

        if (perfilLocal === 'DEPENDENTE_CONCRETO') {
            return 'visual';
        }
        
        if (perfilLocal === 'PROCEDURAL_MECANICO' && (hab?.acertos || 0) > 3) {
            return 'abstrato'; // Força o aluno a largar o desenho se ele já decorou o procedimento visual
        }

        return repPadrao;
    }

    /**
     * Busca a próxima questão ideal no banco baseada na ZDP Específica da Habilidade (BNCC).
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

        // Limpa o estado de erro da ADA para a nova rodada
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

        // 2. Remove questões já respondidas
        let questoesIneditas = questoesDoBloco.filter(q => !perfilCognitivo.historicoQuestoesRespondidas.includes(q.id));

        // Reciclagem de banco caso esgotado
        if (questoesIneditas.length === 0) {
            console.warn("⚠️ [ADA] Banco do bloco esgotado. Reciclando questões com nova mediação.");
            const idsDoBloco = questoesDoBloco.map(q => q.id);
            perfilCognitivo.historicoQuestoesRespondidas = perfilCognitivo.historicoQuestoesRespondidas.filter(id => !idsDoBloco.includes(id));
            questoesIneditas = questoesDoBloco; 
        }

        // 🎯 3. O PULO DO GATO: BUSCA POR ZDP LOCAL (POR HABILIDADE BNCC)
        // Tentativa A: Match Perfeito com a ZDP exata da habilidade
        let poolSorteio = questoesIneditas.filter(q => {
            const bncc = q.bncc || "GERAL";
            const zdpLocal = perfilCognitivo.habilidades?.[bncc]?.zdp?.atual || 1; // Lê a ZDP exata da mente do aluno
            return q.dificuldade === zdpLocal;
        });

        // 🔄 Tentativa B (Fallback Proximal): Expande a ZDP em ± 1 nível
        if (poolSorteio.length === 0) {
            poolSorteio = questoesIneditas.filter(q => {
                const bncc = q.bncc || "GERAL";
                const zdpLocal = perfilCognitivo.habilidades?.[bncc]?.zdp?.atual || 1;
                return Math.abs(q.dificuldade - zdpLocal) <= 1; // Aceita questões levemente acima ou abaixo
            });
        }

        // 🌍 Tentativa C (Fallback Global): Libera qualquer inédita
        if (poolSorteio.length === 0) {
            poolSorteio = questoesIneditas;
        }

        // Sorteia a próxima questão da pool resultante
        const proxima = poolSorteio[Math.floor(Math.random() * poolSorteio.length)];
        
        // Grava no cérebro do aluno
        perfilCognitivo.historicoQuestoesRespondidas.push(proxima.id);

        if (window.__LABTECH_DEBUG__) {
            window.__LABTECH_DEBUG__.qId = proxima.id;
            window.__LABTECH_DEBUG__.poolAtual = poolSorteio.length;
        }

        return proxima;
    }

    /**
     * Retorna o pacote completo da próxima tarefa com o setup semiótico ajustado.
     */
    static selecionarProximaTarefa(gameState, poolDeTarefas) {
        const perfilCompleto = gameState?.perfilCognitivo || {};
        const questao = poolDeTarefas[0] || {};
        
        return {
            ...questao, 
            taskId: questao.id || 'default',
            interfaceModifiers: {
                modoRepresentacao: this.determinarRepresentacaoInterface(perfilCompleto, questao)
            }
        };
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
