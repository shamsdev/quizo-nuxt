/**
 * Game sound effects. Uses Web Audio API for instant feedback without requiring audio files.
 * Optionally plays from /sounds/{name}.mp3 if the file exists (add your own SFX for better feel).
 */

let audioContext: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (import.meta.server) return null;
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
}

async function ensureContext(): Promise<AudioContext | null> {
  const ctx = getContext();
  if (!ctx) return null;
  if (ctx.state === 'suspended') {
    await ctx.resume();
  }
  return ctx;
}

/** Play a short tone (frequency Hz, duration ms, volume 0–1, type). */
function playTone(
  frequency: number,
  durationMs: number,
  volume = 0.15,
  type: OscillatorType = 'sine'
): void {
  ensureContext().then((ctx) => {
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = type;
    osc.frequency.value = frequency;
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationMs / 1000);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + durationMs / 1000);
  });
}

export function useGameSounds() {
  return {
    playHover() {
      playTone(400, 40, 0.08, 'sine');
    },
    playClick() {
      playTone(600, 50, 0.12, 'sine');
    },
    playQuestion() {
      playTone(523, 120, 0.12, 'sine');
    },
    playTimeUp() {
      playTone(200, 200, 0.2, 'square');
    },
    playCorrect() {
      playTone(523, 80, 0.15, 'sine');
      setTimeout(() => playTone(659, 80, 0.15, 'sine'), 80);
      setTimeout(() => playTone(784, 120, 0.15, 'sine'), 160);
    },
    playWrong() {
      playTone(200, 150, 0.2, 'sawtooth');
      setTimeout(() => playTone(150, 200, 0.18, 'sawtooth'), 120);
    },
    playWin() {
      playTone(523, 100, 0.15, 'sine');
      setTimeout(() => playTone(659, 100, 0.15, 'sine'), 100);
      setTimeout(() => playTone(784, 100, 0.15, 'sine'), 200);
      setTimeout(() => playTone(1047, 250, 0.18, 'sine'), 300);
    },
    playLose() {
      playTone(300, 150, 0.18, 'sine');
      setTimeout(() => playTone(250, 200, 0.18, 'sine'), 150);
    },
    playDraw() {
      playTone(440, 100, 0.12, 'sine');
    },
    playReady() {
      playTone(440, 60, 0.1, 'sine');
    },
  };
}
