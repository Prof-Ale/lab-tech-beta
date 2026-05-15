/**
 * ui-manager.js - Versão 5.1 (ADA Overlap & Visual Stabilized)
 * Núcleo de Interface, Acessibilidade (DUA) e Telemetria Visual.
 * INTERVENÇÃO: Compatibilidade com o ritmo acelerado (Overlap) do main.js.
 */

import { G } from './engine/gameState.js';

const bgm = document.getElementById("bgm");

if (typeof window !== 'undefined' && window.speechSynthesis) {
    const carregarVozes = () => { window.speechSynthesis.getVoices(); };
    window.speechSynthesis.onvoiceschanged = carregarVozes;
    carregarVozes();
}

// === SISTEMA DE NARRAÇÃO ASSÍNCRONO (OVERLAP) ===

/**
 * ADA narra o texto para o estudante.
 * Retorna uma Promise, mas agora recebe 'isCorrect' para cravar o vídeo.
 */
export function narrarContexto(t, isCorrect = true) {
    return new Promise((resolve) => {
        try {
            if (!window.speechSynthesis || G.voz === false) {
                resolve();
                return;
            }

            // Cancela qualquer fala pendente para o jogo ficar rápido
            window.speechSynthesis.cancel();

            const textoLimpo = t.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ');
            const u = new SpeechSynthesisUtterance(textoLimpo);
            
            window.adaUtterance = u; 

            u.lang = "pt-BR";
            u.volume = 1;
            u.rate = 1.15; // 5% mais rápida para dinâmica de jogo

            const vozes = window.speechSynthesis.getVoices();
            let vozBR = vozes.find(x => x.lang.includes('pt') && (
                x.name.includes('Maria') || 
                x.name.includes('Luciana') || 
                x.name.includes('Francisca') || 
                x.name.includes('Vitória') ||
                x.name.includes('Google') ||
                x.name.includes('Female') ||
                x.name.includes('Feminino')
            ));

            if (!vozBR) vozBR = vozes.find(x => x.lang.includes('pt'));
            if (vozBR) u.voice = vozBR;

            u.onstart = () => { 
                if (bgm && G.musica) bgm.volume = 0.02; 
                // Toca o vídeo correspondente ao resultado real (passado pelo main.js)
                tocarAv(isCorrect ? "ok" : "no");
            };
            
            u.onend = () => { 
                if (bgm && G.musica) bgm.volume = 0.07; 
                resolve(); 
            };
            
            u.onerror = (e) => { 
                console.warn("[ADA-Voz] SpeechSynthesis pulou ou falhou:", e.error); 
                resolve(); 
            };

            window.speechSynthesis.speak(u);

        } catch (e) {
            console.error("[MathLab] Falha na síntese de voz:", e);
            resolve();
        }
    });
}

// === CONTROLES DE MÍDIA ===

export function toggleMusica() {
    G.musica = !G.musica;
    const el = document.getElementById("tsom");
    if (el) el.textContent = G.musica ? "ON" : "OFF";

    if (!bgm) return;
    if (G.musica) {
        bgm.volume = 0.07;
        bgm.play().catch(() => console.log("Aguardando interação para áudio."));
    } else {
        bgm.pause();
    }
}

export function toggleVoz() {
    G.voz = !G.voz;
    const el = document.getElementById("tvoz");
    if (el) el.textContent = G.voz ? "ON" : "OFF";

    if (!G.voz && window.speechSynthesis) {
        window.speechSynthesis.cancel();
    }
}

// === AVATAR DE VÍDEO (REFINADO PARA TRABALHAR COM O ÁUDIO) ===

export function tocarAv(tipo) {
    const img = document.getElementById("av-img");
    const vid = document.getElementById(tipo === "ok" ? "vid-ok" : "vid-no");

    if (!img) return;
    if (!vid) return;

    const resetAv = () => {
        vid.classList.add("avh");
        img.classList.remove("avh");
    };

    // Esconde os outros
    document.getElementById("vid-ok")?.classList.add("avh");
    document.getElementById("vid-no")?.classList.add("avh");
    img.classList.add("avh");
    
    // Mostra o vídeo atual
    vid.classList.remove("avh");
    vid.currentTime = 0;

    vid.play()
        .then(() => { vid.onended = resetAv; })
        .catch(err => {
            console.warn("[MathLab] Play de vídeo bloqueado:", err);
            resetAv();
        });
}

