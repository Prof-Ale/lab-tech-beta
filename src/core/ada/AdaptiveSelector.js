/**
 * @fileoverview AdaptiveSelector.js
 * @description O Tutor Cirúrgico da ADA. Ponte Executora da Base Orientadora Ativa (BOA).
 * EVOLUÇÃO 11.0.0: Consumidor puro da BOA, abandono de deduções próprias e uso de Filtros Táticos.
 * @package LabTech / Core ADA
 */

import { REPRESENTACOES_SEMIOTICAS, OBSTACULOS_COGNITIVOS } from './ContratosPedagogicos.js';

export class AdaptiveSelector {
    
    static limparHistoricoSessao() {
        if (window.__LABTECH_DEBUG__) {
            window.__LABTECH_DEBUG__.jumpDelta = 0;
            console.log("[ADA] Histórico transitório de sessão limpo.");
        }
    }

    /**
     * 🧠 Filtro Tático (Camada Executora)
     * Filtra o banco de questões procurando os metadados ideais para confrontar o obstáculo.
     */
    static _aplicarFiltrosTaticos(candidatos, obstaculo) {
        switch (obstaculo) {
            case OBSTACULOS_COGNITIVOS.MECANIZACAO_IMPULSIVA:
                // O aluno está "chutando" contas. Exigimos leitura atenta e letramento.
                return candidatos.filter(item => item.exigeLeituraAtenta === true || item.cargaCognitiva === "ALTA");
                
            case OBSTACULOS_COGNITIVOS.FRICCAO_COGNITIVA_ALTA:
                // O aluno está sobrecarregado (erros sequenciais). Reduzimos a complexidade estrutural.
                return candidatos.filter(item => item.cargaCognitiva === "BAIXA" || item.cargaCognitiva === "MEDIA");
                
            case OBSTACULOS_COGNITIVOS.PSEUDOCONCEITO:
                // Automatizou a regra errada. Provocamos um Choque Visual ou Abstração Pura.
                return candidatos.filter(item => 
                    item.representacaoPrincipal === REPRESENTACOES_SEMIOTICAS.VISUAL_ATIPICA || 
                    item.representacaoPrincipal === REPRESENTACOES_SEMIOTICAS.ABSTRATA
                );
                
            default:
                return candidatos;
        }
    }

    /**
     * Busca a próxima questão ideal no banco baseada na ZDP e no Plano de Mediação da BOA.
     */
    static selecionarProximaQuestao(blockId, perfilCognitivo) {
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

        // 1. FILTRO PRIMÁRIO: ZDP (Zona de Desenvolvimento Proximal)
        let poolZDP = questoesIneditas.filter(q => {
            const bncc = q.bncc || "GERAL";
            const zdpLocal = perfilCognitivo.habilidades?.[bncc]?.zdp?.atual || 1; 
            return q.dificuldade === zdpLocal;
        });

        if (poolZDP.length === 0) {
            poolZDP = questoesIneditas.filter(q => {
                const bncc = q.bncc || "GERAL";
                const zdpLocal = perfilCognitivo.habilidades?.[bncc]?.zdp?.atual || 1;
                return Math.abs(q.dificuldade - zdpLocal) <= 1; 
            });
        }

        if (poolZDP.length === 0) poolZDP = questoesIneditas;

        // 2. FILTRO SECUNDÁRIO: BASE ORIENTADORA ATIVA (Tática Pedagógica)
        const bnccDominante = poolZDP[0]?.bncc || "GERAL";
        const hab = perfilCognitivo.habilidades?.[bnccDominante];
        const boa = hab?.baseOrientadoraAtiva;
        
        let poolSorteio = poolZDP;

        if (boa) {
            const { representacaoPreferencial } = boa.planoDeMediacao;
            const obstaculo = boa.focoConceitual.obstaculoPrincipal;

            // 2.1 Adequação Semiótica (DUA)
            let candidatosSemiotic = poolZDP.filter(item => {
                const repItem = (item.representacaoPrincipal || item.representacao || item.suporteVisual || "VISUAL").toUpperCase();
                return representacaoPreferencial === REPRESENTACOES_SEMIOTICAS.QUALQUER || repItem === representacaoPreferencial;
            });
            
            if (candidatosSemiotic.length === 0) candidatosSemiotic = poolZDP; // Fallback se restritivo demais

            // 2.2 Táticas de Desbloqueio (Galperin/Davýdov)
            poolSorteio = this._aplicarFiltrosTaticos(candidatosSemiotic, obstaculo);
            
            if (poolSorteio.length === 0) poolSorteio = candidatosSemiotic; // Fallback
        }

        // 3. Sorteio Final
        const proxima = poolSorteio[Math.floor(Math.random() * poolSorteio.length)];
        perfilCognitivo.historicoQuestoesRespondidas.push(proxima.id);
        
        return proxima;
    }

    /**
     * Retorna o pacote completo da próxima tarefa.
     * Agora atua como tradutor 1:1 do Plano de Mediação da BOA para Telemetria (XAI) e Interface (UX).
     */
    static selecionarProximaTarefa(gameState, poolDeTarefas) {
        const perfilCompleto = gameState?.perfilCognitivo || {};
        const questao = poolDeTarefas[0] || {};
        
        const repPadrao = questao.representacaoPrincipal || questao.representacao || questao.suporteVisual || 'visual';
        
        const bncc = questao.bncc || "GERAL";
        const hab = perfilCompleto.habilidades?.[bncc];
        const boa = hab?.baseOrientadoraAtiva;

        let representacaoSelecionada = repPadrao;
        let contextoADA = {};

        if (boa) {
            // Consumidor Puro: A BOA decide estritamente a estratégia e a representação final.
            const repPref = boa.planoDeMediacao.representacaoPreferencial;
            representacaoSelecionada = (repPref && repPref !== REPRESENTACOES_SEMIOTICAS.QUALQUER) 
                ? repPref.toLowerCase() 
                : repPadrao.toLowerCase();

            // Mapeamento semântico de segurança para a Engine Canvas (ex: concreta vira visual manipulável)
            if (representacaoSelecionada === 'concreta') representacaoSelecionada = 'visual';

            // Geração Rica do Log XAI para consumo do Metacognition e TeacherAnalytics
            contextoADA = {
                representacaoOriginal: repPadrao,
                representacaoSelecionada: representacaoSelecionada,
                tipoIntervencao: boa.planoDeMediacao.tipoIntervencao,
                motivo: boa.planoDeMediacao.proximaAcao,
                obstaculoAlvo: boa.focoConceitual.obstaculoPrincipal,
                estagioConceitualOrigem: boa.estadoAtual.estagioConceitual,
                itcOrigem: boa.estadoAtual.itc,
                modeloConceitual: boa.versao || "BOA_v1"
            };
        } else {
            // Fallback de retrocompatibilidade caso a BOA ainda não tenha sido instanciada
            representacaoSelecionada = repPadrao;
            contextoADA = {
                representacaoOriginal: repPadrao,
                representacaoSelecionada: repPadrao,
                tipoIntervencao: "MANUTENCAO",
                motivo: "BOA_NAO_INSTANCIADA",
                estagioConceitualOrigem: "EVIDENCIA_INSUFICIENTE",
                itcOrigem: 0.0,
                modeloConceitual: "LEGACY"
            };
        }

        return {
            ...questao, 
            taskId: questao.id || 'default',
            contextoADA: contextoADA,
            interfaceModifiers: {
                modoRepresentacao: representacaoSelecionada
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
