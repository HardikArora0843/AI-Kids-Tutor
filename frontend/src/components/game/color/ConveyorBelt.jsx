import ColorItem from "./ColorItem";

const ConveyorBelt = ({
  items,
  wrongId = "",
  draggingId = "",
  onDragStart,
  onDragEnd,
}) => {
  return (
    <div className="sorting-conveyor">
      <div className="sorting-conveyor__track">
        <div className="sorting-conveyor__rollers">
          {Array.from({ length: 7 }, (_, index) => (
            <span key={index} className="sorting-conveyor__roller" />
          ))}
        </div>
        <div className="sorting-conveyor__items">
          {items.map((item, index) => (
            <div
              key={item.id}
              className="sorting-conveyor__slot"
              style={{ animationDelay: `${index * 0.18}s` }}
            >
              <ColorItem
                item={item}
                isWrong={wrongId === item.id}
                isDragging={draggingId === item.id}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ConveyorBelt;
