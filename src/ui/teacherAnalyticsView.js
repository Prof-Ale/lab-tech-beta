/**
 * @fileoverview TeacherAnalyticsView.js
 * @description Renderizador de Interface do Painel Docente e Glossário XAI.
 * VERSÃO 1.0.0 (Sprint Limpo): Converte os payloads do TeacherAnalyticsEngine em elementos DOM ricos.
 * @package LabTech / UI Layer
 */

import { TeacherAnalyticsEngine } from '../core/ada/TeacherAnalyticsEngine.js';

export class TeacherAnalyticsView {

    /**
     * Inicializa e monta as estruturas de modais vazias no DOM, caso não existam.
     */
    static inicializarEstruturaModais() {
        // 🚨 1. MODAL DO PAINEL DOCENTE (Alt + P)
        if (!document.getElementById('modal-docente-xai')) {
            const mDoc = document.createElement('div');
            mDoc.id = 'modal-docente-xai';
            mDoc.className = 'modal';
            mDoc.innerHTML = `
                <div class="mc" style="max-width: 800px; border: 2px solid var(--choco-gold, #d4af37); background: #0c0c0e; position: relative; padding: 25px 20px; box-shadow: 0 0 30px rgba(212, 175, 55, 0.15); color: #fff; border-radius: 12px;">
                    <button class="mx" style="position: absolute; top: 15px; right: 25px; font-size: 22px; color: #888; background: none; border: none; cursor: pointer; z-index: 1000;" onclick="document.getElementById('modal-docente-xai').classList.remove('active')">✕</button>
                    <div id="content-docente-xai" style="max-height: 75vh; overflow-y: auto; padding-right: 10px; margin-top: 10px; font-family: 'Nunito', sans-serif;"></div>
                </div>`;
            document.body.appendChild(mDoc);
        }

        // 📖 2. MODAL DO GLOSSÁRIO DO PROFESSOR (Alt + J)
        if (!document.getElementById('modal-glossario-xai')) {
            const mGlo = document.createElement('div');
            mGlo.id = 'modal-glossario-xai';
            mGlo.className = 'modal';
            mGlo.innerHTML = `
                <div class="mc" style="max-width: 700px; border: 2px solid var(--neon-cyan, #00eaff); background: #0c0c0e; position: relative; padding: 25px 20px; box-shadow: 0 0 30px rgba(0, 234, 255, 0.15); color: #fff; text-align: left; border-radius: 12px;">
                    <button class="mx" style="position: absolute; top: 15px; right: 25px; font-size: 22px; color: #888; background: none; border: none; cursor: pointer;" onclick="document.getElementById('modal-glossario-xai').classList.remove('active')">✕</button>
                    <div id="content-glossario-xai" style="max-height: 75vh; overflow-y: auto; padding-right: 10px; font-family: 'Nunito', sans-serif;"></div>
                </div>`;
            document.body.appendChild(mGlo);
        }
    }

