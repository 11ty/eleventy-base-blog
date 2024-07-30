import { el } from 'https://cdn.jsdelivr.net/npm/@elemaudio/core@3.2.1/+esm';
import WebRenderer from 'https://cdn.jsdelivr.net/npm/@elemaudio/web-renderer@3.2.1/+esm';

const FREQ_MIN = 130.81; // C3
const MAX_VOICES = 8;
const ADSR_SETTINGS = { attack: 0.005, decay: 0.1, sustain: 0.7, release: 1.5 };
const ROTATION_SETTINGS = { maxSpeed: 720, friction: 0.95, minSpeed: 1 };

const core = new WebRenderer();
const ctx = new AudioContext();
ctx.suspend();

const letterMap = new Map();
const activeVoices = new Map();

let isRandomMode = false;
let fixedNotes;

const NOTES_PER_OCTAVE = 12;
const OCTAVES = 2;
const letterCount = document.querySelectorAll('.letter').length;

function generateUniqueFrequencies() {
    const allNotes = Array.from({ length: NOTES_PER_OCTAVE * OCTAVES }, (_, i) => i);
    const frequencies = new Set();

    while (frequencies.size < letterCount) {
        const index = Math.floor(Math.random() * allNotes.length);
        const note = allNotes[index];
        const frequency = FREQ_MIN * Math.pow(2, note / NOTES_PER_OCTAVE);
        frequencies.add(frequency);
        allNotes.splice(index, 1);
    }

    return Array.from(frequencies).sort((a, b) => a - b);
}

const FREQUENCIES = generateUniqueFrequencies();

function getRandomInRange(min, max) {
    return Math.random() * (max - min) + min;
}

function renderPianoVoice({ key, freq, gate, velocity }) {
    const smoothGate = el.smooth(0.005, el.const({ key: `${key}:smoothGate`, value: gate }));
    const { attack, decay, sustain, release } = ADSR_SETTINGS;
    const env = el.adsr(attack, decay, sustain, release, smoothGate);

    const detune = el.add(
        el.mul(el.noise(), 0.1),
        el.mul(el.cycle(0.1), 0.2)
    );

    const osc1 = el.cycle(el.mul(freq, el.add(1, el.mul(detune, 0.001))));
    const osc2 = el.cycle(freq);
    const osc3 = el.cycle(el.mul(freq, el.add(1, el.mul(detune, -0.001))));

    const oscMix = el.add(
        el.mul(osc1, 0.33),
        el.mul(osc2, 0.34),
        el.mul(osc3, 0.33)
    );

    const saturated = el.tanh(el.mul(oscMix, 1.5));
    const cutoff = el.add(el.mul(env, 3000), 100);
    const resonance = el.add(0.5, el.mul(env, 0.3));
    const filtered = el.svf({ mode: 'lowpass' }, cutoff, resonance, saturated);

    const highpassed = el.highpass(80, 0.7, filtered);
    const output = el.mul(highpassed, env, el.const({ key: `${key}:velocity`, value: velocity }));

    return el.mul(output, 0.4);
}

function allocateVoice(key) {
    if (activeVoices.size >= MAX_VOICES) {
        const oldestKey = Array.from(activeVoices.keys())[0];
        releaseVoice(oldestKey);
    }

    let freqIndex, freq;
    if (isRandomMode) {
        freqIndex = Math.floor(Math.random() * FREQUENCIES.length);
        freq = FREQUENCIES[freqIndex];
    } else {
        if (!fixedNotes) {
            fixedNotes = FREQUENCIES.map(() => Math.floor(Math.random() * FREQUENCIES.length));
        }
        freqIndex = fixedNotes[letterMap.get(key).index];
        freq = FREQUENCIES[freqIndex];
    }

    const velocity = 0.7 + Math.random() * 0.25;
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
    const outputs = [];

    for (const [key, voice] of activeVoices.entries()) {
        if (voice.releaseStart && currentTime - voice.releaseStart > ADSR_SETTINGS.release * 1000) {
            activeVoices.delete(key);
        } else {
            outputs.push(voice.voice);
        }
    }

    if (outputs.length > 0) {
        const combinedOutput = el.add(...outputs);
        const gainReduction = el.div(1, el.sqrt(el.const({ key: 'voiceCount', value: outputs.length })));
        const limitedOutput = el.tanh(el.mul(combinedOutput, gainReduction, 0.7));

        core.render(limitedOutput, limitedOutput);
    } else {
        core.render(el.const({ value: 0 }), el.const({ value: 0 }));
    }
}

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

document.querySelectorAll('.letter').forEach((element, index) => {
    const key = element.textContent.toLowerCase();
    element.isPressed = false;
    element.rotation = parseFloat(element.dataset.rotation) || 0;
    letterMap.set(key, { element, index });

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
