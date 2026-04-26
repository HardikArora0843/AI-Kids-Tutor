const ColorBin = ({
  bin,
  items = [],
  isOver = false,
  isSuccess = false,
  isWrong = false,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
}) => {
  return (
    <div
      onDragEnter={(event) => onDragEnter?.(event, bin.id)}
      onDragLeave={(event) => onDragLeave?.(event, bin.id)}
      onDragOver={(event) => {
        event.preventDefault();
        onDragOver?.(event, bin.id);
      }}
      onDrop={(event) => onDrop?.(event, bin.id)}
      className={[
        "sorting-bin",
        `sorting-bin--${bin.theme}`,
        isOver ? "sorting-bin--over" : "",
        isSuccess ? "sorting-bin--success" : "",
        isWrong ? "sorting-bin--wrong" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="sorting-bin__lid" />
      <div className="sorting-bin__body">
        <div className="sorting-bin__dropzone" />
        <div className="sorting-bin__badge">{bin.icon}</div>
        <p className="sorting-bin__label">{bin.label}</p>
        <div className="sorting-bin__items">
          {items.map((item) => (
            <span key={item.id} className="sorting-bin__item">
              {item.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ColorBin;
