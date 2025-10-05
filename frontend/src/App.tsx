import React, { useState } from 'react';
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import PlaylistForm from './components/PlaylistForm';
import ResultsDisplay from './components/ResultsDisplay';
import { generatePlaylist, PlaylistResponse } from './api/playlistApi';
import './App.css';

function App() {
  const [result, setResult] = useState<PlaylistResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGeneratePlaylist = async (userInput: string) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const playlistResult = await generatePlaylist(userInput);
      setResult(playlistResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <div className="text-center mb-5">
              <h1 className="display-4 text-success mb-3">🎵 LLM Spotify Playlist Generator</h1>
              <p className="lead text-muted">
                Create personalized playlists using AI. Just describe your mood or activity!
              </p>
            </div>

            <PlaylistForm
              onSubmit={handleGeneratePlaylist}
              loading={loading}
              error={error}
            />

            {loading && (
              <div className="text-center mt-4">
                <Spinner animation="border" variant="success" />
                <p className="mt-2 text-muted">Generating your playlist...</p>
              </div>
            )}

            <ResultsDisplay result={result} />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
