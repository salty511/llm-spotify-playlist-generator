import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import MainPage from './components/MainPage';
import NavBar from './components/NavBar';
import { useState } from 'react';
import { useStore } from './store/useStore';
import AboutPage from './components/AboutPage';

const AppContent: React.FC = () => {
  const { accessToken, setAccessToken } = useStore()
  const [ isInitialized, setIsInitialized ] = useState(false)
  
  // Initialize data fetching only after token is set
  // useSpotifyData()

  useEffect(() => {
    // Parse access token from URL on mount
    const hash = window.location.hash.substring(1); // Remove the '#' character
    const params = new URLSearchParams(hash);
		const parsed = params.get('access_token');
    console.log(parsed !== null && accessToken === null)

    if (parsed !== null && accessToken === null) {
      console.log('Setting access token from URL')
      setAccessToken(parsed)
      // Clean up the URL after setting the token
      window.history.replaceState({}, document.title, window.location.pathname)
    }
    setIsInitialized(true)
  }, [accessToken, setAccessToken])

  // Don't render anything until we've checked for tokens
  if (!isInitialized) {
    return (
      <div className="App">
        <div className="container text-center mt-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Initializing...</p>
        </div>
      </div>
    )
  }

  return (
    <Router>
      <NavBar />
      <Routes>
        {/* Main route */}
        <Route 
            path="/" 
            element={
              accessToken ? (
                <MainPage />
              ) : (
                <LoginPage />
              )
            } 
          />
        {/* About route */}
        <Route path="/about" element={<AboutPage />} />
        {/* Fallback route */}
      </Routes>
    </Router>
  )
}


function App() {
  return (
    <AppContent />
  );
}

export default App;
