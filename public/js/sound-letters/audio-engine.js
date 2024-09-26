// AudioEngine.js
import { el } from "https://cdn.jsdelivr.net/npm/@elemaudio/core@4.0.0-alpha.6/+esm";
import WebRenderer from "https://cdn.jsdelivr.net/npm/@elemaudio/web-renderer@4.0.0-alpha.6/+esm";
import { AUDIO_CONFIG, SAMPLE_RATE } from "./config.js";
export class AudioEngine {
	static instance = null;

	constructor() {
		this.isInitialized = false;
		this.core = new WebRenderer();
		this.ctx = new AudioContext({ latencyHint: "interactive" });
		this.initializePromise = null;
		this.node = null;
	}

	async initialize() {
		if (this.isInitialized) return;

		if (!this.initializePromise) {
			this.initializePromise = this._initialize();
		}
		return this.initializePromise;
	}

	async _initialize() {
		try {
			await this.ensureAudioContext();

			if (!this.node) {
				this.node = await this.core.initialize(this.ctx, {
					numberOfInputs: 1,
					numberOfOutputs: 1,
					outputChannelCount: [2],
				});
				this.node.connect(this.ctx.destination);
			}

			this.isInitialized = true;
			console.log("Audio engine initialized and connected 🎶");
		} catch (error) {
			console.error("Failed to initialize audio engine:", error);
			throw error;
		}
	}

	async ensureAudioContext() {
		if (this.ctx.state === "suspended") {
			await this.ctx.resume();
		}
	}

	renderSynthVoice({ key, freq, gate, velocity, position }) {
		const smoothGate = el.smooth(
			0.005,
			el.const({ key: `${key}:gate`, value: gate }),
		);

		// Softer ADSR envelope
		const { attack, decay, sustain, release } = AUDIO_CONFIG.ADSR_SETTINGS;
		const env = el.adsr(attack, decay, sustain, release, smoothGate);

		// Tine and tone bar mechanism simulation
		const fundamental = el.cycle(freq);
		const secondHarmonic = el.cycle(el.mul(freq, 2));
		const thirdHarmonic = el.cycle(el.mul(freq, 3));

		// Mix harmonics with decreasing amplitudes
		const harmonics = el.add(
			el.mul(fundamental, AUDIO_CONFIG.HARMONIC_MIX.fundamental),
			el.mul(secondHarmonic, AUDIO_CONFIG.HARMONIC_MIX.secondHarmonic),
			el.mul(thirdHarmonic, AUDIO_CONFIG.HARMONIC_MIX.thirdHarmonic)
		);

		// Simulate inharmonic overtones (very subtle)
		const inharmonics = el.mul(el.noise(), AUDIO_CONFIG.INHARMONICS_AMOUNT);

		// Softer attack characteristics
		const attackNoise = el.mul(
			el.noise(),
			el.adsr(AUDIO_CONFIG.ATTACK_NOISE.attack, AUDIO_CONFIG.ATTACK_NOISE.decay, 0, AUDIO_CONFIG.ATTACK_NOISE.decay, smoothGate),
		);

		// Tine resonance using SVF (softer resonance)
		const tineResonance = el.svf(
			el.mul(freq, AUDIO_CONFIG.TINE_RESONANCE.frequency),
			AUDIO_CONFIG.TINE_RESONANCE.q,
			harmonics
		);

		// Combine tine, harmonics, and inharmonics
		const rawTone = el.add(
			el.mul(harmonics, 0.7),
			el.mul(tineResonance, 0.2),
			inharmonics,
			el.mul(attackNoise, AUDIO_CONFIG.ATTACK_NOISE.amount)
		);

		// Softer pickup nonlinearity simulation
		const pickupResponse = el.tanh(el.mul(rawTone, AUDIO_CONFIG.PICKUP_RESPONSE));

		// Dynamic filtering (softer brightness)
		const velocityBrightness = el.mul(velocity, AUDIO_CONFIG.FILTER_SETTINGS.velocitySensitivity);
		const filterEnv = el.mul(env, AUDIO_CONFIG.FILTER_SETTINGS.envelopeAmount);
		const filterCutoff = el.add(AUDIO_CONFIG.FILTER_SETTINGS.baseCutoff, velocityBrightness, filterEnv);
		const filteredTone = el.svf(filterCutoff, 0.7, pickupResponse);

		// Amplitude envelope
		const ampEnv = el.mul(env, el.mul(velocity, AUDIO_CONFIG.AMPLITUDE));

		// Apply amplitude envelope
		const voiceOutput = el.mul(filteredTone, ampEnv);

		// Stereo widening (subtle)
		const stereoSpread = el.mul(AUDIO_CONFIG.STEREO_SETTINGS.spread, el.sub(position, 0.5));
		const leftDelay = el.delay(
			{ size: 100 },
			el.mul(stereoSpread, -1),
			AUDIO_CONFIG.STEREO_SETTINGS.delay,
			voiceOutput
		);
		const rightDelay = el.delay({ size: 100 }, stereoSpread, AUDIO_CONFIG.STEREO_SETTINGS.delay, voiceOutput);

		// Chorus effect (very subtle)
		const chorusDelay = el.add(
			5,
			el.mul(el.cycle(AUDIO_CONFIG.CHORUS_SETTINGS.rate), AUDIO_CONFIG.CHORUS_SETTINGS.depth)
		);
		const leftChorus = el.delay({ size: SAMPLE_RATE }, chorusDelay, AUDIO_CONFIG.CHORUS_SETTINGS.mix, leftDelay);
		const rightChorus = el.delay({ size: SAMPLE_RATE }, chorusDelay, AUDIO_CONFIG.CHORUS_SETTINGS.mix, rightDelay);

		// Final output with slight panning
		const pan = el.mul(el.sub(position, 0.5), AUDIO_CONFIG.PANNING_AMOUNT);
		const leftChannel = el.mul(leftChorus, el.sub(1, pan));
		const rightChannel = el.mul(rightChorus, el.add(1, pan));

		return [leftChannel, rightChannel];
	}

	render(outputs) {
		if (!this.isInitialized) {
			console.warn("AudioEngine not initialized. Call initialize() first.");
			return;
		}

		if (outputs.length > 0) {
			const leftOutputs = outputs.map((output) => output[0]);
			const rightOutputs = outputs.map((output) => output[1]);

			const combinedLeft = el.add(...leftOutputs);
			const combinedRight = el.add(...rightOutputs);

			const gainReduction = el.div(
				1,
				el.add(
					1,
					el.mul(0.1, el.const({ key: "voiceCount", value: outputs.length })),
				),
			);

			const limitedLeft = el.tanh(el.mul(combinedLeft, gainReduction));
			const limitedRight = el.tanh(el.mul(combinedRight, gainReduction));

			this.core.render(limitedLeft, limitedRight);
		} else {
			this.core.render(el.const({ value: 0 }), el.const({ value: 0 }));
		}
	}
}
