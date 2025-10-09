import React, { useEffect, useState } from "react";
import { Card, ListGroup, Badge } from "react-bootstrap";
import type { PlaylistResponse } from "../api/playlistApi";
import { Button } from "react-bootstrap";

interface ResultsDisplayProps {
  result: PlaylistResponse | null;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result }) => {
  const [show, setShow] = useState(true);

  console.log(result);

  function onClick() {
    setShow(false);
  }

  useEffect(() => {
    setShow(true);
  }, [result]);

  return (
    <div className="mt-4 pb-5" style={{ maxWidth: "70%" }}>
      {result && show && (
        <Card className="shadow-sm">
          <Card.Header className="bg-success text-white d-flex justify-content-between">
            <h3 className="mb-0">Your Generated Playlist</h3>
            <Button variant="dark" onClick={onClick}>
              Close
            </Button>
          </Card.Header>
          <Card.Body>
            <Card.Title>Playlist Description</Card.Title>
            <Card.Text className="fst-italic">{result.description}</Card.Text>
            {result.playlist_id && (
              <div className="mt-3">
                <a
                  href={`https://open.spotify.com/playlist/${result.playlist_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-success"
                >
                  Open Playlist on Spotify
                </a>
              </div>
            )}
          </Card.Body>
          <ListGroup variant="flush">
            <ListGroup.Item className="bg-body-tertiary">
              <strong>Suggested Tracks ({result.tracks.length})</strong>
            </ListGroup.Item>
            {result.tracks.map((track, index) => (
              <ListGroup.Item
                key={index}
                className="d-flex justify-content-between align-items-center"
              >
                <div>
                  <strong>{track.name}</strong>
                  <br />
                  <small className="text-muted">by {track.artist}</small>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card>
      )}
    </div>
  );
};

export default ResultsDisplay;
