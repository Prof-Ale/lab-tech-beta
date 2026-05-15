/**
 * question-normalizer.js — v1.1 "LabTech Gatekeeper"
 * Responsabilidade: Garantir que qualquer formato de questão (antigo ou novo)
 * seja convertido para uma estrutura estrita, segura e previsível.
 */

export function normalizarQuestao(qRaw) {
    if (!qRaw) {
        console.error("🚨 [Normalizador] Tentativa de normalizar questão nula.");
        return null;
    }

    // 1. Identificação Básica
    const id = qRaw.id || `gen_${Math.random().toString(36).substring(2, 9)}`;
    const aula = Number(qRaw.aula) || 1; // 🛠️ CORREÇÃO: Resgatando a 'aula' perdida!
    const tipo = qRaw.tipo || "padrao";
    const display = qRaw.display || "Desafio não formulado.";

    // 2. Normalização Matemática
    const aCru = qRaw.a !== undefined ? qRaw.a : (qRaw.inicio !== undefined ? qRaw.inicio : (qRaw.valorInicial !== undefined ? qRaw.valorInicial : 0));
    const bCru = qRaw.b !== undefined ? qRaw.b : (qRaw.salto !== undefined ? qRaw.salto : (qRaw.valor !== undefined ? qRaw.valor : 0));

    // 🛠️ CORREÇÃO: Troca vírgula por ponto ANTES do Regex para salvar os decimais!
    const a = parseFloat(String(aCru).replace(',', '.').replace(/[^\d.-]/g, '')) || 0;
    const b = parseFloat(String(bCru).replace(',', '.').replace(/[^\d.-]/g, '')) || 0;

    // 3. Resolução e Alternativas
    const res = qRaw.res !== undefined ? String(qRaw.res) : "0";
    const alternativas = Array.isArray(qRaw.alternativas) ? qRaw.alternativas : [];

    // 4. Telemetria e Diagnóstico
    const bncc = qRaw.bncc || "EF00MA00"; 
    const cluster = qRaw.cluster || "geral";
    const tipoPedagogico = qRaw.tipoPedagogico || qRaw.categoria || "recomposicao";
    const dificuldade = Number(qRaw.dificuldade) || 1;
    const peso = Number(qRaw.peso) || 1;

    // 5. ADA e Feedback Escrito
    const passo = qRaw.passo || "Análise correta. Você dominou este conceito.";
    const dica = qRaw.dica || qRaw.descricao || "Atenção à regra matemática aplicada.";

    // Retorno Blindado
    return {
        id,
        aula, // 🛠️ Adicionado aqui para o seletor poder ler
        tipo,
        display,
        a,
        b,
        res,
        alternativas,
        bncc,
        cluster,
        tipoPedagogico,
        dificuldade,
        peso,
        passo,
        dica,
        _raw: qRaw 
    };
}
