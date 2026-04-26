import ConveyorBelt from "./ConveyorBelt";
import ColorBin from "./ColorBin";

const SortingMachine = ({
  title,
  subtitle,
  items,
  bins,
  binContents,
  wrongId = "",
  draggingId = "",
  activeBinId = "",
  successBinId = "",
  wrongBinId = "",
  onItemDragStart,
  onItemDragEnd,
  onBinDragEnter,
  onBinDragLeave,
  onBinDrop,
}) => {
  return (
    <section className="sorting-machine game-card-surface">
      <div className="sorting-machine__header">
        <span className="sorting-machine__lamp sorting-machine__lamp--left" />
        <div className="sorting-machine__title-wrap">
          <h2 className="sorting-machine__title">{title}</h2>
          {subtitle ? <p className="sorting-machine__subtitle">{subtitle}</p> : null}
        </div>
        <span className="sorting-machine__lamp sorting-machine__lamp--right" />
      </div>

      <div className="sorting-machine__body">
        <div className="sorting-machine__panel sorting-machine__panel--left">
          <div className="sorting-machine__poster">
            <p className="sorting-machine__poster-title">Let's sort</p>
            <span className="sorting-machine__poster-star">⭐</span>
          </div>
        </div>

        <div className="sorting-machine__core">
          <div className="sorting-machine__screen">
            <ConveyorBelt
              items={items}
              wrongId={wrongId}
              draggingId={draggingId}
              onDragStart={onItemDragStart}
              onDragEnd={onItemDragEnd}
            />
          </div>
          <div className="sorting-machine__console">
            <div className="sorting-machine__gauge">
              <span className="sorting-machine__gauge-needle" />
            </div>
            <div className="sorting-machine__lever" />
          </div>
        </div>

        <div className="sorting-machine__panel sorting-machine__panel--right">
          <div className="sorting-machine__speech">
            <p>{subtitle}</p>
          </div>
        </div>
      </div>

      <div className="sorting-machine__bins">
        {bins.map((bin) => (
          <ColorBin
            key={bin.id}
            bin={bin}
            items={binContents[bin.id] || []}
            isOver={activeBinId === bin.id}
            isSuccess={successBinId === bin.id}
            isWrong={wrongBinId === bin.id}
            onDragEnter={onBinDragEnter}
            onDragLeave={onBinDragLeave}
            onDragOver={onBinDragEnter}
            onDrop={onBinDrop}
          />
        ))}
      </div>
    </section>
  );
};

export default SortingMachine;
