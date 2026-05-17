/**
 * @fileoverview AdaptiveAudioEngine.js
 * @description Gerenciador Adaptativo de Áudio e Sonificação Paramétrica para o LabTech.
 * Substitui o controlador de áudio acoplado tradicional por uma engine baseada na Web Audio API.
 * Fornece mediação acústica inclusiva e controle de carga cognitiva sem distorção de pitch.
 * 
 * @version 2.0.0
 * @package LabTech Core Environment
 */

export class AdaptiveAudioEngine {
    /**
     * Instancia o motor adaptativo de áudio desacoplado do DOM.
     */
    constructor() {
        /**
         * Contexto de Áudio Web Nativo
         * @private
         * @type {AudioContext|null}
         */
        this._audioContext = null;

        /**
         * Nó gerenciador de ganho master (volume)
         * @private
         * @type {GainNode|null}
         */
        this._masterGainNode = null;

        /**
         * Filtro de frequência para controle de ansiedade e foco
         * @private
         * @type {BiquadFilterNode|null}
         */
        this._cognitiveFilterNode = null;

        /**
         * Estado interno de inicialização segura
         * @private
         * @type {boolean}
         */
        this._isInitialized = false;

        /**
         * Estado de mudo controlado por acessibilidade
         * @private
         * @type {boolean}
         */
        this._isMuted = false;
    }

    /**
     * Inicializa de forma assíncrona o pipeline de áudio sob demanda.
     * Mitiga a barreira de segurança de interação prévia obrigatória dos navegadores.
     * @returns {Promise<boolean>} Confirmação de ativação do hardware de áudio
     */
    async initialize() {
        if (this._isInitialized) return true;

        try {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (!AudioContextClass) {
                console.warn("[AUDIO ENGINE] Web Audio API não suportada neste dispositivo.");
                return false;
            }

            this._audioContext = new AudioContextClass();
            
            // Construção do Grafo de Áudio Puro
            this._masterGainNode = this._audioContext.createGain();
            this._cognitiveFilterNode = this._audioContext.createBiquadFilter();

            // Configuração Padrão do Filtro Cognitivo (Passa-Baixas para amortecer agudos estressores)
            this._cognitiveFilterNode.type = 'lowpass';
            this._cognitiveFilterNode.frequency.setValueAtTime(22000, this._audioContext.currentTime);

            // Conexões do Grafo: Fonte -> Filtro -> Ganho Master -> Saída Física
            this._cognitiveFilterNode.connect(this._masterGainNode);
            this._masterGainNode.connect(this._audioContext.destination);

            this._masterGainNode.gain.setValueAtTime(0.4, this._audioContext.currentTime);
            this._isInitialized = true;
            return true;
        } catch (error) {
            console.error("[AUDIO ENGINE INITIALIZATION CRITICAL] Falha ao instanciar Grafo de Áudio:", error);
            return false;
        }
    }

    /**
     * Modifica dinamicamente as propriedades acústicas baseando-se no nível de tensão da tarefa.
     * Controla a carga cognitiva sem alterar a taxa de amostragem ou distorcer a afinação (pitch).
     * @param {boolean} isHighIntensity - Sinalizador de alta demanda cognitiva disparado pela ADA
     */
    setIntensity(isHighIntensity) {
        if (!this._isInitialized || this._isMuted) return;

        const targetVolume = isHighIntensity ? 0.55 : 0.35;
        const targetCutoffFrequency = isHighIntensity ? 1200 : 20000; // Corta agudos em momentos de estresse alto

        const now = this._audioContext.currentTime;

        // Rampa linear suave de volume em 400ms para evitar estalos de áudio (Clipping)
        this._masterGainNode.gain.linearRampToValueAtTime(targetVolume, now + 0.4);
        
        // Altera o filtro acústico para suavizar o estresse do estudante impulsivo
        this._cognitiveFilterNode.frequency.exponentialRampToValueAtTime(targetCutoffFrequency, now + 0.6);
    }

    /**
     * Sonifica dados numéricos variantes em tempo real.
     * Transforma parâmetros de funções matemáticas diretamente em frequências sonoras puras.
     * Mapeia de forma isomórfica o coeficiente de inclinação em altura tonal para alunos com deficiência visual.
     * @param {number} slopeValue - Valor puro do coeficiente angular 'a' da função afim
     */
    sonifyMathematicalSlope(slopeValue) {
        if (!this._isInitialized || this._isMuted) return;

        const now = this._audioContext.currentTime;
        
        // Criação de um oscilador sintetizador atômico para feedback imediato
        const oscillator = this._audioContext.createOscillator();
        const toneGain = this._audioContext.createGain();

        oscillator.type = 'sine';
        
        // Mapeamento matemático: Coeficiente Angular [-5..5] mapeado linearmente para frequências [220Hz..880Hz]
        const targetFrequency = ((slopeValue + 5) / 10) * (880 - 220) + 220;
        oscillator.frequency.setValueAtTime(targetFrequency, now);

        toneGain.gain.setValueAtTime(0.15, now);
        toneGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5); // Envelope de decaimento natural de 500ms

        oscillator.connect(toneGain);
        toneGain.connect(this._cognitiveFilterNode);

        oscillator.start(now);
        oscillator.stop(now + 0.5);
    }

    /**
     * Alterna o estado de mutação do sistema de som respeitando as preferências do DUA.
     * @returns {boolean} Estado final do mudo (true = silenciado, false = ativo)
     */
    toggleMute() {
        if (!this._isInitialized) return true;

        const now = this._audioContext.currentTime;
        if (this._isMuted) {
            this._masterGainNode.gain.linearRampToValueAtTime(0.35, now + 0.2);
            this._isMuted = false;
        } else {
            this._masterGainNode.gain.linearRampToValueAtTime(0.0, now + 0.1);
            this._isMuted = true;
        }

        return this._isMuted;
    }

    /**
     * Interrompe com segurança todos os processos e libera memória física do hardware
     */
    async terminate() {
        if (!this._audioContext) return;
        await this._audioContext.close();
        this._isInitialized = false;
        this._audioContext = null;
    }
}
