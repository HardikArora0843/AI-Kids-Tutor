import { useEffect, useRef, useState } from "react";
import AnimatedBackground from "../../components/AnimatedBackground";
import ConfettiEffect from "../../components/ConfettiEffect";
import CanvasBoard from "../../components/game/CanvasBoard";
import GameHeader from "../../components/game/GameHeader";
import GameLayout from "../../components/game/GameLayout";
import RewardPopup from "../../components/game/RewardPopup";
import useMentor from "../../components/mentor/useMentor";
import useTranslation from "../../utils/useTranslation";
import { saveProgress } from "../../services/api";

const AREAS = ["roof", "wall", "door"];

const PALETTE = [
  { name: "Red", value: "bg-red-400", hex: "#f87171", badge: "Warm" },
  { name: "Yellow", value: "bg-yellow-300", hex: "#fde047", badge: "Sunny" },
  { name: "Blue", value: "bg-blue-400", hex: "#60a5fa", badge: "Cool" },
  { name: "Green", value: "bg-green-400", hex: "#4ade80", badge: "Nature" },
];

const BRUSHES = [
  { label: "Small", size: 6 },
  { label: "Medium", size: 10 },
  { label: "Big", size: 14 },
];

const STICKERS = ["\u2B50", "\uD83E\uDEE7", "\uD83C\uDFA8", "\uD83D\uDCAF", "\uD83C\uDF08"];

