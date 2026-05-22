/**
 * @fileoverview LearningAnalytics.js
 * @description Motor de Telemetria e Geração de Relatórios do LabTech.
 * Converte dados atômicos em visualizações compreensíveis (BNCC e Painel Clínico XAI).
 * AGORA COM: Painel Longitudinal de Galperin (Estabilidade, Transferência e Fading).
 * @version 4.0.0
 * @package LabTech / Core ADA
 */

export class LearningAnalytics {
    
    // ... (métodos antigos de BNCC e CSV continuam aqui) ...

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

            if (errosConceito > acertos) diagnostico = `<div style="color: #ff3333; margin-top:5px; font-size:11px; font-weight:bold;">⚠️ Bloqueio Conceitual.</div>`;
            else if (errosCalculo > 0) diagnostico = `<div style="color: #ffbb33; margin-top:5px; font-size:11px; font-weight:bold;">📐 Falha Operacional/Atenção.</div>`;
            else diagnostico = `<div style="color: #00ff66; margin-top:5px; font-size:11px; font-weight:bold;">✅ Domínio Estabilizado.</div>`;

            htmlFinal += `
                <div style="background: rgba(255,255,255,0.03); border-left: 3px solid #d4af37; padding: 12px; margin-bottom: 12px;">
                    <div style="display:flex; justify-content:space-between;">
                        <span style="color:#d4af37; font-weight:bold;">${hab}</span>
                        <span style="color:#00eaff; font-weight:bold;">${txAcerto}%</span>
                    </div>
                    <p style="font-size:11px; opacity:0.8; margin:5px 0;">${hist.desc}</p>
                    <div style="width:100%; height:8px; background:#111; border-radius:4px; overflow:hidden;">
                        <div style="width:${txAcerto}%; height:100%; background:#00ff66;"></div>
                    </div>
                    ${diagnostico}
                </div>`;
        }
        return htmlFinal;
    }

    static exportarCSV(nomeAluno, historico) {
        if (!historico || Object.keys(historico).length === 0) { alert("Sem dados."); return; }
        let csvContent = "ESTUDANTE,HABILIDADE_BNCC,ACERTOS,ERROS_CONCEITO,ERROS_CALCULO,TAXA_ACERTO_%\n";
        for (let hab in historico) {
            const hist = historico[hab];
            const total = (hist.acertos||0) + (hist.erros_conceito||0) + (hist.erros_calculo||0);
            const tx = total > 0 ? Math.round(((hist.acertos||0) / total) * 100) : 0;
            csvContent += `"${nomeAluno || 'Anônimo'}","${hab}",${hist.acertos||0},${hist.erros_conceito||0},${hist.erros_calculo||0},${tx}\n`;
        }
        const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `Relatorio_${nomeAluno.replace(/\s+/g, '_')}.csv`;
        document.body.appendChild(link); link.click(); document.body.removeChild(link);
    }

    /**
     * 🧠 A EVOLUÇÃO: Gera o HTML rico do Painel de Explicabilidade da IA (XAI)
     * AGORA COM PESQUISA LONGITUDINAL DE GALPERIN INJETADA!
     */
    static gerarPainelDocenteHTML(perfil) {
        if (!perfil) return "<p>Calibração Pendente...</p>";

        // 1. Constrói o Mapa de Etiologia (Raiz dos Erros)
        let etiologiaHtml = '';
        const mapaErros = perfil.mapaEtiologiaErros || {};
        for (let [erro, cont] of Object.entries(mapaErros)) {
            if (cont > 0) {
                const width = Math.min(100, cont * 10); 
                etiologiaHtml += `
                <div style="margin-bottom: 8px;">
                    <div style="display:flex; justify-content:space-between; font-size: 10px; color: #bbb;">
                        <span>${erro.replace(/_/g, ' ')}</span>
                        <span>${cont} ocorrências</span>
                    </div>
                    <div style="width: 100%; background: #222; height: 6px; border-radius: 3px; margin-top:2px;">
                        <div style="width: ${width}%; background: var(--neon-red, #ff3333); height: 100%; border-radius: 3px;"></div>
                    </div>
                </div>`;
            }
        }

        // 2. Constrói a Matriz de Tendências Cognitivas
        let scoresHtml = '';
        const scores = perfil.scoreMatrizesPerfeitas || {};
        for (let [p, score] of Object.entries(scores)) {
            scoresHtml += `
            <div style="display:flex; justify-content: space-between; font-size: 11px; margin-bottom:6px; border-bottom: 1px solid #333; padding-bottom: 2px;">
                <span style="color: var(--neon-cyan, #00eaff);">${p.replace(/_/g, ' ')}</span>
                <span style="color: var(--choco-gold, #d4af37); font-weight:bold;">${score.toFixed(2)}</span>
            </div>`;
        }

        // 3. 🔬 NOVO: Constrói a Matriz de Transferência de Galperin
        const mat = perfil.matrizTransferencia || { procedural: {acertos:0, total:0}, transferencia: {acertos:0, total:0}, generalizacao: {acertos:0, total:0} };
        const txProc = mat.procedural.total > 0 ? (mat.procedural.acertos / mat.procedural.total) * 100 : 0;
        const txTransf = mat.transferencia.total > 0 ? (mat.transferencia.acertos / mat.transferencia.total) * 100 : 0;
        const txGen = mat.generalizacao.total > 0 ? (mat.generalizacao.acertos / mat.generalizacao.total) * 100 : 0;

        const htmlMatrizTransferencia = `
            <div style="margin-bottom: 8px;">
                <div style="display:flex; justify-content:space-between; font-size: 10px; color: #bbb;"><span>1. Procedimento (Acertos/Tentativas)</span><span>${Math.round(txProc)}%</span></div>
                <div style="width: 100%; background: #222; height: 6px; border-radius: 3px;"><div style="width: ${txProc}%; background: #00ff66; height: 100%; border-radius: 3px;"></div></div>
            </div>
            <div style="margin-bottom: 8px;">
                <div style="display:flex; justify-content:space-between; font-size: 10px; color: #bbb;"><span>2. Transferência (Textual/Semântica)</span><span>${Math.round(txTransf)}%</span></div>
                <div style="width: 100%; background: #222; height: 6px; border-radius: 3px;"><div style="width: ${txTransf}%; background: #ffbb33; height: 100%; border-radius: 3px;"></div></div>
            </div>
            <div style="margin-bottom: 8px;">
                <div style="display:flex; justify-content:space-between; font-size: 10px; color: #bbb;"><span>3. Generalização (Abstrata/Simbólica)</span><span>${Math.round(txGen)}%</span></div>
                <div style="width: 100%; background: #222; height: 6px; border-radius: 3px;"><div style="width: ${txGen}%; background: #00eaff; height: 100%; border-radius: 3px;"></div></div>
            </div>
        `;

        // 4. 🔬 NOVO: Semáforo de Estabilidade e Fading
        const estabilidade = perfil.estabilidadeConceitual || 'INDEFINIDA';
        let corEstabilidade = '#aaa';
        if (estabilidade === 'ALTA_ESTABILIZADA') corEstabilidade = '#00ff66';
        if (estabilidade === 'EM_CONSTRUCAO') corEstabilidade = '#ffbb33';
        if (estabilidade === 'BAIXA_RISCO_PSEUDOCONCEITO') corEstabilidade = '#ff3333';

        const dependente = perfil.dependenciaScaffold ? '<span style="color:#ff3333; font-weight:bold;">SIM (Fading Necessário)</span>' : '<span style="color:#00ff66;">NÃO (Autônomo)</span>';

        return `
        <div style="padding: 10px; color: white; text-align: left;">
            <h2 style="color: var(--choco-gold, #d4af37); text-align: center; font-family: 'Orbitron', sans-serif; margin-top: 0;">RADIOGRAFIA DA I.A. (XAI)</h2>
            <hr style="border: 1px solid #333; margin: 15px 0;">

            <div style="display: flex; justify-content: space-between; background: rgba(0,0,0,0.5); padding: 12px; border-radius: 8px;">
                <div>
                    <p style="margin:0; font-size: 10px; color: #888;">ESTUDANTE</p>
                    <p style="margin:0; font-weight: bold; font-size: 16px;">${perfil.id.replace('_', ' | ')}</p>
                </div>
                <div style="text-align: right;">
                    <p style="margin:0; font-size: 10px; color: #888;">DIAGNÓSTICO ATUAL</p>
                    <p style="margin:0; font-weight: bold; font-size: 16px; color: var(--neon-cyan, #00eaff);">${perfil.perfilDominante.replace(/_/g, ' ')}</p>
                </div>
            </div>

            <div style="margin-top: 15px; display: grid; grid-template-columns: 1fr; gap: 15px;">
                
                <div style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px; border-left: 3px solid #ffbb33;">
                    <h3 style="font-size: 12px; color: #aaa; margin-top:0;">MATRIZ DE TRANSFERÊNCIA DE GALPERIN</h3>
                    ${htmlMatrizTransferencia}
                    
                    <div style="margin-top: 15px; padding-top: 10px; border-top: 1px dashed #444;">
                        <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                            <span style="font-size: 11px; color:#aaa;">Estabilidade Conceitual:</span> 
                            <b style="color: ${corEstabilidade}; font-size: 11px;">${estabilidade.replace(/_/g, ' ')}</b>
                        </div>
                        <div style="display:flex; justify-content:space-between;">
                            <span style="font-size: 11px; color:#aaa;">Dependência de Scaffold Visual:</span> 
                            <span style="font-size: 11px;">${dependente}</span>
                        </div>
                    </div>
                </div>

                <div style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px; border-left: 3px solid var(--choco-gold, #d4af37);">
                    <h3 style="font-size: 12px; color: #aaa; margin-top:0;">MATRIZ DE TENDÊNCIAS COGNITIVAS</h3>
                    ${scoresHtml}
                    <div style="margin-top: 10px; padding-top: 10px; border-top: 1px dashed #444;">
                        <span style="font-size: 11px; color:#aaa;">Risco de Deriva Pedagógica:</span> 
                        <b style="color: ${perfil.derivaPedagogicaGeral > 0.5 ? '#ff3333' : '#00ff66'}; float:right;">${perfil.derivaPedagogicaGeral}</b>
                    </div>
                </div>

                <div style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px; border-left: 3px solid var(--neon-red, #ff3333);">
                    <h3 style="font-size: 12px; color: #aaa; margin-top:0;">MAPA DE ETIOLOGIA (RAIZ DOS ERROS)</h3>
                    ${etiologiaHtml || '<p style="font-size:11px; color:#00ff66; margin:0;">Nenhum erro processado no histórico.</p>'}
                </div>

            </div>
        </div>
        `;
    }
}
