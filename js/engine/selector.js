/**
 * selector.js — v11.0 "The Scalable Strategist — Beta Edition"
 * Seletor Híbrido com IA Triage + Geração de Logs de Explicabilidade (XAI).
 */

import { G } from './gameState.js';
import { normalizarQuestao } from './question-normalizer.js';

export let bancoQuestoes = [];
const BANCO = {}; 
let respondedInSession = new Set();

export function limparHistoricoSessao() {
    respondedInSession.clear();
    console.log("[SELECTOR] 🧠 Memória de sessão resetada.");
}

// 1. CARREGAR, DISTRIBUIR NAS GAVETAS E RETORNAR DADOS
export async function carregarBancoDeQuestoes() {
    try {
        const resposta = await fetch('./data/questoes.json');
        bancoQuestoes = await resposta.json();
        
        for (let key in BANCO) delete BANCO[key]; 

        bancoQuestoes.forEach(q => {
            if (!q.aula) return; 
            if (!BANCO[q.aula]) BANCO[q.aula] = []; 
            BANCO[q.aula].push(q);
        });

        console.log(`[SISTEMA] Banco Carregado. Total: ${bancoQuestoes.length} questões. Aulas identificadas: ${Object.keys(BANCO).join(', ')}`);
        
        // 🛠️ REMÉDIO DA RACE CONDITION: Retorna o banco para o validador no main.js
        return bancoQuestoes;

    } catch (erro) {
        console.error("[SISTEMA] Falha ao carregar banco:", erro);
        return []; // Retorno de contingência para evitar quebra do ciclo
    }
}

/**
 * MOTOR DE IA TRIAGE (Sua lógica de ouro atualizada com Logs de Explicabilidade)
 */
function avaliarNecessidadeIntervencao(blocoId) {
    const qDisp = (BANCO[blocoId] || []).filter(q => !respondedInSession.has(q.id));
    if (qDisp.length === 0) return null;

    // Inicializa a estrutura de diagnósticos da ADA caso não exista no estado
    if (!G.diagnosticoADA) G.diagnosticoADA = { ultimaIntervencaoMotivo: "", historicoDecisoes: [] };

    // 1. EMERGÊNCIA CLÍNICA (Alerta de Defasagem Crônica)
    if (G.diagnostico && G.diagnostico.scores) {
        const alertas = Object.entries(G.diagnostico.scores)
            .filter(([cluster, score]) => score >= 6)
            .sort((a, b) => b[1] - a[1]);

        if (alertas.length > 0) {
            const clusterCritico = alertas[0][0];
            const resgate = qDisp.find(q => q.cluster === clusterCritico && q.dificuldade <= 2) 
                         || qDisp.find(q => q.tipoPedagogico === "recomposicao");
            
            if (resgate) {
                G.diagnostico.scores[clusterCritico] -= 3; 
                
                // 🧠 LOG CIENTÍFICO DA DECISÃO DA ADA
                G.diagnosticoADA.ultimaIntervencaoMotivo = `Emergência Clínica detectada! Nível de risco no cluster [${clusterCritico}] atingiu patamar crítico. ADA interceptou o fluxo regular para alocar o item de resgate pedagógico [${resgate.id}].`;
                return resgate;
            }
        }
    }

    // 2. RESGATE DE VIDA (DUA - Mitigação de Frustração Crônica)
    if (G.vida > 0 && G.vida < 35) {
        const salvacao = qDisp.find(q => q.tipoPedagogico === "recomposicao" || q.dificuldade === 1);
        if (salvacao) {
            G.diagnosticoADA.ultimaIntervencaoMotivo = `Estudante operando em zona de risco extremo de quebra (Vida: ${Math.round(G.vida)}%). ADA ativou protocolo de salvaguarda emocional do DUA, injetando o item de recomposição [${salvacao.id}].`;
            return salvacao;
        }
    }

    // 3. DESAFIO DE FLOW (Teoria do Fluxo de Csikszentmihalyi para AHSD)
    if (G.combo >= 4) {
        const desafio = qDisp.find(q => q.tipoPedagogico === "investigacao" || q.dificuldade === 3);
        if (desafio) {
            G.diagnosticoADA.ultimaIntervencaoMotivo = `Estudante em estado avançado de proficiência (Combo ativo: ${G.combo}). Para evitar o tédio cognitivo e impulsionar o Mastery Learning, ADA escalou para o desafio de investigação [${desafio.id}].`;
            return desafio;
        }
    }

    return null;
}

export function selQ(blocoId) {
    const questoesDoBloco = BANCO[blocoId] || [];

    if (questoesDoBloco.length === 0) {
        return normalizarQuestao({ display: "Aguardando Dados...", passo: "Carregando banco..." });
    }

    // Assegura inicialização do container de inteligência explicável
    if (!G.diagnosticoADA) G.diagnosticoADA = { ultimaIntervencaoMotivo: "Ajuste de curso.", historicoDecisoes: [] };

    // Executa a Triage Inteligente
    const qIA = avaliarNecessidadeIntervencao(blocoId);
    if (qIA) {
        respondedInSession.add(qIA.id);
        
        // Formata o objeto de retorno da decisão clínica
        const logDecisao = {
            timestamp: new Date().toISOString(),
            motivoDecisao: G.diagnosticoADA.ultimaIntervencaoMotivo,
            proximaQuestaoId: qIA.id,
            perfilEstilo: G.perfilCognitivo?.estiloPredominante || "Análise Ativa"
        };
        G.diagnosticoADA.historicoDecisoes.push(logDecisao);
        
        return normalizarQuestao(qIA);
    }

    // Fluxo Regular (Falta de candidatas ativa o loop suave do bloco)
    let candidatas = questoesDoBloco.filter(q => !respondedInSession.has(q.id));

    if (candidatas.length === 0) {
        respondedInSession.clear(); 
        candidatas = questoesDoBloco;
    }

    const qSorteada = candidatas[Math.floor(Math.random() * candidatas.length)];
    respondedInSession.add(qSorteada.id);

    // 🧠 LOG CIENTÍFICO PARA O FLUXO DE CRUZEIRO STANDARD
    G.diagnosticoADA.ultimaIntervencaoMotivo = "Estudante operando dentro da zona de desenvolvimento proximal esperada. ADA alocou uma questão linear regular para manutenção de ritmo.";
    
    G.diagnosticoADA.historicoDecisoes.push({
        timestamp: new Date().toISOString(),
        motivoDecisao: G.diagnosticoADA.ultimaIntervencaoMotivo,
        proximaQuestaoId: qSorteada.id,
        perfilEstilo: G.perfilCognitivo?.estiloPredominante || "Regular"
    });

    return normalizarQuestao(qSorteada);
}
