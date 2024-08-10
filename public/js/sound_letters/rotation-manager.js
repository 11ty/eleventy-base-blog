import { AUDIO_CONFIG } from './config.js';

export class RotationManager {
    constructor() {
        this.rotationSettings = AUDIO_CONFIG.ROTATION_SETTINGS;
        this.rotatingElements = new Map();
        this.animationFrame = null;
    }

    applyRotation(element, normalizedFreq) {
        const { maxSpeed, friction, minSpeed } = this.rotationSettings;
        const rotationSpeed = normalizedFreq * maxSpeed;
        const spinDirection = Math.random() < 0.5 ? 1 : -1;
        const existingRotation = parseFloat(element.style.getPropertyValue('--rotation')) || 0;

        this.rotatingElements.set(element, {
            angularVelocity: rotationSpeed * spinDirection,
            rotation: existingRotation,
        });

        element.classList.add('spinning');
        element.isPressed = true;

        if (!this.animationFrame) {
            this.animationFrame = requestAnimationFrame(this.updateRotations.bind(this));
        }
    }

    updateRotations(timestamp) {
        this.rotatingElements.forEach((data, element) => {
            if (!element.isPressed && Math.abs(data.angularVelocity) < this.rotationSettings.minSpeed) {
                element.classList.remove('spinning');
                this.rotatingElements.delete(element);
                return;
            }

            const deltaTime = (timestamp - (data.lastTimestamp || timestamp)) / 1000;
            data.lastTimestamp = timestamp;

            data.angularVelocity *= element.isPressed ? 1 : Math.pow(this.rotationSettings.friction, deltaTime * 60);

            const normalizedSpeed = Math.abs(data.angularVelocity) / this.rotationSettings.maxSpeed;
            const fontWeight = Math.max(400, Math.min(700, 400 + normalizedSpeed * 300));

            data.rotation += data.angularVelocity * deltaTime;
            element.style.setProperty('--font-weight', fontWeight);
            element.style.setProperty('--rotation', data.rotation);
        });

        if (this.rotatingElements.size > 0) {
            this.animationFrame = requestAnimationFrame(this.updateRotations.bind(this));
        } else {
            this.animationFrame = null;
        }
    }

    stopRotation(element) {
        element.isPressed = false;
    }

    cleanup() {
        this.rotatingElements.forEach((data, element) => {
            element.style.removeProperty('--rotation');
            element.style.removeProperty('--font-weight');
        });
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        this.rotatingElements.clear();
    }
}
