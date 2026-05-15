/**
 * question-normalizer.js — v2.0 "The Pedagogy Alchemist"
 * Responsabilidade: Converter com segurança qualquer estrutura de questão (antiga ou nova)
 * para o modelo estrito de Entidade Pedagógica sem corromper o banco de dados legível.
 */

export function normalizarQuestao(qRaw) {
    if (!qRaw) {
        console.error("🚨 [Normalizador] Tentativa de normalizar questão nula.");
        return null;
    }

    // 1. Identificação e Estrutura Básica
    const id = qRaw.id || `gen_${Math.random().toString(36).substring(2, 9)}`;
    const aula = Number(qRaw.aula) || 1;
    const tipo = qRaw.tipo || "padrao";
    const display = qRaw.display || "Desafio não formulado.";

    // 2. Normalização Matemática (Extração de Âncoras do Canvas)
    const aCru = qRaw.a !== undefined ? qRaw.a : (qRaw.inicio !== undefined ? qRaw.inicio : (qRaw.valorInicial !== undefined ? qRaw.valorInicial : 0));
    const bCru = qRaw.b !== undefined ? qRaw.b : (qRaw.salto !== undefined ? qRaw.salto : (qRaw.valor !== undefined ? qRaw.valor : 0));

    const a = parseFloat(String(aCru).replace(',', '.').replace(/[^\d.-]/g, '')) || 0;
    const b = parseFloat(String(bCru).replace(',', '.').replace(/[^\d.-]/g, '')) || 0;

    // 3. Resolução e Alternativas
    const res = qRaw.res !== undefined ? String(qRaw.res) : "0";
    const alternativas = Array.isArray(qRaw.alternativas) ? qRaw.alternativas : [];

    // 4. Campos Herdados (Legado v1.1)
    const bncc = qRaw.bncc || "EF00MA00"; 
    const cluster = qRaw.cluster || "geral";
    const tipoPedagogico = qRaw.tipoPedagogico || qRaw.categoria || "recomposicao";
    const dificuldade = Number(qRaw.dificuldade) || 1;
    const peso = Number(qRaw.peso) || 1;
    const passo = qRaw.passo || "Análise correta. Você dominou este conceito.";
    const dica = qRaw.dica || qRaw.descricao || "Atenção à regra matemática aplicada.";

    // ============================================================
    // 🧠 5. ALQUIMIA ADAPTATIVA: Injeção Segura da Nova Entidade
    // ============================================================
    
    // Mapeia habilidade para a nova nomenclatura, herdando a BNCC antiga se necessário
    const habilidade = qRaw.habilidade || bncc;

    // Garante array estruturado para os pré-requisitos lógicos
    const prerequisitos = Array.isArray(qRaw.prerequisitos) ? qRaw.prerequisitos : [];

    // Tenta capturar a misconception de forma nativa ou define padrão inteligente
    const misconception = qRaw.misconception || "indefinida";

    // Injeta o tipo de intervenção adaptativa que a ADA aplicará
    const tipoIntervencao = qRaw.tipoIntervencao || (tipoPedagogico === "recomposicao" ? "scaffold_visual" : "desafio_direto");

    // Identifica se a questão é visual/concreta ou abstrata baseado na área e tipo
    const representacao = qRaw.representacao || (qRaw.tipo === "geometria" ? "visual" : "abstrata");

    // Transição suave de peso: Carga Cognitiva assume o valor da dificuldade se ausente
    const cargaCognitiva = Number(qRaw.cargaCognitiva) || dificuldade;

    // Define o alvo que a telemetria do professor precisa monitorar
    const objetivoDiagnostico = qRaw.objetivoDiagnostico || `rastreamento_${habilidade}`;

    // Retorno Blindado e Expandido para a Nova Era do LabTech
    return {
        id,
        aula,
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
        
        // --- NOVOS ATRIBUTOS DE GOVERNANÇA INTEGRADOS ---
        habilidade,
        prerequisitos,
        misconception,
        tipoIntervencao,
        representacao,
        cargaCognitiva,
        objetivoDiagnostico,
        
        _raw: qRaw 
    };
}
