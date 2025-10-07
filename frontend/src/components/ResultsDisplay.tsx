import React from 'react';
import { Card, ListGroup, Badge } from 'react-bootstrap';
import type { PlaylistResponse } from '../api/playlistApi';

interface ResultsDisplayProps {
  result: PlaylistResponse | null;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result }) => {
  if (!result) return null;

  console.log(result);

  return (
    <div className="mt-4 pb-5" style={{maxWidth: '70%'}}>
      <Card className="shadow-sm">
        <Card.Header className="bg-success text-white">
          <h3 className="mb-0">Your Generated Playlist</h3>
        </Card.Header>
        <Card.Body>
          <Card.Title>Playlist Description</Card.Title>
          <Card.Text className="fst-italic">
            {result.description}
          </Card.Text>
        </Card.Body>
        <ListGroup variant="flush">
          <ListGroup.Item className="bg-body-tertiary">
            <strong>Suggested Tracks ({result.tracks.length})</strong>
          </ListGroup.Item>
          {result.tracks.map((track, index) => (
            <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
              <div>
                <strong>{track.name}</strong>
                <br />
                <small className="text-muted">by {track.artist}</small>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card>
    </div>
  );
};

export default ResultsDisplay;