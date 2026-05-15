// js/engine/gameState.js

/**
 * G - Global State do LabTech v6.1
 * Gerencia a pontuação, métricas de inclusão e diagnóstico pedagógico.
 */
export const G = {
    // Status de Jogo
    vida: 100,
    energia: 60,
    combo: 0,
    nivel: 1,
    
    // Métricas de Desempenho
    acertos: 0,
    erros: 0,
    consec_erros: 0,
    
    // Diagnóstico Pedagógico (Clínica do Erro)
    historico: {}, 
    diagnostico: {
        errosAcumulados: {},
        clusterScores: {},
        historicoErros: [] // Para o log temporal da ADA
    },
    
    // Configurações e Preferências (DUA)
    musica: true,
    voz: true,
    respondeu: false, // Trava de segurança para evitar cliques múltiplos
    
    // Dados do Usuário
    nome: "Cientista",
    turma: "",
    currentBlock: 1,
    
    // Progressão
    trilha: 1 // Define a dificuldade dentro do bloco (1: Reconhecimento, 2: Aplicação, 3: Investigação)
};
