import { AUDIO_CONFIG } from './sound-letters/config.js';

const paramGroups = {
  'ADSR Settings': ['ADSR_SETTINGS.attack', 'ADSR_SETTINGS.decay', 'ADSR_SETTINGS.sustain', 'ADSR_SETTINGS.release'],
  'Harmonic Mix': ['HARMONIC_MIX.fundamental', 'HARMONIC_MIX.secondHarmonic', 'HARMONIC_MIX.thirdHarmonic'],
  'Attack Noise': ['ATTACK_NOISE.amount', 'ATTACK_NOISE.attack', 'ATTACK_NOISE.decay'],
  'Tine Resonance': ['TINE_RESONANCE.frequency', 'TINE_RESONANCE.q'],
  'Filter Settings': ['FILTER_SETTINGS.baseCutoff', 'FILTER_SETTINGS.velocitySensitivity', 'FILTER_SETTINGS.envelopeAmount'],
  'Stereo Settings': ['STEREO_SETTINGS.spread', 'STEREO_SETTINGS.delay'],
  'Chorus Settings': ['CHORUS_SETTINGS.rate', 'CHORUS_SETTINGS.depth', 'CHORUS_SETTINGS.mix'],
  'Other': ['INHARMONICS_AMOUNT', 'PICKUP_RESPONSE', 'AMPLITUDE', 'PANNING_AMOUNT']
};

const paramRanges = {
  'ADSR_SETTINGS.attack': { min: 0.001, max: 1, step: 0.001 },
  'ADSR_SETTINGS.decay': { min: 0.001, max: 2, step: 0.001 },
  'ADSR_SETTINGS.sustain': { min: 0, max: 1, step: 0.01 },
  'ADSR_SETTINGS.release': { min: 0.001, max: 5, step: 0.001 },
  'HARMONIC_MIX.fundamental': { min: 0, max: 1, step: 0.01 },
  'HARMONIC_MIX.secondHarmonic': { min: 0, max: 1, step: 0.01 },
  'HARMONIC_MIX.thirdHarmonic': { min: 0, max: 1, step: 0.01 },
  'INHARMONICS_AMOUNT': { min: 0, max: 0.1, step: 0.001 },
  'ATTACK_NOISE.amount': { min: 0, max: 0.5, step: 0.01 },
  'ATTACK_NOISE.attack': { min: 0.001, max: 0.1, step: 0.001 },
  'ATTACK_NOISE.decay': { min: 0.001, max: 0.5, step: 0.001 },
  'TINE_RESONANCE.frequency': { min: 0.5, max: 5, step: 0.1 },
  'TINE_RESONANCE.q': { min: 0.1, max: 10, step: 0.1 },
  'PICKUP_RESPONSE': { min: 0.1, max: 2, step: 0.1 },
  'FILTER_SETTINGS.baseCutoff': { min: 20, max: 2000, step: 10 },
  'FILTER_SETTINGS.velocitySensitivity': { min: 0, max: 1000, step: 10 },
  'FILTER_SETTINGS.envelopeAmount': { min: 0, max: 2000, step: 10 },
  'AMPLITUDE': { min: 0.1, max: 2, step: 0.1 },
  'STEREO_SETTINGS.spread': { min: 0, max: 0.5, step: 0.01 },
  'STEREO_SETTINGS.delay': { min: 0, max: 1, step: 0.01 },
  'CHORUS_SETTINGS.rate': { min: 0.1, max: 2, step: 0.1 },
  'CHORUS_SETTINGS.depth': { min: 0, max: 1, step: 0.01 },
  'CHORUS_SETTINGS.mix': { min: 0, max: 1, step: 0.01 },
  'PANNING_AMOUNT': { min: 0, max: 1, step: 0.01 },
};

function toTitleCase(str) {
  // Split the string by dots and get the last part
  const parts = str.split('.');
  const lastPart = parts[parts.length - 1];

  // Replace underscores with spaces
  let result = lastPart.replace(/_/g, ' ');

  // Add spaces before capital letters in camelCase and lowercase them
  result = result.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase();

  // Capitalize only the first word
  result = result.charAt(0).toUpperCase() + result.slice(1);

  return result;
}

function createSlider(param, value, range) {
  const container = document.createElement('div');
  container.className = 'param-slider';

  const label = document.createElement('label');
  label.textContent = toTitleCase(param.split('.').pop());
  label.title = param;
  label.htmlFor = param;

  const slider = document.createElement('input');
  slider.type = 'range';
  slider.id = param;
  slider.min = range.min;
  slider.max = range.max;
  slider.step = range.step;
  slider.value = value;

  const valueDisplay = document.createElement('span');
  valueDisplay.textContent = value.toFixed(2);

  slider.addEventListener('input', (e) => {
    const newValue = parseFloat(e.target.value);
    updateAudioConfig(param, newValue);
    valueDisplay.textContent = newValue.toFixed(2);
  });

  container.appendChild(label);
  container.appendChild(slider);
  container.appendChild(valueDisplay);

  return container;
}

function updateAudioConfig(param, value) {
  const path = param.split('.');
  let current = AUDIO_CONFIG;
  for (let i = 0; i < path.length - 1; i++) {
    current = current[path[i]];
  }
  current[path[path.length - 1]] = value;

  // Dispatch a custom event when a parameter changes
  window.dispatchEvent(new CustomEvent('audio-param-changed'));
}

function randomizeParams() {
  for (const [param, range] of Object.entries(paramRanges)) {
    const randomValue = Math.random() * (range.max - range.min) + range.min;
    const roundedValue = Number(randomValue.toFixed(2));
    updateAudioConfig(param, roundedValue);
    
    // Update slider and display
    const slider = document.getElementById(param);
    const valueDisplay = slider.nextElementSibling;
    slider.value = roundedValue;
    valueDisplay.textContent = roundedValue.toFixed(2);
  }
  
  // Dispatch event to update audio
  window.dispatchEvent(new CustomEvent('audio-param-changed'));
}

function initGUI() {
  const container = document.getElementById('audio-params-controls');
  const infoContent = document.getElementById('info-content');
  const audioParamsGui = document.getElementById('audio-params-gui');
  const toggleButton = document.getElementById('audio-params-toggle');
  const randomizeButton = document.getElementById('randomize-params');

  for (const [groupName, params] of Object.entries(paramGroups)) {
    const groupContainer = document.createElement('div');
    groupContainer.className = 'param-group';

    const groupTitle = document.createElement('h3');
    groupTitle.textContent = toTitleCase(groupName);
    groupContainer.appendChild(groupTitle);

    for (const param of params) {
      const path = param.split('.');
      let value = AUDIO_CONFIG;
      for (const key of path) {
        value = value[key];
      }
      const slider = createSlider(param, value, paramRanges[param]);
      groupContainer.appendChild(slider);
    }

    container.appendChild(groupContainer);
  }

  toggleButton.addEventListener('click', () => {
    if (audioParamsGui.style.display === 'none') {
      infoContent.style.display = 'none';
      audioParamsGui.style.display = 'block';
    } else {
      infoContent.style.display = 'block';
      audioParamsGui.style.display = 'none';
    }
  });

  randomizeButton.addEventListener('click', randomizeParams);
}

document.addEventListener('DOMContentLoaded', initGUI);