import { useEffect, useMemo, useRef, useState } from "react";
import AnimatedBackground from "../../components/AnimatedBackground";
import ConfettiEffect from "../../components/ConfettiEffect";
import ProgressBar from "../../components/ProgressBar";
import GameHeader from "../../components/game/GameHeader";
import GameLayout from "../../components/game/GameLayout";
import BalloonField from "../../components/game/number/BalloonField";
import RewardPopup from "../../components/game/RewardPopup";
import useMentor from "../../components/mentor/useMentor";
import useTranslation from "../../utils/useTranslation";
import { useSound } from "../../sounds/SoundProvider";
import { saveProgress } from "../../services/api";

const NUMBER_ROUNDS = [
  { target: 3, options: [1, 3, 5, 7] },
  { target: 6, options: [2, 4, 6, 8] },
  { target: 9, options: [5, 7, 9, 10] },
  { target: 2, options: [2, 4, 6, 8] },
  { target: 5, options: [3, 5, 7, 9] },
  { target: 8, options: [4, 6, 8, 10] },
];

const NumberWorld = () => {
  const mentor = useMentor(localStorage.getItem("mentorCharacter") || "robot");
  const { triggerEvent, onComplete } = mentor;
  const { t } = useTranslation();
  const { play } = useSound();
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [wrong, setWrong] = useState("");
  const [popped, setPopped] = useState("");
  const [streak, setStreak] = useState(0);
  const [celebrateStreak, setCelebrateStreak] = useState(false);
  const [complete, setComplete] = useState(false);
  const [saved, setSaved] = useState(false);
  const startTimeRef = useRef(Date.now());

  const total = NUMBER_ROUNDS.length;
  const currentRound = NUMBER_ROUNDS[round];
  const level = Math.min(3, Math.floor(score / 2) + 1);
  const levelProgressValue = score % 2;

  useEffect(() => {
    const timer = setTimeout(() => {
      triggerEvent("START_ACTIVITY", {
        message: t("numberWorld.introMessage"),
      });
    }, 400);

    return () => clearTimeout(timer);
  }, [triggerEvent, t]);

  useEffect(() => {
    if (!complete || saved) return;

    const timeSpent = Math.round((Date.now() - startTimeRef.current) / 1000);
    saveProgress({
      topic: "numbers",
      subTopic: "balloon-pop",
      score,
      totalQuestions: total + mistakes,
      correctAnswers: score,
      timeSpent,
      attempts: 1,
      difficultyLevel: "easy",
    }).catch((error) => console.error("Failed to save number progress:", error));

    setSaved(true);
    onComplete();
    play("reward");
  }, [complete, mistakes, onComplete, play, saved, score, total]);

  useEffect(() => {
    if (!celebrateStreak) return;
    const timer = setTimeout(() => setCelebrateStreak(false), 900);
    return () => clearTimeout(timer);
  }, [celebrateStreak]);

  const floatingPrompt = useMemo(
    () => t("numberWorld.popNumber", { number: currentRound.target }),
    [currentRound.target, t]
  );

  const nextRound = () => {
    if (round < total - 1) {
      setRound((prev) => prev + 1);
      return;
    }
    setComplete(true);
  };

  const handleBalloonSelect = (value) => {
    if (popped) return;

    if (value === currentRound.target) {
      const nextStreak = streak + 1;
      setPopped(value);
      setScore((prev) => prev + 1);
      setStreak(nextStreak);
      triggerEvent("CORRECT_ANSWER", {
        message: t("numberWorld.correctMessage", { value }),
      });
      play("pop");

      if (nextStreak > 0 && nextStreak % 3 === 0) {
        setCelebrateStreak(true);
      }

      setTimeout(() => {
        setPopped("");
        nextRound();
      }, 720);

      return;
    }

    setMistakes((prev) => prev + 1);
    setStreak(0);
    setWrong(value);
    triggerEvent("WRONG_ANSWER", {
      message: t("numberWorld.wrongMessage", { value, target: currentRound.target }),
    });
    play("wrong");
    setTimeout(() => setWrong(""), 520);
  };

  if (complete) {
    return (
      <GameLayout
        title={t("numberWorld.title")}
        subtitle={t("numberWorld.completeSubtitle")}
        bgGradient="from-[#ffbb4b] via-[#ffd36d] to-[#fff1b4]"
        mentor={mentor}
      >
        <AnimatedBackground theme="sky-playground" />
        <ConfettiEffect active={true} duration={4000} />
        <div className="max-w-md mx-auto pt-10">
          <RewardPopup
            icon="🎈"
            title={t("numberWorld.rewardTitle")}
            subtitle={t("numberWorld.rewardSubtitle", { score, total })}
          />
        </div>
      </GameLayout>
    );
  }

  return (
    <GameLayout
      title={t("numberWorld.title")}
      subtitle={t("numberWorld.subtitle")}
      bgGradient="from-[#ffbb4b] via-[#ffd36d] to-[#fff1b4]"
      mentor={mentor}
    >
      <AnimatedBackground theme="sky-playground" />
      <ConfettiEffect active={celebrateStreak} duration={1200} />

      <div className="relative z-10 h-full space-y-3">
        <GameHeader score={score} current={round} total={total} label={t("numberWorld.adventureLabel")} />

        <section className="grid gap-3 xl:grid-cols-[1.18fr_290px]">
          <div className="game-card-surface relative overflow-hidden rounded-[2rem] border border-white/55 bg-white/68 p-4 shadow-2xl backdrop-blur-md sm:p-5">
            <div className="absolute inset-x-8 top-0 h-24 rounded-b-[2rem] bg-gradient-to-b from-white/45 to-transparent" />
            <div className="absolute left-8 top-16 h-8 w-8 rounded-full bg-yellow-300/70 blur-sm" />
            <div className="absolute right-10 top-14 h-5 w-5 rounded-full bg-orange-300/70 blur-sm" />
            <div className="absolute right-20 top-28 h-4 w-4 rounded-full bg-sky-300/70 blur-sm" />

            <div className="relative flex flex-col gap-4">
              <div className="mx-auto inline-flex max-w-full items-center justify-center rounded-[1.5rem] border-4 border-purple-300/65 bg-gradient-to-r from-purple-500 to-fuchsia-500 px-4 py-2.5 text-center shadow-lg">
                <h2 className="text-xl font-bold text-white sm:text-3xl">{floatingPrompt}</h2>
              </div>

              <div className="rounded-[2rem] border border-white/70 bg-gradient-to-b from-white/82 to-white/58 px-3 py-3 shadow-inner sm:px-4">
                <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-[0.25em] text-orange-500">{t("numberWorld.skyMission")}</p>
                    <p className="text-base font-bold text-slate-700">{t("numberWorld.matchInstruction")}</p>
                  </div>
                  <div className="rounded-full bg-yellow-100 px-4 py-2 text-sm font-bold text-amber-700 shadow-sm">
                    {t("numberWorld.target", { number: currentRound.target })}
                  </div>
                </div>

                <div className="number-balloon-stage number-balloon-stage--compact">
                  <div className="number-balloon-stage__cloud number-balloon-stage__cloud--left" />
                  <div className="number-balloon-stage__cloud number-balloon-stage__cloud--right" />
                  <div className="number-balloon-stage__grass" />
                  <BalloonField
                    options={currentRound.options}
                    poppedValue={popped}
                    wrongValue={wrong}
                    onSelect={handleBalloonSelect}
                    seedKey={round}
                  />
                </div>
              </div>
            </div>
          </div>

          <aside className="space-y-3">
            <div className="game-card-surface rounded-[1.9rem] border border-white/60 bg-white/72 p-4 shadow-xl backdrop-blur-md">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.25em] text-purple-500">{t("numberWorld.levelLabel")}</p>
                  <h3 className="text-3xl font-bold text-slate-800">{level}</h3>
                </div>
                <div className="rounded-2xl bg-purple-100 px-3 py-2 text-sm font-bold text-purple-700 shadow-sm">
                  {score}/{total} stars
                </div>
              </div>
              <ProgressBar value={levelProgressValue} max={2} color="bg-gradient-to-r from-emerald-400 to-lime-400" />
            </div>

            <div className="game-card-surface rounded-[1.9rem] border border-white/60 bg-gradient-to-br from-purple-500 to-fuchsia-500 p-4 text-white shadow-xl">
                <p className="text-sm font-bold uppercase tracking-[0.25em] text-white/80">{t("numberWorld.todayGoal")}</p>
                <h3 className="mt-2 text-2xl font-bold">{t("numberWorld.goalText", { total })}</h3>
              <p className="mt-2 text-sm font-semibold text-white/85">
                  {t("numberWorld.goalSubtext")}
              </p>
            </div>

            <div className="game-card-surface rounded-[1.9rem] border border-white/60 bg-white/72 p-4 shadow-xl backdrop-blur-md">
                  <p className="text-sm font-bold uppercase tracking-[0.25em] text-sky-500">{t("numberWorld.streakLabel")}</p>
              <div className="mt-3 flex items-end justify-between gap-3">
                <div>
                  <h3 className="text-3xl font-bold text-slate-800">{streak}</h3>
                  <p className="text-sm font-semibold text-slate-600">{t("numberWorld.balloonsInRow")}</p>
                </div>
                <div className="rounded-full bg-amber-100 px-4 py-2 text-sm font-bold text-amber-700">
                  {t("numberWorld.bestMove")}
                </div>
              </div>
            </div>
          </aside>
        </section>
      </div>
    </GameLayout>
  );
};

export default NumberWorld;
