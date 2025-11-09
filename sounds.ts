// This file contains programmatically generated sound effects for the game.
// They are generated as PCM data, encoded into WAV format, and then stored as base64 data URIs.
// This approach removes the need for external asset files, making the application self-contained.

// --- WAV Data URI Generation ---

// Helper to write a string to a DataView object
function writeString(view: DataView, offset: number, str: string) {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i));
  }
}

// Generates a base64 encoded WAV data URI from raw PCM audio data
function createWavDataUri(pcmData: Float32Array, sampleRate: number): string {
  const numChannels = 1;
  const bitsPerSample = 16;
  const blockAlign = numChannels * (bitsPerSample / 8);
  const byteRate = sampleRate * blockAlign;
  const dataSize = pcmData.length * (bitsPerSample / 8);
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  // RIFF header
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(view, 8, 'WAVE');

  // "fmt " sub-chunk
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // Audio format (1 = PCM)
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);

  // "data" sub-chunk
  writeString(view, 36, 'data');
  view.setUint32(40, dataSize, true);

  // Write the PCM data
  let offset = 44;
  for (let i = 0; i < pcmData.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, pcmData[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
  }

  // Convert buffer to base64 string
  const binary = Array.from(new Uint8Array(buffer)).map(byte => String.fromCharCode(byte)).join('');
  const base64 = btoa(binary);

  return `data:audio/wav;base64,${base64}`;
}


// --- Sound Synthesis Functions ---

const SAMPLE_RATE = 44100;

function createLaserSound(): string {
    const duration = 0.15;
    const numSamples = Math.floor(SAMPLE_RATE * duration);
    const pcmData = new Float32Array(numSamples);
    const startFreq = 880;
    const endFreq = 220;

    for (let i = 0; i < numSamples; i++) {
        const progress = i / numSamples;
        const freq = startFreq + (endFreq - startFreq) * progress * progress;
        const amplitude = (1 - progress) * 0.5;
        pcmData[i] = Math.sin(2 * Math.PI * i * freq / SAMPLE_RATE) * amplitude;
    }
    return createWavDataUri(pcmData, SAMPLE_RATE);
}

function createExplosionSound(): string {
    const duration = 0.5;
    const numSamples = Math.floor(SAMPLE_RATE * duration);
    const pcmData = new Float32Array(numSamples);

    for (let i = 0; i < numSamples; i++) {
        const progress = i / numSamples;
        const amplitude = Math.pow(1 - progress, 4) * 0.7;
        pcmData[i] = (Math.random() * 2 - 1) * amplitude;
    }
    return createWavDataUri(pcmData, SAMPLE_RATE);
}

function createThrustSound(): string {
    const duration = 1.0; // Loopable
    const numSamples = Math.floor(SAMPLE_RATE * duration);
    const pcmData = new Float32Array(numSamples);
    let lastOut = 0.0;
    for (let i = 0; i < numSamples; i++) {
        const white = Math.random() * 2 - 1;
        // Simple low-pass filter to create a "brown-ish" noise
        const brown = (lastOut + (0.02 * white)) / 1.02;
        lastOut = brown;
        pcmData[i] = brown * 3.5 * 0.2; // Adjust gain
    }
    return createWavDataUri(pcmData, SAMPLE_RATE);
}

function createNewLevelSound(): string {
    const noteDuration = 0.1;
    const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
    const numSamples = Math.floor(SAMPLE_RATE * noteDuration * notes.length);
    const pcmData = new Float32Array(numSamples);

    for (let n = 0; n < notes.length; n++) {
        const freq = notes[n];
        const startSample = Math.floor(n * noteDuration * SAMPLE_RATE);
        const endSample = Math.floor((n + 1) * noteDuration * SAMPLE_RATE);
        for (let i = startSample; i < endSample; i++) {
            const progress = (i - startSample) / (endSample - startSample);
            const amplitude = (1 - progress) * 0.4;
            pcmData[i] = Math.sin(2 * Math.PI * (i - startSample) * freq / SAMPLE_RATE) * amplitude;
        }
    }
    return createWavDataUri(pcmData, SAMPLE_RATE);
}

function createShieldSound(): string {
    const duration = 2.0; // Loopable
    const numSamples = Math.floor(SAMPLE_RATE * duration);
    const pcmData = new Float32Array(numSamples);
    const freq1 = 220; // A3
    const freq2 = 221; // Slightly detuned for a phasing effect
    const lfoFreq = 2; // For pulsing

    for (let i = 0; i < numSamples; i++) {
        const time = i / SAMPLE_RATE;
        const lfo = (Math.sin(2 * Math.PI * time * lfoFreq) + 1) / 2; // 0 to 1
        const amplitude = 0.15 + lfo * 0.1;
        const wave1 = Math.sin(2 * Math.PI * i * freq1 / SAMPLE_RATE);
        const wave2 = Math.sin(2 * Math.PI * i * freq2 / SAMPLE_RATE);
        pcmData[i] = (wave1 + wave2) * 0.5 * amplitude;
    }
    return createWavDataUri(pcmData, SAMPLE_RATE);
}

function createAmbientSound(): string {
    const duration = 5.0; // Loopable
    const numSamples = Math.floor(SAMPLE_RATE * duration);
    const pcmData = new Float32Array(numSamples);
    const freq = 55; // A1

    for (let i = 0; i < numSamples; i++) {
        pcmData[i] = Math.sin(2 * Math.PI * i * freq / SAMPLE_RATE) * 0.1;
    }
    return createWavDataUri(pcmData, SAMPLE_RATE);
}

// --- Exported Sound Data ---

export const sounds = {
    laser: createLaserSound(),
    thrust: createThrustSound(),
    explosion: createExplosionSound(),
    newLevel: createNewLevelSound(),
    shield: createShieldSound(),
    ambient: createAmbientSound()
};
