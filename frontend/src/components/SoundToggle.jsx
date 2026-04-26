import { useSound } from "../sounds/SoundProvider";

const SoundToggle = ({ className = "" }) => {
  const { muted, toggleMuted, play } = useSound();

  return (
    <button
      type="button"
      onClick={() => {
        if (muted) {
          toggleMuted();
          setTimeout(() => play("click"), 0);
        } else {
          play("click");
          toggleMuted();
        }
      }}
      className={`rounded-2xl bg-white/80 hover:bg-white px-4 py-2 text-sm font-bold text-gray-600 shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer ${className}`}
      aria-label={muted ? "Turn sounds on" : "Mute sounds"}
    >
      {muted ? "Sound Off" : "Sound On"}
    </button>
  );
};

export default SoundToggle;
