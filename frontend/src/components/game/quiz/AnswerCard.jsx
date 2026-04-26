import { useEffect } from "react";
import { useSound } from "../../../sounds/SoundProvider";

const COLOR_VARIANTS = [
  "from-pink-400 via-rose-400 to-orange-300",
  "from-sky-400 via-cyan-400 to-blue-500",
  "from-violet-400 via-purple-500 to-fuchsia-500",
  "from-emerald-400 via-lime-400 to-green-500",
];

const AnswerCard = ({
  label,
  answer,
  onClick,
  state = "idle",
  disabled = false,
  index = 0,
}) => {
  const { play } = useSound();

  useEffect(() => {
    if (state === "correct") play("correct");
    if (state === "wrong") play("wrong");
  }, [play, state]);

  const interactiveState =
    state === "correct"
      ? "quiz-answer-card--correct"
      : state === "wrong"
      ? "quiz-answer-card--wrong"
      : state === "muted"
      ? "quiz-answer-card--muted"
      : "quiz-answer-card--idle";

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => {
        play("click");
        onClick?.();
      }}
      className={`quiz-answer-card ${interactiveState} bg-gradient-to-br ${COLOR_VARIANTS[index % COLOR_VARIANTS.length]}`}
    >
      <span className="quiz-answer-card__letter">{label}</span>
      <span className="quiz-answer-card__text">{answer}</span>
    </button>
  );
};

export default AnswerCard;
