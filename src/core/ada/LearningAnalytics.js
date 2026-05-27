/**
 * @fileoverview LearningAnalytics.js
 * @description Motor de Telemetria e Geração de Relatórios do LabTech.
 * AGORA COM: Prescrição Cirúrgica Baseada em Estudos Dirigidos por Aula do MathLab (v1.5.0) com Camadas DUA.
 * @version 1.5.1
 * @package LabTech / Core ADA
 */

export class LearningAnalytics {
    
    // --- 1. DASHBOARD DO ALUNO (BNCC) ---
    static gerarHtmlDashboardBNCC(historico) {
        if (!historico || Object.keys(historico).length === 0) {
            return "<p style='text-align:center; opacity:0.5; padding:20px; font-family:monospace;'>Aguardando coleta de dados...</p>";
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

    // --- 2. EXPORTAÇÃO PARA PESQUISA (CSV) ---
    static exportarCSV(nomeAluno, historico) {
        if (!historico || Object.keys(historico).length === 0) { 
            alert("Sem dados suficientes para gerar relatório."); 
            return; 
        }
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
        link.download = `Relatorio_LabTech_${nomeAluno.replace(/\s+/g, '_')}.csv`;
        document.body.appendChild(link); 
        link.click(); 
        document.body.removeChild(link);
    }

    // --- 3. PAINEL CLÍNICO DO DOCENTE (XAI) ---
    static gerarPainelDocenteHTML(perfil) {
        if (!perfil) return "<p style='color:#ff3333; font-family:monospace; padding:20px;'>⚠️ Calibração Pendente. O aluno precisa interagir com o sistema.</p>";

        // 1. Constrói o Mapa de Etiologia (Raiz dos Erros)
        let etiologiaHtml = '';
        const mapaErros = perfil.mapaEtiologiaErros || {};
        for (let [erro, cont] of Object.entries(mapaErros)) {
            if (cont > 0) {
                const width = Math.min(100, cont * 10); 
                etiologiaHtml += `
                <div style="margin-bottom: 10px;">
                    <div style="display:flex; justify-content:space-between; font-size: 11px; color: #ccc; font-family: monospace;">
                        <span>${erro.replace(/_/g, ' ')}</span>
                        <span style="color: var(--neon-red, #ff3333); font-weight:bold;">${cont}x</span>
                    </div>
                    <div style="width: 100%; background: rgba(0,0,0,0.5); height: 8px; border-radius: 4px; margin-top:3px; border: 1px solid #333;">
                        <div style="width: ${width}%; background: linear-gradient(90deg, #880000, #ff3333); height: 100%; border-radius: 3px;"></div>
                    </div>
                </div>`;
            }
        }

        // 2. Constrói a Matriz de Tendências Cognitivas
        let scoresHtml = '';
        const scores = perfil.scoreMatrizesPerfeitas || {};
        for (let [p, score] of Object.entries(scores)) {
            scoresHtml += `
            <div style="display:flex; justify-content: space-between; font-size: 12px; margin-bottom:8px; border-bottom: 1px dashed #333; padding-bottom: 4px;">
                <span style="color: var(--neon-cyan, #00eaff);">${p.replace(/_/g, ' ')}</span>
                <span style="color: var(--choco-gold, #d4af37); font-weight:bold; font-family: monospace; font-size: 14px;">${score.toFixed(2)}</span>
            </div>`;
        }

        // 3. Constrói a Matriz de Transferência de Galperin
        const mat = perfil.matrizTransferencia || { procedural: {acertos:0, total:0}, transferencia: {acertos:0, total:0}, generalizacao: {acertos:0, total:0} };
        const txProc = mat.procedural.total > 0 ? (mat.procedural.acertos / mat.procedural.total) * 100 : 0;
        const txTransf = mat.transferencia.total > 0 ? (mat.transferencia.acertos / mat.transferencia.total) * 100 : 0;
        const txGen = mat.generalizacao.total > 0 ? (mat.generalizacao.acertos / mat.generalizacao.total) * 100 : 0;

        const htmlMatrizTransferencia = `
            <div style="margin-bottom: 10px;">
                <div style="display:flex; justify-content:space-between; font-size: 11px; color: #ccc;"><span>[ZDP 1] Procedimento Visual</span><span style="color:#00ff66;">${Math.round(txProc)}%</span></div>
                <div style="width: 100%; background: #111; height: 6px; border-radius: 3px; margin-top:2px;"><div style="width: ${txProc}%; background: #00ff66; height: 100%; border-radius: 3px;"></div></div>
            </div>
            <div style="margin-bottom: 10px;">
                <div style="display:flex; justify-content:space-between; font-size: 11px; color: #ccc;"><span>[ZDP 2] Transferência Textual</span><span style="color:#ffbb33;">${Math.round(txTransf)}%</span></div>
                <div style="width: 100%; background: #111; height: 6px; border-radius: 3px; margin-top:2px;"><div style="width: ${txTransf}%; background: #ffbb33; height: 100%; border-radius: 3px;"></div></div>
            </div>
            <div style="margin-bottom: 10px;">
                <div style="display:flex; justify-content:space-between; font-size: 11px; color: #ccc;"><span>[ZDP 3] Generalização Abstrata</span><span style="color:#00eaff;">${Math.round(txGen)}%</span></div>
                <div style="width: 100%; background: #111; height: 6px; border-radius: 3px; margin-top:2px;"><div style="width: ${txGen}%; background: #00eaff; height: 100%; border-radius: 3px;"></div></div>
            </div>
        `;

       // 4. Semáforo de Estabilidade e Fading
        const estabilidade = perfil.estabilidadeConceitual || 'INDEFINIDA';
        let corEstabilidade = '#aaa';
        
        if (estabilidade === 'ALTA_ESTABILIZADA') corEstabilidade = '#00ff66';
        if (estabilidade === 'EM_CONSTRUCAO') corEstabilidade = '#ffbb33';
        if (estabilidade === 'BAIXA_RISCO_PSEUDOCONCEITO') corEstabilidade = '#ff3333';

        const dependente = perfil.dependenciaScaffold ? '<span style="color:#ff3333; font-weight:bold; animation: blink 2s infinite;">SIM (Requer Fading)</span>' : '<span style="color:#00ff66;">NÃO (Autônomo)</span>';
        
        // 🛡️ MOTOR DE PRESCRIÇÃO CLÍNICA COM CIRURGIA DE TOLERÂNCIA ADAPTATIVA E DUA
        const blocoOriginal = perfil.blocoAtual;
        let blocoTratado = parseInt(blocoOriginal);
        const dom = perfil.perfilDominante || 'INDETERMINADO';
        let prescricaoMathLabHtml = '';

        // Se o bloco não for um número puro (ex: "Geral" ou indefinido), a IA cruza os dados do histórico
        if (isNaN(blocoTratado)) {
            const habilidadesAtivas = Object.keys(perfil.mapaEtiologiaErros || {});
            const historicoChaves = Object.keys(perfil.scoreMatrizesPerfeitas || {});
            const stringBusca = (habilidadesAtivas.join() + historicoChaves.join()).toUpperCase();

            if (stringBusca.includes("EF06MA03")) blocoTratado = 1;
            else if (stringBusca.includes("EF07MA04") || stringBusca.includes("FRAÇ")) blocoTratado = 2;
            else if (stringBusca.includes("EF07MA20")) blocoTratado = 3;
            else if (stringBusca.includes("EF07MA15")) blocoTratado = 4;
            else if (stringBusca.includes("EF07MA32")) blocoTratado = 5;
            else if (stringBusca.includes("EF07MA21")) blocoTratado = 6;
            else blocoTratado = 2; 
        }

        if (blocoTratado === 7) {
            // Lógica Exclusiva para os Desafios Olímpicos de Alta Performance
            if (dom === 'SUCESSO' || dom === 'CONCEITUAL_TEORICO') {
                prescricaoMathLabHtml = `
                    <div style="margin-top: 15px; padding: 12px; background: rgba(0, 255, 128, 0.08); border: 1px dashed #00ff80; border-radius: 6px;">
                        <b style="color: #00ff80; font-family: 'Orbitron', sans-serif; font-size: 11px; letter-spacing:1px;">🥇 DESAFIO OLÍMPICO ATIVO (ALTA PERFORMANCE):</b>
                        <p style="margin: 5px 0 0 0; font-size: 12px; color: #ddd; line-height: 1.4;">
                            Estudante operando em ZDP Superior Semiótica. <b>Fading físico completo estabilizado.</b> Não utilize materiais concretos do MathLab neste estágio.
                            <br><span style="color:#00ff80; font-weight:bold;">➔ Mediação Docente:</span> Atue como questionador socrático. Peça para o estudante explicar verbalmente a estratégia lógica aplicada.
                        </p>
                    </div>`;
            } else {
                prescricaoMathLabHtml = `
                    <div style="margin-top: 15px; padding: 12px; background: rgba(255, 165, 0, 0.08); border: 1px dashed #ffa500; border-radius: 6px;">
                        <b style="color: #ffa500; font-family: 'Orbitron', sans-serif; font-size: 11px; letter-spacing:1px;">⚠️ ALERTA DE FLUTUAÇÃO COGNITIVA (BLOCO 7):</b>
                        <p style="margin: 5px 0 0 0; font-size: 12px; color: #ddd; line-height: 1.4;">
                            O estudante atingiu o teto olímpico, mas apresenta comportamento errático de tentativa e erro.
                            <br><span style="color:#ffa500; font-weight:bold;">➔ Ação Corretiva:</span> Utilize o comando <b>[REFUTAR HIPÓTESE]</b> acima para forçar o recuo adaptativo imediato do software para o Bloco 6 (Geometria), reativando as estruturas de ancoragem.
                        </p>
                    </div>`;
            }
        } else {
            // Mapeamento Estrito dos Módulos Físicos MathLab (Blocos de 1 a 6)
            let moduloNome = "";
            let materialFisico = "";
            let habilidadeFoco = "";
            let aulaPrescritaText = "Aulas estruturais básicas de fundamentação manipulável.";

            const erros = perfil.mapaEtiologiaErros || {};

            switch(blocoTratado) {
                case 1:
                    moduloNome = "Módulo 1: Sistema Decimal, Adição e Subtração";
                    materialFisico = "Ábaco de Fichas ou Grid de Clipagem (Unidade/Dezena/Centena)";
                    habilidadeFoco = "EF06MA03";
                    
                    if (erros.AGRUPAMENTO_POSICIONAL > 0 || erros.VIER_ALGORITMICO > 0) {
                        aulaPrescritaText = "Aula 02: O Sistema de Numeração Decimal e Ordens Posicionais";
                    } else if (erros.TRANSPORTE_ZERO > 0 || erros.ESQUECIMENTO_VAI_UM > 0) {
                        aulaPrescritaText = "Aula 04: Adição e Subtração com Reagrupamento Concreto";
                    } else {
                        aulaPrescritaText = "Aula 01: Construção Histórica e Contagem no Ábaco";
                    }
                    break;
                case 2:
                    moduloNome = "Módulo 2: Divisibilidade, Inteiros e Frações";
                    materialFisico = "Barras Fracionárias de Chocolate ou Discos de Frações Circulares";
                    habilidadeFoco = "EF07MA04";
                    
                    if (erros.INVERSAO_TOPOLOGICA > 0) {
                        aulaPrescritaText = "Aula 05: Fração e Seus Significados (Numerador vs Denominador)";
                    } else if (erros.ETIQUETA_ESTATICA > 0 || erros.PSEUDOCONCEITO_ESTATICO > 0) {
                        aulaPrescritaText = "Aula 06: A Ideia de Parte-Todo (Manipulação dos Discos Fracionários)";
                    } else if (erros.VIES_ARITMETICO > 0) {
                        aulaPrescritaText = "Aula 08: Adição e Subtração de Frações com Bases Distintas";
                    } else {
                        aulaPrescritaText = "Aula 05 ou Aula 07: Identificação e Frações Equivalentes no Concreto";
                    }
                    break;
                case 3:
                    moduloNome = "Módulo 3: Escalas, Perímetros, Áreas e Volumes";
                    materialFisico = "Copo Graduado (Princípio de Arquimedes) ou Malha Quadriculada Escala 1:20";
                    habilidadeFoco = "EF07MA20";
                    
                    if (erros.CONFUSAO_DIMENSIONAL > 0) {
                        aulaPrescritaText = "Aula 06: Perímetro e Área — Distinção Unidimensional vs Bidimensional";
                    } else if (erros.FALHA_CONVERSAO_ESCALA > 0) {
                        aulaPrescritaText = "Aula 03: Introdução ao Conceito de Ampliação e Redução na Malha";
                    } else {
                        aulaPrescritaText = "Aula 08: Volume do Bloco Retangular e Espaço Tridimensional";
                    }
                    break;
                case 4:
                    moduloNome = "Módulo 4: Álgebra, Equações e Inequações";
                    materialFisico = "Fichas de Opostos Coloridas ou Balança Balanceada de Pratos";
                    habilidadeFoco = "EF07MA15";
                    
                    if (erros.INVERSAO_OPERACIONAL > 0) {
                        aulaPrescritaText = "Aula 04: O Princípio Aditivo da Igualdade na Balança";
                    } else if (erros.DISTRIBUTIVA_CEGA > 0) {
                        aulaPrescritaText = "Aula 06: Propriedade Distributiva com Fichas Agrupadas";
                    } else {
                        aulaPrescritaText = "Aula 02: Linguagem Algébrica e Expressões Equivalentes";
                    }
                    break;
                case 5:
                    moduloNome = "Módulo 5: Estatística e Probabilidade";
                    materialFisico = "Papéis de Ordenação Concreta de Mediana (Técnica de Descarte de Extremos)";
                    habilidadeFoco = "EF07MA32";
                    
                    if (erros.CONFUSAO_MEDIA_MEDIANA > 0) {
                        aulaPrescritaText = "Aula 05: O Conceito de Mediana através do Rol Físico Humano";
                    } else {
                        aulaPrescritaText = "Aula 03: Leitura e Organização de Rol de Dados Coletados";
                    }
                    break;
                case 6:
                    moduloNome = "Módulo 6: Geometria e Teorema de Pitágoras";
                    materialFisico = "Palitos de Rigidez Articulados ou Quadrados de Áreas Recortadas (3x3, 4x4, 5x5)";
                    habilidadeFoco = "EF07MA21";
                    
                    if (erros.QUEBRA_DESIGUALDADE > 0) {
                        aulaPrescritaText = "Aula 02: Condição de Existência de um Triângulo Manipulando Palitos";
                    } else if (erros.SOMA_QUADRADOS_OMISSAO > 0) {
                        aulaPrescritaText = "Aula 07: O Teorema de Pitágoras através do Mosaico de Áreas Físicas";
                    } else {
                        aulaPrescritaText = "Aula 05: Classificação de Triângulos e Rigidez Estrutural";
                    }
                    break;
                default:
                    moduloNome = "Módulo 2: Divisibilidade, Inteiros e Frações";
                    materialFisico = "Barras Fracionárias de Chocolate ou Discos de Frações Circulares";
                    habilidadeFoco = "EF07MA04";
                    aulaPrescritaText = "Aula 05: Fração e Seus Significados";
            }

            // --- CORREÇÃO: PRESCRIÇÃO COMPOSTA (CAMADA ESTRUTURAL + CAMADA COMPORTAMENTAL) ---
            
            // 1. CAMADA FÍSICA: Prescreve o material estrutural básico independentemente da anomalia de conduta
            let prescricaoFisica = '';
            if (blocoTratado >= 1 && blocoTratado <= 6) {
                prescricaoFisica = `
                    <div style="margin-top: 15px; padding: 12px; background: rgba(212, 175, 55, 0.08); border: 1px dashed #d4af37; border-radius: 6px;">
                        <b style="color: #d4af37; font-family: 'Orbitron', sans-serif; font-size: 11px; letter-spacing:1px;">📋 PRESCRIÇÃO CLÍNICA MATHLAB — ANCORAGEM CONCRETA:</b>
                        <p style="margin: 5px 0 0 0; font-size: 12px; color: #ddd; line-height: 1.4;">
                            <span style="color:#d4af37; font-weight:bold;">➔ Módulo Alvo:</span> ${moduloNome} (${habilidadeFoco})
                            <br><span style="color:#d4af37; font-weight:bold;">➔ Kit Prescrito:</span> <span style="color:#fff; font-weight:bold;">${materialFisico}</span>
                            <br><span style="color:#00ff66; font-weight:bold;">➔ Estudo Dirigido:</span> <span style="color:#00ff66; font-weight:bold; font-family:monospace;">${aulaPrescritaText}</span>
                        </p>
                    </div>`;
            }

            // 2. CAMADA COMPORTAMENTAL: Adiciona Modificadores de Conduta ou Cognição (Sem sobrescrever a física)
            let prescricaoComportamental = '';
            if (dom === 'DEPENDENTE_CONCRETO' || perfil.dependenciaScaffold || dom === 'INDETERMINADO') {
                prescricaoComportamental = `
                    <div style="margin-top: 8px; padding: 12px; background: rgba(255, 187, 51, 0.08); border: 1px dashed #ffbb33; border-radius: 6px;">
                        <b style="color: #ffbb33; font-size: 11px;">⚠️ ALERTA DE RETENÇÃO CONCRETA</b>
                        <p style="margin: 5px 0 0 0; font-size: 12px; color: #ddd;">
                            Estudante retido na etapa materializada. Afaste-o do computador e aplique as atividades da folha correspondente ao kit antes de devolvê-lo ao digital.
                        </p>
                    </div>`;
            } else if (dom === 'IMPULSIVO_ARITMETICO') {
                prescricaoComportamental = `
                    <div style="margin-top: 8px; padding: 12px; background: rgba(255, 51, 51, 0.08); border: 1px dashed #ff3333; border-radius: 6px;">
                        <b style="color: #ff3333; font-size: 11px;">⚠️ MODIFICADOR DE CONDUTA: TRAVAMENTO RÍTMICO</b>
                        <p style="margin: 5px 0 0 0; font-size: 12px; color: #ddd;">
                            Alto índice de automação cega (Vygotsky). Exija que o aluno desenhe a estimativa tática no papel antes de usar o material físico ou clicar.
                        </p>
                    </div>`;
            } else if (dom === 'PROCEDURAL_MECANICO') {
                 prescricaoComportamental = `
                    <div style="margin-top: 8px; padding: 12px; background: rgba(0, 234, 255, 0.08); border: 1px dashed #00eaff; border-radius: 6px;">
                        <b style="color: #00eaff; font-size: 11px;">⚠️ MODIFICADOR COGNITIVO: CHOQUE SEMIÓTICO</b>
                        <p style="margin: 5px 0 0 0; font-size: 12px; color: #ddd;">
                            O aluno decorou a regra algorítmica. Desafie-o a provar o <b>porquê</b> da regra utilizando as peças concretas de ${materialFisico.split(' ou ')[0]}.
                        </p>
                    </div>`;
            }

            // Junta as camadas de prescrição DUA
            prescricaoMathLabHtml = prescricaoFisica + prescricaoComportamental;
        }

        return `
        <div style="padding: 15px; color: white; text-align: left;">
            <h2 style="color: var(--choco-gold, #d4af37); text-align: center; font-family: 'Orbitron', sans-serif; margin-top: 0; letter-spacing: 2px;">RADIOGRAFIA DA I.A. (XAI)</h2>
            
            <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(0,0,0,0.7); padding: 15px; border-radius: 8px; border: 1px solid #333;">
                <div>
                    <p style="margin:0; font-size: 11px; color: #888; letter-spacing: 1px;">ESTUDANTE AVALIADO</p>
                    <p style="margin:0; font-weight: bold; font-size: 18px; font-family: monospace;">${perfil.id.replace('_', ' | ')}</p>
                </div>
                <div style="text-align: right;">
                    <p style="margin:0; font-size: 11px; color: #888; letter-spacing: 1px;">DIAGNÓSTICO DOMINANTE</p>
                    <p style="margin:0; font-weight: bold; font-size: 18px; color: var(--neon-cyan, #00eaff); text-transform: uppercase;">${dom.replace(/_/g, ' ')}</p>
                </div>
            </div>

            <div style="margin-top: 15px; background: rgba(0,0,0,0.8); padding: 12px; border-radius: 8px; border-left: 4px solid ${perfil.confiancaDiagnostica > 60 ? '#00eaff' : '#ffbb33'};">
                <div style="display:flex; justify-content:space-between; font-size: 12px; color: #aaa; margin-bottom: 5px;">
                    <span style="letter-spacing: 1px;">ÍNDICE DE CONFIANÇA ESTATÍSTICA DA IA</span>
                    <span style="font-weight:bold; color:white;">${perfil.confiancaDiagnostica || 0}%</span>
                </div>
                <div style="width: 100%; background: #222; height: 8px; border-radius: 4px;">
                    <div style="width: ${perfil.confiancaDiagnostica || 0}%; background: ${perfil.confiancaDiagnostica > 60 ? 'var(--neon-cyan, #00eaff)' : '#ffbb33'}; height: 100%; border-radius: 4px; box-shadow: 0 0 10px ${perfil.confiancaDiagnostica > 60 ? '#00eaff' : '#ffbb33'};"></div>
                </div>
                
                ${ /* 🧠 INFERENCE VALIDATOR ENGINE (HUMAN-IN-THE-LOOP) */ ''}
                ${perfil.validacaoHumana === 'VALIDADO' ? 
                    `<div style="margin-top: 12px; padding: 8px; background: rgba(0, 255, 102, 0.1); border: 1px solid #00ff66; border-radius: 4px; text-align: center; color: #00ff66; font-size: 11px; font-weight: bold; letter-spacing: 1px;">
                        ✅ HIPÓTESE CHANCELADA PELO PROFESSOR (CONFIANÇA TRAVADA EM 99%)
                    </div>` 
                : perfil.validacaoHumana === 'REFUTADO' ? 
                    `<div style="margin-top: 12px; padding: 8px; background: rgba(255, 51, 51, 0.1); border: 1px solid #ff3333; border-radius: 4px; text-align: center; color: #ff3333; font-size: 11px; font-weight: bold; letter-spacing: 1px;">
                        ❌ HIPÓTESE REFUTADA. ADA FORÇADA A RECALIBRAR (CONFIANÇA ZERADA)
                    </div>`
                :
                    `<div style="margin-top: 12px; display: flex; gap: 10px;">
                        <button id="btn-ia-validar" style="flex: 1; background: rgba(0, 255, 102, 0.1); border: 1px solid #00ff66; color: #00ff66; padding: 8px; border-radius: 4px; cursor: pointer; font-size: 11px; font-weight: bold; transition: 0.3s;">✅ VALIDAR HIPÓTESE</button>
                        <button id="btn-ia-refutar" style="flex: 1; background: rgba(255, 51, 51, 0.1); border: 1px solid #ff3333; color: #ff3333; padding: 8px; border-radius: 4px; cursor: pointer; font-size: 11px; font-weight: bold; transition: 0.3s;">❌ REFUTAR HIPÓTESE</button>
                    </div>`
                }
            </div>

            ${ /* INJEÇÃO CIRÚRGICA DA PRESCRIÇÃO DE ESTUDO DIRIGIDO POR AULA */ prescricaoMathLabHtml }

            <div style="margin-top: 20px; display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px;">
                
                <div style="background: rgba(255,255,255,0.03); padding: 15px; border-radius: 8px; border-top: 3px solid #ffbb33; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">
                    <h3 style="font-size: 13px; color: #fff; margin-top:0; border-bottom: 1px solid #333; padding-bottom: 8px;"><i class="fas fa-layer-group"></i> MATRIZ DE TRANSFERÊNCIA</h3>
                    ${htmlMatrizTransferencia}
                    <div style="margin-top: 15px; padding-top: 10px; border-top: 1px dashed #444; background: rgba(0,0,0,0.4); padding: 10px; border-radius: 4px;">
                        <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
                            <span style="font-size: 12px; color:#aaa;">Estabilidade Conceitual:</span> 
                            <b style="color: ${corEstabilidade}; font-size: 11px;">${estabilidade.replace(/_/g, ' ')}</b>
                        </div>
                        <div style="display:flex; justify-content:space-between;">
                            <span style="font-size: 12px; color:#aaa;">Dependência Visual:</span> 
                            <span style="font-size: 11px;">${dependente}</span>
                        </div>
                    </div>
                </div>

                <div style="background: rgba(255,255,255,0.03); padding: 15px; border-radius: 8px; border-top: 3px solid var(--choco-gold, #d4af37); box-shadow: 0 4px 6px rgba(0,0,0,0.3);">
                    <h3 style="font-size: 13px; color: #fff; margin-top:0; border-bottom: 1px solid #333; padding-bottom: 8px;"><i class="fas fa-brain"></i> TENDÊNCIAS COGNITIVAS</h3>
                    ${scoresHtml}
                    <div style="margin-top: 15px; background: rgba(0,0,0,0.4); padding: 10px; border-radius: 4px; display:flex; justify-content:space-between;">
                        <span style="font-size: 12px; color:#aaa;">Risco de Deriva:</span> 
                        <b style="color: ${perfil.derivaPedagogicaGeral > 0.5 ? '#ff3333' : '#00ff66'}; font-size: 14px;">${perfil.derivaPedagogicaGeral}</b>
                    </div>
                </div>

              <div style="background: rgba(255,255,255,0.03); padding: 15px; border-radius: 8px; border-top: 3px solid var(--neon-red, #ff3333); box-shadow: 0 4px 6px rgba(0,0,0,0.3); grid-column: 1 / -1;">
                    <h3 style="font-size: 13px; color: #fff; margin-top:0; border-bottom: 1px solid #333; padding-bottom: 8px;"><i class="fas fa-bug"></i> MAPA DE ETIOLOGIA (RAIZ DOS ERROS)</h3>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-top: 10px;">
                        ${etiologiaHtml || '<p style="font-size:12px; color:#00ff66; margin:0; text-align:center; width:100%;">Nenhuma anomalia processada no histórico.</p>'}
                    </div>
                </div>

            </div>

            <div style="text-align: center; margin-top: 25px; padding-top: 15px; border-top: 1px dashed #333;">
                <button id="btn-export-xai-csv" style="background: rgba(0, 234, 255, 0.1); border: 1px solid var(--neon-cyan, #00eaff); color: var(--neon-cyan, #00eaff); padding: 10px 25px; border-radius: 4px; font-family: 'Orbitron', sans-serif; cursor: pointer; transition: all 0.3s; font-size: 12px; letter-spacing: 1px;">
                    ⬇️ EXPORTAR DADOS DA SESSÃO (CSV)
                </button>
            </div>
            
        </div>
        <style>
            @keyframes blink { 0% { opacity: 1; } 50% { opacity: 0.4; } 100% { opacity: 1; } }
            #btn-export-xai-csv:hover { background: var(--neon-cyan, #00eaff); color: black !important; }
            #btn-ia-validar:hover { background: rgba(0, 255, 102, 0.3) !important; }
            #btn-ia-refutar:hover { background: rgba(255, 51, 51, 0.3) !important; }
        </style>
        `; 
    }
}
