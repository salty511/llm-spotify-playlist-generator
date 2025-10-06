import axios from 'axios';

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
}

export const generatePlaylist = async (userInput: string): Promise<PlaylistResponse> => {
  try {
    const response = await axios.post<PlaylistResponse>(
      `${API_BASE_URL}/generate_playlist`,
      { user_input: userInput },
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
