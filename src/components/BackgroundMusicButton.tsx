import { useEffect, useRef, useState } from 'react';

const melody = [
  262, 330, 392, 330,
  294, 349, 392, 349,
  262, 330, 392, 440,
  392, 330, 294, 262,
  330, 392, 494, 392,
  349, 440, 494, 440,
  392, 330, 294, 330,
  262, 294, 330, 262,
];

type MusicState = {
  context: AudioContext;
  gain: GainNode;
  timer: number;
};

export function BackgroundMusicButton() {
  const [isPlaying, setIsPlaying] = useState(false);
  const musicRef = useRef<MusicState | null>(null);
  const stepRef = useRef(0);

  useEffect(() => () => stopMusic(), []);

  function playNote(context: AudioContext, gain: GainNode, frequency: number) {
    const oscillator = context.createOscillator();
    const noteGain = context.createGain();
    const startTime = context.currentTime;

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, startTime);
    noteGain.gain.setValueAtTime(0.0001, startTime);
    noteGain.gain.exponentialRampToValueAtTime(0.24, startTime + 0.08);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.62);

    oscillator.connect(noteGain);
    noteGain.connect(gain);
    oscillator.start(startTime);
    oscillator.stop(startTime + 0.66);
  }

  function startMusic() {
    if (musicRef.current) return;

    const context = new AudioContext();
    const gain = context.createGain();
    gain.gain.value = 0.32;
    gain.connect(context.destination);

    const tick = () => {
      const note = melody[stepRef.current % melody.length];
      playNote(context, gain, note);
      stepRef.current += 1;
    };

    tick();
    const timer = window.setInterval(tick, 700);
    musicRef.current = { context, gain, timer };
    setIsPlaying(true);
  }

  function stopMusic() {
    const music = musicRef.current;
    if (!music) return;

    window.clearInterval(music.timer);
    music.gain.gain.setTargetAtTime(0.0001, music.context.currentTime, 0.08);
    window.setTimeout(() => void music.context.close(), 180);
    musicRef.current = null;
    setIsPlaying(false);
  }

  function handleClick() {
    if (isPlaying) {
      stopMusic();
      return;
    }
    startMusic();
  }

  return (
    <button
      aria-label={isPlaying ? 'Turn music off' : 'Turn music on'}
      className="music-button secondary-button"
      onClick={handleClick}
      title={isPlaying ? 'Turn music off' : 'Turn music on'}
      type="button"
    >
      <svg aria-hidden="true" className="music-icon" viewBox="0 0 24 24">
        <path d="M9 18V5l11-2v13" />
        <circle cx="6" cy="18" r="3" />
        <circle cx="17" cy="16" r="3" />
        {!isPlaying && <path className="music-icon-slash" d="M4 4l16 16" />}
      </svg>
    </button>
  );
}
