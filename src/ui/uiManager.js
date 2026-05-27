/**
 * @fileoverview uiManager.js
 * @description Controlador central de interface, manipulação de DOM, acessibilidade (DUA) e sincronia de avatares.
 * Adaptado para o pipeline assíncrono e imutável do ecossistema LabTech.
 * @version 6.1.0
 * @package LabTech / UI Architecture
 */

import { G } from '../engine/gameState.js';

/**
 * Recupera com segurança o elemento de áudio de fundo de forma preguiçosa (Lazy Loading).
 * Evita falhas de inicialização caso o script carregue antes do DOM estar pronto.
 * @private
 * @returns {HTMLAudioElement|null}
 */
const _getBgmElement = () => document.getElementById("bgm");

// Inicialização segura de vozes para o motor de acessibilidade/TTS
if (typeof window !== 'undefined' && window.speechSynthesis) {
    const carregarVozes = () => { window.speechSynthesis.getVoices(); };
    window.speechSynthesis.onvoiceschanged = carregarVozes;
    carregarVozes();
}

/**
 * Executa a síntese de voz (TTS) da ADA de forma assíncrona com cancelamento de sobreposição.
 * @param {string} texto - Mensagem instrucional ou feedback semiótico.
 * @param {boolean} isCorrect - Determina o comportamento expressivo do avatar associado.
 * @returns {Promise<void>}
 */
export function narrarContexto(texto, isCorrect = true) {
    return new Promise((resolve) => {
        try {
            if (!window.speechSynthesis || G.voz === false) {
                resolve();
                return;
            }

            // Cancela qualquer fala residual imediatamente para manter o fluxo rítmico veloz
            window.speechSynthesis.cancel();

            const textoLimpo = texto.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ');
            const utterance = new SpeechSynthesisUtterance(textoLimpo);
            
            window.adaUtterance = utterance; // Previne coleta de lixo (Garbage Collection) do engine

            utterance.lang = "pt-BR";
            utterance.volume = 1;
            utterance.rate = 1.15; // Velocidade otimizada para engajamento dinâmico

            const vozes = window.speechSynthesis.getVoices();
            let vozBR = vozes.find(v => v.lang.includes('pt') && (
                v.name.includes('Maria') || 
                v.name.includes('Luciana') || 
                v.name.includes('Francisca') || 
                v.name.includes('Vitória') ||
                v.name.includes('Google') ||
                v.name.includes('Female') ||
                v.name.includes('Feminino')
            ));

            if (!vozBR) vozBR = vozes.find(v => v.lang.includes('pt'));
            if (vozBR) utterance.voice = vozBR;

            utterance.onstart = () => { 
                const bgm = _getBgmElement();
                if (bgm && G.musica) bgm.volume = 0.01; // Ducking automático de áudio
                tocarAv(isCorrect ? "ok" : "no");
            };
            
            utterance.onend = () => { 
                const bgm = _getBgmElement();
                if (bgm && G.musica) bgm.volume = 0.07; 
                resolve(); 
            };
            
            utterance.onerror = (err) => { 
                // Só avisa no console se for um erro real, ignora interrupções intencionais de Overlap
                if (err.error !== 'interrupted' && err.error !== 'canceled') {
                    console.warn("[uiManager] Falha no motor de voz:", err.error); 
                }
                resolve(); 
            };

            window.speechSynthesis.speak(utterance);

        } catch (e) {
            console.error("[uiManager] Falha catastrófica no subsistema de voz:", e);
            resolve();
        }
    });
}

/**
 * Alterna o estado da trilha sonora de fundo e atualiza os indicadores visuais.
 */
export function toggleMusica() {
    G.musica = !G.musica;
    const btnTexto = document.getElementById("tsom");
    if (btnTexto) btnTexto.textContent = G.musica ? "ON" : "OFF";

    const bgm = _getBgmElement();
    if (!bgm) return;

    if (G.musica) {
        bgm.volume = 0.07;
        bgm.play().catch(() => console.log("[uiManager] Áudio retido aguardando gatilho de clique inicial."));
    } else {
        bgm.pause();
    }
}

/**
 * Alterna as permissões de narração ativa respeitando as diretrizes DUA.
 */
export function toggleVoz() {
    G.voz = !G.voz;
    const btnTexto = document.getElementById("tvoz");
    if (btnTexto) btnTexto.textContent = G.voz ? "ON" : "OFF";

    if (!G.voz && window.speechSynthesis) {
        window.speechSynthesis.cancel();
    }
}

/**
 * Sincroniza e alterna a exibição de quadros de vídeo ou estáticos do avatar da ADA.
 * @param {string} tipo - 'ok' (Sucesso) ou 'no' (Desvio/Intervenção).
 */
