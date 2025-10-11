import React from "react";

interface SpotifyEmbedProps {
  trackID: string | null;
}

const SpotifyEmbed: React.FC<SpotifyEmbedProps> = ({ trackID }) => {
  if (!trackID) return null;
  console.log(trackID);
  return (
    <div
      style={{ left: "0", width: "50%", height: "352px", position: "relative" }}
    >
      <iframe
        src={`https://open.spotify.com/embed/track/${trackID}?utm_source=oembed`}
        style={{
          top: "0",
          left: "0",
          width: "100%",
          height: "100%",
          position: "absolute",
          border: "0",
          borderRadius: "20px",
        }}
        allow="clipboard-write *; encrypted-media *; fullscreen *; picture-in-picture *;"
      ></iframe>
    </div>
  );
};

export default SpotifyEmbed;
