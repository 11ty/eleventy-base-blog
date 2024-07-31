// SoundLetters.js
import { AudioEngine } from './sound_letters/audio-engine.js';
import { FrequencyManager } from './sound_letters/frequency-manager.js';
import { VoiceManager } from './sound_letters/voice-manager.js';
import { RotationManager } from './sound_letters/rotation-manager.js';

class SoundLetters {
    constructor() {
        this.audioEngine = new AudioEngine();
        this.frequencyManager = new FrequencyManager();
        this.voiceManager = new VoiceManager(this.audioEngine, this.frequencyManager);
        this.rotationManager = new RotationManager();
        this.letterMap = new Map();

        this.initializeLetters();
        this.addEventListeners();
    }

    initializeLetters() {
        document.querySelectorAll('.letter').forEach((element, index) => {
            const key = element.textContent.toLowerCase();
            element.isPressed = false;
            element.rotation = parseFloat(element.dataset.rotation) || 0;
            this.letterMap.set(key, { element, index });
        });
    }

    addEventListeners() {
        document.querySelectorAll('.letter').forEach(element => {
            element.addEventListener('mousedown', () => this.handleInteraction(element, true));
            element.addEventListener('mouseup', () => this.handleInteraction(element, false));
            element.addEventListener('mouseleave', () => {
                if (element.isPressed) this.handleInteraction(element, false);
            });
        });

        document.addEventListener('keydown', event => this.handleKeyDown(event));
        document.addEventListener('keyup', event => this.handleKeyUp(event));
        document.addEventListener('click', () => this.initializeAudio(), { once: true });
    }

    async handleInteraction(element, isPressed) {
        await this.initializeAudio();
        const key = element.textContent.toLowerCase();
        if (isPressed && !element.isPressed) {
            const normalizedFreq = this.voiceManager.allocateVoice(key);
            this.rotationManager.applyRotation(element, normalizedFreq);
        } else if (!isPressed && element.isPressed) {
            this.voiceManager.releaseVoice(key);
            this.rotationManager.stopRotation(element);
        }
        this.voiceManager.renderActiveVoices();
    }


    handleKeyDown(event) {
        const letter = this.letterMap.get(event.key);
        if (letter && !letter.element.isPressed) {
            this.handleInteraction(letter.element, true);
        }
    }

    handleKeyUp(event) {
        const letter = this.letterMap.get(event.key);
        if (letter && letter.element.isPressed) {
            this.handleInteraction(letter.element, false);
        }
    }

    async initializeAudio() {
        if (!this.audioEngine.isInitialized) {
            await this.audioEngine.initialize();
        }
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new SoundLetters();
});