    /**
     * Captura o estado atual, processa no motor analítico e renderiza o HTML interno do Painel Docente.
     * @param {Object} perfilCognitivo - Perfil vindo do ProfileEngine.
     */
    static renderizarPainelDocente(perfilCognitivo) {
        this.inicializarEstruturaModais();
        const container = document.getElementById('content-docente-xai');
        if (!container) return;

        const dadosRelatorio = TeacherAnalyticsEngine.gerarRelatorioEstudante(perfilCognitivo);
        if (!dadosRelatorio) {
            container.innerHTML = `<p style="color: #ff3333; text-align:center;">⚠️ Perfil Cognitivo não instanciado ou sem interações registradas.</p>`;
            return;
        }

        // Buscando a primeira habilidade ativa para exibição de exemplo no painel
        const primeiraChaveHab = Object.keys(dadosRelatorio.habilidades)[0];
        const habAtiva = primeiraChaveHab ? dadosRelatorio.habilidades[primeiraChaveHab] : null;

        if (!habAtiva || habAtiva.status === "COLETA_DE_DADOS") {
            container.innerHTML = `
                <h2 style="color: var(--choco-gold, #d4af37); font-family: 'Orbitron', sans-serif; margin-top:0;">👁️‍🗨️ DIAGNÓSTICO COGNITIVO ADA (XAI)</h2>
                <div style="background: rgba(255,255,255,0.02); padding: 30px; border-radius: 8px; border: 1px dashed #444; text-align:center; margin-top:20px;">
                    <p style="color:#aaa; font-size:14px;">Aguardando volume crítico de dados (Massa Crítica) para processar os indicadores descritivos explicáveis.</p>
                    <p style="color:var(--neon-cyan); font-size:12px; font-family:monospace;">Status Atual: COLETANDO ASSINATURA DE TRANSFERÊNCIA SEMIÓTICA...</p>
                </div>`;
            return;
        }

        const diag = habAtiva.diagnostico;
        const ia = habAtiva.acaoDaIA;
        const prof = habAtiva.acaoSugeridaProfessor;
        const xai = habAtiva.evidenciasObservadas;

        // Estilização dinâmica da badge de risco crítico
        const corRisco = dadosRelatorio.riscoCritico === "ALTO" ? "#ff3333" : "#00ff66";

        // CONSTRUÇÃO DINÂMICA DO CORPO DO PAINEL DOCENTE
        let html = `
            <div style="border-bottom: 1px solid #333; padding-bottom: 15px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center;">
                <h2 style="color: var(--choco-gold, #d4af37); font-family: 'Orbitron', sans-serif; margin: 0; font-size: 20px;">👁️‍🗨️ PAINEL DIAGNÓSTICO DOCENTE (XAI)</h2>
                <span style="font-size:11px; font-family:monospace; background: rgba(212,175,55,0.1); border: 1px solid var(--choco-gold); padding: 4px 8px; border-radius: 4px; color: var(--choco-gold);">Estudante: ${dadosRelatorio.estudanteId}</span>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 25px;">
                <div style="background: #131316; padding: 15px; border-radius: 8px; border-left: 4px solid var(--choco-gold);">
                    <div style="font-size: 11px; color: #888; text-transform: uppercase;">Confiança do Diagnóstico</div>
                    <div style="font-size: 24px; font-weight: bold; color: #fff; font-family: 'Orbitron', sans-serif; margin-top: 5px;">${dadosRelatorio.confiancaGeralDaIA}%</div>
                </div>
                <div style="background: #131316; padding: 15px; border-radius: 8px; border-left: 4px solid ${corRisco};">
                    <div style="font-size: 11px; color: #888; text-transform: uppercase;">Risco Crítico de Pseudoconceito</div>
                    <div style="font-size: 24px; font-weight: bold; color: ${corRisco}; font-family: 'Orbitron', sans-serif; margin-top: 5px;">${dadosRelatorio.riscoCritico}</div>
                </div>
            </div>

            <h3 style="color:#fff; font-size:14px; border-bottom: 1px solid #222; padding-bottom: 5px; margin-bottom: 12px; font-family: 'Orbitron', sans-serif;">1. LAUDO CLÍNICO RECALCULADO</h3>
            <div style="background: #131316; padding: 15px; border-radius: 8px; margin-bottom: 20px; font-size: 13px; line-height: 1.6;">
                <p style="margin: 4px 0;"><b>Conceito Alvo Mapeado:</b> <span style="color:var(--choco-gold);">${diag.fcoConceitual}</span></p>
                <p style="margin: 4px 0;"><b>Estágio de Formação (Galperin):</b> <span style="color:#00eaff;">${diag.estagioFormacao}</span></p>
                <p style="margin: 4px 0;"><b>Obstáculo Identificado:</b> <span style="color:#ffbb33;">${diag.obstaculoIdentificado}</span></p>
                <div style="margin-top: 12px; padding-top: 10px; border-top: 1px solid #25252b;">
                    <b style="color: #fff;">Índice de Transferência Conceitual (ITC): <span style="color:#00ff66; font-size:16px; font-family:'Orbitron';">${diag.indiceTransferencia.porcentagem}</span></b>
                    <p style="color:#aaa; font-style: italic; margin-top: 5px; font-size:12px;">Interpretation: ${diag.indiceTransferencia.interpretacao}</p>
                </div>
            </div>

            <h3 style="color:#fff; font-size:14px; border-bottom: 1px solid #222; padding-bottom: 5px; margin-bottom: 12px; font-family: 'Orbitron', sans-serif;">2. MATRIZ DE TRANSIÇÃO SEMIÓTICA REALIZADA</h3>
            <div style="background: #131316; padding: 15px; border-radius: 8px; margin-bottom: 20px; font-size: 13px;">
                <div style="display:flex; justify-content:space-between; font-size:11px; color:#888; margin-bottom: 8px; font-family:monospace;">
                    <span>Vetor de Mudança Representacional (Choques)</span>
                    <span>Sucessos / Tentativas</span>
                </div>`;

        for (const [vetor, dados] of Object.entries(xai.matrizDeTransicaoSemiotica)) {
            const nomeFormatado = vetor.replace(/_/g, ' ');
            const taxa = dados.tentativas > 0 ? Math.round((dados.sucessos / dados.tentativas) * 100) : 0;
            const corBarra = taxa >= 75 ? '#00ff66' : (taxa >= 40 ? '#ffbb33' : '#ff3333');

            html += `
                <div style="margin-bottom: 12px;">
                    <div style="display:flex; justify-content:space-between; margin-bottom: 4px; font-size:12px;">
                        <span style="color:#eee; font-family:monospace;">${nomeFormatado}</span>
                        <b style="color:#fff;">${taxa}% (${dados.sucessos}/${dados.tentativas})</b>
                    </div>
                    <div style="width: 100%; background: #222; height: 6px; border-radius: 3px; overflow: hidden;">
                        <div style="width: ${taxa}%; background: ${corBarra}; height: 100%;"></div>
                    </div>
                </div>`;
        }

        html += `
            </div>

            <h3 style="color:#fff; font-size:14px; border-bottom: 1px solid #222; padding-bottom: 5px; margin-bottom: 12px; font-family: 'Orbitron', sans-serif;">3. COMPORTAMENTO AUTÔNOMO DA PLATAFORMA (XAI)</h3>
            <div style="background: #131316; padding: 15px; border-radius: 8px; margin-bottom: 20px; font-size: 13px; line-height: 1.6; border-left: 4px solid #00eaff;">
                <p style="margin: 4px 0;"><b>Fase Ativa de Mediação:</b> ${ia.faseMediacao}</p>
                <p style="margin: 4px 0;"><b>Objetivo Adaptativo Atual:</b> ${ia.objetivoAtual}</p>
                <p style="margin: 4px 0;"><b>Estratégia Repassada:</b> <span style="font-family:monospace; color:#00eaff;">${ia.estrategia}</span></p>
                <p style="margin: 4px 0; color:#00eaff;"><b>Próxima Ação Agendada pela ADA:</b> ${ia.proximaIntervencaoPrevista}</p>
            </div>

            <h3 style="color:#fff; font-size:14px; border-bottom: 1px solid #222; padding-bottom: 5px; margin-bottom: 12px; font-family: 'Orbitron', sans-serif;">4. DIRETRIZ PARA ATENDIMENTO HUMANO PRESENCIAL</h3>
            <div style="background: rgba(212,175,55,0.03); border: 1px solid rgba(212,175,55,0.3); padding: 15px; border-radius: 8px; margin-bottom: 15px; font-size: 13px; line-height: 1.6;">
                <div style="display:flex; justify-content:space-between; margin-bottom: 8px; align-items:center;">
                    <b style="color: var(--choco-gold, #d4af37);">Ação Recomendada ao Docente:</b>
                    <span style="font-size:11px; font-family:'Orbitron'; padding: 2px 6px; background: #ff3333; color:#fff; border-radius:3px; display: ${prof.prioridade === "ALTA" ? "inline" : "none"};">INTERVENÇÃO REQUERIDA</span>
                </div>
                <p style="color: #ddd; margin: 0; text-align: justify;">${prof.recomendacao}</p>
            </div>

            <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top:20px;">
                <button id="btn-ia-validar" class="ba" style="padding:10px; font-family:'Orbitron'; font-size:11px; background:rgba(0,255,102,0.1); border:1px solid #00ff66; color:#00ff66; cursor:pointer; border-radius:4px;">Chancelar Diagnóstico (Validar)</button>
                <button id="btn-ia-refutar" class="ba" style="padding:10px; font-family:'Orbitron'; font-size:11px; background:rgba(255,51,51,0.1); border:1px solid #ff3333; color:#ff3333; cursor:pointer; border-radius:4px;">Contestar Diagnóstico (Refutar)</button>
            </div>
        `;

        container.innerHTML = html;
        document.getElementById('modal-docente-xai').classList.add('active');
    }

