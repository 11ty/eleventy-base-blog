// Import dependencies
import { el } from 'https://cdn.jsdelivr.net/npm/@elemaudio/core@3.2.1/+esm';
import WebRenderer from 'https://cdn.jsdelivr.net/npm/@elemaudio/web-renderer@3.2.1/+esm';
import srvb from './srvb.js';

// Initialize core components
const core = new WebRenderer();
const ctx = new AudioContext();
ctx.suspend();

// Define constants
const FREQ = {
    MIN: 120,
    MAX: 600
};
const MAX_ROTATION_SPEED = 720; // Maximum rotation speed in degrees per second

// Initialize data structures
const letterMap = new Map();
const activeVoices = new Map();
const MAX_VOICES = 8;

const BASE_FREQUENCY = 261.63; // C4 (Middle C)
const MAJOR_SCALE_RATIOS = [1, 9 / 8, 5 / 4, 4 / 3, 3 / 2, 5 / 3, 15 / 8];

function generateScale(baseFreq, numOctaves) {
    let frequencies = [];
    for (let octave = 0; octave < numOctaves; octave++) {
        frequencies = frequencies.concat(
            MAJOR_SCALE_RATIOS.map(ratio => baseFreq * ratio * Math.pow(2, octave))
        );
    }
    return frequencies;
}

const FREQUENCIES = generateScale(BASE_FREQUENCY, 2);


// Initialize letter elements
document.querySelectorAll('.letter').forEach(element => {
    const key = element.textContent.toLowerCase();
    element.isPressed = false;
    element.rotation = parseFloat(element.dataset.rotation) || 0;
    letterMap.set(key, { element });
});

function preWarmVoices() {
    document.querySelectorAll('.letter').forEach((element, index) => {
        const key = element.textContent.toLowerCase();
        const dummyFreq = 440;
        renderSynthVoice({ key, freq: dummyFreq, gate: 0 });
    });
}

// Audio initialization function
async function initializeAudio() {
    if (ctx.state === "suspended") {
        await ctx.resume();
        const node = await core.initialize(ctx, {
            numberOfInputs: 0,
            numberOfOutputs: 1,
            outputChannelCount: [2],
            bufferSize: 4096
        });
        node.connect(ctx.destination);
        preWarmVoices();
    }
}

// Shared components (define these outside the function)
const sharedEnv = el.adsr(
    el.const({ key: 'shared:attack', value: 0.01 }),
    el.const({ key: 'shared:decay', value: 2 }),
    el.const({ key: 'shared:sustain', value: 0.7 }),
    el.const({ key: 'shared:release', value: 0.1 }),
    el.const({ key: 'shared:gate', value: 1 })
);

const sharedTremolo = el.add(1, el.mul(0.15, el.cycle(6)));

const sharedLowpass = (input) => el.lowpass(
    el.const({ key: 'shared:cutoff', value: 2000 }),
    el.const({ key: 'shared:q', value: 1 }),
    input
);


function renderSynthVoice({ key, freq, gate, velocity }) {
    const smoothGate = el.smooth(0.01, el.const({ key: `${key}:smoothGate`, value: gate }));

    // Rhodes-like tine and tone bar frequencies
    freq = el.mul(freq, 0.5); // This will lower the pitch by one octave
    const tine = el.cycle(freq);
    const toneBar = el.cycle(el.mul(freq, 4.7));

    // Combine tine and tone bar
    const rhodesSound = el.add(
        el.mul(0.6, tine),
        el.mul(0.4, toneBar)
    );

    // Apply shared envelope
    const envelopedSound = el.mul(rhodesSound, el.mul(sharedEnv, smoothGate));

    // Apply shared lowpass filter
    const filteredSound = sharedLowpass(envelopedSound);

    // Apply shared tremolo effect
    const tremoloSound = el.mul(filteredSound, sharedTremolo);

    // Apply velocity sensitivity
    const velocitySensitive = el.mul(tremoloSound, el.const({ key: `${key}:velocity`, value: velocity }));

    // Soft limiting for natural dynamics
    const limitedOutput = el.tanh(el.mul(0.7, velocitySensitive));

    return limitedOutput;
}


// Implement efficient voice allocation
// function allocateVoice(key, freq, velocity) {
//     if (activeVoices.size >= MAX_VOICES) {
//         const oldestKey = Array.from(activeVoices.keys())[0];
//         activeVoices.delete(oldestKey);
//     }
//     const voice = renderSynthVoice({ key, freq, gate: 1, velocity });
//     activeVoices.set(key, voice);
// }

// Modify the allocateVoice function
function allocateVoice(key) {
    if (activeVoices.size >= MAX_VOICES) {
        const oldestKey = Array.from(activeVoices.keys())[0];
        releaseVoice(oldestKey);
    }
    const freq = FREQUENCIES[Math.floor(Math.random() * FREQUENCIES.length)];
    const velocity = 0.75 + Math.random() * 0.25;
    const voice = renderSynthVoice({ key, freq, gate: 1, velocity });
    activeVoices.set(key, voice);
}


function releaseVoice(key) {
    if (activeVoices.has(key)) {
        const voice = renderSynthVoice({ key, freq: 0, gate: 0 });
        activeVoices.set(key, voice);
    }
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
    const rotationSpeed = Math.min(frequency / 440, MAX_ROTATION_SPEED);
    let angularVelocity = 0;

    const spinDirection = Math.random() < 0.5 ? 1 : -1;

    let lastTimestamp = null;
    function step(timestamp) {
        if (!lastTimestamp) lastTimestamp = timestamp;
        const elapsed = (timestamp - lastTimestamp) / 1000; // in seconds

        if (element.isPressed) {
            angularVelocity = 360 * rotationSpeed * spinDirection;
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
    const key = element.textContent.toLowerCase();
    if (isPressed && !element.isPressed) {
        const randFreq = FREQ.MIN + Math.random() * (FREQ.MAX - FREQ.MIN);
        const velocity = 0.75 + Math.random() * 0.25; // Random velocity between 0.5 and 1
        allocateVoice(key, randFreq, velocity);
        element.isPressed = true;
        applyContinuousRotation(element, randFreq);
    } else if (!isPressed && element.isPressed) {
        releaseVoice(key);
        element.isPressed = false;
    }
    renderActiveVoices();
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
