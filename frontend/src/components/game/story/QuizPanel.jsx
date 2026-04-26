import QuestionCard from "./QuestionCard";

const QuizPanel = ({
  title,
  questions,
  selections,
  locked = false,
  onSelectOption,
}) => {
  return (
    <div className="rounded-[26px] border-[5px] border-white/55 bg-[linear-gradient(180deg,rgba(255,255,255,0.75),rgba(255,255,255,0.55))] p-4 shadow-[0_22px_44px_rgba(15,23,42,0.18)] backdrop-blur-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="inline-flex items-center gap-2 rounded-2xl bg-violet-600 px-4 py-2 text-white shadow-lg">
          <span className="text-lg">🎧</span>
          <p className="text-sm font-extrabold">{title}</p>
        </div>
        <div className="rounded-2xl bg-white/80 px-3 py-2 text-xs font-bold text-slate-600">
          {Object.keys(selections).length}/{questions.length}
        </div>
      </div>

      <div className="mt-3 space-y-3">
        {questions.map((q, idx) => (
          <QuestionCard
            key={q.question}
            index={idx}
            question={q.question}
            options={q.options}
            selectedLabel={selections[idx]?.label || ""}
            locked={locked}
            onSelect={(opt) => onSelectOption(idx, opt)}
          />
        ))}
      </div>
    </div>
  );
};

export default QuizPanel;
