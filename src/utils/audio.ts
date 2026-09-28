// Web Audio API synthesizer for sound effects without external audio assets

class SoundEffects {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private getContext(): AudioContext | null {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  playBlip() {
    if (!this.enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1400, ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {
      // Audio not permitted or failed
    }
  }

  playWarning() {
    if (!this.enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      osc.frequency.setValueAtTime(440, ctx.currentTime + 0.1);

      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } catch {
      // Audio not permitted
    }
  }

  playFanfare() {
    if (!this.enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.1);

        gain.gain.setValueAtTime(0.08, ctx.currentTime + i * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.1 + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + i * 0.1);
        osc.stop(ctx.currentTime + i * 0.1 + 0.35);
      });
    } catch {
      // Audio not permitted
    }
  }

  // Cartoonish playful laughing sound synthesis (Ha-Ha-Ha-Ha-Ha!)
  playLaugh() {
    if (!this.enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Play joyful fanfare chime first
      this.playFanfare();

      // Series of staccato laughter bursts ("Ha - Ha - Ha - Ha - Ha - Ha - Ha")
      const bursts = [
        { delay: 0.15, freq: 540, dur: 0.12 },
        { delay: 0.32, freq: 580, dur: 0.12 },
        { delay: 0.49, freq: 550, dur: 0.12 },
        { delay: 0.66, freq: 510, dur: 0.13 },
        { delay: 0.83, freq: 470, dur: 0.13 },
        { delay: 1.01, freq: 440, dur: 0.14 },
        { delay: 1.20, freq: 400, dur: 0.16 },
        { delay: 1.42, freq: 360, dur: 0.22 },
      ];

      bursts.forEach(({ delay, freq, dur }) => {
        const osc = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        // Bandpass filter to shape vowel formant like a human "Ha"
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(950, now + delay);
        filter.Q.setValueAtTime(3.0, now + delay);

        osc.type = 'sawtooth';
        osc2.type = 'triangle';

        // Frequency sweep downwards during each "ha"
        osc.frequency.setValueAtTime(freq, now + delay);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.75, now + delay + dur);

        osc2.frequency.setValueAtTime(freq * 1.5, now + delay);
        osc2.frequency.exponentialRampToValueAtTime(freq * 1.5 * 0.75, now + delay + dur);

        // Amplitude envelope: quick attack and natural decay
        gain.gain.setValueAtTime(0.001, now + delay);
        gain.gain.linearRampToValueAtTime(0.14, now + delay + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + delay + dur);

        osc.connect(filter);
        osc2.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + delay);
        osc2.start(now + delay);
        osc.stop(now + delay + dur);
        osc2.stop(now + delay + dur);
      });
    } catch {
      // Audio not permitted
    }
  }
}

export const sounds = new SoundEffects();
