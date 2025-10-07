from spotify_client import SpotifyClient
from llm_client import LLMClient

def generate_playlist(user_input, user_track_list=None, model='gpt-5-nano'):
    spotify = SpotifyClient()
    llm = LLMClient(model)
    
    # Generate description
    description = llm.generate_playlist_description(user_input, user_track_list)
    print(f"Playlist Description: {description}")
    
    # Search for tracks
    """ tracks = spotify.search_tracks(user_input)
    print(f"Found tracks: {[t['name'] for t in tracks]}") """
    
    # Suggest tracks using LLM
    # suggestions = llm.suggest_tracks(description.output[0].content[0].text, user_track_list)
    suggestions = llm.suggest_tracks(description, user_track_list)
    print(f"Suggestions: {suggestions}")
    
    return description, suggestions

if __name__ == "__main__":
    user_input = input("Enter playlist theme: ")
    generate_playlist(user_input)   