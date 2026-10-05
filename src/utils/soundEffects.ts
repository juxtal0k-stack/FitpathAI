// Lightweight, offline Web Audio API sound synthesizer
// Provides subtle audio cues for timers, rest reminders, and water drinking alerts without external MP3 files.

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

/**
 * Play an audible water reminder alarm buzzer (electronic multi-beep buzz)
 * Specifically engineered for the background water alarm process so it can be heard clearly.
 */
export function playWaterAlarmBuzzer() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Pulse 1: 0.0s to 0.12s (880Hz A5)
    // Pulse 2: 0.18s to 0.30s (880Hz A5)
    // Pulse 3: 0.36s to 0.52s (1046Hz C6 resonant chime)
    const pulses = [
      { start: 0, duration: 0.12, freq: 880, type: 'triangle' as OscillatorType },
      { start: 0.18, duration: 0.12, freq: 880, type: 'triangle' as OscillatorType },
      { start: 0.36, duration: 0.22, freq: 1046.5, type: 'sine' as OscillatorType },
      { start: 0.62, duration: 0.14, freq: 880, type: 'triangle' as OscillatorType },
      { start: 0.80, duration: 0.26, freq: 1174.66, type: 'sine' as OscillatorType },
    ];

    pulses.forEach(({ start, duration, freq, type }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, now + start);

      gain.gain.setValueAtTime(0.28, now + start);
      gain.gain.exponentialRampToValueAtTime(0.001, now + start + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + start);
      osc.stop(now + start + duration);
    });
  } catch {
    // AudioContext blocked or not allowed - ignore silently
  }
}

/**
 * Play a distinctive medical doctor visit alert buzzer (hospital medical monitor chime / alert tone)
 * Engineered for background doctor visit alerts to be clear, authoritative, and audible.
 */
export function playDoctorAlertBuzzer() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Harmonic medical alert chime: Two sets of dual high-low beeps
    const tones = [
      { start: 0, duration: 0.18, freq: 987.77, type: 'sine' as OscillatorType }, // B5
      { start: 0.22, duration: 0.28, freq: 1318.51, type: 'sine' as OscillatorType }, // E6
      { start: 0.55, duration: 0.18, freq: 987.77, type: 'sine' as OscillatorType }, // B5
      { start: 0.77, duration: 0.38, freq: 1318.51, type: 'sine' as OscillatorType }, // E6
      { start: 1.20, duration: 0.16, freq: 1567.98, type: 'triangle' as OscillatorType }, // G6
      { start: 1.40, duration: 0.40, freq: 1760.00, type: 'sine' as OscillatorType }, // A6
    ];

    tones.forEach(({ start, duration, freq, type }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, now + start);

      gain.gain.setValueAtTime(0.32, now + start);
      gain.gain.exponentialRampToValueAtTime(0.001, now + start + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + start);
      osc.stop(now + start + duration);
    });
  } catch {
    // AudioContext blocked or not allowed - ignore silently
  }
}

/**
 * Play a refreshing water droplet tone when water reminder alerts or when user logs water
 */
export function playWaterChime() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Pitch sweep mimicking a water droplet: starts low, rises rapidly, then drops
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(1400, now + 0.08);
    osc.frequency.exponentialRampToValueAtTime(900, now + 0.18);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.28);
  } catch {
    // AudioContext blocked or not allowed - ignore silently
  }
}

/**
 * Play a crisp starting chime when active exercise countdown begins
 */
export function playStartChime() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(523.25, now); // C5
    osc.frequency.setValueAtTime(659.25, now + 0.1); // E5

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.35);
  } catch {}
}

/**
 * Play a gentle two-tone rest chime when exercise set completes and rest reminder starts
 */
export function playRestChime() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    [
      { freq: 440, delay: 0 },
      { freq: 330, delay: 0.14 },
    ].forEach(({ freq, delay }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + delay);
      gain.gain.setValueAtTime(0.16, now + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + delay);
      osc.stop(now + delay + 0.3);
    });
  } catch {}
}

/**
 * Play an encouraging tone when rest ends and next set is ready, or workout is completed
 */
export function playFinishChime() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    [
      { freq: 523.25, delay: 0 },
      { freq: 659.25, delay: 0.12 },
      { freq: 783.99, delay: 0.24 },
    ].forEach(({ freq, delay }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + delay);
      gain.gain.setValueAtTime(0.15, now + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.28);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + delay);
      osc.stop(now + delay + 0.28);
    });
  } catch {}
}

/**
 * Calming harmonic audio synthesizer for 4-7-8 Breathing phases
 * Inhale: gentle rising 432Hz ambient chord
 * Hold: soft singing bowl sustain
 * Exhale: calming descending warm release
 * Complete: relaxing triple harmonic bell
 */
export function playBreathingChime(phase: 'inhale' | 'hold' | 'exhale' | 'complete') {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    if (phase === 'inhale') {
      // Gentle rising 396Hz to 528Hz Solfeggio frequencies
      const freqs = [396, 528];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.15);
        gain.gain.setValueAtTime(0.001, now + idx * 0.15);
        gain.gain.linearRampToValueAtTime(0.08, now + idx * 0.15 + 0.3);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.15 + 1.2);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.15);
        osc.stop(now + idx * 0.15 + 1.2);
      });
    } else if (phase === 'hold') {
      // Pure steady 432Hz calming tone
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(432, now);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.06, now + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 1.5);
    } else if (phase === 'exhale') {
      // Warm grounding descending tone (528 -> 396 -> 264 Hz)
      const freqs = [528, 396, 264];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);
        gain.gain.setValueAtTime(0.001, now + idx * 0.12);
        gain.gain.linearRampToValueAtTime(0.07, now + idx * 0.12 + 0.2);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 1.4);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 1.4);
      });
    } else if (phase === 'complete') {
      // Relaxing triple bell
      const freqs = [432, 540, 648];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.15);
        gain.gain.setValueAtTime(0.1, now + idx * 0.15);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.15 + 1.8);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.15);
        osc.stop(now + idx * 0.15 + 1.8);
      });
    }
  } catch {}
}
