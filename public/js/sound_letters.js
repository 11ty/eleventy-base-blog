import { el } from 'https://cdn.jsdelivr.net/npm/@elemaudio/core@3.2.1/+esm';
import WebRenderer from 'https://cdn.jsdelivr.net/npm/@elemaudio/web-renderer@3.2.1/+esm';

// Constants and Configurations
const FREQ_MIN = 130.81; // C3
const FREQ_MAX = 523.25; // C5
const MAX_VOICES = 8;
const ADSR_SETTINGS = { attack: 0.01, decay: 0.1, sustain: 0.7, release: 2.0 };
const ROTATION_SETTINGS = { maxSpeed: 720, friction: 0.95, minSpeed: 1 };

// Initialize audio context and renderer
const core = new WebRenderer();
const ctx = new AudioContext();
ctx.suspend();

// Generate frequency scale
const FREQUENCIES = generateScale(FREQ_MIN, 24);

// Initialize data structures
const letterMap = new Map();
const activeVoices = new Map();

// Utility Functions
function generateScale(baseFreq, numNotes) {
    return Array.from({ length: numNotes }, (_, i) => baseFreq * Math.pow(2, i / 12));
}

function getRandomInRange(min, max) {
    return Math.random() * (max - min) + min;
}

// Audio Rendering Functions
function renderPianoVoice({ key, freq, gate, velocity }) {
    const smoothGate = el.smooth(0.005, el.const({ key: `${key}:smoothGate`, value: gate }));
    const { attack, decay, sustain, release } = ADSR_SETTINGS;
    const env = el.adsr(attack, decay, sustain, release, smoothGate);

    const osc1 = el.cycle(el.mul(freq, getRandomInRange(0.99, 0.999)));
    const osc2 = el.cycle(freq);
    const osc3 = el.cycle(el.mul(freq, getRandomInRange(1.001, 1.01)));
    const oscMix = el.add(el.mul(osc1, 0.33), el.mul(osc2, 0.33), el.mul(osc3, 0.34));

    const saturated = el.tanh(el.mul(oscMix, 1.2));
    const cutoff = el.add(el.mul(env, 2000), 100);
    const filtered = el.lowpass(cutoff, 0.7, saturated);

    const highpassed = el.highpass(100, 0.7, filtered);
    const eqed = el.peak(800, -3, 1, highpassed);
    const output = el.mul(eqed, env, el.const({ key: `${key}:velocity`, value: velocity }));

    return el.mul(output, 0.5); // Master volume adjustment
}

function allocateVoice(key) {
    if (activeVoices.size >= MAX_VOICES) {
        const oldestKey = Array.from(activeVoices.keys())[0];
        releaseVoice(oldestKey);
    }
    const freqIndex = Math.floor(Math.random() * FREQUENCIES.length);
    const freq = FREQUENCIES[freqIndex];
    const velocity = 0.8 + Math.random() * 0.2;
    const voice = renderPianoVoice({ key, freq, gate: 1, velocity });
    activeVoices.set(key, { voice, freq, velocity });
    return freqIndex / FREQUENCIES.length;
}

function releaseVoice(key) {
    if (activeVoices.has(key)) {
        const { freq, velocity } = activeVoices.get(key);
        const voice = renderPianoVoice({ key, freq, gate: 0, velocity });
        activeVoices.set(key, { voice, releaseStart: Date.now() });
    }
}

function renderActiveVoices() {
    const currentTime = Date.now();
    const outputs = Array.from(activeVoices.entries())
        .filter(([key, voice]) => {
            if (voice.releaseStart && currentTime - voice.releaseStart > 2000) {
                activeVoices.delete(key);
                return false;
            }
            return true;
        })
        .map(([_, voice]) => voice.voice);

    if (outputs.length > 0) {
        const combinedOutput = el.add(...outputs);
        core.render(combinedOutput, combinedOutput);
    } else {
        core.render(el.const({ value: 0 }), el.const({ value: 0 }));
    }
}

// Visual Effects Functions
function applyRotation(element, normalizedFreq) {
    element.isPressed = true;
    element.classList.add('spinning');
    const { maxSpeed, friction, minSpeed } = ROTATION_SETTINGS;
    const rotationSpeed = normalizedFreq * maxSpeed;
    const spinDirection = Math.random() < 0.5 ? 1 : -1;

    let lastTimestamp = null;
    let angularVelocity = rotationSpeed * spinDirection;

    function step(timestamp) {
        if (!lastTimestamp) lastTimestamp = timestamp;
        const elapsed = (timestamp - lastTimestamp) / 1000;

        if (element.isPressed) {
            element.rotation += angularVelocity * elapsed;
        } else {
            angularVelocity *= friction;
            element.rotation += angularVelocity * elapsed;
            if (Math.abs(angularVelocity) < minSpeed) {
                element.classList.remove('spinning');
                return;
            }
        }

        element.style.transform = `rotate(${element.rotation}deg)`;
        lastTimestamp = timestamp;
        requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
}

// Event Handling Functions
const handleInteraction = async (element, isPressed) => {
    const key = element.textContent.toLowerCase();
    if (isPressed && !element.isPressed) {
        const normalizedFreq = allocateVoice(key);
        applyRotation(element, normalizedFreq);
    } else if (!isPressed && element.isPressed) {
        releaseVoice(key);
        element.isPressed = false;
    }
    renderActiveVoices();
};

// Initialization
document.querySelectorAll('.letter').forEach(element => {
    const key = element.textContent.toLowerCase();
    element.isPressed = false;
    element.rotation = parseFloat(element.dataset.rotation) || 0;
    letterMap.set(key, { element });

    element.addEventListener('mousedown', () => handleInteraction(element, true));
    element.addEventListener('mouseup', () => handleInteraction(element, false));
    element.addEventListener('mouseleave', () => {
        if (element.isPressed) handleInteraction(element, false);
    });
});

document.addEventListener('keydown', event => {
    const letter = letterMap.get(event.key);
    if (letter && !letter.element.isPressed) handleInteraction(letter.element, true);
});

document.addEventListener('keyup', event => {
    const letter = letterMap.get(event.key);
    if (letter && letter.element.isPressed) handleInteraction(letter.element, false);
});

document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('click', async () => {
        if (ctx.state === "suspended") {
            await ctx.resume();
            const node = await core.initialize(ctx, {
                numberOfInputs: 0,
                numberOfOutputs: 1,
                outputChannelCount: [2],
            });
            node.connect(ctx.destination);
        }
    }, { once: true });
});
