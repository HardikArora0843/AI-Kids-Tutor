import { useEffect, useMemo, useRef, useState } from "react";
import AnimatedBackground from "../../components/AnimatedBackground";
import ConfettiEffect from "../../components/ConfettiEffect";
import ProgressBar from "../../components/ProgressBar";
import GameHeader from "../../components/game/GameHeader";
import GameLayout from "../../components/game/GameLayout";
import SortingMachine from "../../components/game/color/SortingMachine";
import RewardPopup from "../../components/game/RewardPopup";
import useMentor from "../../components/mentor/useMentor";
import useTranslation from "../../utils/useTranslation";
import { useSound } from "../../sounds/SoundProvider";
import { saveProgress } from "../../services/api";

const ITEMS = [
  { id: "apple", label: "🍎", color: "red", name: "apple" },
  { id: "ball", label: "🔵", color: "blue", name: "blue ball" },
  { id: "sun", label: "☀️", color: "yellow", name: "sun" },
];

const SHAPES = [
  { id: "roof", shape: "triangle", label: "🔺", name: "roof triangle" },
  { id: "house", shape: "square", label: "🟦", name: "house square" },
  { id: "window", shape: "circle", label: "🔵", name: "window circle" },
];

const COLOR_BINS = [
  { id: "red", label: "Red", theme: "red", icon: "🎨" },
  { id: "blue", label: "Blue", theme: "blue", icon: "🫧" },
  { id: "yellow", label: "Yellow", theme: "yellow", icon: "✨" },
];

const SHAPE_BINS = [
  { id: "triangle", label: "Roof", theme: "purple", icon: "🔺" },
  { id: "square", label: "House", theme: "pink", icon: "🟦" },
  { id: "circle", label: "Window", theme: "teal", icon: "🔵" },
];

