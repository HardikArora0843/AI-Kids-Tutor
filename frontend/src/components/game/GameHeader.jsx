const GameHeader = ({ score = 0, current = 0, total = 1, label = "Progress" }) => {
  const percent = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-3 shadow-lg mb-4">
      <div className="flex items-center justify-between gap-4 text-sm md:text-base text-white font-bold mb-2">
        <span>{label}: {current}/{total}</span>
        <span>Score: {score}</span>
      </div>
      <div className="h-3 bg-white/25 rounded-full overflow-hidden">
        <div
          className="h-full bg-white rounded-full transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};

export default GameHeader;
