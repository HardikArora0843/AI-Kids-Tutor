import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AnimatedBackground from "../components/AnimatedBackground";
import GameCard from "../components/GameCard";
import Mentor from "../components/mentor/Mentor";
import MentorSelector from "../components/mentor/MentorSelector";
import useMentor from "../components/mentor/useMentor";
import LockOverlay from "../components/LockOverlay";
import SoundToggle from "../components/SoundToggle";
import useScreenTime from "../hooks/useScreenTime";
import useTranslation from "../utils/useTranslation";
import { getStats, getAIRecommendation, getTestsForChild } from "../services/api";

// Static world config — progress/stars are filled from backend
const WORLD_CONFIG = [
  {
    key: "alphabet",
    title: "Alphabet World",
    emoji: "🔤",
    description: "Learn your ABCs!",
    bgColor: "from-primary-400 to-primary-600",
    route: "/child/alphabet",
    locked: false,
  },
  {
    key: "numbers",
    title: "Number World",
    emoji: "🔢",
    description: "Count & calculate!",
    bgColor: "from-secondary-400 to-kid-orange",
    route: "/child/numbers",
    locked: false,
  },
  {
    key: "colors",
    title: "Color & Shape Lab",
    emoji: "🎨",
    description: "Colors & shapes!",
    bgColor: "from-kid-pink to-kid-purple",
    route: "/child/colors",
    locked: false,
  },
  {
    key: "story",
    title: "Story Zone",
    emoji: "📖",
    description: "Read fun stories!",
    bgColor: "from-kid-teal to-success-500",
    route: "/child/stories",
    locked: false,
  },
  {
    key: "quiz",
    title: "Quiz Arena",
    emoji: "🏆",
    description: "Test your skills!",
    bgColor: "from-error-400 to-kid-pink",
    route: "/child/quiz",
    locked: false,
  },
  {
    key: "shapes",
    title: "Drawing Zone",
    emoji: "✏️",
    description: "Create art!",
    bgColor: "from-kid-sky to-kid-teal",
    route: "/child/drawing",
    locked: false,
  },
];

