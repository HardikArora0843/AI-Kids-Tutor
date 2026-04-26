const stars = [
  { left: "8%", top: "14%", delay: "0s", size: "sm" },
  { left: "22%", top: "8%", delay: "0.7s", size: "md" },
  { left: "38%", top: "16%", delay: "1.4s", size: "sm" },
  { left: "61%", top: "10%", delay: "1s", size: "md" },
  { left: "79%", top: "18%", delay: "2.1s", size: "sm" },
  { left: "90%", top: "9%", delay: "2.8s", size: "md" },
];

const bubbles = [
  { left: "6%", bottom: "16%", delay: "0.2s", size: 44 },
  { left: "17%", bottom: "30%", delay: "1.3s", size: 26 },
  { left: "80%", bottom: "22%", delay: "0.8s", size: 34 },
  { left: "92%", bottom: "36%", delay: "2s", size: 48 },
];

const playgroundClouds = [
  { left: "8%", top: "10%", width: "11rem", className: "animate-cloud-drift" },
  { left: "48%", top: "16%", width: "14rem", className: "animate-cloud-drift-slow" },
  { left: "72%", top: "8%", width: "10rem", className: "animate-cloud-drift" },
];

const playgroundTrees = [
  { left: "4%", scale: 1 },
  { left: "16%", scale: 0.82 },
  { left: "82%", scale: 0.9 },
  { left: "92%", scale: 1.06 },
];

const labLamps = [
  { left: "12%" },
  { left: "50%" },
  { left: "88%" },
];

const arenaOrbs = [
  { left: "9%", top: "18%", delay: "0s" },
  { left: "26%", top: "10%", delay: "1.2s" },
  { left: "74%", top: "14%", delay: "0.5s" },
  { left: "88%", top: "28%", delay: "1.7s" },
];

