const StarBadge = ({ filled = 0, total = 5, size = "text-xl" }) => {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={`${size} transition-transform duration-300 ${
            i < filled
              ? "drop-shadow-[0_0_4px_rgba(251,191,36,0.6)]"
              : "opacity-30 grayscale"
          }`}
          style={{
            animationDelay: `${i * 0.1}s`,
          }}
        >
          ⭐
        </span>
      ))}
    </div>
  );
};

export default StarBadge;
