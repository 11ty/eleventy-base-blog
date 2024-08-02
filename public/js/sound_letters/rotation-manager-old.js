// RotationManager.js
import { AUDIO_CONFIG } from './config.js';

export class RotationManager {
    constructor() {
        this.rotationSettings = AUDIO_CONFIG.ROTATION_SETTINGS;
        this.animationFrames = new Map();
    }

    applyRotation(element, normalizedFreq) {
        if (this.animationFrames.has(element)) {
            cancelAnimationFrame(this.animationFrames.get(element));
        }

        element.isPressed = true;
        element.classList.add('spinning');
        const { maxSpeed, friction, minSpeed } = this.rotationSettings;
        const rotationSpeed = normalizedFreq * maxSpeed;
        const spinDirection = Math.random() < 0.5 ? 1 : -1;

        let angularVelocity = rotationSpeed * spinDirection;
        let lastTimestamp = performance.now();

        const animate = (timestamp) => {
            const deltaTime = (timestamp - lastTimestamp) / 1000;
            lastTimestamp = timestamp;

            if (!element.isPressed && Math.abs(angularVelocity) < minSpeed) {
                element.classList.remove('spinning');
                this.animationFrames.delete(element);
                return;
            }

            angularVelocity *= element.isPressed ? 1 : Math.pow(friction, deltaTime * 60);
            element.rotation = (element.rotation || 0) + angularVelocity * deltaTime;
            element.style.transform = `rotate(${element.rotation}deg)`;

            this.animationFrames.set(element, requestAnimationFrame(animate));
        };

        this.animationFrames.set(element, requestAnimationFrame(animate));
    }

    stopRotation(element) {
        element.isPressed = false;
    }
}
