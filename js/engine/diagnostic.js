/**
 * diagnostic-engine.js v2.0 — "ADA & Gemini Edition"
 * Núcleo de Inteligência Pedagógica do LabTech
 */
export function obterResumoADA(G) {
    if (!G.diagnostico || G.diagnostico.historico.length === 0) {
        return { status: "Excelente", precisaIntervencao: false };
    }
 
/* ============================================================
   CLUSTERS OFICIAIS (A Inteligência do Bloco 1 ao 6)
============================================================ */
export const CLUSTERS = {
    "SISTEMA_NUMERICO": [
        "valorposicional_ignora_ordem",
        "decomposicao_confunde_dezena_unidade",
        "inteiros_confunde_sinal_adicao",
        "multiplicacao_sinais_positiva_errada"
    ],
    "RACIOCINIO_FRACIONARIO": [
        "fracao_soma_denominadores",
        "fracao_soma_direta_bases_diferentes",
        "fracao_inverte_numerador_denominador",
        "fracao_simplificacao_incompleta"
    ],
    "OPERACOES_DECIMAIS": [
        "decimal_soma_desalinha_virgula",
        "decimal_multiplicacao_ignora_casas_totais",
        "decimal_subtracao_ignora_emprestimo_zero",
        "conversao_justapoe_numeros_virgula"
    ],
    "MODELAGEM_ALGEBRICA": [
        "modelagem_interpreta_dobro_como_soma",
        "equacao_mantem_sinal_transposicao",
        "algebra_distribuitiva_incompleta",
        "inequacao_esquece_inversao_sinal_negativo"
    ],
    "ESTRUTURA_GEOMETRICA": [
        "geometria_confunde_perimetro_area",
        "poligono_generaliza_triangulo",
        "triangulo_confunde_lado_angulo",
        "pitagoras_omite_raiz_final"
    ],
    "LITERACIA_DADOS": [
        "media_apenas_soma",
        "critica_ignora_outlier_na_media",
        "grafico_leitura_passiva",
        "prob_foco_numeral_unico"
    ]
};

/* ============================================================
   INTERPRETAÇÃO DE ALTERNATIVA
============================================================ */

export function analisarAlternativa(alternativa) {
    if (!alternativa) return { correto: false, categoria: 'calculo', erro: 'invalido' };

    if (alternativa.tipo === 'acerto') {
        return { correto: true };
    }

    return {
        correto: false,
        categoria: alternativa.categoria || 'calculo',
        erro: alternativa.erro || 'erro_generico',
        descricao: alternativa.descricao || 'Erro identificado.',
        peso: alternativa.peso || 1 // 1: Atenção, 2: Procedimento, 3: Conceito
    };
}

/* ============================================================
   REGISTRO E CÁLCULO (Estado do Jogo G)
============================================================ */

export function registrarErro(G, analise) {
    if (!G.diagnostico) {
        G.diagnostico = { 
            errosAcumulados: {}, 
            historico: [],
            clusterScores: {} 
        };
    }

    const erroId = analise.erro;
    G.diagnostico.errosAcumulados[erroId] = (G.diagnostico.errosAcumulados[erroId] || 0) + 1;
    
    G.diagnostico.historico.push({
        erro: erroId,
        peso: analise.peso,
        timestamp: Date.now()
    });

    // Atualiza o Score do Cluster
    for (const [cluster, listaErros] of Object.entries(CLUSTERS)) {
        if (listaErros.includes(erroId)) {
            G.diagnostico.clusterScores[cluster] = (G.diagnostico.clusterScores[cluster] || 0) + analise.peso;
        }
    }
}

/* ============================================================
   PERFIL COGNITIVO E INTERVENÇÃO
============================================================ */

export function obterResumoADA(G) {
    const scores = G.diagnostico?.clusterScores || {};
    const totalErros = G.diagnostico?.historico.length || 0;

    // Encontra o Cluster com maior peso de erro
    const dominante = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];

    return {
        clusterDominante: dominante ? dominante[0] : "Nenhum",
        intensidade: dominante ? dominante[1] : 0,
        totalAlertas: totalErros,
        precisaIntervencao: dominante && dominante[1] >= 6 // Ex: 2 erros de conceito (3+3)
    };
}
