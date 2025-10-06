import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spinner, Alert } from 'react-bootstrap';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = () => {
      try {
        // Extract tokens from URL hash
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);

        const tokens = {
          access_token: params.get('access_token'),
          token_type: params.get('token_type'),
          expires_in: params.get('expires_in'),
          refresh_token: params.get('refresh_token'),
          scope: params.get('scope'),
        };

        if (!tokens.access_token) {
          throw new Error('No access token received');
        }

        // Store tokens in localStorage
        localStorage.setItem('spotify_tokens', JSON.stringify(tokens));

        // Clean up URL
        window.history.replaceState({}, document.title, '/main');

        // Redirect to main app
        navigate('/main');
      } catch (error) {
        console.error('Auth callback error:', error);
        // Redirect to error page or show error
        navigate('/?error=auth_failed');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="text-center">
        <Spinner animation="border" variant="success" />
        <p className="mt-3">Completing authentication...</p>
      </div>
    </div>
  );
};

export default AuthCallback;