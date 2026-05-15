/**
 * js/engine/question-validator.js — v11.0 "The Core Guardian"
 * Responsabilidade: Auditoria estrita e relatórios de Data Quality para o banco de dados.
 * Detecta: duplicatas, gabarito falso, distratores incompletos, alternativas repetidas e quebras de Governança.
 */

import { CATEGORIAS, PESOS } from './constants.js';

export function validarBancoCompleto(banco) {
    const idsVerificados = new Set();
    const relatorioErros = [];
    let contagemSucesso = 0;

    banco.forEach((q, index) => {
        const local = q.id ? `[ID: ${q.id} | Pos: ${index}]` : `[SEM ID | Pos: ${index}]`;
        const errosDaQuestao = [];

        // 1. Verificações de Identificação e Unicidade
        if (!q.id) {
            errosDaQuestao.push("Identificador 'id' é obrigatório e está ausente.");
        } else {
            if (idsVerificados.has(q.id)) {
                errosDaQuestao.push(`ID duplicado detectado no ecossistema: '${q.id}'.`);
            }
                idsVerificados.add(q.id);
        }

        if (!q.aula || isNaN(Number(q.aula))) {
            errosDaQuestao.push("Vínculo numérico de 'aula' ausente ou inválido.");
        }

        // 2. Verificações de Interface (Display e Feedback)
        if (!q.display || String(q.display).trim() === "") errosDaQuestao.push("Enunciado 'display' está vazio ou ausente.");
        if (!q.passo || String(q.passo).trim() === "") errosDaQuestao.push("Resolução didática 'passo' ausente.");
        if (!q.dica || String(q.dica).trim() === "") errosDaQuestao.push("Instrução de scaffold 'dica' ausente.");

        // 3. Verificações de Validação de Alternativas e Gabarito
        if (!q.alternativas || !Array.isArray(q.alternativas) || q.alternativas.length === 0) {
            errosDaQuestao.push("A estrutura de 'alternativas' não é um array ou está vazia.");
        } else {
            const acertos = q.alternativas.filter(a => a.tipo === 'acerto');
            const erros = q.alternativas.filter(a => a.tipo === 'erro');

            // Validação de quantidade estrita DUA
            if (acertos.length !== 1) {
                errosDaQuestao.push(`Quantidade de gabaritos ('acerto') inválida. Esperado: 1, Encontrado: ${acertos.length}`);
            }
            if (erros.length !== 3) {
                errosDaQuestao.push(`Quantidade de distratores ('erro') fora do padrão DUA. Esperado: 3, Encontrado: ${erros.length}`);
            }

            // Validação de correspondência do campo 'res'
            if (q.res !== undefined) {
                if (acertos.length === 1 && String(acertos[0].valor) !== String(q.res)) {
                    errosDaQuestao.push(`Conflito de Gabarito! O campo 'res' ('${q.res}') não bate com o valor da alternativa 'acerto' ('${acertos[0].valor}').`);
                }
            } else {
                errosDaQuestao.push("Campo de resposta curta rápida 'res' ausente.");
            }

            // Validação de alternativas com textos idênticos (Evita redundância de opções)
            const textosAlternativas = q.alternativas.map(a => String(a.valor).trim());
            const textosUnicos = new Set(textosAlternativas);
            if (textosUnicos.size !== textosAlternativas.length) {
                errosDaQuestao.push("Existem opções de resposta com conteúdos de texto/valores repetidos.");
            }

            // Validação profunda dos distratores (Natureza do Erro)
            erros.forEach((alt, idxAlt) => {
                if (!alt.categoria || !Object.values(CATEGORIAS).includes(alt.categoria)) {
                    errosDaQuestao.push(`Alt_Erro[${idxAlt}]: Categoria pedagógica inválida ou ausente ('${alt.categoria}').`);
                }
                if (!alt.erro || String(alt.erro).trim() === "") {
                    errosDaQuestao.push(`Alt_Erro[${idxAlt}]: Identificador interno de erro ('slug') ausente.`);
                }
                if (!alt.peso || !Object.values(PESOS).includes(Number(alt.peso))) {
                    errosDaQuestao.push(`Alt_Erro[${idxAlt}]: Peso adaptativo inválido ou fora da escala ('${alt.peso}').`);
                }
                if (!alt.descricao || String(alt.descricao).trim() === "") {
                    errosDaQuestao.push(`Alt_Erro[${idxAlt}]: Descrição analítica do erro ausente para o log docente.`);
                }
            });
        }

        // 4. Verificações da Nova Matriz de Governança Pedagógica V11 (Strict Mode)
        if (!q.bncc && !q.habilidade) {
            errosDaQuestao.push("Ausência de indexação curricular (requer 'bncc' ou 'habilidade').");
        }
        
        if (q.dificuldade !== undefined && (isNaN(Number(q.dificuldade)) || q.dificuldade < 1)) {
            errosDaQuestao.push(`Escala métrica de 'dificuldade' inválida ('${q.dificuldade}').`);
        }

        // Compilação do veredito da questão atual
        if (errosDaQuestao.length > 0) {
            relatorioErros.push({ local, erros: errosDaQuestao });
        } else {
            contagemSucesso++;
        }
    });

    // 5. Renderização do Painel Console de Diagnóstico Clínico
    console.log(`%c============= 💻 [AUDITORIA LABTECH V11] =============`, "color: #9c27b0; font-weight: bold;");
    console.log(`📊 Balanço Geral: Total Processado: ${banco.length} | Higienizadas: ${contagemSucesso} | Corrompidas: ${relatorioErros.length}`);
    
    if (relatorioErros.length > 0) {
        console.group("%c🚨 FALHAS DETECTADAS NO BANCO DE DADOS DETECTADAS", "color: #f44336; font-weight: bold;");
        relatorioErros.forEach(item => {
            console.group(`%cQuestão ${item.local}`, "color: #ff9800; font-weight: bold;");
            item.erros.forEach(err => console.error(`↳ ${err}`));
            console.groupEnd();
        });
        console.groupEnd();
        return false;
    }

    console.log("%c✅ BANCO DE DADOS 100% HIGIENIZADO! Governança garantida para o Instituto Federal.", "color: #4caf50; font-weight: bold;");
    return true;
}
