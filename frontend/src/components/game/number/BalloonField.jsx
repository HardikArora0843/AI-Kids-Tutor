import { useMemo } from "react";
import Balloon from "./Balloon";

const BALLOON_COLORS = ["#ff6b7a", "#4f9cff", "#64db5c", "#b16cff", "#ffb02e", "#27d2d8"];

const POSITION_PRESETS = [
  { left: 12, bottom: 16 },
  { left: 30, bottom: 26 },
  { left: 50, bottom: 18 },
  { left: 68, bottom: 28 },
  { left: 84, bottom: 17 },
  { left: 22, bottom: 43 },
  { left: 58, bottom: 46 },
];

const BalloonField = ({ options, poppedValue, wrongValue, onSelect, seedKey }) => {
  const balloons = useMemo(
    () =>
      options.map((value, index) => {
        const preset = POSITION_PRESETS[index % POSITION_PRESETS.length];
        const horizontalNudge = ((seedKey + 1) * (index + 3) * 7) % 8 - 4;
        const verticalNudge = ((seedKey + 2) * (index + 5) * 5) % 7 - 3;

        return {
          value,
          color: BALLOON_COLORS[(seedKey + index) % BALLOON_COLORS.length],
          left: Math.max(10, Math.min(88, preset.left + horizontalNudge)),
          bottom: Math.max(16, Math.min(56, preset.bottom + verticalNudge)),
          delay: `${(index * 0.35 + (seedKey % 3) * 0.18).toFixed(2)}s`,
          zIndex: 10 + index,
        };
      }),
    [options, seedKey]
  );

  return (
    <div className="number-balloon-field" role="group" aria-label="Floating number balloons">
      {balloons.map((balloon) => (
        <Balloon
          key={`${seedKey}-${balloon.value}`}
          value={balloon.value}
          color={balloon.color}
          onClick={() => onSelect(balloon.value)}
          isPopped={poppedValue === balloon.value}
          isWrong={wrongValue === balloon.value}
          animationDelay={balloon.delay}
          style={{
            left: `${balloon.left}%`,
            bottom: `${balloon.bottom}%`,
            zIndex: balloon.zIndex,
          }}
        />
      ))}
    </div>
  );
};

export default BalloonField;
