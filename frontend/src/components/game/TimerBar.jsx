const TimerBar = ({ value = 0, max = 100 }) => {
  const percent = max > 0 ? Math.max(0, Math.min(100, Math.round((value / max) * 100))) : 0;

  return (
    <div
      className="h-4 bg-white/25 rounded-full overflow-hidden"
      role="progressbar"
      aria-label="Time remaining"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percent}
    >
      <div
        className={`h-full rounded-full transition-all ${percent < 30 ? "bg-error-500" : "bg-white"}`}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
};

export default TimerBar;
