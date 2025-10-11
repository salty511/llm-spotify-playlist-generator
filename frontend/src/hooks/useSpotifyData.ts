import { useEffect } from "react";
import { useStore } from "../store/useStore";
import type { ProcessedTrack, ProcessedArtist } from "../store/useStore";

interface SpotifyTrack {
  id: string;
  name: string;
  album: {
    name: string;
    images: { url: string }[];
  };
  artists: { name: string }[];
  preview_url: string | null;
  uri: string;
}

interface SpotifyArtist {
  name: string;
  genres: string[];
}

export const useSpotifyData = () => {
  const { accessToken, setMusicData, setUser, setEmbedTrackID } = useStore();

  const fetchUserData = async (token: string): Promise<any> => {
    try {
      const response = await fetch("https://api.spotify.com/v1/me", {
        headers: { Authorization: "Bearer " + token },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      setUser({
        userName: data.display_name,
        profileImage: data.images?.[0]?.url || null,
        followers: data.followers?.total || 0,
      });

      return data;
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
  };

  const fetchTopTracks = async (
    token: string,
    timeRange: string
  ): Promise<ProcessedTrack[]> => {
    try {
      const response = await fetch(
        `https://api.spotify.com/v1/me/top/tracks/?limit=50&time_range=${timeRange}`,
        {
          headers: { Authorization: "Bearer " + token },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const processedTracks: ProcessedTrack[] = data.items.map(
        (trackObject: SpotifyTrack) => {
          let trackName = trackObject.name;
          let albumName = trackObject.album.name;
          const artistName = trackObject.artists[0].name;

          return {
            albumName,
            trackName,
            artistName,
            image: trackObject.album.images[1]?.url || null,
            trackId: trackObject.id,
            previewURL: trackObject.preview_url,
            uri: trackObject.uri,
          };
        }
      );

      return processedTracks;
    } catch (error) {
      console.error(`Error fetching top tracks for ${timeRange}:`, error);
      return [];
    }
  };

  const fetchTopArtists = async (
    token: string,
    timeRange: string
  ): Promise<ProcessedArtist[]> => {
    try {
      const response = await fetch(
        `https://api.spotify.com/v1/me/top/artists/?limit=50&time_range=${timeRange}`,
        {
          headers: { Authorization: "Bearer " + token },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const processedArtists: ProcessedArtist[] = data.items.map(
        (artistObject: SpotifyArtist) => ({
          artistName: artistObject.name,
          genres: artistObject.genres,
        })
      );

      return processedArtists;
    } catch (error) {
      console.error(`Error fetching top artists for ${timeRange}:`, error);
      return [];
    }
  };

  const fetchDataForTimeRange = async (
    token: string,
    timeRange: string
  ): Promise<void> => {
    if (!token) return;

    console.log(`${timeRange}: Starting data fetch`);

    try {
      // Fetch user data if not already fetched
      if (!useStore.getState().user) {
        await fetchUserData(token);
      }

      // Fetch top tracks and artists
      const [topTracks, topArtists] = await Promise.all([
        fetchTopTracks(token, timeRange),
        fetchTopArtists(token, timeRange),
      ]);

      // Combine data
      const musicData = {
        topTracks,
        topArtists,
        user: useStore.getState().user,
      };

      setMusicData(timeRange, musicData);
      setEmbedTrackID(topTracks[0].trackId);
      console.log(`${timeRange}: Data fetch complete`);
    } catch (error) {
      console.error(`Error in fetchDataForTimeRange for ${timeRange}:`, error);
    }
  };

  useEffect(() => {
    // Only fetch data if we have a valid access token
    if (accessToken && accessToken.trim() !== "") {
      console.log("Access token available, fetching data...");
      // Fetch data for all time ranges
      fetchDataForTimeRange(accessToken, "short_term");
      fetchDataForTimeRange(accessToken, "medium_term");
      fetchDataForTimeRange(accessToken, "long_term");
    } else {
      console.log("No access token available, skipping data fetch");
    }
  }, [accessToken]);

  return {
    fetchDataForTimeRange,
    fetchUserData,
    fetchTopTracks,
    fetchTopArtists,
  };
};
