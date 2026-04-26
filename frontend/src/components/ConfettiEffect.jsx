import { useEffect, useState } from "react";

const CONFETTI_COLORS = [
  "#6366f1", "#f59e0b", "#22c55e", "#ef4444",
  "#f472b6", "#38bdf8", "#a3e635", "#fb923c",
];

const ConfettiPiece = ({ delay, left, color, size }) => (
  <div
    className="absolute top-0 rounded-sm"
    style={{
      left: `${left}%`,
      width: `${size}px`,
      height: `${size}px`,
      backgroundColor: color,
      animation: `confetti-fall ${1 + Math.random() * 0.8}s ease-in ${delay}s forwards`,
      transform: `rotate(${Math.random() * 360}deg)`,
    }}
  />
);

const ConfettiEffect = ({ active = false, duration = 2500 }) => {
  const [show, setShow] = useState(false);
  const [pieces, setPieces] = useState([]);

  useEffect(() => {
    if (active) {
      setShow(true);
      const newPieces = Array.from({ length: 40 }, (_, i) => ({
        id: i,
        delay: Math.random() * 0.5,
        left: Math.random() * 100,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        size: 6 + Math.random() * 8,
      }));
      setPieces(newPieces);

      const timeout = setTimeout(() => setShow(false), duration);
      return () => clearTimeout(timeout);
    }
  }, [active, duration]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((piece) => (
        <ConfettiPiece key={piece.id} {...piece} />
      ))}
    </div>
  );
};

export default ConfettiEffect;
