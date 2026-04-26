const Balloon = ({
  value,
  color,
  onClick,
  isPopped = false,
  isWrong = false,
  style = {},
  animationDelay = "0s",
}) => {
  const shellClasses = [
    "number-balloon",
    isPopped ? "number-balloon--popped" : "",
    isWrong ? "number-balloon--wrong" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isPopped}
      className={shellClasses}
      style={{
        ...style,
        "--balloon-color": color,
        "--balloon-delay": animationDelay,
      }}
      aria-label={`Pop balloon ${value}`}
    >
      <span className="number-balloon__shine" />
      <span className="number-balloon__number">{value}</span>
      <span className="number-balloon__knot" />
      <span className="number-balloon__string" />
      <span className="number-balloon__burst number-balloon__burst--one" />
      <span className="number-balloon__burst number-balloon__burst--two" />
      <span className="number-balloon__burst number-balloon__burst--three" />
      <span className="number-balloon__burst number-balloon__burst--four" />
    </button>
  );
};

export default Balloon;
