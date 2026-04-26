import { useEffect, useMemo, useState } from "react";

const typeText = (text, setTyped, speed = 12) => {
  let index = 0;
  setTyped("");
  const id = window.setInterval(() => {
    index += 1;
    setTyped(text.slice(0, index));
    if (index >= text.length) window.clearInterval(id);
  }, speed);
  return () => window.clearInterval(id);
};

const StoryCard = ({
  story,
  isListening = false,
  onListen,
}) => {
  const [typedText, setTypedText] = useState(story.text);

  const imageBubble = useMemo(() => {
    // No external image assets yet; render a friendly “storybook” hero instead.
    return (
      <div className="relative overflow-hidden rounded-[24px] border-[5px] border-white/70 bg-[linear-gradient(180deg,#0ea5e9_0%,#2563eb_45%,#0f172a_100%)] shadow-[0_18px_34px_rgba(15,23,42,0.22)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.32),transparent_45%),radial-gradient(circle_at_70%_25%,rgba(255,255,255,0.18),transparent_52%)]" />
        <div className="relative flex min-h-[160px] items-center justify-center p-5">
          <div className="text-center">
            <div className="text-5xl drop-shadow-[0_10px_22px_rgba(0,0,0,0.25)]">{story.emoji}</div>
            <p className="mt-2 text-xs font-extrabold text-white/90 md:text-sm">{story.title}</p>
          </div>
        </div>
      </div>
    );
  }, [story.emoji, story.title]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const cleanup = typeText(story.text, setTypedText, 10);
    return cleanup;
  }, [story.text]);

  return (
    <div className="rounded-[26px] border-[5px] border-white/55 bg-[linear-gradient(180deg,rgba(255,255,255,0.84),rgba(255,255,255,0.62))] p-4 shadow-[0_22px_44px_rgba(15,23,42,0.18)] backdrop-blur-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="inline-flex items-center gap-2 rounded-2xl bg-rose-500 px-4 py-2 text-white shadow-lg">
          <span className="text-lg">⭐</span>
          <p className="text-sm font-extrabold">{story.title}</p>
        </div>
        <div className="rounded-2xl bg-white/85 px-3 py-2 text-xs font-bold text-slate-600">
          Story
        </div>
      </div>

      <div className="mt-4 animate-page-in">
        {imageBubble}
      </div>

      <div className="mt-3 rounded-3xl bg-white/85 p-4 shadow-inner">
        <p className="text-xs md:text-sm font-semibold leading-relaxed text-slate-700">{typedText}</p>
      </div>

      <button
        type="button"
        onClick={onListen}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-5 py-3 text-sm md:text-base font-extrabold text-white shadow-lg transition hover:scale-[1.01] hover:bg-emerald-600 active:scale-[0.99]"
      >
        <span className="text-lg">🔊</span>
        {isListening ? "Listening..." : "Listen Again"}
      </button>
    </div>
  );
};

export default StoryCard;
