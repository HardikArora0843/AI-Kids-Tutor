import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfettiEffect from "../../components/ConfettiEffect";
import Mentor from "../../components/mentor/Mentor";
import RewardPopup from "../../components/game/RewardPopup";
import SoundToggle from "../../components/SoundToggle";
import StarBadge from "../../components/StarBadge";
import useMentor from "../../components/mentor/useMentor";
import useTranslation from "../../utils/useTranslation";
import { saveProgress } from "../../services/api";

const OPTION_TONES = [
  "from-lime-500 to-green-600",
  "from-violet-500 to-purple-700",
  "from-amber-400 to-orange-500",
];

const HUD_CARD =
  "rounded-[24px] border-4 border-white/45 bg-white/82 px-4 py-3 shadow-[0_14px_28px_rgba(15,23,42,0.14)] backdrop-blur-sm";

const ExplorerFigure = ({ compact = false, className = "" }) => (
  <div className={`relative ${compact ? "h-24 w-16" : "h-36 w-24"} ${className}`}>
    {/* Head */}
    <div
      className={`absolute left-1/2 -translate-x-1/2 rounded-[45%] bg-[radial-gradient(circle_at_35%_30%,#ffe2c9_0%,#ffd4b1_55%,#f8b790_100%)] shadow-md ${
        compact ? "bottom-[62px] h-10 w-9" : "bottom-[92px] h-14 w-12"
      }`}
    >
      {/* Hair cap */}
      <div
        className={`absolute left-1/2 top-0 -translate-x-1/2 rounded-b-[18px] rounded-t-[22px] bg-[linear-gradient(180deg,#3a2419_0%,#2a1811_100%)] ${
          compact ? "h-4 w-9" : "h-5 w-12"
        }`}
      />
      {/* Eyes */}
      <div className={`absolute left-0 right-0 ${compact ? "top-4" : "top-6"} flex items-center justify-center gap-2`}>
        <div className={`rounded-full bg-[#1f2937] ${compact ? "h-1.5 w-1.5" : "h-2 w-2"}`} />
        <div className={`rounded-full bg-[#1f2937] ${compact ? "h-1.5 w-1.5" : "h-2 w-2"}`} />
      </div>
      {/* Smile */}
      <div
        className={`absolute left-1/2 -translate-x-1/2 rounded-b-full border-b-2 border-[#8a4b2b]/70 ${
          compact ? "top-[22px] h-2 w-4" : "top-[34px] h-2.5 w-5"
        }`}
      />
      {/* Cheeks */}
      <div className={`absolute ${compact ? "top-[18px]" : "top-[28px]"} left-1 h-2 w-2 rounded-full bg-[#ff8aa1]/25`} />
      <div className={`absolute ${compact ? "top-[18px]" : "top-[28px]"} right-1 h-2 w-2 rounded-full bg-[#ff8aa1]/25`} />
    </div>

    {/* Neck */}
    <div
      className={`absolute left-1/2 -translate-x-1/2 rounded-full bg-[#f6c6a4] ${
        compact ? "bottom-[58px] h-2 w-3" : "bottom-[86px] h-2.5 w-4"
      }`}
    />

    {/* Torso */}
    <div
      className={`absolute left-1/2 -translate-x-1/2 rounded-[18px] bg-[linear-gradient(180deg,#ff5d4a_0%,#d53a2b_100%)] shadow-lg ${
        compact ? "bottom-[30px] h-8 w-10" : "bottom-[42px] h-12 w-14"
      }`}
    >
      {/* Shirt highlight */}
      <div className="absolute inset-x-2 top-1 h-2 rounded-full bg-white/18" />
      {/* Belt */}
      <div className={`absolute inset-x-1 ${compact ? "bottom-1.5" : "bottom-2"} h-1 rounded-full bg-[#1f2937]/25`} />
    </div>

    {/* Arms */}
    <div
      className={`absolute left [18%] rounded-full bg-[linear-gradient(180deg,#ff5d4a_0%,#cf3a2c_100%)] shadow ${
        compact ? "bottom-[44px] h-2.5 w-6 -rotate-[26deg]" : "bottom-[64px] h-3.5 w-8 -rotate-[26deg]"
      }`}
    />
    <div
      className={`absolute right-[1%] rounded-full bg-[linear-gradient(180deg,#ff5d4a_0%,#cf3a2c_100%)] shadow ${
        compact ? "bottom-[44px] h-2.5 w-6 rotate-[26deg]" : "bottom-[64px] h-3.5 w-8 rotate-[26deg]"
      }`}
    />
    {/* Hands */}
    <div className={`absolute left-[2%] rounded-full bg-[#ffd4b1] ${compact ? "bottom-[41px] h-2 w-2" : "bottom-[61px] h-2.5 w-2.5"}`} />
    <div className={`absolute right-[2%] rounded-full bg-[#ffd4b1] ${compact ? "bottom-[41px] h-2 w-2" : "bottom-[61px] h-2.5 w-2.5"}`} />

    {/* Legs */}
    <div
      className={`absolute left-[30%] rounded-[999px] bg-[linear-gradient(180deg,#4a7fc4_0%,#2e588f_100%)] shadow ${
        compact ? "bottom-[10px] h-7 w-3" : "bottom-[14px] h-10 w-4"
      }`}
    />
    <div
      className={`absolute right-[30%] rounded-[999px] bg-[linear-gradient(180deg,#4a7fc4_0%,#2e588f_100%)] shadow ${
        compact ? "bottom-[10px] h-7 w-3" : "bottom-[14px] h-10 w-4"
      }`}
    />

    {/* Shoes */}
    <div className={`absolute left-[18%] rounded-full bg-[#e6eef8] shadow ${compact ? "bottom-[6px] h-2 w-6" : "bottom-[9px] h-3 w-8"}`} />
    <div className={`absolute right-[18%] rounded-full bg-[#e6eef8] shadow ${compact ? "bottom-[6px] h-2 w-6" : "bottom-[9px] h-3 w-8"}`} />
    <div className={`absolute left-[22%] rounded-full bg-[#c8412d] ${compact ? "bottom-[6px] h-1 w-4" : "bottom-[9px] h-1.5 w-5"}`} />
    <div className={`absolute right-[22%] rounded-full bg-[#c8412d] ${compact ? "bottom-[6px] h-1 w-4" : "bottom-[9px] h-1.5 w-5"}`} />
  </div>
);

