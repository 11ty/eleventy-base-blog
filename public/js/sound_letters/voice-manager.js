// VoiceManager.js
import { AUDIO_CONFIG } from './config.js';

export class VoiceManager {
    constructor(audioEngine, frequencyManager) {
        this.audioEngine = audioEngine;
        this.frequencyManager = frequencyManager;
        this.activeVoices = new Map();
    }

    allocateVoice(key) {
        if (this.activeVoices.size >= AUDIO_CONFIG.MAX_VOICES) {
            const oldestKey = Array.from(this.activeVoices.keys())[0];
            this.releaseVoice(oldestKey);
        }

        const freq = this.frequencyManager.getFrequency(key);
        const velocity = 0.7 + Math.random() * 0.25;
        const voice = this.audioEngine.renderSynthVoice({ key, freq, gate: 1, velocity });
        this.activeVoices.set(key, { voice, freq, velocity });

        return this.frequencyManager.getNormalizedFrequency(key);
    }

    releaseVoice(key) {
        if (this.activeVoices.has(key)) {
            const { freq, velocity } = this.activeVoices.get(key);
            const voice = this.audioEngine.renderSynthVoice({ key, freq, gate: 0, velocity });
            this.activeVoices.set(key, { voice, releaseStart: Date.now() });
        }
    }

    renderActiveVoices() {
        const currentTime = Date.now();
        const outputs = [];

        for (const [key, voice] of this.activeVoices.entries()) {
            if (voice.releaseStart && currentTime - voice.releaseStart > AUDIO_CONFIG.ADSR_SETTINGS.release * 1000) {
                this.activeVoices.delete(key);
            } else {
                outputs.push(voice.voice);
            }
        }

        this.audioEngine.render(outputs);
    }
}
