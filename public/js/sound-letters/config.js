export const AUDIO_CONFIG = {
    FREQ_MIN: 130.81, // C3
    MAX_VOICES: 8,
    ADSR_SETTINGS: {
        attack: 0.015,  // Slightly longer attack
        decay: 0.6,     // Longer decay
        sustain: 0.5,   // Lower sustain level
        release: 1.8,   // Longer release
    },
    ROTATION_SETTINGS: {
        maxSpeed: 260,
        friction: 0.95,
        minSpeed: 1,
    },
    NOTES_PER_OCTAVE: 12,
    OCTAVES: 2,
    
    // New settings for softer, more bell-like sound
    HARMONIC_MIX: {
        fundamental: 1,
        secondHarmonic: 0.3,
        thirdHarmonic: 0.1,
    },
    INHARMONICS_AMOUNT: 0.002,
    ATTACK_NOISE: {
        amount: 0.05,
        attack: 0.001,
        decay: 0.03,
    },
    TINE_RESONANCE: {
        frequency: 1.5, // Multiplier for fundamental frequency
        q: 3,           // Lower Q for softer resonance
    },
    PICKUP_RESPONSE: 0.6, // Softer pickup nonlinearity
    FILTER_SETTINGS: {
        baseCutoff: 200,
        velocitySensitivity: 300,
        envelopeAmount: 800,
    },
    AMPLITUDE: 0.8, // Overall amplitude reduction
    STEREO_SETTINGS: {
        spread: 0.01,
        delay: 0.5,
    },
    CHORUS_SETTINGS: {
        rate: 0.3,
        depth: 0.1,
        mix: 0.1,
    },
    PANNING_AMOUNT: 0.5,
};

// Additional constants
export const SAMPLE_RATE = 44100;
export const BUFFER_SIZE = 256;