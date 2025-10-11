import React from "react";
import { useStore } from "../store/useStore";
import { Button } from "react-bootstrap";
import { searchAndGetLinks } from "../api/albumPreviewAPI";

interface TrackInfo {
  albumName: string;
  trackName: string;
  artistName: string;
  image: string | null;
  trackId: string;
  previewURL: string | null;
  uri: string;
}

interface AlbumProps {
  trackInfo: TrackInfo;
  onClickHandler: (url: string) => void;
  accessToken: string | null;
}

const Album: React.FC<AlbumProps> = ({
  trackInfo,
  onClickHandler,
  accessToken,
}) => {
  const { getCachedPreviewUrl, cachePreviewUrl } = useStore();
  const { addToTrackList } = useStore();

  if (!accessToken) return null;

  const chopNames = (trackInfo: TrackInfo) => {
    const maxTopLine = 22;
    const maxBottomLine = 25;
    if (trackInfo.trackName.length >= maxTopLine) {
      trackInfo.trackName =
        trackInfo.trackName.slice(0, maxTopLine - 3) + "...";
    }

    if ((trackInfo.artistName + trackInfo.albumName).length >= maxBottomLine) {
      trackInfo.albumName =
        trackInfo.albumName.slice(
          0,
          maxBottomLine - trackInfo.artistName.length - 3
        ) + "...";
    }
  };

  chopNames(trackInfo);

  const handlePreviewClick = async () => {
    try {
      // Check if we have a cached URL first
      const cachedUrl = getCachedPreviewUrl(trackInfo.trackId);

      if (cachedUrl) {
        // Use cached URL directly
        console.log(`Using cached preview URL for: ${trackInfo.trackName}`);
        onClickHandler(cachedUrl);
        return;
      }

      // No cached URL, fetch it
      console.log(`Fetching preview URL for: ${trackInfo.trackName}`);
      const previewResult = await searchAndGetLinks(
        trackInfo.trackName,
        1,
        accessToken
      );

      if (previewResult.success && previewResult.results.length > 0) {
        const song = previewResult.results[0];
        const previewUrl = song.previewUrls[0];

        // Cache the URL for future use
        cachePreviewUrl(trackInfo.trackId, previewUrl as string);

        console.log(`Found and cached: ${song.name}`);
        console.log(`Preview URL: ${previewUrl}`);
        onClickHandler(previewUrl as string);
      }
    } catch (error) {
      console.error("Error:", (error as Error).message);
    }
  };

  /* function handlePreviewClickEmbed() {
    console.log('handlePreviewClickEmbed called for trackId:', trackInfo.trackId)
    const embedId = trackInfo.trackId
    console.log('setting embedTrackID to:', embedId)
    setEmbedTrackID(embedId)
    console.log('after set, embedTrackID:', embedTrackID)
  }; */

  const handleTrackListClick = () => {
    addToTrackList(
      trackInfo.trackName,
      trackInfo.image,
      trackInfo.trackId,
      trackInfo.artistName
    );
  };

  return (
    <div style={{ paddingBottom: "10px" }}>
      <div className="card rounded-0">
        {trackInfo.image && (
          <div className="img-preview-button">
            <img
              className="card-img-top"
              src={trackInfo.image}
              alt={`${trackInfo.trackName} album cover`}
            />
            <div className="preview-button">
              <Button
                className="btn-success albumButton"
                onClick={handleTrackListClick}
              >
                Add to Track List
              </Button>
              <Button
                className="btn-success albumButton"
                onClick={handlePreviewClick}
              >
                Preview
              </Button>
            </div>
          </div>
        )}
        <div className="card-body">
          <h5 className="card-title">{trackInfo.trackName}</h5>
          <h6 className="card-subtitle">
            {trackInfo.artistName} - {trackInfo.albumName}
          </h6>
        </div>
      </div>
    </div>
  );
};

export default Album;
