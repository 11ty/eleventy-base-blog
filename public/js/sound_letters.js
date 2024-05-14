import { el } from 'https://cdn.jsdelivr.net/npm/@elemaudio/core@3.2.1/+esm';
import WebRenderer from 'https://cdn.jsdelivr.net/npm/@elemaudio/web-renderer@3.2.1/+esm';

const core = new WebRenderer();
const ctx = new AudioContext();
ctx.suspend();

// Constants
const ATTACK = 0.1, DECAY = 0.1, SUSTAIN = 0.5, RELEASE = 1;
const MIN_FREQ = 220, MAX_FREQ = 880;

// Initialize oscillators for each letter
const letterMap = new Map();
const activeVoices = new Map();

document.querySelectorAll('.letter').forEach(element => {
    const key = element.textContent.toLowerCase();
    element.isPressed = false;
    letterMap.set(key, element);
});

// Function to resume audio context and initialize rendering
async function resumeAudio() {
    if (ctx.state !== "running") {
        await ctx.resume();
        const node = await core.initialize(ctx, {
            numberOfInputs: 0,
            numberOfOutputs: 1,
            outputChannelCount: [2]
        });
        node.connect(ctx.destination);
    }
}

// Play or stop tone based on user interaction
function updateTone(newFreq, openingGate, element) {
    const key = element.textContent.toLowerCase();
    if (openingGate) {
        const osc = el.cycle(el.const({ "value": newFreq || 440 }));
        const gate = el.const({ "value": 1 });
        const envelope = el.adsr(ATTACK, DECAY, SUSTAIN, RELEASE, gate);
        const output = el.mul(osc, envelope);
        activeVoices.set(key, output);
        startRotation(element, newFreq);
    } else {
        activeVoices.delete(key);
        stopRotation(element);
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
        core.render(el.const({ "value": 0 }), el.const({ "value": 0 })); // Render silence if no active voices
    }
}

// Start rotation using dynamically created CSS keyframes
function startRotation(element, frequency) {
    const rotationDuration = 100 / frequency; // Calculate rotation duration inversely proportional to frequency
    element.style.animation = `rotateAnimation ${rotationDuration}s linear infinite forwards`;
}

// Stop rotation by clearing the animation style
function stopRotation(element) {
    const computedStyle = window.getComputedStyle(element);
    const transform = computedStyle.transform;
    element.style.animation = '';  // Clear the animation
    element.style.transform = transform;  // Apply the last transformation state
}

// Handle mouse and keyboard events
const handleInteraction = async (element, isPressed) => {
    if (ctx.state !== "running") {
        await resumeAudio();
    }
    if (isPressed) {
        const randFreq = MIN_FREQ + Math.random() * (MAX_FREQ - MIN_FREQ);
        updateTone(randFreq, true, element);
        element.isPressed = true;
    } else {
        updateTone(null, false, element);
        element.isPressed = false;
    }
};

// Attach event listeners to elements
document.querySelectorAll('.letter').forEach(element => {
    element.addEventListener('mousedown', () => handleInteraction(element, true));
    element.addEventListener('mouseup', () => handleInteraction(element, false));
    element.addEventListener('mouseleave', () => handleInteraction(element, false));
});

document.addEventListener('keydown', (event) => {
    const letter = letterMap.get(event.key);
    if (letter && !letter.isPressed) {
        handleInteraction(letter, true);
    }
});

document.addEventListener('keyup', (event) => {
    const letter = letterMap.get(event.key);
    if (letter) {
        handleInteraction(letter, false);
    }
});

// Initialize the setup on first user interaction
document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('click', () => setupAudio(), { once: true });
});

// Add CSS keyframes for rotation
const styleSheet = document.createElement("style");
styleSheet.innerText = `
    @keyframes rotateAnimation {
        from { transform: rotate(0turn); }
        to { transform: rotate(1turn); }
    }
`;
document.head.appendChild(styleSheet);