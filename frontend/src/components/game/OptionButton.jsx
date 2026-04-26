import { useEffect } from "react";
import { useSound } from "../../sounds/SoundProvider";

const OptionButton = ({ children, onClick, state = "idle", disabled = false }) => {
  const { play } = useSound();

  useEffect(() => {
    if (state === "correct") play("correct");
    if (state === "wrong") play("wrong");
  }, [play, state]);

  const styles = {
    idle: "bg-white hover:bg-secondary-50 text-gray-800",
    correct: "bg-success-500 text-white scale-105 shadow-success-500/40 ring-4 ring-success-400/40",
    wrong: "bg-error-500 text-white animate-soft-shake shadow-error-500/40 ring-4 ring-error-400/40",
    muted: "bg-white/50 text-gray-400",
  };

  return (
    <button
      type="button"
      onClick={(event) => {
        play("click");
        onClick?.(event);
      }}
      disabled={disabled}
      className={`${styles[state]} rounded-3xl px-5 py-4 text-xl md:text-2xl font-bold shadow-xl transition-all cursor-pointer hover:scale-105 active:scale-95 disabled:cursor-default disabled:hover:scale-100`}
    >
      {children}
    </button>
  );
};

export default OptionButton;
