import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';

interface PlaylistFormProps {
  onSubmit: (input: string) => void;
  loading: boolean;
  error: string | null;
}

const PlaylistForm: React.FC<PlaylistFormProps> = ({ onSubmit, loading, error }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSubmit(input.trim());
    }
  };

  return (
    <div className="mb-4">
      <h2 className="mb-3 text-success">Generate Your Playlist</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Describe your perfect playlist:</Form.Label>
          <Form.Control
            type="text"
            placeholder="e.g., upbeat workout music, chill vibes for studying"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            size="lg"
          />
          <Form.Text className="text-muted">
            Enter any theme, mood, or activity for your playlist
          </Form.Text>
        </Form.Group>
        <Button
          variant="success"
          type="submit"
          size="lg"
          disabled={loading || !input.trim()}
          className="w-100"
        >
          {loading ? 'Generating...' : 'Generate Playlist'}
        </Button>
      </Form>
      {error && (
        <Alert variant="danger" className="mt-3">
          {error}
        </Alert>
      )}
    </div>
  );
};

export default PlaylistForm;