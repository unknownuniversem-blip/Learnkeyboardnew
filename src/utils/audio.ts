import { SoundType } from '../types';

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  try {
    if (!audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        audioCtx = new AudioCtxClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  } catch {
    return null;
  }
}

/**
 * Play a synthesized mechanical keyboard keypress sound
 */
export function playKeySound(type: SoundType, volume: number = 0.5) {
  if (type === 'muted' || volume <= 0) return;

  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(volume * 0.4, now);
  masterGain.connect(ctx.destination);

  switch (type) {
    case 'cherry_blue': {
      // High pitch tactile click + bottom out thud
      const osc = ctx.createOscillator();
      const clickGain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1800, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.03);

      clickGain.gain.setValueAtTime(1, now);
      clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

      osc.connect(clickGain);
      clickGain.connect(masterGain);

      osc.start(now);
      osc.stop(now + 0.04);

      // Secondary low thud (switch bottoming out)
      const bufferSize = ctx.sampleRate * 0.02;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuffer;
      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'lowpass';
      noiseFilter.frequency.setValueAtTime(600, now);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.6, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.02);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(masterGain);

      noise.start(now + 0.005);
      break;
    }

    case 'cherry_brown': {
      // Soft tactile bump
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.04);

      gain.gain.setValueAtTime(0.8, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.045);

      osc.connect(gain);
      gain.connect(masterGain);

      osc.start(now);
      osc.stop(now + 0.05);
      break;
    }

    case 'cherry_red': {
      // Smooth linear quiet thud
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.03);

      gain.gain.setValueAtTime(0.7, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.035);

      osc.connect(gain);
      gain.connect(masterGain);

      osc.start(now);
      osc.stop(now + 0.04);
      break;
    }

    case 'typewriter': {
      // Metallic strike
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(2200, now);
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.05);

      gain.gain.setValueAtTime(0.9, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.connect(gain);
      gain.connect(masterGain);

      osc.start(now);
      osc.stop(now + 0.07);
      break;
    }
  }
}

/**
 * Play mistake sound when user makes a typing error
 */
export function playErrorSound(volume: number = 0.5) {
  const ctx = getAudioContext();
  if (!ctx || volume <= 0) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(140, now);
  osc.frequency.linearRampToValueAtTime(110, now + 0.08);

  gain.gain.setValueAtTime(volume * 0.35, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.1);
}

/**
 * Play triumphant fanfare when user passes exam cutoff
 */
export function playSuccessFanfare(volume: number = 0.5) {
  const ctx = getAudioContext();
  if (!ctx || volume <= 0) return;

  const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
  notes.forEach((freq, idx) => {
    const startTime = ctx.currentTime + idx * 0.08;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(volume * 0.3, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + 0.32);
  });
}

/**
 * Trigger Android haptic vibration feedback
 */
export function triggerHaptic(pattern: 'key' | 'error' | 'success') {
  if (typeof window !== 'undefined' && 'vibrate' in navigator) {
    try {
      if (pattern === 'key') {
        navigator.vibrate(10);
      } else if (pattern === 'error') {
        navigator.vibrate([30, 20, 30]);
      } else if (pattern === 'success') {
        navigator.vibrate([40, 30, 60, 30, 80]);
      }
    } catch {
      // Haptics might be blocked by browser policy
    }
  }
}