// === INTERFACE HUD E MODAIS ===

export function updHUD() {
    const fv = document.getElementById("fv");
    const fen = document.getElementById("fen");

    if (fv) fv.style.width = G.vida + "%";
    if (fen) fen.style.width = G.energia + "%";

    if (fv) {
        if (G.vida < 30) fv.style.backgroundColor = "#ff4444";
        else if (G.vida < 60) fv.style.backgroundColor = "#ffbb33";
        else fv.style.backgroundColor = "#00e5ff";
    }

    const tcb = document.getElementById("tcb");
    const tnv = document.getElementById("tnv");
    if (tcb) tcb.textContent = G.combo;
    if (tnv) tnv.textContent = G.nivel;
}

export function abrirM(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.add("show", "active");
    if (id === 'mdash') gerarDashboard();
}

export function fecharM(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.remove("show", "active");
}

// === GAME OVER ===

export function exibirGameOver() {
    const total = G.acertos + G.erros;
    const tx = total > 0 ? Math.round((G.acertos / total) * 100) : 0;

    const goModal = document.getElementById("go");
    const goSt = document.getElementById("go-st");

    if (goSt) {
        goSt.innerHTML = `
            <strong>Acertos:</strong> ${G.acertos} | 
            <strong>Anomalias:</strong> ${G.erros} <br>
            <strong>Taxa de Sincronia Lógica:</strong> ${tx}%
        `;
    }

    if (goModal) {
        goModal.classList.add("show", "active");
        goModal.style.zIndex = "10000";
    }

    narrarContexto(`Integridade do sistema comprometida. Taxa de sincronia final: ${tx} por cento. Reinicie para nova análise.`, false);
}

// === DASHBOARD PEDAGÓGICO ===

function gerarDashboard() {
    const c = document.getElementById("dash-content");
    if (!c) return;

    c.innerHTML = "";
    let temDados = false;
    const historico = G.historico || {};

    for (let hab in historico) {
        const hist = historico[hab];
        const total = (hist.acertos || 0) + (hist.erros_conceito || 0) + (hist.erros_calculo || 0);
        
        if (total === 0) continue;
        temDados = true;

        const txAcerto = Math.round((hist.acertos / total) * 100);
        let diagnostico = "";

        if (hist.erros_conceito > hist.acertos) {
            diagnostico = `<div class="alerta-sinal" style="color: var(--neon-red); margin-top:5px;">⚠️ Bloqueio Conceitual: O aluno não domina a regra base desta habilidade.</div>`;
        } else if (hist.erros_calculo > 0) {
            diagnostico = `<div class="alerta-calc" style="color: #ffbb33; margin-top:5px;">📐 Falha Operacional: Erros de atenção ou processo aritmético.</div>`;
        } else {
            diagnostico = `<div class="alerta-ok" style="color: var(--neon-green); margin-top:5px;">✅ Domínio Estabilizado.</div>`;
        }

        c.innerHTML += `
            <div class="dash-card">
                <div class="dash-card-header" style="display:flex; justify-content:space-between;">
                    <span class="hab-code" style="color:var(--choco-gold); font-weight:bold;">${hab}</span>
                    <span class="hab-pct" style="color:var(--neon-cyan);">${txAcerto}%</span>
                </div>
                <p class="hab-desc" style="font-size:11px; opacity:0.8; margin:5px 0;">${hist.desc || "Habilidade em análise"}</p>
                <div class="dash-bar" style="width:100%; height:8px; background:#222; border-radius:4px; overflow:hidden;">
                    <div class="dash-fill-ok" style="width:${txAcerto}%; height:100%; background:var(--neon-green);"></div>
                </div>
                ${diagnostico}
            </div>`;
    }

    if (!temDados) {
        c.innerHTML = "<p class='text-center' style='color:var(--text-muted); padding:20px;'>Aguardando telemetria de campo para gerar relatório...</p>";
    }
}
