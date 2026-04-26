import { useEffect, useMemo, useRef, useState } from "react";
import AnimatedBackground from "../../components/AnimatedBackground";
import ConfettiEffect from "../../components/ConfettiEffect";
import GameHeader from "../../components/game/GameHeader";
import GameLayout from "../../components/game/GameLayout";
import RewardPopup from "../../components/game/RewardPopup";
import StoryCard from "../../components/game/story/StoryCard";
import QuizPanel from "../../components/game/story/QuizPanel";
import StoryProgressBar from "../../components/game/story/StoryProgressBar";
import useMentor from "../../components/mentor/useMentor";
import useTranslation from "../../utils/useTranslation";
import { useSound } from "../../sounds/SoundProvider";
import { saveProgress } from "../../services/api";

const StoryWorld = () => {
  const mentor = useMentor(localStorage.getItem("mentorCharacter") || "robot");
  const { triggerEvent, onComplete } = mentor;
  const { t } = useTranslation();
  const { play } = useSound();

  const storyContent = t("storyWorld.stories")[0];
  const story = useMemo(
    () => ({
      id: storyContent.id,
      title: t("storyWorld.storyTitle") || "The Little Star",
      emoji: storyContent.emoji,
      text: storyContent.text,
      playMessage: storyContent.playMessage,
      questions: (storyContent.questions || []).map((q) => ({
        question: q.question,
        explain: q.explain,
        // Visual options (emoji placeholders for now; still “image + label” UX).
        options: (q.options || []).map((label) => ({
          label,
          image: label === q.answer ? "⭐" : "🌿",
          correct: label === q.answer,
        })),
      })),
    }),
    [storyContent, t]
  );

  const [selections, setSelections] = useState({});
  const [correctCount, setCorrectCount] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [complete, setComplete] = useState(false);
  const [saved, setSaved] = useState(false);
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    const timer = setTimeout(() => {
      triggerEvent("START_STORY", { message: t("storyWorld.startMessage") });
    }, 500);
    return () => clearTimeout(timer);
  }, [triggerEvent, t]);

  useEffect(() => {
    if (!complete || saved) return;
    const timeSpent = Math.round((Date.now() - startTimeRef.current) / 1000);
    saveProgress({
      topic: "story",
      subTopic: "listening",
      score: Math.max(0, correctCount * 100 - Math.max(0, attempts - correctCount) * 20),
      totalQuestions: story.questions.length,
      correctAnswers: correctCount,
      timeSpent,
      attempts: 1,
      difficultyLevel: "easy",
    }).catch((error) => console.error("Failed to save story progress:", error));
    setSaved(true);
    onComplete();
  }, [attempts, complete, correctCount, onComplete, saved, story.questions.length]);

  const listenStory = () => {
    setIsListening(true);
    triggerEvent("STORY_PLAY", { message: story.playMessage });
    play("click");
    window.setTimeout(() => setIsListening(false), 1400);
  };

  const onSelectOption = (questionIndex, option) => {
    if (complete) return;
    if (selections[questionIndex]) return;

    setAttempts((prev) => prev + 1);
    setSelections((prev) => ({ ...prev, [questionIndex]: option }));

    if (option.correct) {
      setCorrectCount((prev) => prev + 1);
      triggerEvent("CORRECT_ANSWER");
      play("correct");
    } else {
      triggerEvent("WRONG_ANSWER", {
        message: story.questions[questionIndex]?.explain || t("mentor.fallback"),
      });
      play("wrong");
    }

    window.setTimeout(() => {
      const nextCorrect =
        option.correct
          ? correctCount + 1
          : correctCount;
      if (nextCorrect >= story.questions.length) {
        setComplete(true);
        triggerEvent("STORY_COMPLETE");
      }
    }, 650);
  };

  const score = Math.max(0, correctCount * 100 - Math.max(0, attempts - correctCount) * 20);

  return (
    <GameLayout
      title={t("storyWorld.title")}
      subtitle={t("storyWorld.subtitle")}
      bgGradient="from-[#0ea5a8] via-[#22c55e] to-[#84cc16]"
      mentor={mentor}
    >
      <AnimatedBackground theme="forest-story" />
      {complete && <ConfettiEffect active={true} duration={4000} />}

      <GameHeader
        score={score}
        current={Object.keys(selections).length}
        total={story.questions.length}
        label={t("storyWorld.quizLabel")}
      />

      <div className="grid gap-3 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
        <StoryCard story={story} isListening={isListening} onListen={listenStory} />
        <QuizPanel
          title={t("storyWorld.listenAndAnswer") || "Listen & Answer"}
          questions={story.questions}
          selections={selections}
          locked={complete}
          onSelectOption={onSelectOption}
        />
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-[1fr_auto_220px] items-center">
        <StoryProgressBar value={Object.keys(selections).length} max={story.questions.length} />

        <button
          type="button"
          disabled={!complete}
          onClick={() => window.location.reload()}
          className={`rounded-[22px] px-6 py-3 text-sm font-extrabold shadow-lg transition ${
            complete
              ? "bg-violet-600 text-white hover:scale-[1.02]"
              : "bg-white/50 text-white/70 cursor-not-allowed"
          }`}
        >
          {t("storyWorld.nextStory") || "Next Story"}
        </button>

        <div className="rounded-[24px] border-[4px] border-white/55 bg-white/70 p-3 shadow-[0_18px_34px_rgba(15,23,42,0.14)] backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-extrabold text-slate-800">{t("storyWorld.levelLabel") || "Level"}</p>
            <p className="text-sm font-black text-emerald-700">1</p>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <p className="text-xs font-bold text-slate-500">{t("storyWorld.streakLabel") || "Streak"}</p>
            <p className="text-sm font-black text-violet-700">{correctCount}</p>
          </div>
        </div>
      </div>

      {complete && (
        <div className="mt-4 max-w-md mx-auto">
          <RewardPopup
            icon="📖"
            title={t("storyWorld.rewardTitle")}
            subtitle={t("storyWorld.rewardSubtitle", { score: correctCount, total: story.questions.length })}
          />
        </div>
      )}
    </GameLayout>
  );
};

export default StoryWorld;
