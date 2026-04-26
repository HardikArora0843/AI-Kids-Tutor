import { useEffect, useState } from "react";

const MentorBubble = ({ message, visible }) => {
  const [typedMessage, setTypedMessage] = useState("");

  useEffect(() => {
    if (!visible || !message) {
      setTypedMessage("");
      return;
    }

    let index = 0;
    const interval = setInterval(() => {
      index += 1;
      setTypedMessage(message.slice(0, index));
      if (index >= message.length) clearInterval(interval);
    }, 18);

    return () => clearInterval(interval);
  }, [message, visible]);

  if (!visible || !message) return null;

  return (
    <div
      className={`
        absolute bottom-full left-1/2 -translate-x-1/2 mb-3
        bg-white rounded-2xl px-4 py-3 shadow-xl
        border border-gray-100
        max-w-[260px] w-max
        transition-all duration-300 ease-out
        ${visible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-2 scale-95"}
      `}
      style={{ pointerEvents: "none" }}
    >
      <p className="text-sm font-semibold text-gray-700 leading-relaxed text-center typing-caret">
        {typedMessage}
      </p>

      {/* Bubble tail */}
      <div
        className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-r border-b border-gray-100 rotate-45"
      />
    </div>
  );
};

export default MentorBubble;
