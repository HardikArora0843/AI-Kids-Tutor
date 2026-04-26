import { createContext, useCallback, useContext, useMemo, useState } from "react";

const SoundContext = createContext(null);

const SOUND_SETTINGS = {
  click: { frequency: 420, duration: 0.045, type: "sine", gain: 0.035 },
  correct: { frequency: 660, duration: 0.12, type: "triangle", gain: 0.045 },
  // Louder + longer envelope so balloon pop is clearly audible.
  pop: { frequency: 920, duration: 0.14, type: "square", gain: 0.085 },
  wrong: { frequency: 180, duration: 0.11, type: "sawtooth", gain: 0.025 },
  reward: { frequency: 880, duration: 0.18, type: "triangle", gain: 0.05 },
};

const getAudioContext = () => {
  if (typeof window === "undefined") return null;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return null;

  if (!window.__kidsTutorAudioContext) {
    window.__kidsTutorAudioContext = new AudioContext();
  }

  return window.__kidsTutorAudioContext;
};

export const SoundProvider = ({ children }) => {
  const [muted, setMuted] = useState(() => localStorage.getItem("soundMuted") === "true");

  const play = useCallback(
    (name) => {
      if (muted) return;

      const context = getAudioContext();
      const settings = SOUND_SETTINGS[name] || SOUND_SETTINGS.click;
      if (!context) return;

      const oscillator = context.createOscillator();
      const gain = context.createGain();
      const now = context.currentTime;

      oscillator.type = settings.type;
      oscillator.frequency.setValueAtTime(settings.frequency, now);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(settings.gain, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + settings.duration);

      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(now);
      oscillator.stop(now + settings.duration + 0.02);

      if (name === "reward") {
        setTimeout(() => play("correct"), 80);
      }
    },
    [muted]
  );

  const toggleMuted = useCallback(() => {
    setMuted((prev) => {
      const next = !prev;
      localStorage.setItem("soundMuted", String(next));
      return next;
    });
  }, []);

  const value = useMemo(() => ({ muted, play, toggleMuted }), [muted, play, toggleMuted]);

  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
};

export const useSound = () => {
  const context = useContext(SoundContext);
  if (!context) {
    return { muted: true, play: () => {}, toggleMuted: () => {} };
  }
  return context;
};
