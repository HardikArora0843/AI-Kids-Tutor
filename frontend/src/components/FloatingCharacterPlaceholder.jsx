const FloatingCharacterPlaceholder = () => {
  return (
    <div className="fixed top-4 right-4 z-40 animate-float">
      <div className="relative">
        {/* Glow ring */}
        <div className="absolute inset-0 rounded-full bg-primary-400 opacity-20 blur-md animate-pulse-glow" />

        {/* Character circle */}
        <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-primary-400 to-kid-purple flex items-center justify-center shadow-xl shadow-primary-500/30 border-4 border-white">
          <span className="text-2xl">🤖</span>
        </div>

        {/* Speech bubble */}
        <div className="absolute -bottom-8 -left-12 bg-white rounded-xl px-3 py-1 shadow-md text-xs font-bold text-primary-600 whitespace-nowrap animate-bounce-soft">
          Hi there! 👋
          {/* Bubble arrow */}
          <div className="absolute -top-1 right-4 w-2 h-2 bg-white rotate-45" />
        </div>
      </div>
    </div>
  );
};

export default FloatingCharacterPlaceholder;
