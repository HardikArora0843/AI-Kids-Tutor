const StreakIndicator = ({ streak = 0, label, hint }) => (
  <div className="quiz-chip quiz-chip--streak">
    <span className="text-2xl">🔥</span>
    <div>
      <p className="quiz-chip__label">{label}</p>
      <p className="quiz-chip__value">x{streak}</p>
      <p className="quiz-chip__hint">{hint}</p>
    </div>
  </div>
);

export default StreakIndicator;
