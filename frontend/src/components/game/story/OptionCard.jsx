import { useMemo } from "react";

const ICON = {
  correct: "✓",
  wrong: "✕",
};

const OptionCard = ({
  label,
  image,
  disabled = false,
  state = "idle", // idle | correct | wrong | muted
  onClick,
}) => {
  const classes = useMemo(() => {
    if (state === "correct") {
      return "border-emerald-300 bg-emerald-50 shadow-[0_16px_30px_rgba(16,185,129,0.25)]";
    }
    if (state === "wrong") {
      return "border-rose-300 bg-rose-50 animate-soft-shake shadow-[0_16px_30px_rgba(244,63,94,0.18)]";
    }
    if (state === "muted") {
      return "border-white/60 bg-white/55 opacity-55";
    }
    return "border-white/70 bg-white/80 hover:-translate-y-1 hover:shadow-[0_18px_30px_rgba(15,23,42,0.18)]";
  }, [state]);

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`relative w-full overflow-hidden rounded-[22px] border-[5px] px-4 py-4 text-left transition-all duration-200 ${classes}`}
    >
      <div className="absolute inset-x-5 top-2 h-3 rounded-full bg-white/55" />

      <div className="flex items-center gap-3">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-md">
          <span className="text-3xl leading-none">{image}</span>
        </div>
        <div className="min-w-0">
          <p className="truncate text-base font-extrabold text-slate-800">{label}</p>
          <p className="text-xs font-semibold text-slate-500">Tap to choose</p>
        </div>
      </div>

      {state === "correct" && (
        <span className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-sm font-black text-white animate-pop">
          {ICON.correct}
        </span>
      )}
      {state === "wrong" && (
        <span className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-rose-500 text-sm font-black text-white animate-pop">
          {ICON.wrong}
        </span>
      )}
    </button>
  );
};

export default OptionCard;

