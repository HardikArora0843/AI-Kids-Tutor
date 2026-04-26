const VoiceButton = ({
  listening = false,
  supported = true,
  disabled = false,
  onStart,
  onStop,
}) => {
  const handleClick = () => {
    if (disabled || !supported) return;
    if (listening) {
      onStop?.();
    } else {
      onStart?.();
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || !supported}
      className={`
        w-24 h-24 rounded-full flex items-center justify-center
        text-4xl font-bold shadow-2xl border-4 border-white/60
        transition-all duration-300 cursor-pointer
        ${
          listening
            ? "bg-error-500 text-white animate-pulse-glow scale-110"
            : "bg-white text-primary-600 hover:scale-110 hover:-translate-y-1"
        }
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
      `}
      aria-label={listening ? "Stop listening" : "Start listening"}
    >
      {listening ? "■" : "🎤"}
    </button>
  );
};

export default VoiceButton;
