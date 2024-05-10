import { el } from 'https://cdn.jsdelivr.net/npm/@elemaudio/core@3.2.1/+esm';
import WebRenderer from 'https://cdn.jsdelivr.net/npm/@elemaudio/web-renderer@3.2.1/+esm';

const core = new WebRenderer();
const ctx = new AudioContext();
ctx.suspend();

// Main function to set up audio and interaction logic
async function setupAudio() {
    // ADSR envelope parameters
    const attack = 0.01, decay = 0.1, sustain = 0.5, release = 0.5;
    let gate = 0; // Start with gate closed

    // Initialize audio elements
    let freq = el.const({ "value": 440 });
    let osc = el.cycle(freq);
    let envelope = el.adsr(attack, decay, sustain, release, el.const({ "value": gate }));
    let output = el.mul(osc, envelope);

    // Function to resume audio context and initialize rendering
    async function resumeAudio() {
        await ctx.resume();
        const node = await core.initialize(ctx,
            { numberOfInputs: 0, numberOfOutputs: 1, outputChannelCount: [2] });
        node.connect(ctx.destination);
    }

    // Play or stop tone based on user interaction
    function updateTone(newFreq, openingGate, element) {
        gate = openingGate ? 1 : 0;
        envelope = el.adsr(attack, decay, sustain, release, el.const({ "value": gate }));
        freq = el.const({ "value": newFreq || 440 });
        osc = el.cycle(freq);
        output = el.mul(osc, envelope);
        core.render(output);

        if (openingGate) {
            startRotation(element, newFreq);
        } else {
            stopRotation(element);  // Stop rotation
        }
    }

    function getCurrentRotation(el) {
        const st = window.getComputedStyle(el, null);
        const tr = st.getPropertyValue("transform");
        // With matrix(a, b, c, d, e, f) compute rotation from matrix components
        const values = tr.split('(')[1].split(')')[0].split(',');
        const a = values[0];
        const b = values[1];
        // arc tangent of the quotient of the matrix coefficients
        const angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));
        // Convert degrees to turns
        return angle / 360;
    }

    // Start rotation using dynamically created CSS keyframes
    function startRotation(element, frequency) {
        const rotationDuration = 100 / frequency; // Calculate rotation duration inversely proportional to frequency
        const animationName = `rotateAnimation${frequency.toFixed(0)}`;
        const currentRotation = getCurrentRotation(element);

        if (!document.getElementById(animationName)) {
            const styleSheet = document.createElement("style");
            styleSheet.id = animationName;
            styleSheet.innerText = `
                @keyframes ${animationName} {
                    from { transform: rotate(${currentRotation}turn); }
                    to { transform: rotate(${currentRotation + 1}turn); }
                }
            `;
            document.head.appendChild(styleSheet);
        }

        element.style.animation = `${animationName} ${rotationDuration}s linear infinite forwards`;
    }

    // Stop rotation by clearing the animation style
    function stopRotation(element) {
        const computedStyle = window.getComputedStyle(element);
        const transform = computedStyle.transform;
        element.style.animation = '';  // Clear the animation
        element.style.transform = transform;  // Apply the last transformation state
    }

    // Attach event listeners to elements
    document.querySelectorAll('.letter').forEach(element => {
        element.addEventListener('mousedown', async () => {
            if (ctx.state !== "running") {
                await resumeAudio();
            }
            const randFreq = 220 + Math.random() * 660;
            updateTone(randFreq, true, element);
        });

        // Use a single function to handle both mouseup and mouseleave
        const handleMouseUpLeave = () => updateTone(null, false, element);
        element.addEventListener('mouseup', handleMouseUpLeave);
        element.addEventListener('mouseleave', handleMouseUpLeave);
    });
};

// Initialize the setup on first user interaction
document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('click', () => setupAudio(), { once: true });
});
