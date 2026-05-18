/**
 * @fileoverview LearningAnalytics.js
 * @description Motor de Telemetria e Geração de Relatórios do LabTech.
 * Converte dados atômicos de erro e acerto em visualizações HTML compreensíveis
 * e exportações de dados em formato CSV para o professor.
 * @version 2.0.0
 * @package LabTech / Core ADA
 */

export class LearningAnalytics {
    
    /**
     * Varre o objeto de histórico do estudante e gera os cards HTML de progresso
     * para serem injetados no painel de Dashboard (Interface).
     * @param {Object} historico - Objeto G.historico contendo as métricas por código BNCC.
     * @returns {string} Código HTML formatado pronto para injeção no DOM.
     */
    static gerarHtmlDashboardBNCC(historico) {
        if (!historico || Object.keys(historico).length === 0) {
            return "<p style='text-align:center; opacity:0.5; padding:20px; font-family:monospace;'>Sem dados suficientes para análise.</p>";
        }

        let htmlFinal = '';

        for (let hab in historico) {
            const hist = historico[hab];
            const acertos = hist.acertos || 0;
            const errosConceito = hist.erros_conceito || 0;
            const errosCalculo = hist.erros_calculo || 0;
            const total = acertos + errosConceito + errosCalculo;
            
            if (total === 0) continue;

            const txAcerto = Math.round((acertos / total) * 100);
            let diagnostico = "";

            // Avaliação Clínica Baseada em Evidências
            if (errosConceito > acertos) {
                diagnostico = `<div class="alerta-sinal" style="color: var(--neon-red, #ff3333); margin-top:5px; font-size:11px; font-weight:bold;">⚠️ Bloqueio Conceitual: O aluno não domina a regra base desta habilidade.</div>`;
            } else if (errosCalculo > 0) {
                diagnostico = `<div class="alerta-calc" style="color: #ffbb33; margin-top:5px; font-size:11px; font-weight:bold;">📐 Falha Operacional: Erros de atenção ou procedimento algorítmico.</div>`;
            } else {
                diagnostico = `<div class="alerta-ok" style="color: var(--neon-green, #00ff66); margin-top:5px; font-size:11px; font-weight:bold;">✅ Domínio Estabilizado.</div>`;
            }

            htmlFinal += `
                <div class="dash-card" style="background: rgba(255,255,255,0.03); border-left: 3px solid var(--choco-gold, #d4af37); padding: 12px; margin-bottom: 12px; border-radius: 4px;">
                    <div class="dash-card-header" style="display:flex; justify-content:space-between;">
                        <span class="hab-code" style="color:var(--choco-gold, #d4af37); font-weight:bold; font-family: monospace;">${hab}</span>
                        <span class="hab-pct" style="color:var(--neon-cyan, #00eaff); font-weight:bold;">${txAcerto}%</span>
                    </div>
                    <p class="hab-desc" style="font-size:11px; opacity:0.8; margin:5px 0;">${hist.desc || "Habilidade monitorada em tempo real."}</p>
                    <div class="dash-bar" style="width:100%; height:8px; background:#111; border-radius:4px; overflow:hidden; margin: 6px 0;">
                        <div class="dash-fill-ok" style="width:${txAcerto}%; height:100%; background:var(--neon-green, #00ff66);"></div>
                    </div>
                    ${diagnostico}
                </div>`;
        }

        return htmlFinal;
    }

    /**
     * Compila o histórico longitudinal do aluno em um arquivo CSV 
     * e força o download automático no navegador para uso do professor.
     * @param {string} nomeAluno - O nome do estudante na sessão atual.
     * @param {Object} historico - O objeto G.historico com as métricas computadas.
     */
    static exportarCSV(nomeAluno, historico) {
        if (!historico || Object.keys(historico).length === 0) {
            alert("Não há dados consolidados para exportar.");
            return;
        }

        // Cabeçalho Padrão do CSV
        let csvContent = "ESTUDANTE,HABILIDADE_BNCC,ACERTOS,ERROS_CONCEITO,ERROS_CALCULO,TAXA_ACERTO_%\n";

        for (let hab in historico) {
            const hist = historico[hab];
            const acertos = hist.acertos || 0;
            const errosConceito = hist.erros_conceito || 0;
            const errosCalculo = hist.erros_calculo || 0;
            const total = acertos + errosConceito + errosCalculo;
            
            const txAcerto = total > 0 ? Math.round((acertos / total) * 100) : 0;

            // Formatação de linha segura para Excel/Sheets
            csvContent += `"${nomeAluno || 'Anônimo'}","${hab}",${acertos},${errosConceito},${errosCalculo},${txAcerto}\n`;
        }

        // Transformação em Blob UTF-8 para garantir leitura correta de acentos
        const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        
        // Simulação de clique imperativo para forçar o download
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `Relatorio_LabTech_${nomeAluno.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
        
        document.body.appendChild(link);
        link.click();
        
        // Limpeza de memória
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
}
