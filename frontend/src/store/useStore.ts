import { create } from 'zustand'

interface storeState {
  // User state
  user: object | null
  accessToken: string | null
  
  // Music data state
  shortTerm: object | null
  mediumTerm: object | null
  longTerm: object | null
  
  // UI state
  currentDataSet: 'shortTerm' | 'mediumTerm' | 'longTerm'
  playStatus: 'STOPPED' | 'PLAYING' | 'PAUSED'
  previewURL: string | null
  
  // Preview URL cache - maps trackId to preview URL
  previewUrlCache: Map<string, string>

  // Current track ID in embed player
  embedTrackID: string | null
  
  // Actions
  setAccessToken: (token: string) => void
  setUser: (userData: object) => void
  setMusicData: (timeRange: string, data: object) => void
  setCurrentDataSet: (dataSet: 'shortTerm' | 'mediumTerm' | 'longTerm') => void
  logout: () => void
  setPlayStatus: (status: 'STOPPED' | 'PLAYING' | 'PAUSED') => void
  setPreviewURL: (url: string) => void
  setEmbedTrackID: (newTrackID: string) => void
  
  // Cache a preview URL for a track
  cachePreviewUrl: (trackId: string, previewUrl: string) => void
  // Get cached preview URL for a track
  getCachedPreviewUrl: (trackId: string) => string | undefined
  // Clear cache (useful for logout)
  clearPreviewUrlCache: () => void
  
  // Computed values
  getCurrentDataSet: () => object | null
}

type PlayStatus = storeState['playStatus']

export const useStore = create<storeState>()((set, get) => ({
  // User state
  user: null,
  accessToken: null,
  
  // Music data state
  shortTerm: null,
  mediumTerm: null,
  longTerm: null,
  
  // UI state
  currentDataSet: 'mediumTerm',
  playStatus: 'STOPPED', // STOPPED, PLAYING, PAUSED
  previewURL: null,
  
  // Preview URL cache - maps trackId to preview URL
  previewUrlCache: new Map(),

  // Current Track ID in embed player
  embedTrackID: null,
  
  // Actions
  setAccessToken: (token) => set({ accessToken: token }),
  setEmbedTrackID: (newTrackID) => set({ embedTrackID: newTrackID }),
  
  setUser: (userData) => set({ user: userData }),
  
  setMusicData: (timeRange, data) => {
    switch (timeRange) {
      case 'short_term':
        set({ shortTerm: data })
        break
      case 'medium_term':
        set({ mediumTerm: data })
        break
      case 'long_term':
        set({ longTerm: data })
        break
      default:
        break
    }
  },
  
  setCurrentDataSet: (dataSet) => set({ currentDataSet: dataSet }),
  
  setPlayStatus: (status: PlayStatus) => set({ playStatus: status }),
  
  setPreviewURL: (url: string) => set({ previewURL: url }),
  
  // Cache a preview URL for a track
  cachePreviewUrl: (trackId: string, previewUrl: string) => {
    const state = get()
    const newCache = new Map(state.previewUrlCache)
    
    // Optional: Limit cache size to prevent memory issues
    const MAX_CACHE_SIZE = 100
    if (newCache.size >= MAX_CACHE_SIZE) {
      // Remove oldest entries (first in Map)
      const firstKey = newCache.keys().next().value
	  if (firstKey) newCache.delete(firstKey)
    }
    
    newCache.set(trackId, previewUrl)
    set({ previewUrlCache: newCache })
  },
  
  // Get cached preview URL for a track
  getCachedPreviewUrl: (trackId: string) => {
    const state = get()
    return state.previewUrlCache.get(trackId)
  },
  
  // Clear cache (useful for logout)
  clearPreviewUrlCache: () => set({ previewUrlCache: new Map() }),
  
  logout: () => set({ 
    accessToken: null, 
    user: null, 
    shortTerm: null, 
    mediumTerm: null, 
    longTerm: null,
    previewUrlCache: new Map() // Clear cache on logout
  }),
  
  // Computed values
  getCurrentDataSet: () => {
    const state = get()
    switch (state.currentDataSet) {
      case 'shortTerm':
        return state.shortTerm
      case 'mediumTerm':
        return state.mediumTerm
      case 'longTerm':
        return state.longTerm
      default:
        return state.mediumTerm
    }
  }
}))
