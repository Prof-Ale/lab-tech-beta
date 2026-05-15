/**
 * js/engine/constants.js — Versão 8.0 QA
 * Definições globais e imutáveis para o LabTech
 */

export const CATEGORIAS = Object.freeze({
    CONCEITO: 'conceito',
    PROCEDIMENTO: 'procedimento',
    CALCULO: 'calculo',
    INTERPRETACAO: 'interpretacao',
    ESTRATEGIA: 'estrategia',
    ATENCAO: 'atencao'
});

export const PESOS = Object.freeze({
    LEVE: 1,  // Erros de atenção/distração
    MEDIO: 2, // Erros de processo ou método
    GRAVE: 3  // Erros de fundamento/base conceitual
});

export const CLUSTERS = Object.freeze({
    NUMEROCENTRISMO: {
        id: 'NUMEROCENTRISMO',
        label: 'Sistema Numérico',
        cor: '#00e5ff'
    },
    FRACIONARIO_DECIMAL: {
        id: 'FRACIONARIO_DECIMAL',
        label: 'Raciocínio Fracionário',
        cor: '#00ff88'
    },
    MODELAGEM_ALGEBRA: {
        id: 'MODELAGEM_ALGEBRA',
        label: 'Modelagem Algébrica',
        cor: '#ffe600'
    },
    ESTRUTURA_ESPACIAL: {
        id: 'ESTRUTURA_ESPACIAL',
        label: 'Geometria e Espaço',
        cor: '#d4a017'
    },
    LITERACIA_DADOS: {
        id: 'LITERACIA_DADOS',
        label: 'Estatística e Dados',
        cor: '#ff4444'
    }
});

// Mensagens padrão da ADA por categoria
export const FEEDBACK_ADA = Object.freeze({
    [CATEGORIAS.CONCEITO]: "Anomalia de base detectada. O conceito precisa ser revisto.",
    [CATEGORIAS.PROCEDIMENTO]: "A trilha lógica está correta, mas o passo-a-passo falhou.",
    [CATEGORIAS.CALCULO]: "Atenção aos sinais e operações básicas!",
    [CATEGORIAS.INTERPRETACAO]: "O problema requer uma leitura mais atenta dos dados."
});
