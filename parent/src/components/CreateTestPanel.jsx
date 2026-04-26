import { useState } from "react";
import { createTest } from "../services/api";
import { TOPIC_OPTIONS } from "../constants/topics";

const DIFFICULTIES = [
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
  { value: "adaptive", label: "Adaptive" },
];

const CreateTestPanel = ({ selectedChild, childName, aiAnalysis }) => {
  const [topic, setTopic] = useState("alphabet");
  const [difficulty, setDifficulty] = useState("easy");
  const [numberOfQuestions, setNumberOfQuestions] = useState(5);
  const [weakFocus, setWeakFocus] = useState(true);
  const [createdTest, setCreatedTest] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");

  const weakTopics = aiAnalysis?.weakTopics || [];
  const presets = [
    { id: "remedial", label: "Quick remedial 5Q", topic: weakTopics[0]?.topic || "alphabet", difficulty: "easy", numberOfQuestions: 5, weakFocus: true },
    { id: "confidence", label: "Confidence boost 3Q", topic: "numbers", difficulty: "easy", numberOfQuestions: 3, weakFocus: false },
    { id: "challenge", label: "Challenge mode 8Q", topic: "shapes", difficulty: "hard", numberOfQuestions: 8, weakFocus: true },
  ];

  const handleCreateTest = async () => {
    if (!selectedChild) return;

    setLoading(true);
    setMessage("");
    setMessageType("info");

    try {
      const { data } = await createTest({
        childId: selectedChild,
        topic,
        difficulty,
        numberOfQuestions,
        weakFocus,
      });

      setCreatedTest(data.test);
      setMessageType("success");
      setMessage(
        `Created a ${data.test.difficulty} ${data.test.topic} test with ${data.test.numberOfQuestions} questions.`
      );
    } catch (error) {
      setMessageType("error");
      setMessage(error.message || "Could not create test.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <h3 className="text-sm font-semibold text-gray-500 flex items-center gap-2">
            <span className="text-lg">🧪</span> Create Test
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            Generate a custom challenge for {childName || "your child"} using progress insights.
          </p>
        </div>
        {weakTopics.length > 0 && (
          <span className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs font-bold">
            {weakTopics.length} weak focus area{weakTopics.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {presets.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => {
              setTopic(preset.topic);
              setDifficulty(preset.difficulty);
              setNumberOfQuestions(preset.numberOfQuestions);
              setWeakFocus(preset.weakFocus);
            }}
            className="px-3 py-1.5 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 text-xs font-semibold text-gray-700"
          >
            {preset.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <label className="block">
          <span className="block text-xs font-semibold text-gray-500 mb-2">Topic</span>
          <select
            value={topic}
            onChange={(event) => setTopic(event.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 outline-none focus:border-blue-400"
          >
            {TOPIC_OPTIONS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="block text-xs font-semibold text-gray-500 mb-2">Difficulty</span>
          <select
            value={difficulty}
            onChange={(event) => setDifficulty(event.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 outline-none focus:border-blue-400"
          >
            {DIFFICULTIES.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="block text-xs font-semibold text-gray-500 mb-2">Questions</span>
          <input
            type="number"
            min={1}
            max={20}
            value={numberOfQuestions}
            onChange={(event) => setNumberOfQuestions(Number(event.target.value))}
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 outline-none focus:border-blue-400"
          />
        </label>

        <div className="flex items-end">
          <button
            onClick={handleCreateTest}
            disabled={loading || !selectedChild}
            className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer disabled:opacity-50"
          >
            {loading ? "Generating..." : "Generate Test"}
          </button>
        </div>
      </div>

      <label className="flex items-center gap-3 mt-4 cursor-pointer">
        <input
          type="checkbox"
          checked={weakFocus}
          onChange={(event) => setWeakFocus(event.target.checked)}
          className="h-4 w-4 accent-blue-500"
        />
        <span className="text-sm font-semibold text-gray-600">
          Focus on weak areas when progress data is available
        </span>
      </label>

      {weakTopics.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {weakTopics.map((item) => (
            <span
              key={item.topic}
              className="px-2 py-1 bg-red-50 text-red-600 rounded-lg text-xs font-semibold capitalize"
            >
              {item.topic} ({item.averageAccuracy}%)
            </span>
          ))}
        </div>
      )}

      {message && (
        <div
          className={`mt-4 p-3 rounded-xl text-sm font-semibold ${
            messageType === "success"
              ? "bg-green-50 text-green-700"
              : messageType === "error"
              ? "bg-red-50 text-red-700"
              : "bg-blue-50 text-blue-700"
          }`}
        >
          {message}
        </div>
      )}

      {createdTest && (
        <div className="mt-4 rounded-xl border border-gray-100 p-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">
            Latest Generated Test
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="px-2 py-1 rounded-lg bg-gray-100 text-gray-600 text-xs font-bold capitalize">
              {createdTest.topic}
            </span>
            <span className="px-2 py-1 rounded-lg bg-gray-100 text-gray-600 text-xs font-bold capitalize">
              {createdTest.difficulty}
            </span>
            <span className="px-2 py-1 rounded-lg bg-gray-100 text-gray-600 text-xs font-bold">
              {createdTest.numberOfQuestions} questions
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            It will appear on the child dashboard under Custom Tests.
          </p>
        </div>
      )}
    </div>
  );
};

export default CreateTestPanel;
