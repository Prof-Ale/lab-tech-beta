/**
 * audioController.js — Gerenciador de Áudio do LabTech
 */
export const AudioCtrl = {
    music: null,

    init() {
        // Tenta buscar o elemento de áudio do HTML
        this.music = document.getElementById('bgm');
        if (this.music) {
            this.music.loop = true;
            this.music.volume = 0.4;
        }
    },

    play() {
        if (this.music && this.music.paused) {
            this.music.play().catch(e => console.log("Áudio aguardando interação..."));
        }
    },

    toggle(btnId, textId) {
        if (!this.music) return;
        if (this.music.paused) {
            this.music.play();
            document.getElementById(textId).innerText = "ON";
        } else {
            this.music.pause();
            document.getElementById(textId).innerText = "OFF";
        }
    },

    setIntensity(isHigh) {
        if (!this.music) return;
        this.music.playbackRate = isHigh ? 1.1 : 1.0;
        this.music.volume = isHigh ? 0.6 : 0.4;
    }
};
