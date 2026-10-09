export class SoundEngine {
    #context = null;
    #masterVolume = 0.8;

    init() {
        if (!this.#context) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.#context = new AudioContext();
        }
        if (this.#context.state === "suspended") {
            this.#context.resume();
        }
    }

    setMasterVolume(value) {
        this.#masterVolume = parseFloat(value);
    }

    #playTone({ type, start, end, duration, frequencyDuration = duration, volume, ramp = "exponential" }) {
        if (!this.#context) return;
        const oscillator = this.#context.createOscillator();
        const gain = this.#context.createGain();
        const now = this.#context.currentTime;

        oscillator.type = type;
        oscillator.frequency.setValueAtTime(start, now);
        if (end !== undefined) {
            if (ramp === "linear") {
                oscillator.frequency.linearRampToValueAtTime(end, now + frequencyDuration);
            } else {
                oscillator.frequency.exponentialRampToValueAtTime(end, now + frequencyDuration);
            }
        }
        gain.gain.setValueAtTime(volume * this.#masterVolume, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + duration);
        oscillator.connect(gain);
        gain.connect(this.#context.destination);
        oscillator.start();
        oscillator.stop(now + duration);
    }

    playShoot() {
        this.#playTone({ type: "sawtooth", start: 350, end: 40, duration: 0.09, volume: 0.2 });
    }

    playJump() {
        this.#playTone({ type: "sine", start: 140, end: 360, duration: 0.18, volume: 0.25 });
    }

    playHit() {
        this.#playTone({ type: "square", start: 220, end: 50, duration: 0.08, volume: 0.25 });
    }

    playChickenCluck() {
        if (!this.#context) return;
        const oscillator = this.#context.createOscillator();
        const gain = this.#context.createGain();
        const now = this.#context.currentTime;

        oscillator.type = "triangle";
        oscillator.frequency.setValueAtTime(520, now);
        oscillator.frequency.setValueAtTime(740, now + 0.04);
        oscillator.frequency.setValueAtTime(300, now + 0.1);
        gain.gain.setValueAtTime(0.3 * this.#masterVolume, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.16);
        oscillator.connect(gain);
        gain.connect(this.#context.destination);
        oscillator.start();
        oscillator.stop(now + 0.16);
    }

    playPickup() {
        this.#playTone({ type: "sine", start: 400, end: 950, duration: 0.12, volume: 0.2 });
    }

    playReload(phase) {
        this.#playTone({
            type: "square",
            start: phase ? 520 : 180,
            end: phase ? 260 : 90,
            duration: 0.08,
            frequencyDuration: 0.07,
            volume: 0.18
        });
    }

    playEmpty() {
        this.#playTone({ type: "triangle", start: 900, duration: 0.04, volume: 0.15 });
    }

    playPlayerDamage() {
        this.#playTone({ type: "sawtooth", start: 130, end: 30, duration: 0.22, volume: 0.4, ramp: "linear" });
    }

    playExplosion() {
        if (!this.#context) return;
        const duration = 0.35;
        const bufferSize = this.#context.sampleRate * duration;
        const buffer = this.#context.createBuffer(1, bufferSize, this.#context.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = this.#context.createBufferSource();
        const filter = this.#context.createBiquadFilter();
        const gain = this.#context.createGain();
        const now = this.#context.currentTime;

        noise.buffer = buffer;
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(600, now);
        filter.frequency.linearRampToValueAtTime(40, now + duration);
        gain.gain.setValueAtTime(0.5 * this.#masterVolume, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + duration);
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.#context.destination);
        noise.start();
        noise.stop(now + duration);
    }
}