export function tocarAv(tipo) {
    const imgAvatar = document.getElementById("av-img");
    const videoAlvo = document.getElementById(tipo === "ok" ? "vid-ok" : "vid-no");
    const videoOposto = document.getElementById(tipo === "ok" ? "vid-no" : "vid-ok");

    if (!imgAvatar || !videoAlvo) return;

    const reestabelecerAvatarEstatico = () => {
        videoAlvo.classList.add("avh");
        imgAvatar.classList.remove("avh");
    };

    // Ocultação estrita de camadas concorrentes para evitar Overlap fantasma
    if (videoOposto) videoOposto.classList.add("avh");
    imgAvatar.classList.add("avh");
    
    videoAlvo.classList.remove("avh");
    videoAlvo.currentTime = 0;

    videoAlvo.play()
        .then(() => { videoAlvo.onended = reestabelecerAvatarEstatico; })
        .catch(err => {
            console.warn("[uiManager] Play de vídeo restrito pelo navegador:", err);
            reestabelecerAvatarEstatico();
        });
}

/**
 * Sincroniza e atualiza os elementos do HUD superior e barras de integridade do reator.
 * Adicionado: Transições suaves baseadas nos setters de gameState.
 */
export function updHUD() {
    const barVida = document.getElementById("fv");
    const barEnergia = document.getElementById("fen");

    // Lida com a cor do núcleo baseada na integridade
    if (barVida) {
        // Usa o Getter blindado do gameState
        const integridade = G.vida || 0; 
        
        barVida.style.width = `${integridade}%`;
        
        // Transições de Alerta Termal do Núcleo
        if (integridade < 30) {
            barVida.style.backgroundColor = "var(--neon-red, #ff3333)";
            barVida.style.boxShadow = "0 0 10px rgba(255, 51, 51, 0.6)";
        } else if (integridade < 60) {
            barVida.style.backgroundColor = "#ffbb33";
            barVida.style.boxShadow = "0 0 10px rgba(255, 187, 51, 0.4)";
        } else {
            barVida.style.backgroundColor = "var(--neon-cyan, #00eaff)";
            barVida.style.boxShadow = "0 0 10px rgba(0, 234, 255, 0.4)";
        }
    }

    if (barEnergia) barEnergia.style.width = `${G.energia || 100}%`;

    const txtCombo = document.getElementById("tcb");
    const txtNivel = document.getElementById("tnv");
    
    if (txtCombo) {
        txtCombo.textContent = G.combo || 0;
        // Efeito visual de recompensa se o combo for alto
        if (G.combo > 2) {
            txtCombo.style.color = "var(--choco-gold, #d4af37)";
            txtCombo.style.textShadow = "0 0 5px var(--choco-gold, #d4af37)";
        } else {
            txtCombo.style.color = "inherit";
            txtCombo.style.textShadow = "none";
        }
    }
    
    if (txtNivel) txtNivel.textContent = G.nivel || 1;
}

/**
 * Abre janelas modais injetando classes de animação CSS e aciona builders dependentes.
 * @param {string} id - ID do container modal no DOM.
 */
export function abrirM(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.add("show", "active");
    
    // Delegação: se abrir o painel de telemetria, renderiza o dashboard estatístico
    if (id === 'mdash') gerarDashboard();
}

/**
 * Fecha a janela modal especificada.
 * @param {string} id - ID do container modal no DOM.
 */
export function fecharM(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.remove("show", "active");
}

/**
 * Dispara a tela de encerramento da sessão por colapso do reator cognitivo.
 */
export function exibirGameOver() {
    const totalQuestoes = (G.acertos || 0) + (G.erros || 0);
    const taxaSincronia = totalQuestoes > 0 ? Math.round((G.acertos / totalQuestoes) * 100) : 0;

    const modalGameOver = document.getElementById("go");
    const containerStatus = document.getElementById("go-st");

    if (containerStatus) {
        containerStatus.innerHTML = `
            <strong>Acertos Consolidados:</strong> ${G.acertos || 0} <br>
            <strong>Anomalias de Percurso:</strong> ${G.erros || 0} <br>
            <strong>Taxa de Sincronia Lógica:</strong> ${taxaSincronia}%
        `;
    }

    if (modalGameOver) {
        modalGameOver.classList.add("show", "active");
        modalGameOver.style.zIndex = "10000";
    }

    narrarContexto(`Alerta: Estabilidade do núcleo perdida. Taxa de sincronia calculada em ${taxaSincronia} por cento. Reinicie o terminal para calibração.`, false);
}

/**
 * Exibe um alerta metacognitivo na tela do aluno, 
 * promovendo a consciência sobre o próprio processo de aprendizagem.
 * @param {string} mensagem - Insight gerado pelo MetacognitionEngine
 */
