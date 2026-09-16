// Web Audio API MapleStory-inspired Relaxing Cozy Chiptune/Lofi Synth & Game SFX
// Zero external audio assets required. High reliability and instant response.

class CozyBgmPlayer {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private timerId: number | null = null;
  private masterGain: GainNode | null = null;
  private noteIndex = 0;
  private onStateChangeCb: ((playing: boolean) => void) | null = null;

  private getAudioContext(): AudioContext | null {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Soothing, nostalgic chord arpeggios reminiscent of Henesys / Lith Harbor peaceful afternoon
  private readonly melodyNotes = [
    // Bar 1 - C major 7 warm morning
    { note: 261.63, dur: 0.4 }, // C4
    { note: 329.63, dur: 0.4 }, // E4
    { note: 392.00, dur: 0.4 }, // G4
    { note: 493.88, dur: 0.7 }, // B4
    { note: 523.25, dur: 0.4 }, // C5
    { note: 392.00, dur: 0.5 }, // G4

    // Bar 2 - A minor 7 cozy shade
    { note: 220.00, dur: 0.4 }, // A3
    { note: 329.63, dur: 0.4 }, // E4
    { note: 392.00, dur: 0.4 }, // G4
    { note: 440.00, dur: 0.6 }, // A4
    { note: 523.25, dur: 0.4 }, // C5
    { note: 440.00, dur: 0.5 }, // A4

    // Bar 3 - F major 7 green pasture
    { note: 174.61, dur: 0.4 }, // F3
    { note: 261.63, dur: 0.4 }, // C4
    { note: 329.63, dur: 0.4 }, // E4
    { note: 349.23, dur: 0.6 }, // F4
    { note: 392.00, dur: 0.4 }, // G4
    { note: 329.63, dur: 0.5 }, // E4

    // Bar 4 - G suspended warm sunset
    { note: 196.00, dur: 0.4 }, // G3
    { note: 293.66, dur: 0.4 }, // D4
    { note: 392.00, dur: 0.4 }, // G4
    { note: 440.00, dur: 0.4 }, // A4
    { note: 493.88, dur: 0.6 }, // B4
    { note: 392.00, dur: 0.6 }, // G4

    // Bar 5 - E minor 7 floating leaf
    { note: 164.81, dur: 0.4 }, // E3
    { note: 246.94, dur: 0.4 }, // B3
    { note: 329.63, dur: 0.4 }, // E4
    { note: 392.00, dur: 0.6 }, // G4
    { note: 493.88, dur: 0.4 }, // B4
    { note: 392.00, dur: 0.5 }, // G4

    // Bar 6 - D minor 9 gentle stream
    { note: 146.83, dur: 0.4 }, // D3
    { note: 220.00, dur: 0.4 }, // A3
    { note: 261.63, dur: 0.4 }, // C4
    { note: 329.63, dur: 0.6 }, // E4
    { note: 349.23, dur: 0.4 }, // F4
    { note: 261.63, dur: 0.5 }, // C4

    // Bar 7 - G dominant campfire spark
    { note: 196.00, dur: 0.4 }, // G3
    { note: 293.66, dur: 0.4 }, // D4
    { note: 349.23, dur: 0.4 }, // F4
    { note: 392.00, dur: 0.5 }, // G4
    { note: 523.25, dur: 0.5 }, // C5
    { note: 493.88, dur: 0.6 }, // B4

    // Bar 8 - C major resolved smile
    { note: 261.63, dur: 0.5 }, // C4
    { note: 329.63, dur: 0.5 }, // E4
    { note: 392.00, dur: 0.5 }, // G4
    { note: 523.25, dur: 1.0 }, // C5
    { note: 0, dur: 0.5 },      // Rest
  ];

  public subscribe(cb: (playing: boolean) => void) {
    this.onStateChangeCb = cb;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  public start() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      this.masterGain = ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.08, ctx.currentTime);
      this.masterGain.connect(ctx.destination);

      this.isPlaying = true;
      this.noteIndex = 0;
      if (this.onStateChangeCb) this.onStateChangeCb(true);

      this.scheduleNextNote();
    } catch {
      this.isPlaying = false;
      if (this.onStateChangeCb) this.onStateChangeCb(false);
    }
  }

  private scheduleNextNote = () => {
    if (!this.isPlaying || !this.ctx || !this.masterGain) return;

    const current = this.melodyNotes[this.noteIndex];
    if (current.note > 0) {
      this.playPluck(current.note, current.dur);
    }

    this.noteIndex = (this.noteIndex + 1) % this.melodyNotes.length;
    const stepDurationMs = Math.max(280, current.dur * 850);
    this.timerId = window.setTimeout(this.scheduleNextNote, stepDurationMs);
  };

  private playPluck(freq: number, dur: number) {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now);

    const sub = this.ctx.createOscillator();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(freq * 0.5, now);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, now);
    filter.frequency.exponentialRampToValueAtTime(450, now + dur);

    const noteGain = this.ctx.createGain();
    noteGain.gain.setValueAtTime(0.001, now);
    noteGain.gain.linearRampToValueAtTime(0.7, now + 0.04);
    noteGain.gain.exponentialRampToValueAtTime(0.001, now + dur);

    osc.connect(filter);
    sub.connect(filter);
    filter.connect(noteGain);
    noteGain.connect(this.masterGain);

    osc.start(now);
    sub.start(now);
    osc.stop(now + dur + 0.05);
    sub.stop(now + dur + 0.05);
  }

  public stop() {
    this.isPlaying = false;
    if (this.timerId !== null) {
      window.clearTimeout(this.timerId);
      this.timerId = null;
    }
    if (this.masterGain && this.ctx) {
      try {
        this.masterGain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);
      } catch {
        // Safe fallback
      }
    }
    if (this.onStateChangeCb) this.onStateChangeCb(false);
  }

  // Authentic MapleStory SFX Generators
  public playBowShoot() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Bowstring twang + swift arrow flight whoosh
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.14);

      gain.gain.setValueAtTime(0.28, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.15);
    } catch {
      // Audio failure safe
    }
  }

  public playAttackSlash() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Sword slash whoosh: white noise through moving bandpass + quick sine pitch drop
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.12);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.13);
    } catch {
      // Audio failure safe
    }
  }

  public playHitSound(critical = false) {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = critical ? 'sawtooth' : 'triangle';
      osc.frequency.setValueAtTime(critical ? 380 : 260, now);
      osc.frequency.exponentialRampToValueAtTime(90, now + 0.15);

      gain.gain.setValueAtTime(critical ? 0.35 : 0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.16);
    } catch {
      // safe
    }
  }

  public playMonsterDefeat() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Cute comical poof
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.linearRampToValueAtTime(120, now + 0.2);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.26);
    } catch {
      // safe
    }
  }

  public playItemDrop() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Maple drop bounce: double blip
      [0, 0.08].forEach((offset, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(idx === 0 ? 800 : 950, now + offset);
        gain.gain.setValueAtTime(0.15, now + offset);
        gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.07);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + offset);
        osc.stop(now + offset + 0.08);
      });
    } catch {
      // safe
    }
  }

  public playItemPickup() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Iconic Maple pickup ding: C6 -> G6 sparkle
      const notes = [1046.5, 1318.51, 1567.98];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.04);
        gain.gain.setValueAtTime(0.2, now + idx * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.04 + 0.12);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.04);
        osc.stop(now + idx * 0.04 + 0.13);
      });
    } catch {
      // safe
    }
  }

  public playInventoryToggle() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.1);
    } catch {
      // safe
    }
  }

  public playJumpSound() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(250, now);
      osc.frequency.exponentialRampToValueAtTime(520, now + 0.1);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.11);
    } catch {
      // safe
    }
  }
}

export const bgmPlayer = new CozyBgmPlayer();
