/**
 * @fileoverview DiagnosticEngine.js
 * @description Motor de Biópsia Cognitiva Avançado.
 * AGORA COM: Cálculo local de Nível de Confiança Diagnóstica (XAI Pedagógico).
 * @version 5.1.0 (Sprint Limpo - Core ADA)
 */

export class DiagnosticEngine {
    constructor(familyRegistry = {}) {
        this.familyRegistry = familyRegistry;
        this.CLUSTERS = {
            "NUMEROCENTRISMO": ["valorposicional_ignora_ordem", "decomposicao_confunde_dezena_unidade", "inteiros_confunde_sinal_adicao", "pseudoconceito_valor_posicional"],
            "FRACIONARIO_DECIMAL": ["fracao_soma_denominadores", "fracao_soma_direta_bases_diferentes", "decimal_soma_desalinha_virgula"],
            "MODELAGEM_E_ALGEBRA": ["problema_ignora_condicao_inteira", "modelagem_interpreta_dobro_como_soma", "equacao_mantem_sinal_transposicao"]
        };
    }

    /**
     * @param {Object} alternativa - Alternativa vinda do QuestionNormalizer.
     * @param {string} familiaAlvo - ID da família.
     * @param {Object} historicoEstudante - Perfil vindo do ProfileEngine.
     * @returns {Object} Laudo de Mediação com Confiança Mapeada.
     */
    analisarAlternativa(alternativa, familiaAlvo, historicoEstudante = {}) {
        if (!alternativa) return this._gerarFallbackErro("Sensor nulo.");

        const isAcerto = alternativa.tipo === 'acerto' || alternativa.tipo === 'correto' || alternativa.correta === true;
        if (isAcerto) {
            return { correto: true, diagnostico: "CONCEITO_ESTAVEL", statusAluno: "PRODUCAO_AUTONOMA", planoDeMediacao: null };
        }

        const dadosFamilia = this.familyRegistry[familiaAlvo] || { conceitoEstrutural: "GERAL" };
        const erroId = alternativa.misconception || alternativa.erro || 'erro_generico';
        const cluster = this._resolverCluster(erroId);

        // --- CÁLCULO CIRÚRGICO: NÍVEL DE CONFIANÇA DIAGNÓSTICA ---
        // Fatores de Convergência Clínica locais (Edge/Client-Side)
        const rastroErros = historicoEstudante.errosRecorrentes || [];
        const errosNoMesmoCluster = rastroErros.filter(id => this._resolverCluster(id) === cluster).length;
        
        const isErroPersistente = rastroErros.includes(erroId);
        const tempoResposta = historicoEstudante.ultimoTempoResposta || 30; // em segundos
        const isLatenciaSintomatica = tempoResposta < 12; // Resposta muito rápida indica automação de pseudoconceito

        let confiancaScore = 0.50; // Base: Erro isolado em vanguarda de teste
        if (isErroPersistente) confiancaScore += 0.25; // Evidência longitudinal direta
        if (errosNoMesmoCluster >= 3) confiancaScore += 0.15; // Sintoma sistêmico no mesmo cluster conceitual
        if (isLatenciaSintomatica) confiancaScore += 0.08; // Impulsividade típica de pseudoconceito automatizado
        
        const nivelConfiancaDiagnostica = Math.min(confiancaScore, 0.98); // Teto de 98% para manter falseabilidade

        const grauSeveridade = isErroPersistente ? "CRÍTICO (Pseudoconceito Estabilizado)" : "MODERADO (Instabilidade Operacional)";
        const conceitoAfetado = dadosFamilia.conceitoEstrutural;

        const hipoteseCognitiva = {
            conceitoAfetado,
            familiaOrigem: familiaAlvo,
            tipoFalha: alternativa.tipo_falha || "PSEUDOCONCEITO_EMPIRICO",
            grauSeveridade,
            nivelConfiancaDiagnostica, // Injeção da Cirurgia de Confiança
            evidencia: alternativa.diagnostico_cognitivo || "Evidência de leitura empírica."
        };

        const telemetriaPedagogica = {
            misconceptionDetectada: `[${cluster}] - ${erroId}`,
            conceitoAfetado,
            nivelConfianca: nivelConfiancaDiagnostica,
            estagioProgressoSujeito: historicoEstudante.estagioConceitual || "DISRUPÇÃO_INICIAL"
        };

        // Geração limpa do rascunho de mediação (Será refinado pela BOA)
        const algarismoFoco = alternativa.contexto_dinamico?.algarismo || "2";
        const exemploContexto = alternativa.contexto_dinamico?.exemplo || "23";
        const perguntaInvarianteDinamica = (dadosFamilia.pergunta_invariante_pura || "O que mudou?")
            .replace(/{algarismo}/g, algarismoFoco)
            .replace(/{exemplo_contexto}/g, exemploContexto);

        const planoDeMediacaoRascunho = {
            objetivo: alternativa.objetivo_intervencao || `Romper a dependência de aparência de ${conceitoAfetado}.`,
            faseGalperinSugerida: isErroPersistente ? "MATERIALIZADA_CONCRETA" : "VERBAL_EXPLICATIVA",
            perguntaInvariante: perguntaInvarianteDinamica,
            acaoReflexiva: alternativa.acao_reflexiva || "Provocar conflito semiótico.",
            representacaoPreferencial: "TABUADO_DINAMICO",
            choqueSemioticoRecomendado: isErroPersistente,
            nivelConfiancaDiagnostica, // Carimbo de explicabilidade para o analytics
            gatilhoVisual: alternativa.gatilho_visual || "[GATILHO_FALLBACK]"
        };

        return {
            correto: false,
            diagnostico: "CONCEITO_EM_CONFLITO",
            statusAluno: "INTERVENÇÃO_REQUERIDA",
            clusterTaxonomico: cluster,
            hipoteseCognitiva,
            telemetriaPedagogica,
            planoDeMediacao: planoDeMediacaoRascunho
        };
    }

    _resolverCluster(id) {
        if (!id) return "OUTROS";
        for (const [name, list] of Object.entries(this.CLUSTERS)) {
            if (list.some(e => String(id).toLowerCase().includes(e.toLowerCase()))) return name;
        }
        return "OUTROS";
    }
}
