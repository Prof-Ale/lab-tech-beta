/**
 * @fileoverview ContratosPedagogicos.js
 * @description Fonte única da verdade ontológica e semiótica do Ecossistema LabTech/ADA.
 * Unifica os contratos entre ProfileEngine, BOA e AdaptiveSelector.
 * @package LabTech / Core ADA
 */

export const REPRESENTACOES_SEMIOTICAS = {
    CONCRETA: "CONCRETA",
    VISUAL: "VISUAL",
    TEXTUAL: "TEXTUAL",
    ABSTRATA: "ABSTRATA"
};

/**
 * Mapeia de forma bidirecional e segura as diretrizes da BOA para os renderizadores da UI.
 */
export const MAPEADOR_REPRESENTACAO_UI = {
    "BLOCO_MANIPULAVEL_DIGITAL": REPRESENTACOES_SEMIOTICAS.CONCRETA,
    "SUPORTE_GRAFICO_REPRESENTATIVO": REPRESENTACOES_SEMIOTICAS.VISUAL,
    "TEXTUAL_REFLEXIVA": REPRESENTACOES_SEMIOTICAS.TEXTUAL,
    "SIMBOLICA_CONCEITUAL": REPRESENTACOES_SEMIOTICAS.ABSTRATA,
    "QUALQUER": "QUALQUER"
};

export const INTERFACE_RENDERERS = {
    [REPRESENTACOES_SEMIOTICAS.CONCRETA]: "canvas_material_dourado",
    [REPRESENTACOES_SEMIOTICAS.VISUAL]: "canvas_esquema_grafico",
    [REPRESENTACOES_SEMIOTICAS.TEXTUAL]: "dom_texto_scaffold",
    [REPRESENTACOES_SEMIOTICAS.ABSTRATA]: "dom_equacao_simbolica"
};
