import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Button } from "react-bootstrap";


const LoginPage: React.FC = ({ accessToken }) => {
  const authUrl = import.meta.env.VITE_LOGIN_URL || "http://localhost:9000/.netlify/functions/api/login"
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate(authUrl);
  };

  return (
    <Container style={{paddingTop: "30px", textAlign: "left"}}>
      <h1 className="display-3">Welcome to DJ-GPT</h1>
      <p className="lead">This website uses the OpenAI & Spotify API to generate playlists from natural language prompts</p>
        <hr className="my-4" />
        <p>It uses the Spotify API to access account data such as your Top Tracks & Artists, You can login to Spotify here</p>
        <p className="lead">
            {!accessToken ?
                <Button 
                className="btn-success btn-lg px-3 py-2" 
                onClick={handleLogin}
              >
                Login with Spotify
              </Button>
            : <p>Already Logged in</p>}
      </p>
    </Container>
  )
};

export default LoginPage;