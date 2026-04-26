import { useNavigate } from "react-router-dom";
import StarBadge from "./StarBadge";
import ProgressBar from "./ProgressBar";
import { useSound } from "../sounds/SoundProvider";

const GameCard = ({
  title,
  emoji,
  description,
  bgColor = "from-primary-400 to-primary-600",
  progress = 0,
  progressColor = "bg-white/90",
  stars = 0,
  maxStars = 5,
  locked = false,
  route,
}) => {
  const navigate = useNavigate();
  const { play } = useSound();

  const handleClick = () => {
    if (!locked && route) {
      play("click");
      navigate(route);
    }
  };

  const needsPractice = !locked && progress > 0 && progress < 50;

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={locked}
      aria-label={`${title}. ${Math.round(progress)} percent progress.`}
      className={`
        relative group
        w-full h-full rounded-3xl p-6 min-h-[240px]
        flex flex-col
        bg-gradient-to-br ${bgColor}
        text-left
        shadow-xl game-card-surface
        transition-all duration-300 ease-out will-change-transform
        ${
          locked
            ? "opacity-50 grayscale cursor-not-allowed"
            : "cursor-pointer hover:scale-105 hover:-translate-y-2 hover:shadow-2xl active:scale-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/70"
        }
        animate-slide-up
      `}
    >
      {/* Lock overlay */}
      {locked && (
        <div className="absolute inset-0 rounded-3xl bg-gray-900/30 flex items-center justify-center z-10">
          <span className="text-4xl">🔒</span>
        </div>
      )}

      {needsPractice && (
        <div className="absolute top-4 left-4 z-10 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-error-600 shadow-md">
          Practice
        </div>
      )}

      {/* Decorative circles */}
      <div className="absolute top-3 right-3 w-20 h-20 rounded-full bg-white/10 group-hover:scale-125 transition-transform duration-500" />
      <div className="absolute bottom-4 left-4 w-12 h-12 rounded-full bg-white/10 group-hover:scale-110 transition-transform duration-700" />

      {/* Emoji icon */}
      <div className="text-5xl mb-3 group-hover:animate-wiggle transition-transform">
        {emoji}
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-white mb-1 drop-shadow-sm">
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p className="text-white/80 text-sm mb-3">{description}</p>
      )}

      {/* Progress section */}
      <div className="mt-auto pt-6 space-y-2">
        <StarBadge filled={stars} total={maxStars} size="text-sm" />
        <ProgressBar value={progress} color={progressColor} />
      </div>
    </button>
  );
};

export default GameCard;
