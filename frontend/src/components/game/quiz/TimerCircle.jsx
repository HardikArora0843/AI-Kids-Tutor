const TimerCircle = ({ value, max, label }) => {
  const safeMax = max || 1;
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const percent = Math.max(0, Math.min(1, value / safeMax));
  const dashOffset = circumference * (1 - percent);

  return (
    <div className="quiz-chip quiz-chip--timer">
      <div className="quiz-timer-circle">
        <svg viewBox="0 0 90 90" className="h-20 w-20 -rotate-90">
          <circle cx="45" cy="45" r={radius} className="quiz-timer-circle__track" />
          <circle
            cx="45"
            cy="45"
            r={radius}
            className="quiz-timer-circle__progress"
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: dashOffset,
            }}
          />
        </svg>
        <div className="quiz-timer-circle__center">
          <span className="quiz-timer-circle__value">{value}</span>
          <span className="quiz-timer-circle__unit">s</span>
        </div>
      </div>
      <div>
        <p className="quiz-chip__label">{label}</p>
        <p className="quiz-chip__hint">Keep the pace going</p>
      </div>
    </div>
  );
};

export default TimerCircle;
