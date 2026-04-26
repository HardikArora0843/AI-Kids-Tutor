import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AnimatedButton from "../components/AnimatedButton";
import StarBadge from "../components/StarBadge";
import Mentor from "../components/mentor/Mentor";
import useMentor from "../components/mentor/useMentor";
import VoiceButton from "../components/voice/VoiceButton";
import ListeningIndicator from "../components/voice/ListeningIndicator";
import VoiceFeedback from "../components/voice/VoiceFeedback";
import { checkPronunciation } from "../components/voice/pronunciation";
import { getTestsForChild, submitTest } from "../services/api";

const TestAttempt = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const childId = user?.id || user?._id;
  const mentor = useMentor(localStorage.getItem("mentorCharacter") || "robot");

  const [test, setTest] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [spokenText, setSpokenText] = useState("");
  const [voiceResult, setVoiceResult] = useState(null);
  const [voiceSupported, setVoiceSupported] = useState(
    () =>
      typeof window !== "undefined" &&
      Boolean(window.SpeechRecognition || window.webkitSpeechRecognition)
  );
  const startTimeRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    startTimeRef.current = Date.now();
    const timer = setTimeout(() => {
      mentor.triggerEvent("START_ACTIVITY", { message: "Let's take a challenge!" });
    }, 600);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    if (!childId || !testId) return;

    getTestsForChild(childId)
      .then(({ data }) => {
        const found = data.find((item) => item._id === testId);
        if (!found) {
          setError("This test was not found.");
          return;
        }
        setTest(found);
      })
      .catch((err) => {
        setError(err.message || "Could not load test.");
      })
      .finally(() => setLoading(false));
  }, [testId, childId]);

  const question = test?.questions?.[currentQuestion];
  const isLastQuestion = test && currentQuestion === test.questions.length - 1;

  const handleAnswer = (answer) => {
    if (!question || selected) return;

    setSelected(answer);
    const nextAnswers = [...answers];
    nextAnswers[currentQuestion] = answer;
    setAnswers(nextAnswers);

    if (answer === question.correctAnswer) {
      mentor.onCorrect();
    } else {
      mentor.triggerEvent("WRONG_ANSWER", { message: "Try again! You're learning." });
    }

    setTimeout(async () => {
      if (!isLastQuestion) {
        setCurrentQuestion((prev) => prev + 1);
        setSelected("");
        setSpokenText("");
        setVoiceResult(null);
        return;
      }

      try {
        const startedAt = startTimeRef.current || Date.now();
        const timeSpent = Math.round((Date.now() - startedAt) / 1000);
        const { data } = await submitTest({
          testId,
          answers: nextAnswers,
          timeSpent,
        });
        setResult(data);
        mentor.onComplete();
      } catch (err) {
        setError(err.message || "Could not submit test.");
      }
    }, 900);
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      const fallback = {
        status: "unavailable",
        message: "Voice is not available here. You can tap an answer instead.",
      };
      setVoiceSupported(false);
      setVoiceResult(fallback);
      mentor.triggerEvent("HINT", { message: fallback.message });
      return;
    }

    if (!question || selected || isListening) return;

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognitionRef.current = recognition;

    setSpokenText("");
    setVoiceResult(null);
    setIsListening(true);
    mentor.triggerEvent("HINT", { message: "Say your answer out loud." });

    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript || "";
      setSpokenText(transcript);

      const matchedOption = question.options.find((option) => {
        const match = checkPronunciation(transcript, option);
        return match.status === "correct" || match.status === "close";
      });

      if (matchedOption) {
        const match = checkPronunciation(transcript, matchedOption);
        setVoiceResult(match);
        mentor.triggerEvent("HINT", { message: `I heard ${matchedOption}.` });
        setTimeout(() => handleAnswer(matchedOption), 500);
      } else {
        const retry = {
          status: "incorrect",
          message: "Let's try again or tap an answer.",
        };
        setVoiceResult(retry);
        mentor.triggerEvent("WRONG_ANSWER", { message: retry.message });
      }

      recognition.stop();
    };

    recognition.onerror = (event) => {
      const isPermissionIssue = event.error === "not-allowed" || event.error === "service-not-allowed";
      const result = {
        status: "unavailable",
        message: isPermissionIssue
          ? "Microphone is blocked. You can tap an answer instead."
          : "Try speaking louder.",
      };
      setVoiceResult(result);
      mentor.triggerEvent("HINT", { message: result.message });
    };

    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };

    try {
      recognition.start();
    } catch {
      const result = {
        status: "unavailable",
        message: "Voice is taking a break. You can tap an answer instead.",
      };
      setIsListening(false);
      setVoiceResult(result);
      mentor.triggerEvent("HINT", { message: result.message });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50">
        <p className="text-gray-500 font-bold">Loading test...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 px-6">
        <div className="bg-white rounded-3xl p-8 text-center shadow-xl max-w-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-3">Test unavailable</h1>
          <p className="text-gray-500 mb-6">{error}</p>
          <AnimatedButton onClick={() => navigate("/child")}>Back to Dashboard</AnimatedButton>
        </div>
      </div>
    );
  }

  if (result) {
    const stars = Math.round((result.accuracy / 100) * 5);
    const message =
      result.accuracy >= 80
        ? "Amazing work! You're getting stronger!"
        : result.accuracy >= 50
        ? "Great effort! Keep practicing and you'll level up!"
        : "Great effort! Let's improve together!";

    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-400 to-kid-purple flex items-center justify-center px-6">
        <Mentor
          character={mentor.character}
          state={mentor.state}
          message={mentor.message}
          showBubble={mentor.showBubble}
          speechEnabled={mentor.speechEnabled}
          onToggleSpeech={mentor.toggleSpeech}
        />
        <div className="bg-white/95 rounded-[2rem] p-10 max-w-md w-full text-center shadow-2xl animate-pop">
          <span className="text-6xl block mb-4">🏆</span>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Test Complete!</h1>
          <p className="text-gray-500 text-lg mb-4">{message}</p>
          <p className="text-2xl font-bold text-primary-600 mb-4">
            {result.score} / {result.totalQuestions}
          </p>
          <div className="flex justify-center mb-6">
            <StarBadge filled={stars} total={5} size="text-3xl" />
          </div>
          <p className="text-sm font-semibold text-gray-500 mb-8">
            Accuracy: {result.accuracy}%
          </p>
          <AnimatedButton size="lg" onClick={() => navigate("/child")}>
            Back to Dashboard
          </AnimatedButton>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-400 to-kid-orange px-6 py-6 relative overflow-hidden">
      <Mentor
        character={mentor.character}
        state={mentor.state}
        message={mentor.message}
        showBubble={mentor.showBubble}
        speechEnabled={mentor.speechEnabled}
        onToggleSpeech={mentor.toggleSpeech}
      />

      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <AnimatedButton variant="secondary" size="sm" onClick={() => navigate("/child")}>
            Back
          </AnimatedButton>
          <div className="bg-white/25 backdrop-blur-sm rounded-2xl px-4 py-2 text-white font-bold">
            Q{currentQuestion + 1}/{test.questions.length}
          </div>
        </div>

        <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-2xl">
          <div className="flex items-center justify-between gap-3 mb-6">
            <span className="px-3 py-1 rounded-lg bg-primary-50 text-primary-600 text-xs font-bold capitalize">
              {test.topic}
            </span>
            <span className="px-3 py-1 rounded-lg bg-secondary-100 text-secondary-600 text-xs font-bold capitalize">
              {test.difficulty}
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 text-center">
            {question.question}
          </h1>

          <div className="mb-8 flex flex-col items-center rounded-3xl bg-primary-50 p-5">
            <p className="text-sm font-bold text-primary-600 mb-3">
              Want to answer with your voice?
            </p>
            <VoiceButton
              listening={isListening}
              supported={voiceSupported}
              disabled={Boolean(selected)}
              onStart={startListening}
              onStop={stopListening}
            />
            <ListeningIndicator active={isListening} transcript={spokenText} tone="dark" />
            <VoiceFeedback result={voiceResult} transcript={spokenText} tone="dark" />
            {!voiceSupported && (
              <p className="mt-3 text-sm font-semibold text-gray-500">
                Voice is optional. Tap an answer to keep going.
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {question.options.map((option) => {
              const isSelected = selected === option;
              const isCorrect = option === question.correctAnswer;
              const showFeedback = Boolean(selected);
              const style =
                showFeedback && isCorrect
                  ? "bg-success-500 text-white shadow-success-500/30"
                  : showFeedback && isSelected
                  ? "bg-error-500 text-white shadow-error-500/30"
                  : "bg-gray-50 hover:bg-primary-50 text-gray-800";

              return (
                <button
                  key={option}
                  onClick={() => handleAnswer(option)}
                  disabled={Boolean(selected)}
                  className={`${style} rounded-2xl px-6 py-5 text-xl font-bold shadow-lg transition-all cursor-pointer hover:scale-105 active:scale-95 disabled:cursor-default disabled:hover:scale-100`}
                >
                  {option}
                </button>
              );
            })}
          </div>

          <div className="w-full h-3 bg-gray-100 rounded-full mt-8 overflow-hidden">
            <div
              className="h-full bg-primary-500 rounded-full transition-all duration-500"
              style={{ width: `${((currentQuestion + 1) / test.questions.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestAttempt;
