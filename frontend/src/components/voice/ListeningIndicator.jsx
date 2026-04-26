const ListeningIndicator = ({ active = false, transcript = "", tone = "light" }) => {
  if (!active && !transcript) return null;

  const toneClass =
    tone === "dark"
      ? "bg-white text-gray-700 border border-primary-100"
      : "bg-white/20 text-white";

  return (
    <div className={`mt-4 rounded-2xl backdrop-blur-sm px-5 py-3 text-center shadow-lg ${toneClass}`}>
      {active ? (
        <div className="flex items-center justify-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-current animate-ping" />
          <span className="font-bold">Listening...</span>
        </div>
      ) : (
        <p className="text-sm font-semibold">I heard: "{transcript}"</p>
      )}
    </div>
  );
};

export default ListeningIndicator;
