import { create } from "zustand";
import StringSimilarity from "string-similarity";

export interface trackIdObject {
  name: string | null;
  img_url: string | null;
  artist: string | null;
}

export interface ProcessedTrack {
  albumName: string;
  trackName: string;
  artistName: string;
  image: string | null;
  trackId: string;
  previewURL: string | null;
  uri: string;
}

export interface ProcessedArtist {
  artistName: string;
  genres: string[];
}

export interface User {
  userName: string;
  profileImage: string | null;
  followers: number;
}

export interface MusicData {
  topTracks: ProcessedTrack[];
  topArtists: ProcessedArtist[];
  user: User | null;
}

interface storeState {
  // User state
  user: User | null;
  accessToken: string | null;

  // Music data state
  shortTerm: MusicData | null;
  mediumTerm: MusicData | null;
  longTerm: MusicData | null;

  // UI state
  currentDataSet: "shortTerm" | "mediumTerm" | "longTerm";
  playStatus: "STOPPED" | "PLAYING" | "PAUSED";
  previewURL: string | null;

  // Preview URL cache - maps trackId to preview URL
  previewUrlCache: Map<string, string>;

  // Current track ID in embed player
  embedTrackID: string | null;

  // Track List
  trackList: Map<string, trackIdObject>;

  // Actions
  setAccessToken: (token: string) => void;
  setUser: (userData: User) => void;
  setMusicData: (timeRange: string, data: MusicData) => void;
  setCurrentDataSet: (dataSet: "shortTerm" | "mediumTerm" | "longTerm") => void;
  logout: () => void;
  setPlayStatus: (status: "STOPPED" | "PLAYING" | "PAUSED") => void;
  setPreviewURL: (url: string) => void;
  setEmbedTrackID: (newTrackID: string) => void;
  addToTrackList: (
    name: string,
    img_url: string | null,
    track_id: string,
    artist: string
  ) => void;
  removeFromTrackList: (track_id: string) => void;

  // Cache a preview URL for a track
  cachePreviewUrl: (trackId: string, previewUrl: string) => void;
  // Get cached preview URL for a track
  getCachedPreviewUrl: (trackId: string) => string | undefined;
  // Clear cache (useful for logout)
  clearPreviewUrlCache: () => void;

  // Computed values
  getCurrentDataSet: () => MusicData | null;
  getCurrentTrackList: () => Map<string, trackIdObject>;
  getAllGenres: () => Array<{ name: string; value: number }>;
}

type PlayStatus = storeState["playStatus"];

