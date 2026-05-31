/**
 * @fileoverview ContratosPedagogicos.js
 * @description Enums globais para padronização da mediação histórico-cultural.
 */

export const FASES_GALPERIN = Object.freeze({
    MATERIALIZADA: "MATERIALIZADA",
    MATERIALIZADA_VISUAL: "MATERIALIZADA_VISUAL",
    VERBAL_EXTERNA: "VERBAL_EXTERNA",
    VERBAL_INTERNA: "VERBAL_INTERNA",
    MENTAL: "MENTAL"
});

export const REPRESENTACOES_SEMIOTICAS = Object.freeze({
    CONCRETA: "CONCRETA",
    VISUAL: "VISUAL",
    VISUAL_ATIPICA: "VISUAL_ATIPICA", // Para quebra de pseudoconceitos
    TEXTUAL: "TEXTUAL",               // Foco em letramento matemático
    ABSTRATA: "ABSTRATA",             // Algoritmos puros
    QUALQUER: "QUALQUER"
});

export const OBSTACULOS_COGNITIVOS = Object.freeze({
    PSEUDOCONCEITO: "PSEUDOCONCEITO",
    DEPENDENCIA_VISUAL: "DEPENDENCIA_VISUAL",
    MECANIZACAO_IMPULSIVA: "MECANIZACAO_IMPULSIVA",
    FRICCAO_COGNITIVA_ALTA: "FRICCAO_COGNITIVA_ALTA",
    NENHUM: "NENHUM"
});
