/**
 * @fileoverview AdaptiveAudioEngine.js
 * @description Motor de Sonificação Adaptativa e Acessibilidade Neuro-Auditiva (DUA).
 * @version 1.2.0
 * @package LabTech / Core ADA
 */

import { G } from '../../engine/gameState.js';

export class AdaptiveAudioEngine {
    
    static _audioCtx = null;

    /**
     * Inicialização lazy para contornar políticas de Autoplay.
     * @private
     */
    static _initContext() {
        if (!this._audioCtx) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            this._audioCtx = new AudioContextClass();
        }
        if (this._audioCtx.state === 'suspended') this._audioCtx.resume();
        return this._audioCtx;
    }

    /**
     * Helper privado para síntese de notas puras.
     * @private
     */
    static _tocarNota(freq, tipo, tempo, duracao, volume = 0.15) {
        const ctx = this._initContext();
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc.type = tipo;
        osc.frequency.setValueAtTime(freq, tempo);
        
        gainNode.gain.setValueAtTime(volume, tempo);
        gainNode.gain.exponentialRampToValueAtTime(0.001, tempo + duracao);

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc.start(tempo);
        osc.stop(tempo + duracao);
    }

    /**
     * Feedback quando o arco "aterra" no destino (Snap visual).
     */
    static sonarSnap() {
        if (G.musica === false) return;
        try {
            const ctx = this._initContext();
            this._tocarNota(880.00, 'sine', ctx.currentTime, 0.1, 0.2);
        } catch (e) { console.warn("[ADA] Snap falhou:", e); }
    }

    /**
     * Feedback de sucesso final na conclusão da operação.
     */
    static sonarConclusao() {
        if (G.musica === false) return;
        try {
            const ctx = this._initContext();
            const agora = ctx.currentTime;
            // Arpejo de vitória (Dó -> Sol)
            this._tocarNota(523.25, 'triangle', agora, 0.15);
            this._tocarNota(783.99, 'triangle', agora + 0.15, 0.3);
        } catch (e) { console.warn("[ADA] Sucesso falhou:", e); }
    }

    static sonarSucesso() {
        if (G.musica === false) return;
        try {
            const ctx = this._initContext();
            const agora = ctx.currentTime;
            const notas = [261.63, 329.63, 392.00, 523.25];
            notas.forEach((freq, i) => this._tocarNota(freq, 'sine', agora + (i * 0.12), 0.12));
        } catch (e) { console.warn("[ADA] Sucesso falhou:", e); }
    }

    static sonarAnomalia() {
        if (G.musica === false) return;
        try {
            const ctx = this._initContext();
            const agora = ctx.currentTime;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const filtro = ctx.createBiquadFilter();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(150, agora);
            osc.frequency.linearRampToValueAtTime(141, agora + 0.35);
            filtro.type = 'lowpass';
            filtro.frequency.setValueAtTime(400, agora);

            gain.gain.setValueAtTime(0.12, agora);
            gain.gain.exponentialRampToValueAtTime(0.001, agora + 0.4);

            osc.connect(filtro); filtro.connect(gain); gain.connect(ctx.destination);
            osc.start(agora); osc.stop(agora + 0.4);
        } catch (e) { console.warn("[ADA] Anomalia falhou:", e); }
    }

    static sonarDeslocamento(delta) {
        if (G.musica === false || delta === 0) return;
        try {
            const ctx = this._initContext();
            const agora = ctx.currentTime;
            const freq = Math.max(60, Math.min(220 + (delta * 15), 1200));
            this._tocarNota(freq, 'triangle', agora, 0.5, 0.1);
        } catch (e) { }
    }
}
