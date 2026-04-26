import ProgressBar from "../../ProgressBar";

const StoryProgressBar = ({ value, max }) => {
  return (
    <div className="rounded-[24px] border-[4px] border-white/55 bg-white/70 p-3 shadow-[0_18px_34px_rgba(15,23,42,0.14)] backdrop-blur-sm">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-extrabold text-slate-800">Story Quiz</p>
        <p className="text-xs font-bold text-slate-600">
          {value}/{max}
        </p>
      </div>
      <div className="mt-3">
        <ProgressBar value={value} max={max} color="bg-gradient-to-r from-emerald-400 to-lime-400" />
      </div>
    </div>
  );
};

export default StoryProgressBar;
