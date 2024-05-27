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
    element.rotation = parseFloat(element.dataset.rotation) || 0;
    letterMap.set(key, { element });
});

// Function to resume audio context and initialize rendering
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

// Render the synth voice
function renderSynthVoice({ key, freq, gate }) {
    const gateSignal = el.const({ key: `${key}:gate`, value: gate });
    const env = el.smooth(el.tau2pole(0.2), gateSignal);

    const freq1 = el.const({ key: `${key}:freq:1`, value: freq });
    const freq2 = el.const({ key: `${key}:freq:2`, value: freq * 1.005 });

    return el.mul(
        0.2,
        env,
        el.add(el.blepsaw(freq1), el.blepsaw(freq2))
    );
}

// Play or stop tone based on user interaction
function startVoice(key, newFreq, element) {
    const voiceState = { key, freq: newFreq || 440, gate: 1 };
    const output = renderSynthVoice(voiceState);
    activeVoices.set(key, output);
    // startRotation(element, newFreq);
    applyContinuousRotation(element, newFreq); // Start rotation with frequency
}

function stopVoice(key, element) {
    const voiceState = { key, freq: 0, gate: 0 };
    renderSynthVoice(voiceState);
    activeVoices.delete(key);
    // stopRotation(element);
    element.isPressed = false;  // Ensure we mark it as not pressed to stop rotation
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
        core.render(el.const({ "value": 0 }), el.const({ "value": 0 })); // Render silence if no active voices
    }
}

// Function to apply continuous rotation based on frequency
function applyContinuousRotation(element, frequency) {
    element.isPressed = true;  // Mark element as pressed for continued rotation
    const rotationSpeed = frequency / 220; // Base rotation on frequency (220 is the base frequency)

    let lastTimestamp = null;
    function step(timestamp) {
        if (!lastTimestamp) lastTimestamp = timestamp;
        const elapsed = timestamp - lastTimestamp;

        if (element.isPressed) {
            element.rotation += (elapsed / 1000) * 360 * rotationSpeed; // Rotate proportionally to frequency
            element.style.transform = `rotate(${element.rotation}deg)`;
            lastTimestamp = timestamp; // Update lastTimestamp for next frame
            requestAnimationFrame(step); // Continue the rotation
        }
    }
    requestAnimationFrame(step); // Start the rotation animation
}

// Handle mouse and keyboard events
const handleInteraction = async (element, isPressed) => {
    await initializeAudio();
    // if (isPressed) {
    if (isPressed && !element.isPressed) {
        const randFreq = MIN_FREQ + Math.random() * (MAX_FREQ - MIN_FREQ);
        updateTone(randFreq, true, element);
    } else {
        if (element.isPressed) {
            updateTone(null, false, element);
            element.isPressed = false; // Ensure we stop rotation
        }
    }
};

// Attach event listeners to elements
document.querySelectorAll('.letter').forEach(element => {
    element.addEventListener('mousedown', () => handleInteraction(element, true));
    element.addEventListener('mouseup', () => handleInteraction(element, false));
    element.addEventListener('mouseleave', () => {
        if (element.isPressed) { // Ensure release only if previously pressed inside
            handleInteraction(element, false);
        }
    });

    // element.addEventListener('mouseenter', () => {
    //     if (element.isPressed) { // Ensure re-engagement on entering back
    //         handleInteraction(element, false);
    //         handleInteraction(element, true);
    //     }
    // });
});

const handleKeypress = async (event, isPressed) => {
    const letter = letterMap.get(event.key);
    if (letter && (!isPressed || (isPressed && !letter.element.isPressed))) {
        await handleInteraction(letter.element, isPressed);
    }
};

document.addEventListener('keydown', event => handleKeypress(event, true));
document.addEventListener('keyup', event => handleKeypress(event, false));

// Initialize the setup on first user interaction
document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('click', () => initializeAudio(), { once: true });
});
