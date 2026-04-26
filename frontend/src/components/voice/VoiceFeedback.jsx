const FEEDBACK_STYLES = {
  correct: "bg-success-500/25 text-white border-success-400/40",
  close: "bg-secondary-400/25 text-white border-secondary-300/40",
  incorrect: "bg-error-500/25 text-white border-error-400/40",
  unavailable: "bg-white/20 text-white border-white/30",
};

const DARK_FEEDBACK_STYLES = {
  correct: "bg-success-500/10 text-success-600 border-success-400/30",
  close: "bg-secondary-100 text-secondary-500 border-secondary-300/40",
  incorrect: "bg-error-500/10 text-error-600 border-error-400/30",
  unavailable: "bg-gray-50 text-gray-500 border-gray-200",
};

const VoiceFeedback = ({ result, transcript, tone = "light" }) => {
  if (!result) return null;

  const styles = tone === "dark" ? DARK_FEEDBACK_STYLES : FEEDBACK_STYLES;
  const transcriptClass = tone === "dark" ? "text-gray-400" : "text-white/75";

  return (
    <div
      className={`
        mt-4 rounded-2xl px-5 py-4 text-center font-bold border
        animate-slide-up ${styles[result.status] || styles.unavailable}
      `}
    >
      <p>{result.message}</p>
      {transcript && (
        <p className={`mt-1 text-xs font-semibold ${transcriptClass}`}>
          You said: "{transcript}"
        </p>
      )}
    </div>
  );
};

export default VoiceFeedback;
