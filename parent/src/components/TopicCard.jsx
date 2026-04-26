import { TOPIC_LABELS } from "../constants/topics";

const TopicCard = ({ topic, averageAccuracy, totalAttempts, totalTimeSpent, bestAccuracy }) => {
  const label = TOPIC_LABELS[topic] || topic;

  const getAccuracyColor = (acc) => {
    if (acc >= 75) return "text-green-600 bg-green-50";
    if (acc >= 50) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const getStatusLabel = (acc) => {
    if (acc >= 75) return "High";
    if (acc >= 50) return "Medium";
    return "Needs Support";
  };

  const getBarColor = (acc) => {
    if (acc >= 75) return "bg-green-500";
    if (acc >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  const minutes = Math.round((totalTimeSpent || 0) / 60);

  return (
    <div className="bg-white rounded-xl p-4 border border-gray-100 hover:shadow-sm transition-shadow">
      <div className="flex items-center gap-3 mb-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500 text-xs font-extrabold text-white">
          {label.slice(0, 2).toUpperCase()}
        </span>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-800">{label}</h4>
          <p className="text-xs text-gray-500">
            {totalAttempts} attempt{totalAttempts !== 1 ? "s" : ""} - {minutes}m spent
          </p>
        </div>
        <div className={`px-3 py-1 rounded-lg text-sm font-bold ${getAccuracyColor(averageAccuracy)}`}>
          {averageAccuracy}% - {getStatusLabel(averageAccuracy)}
        </div>
      </div>

      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${getBarColor(averageAccuracy)}`}
          style={{ width: `${averageAccuracy}%` }}
        />
      </div>

      {bestAccuracy !== undefined && (
        <p className="text-xs text-gray-500 mt-2">Best: {bestAccuracy}%</p>
      )}
    </div>
  );
};

export default TopicCard;
