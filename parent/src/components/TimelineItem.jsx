import { TOPIC_LABELS } from "../constants/topics";

const TimelineItem = ({ topic, score, totalQuestions, accuracy, date, difficultyLevel }) => {
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const getAccuracyColor = (acc) => {
    if (acc >= 75) return "text-green-600";
    if (acc >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-0">
      <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500 text-[11px] font-extrabold text-white">
        {(TOPIC_LABELS[topic] || topic).slice(0, 2).toUpperCase()}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h4 className="font-semibold text-gray-800 text-sm capitalize">
            {TOPIC_LABELS[topic] || topic}
          </h4>
          <span className={`text-sm font-bold ${getAccuracyColor(accuracy)}`}>{accuracy}%</span>
        </div>
        <p className="text-xs text-gray-500">
          {score}/{totalQuestions} correct - {difficultyLevel || "easy"} - {formattedDate}
        </p>
      </div>
    </div>
  );
};

export default TimelineItem;
