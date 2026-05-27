/**
 * @fileoverview AdaptiveAudioEngine.js
 * @description Motor de Sonificação Adaptativa e Acessibilidade Neuro-Auditiva (DUA).
 * Utiliza a Web Audio API pura para sintetizar frequências matemáticas em tempo real,
 * fornecendo feedback sonoro posicional e cinestésico dependendo da resposta.
 * EVOLUÇÃO: Singleton Arquitetural imune às políticas de bloqueio de Autoplay.
 * @version 1.1.0
 * @package LabTech / Core ADA
 */

import { G } from '../../engine/gameState.js';

export class AdaptiveAudioEngine {
    
    // Instância única global para prevenir Memory Leaks e bloqueios de Autoplay
    static _audioCtx = null;

    /**
     * Garante a inicialização preguiçosa do Contexto de Áudio (Lazy Initialization).
     * Previne o bloqueio nativo de segurança de reprodução automática dos navegadores.
     * @private
     * @returns {AudioContext}
     */
    static _initContext() {
        if (!this._audioCtx) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            this._audioCtx = new AudioContextClass();
        }
        
        // Se o contexto foi suspenso por falta de interação, força o resume
        if (this._audioCtx.state === 'suspended') {
            this._audioCtx.resume();
        }
        
        return this._audioCtx;
    }

    /**
     * Dispara um feedback harmônico consonante (Sucesso/Avanço Cognitivo).
     * Gera um arpejo ascendente senoidal perfeito.
     */
    static sonarSucesso() {
        if (G.musica === false) return; // Respeita a diretriz de silêncio do HUD
        
        try {
            const ctx = this._initContext();
            const agora = ctx.currentTime;

            // Frequências da tríade maior de Dó (Do4, Mi4, Sol4, Do5) -> Ascensão semiótica
            const notas = [261.63, 329.63, 392.00, 523.25];
            const duracaoNota = 0.12;

            notas.forEach((freq, index) => {
                const osc = ctx.createOscillator();
                const gainNode = ctx.createGain();

                osc.type = 'sine'; // Onda pura para sensação clínica e limpa
                osc.frequency.setValueAtTime(freq, agora + (index * duracaoNota));

                // Envelope de Ganho (Fade-out para evitar estalos harmônicos)
                gainNode.gain.setValueAtTime(0.15, agora + (index * duracaoNota));
                gainNode.gain.exponentialRampToValueAtTime(0.0001, agora + (index * duracaoNota) + duracaoNota);

                osc.connect(gainNode);
                gainNode.connect(ctx.destination);

                osc.start(agora + (index * duracaoNota));
                osc.stop(agora + (index * duracaoNota) + duracaoNota);
            });
        } catch (e) {
            console.warn("[AdaptiveAudioEngine] Subsistema de som ocupado ou bloqueado:", e);
        }
    }

    /**
     * Dispara um feedback de desvio/anomalia (Erro de Percurso).
     * Sonifica um intervalo dissonante de segunda menor descendente com onda dente-de-serra (Aviso técnico).
     */
    static sonarAnomalia() {
        if (G.musica === false) return;

        try {
            const ctx = this._initContext();
            const agora = ctx.currentTime;

            // Frequências dissonantes (Trítono / Segunda Menor instável de aviso)
            const freqInicial = 150.00; // Frequência grave de alerta
            const freqFinal = 141.42;   // Queda descendente de tensão

            const osc = ctx.createOscillator();
            const gainNode = ctx.createGain();

            osc.type = 'sawtooth'; // Onda dente-de-serra sutil para textura de aviso
            osc.frequency.setValueAtTime(freqInicial, agora);
            // Efeito de rampa contínua (Glissando descendente)
            osc.frequency.linearRampToValueAtTime(freqFinal, agora + 0.35);

            // Filtro passa-baixas para deixar o som de erro cibernético sutil e não agressivo
            const filtro = ctx.createBiquadFilter();
            filtro.type = 'lowpass';
            filtro.frequency.setValueAtTime(400, agora);

            gainNode.gain.setValueAtTime(0.12, agora);
            gainNode.gain.exponentialRampToValueAtTime(0.0001, agora + 0.4);

            osc.connect(filtro);
            filtro.connect(gainNode);
            gainNode.connect(ctx.destination);

            osc.start(agora);
            osc.stop(agora + 0.4);
        } catch (e) {
            console.warn("[AdaptiveAudioEngine] Abortada a síntese de áudio de desvio:", e);
        }
    }

    /**
     * Sonifica o deslocamento vetorial cinestésico do Canvas (Deslocamento na Reta ou Arcos).
     * @param {number} delta - Valor do deslocamento (pontoB - pontoA).
     */
    static sonarDeslocamento(delta) {
        if (G.musica === false || delta === 0) return;

        try {
            const ctx = this._initContext();
            const agora = ctx.currentTime;

            const osc = ctx.createOscillator();
            const gainNode = ctx.createGain();

            osc.type = 'triangle'; // Onda triangular (Suave e encorpada)
            
            // Frequência base balanceada (Lá 220Hz)
            const freqBase = 220;
            // O som sobe se o deslocamento for positivo, e desce se for negativo
            const freqDestino = freqBase + (delta * 15);

            osc.frequency.setValueAtTime(freqBase, agora);
            osc.frequency.exponentialRampToValueAtTime(Math.max(60, Math.min(freqDestino, 1200)), agora + 0.5);

            gainNode.gain.setValueAtTime(0.1, agora);
            gainNode.gain.exponentialRampToValueAtTime(0.0001, agora + 0.5);

            osc.connect(gainNode);
            gainNode.connect(ctx.destination);

            osc.start(agora);
            osc.stop(agora + 0.5);
        } catch (e) {
            // Silêncio defensivo se o hardware de som falhar
        }
    }
}
