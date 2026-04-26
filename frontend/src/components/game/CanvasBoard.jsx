import { useRef, useState } from "react";

const CanvasBoard = ({
  color = "#2563eb",
  brushSize = 8,
  guide = "",
  title = "Sketch Pad",
  onDraw,
}) => {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);

  const getPoint = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const source = event.touches?.[0] || event;
    return {
      x: source.clientX - rect.left,
      y: source.clientY - rect.top,
    };
  };

  const start = (event) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const point = getPoint(event);
    setDrawing(true);
    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(point.x, point.y);
  };

  const move = (event) => {
    if (!drawing) return;
    event.preventDefault();
    const ctx = canvasRef.current.getContext("2d");
    const point = getPoint(event);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
    onDraw?.();
  };

  const stop = () => setDrawing(false);

  const clear = () => {
    const canvas = canvasRef.current;
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="drawing-board">
      <div className="drawing-board__toolbar">
        <div>
          <p className="drawing-board__eyebrow">{title}</p>
          <p className="drawing-board__hint">Trace the guide and draw with your magic brush.</p>
        </div>
        <button type="button" onClick={clear} className="drawing-board__clear">
          Clear
        </button>
      </div>

      <div className="drawing-board__canvas-wrap">
        {guide && (
          <div className="drawing-board__guide" aria-hidden="true">
            {guide}
          </div>
        )}
        <canvas
          ref={canvasRef}
          width={620}
          height={280}
          onMouseDown={start}
          onMouseMove={move}
          onMouseUp={stop}
          onMouseLeave={stop}
          onTouchStart={start}
          onTouchMove={move}
          onTouchEnd={stop}
          className="drawing-board__canvas"
        />
      </div>
    </div>
  );
};

export default CanvasBoard;
