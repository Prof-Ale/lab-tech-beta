/**
 * diagnostic-engine.js v3.1 — "LabTech Bulletproof Biopsy"
 * Núcleo de Inteligência Pedagógica e Taxonomia de Erros.
 * INTERVENÇÃO: Restauração da blindagem profunda (anti-crash) e sincronia BNCC.
 */

export const CLUSTERS = {
    "NUMEROCENTRISMO": ["valorposicional_ignora_ordem", "decomposicao_confunde_dezena_unidade", "inteiros_confunde_sinal_adicao"],
    "FRACIONARIO_DECIMAL": ["fracao_soma_denominadores", "fracao_soma_direta_bases_diferentes", "decimal_soma_desalinha_virgula"],
    "MODELAGEM_E_ALGEBRA": ["problema_ignora_condicao_inteira", "modelagem_interpreta_dobro_como_soma", "equacao_mantem_sinal_transposicao"],
    "ESTRUTURA_ESPACIAL": ["geometry_confunde_perimetro_area", "poligono_generaliza_triangulo"],
    "LITERACIA_ESTATISTICA": ["media_apenas_soma", "grafico_leitura_passiva"]
};

export const INTERVENCOES = {
    conceito: "Precisamos voltar à base. O conceito por trás dessa operação ainda não está claro.",
    procedimento: "Você entendeu a ideia, mas o 'passo a passo' falhou. Vamos revisar o método?",
    calculo: "Atenção aos detalhes! Foi apenas um pequeno deslize na conta final.",
    interpretacao: "O desafio aqui é traduzir o problema para a matemática. Vamos ler de novo?"
};

export function analisarAlternativa(alternativa) {
    if (!alternativa) return { correto: false, categoria: 'calculo', descricao: 'Erro não catalogado.' };

    if (alternativa.tipo === 'acerto' || alternativa.correto === true) {
        return { correto: true };
    }

    return {
        correto: false,
        categoria: alternativa.categoria || 'calculo', 
        erroId: alternativa.erro || 'erro_generico',   
        descricao: alternativa.descricao || 'Análise técnica em andamento.',
        peso: alternativa.peso || 1 
    };
}

// CORREÇÃO: Adicionado 'q' como parâmetro para não perder o rastreio da BNCC
export function registrarErro(G, analise, q) {
    // 1. BLINDAGEM PROFUNDA RESTAURADA (Fim dos Crashes de Save Antigo)
    if (!G.historico) G.historico = {};
    if (!G.diagnostico) G.diagnostico = {};
    if (!G.diagnostico.logs) G.diagnostico.logs = [];
    if (!G.diagnostico.scores) G.diagnostico.scores = {};

    const hab = (q && q.bncc) ? q.bncc : "Geral";

    if (!G.historico[hab]) {
        G.historico[hab] = { acertos: 0, erros_conceito: 0, erros_calculo: 0, desc: "Habilidade BNCC" };
    }

    if (analise.categoria === 'conceito') {
        G.historico[hab].erros_conceito++;
    } else {
        G.historico[hab].erros_calculo++;
    }

    // Agora o push está 100% seguro contra undefined
    G.diagnostico.logs.push({
        bncc: hab,
        erro: analise.erroId,
        categoria: analise.categoria,
        timestamp: Date.now()
    });

    for (const [cluster, listaErros] of Object.entries(CLUSTERS)) {
        if (listaErros.includes(analise.erroId)) {
            G.diagnostico.scores[cluster] = (G.diagnostico.scores[cluster] || 0) + analise.peso;
        }
    }
}
