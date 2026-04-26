import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfettiEffect from "../../ConfettiEffect";
import GameHeader from "../GameHeader";
import LivesIndicator from "../LivesIndicator";
import RewardPopup from "../RewardPopup";
import TimerBar from "../TimerBar";
import AnswerCard from "./AnswerCard";
import QuestionCard from "./QuestionCard";
import StreakIndicator from "./StreakIndicator";
import TimerCircle from "./TimerCircle";

const INITIAL_LIVES = 3;
const QUESTION_TIME = 20;
const FEEDBACK_DELAY = 900;

const getStarCount = (score, totalQuestions) => {
  const maxScore = totalQuestions * 18;
  const ratio = maxScore ? score / maxScore : 0;
  if (ratio >= 0.8) return 3;
  if (ratio >= 0.5) return 2;
  return 1;
};

const QuizArena = ({ questions, mentor, labels, onFinish }) => {
  const navigate = useNavigate();
  const { triggerEvent } = mentor;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(INITIAL_LIVES);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [status, setStatus] = useState("playing");
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [lowTimeWarned, setLowTimeWarned] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const startTimeRef = useRef(Date.now());
  const hasFinishedRef = useRef(false);

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const progressCurrent = status === "playing" ? currentQuestionIndex + 1 : totalQuestions;
  const stars = getStarCount(score, totalQuestions);

  useEffect(() => {
    const timer = setTimeout(() => {
      triggerEvent("START_QUIZ", { message: labels.startMessage });
    }, 400);

    return () => clearTimeout(timer);
  }, [labels.startMessage, triggerEvent]);

  useEffect(() => {
    if (status !== "playing" || selectedAnswer) return undefined;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const next = prev - 1;

        if (next === 5 && !lowTimeWarned) {
          setLowTimeWarned(true);
          triggerEvent("LOW_TIME_WARNING", { message: labels.lowTimeMessage });
        }

        if (next <= 0) {
          clearInterval(timer);
          handleWrong(null, true);
          return 0;
        }

        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [lowTimeWarned, selectedAnswer, status, triggerEvent, labels.lowTimeMessage]);

  useEffect(() => {
    if (!celebrate) return undefined;
    const timer = setTimeout(() => setCelebrate(false), 1300);
    return () => clearTimeout(timer);
  }, [celebrate]);

  useEffect(() => {
    if ((status !== "complete" && status !== "game-over") || hasFinishedRef.current) return;
    hasFinishedRef.current = true;
    const elapsed = Math.round((Date.now() - startTimeRef.current) / 1000);
    setTimeSpent(elapsed);
    onFinish?.({
      topic: "quiz",
      score,
      correctAnswers,
      totalQuestions,
      timeSpent: elapsed,
      streak: bestStreak,
      status,
    });
  }, [bestStreak, correctAnswers, onFinish, score, status, totalQuestions]);

  const moveToNextQuestion = () => {
    if (currentQuestionIndex === totalQuestions - 1) {
      setStatus("complete");
      triggerEvent("QUIZ_COMPLETE", {
        message: labels.completeMessage,
      });
      return;
    }

    setCurrentQuestionIndex((prev) => prev + 1);
    setSelectedAnswer("");
    setTimeLeft(QUESTION_TIME);
    setLowTimeWarned(false);
  };

  const handleWrong = (answer, timedOut = false) => {
    setSelectedAnswer(answer || "__timeout__");
    setStreak(0);
    setLives((prev) => {
      const nextLives = Math.max(0, prev - 1);
      if (nextLives === 0) {
        setTimeout(() => {
          setStatus("game-over");
          triggerEvent("GAME_OVER", { message: labels.gameOverMessage });
        }, FEEDBACK_DELAY);
      } else {
        setTimeout(() => {
          moveToNextQuestion();
        }, FEEDBACK_DELAY);
      }
      return nextLives;
    });

    triggerEvent("WRONG_ANSWER", {
      message: timedOut ? labels.timeoutMessage.replace("{answer}", currentQuestion.answer) : labels.wrongMessage,
    });
  };

  const handleAnswer = (answer) => {
    if (status !== "playing" || selectedAnswer) return;

    setSelectedAnswer(answer);

    if (answer === currentQuestion.answer) {
      const nextStreak = streak + 1;
      const earned = 10 + nextStreak * 2;

      setCorrectAnswers((prev) => prev + 1);
      setStreak(nextStreak);
      setBestStreak((prev) => Math.max(prev, nextStreak));
      setScore((prev) => prev + earned);
      setCelebrate(nextStreak > 1);

      triggerEvent("CORRECT_ANSWER", {
        message: labels.correctMessage.replace("{streak}", nextStreak),
      });

      setTimeout(() => {
        moveToNextQuestion();
      }, FEEDBACK_DELAY);
      return;
    }

    handleWrong(answer, false);
  };

  const handleRestart = () => {
    hasFinishedRef.current = false;
    startTimeRef.current = Date.now();
    setCurrentQuestionIndex(0);
    setScore(0);
    setLives(INITIAL_LIVES);
    setStreak(0);
    setBestStreak(0);
    setTimeLeft(QUESTION_TIME);
    setSelectedAnswer("");
    setStatus("playing");
    setCorrectAnswers(0);
    setLowTimeWarned(false);
    setCelebrate(false);
    setTimeSpent(0);
    triggerEvent("START_QUIZ", { message: labels.startMessage });
  };

  const comboText = streak > 1 ? labels.comboHot.replace("{streak}", streak) : labels.comboReady;

  const answerStates = useMemo(
    () =>
      currentQuestion.options.reduce((acc, option) => {
        if (!selectedAnswer) {
          acc[option] = "idle";
        } else if (option === currentQuestion.answer) {
          acc[option] = "correct";
        } else if (option === selectedAnswer) {
          acc[option] = "wrong";
        } else {
          acc[option] = "muted";
        }
        return acc;
      }, {}),
    [currentQuestion.answer, currentQuestion.options, selectedAnswer]
  );

  return (
    <div className="quiz-arena-page relative z-10 h-full space-y-3">
      <ConfettiEffect active={celebrate || status === "complete"} duration={status === "complete" ? 3200 : 1200} />

      <GameHeader
        score={score}
        current={progressCurrent}
        total={totalQuestions}
        label={labels.progressLabel}
      />

      {status === "playing" ? (
        <section className="quiz-arena-layout grid gap-3 xl:grid-cols-[1.28fr_290px]">
          <div className="quiz-arena-shell">
            <div className="quiz-arena-shell__lights">
              <span />
              <span />
              <span />
            </div>

            <QuestionCard
              current={currentQuestionIndex + 1}
              total={totalQuestions}
              question={currentQuestion.question}
              prompt={labels.questionPrompt}
              comboText={comboText}
              progressLabel={labels.questionLabel}
            />

            <div className="quiz-arena-stage">
              <div className="quiz-arena-stage__glow quiz-arena-stage__glow--left" />
              <div className="quiz-arena-stage__glow quiz-arena-stage__glow--right" />

              <div className="quiz-answer-grid">
                {currentQuestion.options.map((option, index) => (
                  <AnswerCard
                    key={option}
                    label={String.fromCharCode(65 + index)}
                    answer={option}
                    state={answerStates[option]}
                    disabled={Boolean(selectedAnswer)}
                    index={index}
                    onClick={() => handleAnswer(option)}
                  />
                ))}
              </div>
            </div>
          </div>

          <aside className="quiz-arena-sidebar space-y-3">
            <div className="quiz-side-panel">
              <p className="quiz-side-panel__eyebrow">{labels.livesLabel}</p>
              <LivesIndicator lives={lives} />
              <p className="quiz-side-panel__hint">{labels.livesHint}</p>
            </div>

            <StreakIndicator streak={streak} label={labels.streakShortLabel} hint={labels.streakHint} />

            <TimerCircle value={timeLeft} max={QUESTION_TIME} label={labels.timerLabel} />

            <div className="quiz-side-panel">
              <p className="quiz-side-panel__eyebrow">{labels.scorePanelLabel}</p>
              <h3 className="quiz-side-panel__score">{score}</h3>
              <p className="quiz-side-panel__hint">{labels.bonusHint}</p>
            </div>

            <div className="quiz-side-panel quiz-side-panel--compact">
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="quiz-side-panel__eyebrow">{labels.timerBarLabel}</p>
                <span className="quiz-side-panel__hint">{timeLeft}s</span>
              </div>
              <TimerBar value={timeLeft} max={QUESTION_TIME} />
            </div>
          </aside>
        </section>
      ) : (
        <div className="mx-auto max-w-xl pt-2">
          <RewardPopup
            icon={status === "complete" ? "🏆" : "💜"}
            title={status === "complete" ? labels.rewardTitle : labels.gameOverTitle}
            subtitle={
              status === "complete"
                ? labels.rewardSubtitle.replace("{score}", score)
                : labels.gameOverSubtitle.replace("{score}", score)
            }
          >
            <div className="mt-6 space-y-4">
              <div className="rounded-[1.75rem] bg-slate-100 p-4 text-slate-700 shadow-inner">
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">{labels.resultsLabel}</p>
                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl bg-white p-3 shadow-sm">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">{labels.scorePanelLabel}</p>
                    <p className="mt-2 text-2xl font-black text-slate-800">{score}</p>
                  </div>
                  <div className="rounded-2xl bg-white p-3 shadow-sm">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">{labels.starLabel}</p>
                    <p className="mt-2 text-2xl font-black text-amber-500">{"⭐".repeat(stars)}</p>
                  </div>
                  <div className="rounded-2xl bg-white p-3 shadow-sm">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">{labels.bestStreakLabel}</p>
                    <p className="mt-2 text-2xl font-black text-fuchsia-600">x{bestStreak}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm font-semibold text-slate-500">
                  {labels.timeSpentLabel.replace("{time}", timeSpent)}
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-3">
                <button type="button" onClick={handleRestart} className="quiz-popup-button quiz-popup-button--primary">
                  {labels.playAgain}
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/child")}
                  className="quiz-popup-button quiz-popup-button--secondary"
                >
                  {labels.backToDashboard}
                </button>
              </div>
            </div>
          </RewardPopup>
        </div>
      )}
    </div>
  );
};

export default QuizArena;
