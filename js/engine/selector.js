/**
 * selector.js — v8.1 "The Scalable Strategist"
 * Seletor Híbrido com IA Triage + Carregamento JSON Dinâmico.
 */

import { G } from './gameState.js';
import { normalizarQuestao } from './question-normalizer.js';

export let bancoQuestoes = [];
// Deixamos o BANCO vazio inicialmente. Ele vai crescer sozinho!
const BANCO = {}; 
let respondedInSession = new Set();

export function limparHistoricoSessao() {
    respondedInSession.clear();
    console.log("[SELECTOR] 🧠 Memória resetada.");
}

// 1. CARREGAR E DISTRIBUIR NAS GAVETAS (AULAS)
export async function carregarBancoDeQuestoes() {
    try {
        const resposta = await fetch('./data/questoes.json');
        bancoQuestoes = await resposta.json();
        
        // Limpa as chaves antigas se o banco for recarregado no meio do jogo
        for (let key in BANCO) delete BANCO[key]; 

        // Distribui as questões e cria a gaveta se ela não existir
        bancoQuestoes.forEach(q => {
            if (!q.aula) return; // Ignora se a questão vier sem aula
            if (!BANCO[q.aula]) BANCO[q.aula] = []; // 🛠️ Cria a gaveta na hora!
            BANCO[q.aula].push(q);
        });

        console.log(`[SISTEMA] Banco Carregado. Total: ${bancoQuestoes.length} questões. Aulas identificadas: ${Object.keys(BANCO).join(', ')}`);
    } catch (erro) {
        console.error("[SISTEMA] Falha ao carregar banco:", erro);
    }
}


/**
 * MOTOR DE IA TRIAGE (Mantive sua lógica de ouro!)
 */
function avaliarNecessidadeIntervencao(blocoId) {
    const qDisp = (BANCO[blocoId] || []).filter(q => !respondedInSession.has(q.id));
    if (qDisp.length === 0) return null;

    // 1. EMERGÊNCIA CLÍNICA
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
                return resgate;
            }
        }
    }

    // 2. RESGATE DE VIDA
    if (G.vida > 0 && G.vida < 35) {
        const salvacao = qDisp.find(q => q.tipoPedagogico === "recomposicao" || q.dificuldade === 1);
        if (salvacao) return salvacao;
    }

    // 3. DESAFIO DE FLOW
    if (G.combo >= 4) {
        const desafio = qDisp.find(q => q.tipoPedagogico === "investigacao" || q.dificuldade === 3);
        if (desafio) return desafio;
    }

    return null;
}

export function selQ(blocoId) {
    const questoesDoBloco = BANCO[blocoId] || [];

    if (questoesDoBloco.length === 0) {
        return normalizarQuestao({ display: "Aguardando Dados...", passo: "Carregando banco..." });
    }

    const qIA = avaliarNecessidadeIntervencao(blocoId);
    if (qIA) {
        respondedInSession.add(qIA.id);
        return normalizarQuestao(qIA);
    }

    let candidatas = questoesDoBloco.filter(q => !respondedInSession.has(q.id));

    if (candidatas.length === 0) {
        respondedInSession.clear(); // Loop suave
        candidatas = questoesDoBloco;
    }

    // Sorteio Aleatório dentro do bloco
    const qSorteada = candidatas[Math.floor(Math.random() * candidatas.length)];
    respondedInSession.add(qSorteada.id);

    return normalizarQuestao(qSorteada);
}
