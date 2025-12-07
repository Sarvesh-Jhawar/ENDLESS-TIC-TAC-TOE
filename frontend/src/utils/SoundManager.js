// SoundManager - Handles all game sound effects using Web Audio API
class SoundManager {
    constructor() {
        this.audioContext = null;
        this.sounds = {};
        this.isMuted = localStorage.getItem('gameSoundMuted') === 'true';
        this.isInitialized = false;
    }

    // Initialize audio context (must be called after user interaction)
    init() {
        if (this.isInitialized) return;

        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.isInitialized = true;
            this.createSounds();
        } catch (e) {
            console.warn('Web Audio API not supported');
        }
    }

    // Create all game sounds using oscillators
    createSounds() {
        // Sound configurations
        this.soundConfigs = {
            click: { frequency: 600, duration: 0.1, type: 'sine', volume: 0.3 },
            hover: { frequency: 400, duration: 0.05, type: 'sine', volume: 0.1 },
            placeX: { frequency: 523, duration: 0.15, type: 'square', volume: 0.2 },
            placeO: { frequency: 659, duration: 0.15, type: 'square', volume: 0.2 },
            win: { frequencies: [523, 659, 784, 1047], duration: 0.2, type: 'sine', volume: 0.3 },
            lose: { frequencies: [400, 350, 300, 250], duration: 0.25, type: 'sawtooth', volume: 0.2 },
            countdown: { frequency: 880, duration: 0.2, type: 'sine', volume: 0.3 },
            countdownGo: { frequency: 1047, duration: 0.4, type: 'sine', volume: 0.4 },
            timerWarning: { frequency: 440, duration: 0.1, type: 'square', volume: 0.25 },
            aiMove: { frequency: 350, duration: 0.12, type: 'triangle', volume: 0.2 },
            buttonClick: { frequency: 500, duration: 0.08, type: 'sine', volume: 0.2 },
            roundStart: { frequencies: [440, 550, 660], duration: 0.15, type: 'sine', volume: 0.25 },
            vanish: { frequency: 200, duration: 0.3, type: 'sine', volume: 0.15, fadeOut: true },
            toggle: { frequency: 700, duration: 0.05, type: 'sine', volume: 0.2 }
        };
    }

    // Play a simple tone
    playTone(frequency, duration, type = 'sine', volume = 0.3, fadeOut = false) {
        if (this.isMuted || !this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = type;
        gainNode.gain.value = volume;

        if (fadeOut) {
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
        }

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }

    // Play a melody (sequence of tones)
    playMelody(frequencies, duration, type = 'sine', volume = 0.3) {
        if (this.isMuted || !this.audioContext) return;

        frequencies.forEach((freq, index) => {
            setTimeout(() => {
                this.playTone(freq, duration, type, volume);
            }, index * (duration * 1000));
        });
    }

    // Play specific game sounds
    play(soundName) {
        if (!this.isInitialized) this.init();
        if (this.isMuted || !this.soundConfigs) return;

        const config = this.soundConfigs[soundName];
        if (!config) return;

        if (config.frequencies) {
            this.playMelody(config.frequencies, config.duration, config.type, config.volume);
        } else {
            this.playTone(config.frequency, config.duration, config.type, config.volume, config.fadeOut);
        }
    }

    // Toggle mute
    toggleMute() {
        this.isMuted = !this.isMuted;
        localStorage.setItem('gameSoundMuted', this.isMuted.toString());

        if (!this.isMuted) {
            this.init();
            this.play('toggle');
        }

        return this.isMuted;
    }

    // Set mute state
    setMuted(muted) {
        this.isMuted = muted;
        localStorage.setItem('gameSoundMuted', this.isMuted.toString());
    }

    // Get mute state
    getMuted() {
        return this.isMuted;
    }
}

// Create singleton instance
const soundManager = new SoundManager();

export default soundManager;
