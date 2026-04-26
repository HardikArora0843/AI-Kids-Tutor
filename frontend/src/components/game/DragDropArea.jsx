const DragDropArea = ({ children, className = "", onDropItem }) => {
  return (
    <div
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        onDropItem?.(event.dataTransfer.getData("text/plain"));
      }}
      className={`rounded-3xl border-4 border-dashed border-white/60 bg-white/20 p-4 ${className}`}
    >
      {children}
    </div>
  );
};

export default DragDropArea;
