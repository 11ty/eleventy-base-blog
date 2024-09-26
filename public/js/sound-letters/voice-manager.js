// VoiceManager.js
import { AUDIO_CONFIG } from './config.js';

export class VoiceManager {
    constructor(audioEngine, frequencyManager) {
        this.audioEngine = audioEngine;
        this.frequencyManager = frequencyManager;
        this.activeVoices = new Map();
    }

    allocateVoice(key, position) {
        if (this.activeVoices.size >= AUDIO_CONFIG.MAX_VOICES) {
            const oldestKey = Array.from(this.activeVoices.keys())[0];
            this.releaseVoice(oldestKey);
        }

        const freq = this.frequencyManager.getFrequency(key);
        const velocity = 0.7 + Math.random() * 0.25;
        const voice = this.audioEngine.renderSynthVoice({ key, freq, gate: 1, velocity, position });
        this.activeVoices.set(key, { voice, freq, velocity, position, gate: 1 });

        return this.frequencyManager.getNormalizedFrequency(key);
    }

    releaseVoice(key) {
        if (this.activeVoices.has(key)) {
            const voiceData = this.activeVoices.get(key);
            voiceData.gate = 0;
            voiceData.releaseStart = Date.now();
            // We don't need to re-render the voice here, it will be updated in renderActiveVoices
        }
    }

    renderActiveVoices() {
        const currentTime = Date.now();
        const outputs = [];

        for (const [key, voiceData] of this.activeVoices.entries()) {
            if (voiceData.releaseStart && currentTime - voiceData.releaseStart > AUDIO_CONFIG.ADSR_SETTINGS.release * 1000) {
                this.activeVoices.delete(key);
            } else {
                // Only update the voice if the gate has changed
                if (voiceData.voice.gate !== voiceData.gate) {
                    voiceData.voice = this.audioEngine.renderSynthVoice({
                        key,
                        freq: voiceData.freq,
                        gate: voiceData.gate,
                        velocity: voiceData.velocity,
                        position: voiceData.position
                    });
                }
                outputs.push(voiceData.voice);
            }
        }

        this.audioEngine.render(outputs);
    }
}
