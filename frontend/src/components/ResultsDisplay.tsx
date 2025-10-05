import React from 'react';
import { Card, ListGroup, Badge } from 'react-bootstrap';
import { PlaylistResponse } from '../api/playlistApi';

interface ResultsDisplayProps {
  result: PlaylistResponse | null;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result }) => {
  if (!result) return null;

  return (
    <div className="mt-4">
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
          <ListGroup.Item className="bg-light">
            <strong>Suggested Tracks ({result.tracks.length})</strong>
          </ListGroup.Item>
          {result.tracks.map((track, index) => (
            <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
              <div>
                <strong>{track.name}</strong>
                <br />
                <small className="text-muted">by {track.artist}</small>
              </div>
              <Badge bg="secondary" pill>
                {index + 1}
              </Badge>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card>
    </div>
  );
};

export default ResultsDisplay;