const splitIsFor = (template, word) => {
  const parts = template.split(word);
  return {
    before: parts[0] || "",
    after: parts.slice(1).join(word) || "",
  };
};

const AlphabetWorld = () => {
  const navigate = useNavigate();
  const mentor = useMentor(localStorage.getItem("mentorCharacter") || "robot");
  const { triggerEvent, onComplete } = mentor;
  const { t } = useTranslation();
  const steps = t("alphabetWorld.steps");
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [selected, setSelected] = useState("");
  const [wrong, setWrong] = useState("");
  const [complete, setComplete] = useState(false);
  const [saved, setSaved] = useState(false);
  const startTimeRef = useRef(Date.now());

  const current = steps[step];
  const streak = Math.max(1, score);
  const fixedCount = step + (selected ? 1 : 0);
  const progressPercent = Math.round((fixedCount / steps.length) * 100);
  const isForText = splitIsFor(
    t("alphabetWorld.isFor", { letter: current.target, word: current.word }),
    current.word
  );

  // `mentor` is a new object every render; use stable `triggerEvent` + `t` so the intro only runs when those change.
  useEffect(() => {
    const timer = setTimeout(() => {
      triggerEvent("START_ACTIVITY", {
        message: t("alphabetWorld.introMessage"),
      });
    }, 500);
    return () => clearTimeout(timer);
  }, [triggerEvent, t]);

  useEffect(() => {
    if (!complete || saved) return;

    const timeSpent = Math.round((Date.now() - startTimeRef.current) / 1000);
    saveProgress({
      topic: "alphabet",
      subTopic: "bridge-crossing",
      score,
      totalQuestions: steps.length + mistakes,
      correctAnswers: score,
      timeSpent,
      attempts: 1,
      difficultyLevel: "easy",
    }).catch((error) => console.error("Failed to save alphabet progress:", error));
    setSaved(true);
    onComplete();
  }, [complete, mistakes, onComplete, saved, score, steps.length]);

  const handlePick = (option) => {
    if (selected || complete) return;

    if (option === current.target) {
      setSelected(option);
      setScore((prev) => prev + 1);
      triggerEvent("CORRECT_ANSWER", {
        message: t("alphabetWorld.correctMessage", {
          letter: current.target,
          word: current.word,
        }),
      });

      setTimeout(() => {
        if (step === steps.length - 1) {
          setComplete(true);
          return;
        }
        setStep((prev) => prev + 1);
        setSelected("");
        setWrong("");
      }, 900);
    } else {
      setMistakes((prev) => prev + 1);
      setWrong(option);
      triggerEvent("WRONG_ANSWER", {
        message: t("alphabetWorld.wrongMessage"),
      });
      setTimeout(() => setWrong(""), 700);
    }
  };

  if (complete) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.48),_transparent_18rem),linear-gradient(180deg,_#2fb5ff_0%,_#8bdcff_46%,_#dff7ff_82%,_#f4efb7_100%)] px-5 py-6 page-shell">
        <ConfettiEffect active={true} duration={4500} />
        <div className="relative z-10 mx-auto flex min-h-[85vh] max-w-5xl items-center justify-center">
          <div className="w-full max-w-xl">
            <RewardPopup
              icon="🏆"
              title={t("alphabetWorld.bridgeCompleteTitle")}
              subtitle={t("alphabetWorld.completionSubtitle", {
                score,
                total: steps.length,
              })}
            >
              <div className="space-y-5 text-center">
                <div className="flex justify-center">
                  <StarBadge
                    filled={Math.max(1, Math.round((score / steps.length) * 5))}
                    total={5}
                    size="text-3xl"
                  />
                </div>
                <div className="rounded-3xl bg-white/70 p-4 text-sm font-semibold text-slate-700">
                  {t("alphabetWorld.bridgeCompleteText")}
                </div>
                <div className="flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => navigate("/child")}
                    className="rounded-2xl bg-amber-400 px-6 py-3 text-sm font-bold text-slate-900 shadow-lg transition hover:scale-[1.03]"
                  >
                    {t("alphabetWorld.backToWorlds")}
                  </button>
                  <button
                    type="button"
                    onClick={() => window.location.reload()}
                    className="rounded-2xl bg-violet-600 px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:scale-[1.03]"
                  >
                    {t("alphabetWorld.playAgain")}
                  </button>
                </div>
              </div>
            </RewardPopup>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_20%_18%,rgba(255,255,255,0.38),transparent_18rem),radial-gradient(circle_at_82%_22%,rgba(255,255,255,0.22),transparent_14rem),linear-gradient(180deg,#109bf0_0%,#5ccfff_38%,#b4ebff_72%,#eefadf_100%)] page-shell lg:h-screen lg:max-h-screen">
      <div className="absolute left-[4%] top-[14%] h-32 w-32 rounded-full bg-white/30 blur-2xl" />
      <div className="absolute right-[8%] top-[18%] h-40 w-40 rounded-full bg-white/20 blur-3xl" />
      <div className="absolute left-0 right-0 bottom-0 h-[28vh] bg-[linear-gradient(180deg,rgba(75,168,89,0.08),rgba(64,124,50,0.14))]" />
      <div className="absolute bottom-0 left-0 h-[22vh] w-[16rem] rounded-tr-[4rem] bg-[linear-gradient(180deg,#7a5a38_0%,#4a3322_100%)] md:w-[18rem]" />
      <div className="absolute bottom-0 right-0 h-[22vh] w-[16rem] rounded-tl-[4rem] bg-[linear-gradient(180deg,#7a5a38_0%,#4a3322_100%)] md:w-[18rem]" />
      <div className="absolute right-[12%] top-[28%] h-44 w-9 rounded-full bg-white/30 blur-[2px]" />

      <Mentor
        character={mentor.character}
        state={mentor.state}
        message={mentor.message}
        showBubble={mentor.showBubble}
        speechEnabled={mentor.speechEnabled}
        onToggleSpeech={mentor.toggleSpeech}
        position="bottom-right"
        size="md"
      />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1400px] flex-col px-3 py-4 md:px-6 lg:h-screen lg:max-h-screen lg:py-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => navigate("/child")}
            className="rounded-full border-4 border-amber-300 bg-gradient-to-b from-yellow-300 to-amber-400 px-4 py-2.5 text-base font-bold text-slate-900 shadow-[0_10px_22px_rgba(145,90,12,0.28)] transition hover:scale-[1.03] md:px-5 md:py-3 md:text-lg"
          >
            ← Back
          </button>

          <div className="rounded-[28px] border-[6px] border-amber-950/20 bg-[linear-gradient(180deg,#98582f_0%,#754121_100%)] px-5 py-3 text-center shadow-[0_16px_30px_rgba(96,52,24,0.34)] md:px-6 md:py-4">
            <h1 className="text-2xl font-extrabold tracking-tight text-white drop-shadow-[0_4px_0_rgba(94,47,17,0.65)] md:text-4xl xl:text-5xl">
              {t("alphabetWorld.title")}
            </h1>
          </div>

          <div className="rounded-full border-4 border-violet-900/35 bg-gradient-to-r from-violet-900 to-purple-700 px-3 py-2.5 text-white shadow-[0_14px_28px_rgba(88,28,135,0.35)]">
            <SoundToggle className="!bg-transparent !px-0 !py-0 !text-white !shadow-none hover:!bg-transparent" />
          </div>
        </div>

        <div className="mt-3 flex-1 overflow-hidden lg:min-h-0">
          <div className="grid h-full gap-4 lg:grid-cols-[210px_minmax(0,1fr)_220px] lg:gap-5">
            <div className="space-y-3 lg:flex lg:flex-col">
              <div className={HUD_CARD}>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">⭐</span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500 md:text-sm">{t("alphabetWorld.scoreLabel")}</p>
                    <p className="text-2xl font-extrabold text-slate-800 md:text-3xl">
                      {score * t("alphabetWorld.scoreUnit")}
                    </p>
                  </div>
                </div>
              </div>

              <div className={HUD_CARD}>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🏆</span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500 md:text-sm">{t("alphabetWorld.streakLabel")}</p>
                    <p className="text-2xl font-extrabold text-slate-800 md:text-3xl">{streak}</p>
                  </div>
                </div>
              </div>

              <div className={`${HUD_CARD} hidden lg:block`}>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Explorer</p>
                <div className="mt-3 flex items-end justify-between gap-3">
                  <ExplorerFigure />
                  <div className="min-w-0 rounded-[18px] bg-white/75 px-3 py-2 shadow-sm">
                    <p className="text-sm font-extrabold text-slate-800">{t("alphabetWorld.explorerReady")}</p>
                    <p className="text-xs font-semibold text-slate-500">{t("alphabetWorld.explorerGoal")}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex min-h-0 flex-col overflow-hidden rounded-[32px] border-[6px] border-white/45 bg-[linear-gradient(180deg,rgba(255,255,255,0.24),rgba(255,255,255,0.12))] p-4 shadow-[0_22px_44px_rgba(15,23,42,0.18)] backdrop-blur-sm md:p-5">
              <div className="rounded-[24px] border-4 border-amber-200/70 bg-[#fff2d2] px-4 py-3 text-center shadow-[0_12px_24px_rgba(168,120,37,0.18)]">
                <p className="text-sm font-extrabold text-[#5e3e22] md:text-lg">{t("alphabetWorld.helperText")}</p>
              </div>

              <div className="mt-4 grid flex-1 gap-4 lg:min-h-0 lg:grid-cols-[220px_minmax(0,1fr)]">
                <div className="flex flex-col gap-3">
                  <div className="relative rounded-[26px] bg-white px-4 py-4 text-center shadow-[0_18px_32px_rgba(0,0,0,0.15)]">
                    <p className="text-lg font-extrabold leading-snug text-[#4a392f]">{t("alphabetWorld.prompt")}</p>
                    <div className="absolute -bottom-3 left-8 h-6 w-6 rotate-45 bg-white" />
                  </div>

                  <div className="rounded-[24px] border-[5px] border-amber-950/20 bg-[linear-gradient(180deg,#8f532d_0%,#6b3f24_100%)] px-4 py-3 text-center shadow-[0_14px_28px_rgba(92,49,18,0.3)]">
                    <p className="text-xl font-extrabold text-white md:text-2xl">{t("alphabetWorld.pickLabel")}</p>
                  </div>

                  <div className="rounded-[28px] border-[6px] border-amber-950/20 bg-[linear-gradient(180deg,#8f532d_0%,#6c3d20_100%)] px-5 py-6 text-center shadow-[0_18px_34px_rgba(93,50,20,0.35)]">
                    <p className="text-[4.5rem] font-extrabold leading-none text-white drop-shadow-[0_4px_0_rgba(95,52,22,0.75)] md:text-[5.8rem] xl:text-[6.4rem]">
                      {current.target}
                    </p>
                  </div>

                  <div className="rounded-[20px] border-4 border-amber-200/75 bg-[#fff3d6] px-4 py-3 text-center text-lg font-extrabold text-[#604425] shadow-lg">
                    {isForText.before}
                    <span className="text-violet-700">{current.word}</span>
                    {isForText.after}
                  </div>
                </div>

                <div className="flex min-h-0 flex-col justify-between gap-4">
                  <div className="relative min-h-[230px] rounded-[28px] bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] p-4 md:min-h-[280px]">
                    <div className="absolute inset-x-5 top-8 h-16 rounded-full bg-white/18 blur-2xl" />

                    <div className="absolute left-[8%] right-[8%] bottom-20">
                      <div className="flex items-end justify-between gap-2 md:gap-3">
                        <div className="mb-6 hidden h-14 w-3 rounded-full bg-[#996437] md:block" />
                        <div className="flex flex-1 items-center justify-center gap-2 md:gap-3">
                          {steps.map((item, index) => {
                            const fixed = index < step || (index === step && selected);
                            const failed = index === step && wrong;
                            return (
                              <div
                                key={item.target}
                                className={`flex h-16 min-w-0 flex-1 items-center justify-center rounded-[18px] border-4 text-2xl font-extrabold transition-all duration-500 md:h-20 md:text-3xl ${
                                  fixed
                                    ? "border-[#7a451f] bg-[linear-gradient(180deg,#b86c3b_0%,#8a4c28_100%)] text-white shadow-[0_14px_22px_rgba(108,61,30,0.28)]"
                                    : failed
                                      ? "border-white bg-sky-300/20 text-white/50 border-dashed animate-wiggle"
                                      : "border-white bg-sky-300/12 text-white/45 border-dashed"
                                }`}
                                style={{ transform: `rotate(${index % 2 === 0 ? -5 : 4}deg)` }}
                              >
                                {fixed ? item.target : ""}
                              </div>
                            );
                          })}
                        </div>
                        <div className="mb-6 hidden h-14 w-3 rounded-full bg-[#996437] md:block" />
                      </div>
                    </div>

                    <div
                      className="absolute bottom-[92px] z-20 transition-all duration-700 md:bottom-[102px]"
                      style={{ left: `calc(${Math.min(step, 4) * 18}% + 8%)` }}
                    >
                      <div className="absolute left-1/2 top-0 h-24 w-24 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,247,176,0.95),rgba(255,247,176,0.24)_58%,transparent_76%)] blur-sm" />
                      <div className="absolute bottom-[6px] left-1/2 h-4 w-16 -translate-x-1/2 rounded-full bg-black/18 blur-[3px]" />
                      <ExplorerFigure compact className="relative z-10 drop-shadow-[0_14px_22px_rgba(15,23,42,0.24)]" />
                    </div>
                  </div>

                  <div className="rounded-[28px] border-[6px] border-[#d6c3a0] bg-[linear-gradient(180deg,#f4e1bf_0%,#dcc199_100%)] px-4 py-4 shadow-[0_18px_38px_rgba(123,89,45,0.3)]">
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                      {current.options.map((option, index) => {
                        const state =
                          selected === option
                            ? "correct"
                            : wrong === option
                              ? "wrong"
                              : selected
                                ? "muted"
                                : "idle";

                        const tone = OPTION_TONES[index % OPTION_TONES.length];

                        return (
                          <button
                            key={option}
                            type="button"
                            disabled={Boolean(selected)}
                            onClick={() => handlePick(option)}
                            className={`relative overflow-hidden rounded-[24px] border-[5px] px-5 py-5 text-center font-extrabold shadow-xl transition-all duration-200 ${
                              state === "correct"
                                ? "border-emerald-200 bg-gradient-to-b from-emerald-400 to-emerald-600 text-white scale-[1.03]"
                                : state === "wrong"
                                  ? "border-red-200 bg-gradient-to-b from-rose-400 to-red-600 text-white animate-soft-shake"
                                  : state === "muted"
                                    ? "border-white/60 bg-white/60 text-slate-400"
                                    : `border-white/70 bg-gradient-to-b ${tone} text-white hover:-translate-y-1 hover:scale-[1.02]`
                            }`}
                          >
                            <div className="absolute inset-x-6 top-2 h-3 rounded-full bg-white/18" />
                            <p className="text-5xl drop-shadow-[0_4px_0_rgba(0,0,0,0.18)] md:text-6xl xl:text-7xl">{option}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className={HUD_CARD}>
                <p className="text-xs font-bold uppercase tracking-wide text-violet-700 md:text-sm">{t("alphabetWorld.levelLabel")}</p>
                <div className="mt-3 h-4 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-green-500 transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <p className="mt-3 text-right text-lg font-extrabold text-slate-800">
                  {fixedCount} / {steps.length}
                </p>
              </div>

              <div className={`${HUD_CARD} lg:hidden`}>
                <div className="flex items-end justify-between gap-3">
                  <ExplorerFigure compact />
                  <div className="min-w-0 rounded-[18px] bg-white/75 px-3 py-2 shadow-sm">
                    <p className="text-sm font-extrabold text-slate-800">{t("alphabetWorld.explorerReady")}</p>
                    <p className="text-xs font-semibold text-slate-500">{t("alphabetWorld.explorerGoal")}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlphabetWorld;
