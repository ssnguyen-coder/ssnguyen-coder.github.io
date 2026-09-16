// Looping extracted background music plus synthesized game sound effects.
class CozyBgmPlayer {
  private ctx: AudioContext | null = null;
  // This is the user's enabled preference, even while autoplay is blocked.
  private isPlaying = true;
  private music: HTMLAudioElement | null = null;
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

  public subscribe(cb: (playing: boolean) => void) {
    this.onStateChangeCb = cb;
    cb(this.isPlaying);
    return () => { if (this.onStateChangeCb === cb) this.onStateChangeCb = null; };
  }

  public getIsPlaying(): boolean { return this.isPlaying; }

  private tryPlayback = () => {
    if (!this.isPlaying) return;
    if (!this.music) {
      this.music = new Audio('/background.mp3');
      this.music.loop = true;
      this.music.volume = 0.35;
      this.music.preload = 'auto';
    }
    if (!this.music.paused) return;
    void this.music.play().then(() => {
      if (!this.isPlaying) this.music?.pause();
    }).catch(() => {
      // Autoplay may be blocked; retry on the next user gesture without
      // changing the enabled preference or producing an unhandled rejection.
    });
  };

  public initialize() {
    this.tryPlayback();
    window.addEventListener('pointerdown', this.tryPlayback);
    window.addEventListener('keydown', this.tryPlayback);
    return () => {
      window.removeEventListener('pointerdown', this.tryPlayback);
      window.removeEventListener('keydown', this.tryPlayback);
      this.music?.pause();
    };
  }

  public toggle(): boolean {
    if (this.isPlaying) this.stop();
    else this.start();
    return this.isPlaying;
  }

  public start() {
    this.isPlaying = true;
    this.onStateChangeCb?.(true);
    this.tryPlayback();
  }

  public stop() {
    this.isPlaying = false;
    this.music?.pause();
    this.onStateChangeCb?.(false);
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
