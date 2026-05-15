/**
 * interventions.js — O Manual de Campo da ADA
 * Traduz scores de erro em estratégias de recomposição.
 */

export const ESTRATEGIAS_INTERVENCAO = {
    "SISTEMA_NUMERICO": {
        titulo: "Revisão de Base e Posicionamento",
        falaADA: "Percebi que os números estão a baralhar-se um pouco nas colunas. Que tal usares o Quadro de Valor Posicional (QVP) para organizar as ordens antes de calcular?",
        recurso: "quadro_posicional_interativo",
        prioridade: "Alta"
    },
    "RACIOCINIO_FRACIONARIO": {
        titulo: "Visualização de Partes e Todo",
        falaADA: "As frações são como fatias de uma pizza. Estás a tentar somar fatias de tamanhos diferentes sem as igualar primeiro. Vamos usar as barras de frações?",
        recurso: "simulador_barras_fracoes",
        prioridade: "Alta"
    },
    "OPERACOES_DECIMAIS": {
        titulo: "Alinhamento e Vírgulas",
        falaADA: "A vírgula é o GPS do número decimal! Se ela estiver fora do lugar, perdemo-nos no valor. Lembra-te: vírgula debaixo de vírgula!",
        recurso: "calculadora_passo_a_passo",
        prioridade: "Média"
    },
    "MODELAGEM_ALGEBRICA": {
        titulo: "Tradução para Linguagem Matemática",
        falaADA: "Estás a ler bem, mas a tradução para 'matematiquês' falhou. Tenta desenhar o problema ou usar a balança para equilibrar os dois lados da equação.",
        recurso: "balanca_algebrica_virtual",
        prioridade: "Crítica"
    },
    "ESTRUTURA_GEOMETRICA": {
        titulo: "Percepção e Propriedades",
        falaADA: "As figuras geométricas têm regras próprias. Um triângulo não se comporta como um pentágono! Vamos observar as 'pistas' que os ângulos nos dão?",
        recurso: "geogebra_mini_frames",
        prioridade: "Alta"
    },
    "LITERACIA_DADOS": {
        titulo: "Análise Crítica e Curadoria",
        falaADA: "Cuidado! Os números podem tentar enganar-nos se não olharmos para o contexto. Analisa o gráfico como se fosses um detetive à procura de provas.",
        recurso: "analisador_graficos_falsos",
        prioridade: "Média"
    }
};

/**
 * Função principal que a ADA chama para falar com o aluno
 */
export function buscarIntervencaoADA(resumoADA) {
    if (!resumoADA.precisaIntervencao) return null;

    const estrategia = ESTRATEGIAS_INTERVENCAO[resumoADA.clusterDominante];

    if (!estrategia) return {
        titulo: "Reforço Geral",
        falaADA: "Estás a ir bem, mas nota-se um cansaço em alguns temas. Que tal revisarmos os fundamentos?",
        prioridade: "Baixa"
    };

    return estrategia;
}