const DrawingWorld = () => {
  const mentor = useMentor(localStorage.getItem("mentorCharacter") || "robot");
  const { triggerEvent, onCorrect, onComplete } = mentor;
  const { t } = useTranslation();
  const steps = t("drawingWorld.steps");
  const [mode, setMode] = useState("draw");
  const [step, setStep] = useState(0);
  const [drawnSteps, setDrawnSteps] = useState([]);
  const [selectedColor, setSelectedColor] = useState(PALETTE[0].value);
  const [selectedBrush, setSelectedBrush] = useState(BRUSHES[1]);
  const [filled, setFilled] = useState({});
  const [stickers, setStickers] = useState([]);
  const [complete, setComplete] = useState(false);
  const [saved, setSaved] = useState(false);
  const startTimeRef = useRef(Date.now());

  const total = steps.length + AREAS.length;
  const score = drawnSteps.length + Object.keys(filled).length;
  const mistakes = 0;
  const activePalette = PALETTE.find((color) => color.value === selectedColor) || PALETTE[0];

  useEffect(() => {
    const timer = setTimeout(
      () => triggerEvent("START_ACTIVITY", { message: t("drawingWorld.startMessage") }),
      500
    );
    return () => clearTimeout(timer);
  }, [t, triggerEvent]);

  useEffect(() => {
    if (Object.keys(filled).length === AREAS.length && mode === "color") {
      setComplete(true);
    }
  }, [filled, mode]);

  useEffect(() => {
    if (!complete || saved) return;
    const timeSpent = Math.round((Date.now() - startTimeRef.current) / 1000);
    saveProgress({
      topic: "shapes",
      subTopic: "guided-drawing-coloring",
      score,
      totalQuestions: total + mistakes,
      correctAnswers: score,
      timeSpent,
      attempts: 1,
      difficultyLevel: "easy",
    }).catch((error) => console.error("Failed to save drawing progress:", error));
    setSaved(true);
    onComplete();
  }, [complete, onComplete, saved, score, total]);

  const addSticker = () => {
    const emoji = STICKERS[stickers.length % STICKERS.length];
    setStickers((prev) => [...prev, emoji]);
  };

  const finishStep = () => {
    if (drawnSteps.includes(step)) return;
    setDrawnSteps((prev) => [...prev, step]);
    onCorrect();
    setTimeout(() => {
      if (step === steps.length - 1) {
        setMode("color");
        triggerEvent("HINT", { message: t("drawingWorld.colorHint") });
      } else {
        setStep((prev) => prev + 1);
      }
    }, 600);
  };

  const fillArea = (area) => {
    setFilled((prev) => ({ ...prev, [area]: activePalette.hex }));
    setStickers((prev) => {
      if (prev.length >= Object.keys(filled).length + 1) return prev;
      return [...prev, STICKERS[prev.length % STICKERS.length]];
    });
  };

  return (
    <GameLayout
      title={t("drawingWorld.title")}
      subtitle={t("drawingWorld.subtitle")}
      bgGradient="from-[#68d8ff] via-[#79f2da] to-[#fff2a8]"
      mentor={mentor}
    >
      <AnimatedBackground />
      {complete && <ConfettiEffect active={true} duration={4000} />}
      <GameHeader score={score} current={score} total={total} label={t("drawingWorld.artLabel")} />

      {complete ? (
        <div className="max-w-md mx-auto">
          <RewardPopup icon="\uD83C\uDFA8" title={t("drawingWorld.rewardTitle")} subtitle={t("drawingWorld.rewardSubtitle")} />
        </div>
      ) : mode === "draw" ? (
        <section className="drawing-studio grid gap-4 xl:grid-cols-[280px_1fr_260px]">
          <aside className="drawing-card drawing-card--hero">
            <p className="drawing-card__eyebrow">{t("drawingWorld.stepLabel", { step: step + 1 })}</p>
            <div className="drawing-card__guide">{steps[step].guide}</div>
            <p className="drawing-card__title">{steps[step].label}</p>
            <p className="drawing-card__hint">Trace the guide, then mark the step complete when it looks good.</p>
            <button onClick={finishStep} className="drawing-card__cta">
              {t("drawingWorld.didIt")}
            </button>
          </aside>

          <CanvasBoard
            color={activePalette.hex}
            brushSize={selectedBrush.size}
            guide={steps[step].guide}
            title="Sky Sketch Pad"
            onDraw={() => {}}
          />

          <aside className="space-y-4">
            <div className="drawing-card">
              <p className="drawing-card__eyebrow">Brush</p>
              <div className="flex gap-2">
                {BRUSHES.map((brush) => (
                  <button
                    key={brush.label}
                    type="button"
                    onClick={() => setSelectedBrush(brush)}
                    className={`drawing-pill ${selectedBrush.label === brush.label ? "drawing-pill--active" : ""}`}
                  >
                    {brush.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="drawing-card">
              <p className="drawing-card__eyebrow">Magic Ink</p>
              <div className="flex items-center gap-3">
                <span className={`drawing-swatch ${selectedColor}`} />
                <div>
                  <p className="font-bold text-slate-800">{activePalette.name}</p>
                  <p className="text-sm font-semibold text-slate-500">{activePalette.badge} strokes</p>
                </div>
              </div>
            </div>

            <div className="drawing-card">
              <p className="drawing-card__eyebrow">Progress Stars</p>
              <div className="drawing-stars">
                {steps.map((item, index) => (
                  <span key={item.label} className={`drawing-star ${drawnSteps.includes(index) ? "drawing-star--done" : ""}`}>
                    {drawnSteps.includes(index) ? "\u2B50" : "\u2606"}
                  </span>
                ))}
              </div>
            </div>
          </aside>
        </section>
      ) : (
        <section className="drawing-color-lab grid gap-4 xl:grid-cols-[1fr_280px]">
          <div className="drawing-color-panel">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="drawing-card__eyebrow">Color Mission</p>
                <h2 className="text-2xl font-bold text-slate-800">{t("drawingWorld.colorHouse")}</h2>
              </div>
              <div className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-bold text-emerald-700 shadow-sm">
                {Object.keys(filled).length}/{AREAS.length} parts painted
              </div>
            </div>

            <div className="drawing-palette">
              {PALETTE.map((color) => (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(color.value)}
                  className={`drawing-palette__button ${selectedColor === color.value ? "drawing-palette__button--active" : ""}`}
                  title={color.name}
                >
                  <span className="drawing-palette__swatch" style={{ backgroundColor: color.hex }} />
                  <span>{color.name}</span>
                </button>
              ))}
            </div>

            <div className="drawing-house-card">
              <div className="drawing-house__sky" />
              <div className="drawing-house__stickers">
                {stickers.map((sticker, index) => (
                  <span
                    key={`${sticker}-${index}`}
                    className="drawing-house__sticker"
                    style={{
                      left: `${18 + index * 14}%`,
                      top: `${14 + (index % 2) * 10}%`,
                    }}
                  >
                    {sticker}
                  </span>
                ))}
              </div>

              <button
                onClick={() => fillArea("roof")}
                className="mx-auto block w-0 h-0 border-l-[108px] border-r-[108px] border-b-[112px] border-l-transparent border-r-transparent border-b-rose-300 cursor-pointer transition-all hover:scale-105"
                style={filled.roof ? { borderBottomColor: filled.roof } : undefined}
                aria-label="Color roof"
              />
              <button
                onClick={() => fillArea("wall")}
                className="mx-auto block h-40 w-64 rounded-[1.6rem] border-4 border-white/60 bg-amber-100 cursor-pointer transition-all hover:scale-105"
                style={filled.wall ? { backgroundColor: filled.wall } : undefined}
                aria-label="Color house"
              />

              <div className="mx-auto -mt-28 flex w-64 items-end justify-between px-7">
                <button
                  onClick={() => fillArea("door")}
                  className="block h-24 w-20 rounded-t-[1.4rem] border-4 border-white/60 bg-sky-200 cursor-pointer transition-all hover:scale-105"
                  style={filled.door ? { backgroundColor: filled.door } : undefined}
                  aria-label="Color door"
                />
                <div className="drawing-house__window" />
              </div>
              <div className="drawing-house__grass" />
            </div>
          </div>

          <aside className="space-y-4">
            <div className="drawing-card">
              <p className="drawing-card__eyebrow">Palette Mood</p>
              <div className="flex items-center gap-3">
                <span className="drawing-swatch" style={{ backgroundColor: activePalette.hex }} />
                <div>
                  <p className="font-bold text-slate-800">{activePalette.name}</p>
                  <p className="text-sm font-semibold text-slate-500">{activePalette.badge} scene</p>
                </div>
              </div>
            </div>

            <div className="drawing-card">
              <p className="drawing-card__eyebrow">Decor Stickers</p>
              <button type="button" onClick={addSticker} className="drawing-card__cta w-full">
                Add Sticker
              </button>
              <div className="drawing-stickers">
                {stickers.length ? (
                  stickers.map((sticker, index) => <span key={`${sticker}-tray-${index}`}>{sticker}</span>)
                ) : (
                  <p className="text-sm font-semibold text-slate-500">Add a sticker or paint the house to decorate the scene.</p>
                )}
              </div>
            </div>

            <div className="drawing-card">
              <p className="drawing-card__eyebrow">Checklist</p>
              <div className="space-y-2 text-sm font-semibold text-slate-600">
                <p>{filled.roof ? "\u2705" : "\u2B1C"} Roof</p>
                <p>{filled.wall ? "\u2705" : "\u2B1C"} Wall</p>
                <p>{filled.door ? "\u2705" : "\u2B1C"} Door</p>
              </div>
            </div>
          </aside>
        </section>
      )}
    </GameLayout>
  );
};

export default DrawingWorld;
