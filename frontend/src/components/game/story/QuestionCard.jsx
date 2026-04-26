import OptionCard from "./OptionCard";

const QuestionCard = ({
  index,
  question,
  options,
  selectedLabel,
  locked = false,
  onSelect,
}) => {
  return (
    <div className="rounded-[22px] border-[4px] border-white/55 bg-white/75 p-4 shadow-[0_18px_34px_rgba(15,23,42,0.16)] backdrop-blur-sm">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-sm font-black text-amber-700 shadow-sm">
          {index + 1}
        </span>
        <div className="min-w-0">
          <p className="text-sm font-extrabold text-slate-800">{question}</p>
          <p className="mt-1 text-xs font-semibold text-slate-500">Choose the best answer</p>
        </div>
      </div>

      <div className="mt-3 grid gap-2 md:grid-cols-3">
        {options.map((opt) => {
          const isSelected = selectedLabel === opt.label;
          const state = isSelected
            ? opt.correct
              ? "correct"
              : "wrong"
            : selectedLabel
              ? "muted"
              : "idle";

          return (
            <OptionCard
              key={opt.label}
              label={opt.label}
              image={opt.image}
              disabled={locked || Boolean(selectedLabel)}
              state={state}
              onClick={() => onSelect(opt)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default QuestionCard;
