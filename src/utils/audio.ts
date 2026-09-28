// Web Audio API synthesizer for sound effects without external audio assets

class SoundEffects {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private async getContextReady(): Promise<AudioContext | null> {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      try {
        await this.ctx.resume();
      } catch {
        // audio resumption handled gracefully
      }
    }
    return this.ctx;
  }

  async playBlip() {
    if (!this.enabled) return;
    try {
      const ctx = await this.getContextReady();
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

  async playWarning() {
    if (!this.enabled) return;
    try {
      const ctx = await this.getContextReady();
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

  async playFanfare() {
    if (!this.enabled) return;
    try {
      const ctx = await this.getContextReady();
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
  async playLaugh() {
    if (!this.enabled) return;
    try {
      const ctx = await this.getContextReady();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Play joyful fanfare chime first
      this.playFanfare();

      // Series of rhythmic laughing bursts ("Hee-Hee-Hee! Ha-Ha-Ha-Ha-Ha!")
      const bursts = [
        // Quick opening chuckle
        { delay: 0.12, freq: 580, dur: 0.11, gainVal: 0.15 },
        { delay: 0.26, freq: 620, dur: 0.11, gainVal: 0.16 },
        { delay: 0.40, freq: 590, dur: 0.11, gainVal: 0.16 },
        // Belly laugh bursts
        { delay: 0.56, freq: 540, dur: 0.13, gainVal: 0.18 },
        { delay: 0.72, freq: 500, dur: 0.13, gainVal: 0.18 },
        { delay: 0.88, freq: 460, dur: 0.14, gainVal: 0.17 },
        { delay: 1.05, freq: 420, dur: 0.14, gainVal: 0.16 },
        // Ending snicker & chuckle
        { delay: 1.24, freq: 480, dur: 0.12, gainVal: 0.15 },
        { delay: 1.40, freq: 440, dur: 0.13, gainVal: 0.14 },
        { delay: 1.60, freq: 380, dur: 0.20, gainVal: 0.13 },
      ];

      bursts.forEach(({ delay, freq, dur, gainVal }) => {
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        // Bandpass filter to shape vowel formant like a human voice laughing
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1050, now + delay);
        filter.Q.setValueAtTime(2.5, now + delay);

        osc1.type = 'sawtooth';
        osc2.type = 'triangle';

        // Frequency sweep downwards during each "ha"
        osc1.frequency.setValueAtTime(freq, now + delay);
        osc1.frequency.exponentialRampToValueAtTime(freq * 0.74, now + delay + dur);

        osc2.frequency.setValueAtTime(freq * 1.5, now + delay);
        osc2.frequency.exponentialRampToValueAtTime(freq * 1.5 * 0.74, now + delay + dur);

        // Amplitude envelope: quick attack and natural laughter decay
        gain.gain.setValueAtTime(0.0001, now + delay);
        gain.gain.linearRampToValueAtTime(gainVal, now + delay + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + dur);

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc1.start(now + delay);
        osc2.start(now + delay);
        osc1.stop(now + delay + dur);
        osc2.stop(now + delay + dur);
      });
    } catch {
      // Audio not permitted or failed
    }
  }
}

export const sounds = new SoundEffects();
