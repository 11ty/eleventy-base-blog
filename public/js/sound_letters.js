// Import dependencies
import { el } from 'https://cdn.jsdelivr.net/npm/@elemaudio/core@3.2.1/+esm';
import WebRenderer from 'https://cdn.jsdelivr.net/npm/@elemaudio/web-renderer@3.2.1/+esm';
import srvb from './srvb.js';

// Initialize core components
const core = new WebRenderer();
const ctx = new AudioContext();
ctx.suspend();

// Define constants
const ADSR = {
    ATTACK: 0.05,
    DECAY: 0.4,
    SUSTAIN: 0.4,
    RELEASE: 1.0
};
const FREQ = {
    MIN: 120,
    MAX: 600
};

// Initialize data structures
const letterMap = new Map();
const activeVoices = new Map();

// Helper function to generate unique keys
const genKey = (base, suffix) => `${base}:${suffix}`;

// Initialize letter elements
document.querySelectorAll('.letter').forEach(element => {
    const key = element.textContent.toLowerCase();
    element.isPressed = false;
    element.rotation = parseFloat(element.dataset.rotation) || 0;
    letterMap.set(key, { element });
});

// Audio initialization function
async function initializeAudio() {
    if (ctx.state === "suspended") {
        await ctx.resume();
        const node = await core.initialize(ctx, {
            numberOfInputs: 0,
            numberOfOutputs: 1,
            outputChannelCount: [2]
        });
        node.connect(ctx.destination);
    }
}

// Render synth voice function
function renderSynthVoice({ key, freq, gate }) {
    const gateSignal = el.const({ key: genKey(key, 'gate'), value: gate });

    // ADSR envelope
    const env = el.adsr(
        el.const({ key: genKey(key, 'adsr:attack'), value: ADSR.ATTACK }),
        el.const({ key: genKey(key, 'adsr:decay'), value: ADSR.DECAY }),
        el.const({ key: genKey(key, 'adsr:sustain'), value: ADSR.SUSTAIN }),
        el.const({ key: genKey(key, 'adsr:release'), value: ADSR.RELEASE }),
        gateSignal
    );

    // Oscillators
    const fundamentalFreq = el.add(el.const({ key: genKey(key, 'freq'), value: freq }));
    const harmonic1Freq = el.mul(fundamentalFreq, 2);
    const harmonic2Freq = el.mul(fundamentalFreq, 3);

    const fundamental = el.cycle(fundamentalFreq);
    const harmonic1 = el.cycle(harmonic1Freq);
    const harmonic2 = el.cycle(harmonic2Freq);

    // Combine oscillators
    const combinedSignal = el.add(
        el.mul(0.5, fundamental),
        el.mul(0.3, harmonic1),
        el.mul(0.2, harmonic2)
    );

    // Apply envelope
    const envelopedSignal = el.mul(env, combinedSignal);

    // Apply tremolo
    const lfo = el.cycle(el.const({ key: genKey(key, 'tremolo:lfo'), value: 6 }));
    const tremolo = el.mul(el.add(1, el.mul(0.1, el.sub(lfo, 1))), envelopedSignal);

    // Apply reverb
    const reverbOutput = srvb({
        key: genKey(key, 'reverb'),
        sampleRate: 44100,
        size: el.const({ value: 0.5 }),
        decay: el.const({ value: 0.5 }),
        mod: el.const({ value: 0.2 }),
        mix: el.const({ value: 0.3 }),
    }, tremolo, tremolo);

    return el.add(reverbOutput[0], reverbOutput[1]);
}

// Voice management functions
function startVoice(key, newFreq, element) {
    const voiceState = { key, freq: newFreq || 440, gate: 1 };
    const output = renderSynthVoice(voiceState);
    activeVoices.set(key, output);
    applyContinuousRotation(element, newFreq);
}

function stopVoice(key, element) {
    const voiceState = { key, freq: 0, gate: 0 };
    const output = renderSynthVoice(voiceState);
    activeVoices.set(key, output);
    element.isPressed = false;
}

function updateTone(newFreq, openingGate, element) {
    const key = element.textContent.toLowerCase();
    if (openingGate) {
        startVoice(key, newFreq, element);
    } else {
        stopVoice(key, element);
    }
    renderActiveVoices();
}

// Render all active voices
function renderActiveVoices() {
    const outputs = Array.from(activeVoices.values());
    if (outputs.length > 0) {
        const combinedOutput = el.add(...outputs);
        core.render(combinedOutput, combinedOutput);
    } else {
        core.render(el.const({ value: 0 }), el.const({ value: 0 }));
    }
}

// Apply continuous rotation based on frequency
function applyContinuousRotation(element, frequency) {
    element.isPressed = true;
    element.classList.add('spinning');
    const rotationSpeed = frequency / 220;
    let angularVelocity = 0;

    let lastTimestamp = null;
    function step(timestamp) {
        if (!lastTimestamp) lastTimestamp = timestamp;
        const elapsed = (timestamp - lastTimestamp) / 1000; // in seconds

        if (element.isPressed) {
            angularVelocity = 360 * rotationSpeed;
        } else {
            angularVelocity *= 0.95; // Gradual slowdown
            if (Math.abs(angularVelocity) < 1) {
                element.classList.remove('spinning');
                return;
            }
        }

        element.rotation += angularVelocity * elapsed;
        element.style.transform = `rotate(${element.rotation}deg)`;
        lastTimestamp = timestamp;
        requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
}

// Handle user interaction
const handleInteraction = async (element, isPressed) => {
    await initializeAudio();
    if (isPressed && !element.isPressed) {
        const randFreq = FREQ.MIN + Math.random() * (FREQ.MAX - FREQ.MIN);
        updateTone(randFreq, true, element);
        applyContinuousRotation(element, randFreq);
    } else {
        updateTone(null, false, element);
        element.isPressed = false;
    }
};

// Attach event listeners
document.querySelectorAll('.letter').forEach(element => {
    element.addEventListener('mousedown', () => handleInteraction(element, true));
    element.addEventListener('mouseup', () => handleInteraction(element, false));
    element.addEventListener('mouseleave', () => {
        if (element.isPressed) {
            handleInteraction(element, false);
        }
    });
});

// Handle keypress events
const handleKeypress = async (event, isPressed) => {
    const letter = letterMap.get(event.key);
    if (letter && (!isPressed || (isPressed && !letter.element.isPressed))) {
        await handleInteraction(letter.element, isPressed);
    }
};

document.addEventListener('keydown', event => handleKeypress(event, true));
document.addEventListener('keyup', event => handleKeypress(event, false));

// Initialize setup on first user interaction
document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('click', initializeAudio, { once: true });
});