export const useStore = create<storeState>()((set, get) => ({
  // User state
  user: null,
  accessToken: null,

  // Music data state
  shortTerm: null,
  mediumTerm: null,
  longTerm: null,

  // UI state
  currentDataSet: "mediumTerm",
  playStatus: "STOPPED", // STOPPED, PLAYING, PAUSED
  previewURL: null,

  // Preview URL cache - maps trackId to preview URL
  previewUrlCache: new Map(),

  // Current Track ID in embed player
  embedTrackID: null,

  // Track List
  trackList: new Map(),

  // Actions
  setAccessToken: (token) => set({ accessToken: token }),
  setEmbedTrackID: (newTrackID) => set({ embedTrackID: newTrackID }),
  setUser: (userData) => set({ user: userData }),

  setMusicData: (timeRange, data) => {
    switch (timeRange) {
      case "short_term":
        set({ shortTerm: data });
        break;
      case "medium_term":
        set({ mediumTerm: data });
        break;
      case "long_term":
        set({ longTerm: data });
        break;
      default:
        break;
    }
  },

  setCurrentDataSet: (dataSet) => set({ currentDataSet: dataSet }),

  setPlayStatus: (status: PlayStatus) => set({ playStatus: status }),

  setPreviewURL: (url: string) => set({ previewURL: url }),

  addToTrackList: (
    name: string,
    img_url: string | null,
    track_id: string,
    artist: string
  ) =>
    set((state) => {
      const newTrackList = new Map(state.trackList);
      newTrackList.set(track_id, { name, img_url, artist });
      return { ...state, trackList: newTrackList };
    }),

  removeFromTrackList: (track_id: string) =>
    set((state) => {
      const newTrackList = new Map(state.trackList);
      newTrackList.delete(track_id);
      return { ...state, trackList: newTrackList };
    }),

  // Cache a preview URL for a track
  cachePreviewUrl: (trackId: string, previewUrl: string) => {
    const state = get();
    const newCache = new Map(state.previewUrlCache);

    // Optional: Limit cache size to prevent memory issues
    const MAX_CACHE_SIZE = 100;
    if (newCache.size >= MAX_CACHE_SIZE) {
      // Remove oldest entries (first in Map)
      const firstKey = newCache.keys().next().value;
      if (firstKey) newCache.delete(firstKey);
    }

    newCache.set(trackId, previewUrl);
    set({ previewUrlCache: newCache });
  },

  // Get cached preview URL for a track
  getCachedPreviewUrl: (trackId: string) => {
    const state = get();
    return state.previewUrlCache.get(trackId);
  },

  // Clear cache (useful for logout)
  clearPreviewUrlCache: () => set({ previewUrlCache: new Map() }),

  logout: () =>
    set({
      accessToken: null,
      user: null,
      shortTerm: null,
      mediumTerm: null,
      longTerm: null,
      previewUrlCache: new Map(), // Clear cache on logout
    }),

  // Computed values
  getCurrentDataSet: () => {
    const state = get();
    switch (state.currentDataSet) {
      case "shortTerm":
        return state.shortTerm;
      case "mediumTerm":
        return state.mediumTerm;
      case "longTerm":
        return state.longTerm;
      default:
        return state.mediumTerm;
    }
  },

  getCurrentTrackList: () => {
    const state = get();
    return state.trackList;
  },

  getAllGenres: () => {
    const state = get();
    const allGenres: string[] = [];
    const datasets = [state.shortTerm, state.mediumTerm, state.longTerm];
    datasets.forEach((dataset) => {
      if (dataset && dataset.topArtists) {
        dataset.topArtists.forEach((artist) => {
          allGenres.push(...artist.genres);
        });
      }
    });

    // Calculate genre totals
    const genreTotals: Record<string, number> = {};
    allGenres.forEach((genre) => {
      if (!genreTotals.hasOwnProperty(genre)) {
        genreTotals[genre] = 1;
      } else {
        genreTotals[genre] += 1;
      }
    });

    // Convert to array and sort by frequency
    const genreTotalsArray = Object.entries(genreTotals).map(
      ([key, value]) => ({
        name: key,
        value: value,
      })
    );

    // Sort by frequency (highest first) and take top genres
    const sortedGenres = genreTotalsArray.sort((a, b) => b.value - a.value);

    // Group similar genres together
    const groupedGenres: Array<{ name: string; value: number }> = [];
    const processedGenres = new Set<string>();

    for (let i = 0; i < sortedGenres.length; i++) {
      if (processedGenres.has(sortedGenres[i].name)) continue;

      const currentGenre = sortedGenres[i];
      let totalCount = currentGenre.value;
      let representativeName = currentGenre.name;

      // Look for similar genres to group together
      for (let j = i + 1; j < sortedGenres.length; j++) {
        if (processedGenres.has(sortedGenres[j].name)) continue;

        const similarityValue = StringSimilarity.compareTwoStrings(
          currentGenre.name,
          sortedGenres[j].name
        );

        // If genres are similar (similarity > 0.3), group them together
        if (similarityValue > 0.3) {
          totalCount += sortedGenres[j].value;
          // Use the shorter name as representative
          if (sortedGenres[j].name.length < representativeName.length) {
            representativeName = sortedGenres[j].name;
          }
          processedGenres.add(sortedGenres[j].name);
        }
      }

      groupedGenres.push({
        name: representativeName,
        value: totalCount,
      });
      processedGenres.add(currentGenre.name);
    }
    return groupedGenres;
  },
}));
