type SoundStep = {
  duration: number;
  frequency: number;
  type: OscillatorType;
  volume: number;
};

type WindowWithAudioFallback = Window & {
  AudioContext?: typeof AudioContext;
  webkitAudioContext?: typeof AudioContext;
};

const loseSound: SoundStep[] = [
  { duration: 0.16, frequency: 180, type: 'sawtooth', volume: 0.12 },
  { duration: 0.22, frequency: 118, type: 'sawtooth', volume: 0.1 },
];

const winSound: SoundStep[] = [
  { duration: 0.12, frequency: 523, type: 'triangle', volume: 0.1 },
  { duration: 0.12, frequency: 659, type: 'triangle', volume: 0.11 },
  { duration: 0.18, frequency: 784, type: 'triangle', volume: 0.12 },
  { duration: 0.24, frequency: 1046, type: 'triangle', volume: 0.1 },
];

export function playLoseSound() {
  playSound(loseSound);
}

export function playWinSound() {
  playSound(winSound);
}

function playSound(steps: SoundStep[]) {
  const audioWindow = window as WindowWithAudioFallback;
  const AudioContextClass = audioWindow.AudioContext || audioWindow.webkitAudioContext;
  if (!AudioContextClass) return;
  const context = new AudioContextClass();
  let startTime = context.currentTime;

  steps.forEach((step) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = step.type;
    oscillator.frequency.setValueAtTime(step.frequency, startTime);
    gain.gain.setValueAtTime(0.001, startTime);
    gain.gain.exponentialRampToValueAtTime(step.volume, startTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + step.duration);

    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(startTime);
    oscillator.stop(startTime + step.duration);
    startTime += step.duration;
  });

  window.setTimeout(() => void context.close(), (startTime - context.currentTime + 0.2) * 1000);
}
