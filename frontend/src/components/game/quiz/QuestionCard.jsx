const QuestionCard = ({ current, total, question, prompt, comboText, progressLabel }) => (
  <section className="quiz-question-card">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <p className="quiz-question-card__eyebrow">
          {progressLabel.replace("{current}", current).replace("{total}", total)}
        </p>
        <h2 className="quiz-question-card__title">{question}</h2>
      </div>
      <div className="quiz-question-card__badge">{comboText}</div>
    </div>
    <p className="quiz-question-card__prompt">{prompt}</p>
  </section>
);

export default QuestionCard;
