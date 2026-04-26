import { useNavigate } from "react-router-dom";
import Mentor from "../mentor/Mentor";
import AnimatedButton from "../AnimatedButton";
import SoundToggle from "../SoundToggle";
import useTranslation from "../../utils/useTranslation";

const GameLayout = ({
  title,
  subtitle,
  bgGradient = "from-primary-400 to-primary-600",
  mentor,
  headerClassName = "",
  titleClassName = "",
  subtitleClassName = "",
  backButtonClassName = "",
  children,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className={`min-h-screen lg:h-screen lg:max-h-screen bg-gradient-to-br ${bgGradient} relative overflow-hidden px-4 py-4 page-shell`}>
      <div className="absolute top-10 right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-56 h-56 bg-white/10 rounded-full blur-3xl" />

      {mentor && (
        <Mentor
          character={mentor.character}
          state={mentor.state}
          message={mentor.message}
          showBubble={mentor.showBubble}
          speechEnabled={mentor.speechEnabled}
          onToggleSpeech={mentor.toggleSpeech}
        />
      )}

      <div className="relative z-20 w-full max-w-[1400px] mx-auto h-full flex flex-col min-h-0">
        <div className={`shrink-0 mb-4 relative z-30 ${headerClassName}`}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => navigate("/child")}
              className={`rounded-full border-4 border-amber-300 bg-gradient-to-b from-yellow-300 to-amber-400 px-4 py-2.5 text-base font-bold text-slate-900 shadow-[0_10px_22px_rgba(145,90,12,0.28)] transition hover:scale-[1.03] md:px-5 md:py-3 md:text-lg ${backButtonClassName}`}
            >
              ← {t("common.back")}
            </button>

            <div className={`rounded-[28px] border-[6px] border-amber-950/20 bg-[linear-gradient(180deg,#98582f_0%,#754121_100%)] px-5 py-3 text-center shadow-[0_16px_30px_rgba(96,52,24,0.34)] md:px-6 md:py-4 ${titleClassName}`}>
              <h1 className="text-2xl font-extrabold tracking-tight text-white drop-shadow-[0_4px_0_rgba(94,47,17,0.65)] md:text-4xl xl:text-5xl">
                {title}
              </h1>
              {subtitle && (
                <p className={`mt-1 text-sm font-bold text-white/85 md:text-base ${subtitleClassName}`}>
                  {subtitle}
                </p>
              )}
            </div>

            <div className="rounded-full border-4 border-violet-900/35 bg-gradient-to-r from-violet-900 to-purple-700 px-3 py-2.5 text-white shadow-[0_14px_28px_rgba(88,28,135,0.35)]">
              <SoundToggle className="!bg-transparent !px-0 !py-0 !text-white !shadow-none hover:!bg-transparent" />
            </div>
          </div>
        </div>
        <div className="relative z-10 flex-1 min-h-0 overflow-y-auto pr-1">
          {children}
        </div>
      </div>
    </div>
  );
};

export default GameLayout;
