import React from "react";
import { useStore, type trackIdObject } from "../store/useStore";

const TrackList: React.FC<{ trackList: Map<string, trackIdObject> }> = ({
  trackList,
}) => {
  const { removeFromTrackList } = useStore();
  const onclickRemove = (trackId: string) => {
    removeFromTrackList(trackId);
  };
  return (
    <div className="row">
      {Array.from(trackList.entries()).map(([key, value]) => (
        <div
          key={key}
          className="col-xl-3 col-lg-3 col-md-3 col-sm-6 col-6 rounded-0 d-flex align-items-center pt-2"
        >
          {value.img_url && (
            <div
              className="img-preview-button me-2"
              style={{ position: "relative", display: "inline-block" }}
            >
              <img
                src={value.img_url}
                alt={value.name || "Track"}
                className="card-img-top"
                style={{ width: "50px", height: "50px", objectFit: "cover" }}
              />
              <div
                className="preview-button"
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              >
                <img
                  className="remove-icon"
                  src="../../icons8-remove-64.png"
                  onClick={() => onclickRemove(key)}
                />
              </div>
            </div>
          )}
          <p className="mb-0">{value.name}</p>
        </div>
      ))}
    </div>
  );
};

export default TrackList;
