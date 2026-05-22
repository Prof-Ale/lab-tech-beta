/**
 * @fileoverview LearningAnalytics.js
 * @description Motor de Telemetria e Geração de Relatórios do LabTech.
 * AGORA COM: Painel Longitudinal de Galperin (Estabilidade, Transferência e Fading).
 * @version 4.0.0
 * @package LabTech / Core ADA
 */

export class LearningAnalytics {
    
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
            htmlFinal += `
                <div style="background: rgba(255,255,255,0.03); border-left: 3px solid #d4af37; padding: 12px; margin-bottom: 12px;">
                    <div style="display:flex; justify-content:space-between;">
                        <span style="color:#d4af37; font-weight:bold;">${hab}</span>
                        <span style="color:#00eaff; font-weight:bold;">${txAcerto}%</span>
                    </div>
                    <div style="width:100%; height:8px; background:#111; border-radius:4px; overflow:hidden;">
                        <div style="width:${txAcerto}%; height:100%; background:#00ff66;"></div>
                    </div>
                </div>`;
        }
        return htmlFinal;
    }

    static gerarPainelDocenteHTML(perfil) {
        if (!perfil) return "<p>Calibração Pendente...</p>";

        // Processamento de dados de erros
        let etiologiaHtml = '';
        for (let [erro, cont] of Object.entries(perfil.mapaEtiologiaErros || {})) {
            if (cont > 0) {
                const width = Math.min(100, cont * 10); 
                etiologiaHtml += `<div style="margin-bottom: 8px;"><div style="display:flex; justify-content:space-between; font-size: 10px; color: #bbb;"><span>${erro.replace(/_/g, ' ')}</span><span>${cont}</span></div><div style="width: 100%; background: #222; height: 6px; border-radius: 3px; margin-top:2px;"><div style="width: ${width}%; background: var(--neon-red, #ff3333); height: 100%; border-radius: 3px;"></div></div></div>`;
            }
        }

        // Processamento de Scores
        let scoresHtml = '';
        for (let [p, score] of Object.entries(perfil.scoreMatrizesPerfeitas || {})) {
            scoresHtml += `<div style="display:flex; justify-content: space-between; font-size: 11px; margin-bottom:6px; border-bottom: 1px solid #333;"><span style="color: var(--neon-cyan, #00eaff);">${p.replace(/_/g, ' ')}</span><span style="color: var(--choco-gold, #d4af37); font-weight:bold;">${score.toFixed(2)}</span></div>`;
        }

        // Processamento de Transferência
        const mat = perfil.matrizTransferencia || { procedural: {acertos:0, total:0}, transferencia: {acertos:0, total:0}, generalizacao: {acertos:0, total:0} };
        const txProc = mat.procedural.total > 0 ? (mat.procedural.acertos / mat.procedural.total) * 100 : 0;
        const txTransf = mat.transferencia.total > 0 ? (mat.transferencia.acertos / mat.transferencia.total) * 100 : 0;
        const txGen = mat.generalizacao.total > 0 ? (mat.generalizacao.acertos / mat.generalizacao.total) * 100 : 0;

        const corEstabilidade = perfil.estabilidadeConceitual === 'ALTA_ESTABILIZADA' ? '#00ff66' : (perfil.estabilidadeConceitual === 'BAIXA_RISCO_PSEUDOCONCEITO' ? '#ff3333' : '#ffbb33');
        const dependente = perfil.dependenciaScaffold ? '<span style="color:#ff3333; font-weight:bold;">SIM (Fading Necessário)</span>' : '<span style="color:#00ff66;">NÃO</span>';

        return `
        <div style="padding: 10px; color: white; text-align: left;">
            <h2 style="color: var(--choco-gold, #d4af37); text-align: center; font-family: 'Orbitron', sans-serif; margin-top: 0;">RADIOGRAFIA DA I.A. (XAI)</h2>
            
            <div style="display: flex; justify-content: space-between; background: rgba(0,0,0,0.5); padding: 12px; border-radius: 8px;">
                <div>
                    <p style="margin:0; font-size: 10px; color: #888;">ESTUDANTE</p>
                    <p style="margin:0; font-weight: bold; font-size: 16px;">${perfil.id.replace('_', ' | ')}</p>
                </div>
                <div style="text-align: right;">
                    <p style="margin:0; font-size: 10px; color: #888;">DIAGNÓSTICO</p>
                    <p style="margin:0; font-weight: bold; font-size: 16px; color: var(--neon-cyan, #00eaff);">${perfil.perfilDominante.replace(/_/g, ' ')}</p>
                </div>
            </div>

            <div style="margin-top: 10px; background: rgba(0,0,0,0.6); padding: 8px; border-radius: 4px; border: 1px solid #444;">
                <div style="display:flex; justify-content:space-between; font-size: 10px; color: #888;">
                    <span>CERTEZA DA I.A. (CONFIANÇA)</span>
                    <span>${perfil.confiancaDiagnostica || 0}%</span>
                </div>
                <div style="width: 100%; background: #222; height: 6px; border-radius: 3px; margin-top:4px;">
                    <div style="width: ${perfil.confiancaDiagnostica || 0}%; background: ${perfil.confiancaDiagnostica > 40 ? '#00eaff' : '#d4af37'}; height: 100%; border-radius: 3px;"></div>
                </div>
            </div>

            <div style="margin-top: 15px; display: grid; grid-template-columns: 1fr; gap: 15px;">
                <div style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px; border-left: 3px solid #ffbb33;">
                    <h3 style="font-size: 12px; color: #aaa; margin-top:0;">MATRIZ DE TRANSFERÊNCIA</h3>
                    <div style="font-size:10px; color:#bbb;">Procedural: ${Math.round(txProc)}% | Transf: ${Math.round(txTransf)}% | Gen: ${Math.round(txGen)}%</div>
                    <div style="margin-top:10px; font-size: 11px;">Estabilidade: <b style="color:${corEstabilidade}">${perfil.estabilidadeConceitual}</b></div>
                    <div style="font-size: 11px;">Scaffold Visual: ${dependente}</div>
                </div>
                <div style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px; border-left: 3px solid var(--neon-red, #ff3333);">
                    <h3 style="font-size: 12px; color: #aaa; margin-top:0;">ETIOLOGIA DOS ERROS</h3>
                    ${etiologiaHtml}
                </div>
            </div>
        </div>`;
    }
}
