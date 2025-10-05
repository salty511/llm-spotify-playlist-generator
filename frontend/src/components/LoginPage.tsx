import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Button } from "react-bootstrap";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/main");
  };

  return (
    <Container className="py-5">
      <div className="text-center">
        <h1 className="display-3 text-success mb-4">🎵 LLM Spotify Playlist Generator</h1>
        <p className="lead text-muted mb-4">
          Create personalized playlists using AI. Just describe your mood or activity!
        </p>
        <hr className="my-4" />
        <p className="mb-4">
          Experience the power of AI-driven music curation. Our system uses advanced language models
          to understand your preferences and generate perfect playlists from Spotify's vast library.
        </p>
        <Button
          variant="success"
          size="lg"
          onClick={handleGetStarted}
          className="px-5 py-3"
        >
          Get Started
        </Button>
      </div>
    </Container>
  );
};

export default LoginPage;