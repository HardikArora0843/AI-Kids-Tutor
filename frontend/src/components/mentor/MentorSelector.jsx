import { useEffect, useRef } from "react";
import { MENTOR_CHARACTERS } from "./MentorController";

const characters = Object.values(MENTOR_CHARACTERS);

const MentorSelector = ({ selected, onSelect, onClose }) => {
  const dialogRef = useRef(null);
  const confirmButtonRef = useRef(null);

  useEffect(() => {
    confirmButtonRef.current?.focus();

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }

      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusable = dialogRef.current.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const isShift = event.shiftKey;

      if (isShift && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!isShift && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center px-4"
      role="presentation"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        className="bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl animate-pop"
        role="dialog"
        aria-modal="true"
        aria-labelledby="mentor-selector-title"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="mentor-selector-title" className="text-2xl font-bold text-gray-800 text-center mb-2">
          Choose Your Mentor! 🎭
        </h2>
        <p className="text-gray-500 text-center text-sm mb-6">
          Pick a buddy to guide your learning adventure
        </p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {characters.map((char) => (
            <button
              key={char.id}
              onClick={() => onSelect(char.id)}
              type="button"
              aria-pressed={selected === char.id}
              aria-label={`Choose ${char.name} mentor`}
              className={`
                p-5 rounded-2xl flex flex-col items-center gap-2
                transition-all duration-200 cursor-pointer
                border-3
                ${
                  selected === char.id
                    ? "border-current shadow-lg scale-105"
                    : "border-gray-100 hover:border-gray-200 hover:shadow-md"
                }
              `}
              style={
                selected === char.id
                  ? { borderColor: char.color, backgroundColor: `${char.color}10` }
                  : {}
              }
            >
              <span className="text-5xl">{char.emoji}</span>
              <span
                className="font-bold text-sm"
                style={{ color: selected === char.id ? char.color : "#6b7280" }}
              >
                {char.name}
              </span>
            </button>
          ))}
        </div>

        <button
          ref={confirmButtonRef}
          type="button"
          onClick={onClose}
          className="w-full py-3 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-xl shadow-lg transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
        >
          Let's Go! ✨
        </button>
      </div>
    </div>
  );
};

export default MentorSelector;