export function mostrarAvisoMetacognitivo(mensagem) {
    // Verifica se já existe um aviso ativo para não sobrepor (Overlap control)
    if (document.getElementById('meta-alert')) return;

    const alertDiv = document.createElement('div');
    alertDiv.id = 'meta-alert';
    alertDiv.style.cssText = `
        position: fixed; top: 20%; left: 50%; transform: translateX(-50%);
        width: 80%; max-width: 500px;
        background: rgba(0, 0, 0, 0.9);
        border: 2px solid var(--neon-cyan, #00eaff);
        color: white; padding: 20px; border-radius: 10px;
        z-index: 99999; text-align: center; font-family: 'Orbitron', sans-serif;
        box-shadow: 0 0 20px rgba(0, 234, 255, 0.5);
    `;

    alertDiv.innerHTML = `
        <h3 style="color: var(--neon-cyan, #00eaff); margin-top:0; font-size: 14px;">🧠 INSIGHT COGNITIVO</h3>
        <p style="font-family: 'Nunito', sans-serif; font-size: 14px; line-height: 1.5; color: #eee;">${mensagem}</p>
        <button id="btn-meta-close" style="
            background: transparent; border: 1px solid white; color: white;
            padding: 5px 15px; border-radius: 5px; cursor: pointer; margin-top: 10px;
        ">Entendido</button>
    `;

    document.body.appendChild(alertDiv);

    // Auto-remove após 8 segundos ou ao clicar
    const fechar = () => { if(document.body.contains(alertDiv)) document.body.removeChild(alertDiv); };
    document.getElementById('btn-meta-close').onclick = fechar;
    setTimeout(fechar, 8000);
}

/**
 * Alimenta e constrói o painel de telemetria curricular da BNCC para o painel do estudante.
 * Nota: Painel docente especializado (Alt+P) é gerido isoladamente via DiagnosticEngine/LearningAnalytics.
 */
export function gerarDashboard() {
    const containerDash = document.getElementById("dash-content");
    if (!containerDash) return;

    containerDash.innerHTML = "";
    let possuiRegistros = false;
    const historico = G.historico || {};

    for (let habilidadeKey in historico) {
        const metricaHab = historico[habilidadeKey];
        const totalItens = (metricaHab.acertos || 0) + (metricaHab.erros_conceito || 0) + (metricaHab.erros_calculo || 0);
        
        if (totalItens === 0) continue;
        possuiRegistros = true;

        const precisaoPercentual = Math.round((metricaHab.acertos / totalItens) * 100);
        let feedbackLayout = "";

        if (metricaHab.erros_conceito > metricaHab.acertos) {
            feedbackLayout = `<div class="alerta-sinal" style="color: var(--neon-red, #ff3333); margin-top:5px; font-weight:bold; font-size:11px;">⚠️ Bloqueio Conceitual: Demanda intervenção estrutural de base na ZDP.</div>`;
        } else if (metricaHab.erros_calculo > 0) {
            feedbackLayout = `<div class="alerta-calc" style="color: #ffbb33; margin-top:5px; font-weight:bold; font-size:11px;">📐 Desvio Operacional: Inconsistência de atenção aritmética/sintaxe.</div>`;
        } else {
            feedbackLayout = `<div class="alerta-ok" style="color: var(--neon-green, #00ff66); margin-top:5px; font-weight:bold; font-size:11px;">✅ Estrutura Cognitiva Estabilizada.</div>`;
        }

        containerDash.innerHTML += `
            <div class="dash-card" style="background: rgba(255,255,255,0.02); border-left: 3px solid var(--choco-gold); padding: 10px; margin-bottom: 10px; border-radius: 4px;">
                <div class="dash-card-header" style="display:flex; justify-content:space-between; margin-bottom: 4px;">
                    <span class="hab-code" style="color:var(--choco-gold); font-weight:bold; font-family: monospace;">${habilidadeKey}</span>
                    <span class="hab-pct" style="color:var(--neon-cyan); font-weight:bold;">${precisaoPercentual}%</span>
                </div>
                <p class="hab-desc" style="font-size:11px; opacity:0.7; margin:4px 0;">${metricaHab.desc || "Mapeamento Curricular Ativo"}</p>
                <div class="dash-bar" style="width:100%; height:6px; background:#111; border-radius:3px; overflow:hidden; margin-top: 6px;">
                    <div class="dash-fill-ok" style="width:${precisaoPercentual}%; height:100%; background:var(--neon-green, #00ff66); transition: width 0.4s ease;"></div>
                </div>
                ${feedbackLayout}
            </div>`;
    }

    if (!possuiRegistros) {
        containerDash.innerHTML = "<p style='text-align:center; opacity:0.4; padding:30px; font-size:12px; font-family:monospace;'>Aguardando telemetria estável de campo para consolidação de relatórios...</p>";
    }
}
