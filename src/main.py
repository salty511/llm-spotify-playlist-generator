from spotify_client import SpotifyClient
from llm_client import LLMClient

def generate_playlist(user_input):
    spotify = SpotifyClient()
    llm = LLMClient()
    
    # Generate description
    description = llm.generate_playlist_description(user_input)
    print(f"Playlist Description: {description}")
    
    # Search for tracks
    tracks = spotify.search_tracks(user_input)
    print(f"Found tracks: {[t['name'] for t in tracks]}")
    
    # Suggest tracks using LLM
    suggestions = llm.suggest_tracks(description, tracks)
    print(f"Suggestions: {suggestions}")
    
    return description, tracks

if __name__ == "__main__":
    user_input = input("Enter playlist theme: ")
    generate_playlist(user_input)