const ChildDashboard = () => {
  const { t, currentLanguage, setLanguage } = useTranslation();
  const [topicStats, setTopicStats] = useState({});
  const [totalStars, setTotalStars] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [showMentorSelector, setShowMentorSelector] = useState(false);
  const [recommendation, setRecommendation] = useState(null);
  const [customTests, setCustomTests] = useState([]);

  const navigate = useNavigate();

  const getSafeUser = () => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  };

  const user = getSafeUser();
  const childId = user?.id || user?._id;
  const { isLocked, status } = useScreenTime();
  const mentor = useMentor(
    localStorage.getItem("mentorCharacter") || "robot"
  );
  const { greet, triggerEvent } = mentor;

  // Greet on mount
  useEffect(() => {
    const timer = setTimeout(() => greet(), 800);
    return () => clearTimeout(timer);
  }, [greet]);

  // Check if first visit (no mentor selected yet)
  useEffect(() => {
    if (!localStorage.getItem("mentorCharacter")) {
      setShowMentorSelector(true);
    }
  }, []);

  useEffect(() => {
    if (!childId) {
      setIsLoading(false);
      setLoadError("Session invalid. Please sign in again.");
      return;
    }

    setIsLoading(true);
    setLoadError("");

    Promise.allSettled([
      getStats(childId),
      getAIRecommendation(childId),
      getTestsForChild(childId),
    ]).then(([statsResult, recommendationResult, testsResult]) => {
      if (statsResult.status === "fulfilled") {
        const statsMap = {};
        let stars = 0;
        let attempts = 0;
        statsResult.value.data.forEach((stat) => {
          statsMap[stat.topic] = stat;
          stars += Math.min(5, Math.floor(stat.averageAccuracy / 20));
          attempts += stat.totalAttempts;
        });
        setTopicStats(statsMap);
        setTotalStars(stars);
        setTotalAttempts(attempts);
      } else {
        setLoadError("Could not load progress yet. Please retry.");
      }

      if (recommendationResult.status === "fulfilled") {
        setRecommendation(recommendationResult.value.data);
      }

      if (testsResult.status === "fulfilled") {
        setCustomTests(testsResult.value.data.slice(0, 6));
      }

      setIsLoading(false);
    });
  }, [childId]);

  // Keep mentor recommendation voice aligned to selected UI language.
  useEffect(() => {
    if (!recommendation) return;

    const localizedHint =
      currentLanguage === "en"
        ? recommendation.message || t("dashboard.defaultTip")
        : t("dashboard.recommendationHint");

    const timer = setTimeout(() => {
      triggerEvent("HINT", { message: localizedHint });
    }, 2500);

    return () => clearTimeout(timer);
  }, [recommendation, currentLanguage, t, triggerEvent]);

  // Merge static config with live stats
  const worlds = WORLD_CONFIG.map((world) => {
    const stat = topicStats[world.key];
    const progress = stat ? stat.averageAccuracy : 0;
    const isWeak = stat && stat.averageAccuracy < 50;

    return {
      ...world,
      progress,
      progressColor: isWeak ? "bg-error-400" : "bg-white/90",
      stars: stat ? Math.min(5, Math.floor(stat.averageAccuracy / 20)) : 0,
    };
  });

  const formatRemaining = () => {
    if (!status) return null;
    const remaining = Math.max(0, status.dailyLimit * 60 - status.usedTime);
    const mins = Math.floor(remaining / 60);
    return `${mins}m left`;
  };

  const handleMentorSelect = (charId) => {
    mentor.selectCharacter(charId);
    localStorage.setItem("mentorCharacter", charId);
  };

  const tipMessage =
    currentLanguage === "en"
      ? recommendation?.message || t("dashboard.defaultTip")
      : t("dashboard.recommendationHint");

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 relative overflow-hidden">
      <AnimatedBackground />

      {/* Lock overlay */}
      {isLocked && <LockOverlay />}

      {/* Mentor selector modal */}
      {showMentorSelector && (
        <MentorSelector
          selected={mentor.character.id}
          onSelect={handleMentorSelect}
          onClose={() => setShowMentorSelector(false)}
        />
      )}
      {/* Floating Mentor */}
      <Mentor
        character={mentor.character}
        state={mentor.state}
        message={mentor.message}
        showBubble={mentor.showBubble}
        speechEnabled={mentor.speechEnabled}
        onToggleSpeech={mentor.toggleSpeech}
        roam
        size="lg"
      />

      {/* Header */}
      <header className="pt-10 pb-6 px-6 text-center relative z-10">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
          🌍 Adventure World
        </h1>
        <p className="text-lg text-gray-500 font-semibold">
          Choose your world and start learning! ✨
        </p>

        {/* Stats bar — live data */}
        <div className="flex items-center justify-center gap-4 mt-4 flex-wrap">
          <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-md">
            <span className="text-xl">⭐</span>
            <span className="font-bold text-gray-700">{totalStars} Stars</span>
          </div>
          <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-md">
            <span className="text-xl">🎮</span>
            <span className="font-bold text-gray-700">{totalAttempts} Played</span>
          </div>
          {status && (
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-md">
              <span className="text-xl">⏱️</span>
              <span className="font-bold text-gray-700">{formatRemaining()}</span>
            </div>
          )}
          {user?.name && (
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-md">
              <span className="text-xl">👋</span>
              <span className="font-bold text-gray-700">{user.name}</span>
            </div>
          )}
          {/* Change mentor button */}
          <button
            onClick={() => setShowMentorSelector(true)}
            className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
          >
            <span className="text-xl">{mentor.character.emoji}</span>
            <span className="font-bold text-gray-700 text-sm">Change Buddy</span>
          </button>
          <label className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-md">
            <span className="text-sm font-bold text-gray-700">{t("dashboard.languageLabel")}</span>
            <select
              value={currentLanguage}
              onChange={(event) => setLanguage(event.target.value)}
              className="bg-transparent text-sm font-bold text-gray-700 outline-none cursor-pointer"
              aria-label={t("dashboard.languageLabel")}
            >
              <option value="en">{t("dashboard.languageOptions.en")}</option>
              <option value="hi">{t("dashboard.languageOptions.hi")}</option>
            </select>
          </label>
          <SoundToggle />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 pb-16 relative z-10 space-y-8">
        <section className="bg-white/85 backdrop-blur-sm rounded-3xl p-5 border border-white shadow-md">
          <div className="flex items-start gap-3">
            <span className="text-2xl">{mentor.character.emoji}</span>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-primary-600">Buddy Tip</p>
              <p className="text-sm text-gray-700 font-semibold mt-1">{tipMessage}</p>
            </div>
          </div>
        </section>

        {loadError && (
          <section className="rounded-2xl border border-error-200 bg-error-500/10 p-4">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <p className="text-error-600 text-sm font-semibold">{loadError}</p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="px-3 py-1.5 rounded-lg bg-white text-error-600 text-xs font-bold border border-error-200"
              >
                Retry
              </button>
            </div>
          </section>
        )}

        {customTests.length > 0 && (
          <section className="mb-8 bg-white/85 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white">
            <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Custom Tests</h2>
                <p className="text-sm text-gray-500">
                  New challenges made by your parent. Completed tests disappear automatically.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-secondary-100 text-secondary-500 text-xs font-bold">
                {customTests.length} ready
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {customTests.map((test) => (
                <button
                  key={test._id}
                  onClick={() => navigate(`/child/test/${test._id}`)}
                  className="h-full min-h-[190px] text-left rounded-2xl p-4 bg-gradient-to-br from-secondary-50 to-primary-50 border border-primary-100 hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl">🧪</span>
                    <span className="px-2 py-1 rounded-lg bg-white text-xs font-bold text-gray-500 capitalize">
                      {test.difficulty}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-800 capitalize">{test.topic} Test</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {test.numberOfQuestions} questions
                  </p>
                  <span className="inline-block mt-4 text-sm font-bold text-primary-600">
                    Start Challenge
                  </span>
                </button>
              ))}
            </div>
          </section>
        )}

        {isLoading ? (
          <section className="rounded-3xl bg-white/80 border border-white p-12 text-center shadow-lg">
            <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600 font-semibold">Loading your adventure map...</p>
          </section>
        ) : (
          <section>
            <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
              <h2 className="text-xl font-bold text-gray-800">Learning Worlds</h2>
              {/* <p className="text-xs font-bold text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
                Creative mode unlocked
              </p> */}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
              {worlds.map((world, index) => (
                <div key={world.title} className="h-full" style={{ animationDelay: `${index * 0.1}s` }}>
                  <GameCard {...world} />
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default ChildDashboard;
