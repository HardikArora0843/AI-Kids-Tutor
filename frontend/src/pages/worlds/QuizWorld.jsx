import { useCallback } from "react";
import AnimatedBackground from "../../components/AnimatedBackground";
import GameLayout from "../../components/game/GameLayout";
import QuizArena from "../../components/game/quiz/QuizArena";
import useMentor from "../../components/mentor/useMentor";
import useTranslation from "../../utils/useTranslation";
import { saveProgress } from "../../services/api";

const QuizWorld = () => {
  const mentor = useMentor(localStorage.getItem("mentorCharacter") || "robot");
  const { t } = useTranslation();
  const questions = t("quizWorld.questions");

  const handleFinish = useCallback(
    ({ score, correctAnswers, totalQuestions, timeSpent, streak }) => {
      saveProgress({
        topic: "quiz",
        subTopic: "challenge-mode",
        score,
        totalQuestions,
        correctAnswers,
        timeSpent,
        streak,
        attempts: 1,
        difficultyLevel: "medium",
      }).catch((error) => console.error("Failed to save quiz progress:", error));
    },
    []
  );

  const labels = {
    startMessage: t("quizWorld.startMessage"),
    lowTimeMessage: t("quizWorld.lowTimeMessage"),
    completeMessage: t("quizWorld.completeMessage"),
    gameOverMessage: t("quizWorld.gameOverMessage"),
    correctMessage: t("quizWorld.correctMessage"),
    wrongMessage: t("quizWorld.wrongMessage"),
    timeoutMessage: t("quizWorld.timeoutMessage"),
    progressLabel: t("quizWorld.progressLabel"),
    questionLabel: t("quizWorld.questionLabel"),
    questionPrompt: t("quizWorld.questionPrompt"),
    comboReady: t("quizWorld.comboReady"),
    comboHot: t("quizWorld.comboHot"),
    livesLabel: t("quizWorld.livesLabel"),
    livesHint: t("quizWorld.livesHint"),
    streakShortLabel: t("quizWorld.streakShortLabel"),
    streakHint: t("quizWorld.streakHint"),
    timerLabel: t("quizWorld.timerLabel"),
    timerBarLabel: t("quizWorld.timerBarLabel"),
    scorePanelLabel: t("quizWorld.scorePanelLabel"),
    bonusHint: t("quizWorld.bonusHint"),
    rewardTitle: t("quizWorld.rewardTitle"),
    rewardSubtitle: t("quizWorld.rewardSubtitle"),
    gameOverTitle: t("quizWorld.gameOverTitle"),
    gameOverSubtitle: t("quizWorld.gameOverSubtitle"),
    resultsLabel: t("quizWorld.resultsLabel"),
    starLabel: t("quizWorld.starLabel"),
    bestStreakLabel: t("quizWorld.bestStreakLabel"),
    timeSpentLabel: t("quizWorld.timeSpentLabel"),
    playAgain: t("quizWorld.playAgain"),
    backToDashboard: t("quizWorld.backToDashboard"),
  };

  return (
    <GameLayout
      title={t("quizWorld.title")}
      subtitle={t("quizWorld.subtitle")}
      bgGradient="from-[#46105e] via-[#8a1ea7] to-[#ff4db8]"
      mentor={mentor}
    >
      <AnimatedBackground theme="quiz-arena" />
      <QuizArena questions={questions} mentor={mentor} labels={labels} onFinish={handleFinish} />
    </GameLayout>
  );
};

export default QuizWorld;
