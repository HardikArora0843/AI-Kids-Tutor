const ColorItem = ({
  item,
  isWrong = false,
  isDragging = false,
  onDragStart,
  onDragEnd,
}) => {
  return (
    <div
      draggable
      onDragStart={(event) => onDragStart?.(event, item)}
      onDragEnd={onDragEnd}
      className={[
        "sorting-item",
        isWrong ? "sorting-item--wrong" : "",
        isDragging ? "sorting-item--dragging" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      role="button"
      tabIndex={0}
      aria-label={`${item.name || item.id} item`}
    >
      <div className="sorting-item__card">
        <span className="sorting-item__emoji">{item.label}</span>
      </div>
    </div>
  );
};

export default ColorItem;