    /**
     * Renderiza o HTML estático explicativo do Glossário do Professor (Alt + J).
     */
    static renderizarGlossarioDocente() {
        this.inicializarEstruturaModais();
        const container = document.getElementById('content-glossario-xai');
        if (!container) return;

        container.innerHTML = `
            <h2 style="color: var(--neon-cyan, #00eaff); text-align: center; font-family: 'Orbitron', sans-serif; margin-top: 0; font-size: 18px;">📖 GLOSSÁRIO CLÍNICO DA I.A. (XAI DOCENTE)</h2>
            <p style="color: #888; font-size:12px; text-align:center; margin-top:4px;">Suporte teórico de fundamentação das tomadas de decisão da ADA</p>
            <hr style="border: 1px solid #222; margin: 15px 0;">
            
            <div style="font-size:13px; line-height:1.6; color:#ddd;">
                <h3 style="color: var(--choco-gold, #d4af37); font-size: 14px; font-family:'Orbitron'; margin-bottom:6px;">1. ÍNDICE DE TRANSFERÊNCIA CONCEITUAL (ITC)</h3>
                <p style="margin-top:0; text-align:justify;">Métrica matemática proprietária do LabTech baseada em Galperin e Davýdov. Não mede apenas acertos e erros cumulativos, mas sim a capacidade do estudante de manter o entendimento de uma propriedade matemática invariante estável quando forçado a mudar de canal semiótico (ex: resolver no concreto e depois ser testado no abstrato puro).</p>

                <h3 style="color: var(--choco-gold, #d4af37); font-size: 14px; font-family:'Orbitron'; margin-bottom:6px; margin-top:15px;">2. PSEUDOCONCEITO ÉSTAVEL</h3>
                <p style="margin-top:0; text-align:justify;">Ocorre quando o estudante automatizou uma regra de execução de forma estritamente mecânica e empírica (decorou um truque prático), mas aplica essa regra de forma cega, gerando desvios conceituais graves sempre que o formato visual da questão sofre alteração.</p>

                <h3 style="color: var(--choco-gold, #d4af37); font-size: 14px; font-family:'Orbitron'; margin-bottom:6px; margin-top:15px;">3. REGRESSÃO CONCEITUAL</h3>
                <p style="margin-top:0; text-align:justify;">Fenômeno clínico onde o estudante apresenta queda abrupta em seus índices estáveis de abstração após atingir a fase mental. Caracteriza um colapso temporário da generalização, demandando retrocesso adaptativo estratégico para a fase verbal linguística.</p>

                <h3 style="color: var(--choco-gold, #d4af37); font-size: 14px; font-family:'Orbitron'; margin-bottom:6px; margin-top:15px;">4. CHOQUE SEMIÓTICO REAL</h3>
                <p style="margin-top:0; text-align:justify;">Uma intervenção diagnóstica ativa e controlada. A ADA captura o erro do aluno e, na rodada seguinte, força a busca por uma questão 'irmã' da mesma família invariante, alterando cirurgicamente o registro de exibição para coletar evidências puras de generalização conceitual.</p>
            </div>
        `;

        document.getElementById('modal-glossario-xai').classList.add('active');
    }
}
