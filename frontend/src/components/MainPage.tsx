import React, { useState } from 'react';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import PlaylistForm from './PlaylistForm';
import ResultsDisplay from './ResultsDisplay';
import { generatePlaylist } from '../api/playlistApi';
import type { PlaylistResponse } from '../api/playlistApi'
import { useStore } from '../store/useStore';
import { useCallback } from 'react';
import SpotifyEmbed from '../components/SpotifyEmbed.tsx';
import Album from './Album';
import AudioPlayer from './AudioPlayer.tsx';

interface ProcessedTrack {
  albumName: string;
  trackName: string;
  artistName: string;
  image: string | null;
  trackId: string;
  previewURL: string | null;
  uri: string;
}

interface ProcessedArtist {
  artistName: string;
  genres: string[];
}

interface User {
  userName: string;
  profileImage: string | null;
  followers: number;
}

interface MusicData {
  topTracks: ProcessedTrack[];
  topArtists: ProcessedArtist[];
  user: User;
}

const MainPage: React.FC = () => {
  const [result, setResult] = useState<PlaylistResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { 
    setCurrentDataSet, 
    playStatus, 
    setPlayStatus, 
    previewURL, 
    setPreviewURL,
    getCurrentDataSet,
    accessToken,
    embedTrackID
  } = useStore()

  const dataSet = getCurrentDataSet() as MusicData | undefined

  const handleAudioEnded = useCallback(() => {
    setPlayStatus('STOPPED')
  }, [setPlayStatus])

  const handleAudioError = useCallback((error: Event) => {
    console.error('Audio error:', error)
    setPlayStatus('STOPPED')
  }, [setPlayStatus])

  const renderAlbums = useCallback((dataSet: MusicData | undefined) => {
    if (!dataSet?.topTracks) return null
    
    const albumsToRender = dataSet.topTracks
    return (
      <div className="container">
        <div className="row">
          {albumsToRender.slice(0, 20).map((track: ProcessedTrack) => (
            <div key={track.trackId} className="col-xl-3 col-lg-3 col-md-3 col-sm-6 col-6 rounded-0">
              <Album 
                trackInfo={track} 
                onClickHandler={onClickHandler_Album} 
                accessToken={accessToken}
              />
            </div>
          ))}
        </div>
      </div>
    )
  }, [accessToken])

  const renderSpotifyPlayer = useCallback(() => {
    console.log(`renderSpotifyPlayer called with embedTrackID: ${embedTrackID}`)
    return <SpotifyEmbed trackID={embedTrackID}/>
  }, [embedTrackID])

  const onClickTimeFrame = useCallback((timeFrame: "shortTerm" | "mediumTerm" | "longTerm") => {
    setCurrentDataSet(timeFrame)
  }, [setCurrentDataSet])

  const onClickHandler_Album = useCallback((soundURL: string) => {
    if (soundURL !== previewURL) {
      // New song - set new URL and start playing
      setPreviewURL(soundURL)
      setPlayStatus('PLAYING')
    } else {
      // Same song - toggle play/pause
      if (playStatus === 'PLAYING') {
        setPlayStatus('STOPPED')
      } else {
        setPlayStatus('PLAYING')
      }
    }
  }, [previewURL, playStatus, setPlayStatus, setPreviewURL])

  if (!dataSet) {
    return (
      <div className="container text-center mt-5">
        <div className="spinner-border" role="status"></div>
        <p className="mt-3">Loading your music data...</p>
      </div>
    )
  }

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
    <div className="app-container">
      <AudioPlayer
        url={previewURL} 
        isPlaying={playStatus === 'PLAYING'}
        onEnded={handleAudioEnded}
        onError={handleAudioError}
      />
      <Container>
        <Row className="justify-content-center">
          <Col md={7} lg={7}>
            <div className="text-center mb-5 pt-4">
              <h1 className="display-4 text-success mb-3">LLM Spotify Playlist Generator</h1>
              <p className="lead text-muted">
                Create personalized playlists using AI. Just describe your mood or activity!
              </p>
            </div>
            <Row className="justify-content-center">
              <Col md={10}>
                <PlaylistForm
                  onSubmit={handleGeneratePlaylist}
                  loading={loading}
                  error={error}
                />
              </Col>
            </Row>
            {loading && (
              <div className="text-center mt-4">
                <Spinner animation="border" variant="success" />
                <p className="mt-2 text-muted">Generating your playlist...</p>
              </div>
            )}
          
            <h3 style={{paddingTop: "20px", textAlign: "center"}}>Your Top Tracks</h3>
      
            <div className="container text-center pb-3" >
              <div>
                <button className="btn btn-outline-info" onClick={() => onClickTimeFrame("shortTerm")} style={{margin: "10px"}}>Short Term</button>
                <button className="btn btn-outline-info" onClick={() => onClickTimeFrame("mediumTerm")} style={{margin: "10px"}}>Medium Term</button>
                <button className="btn btn-outline-info" onClick={() => onClickTimeFrame("longTerm")} style={{margin: "10px"}}>Long Term</button>
              </div>
            </div>
            <ResultsDisplay result={result} />
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md={11} lg={11}>
            {renderAlbums(dataSet)}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default MainPage;
