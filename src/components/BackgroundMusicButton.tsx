import { useEffect, useRef, useState } from 'react';

const melody = [
  392, 494, 523, 494,
  440, 392, 330, 392,
  523, 587, 523, 440,
  392, 330, 349, 392,
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
    noteGain.gain.exponentialRampToValueAtTime(0.18, startTime + 0.04);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.42);

    oscillator.connect(noteGain);
    noteGain.connect(gain);
    oscillator.start(startTime);
    oscillator.stop(startTime + 0.46);
  }

  function startMusic() {
    if (musicRef.current) return;

    const context = new AudioContext();
    const gain = context.createGain();
    gain.gain.value = 0.16;
    gain.connect(context.destination);

    const tick = () => {
      const note = melody[stepRef.current % melody.length];
      playNote(context, gain, note);
      stepRef.current += 1;
    };

    tick();
    const timer = window.setInterval(tick, 520);
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
    <button className="music-button secondary-button" onClick={handleClick} type="button">
      {isPlaying ? 'Music off' : 'Music on'}
    </button>
  );
}
