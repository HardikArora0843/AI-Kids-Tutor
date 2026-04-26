const LivesIndicator = ({ lives = 3 }) => (
  <div className="flex items-center gap-2 text-3xl">
    {Array.from({ length: 3 }, (_, index) => (
      <span key={index} className={index < lives ? "opacity-100" : "opacity-25 grayscale"}>
        ❤
      </span>
    ))}
  </div>
);

export default LivesIndicator;