const AnimatedBackground = ({ theme = "default" }) => {
  if (theme === "quiz-arena") {
    return (
      <div className="quiz-scene fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="quiz-scene__sky" />
        <div className="quiz-scene__grid" />
        <div className="quiz-scene__glow quiz-scene__glow--pink" />
        <div className="quiz-scene__glow quiz-scene__glow--violet" />
        <div className="quiz-scene__glow quiz-scene__glow--blue" />

        <div className="quiz-scene__beams">
          <span className="quiz-scene__beam quiz-scene__beam--left" />
          <span className="quiz-scene__beam quiz-scene__beam--right" />
        </div>

        <div className="quiz-scene__orbs">
          {arenaOrbs.map((orb) => (
            <span
              key={`${orb.left}-${orb.top}`}
              className="quiz-scene__orb animate-star-twinkle"
              style={{ left: orb.left, top: orb.top, animationDelay: orb.delay }}
            />
          ))}
        </div>

        <div className="quiz-scene__floor" />
      </div>
    );
  }

  if (theme === "factory-lab") {
    return (
      <div className="factory-scene fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="factory-scene__sky" />
        <div className="factory-scene__glow factory-scene__glow--one" />
        <div className="factory-scene__glow factory-scene__glow--two" />
        <div className="factory-scene__glow factory-scene__glow--three" />

        <div className="factory-scene__pipes factory-scene__pipes--left" />
        <div className="factory-scene__pipes factory-scene__pipes--right" />

        <div className="factory-scene__lamps">
          {labLamps.map((lamp) => (
            <span
              key={lamp.left}
              className="factory-scene__lamp"
              style={{ left: lamp.left }}
            />
          ))}
        </div>

        <div className="factory-scene__floor" />
      </div>
    );
  }

  if (theme === "sky-playground") {
    return (
      <div className="number-scene fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="number-scene__sky" />
        <div className="number-scene__sun" />

        {playgroundClouds.map((cloud) => (
          <span
            key={`${cloud.left}-${cloud.top}`}
            className={`number-scene__cloud ${cloud.className}`}
            style={{ left: cloud.left, top: cloud.top, width: cloud.width }}
          />
        ))}

        <div className="number-scene__sparkles">
          <span className="number-scene__spark number-scene__spark--one animate-star-twinkle" />
          <span className="number-scene__spark number-scene__spark--two animate-star-twinkle" />
          <span className="number-scene__spark number-scene__spark--three animate-star-twinkle" />
        </div>

        <div className="number-scene__hill number-scene__hill--back animate-ground-sway" />
        <div className="number-scene__hill number-scene__hill--front animate-ground-sway" />

        <div className="number-scene__trees">
          {playgroundTrees.map((tree) => (
            <span
              key={tree.left}
              className="number-scene__tree"
              style={{ left: tree.left, transform: `scale(${tree.scale})` }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="child-scene fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <div className="child-scene__sky" />
      <div className="child-scene__glow child-scene__glow--one" />
      <div className="child-scene__glow child-scene__glow--two" />
      <div className="child-scene__glow child-scene__glow--three" />

      <div className="child-scene__sun animate-gentle-spin">
        <span className="child-scene__sun-face">😊</span>
      </div>

      <div className="child-scene__cloud child-scene__cloud--one animate-cloud-drift" />
      <div className="child-scene__cloud child-scene__cloud--two animate-cloud-drift-slow" />
      <div className="child-scene__cloud child-scene__cloud--three animate-cloud-drift" />

      <div className="child-scene__balloon child-scene__balloon--left animate-balloon-rise">
        <span className="child-scene__emoji">🎈</span>
      </div>
      <div className="child-scene__balloon child-scene__balloon--center animate-balloon-rise-soft">
        <span className="child-scene__emoji">🎈</span>
      </div>
      <div className="child-scene__balloon child-scene__balloon--right animate-balloon-rise">
        <span className="child-scene__emoji">🎈</span>
      </div>

      <div className="child-scene__toy child-scene__toy--plane animate-plane-glide">
        <span className="child-scene__emoji">🛩️</span>
      </div>
      <div className="child-scene__toy child-scene__toy--kite animate-kite-float">
        <span className="child-scene__emoji">🪁</span>
      </div>

      <div className="child-scene__sparkles">
        {stars.map((star) => (
          <span
            key={`${star.left}-${star.top}`}
            className={`child-scene__star child-scene__star--${star.size} animate-star-twinkle`}
            style={{ left: star.left, top: star.top, animationDelay: star.delay }}
          />
        ))}
      </div>

      <div className="child-scene__bubbles">
        {bubbles.map((bubble) => (
          <span
            key={`${bubble.left}-${bubble.bottom}`}
            className="child-scene__bubble animate-bubble-rise"
            style={{
              left: bubble.left,
              bottom: bubble.bottom,
              width: `${bubble.size}px`,
              height: `${bubble.size}px`,
              animationDelay: bubble.delay,
            }}
          />
        ))}
      </div>

      <div className="child-scene__ground">
        <div className="child-scene__hill child-scene__hill--back animate-ground-sway" />
        <div className="child-scene__hill child-scene__hill--mid animate-ground-sway" />
        <div className="child-scene__playmat" />
        <div className="child-scene__toyline">
          <div className="child-scene__figure child-scene__figure--left animate-toy-bob">
            <span className="child-scene__emoji">🧸</span>
          </div>
          <div className="child-scene__figure child-scene__figure--train animate-toy-bob">
            <span className="child-scene__emoji">🚂</span>
          </div>
          <div className="child-scene__figure child-scene__figure--blocks animate-toy-bob">
            <span className="child-scene__emoji">🧩</span>
          </div>
          <div className="child-scene__figure child-scene__figure--robot animate-toy-bob">
            <span className="child-scene__emoji">🤖</span>
          </div>
          <div className="child-scene__figure child-scene__figure--rocket animate-rocket-hover">
            <span className="child-scene__emoji">🚀</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimatedBackground;
