from openai import OpenAI
import os
from dotenv import load_dotenv
load_dotenv()

class LLMClient:
	def __init__(self):
		self.client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

	def generate_playlist_description(self, user_input, user_tracks=None):
		prompt = f"""Generate a playlist description based on: {user_input}
				The description will be used as a prompt to generate a playlist for Spotify.
				Make it a simple paragraph, no more than 100 words.
				Output the description only, no other text.
				"""	
		if user_tracks:
			prompt += f"\nUser's top tracks: {', '.join([t['name'] for t in user_tracks])}"

		response = self.client.responses.create(model="gpt-5-nano",
		input=prompt,
		max_output_tokens=1000)
		return response

	def suggest_tracks(self, description, available_tracks=None):
		prompt = f"""Based on this description: {description}
			
			Generate a playlist for Spotify of 10 songs.
			Structure the response as a JSON array of objects with 'name' and 'artist' fields.
			Output the JSON array only, no other text
			"""
		if available_tracks: 
			prompt += f"Suggest tracks from: {', '.join([t['name'] for t in available_tracks])}"
		response = self.client.responses.create(model="gpt-5-nano",
		input=prompt,
		max_output_tokens=100000)
		return response

# Example usage
if __name__ == "__main__":
	client = LLMClient()
	desc = client.generate_playlist_description("chill vibes")
	print(desc)
	print(desc.output_text)
	suggestions = client.suggest_tracks(desc.output_text)
	print(suggestions)
	print(suggestions.output_text)