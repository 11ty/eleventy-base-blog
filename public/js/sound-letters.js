// SoundLetters.js
import { AudioEngine } from "./sound_letters/audio-engine.js";
import { FrequencyManager } from "./sound_letters/frequency-manager.js";
import { VoiceManager } from "./sound_letters/voice-manager.js";
import { RotationManager } from "./sound_letters/rotation-manager.js";

class SoundLetters {
	constructor() {
		this.audioEngine = new AudioEngine();
		this.frequencyManager = new FrequencyManager();
		this.voiceManager = new VoiceManager(
			this.audioEngine,
			this.frequencyManager,
		);
		this.rotationManager = new RotationManager();
		this.letterMap = new Map();
		this.isChatInputActive = false;

		this.initializeLetters();
		this.addEventListeners();
	}

	initializeLetters() {
		document.querySelectorAll(".letter").forEach((element, index) => {
			const key = element.textContent.toLowerCase();
			element.isPressed = false;
			element.rotation = parseFloat(element.dataset.rotation) || 0;
			this.letterMap.set(key, { element, index });
		});
	}

	addEventListeners() {
		document.querySelectorAll(".letter").forEach((element) => {
			element.addEventListener("mousedown", (e) => {
				// Only respond to left-clicks
				if (e.button === 0) {
					this.handleInteraction(element, true);
				}
			});
			element.addEventListener("mouseup", () =>
				this.handleInteraction(element, false),
			);
			element.addEventListener("mouseleave", () => {
				if (element.isPressed) this.handleInteraction(element, false);
			});

			// New touch events
			element.addEventListener(
				"touchstart",
				(e) => {
					e.preventDefault();
					this.handleInteraction(element, true);
				},
				{ passive: true },
			);
			element.addEventListener(
				"touchend",
				(e) => {
					e.preventDefault();
					this.handleInteraction(element, false);
				},
				{ passive: true },
			);
			element.addEventListener(
				"touchcancel",
				(e) => {
					e.preventDefault();
					if (element.isPressed) this.handleInteraction(element, false);
				},
				{ passive: true },
			);
		});

		// Combine focusin and focusout event listeners
		document.addEventListener("focusin", this.handleChatInputFocus.bind(this));
		document.addEventListener("focusout", this.handleChatInputFocus.bind(this));

		// Modify the keydown and keyup event listeners
		document.addEventListener("keydown", this.handleKey.bind(this));
		document.addEventListener("keyup", this.handleKey.bind(this));
	}

	handleChatInputFocus(event) {
		if (event.target.id === "user-input") {
			const isActive = event.type === "focusin";
			document.body.classList.toggle("chat-input-active", isActive);
			this.isChatInputActive = isActive;
		}
	}

	handleKey(event) {
		if (!this.isChatInputActive) {
			event.type === "keydown"
				? this.handleKeyDown(event)
				: this.handleKeyUp(event);
		}
	}

	async handleInteraction(element, isPressed) {
		if (this.isChatInputActive) return;

		await this.initializeAudio();
		const key = element.textContent.toLowerCase();
		if (isPressed && !element.isPressed) {
			const normalizedFreq = this.voiceManager.allocateVoice(key);
			this.rotationManager.applyRotation(element, normalizedFreq);
		} else if (!isPressed) {
			this.voiceManager.releaseVoice(key);
			this.rotationManager.stopRotation(element);
		}
		this.voiceManager.renderActiveVoices();
	}

	handleKeyDown(event) {
		const letter = this.letterMap.get(event.key);
		if (letter && !letter.element.isPressed) {
			this.handleInteraction(letter.element, true);
		}
	}

	handleKeyUp(event) {
		const letter = this.letterMap.get(event.key);
		if (letter && letter.element.isPressed) {
			this.handleInteraction(letter.element, false);
		}
	}

	async initializeAudio() {
		if (!this.audioEngine.isInitialized) {
			await this.audioEngine.initialize();
		}
	}
}

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
	new SoundLetters();
});
