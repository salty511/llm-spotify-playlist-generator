import axios from 'axios';
import type { trackIdObject } from '../store/useStore';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface PlaylistRequest {
  user_input: string;
}

export interface Track {
  name: string;
  artist: string;
}

export interface PlaylistResponse {
  description: string | any;
  tracks: Track[];
  playlist_id?: string;
}

export interface ProcessedTrackListObj {
  name: string | null
  artist: string | null
}

export const generatePlaylist = async (userInput: string, trackList: Map<string, trackIdObject>, accessToken?: string | null): Promise<PlaylistResponse> => {
  let trackListProcessed = new Map<string, ProcessedTrackListObj>
  trackList.forEach((value, key) => {
    console.log(key, value)
    trackListProcessed.set(key, {name: value.name, artist: value.artist})
  })
  console.log(trackListProcessed)

  const requestBody: any = {
    user_prompt: userInput,
    user_track_list: JSON.stringify(Object.fromEntries(trackListProcessed))
  };

  if (accessToken) {
    requestBody.access_token = accessToken;
  }

  try {
    const response = await axios.post<PlaylistResponse>(
      `${API_BASE_URL}/generate_playlist`,
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.detail || 'Failed to generate playlist');
    }
    throw new Error('An unexpected error occurred');
  }
};
