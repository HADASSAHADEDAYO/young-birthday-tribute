// A warm, gentle celebratory acoustic ambient melody synthesizer using Web Audio API
// Provides an immediate soothing birthday vibe when no audio file is uploaded yet,
// without requiring copyrighted assets or external downloads.

class AmbientAudioPlayer {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private intervalId: any = null;
  private gainNode: GainNode | null = null;
  private volume = 0.5;

  private notes = [
    261.63, // C4
    293.66, // D4
    329.63, // E4
    392.00, // G4
    440.00, // A4
    523.25, // C5
    587.33, // D5
    659.25, // E5
  ];

  public init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.gainNode.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setTargetAtTime(this.volume * 0.4, this.ctx.currentTime, 0.1);
    }
  }

  public play() {
    this.init();
    if (this.isPlaying) return;
    this.isPlaying = true;

    // Harmonious chord progressions with soft attack and decay
    const progression = [
      [261.63, 329.63, 392.00, 523.25], // C major
      [220.00, 261.63, 329.63, 440.00], // A minor
      [174.61, 220.00, 261.63, 349.23], // F major
      [196.00, 246.94, 293.66, 392.00]  // G major
    ];

    let chordIdx = 0;

    const playChord = () => {
      if (!this.ctx || !this.isPlaying || !this.gainNode) return;
      const now = this.ctx.currentTime;
      const chord = progression[chordIdx % progression.length];
      chordIdx++;

      chord.forEach((freq, i) => {
        if (!this.ctx || !this.gainNode) return;
        const osc = this.ctx.createOscillator();
        const noteGain = this.ctx.createGain();

        // Warm triangle/sine blend
        osc.type = i % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.15);

        noteGain.gain.setValueAtTime(0, now + i * 0.15);
        noteGain.gain.linearRampToValueAtTime(0.08, now + i * 0.15 + 0.4);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.15 + 3.8);

        osc.connect(noteGain);
        noteGain.connect(this.gainNode);

        osc.start(now + i * 0.15);
        osc.stop(now + i * 0.15 + 4.0);
      });
    };

    playChord();
    this.intervalId = setInterval(playChord, 3600);
  }

  public pause() {
    this.isPlaying = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  public getStatus() {
    return this.isPlaying;
  }
}

export const ambientAudio = new AmbientAudioPlayer();
