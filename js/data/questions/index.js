/**
 * index.js — v10.0 (The Unified Hub)
 * Pool completo e consolidado: Blocos 1 a 6
 * Este arquivo centraliza todas as questões para o motor de busca global.
 */

// === IMPORTAÇÃO DOS BLOCOS CONSOLIDADOS ===
import { bloco1 } from './bloco1.js';
import { bloco2 } from './bloco2.js';
import { bloco3 } from './bloco3.js';
import { bloco4 } from './bloco4.js';
import { bloco5 } from './bloco5.js';
import { bloco6 } from './bloco6.js';

// === CONSTRUTOR DO POOL GLOBAL ===
// O Pool serve para funções de busca global, relatórios e auditoria da ADA.
export const pool = [
    ...bloco1, // A Base Numérica
    ...bloco2, // Números e Operações (Inteiros, Frações, Proporção)
    ...bloco3, // Grandezas e Medidas
    ...bloco4, // Álgebra e Padrão
    ...bloco5, // Estatística e Dados
    ...bloco6  // Geometria (Ângulos, Polígonos, Pitágoras)
];

console.log(`[LabTech Data] Pool Global carregado com ${pool.length} questões adaptativas.`);
