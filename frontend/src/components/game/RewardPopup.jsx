import { useEffect } from "react";
import { useSound } from "../../sounds/SoundProvider";

const STAR_POSITIONS = [
  ["-86px", "-54px"],
  ["82px", "-62px"],
  ["-72px", "46px"],
  ["70px", "54px"],
  ["0px", "-92px"],
];

const RewardPopup = ({ icon = "⭐", title, subtitle, children }) => {
  const { play } = useSound();

  useEffect(() => {
    play("reward");
  }, [play]);

  return (
    <div className="reward-card bg-white/95 rounded-[2rem] p-10 text-center shadow-2xl">
      {STAR_POSITIONS.map(([x, y], index) => (
        <span
          key={`${x}-${y}`}
          className="absolute left-1/2 top-1/2 text-2xl pointer-events-none"
          style={{ "--star-x": x, "--star-y": y, animation: `star-burst 0.9s ease-out ${index * 0.08}s forwards` }}
        >
          ⭐
        </span>
      ))}
      <span className="text-7xl block mb-4">{icon}</span>
      <h2 className="text-3xl font-bold text-gray-800">{title}</h2>
      {subtitle && <p className="text-gray-500 text-lg mt-2">{subtitle}</p>}
      {children}
    </div>
  );
};

export default RewardPopup;
