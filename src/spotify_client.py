import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
import os
from dotenv import load_dotenv

load_dotenv()

class SpotifyClient:
    def __init__(self):
        client_id = os.getenv('SPOTIFY_CLIENT_ID')
        client_secret = os.getenv('SPOTIFY_CLIENT_SECRET')
        client_credentials_manager = SpotifyClientCredentials(client_id=client_id, client_secret=client_secret)
        self.sp = spotipy.Spotify(client_credentials_manager=client_credentials_manager)

    def search_tracks(self, query, limit=10):
        results = self.sp.search(q=query, type='track', limit=limit)
        tracks = results['tracks']['items']
        return [{'name': track['name'], 'artist': track['artists'][0]['name'], 'uri': track['uri']} for track in tracks]

    def get_user_top_tracks(self, access_token, limit=10):
        sp_user = spotipy.Spotify(auth=access_token)
        results = sp_user.current_user_top_tracks(limit=limit)
        tracks = results['items']
        return [{'name': track['name'], 'artist': track['artists'][0]['name'], 'uri': track['uri']} for track in tracks]

# Example usage
if __name__ == "__main__":
    client = SpotifyClient()
    tracks = client.search_tracks("happy")
    print(tracks)