const ColorShapeWorld = () => {
  const mentor = useMentor(localStorage.getItem("mentorCharacter") || "robot");
  const { triggerEvent, onComplete } = mentor;
  const { t } = useTranslation();
  const { play } = useSound();
  const [mode, setMode] = useState("colors");
  const [sorted, setSorted] = useState([]);
  const [placed, setPlaced] = useState([]);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [wrong, setWrong] = useState("");
  const [draggingId, setDraggingId] = useState("");
  const [activeBinId, setActiveBinId] = useState("");
  const [successBinId, setSuccessBinId] = useState("");
  const [wrongBinId, setWrongBinId] = useState("");
  const [burstActive, setBurstActive] = useState(false);
  const [complete, setComplete] = useState(false);
  const [saved, setSaved] = useState(false);
  const startTimeRef = useRef(Date.now());

  const total = ITEMS.length + SHAPES.length;
  const level = Math.min(3, Math.floor(score / 2) + 1);

  useEffect(() => {
    const timer = setTimeout(() => {
      triggerEvent("START_ACTIVITY", { message: t("colorShapeWorld.introMessage") });
    }, 500);
    return () => clearTimeout(timer);
  }, [triggerEvent, t]);

  useEffect(() => {
    if (sorted.length === ITEMS.length && mode === "colors") {
      const timer = setTimeout(() => {
        setMode("shapes");
        triggerEvent("LEVEL_COMPLETE", { message: t("colorShapeWorld.levelCompleteMessage") });
      }, 700);

      return () => clearTimeout(timer);
    }
  }, [sorted, mode, triggerEvent, t]);

  useEffect(() => {
    if (placed.length === SHAPES.length && !complete) {
      setComplete(true);
    }
  }, [placed, complete]);

  useEffect(() => {
    if (!complete || saved) return;
    const timeSpent = Math.round((Date.now() - startTimeRef.current) / 1000);
    saveProgress({
      topic: "colors",
      subTopic: "sorting-shape-builder",
      score,
      totalQuestions: total + mistakes,
      correctAnswers: score,
      timeSpent,
      attempts: 1,
      difficultyLevel: "easy",
    }).catch((error) => console.error("Failed to save color progress:", error));
    setSaved(true);
    onComplete();
    play("reward");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [complete, saved, score, total, mistakes, onComplete]);

  useEffect(() => {
    if (!burstActive) return;
    const timer = setTimeout(() => setBurstActive(false), 1000);
    return () => clearTimeout(timer);
  }, [burstActive]);

  const currentItems = mode === "colors"
    ? ITEMS.filter((item) => !sorted.includes(item.id))
    : SHAPES.filter((shape) => !placed.includes(shape.id));

  const bins = mode === "colors" ? COLOR_BINS : SHAPE_BINS;

  const binContents = useMemo(() => {
    if (mode === "colors") {
      return COLOR_BINS.reduce((acc, bin) => {
        acc[bin.id] = ITEMS.filter((item) => sorted.includes(item.id) && item.color === bin.id);
        return acc;
      }, {});
    }

    return SHAPE_BINS.reduce((acc, bin) => {
      acc[bin.id] = SHAPES.filter((shape) => placed.includes(shape.id) && shape.shape === bin.id);
      return acc;
    }, {});
  }, [mode, placed, sorted]);

  const machineTitle = mode === "colors"
    ? t("colorShapeWorld.machineTitleColors")
    : t("colorShapeWorld.machineTitleShapes");

  const machineSubtitle = mode === "colors"
    ? t("colorShapeWorld.machineSubtitleColors")
    : t("colorShapeWorld.machineSubtitleShapes");

  const resetFeedback = () => {
    setActiveBinId("");
    setWrong("");
    setWrongBinId("");
    setSuccessBinId("");
    setDraggingId("");
  };

  const handleDragStart = (event, item) => {
    event.dataTransfer.setData("text/plain", item.id);
    setDraggingId(item.id);
  };

  const handleDragEnd = () => {
    setDraggingId("");
    setActiveBinId("");
  };

  const handleBinEnter = (_, binId) => {
    setActiveBinId(binId);
  };

  const handleBinLeave = (_, binId) => {
    setActiveBinId((current) => (current === binId ? "" : current));
  };

  const handleColorDrop = (binColor, itemId) => {
    const item = ITEMS.find((entry) => entry.id === itemId);
    if (!item || sorted.includes(itemId)) return;

    if (item.color === binColor) {
      setSorted((prev) => [...prev, itemId]);
      setScore((prev) => prev + 1);
      setSuccessBinId(binColor);
      setBurstActive(true);
      triggerEvent("CORRECT_ANSWER", { message: t("colorShapeWorld.correctColorDrop") });
      play("correct");
      setTimeout(() => setSuccessBinId(""), 700);
    } else {
      setMistakes((prev) => prev + 1);
      setWrong(itemId);
      setWrongBinId(binColor);
      triggerEvent("WRONG_ANSWER", { message: t("colorShapeWorld.wrongColorDrop") });
      play("wrong");
      setTimeout(() => {
        setWrong("");
        setWrongBinId("");
      }, 700);
    }

    setActiveBinId("");
    setDraggingId("");
  };

  const handleShapeDrop = (slotShape, shapeId) => {
    const shape = SHAPES.find((entry) => entry.id === shapeId);
    if (!shape || placed.includes(shapeId)) return;

    if (shape.shape === slotShape) {
      setPlaced((prev) => [...prev, shapeId]);
      setScore((prev) => prev + 1);
      setSuccessBinId(slotShape);
      setBurstActive(true);
      triggerEvent("CORRECT_ANSWER", { message: t("colorShapeWorld.correctShapeDrop") });
      play("correct");
      setTimeout(() => setSuccessBinId(""), 700);
    } else {
      setMistakes((prev) => prev + 1);
      setWrong(shapeId);
      setWrongBinId(slotShape);
      triggerEvent("WRONG_ANSWER", { message: t("colorShapeWorld.wrongShapeDrop") });
      play("wrong");
      setTimeout(() => {
        setWrong("");
        setWrongBinId("");
      }, 700);
    }

    setActiveBinId("");
    setDraggingId("");
  };

  const handleDrop = (event, binId) => {
    event.preventDefault();
    const itemId = event.dataTransfer.getData("text/plain");

    if (mode === "colors") {
      handleColorDrop(binId, itemId);
    } else {
      handleShapeDrop(binId, itemId);
    }
  };

  useEffect(() => () => resetFeedback(), []);

  return (
    <GameLayout
      title={t("colorShapeWorld.title")}
      subtitle={t("colorShapeWorld.subtitle")}
      bgGradient="from-[#d378ee] via-[#d97fd5] to-[#f6a0bb]"
      mentor={mentor}
    >
      <AnimatedBackground theme="factory-lab" />
      {(complete || burstActive) && <ConfettiEffect active={true} duration={complete ? 4000 : 1000} />}

      <div className="relative z-10 h-full space-y-3">
        <GameHeader score={score} current={score} total={total} label={t("colorShapeWorld.labLabel")} />

        {complete ? (
          <div className="max-w-lg mx-auto pt-6">
            <RewardPopup
              icon="🏭"
              title={t("colorShapeWorld.rewardTitle")}
              subtitle={t("colorShapeWorld.rewardSubtitle", { score, total })}
            />
          </div>
        ) : (
          <section className="grid gap-3 lg:grid-cols-[minmax(0,1.34fr)_260px] xl:grid-cols-[minmax(0,1.42fr)_280px]">
            <SortingMachine
              title={machineTitle}
              subtitle={machineSubtitle}
              items={currentItems}
              bins={bins}
              binContents={binContents}
              wrongId={wrong}
              draggingId={draggingId}
              activeBinId={activeBinId}
              successBinId={successBinId}
              wrongBinId={wrongBinId}
              onItemDragStart={handleDragStart}
              onItemDragEnd={handleDragEnd}
              onBinDragEnter={handleBinEnter}
              onBinDragLeave={handleBinLeave}
              onBinDrop={handleDrop}
            />

            <aside className="space-y-3">
              <div className="game-card-surface rounded-[1.9rem] border border-white/60 bg-white/72 p-4 shadow-xl backdrop-blur-md">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-[0.25em] text-purple-500">{t("colorShapeWorld.levelLabel")}</p>
                    <h3 className="text-3xl font-bold text-slate-800">{level}</h3>
                  </div>
                  <div className="rounded-2xl bg-purple-100 px-3 py-2 text-sm font-bold text-purple-700 shadow-sm">
                    {mode === "colors" ? t("colorShapeWorld.sorting") : t("colorShapeWorld.building")}
                  </div>
                </div>
                <ProgressBar value={score} max={total} color="bg-gradient-to-r from-purple-500 to-pink-400" />
              </div>

              <div className="game-card-surface rounded-[1.9rem] border border-white/60 bg-gradient-to-br from-purple-600 to-fuchsia-500 p-4 text-white shadow-xl">
                <p className="text-sm font-bold uppercase tracking-[0.25em] text-white/80">{t("colorShapeWorld.machineTask")}</p>
                <h3 className="mt-2 text-2xl font-bold">{machineTitle}</h3>
                <p className="mt-2 text-sm font-semibold text-white/85">{machineSubtitle}</p>
              </div>

              <div className="game-card-surface rounded-[1.9rem] border border-white/60 bg-white/72 p-4 shadow-xl backdrop-blur-md">
                <p className="text-sm font-bold uppercase tracking-[0.25em] text-sky-500">{t("colorShapeWorld.queueLabel")}</p>
                <div className="mt-3 flex items-end justify-between gap-3">
                  <div>
                    <h3 className="text-3xl font-bold text-slate-800">{currentItems.length}</h3>
                    <p className="text-sm font-semibold text-slate-600">{t("colorShapeWorld.itemsLeft")}</p>
                  </div>
                  <div className="rounded-full bg-amber-100 px-4 py-2 text-sm font-bold text-amber-700">
                    {t("colorShapeWorld.score", { score })}
                  </div>
                </div>
              </div>
            </aside>
          </section>
        )}
      </div>
    </GameLayout>
  );
};

export default ColorShapeWorld;
