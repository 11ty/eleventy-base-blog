// FrequencyManager.js
import { AUDIO_CONFIG } from './config.js';

export class FrequencyManager {
    constructor() {
        this.letterFrequencies = new Map();
        this.letterCount = document.querySelectorAll('.letter').length;
        this.frequencies = this.generateUniqueFrequencies();
        this.initializeFrequencies();
    }

    generateUniqueFrequencies() {
        const allNotes = Array.from({ length: AUDIO_CONFIG.NOTES_PER_OCTAVE * AUDIO_CONFIG.OCTAVES }, (_, i) => i);
        const frequencies = new Set();

        while (frequencies.size < this.letterCount) {
            const index = Math.floor(Math.random() * allNotes.length);
            const note = allNotes[index];
            const frequency = AUDIO_CONFIG.FREQ_MIN * Math.pow(2, note / AUDIO_CONFIG.NOTES_PER_OCTAVE);
            frequencies.add(frequency);
            allNotes.splice(index, 1);
        }

        return Array.from(frequencies).sort((a, b) => a - b);
    }

    initializeFrequencies() {
        const letters = Array.from(document.querySelectorAll('.letter')).map(el => el.textContent.toLowerCase());
        letters.forEach((letter, index) => {
            this.letterFrequencies.set(letter, this.frequencies[index % this.frequencies.length]);
        });
    }

    getFrequency(letter) {
        return this.letterFrequencies.get(letter.toLowerCase());
    }

    getNormalizedFrequency(letter) {
        const freq = this.getFrequency(letter);
        return freq / AUDIO_CONFIG.FREQ_MIN;
    }
}
