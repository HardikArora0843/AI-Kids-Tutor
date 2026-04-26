import MentorBubble from "./MentorBubble";
import { MENTOR_STATES } from "./MentorController";

const STATE_EXPRESSIONS = {
  [MENTOR_STATES.idle]: "",
  [MENTOR_STATES.speaking]: "LIVE",
  [MENTOR_STATES.happy]: "YAY",
  [MENTOR_STATES.thinking]: "HMM",
  [MENTOR_STATES.celebrating]: "WIN",
};

const STATE_ANIMATIONS = {
  [MENTOR_STATES.idle]: "animate-float",
  [MENTOR_STATES.speaking]: "animate-pulse-glow",
  [MENTOR_STATES.happy]: "animate-bounce-soft",
  [MENTOR_STATES.thinking]: "animate-wiggle",
  [MENTOR_STATES.celebrating]: "animate-pop",
};

const STATE_FACE_CLASS = {
  [MENTOR_STATES.idle]: "mentor-face--idle",
  [MENTOR_STATES.speaking]: "mentor-face--speaking",
  [MENTOR_STATES.happy]: "mentor-face--happy",
  [MENTOR_STATES.thinking]: "mentor-face--thinking",
  [MENTOR_STATES.celebrating]: "mentor-face--celebrating",
};

const POSITION_CLASSES = {
  "bottom-right": "fixed bottom-4 right-3 md:bottom-6 md:right-6",
  "bottom-left": "fixed bottom-4 left-3 md:bottom-6 md:left-6",
  "top-right": "fixed top-6 right-6",
  inline: "relative",
};

const SIZE_CLASSES = {
  sm: "mentor-shell--sm",
  md: "mentor-shell--md",
  lg: "mentor-shell--lg",
};

const Mentor = ({
  character,
  state = MENTOR_STATES.idle,
  message = "",
  showBubble = false,
  speechEnabled = true,
  onToggleSpeech,
  position = "bottom-right",
  size = "md",
  roam = false,
}) => {
  const expression = STATE_EXPRESSIONS[state] || "";
  const animClass = STATE_ANIMATIONS[state] || "animate-float";
  const faceClass = STATE_FACE_CLASS[state] || "mentor-face--idle";

  const shellClasses = [
    POSITION_CLASSES[position] || POSITION_CLASSES["bottom-right"],
    "z-40",
    "mentor-shell",
    SIZE_CLASSES[size] || SIZE_CLASSES.md,
    roam ? "animate-mentor-roam" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={shellClasses}>
      <div className="relative">
        <MentorBubble message={message} visible={showBubble} />

        <div className="relative group">
          <button
            type="button"
            className={`
              mentor-robot
              ${animClass}
              cursor-pointer
              transition-transform duration-200
              hover:scale-[1.03] active:scale-[0.98]
            `}
            style={{ "--mentor-accent": character?.color || "#3b82f6" }}
            onClick={onToggleSpeech}
            title={speechEnabled ? "Click to mute" : "Click to unmute"}
            aria-label={
              speechEnabled
                ? "Mentor speech enabled. Click to mute."
                : "Mentor speech muted. Click to unmute."
            }
            aria-pressed={speechEnabled}
          >
            <span className="mentor-robot__antenna mentor-robot__antenna--left" />
            <span className="mentor-robot__antenna mentor-robot__antenna--right" />
            <span className="mentor-robot__ear mentor-robot__ear--left" />
            <span className="mentor-robot__ear mentor-robot__ear--right" />

            <span className="mentor-robot__head">
              <span className="mentor-robot__visor">
                <span className={`mentor-face ${faceClass}`}>
                  <span className="mentor-face__brow mentor-face__brow--left" />
                  <span className="mentor-face__brow mentor-face__brow--right" />
                  <span className="mentor-face__eyes">
                    <span className="mentor-face__eye mentor-face__eye--left" />
                    <span className="mentor-face__eye mentor-face__eye--right" />
                  </span>
                  <span className="mentor-face__blush mentor-face__blush--left" />
                  <span className="mentor-face__blush mentor-face__blush--right" />
                  <span className="mentor-face__mouth" />
                </span>
              </span>
              <span className={`mentor-robot__mic ${state === MENTOR_STATES.speaking ? "mentor-robot__mic--live" : ""}`}>
                <span className="mentor-robot__mic-led" />
              </span>
            </span>

            <span className="mentor-robot__neck" />

            <span className="mentor-robot__body">
              <span className="mentor-robot__badge">
                <span className="mentor-robot__badge-text">Tutor</span>
              </span>
            </span>

            <span className="mentor-robot__arm mentor-robot__arm--left">
              <span className="mentor-robot__forearm mentor-robot__forearm--left">
                <span className="mentor-robot__hand mentor-robot__hand--left" />
              </span>
            </span>

            <span className="mentor-robot__arm mentor-robot__arm--right">
              <span className="mentor-robot__forearm mentor-robot__forearm--right">
                <span className="mentor-robot__hand mentor-robot__hand--right" />
              </span>
            </span>

            <span className="mentor-robot__leg mentor-robot__leg--left">
              <span className="mentor-robot__foot mentor-robot__foot--left" />
            </span>
            <span className="mentor-robot__leg mentor-robot__leg--right">
              <span className="mentor-robot__foot mentor-robot__foot--right" />
            </span>
          </button>

          {expression && state !== MENTOR_STATES.idle && (
            <span className="mentor-state-badge absolute -top-1 right-2 animate-pop">
              {expression}
            </span>
          )}

          {!speechEnabled && (
            <span className="absolute -bottom-1 right-3 flex h-6 w-6 items-center justify-center rounded-full bg-gray-800 text-[10px] font-bold text-white">
              OFF
            </span>
          )}

          {(state === MENTOR_STATES.speaking || showBubble) && (
            <div
              className="mentor-robot__glow absolute inset-x-4 top-6 bottom-2 rounded-[42px] opacity-30"
              style={{ backgroundColor: character?.color || "#3b82f6" }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Mentor;
