from openai import OpenAI
import os
import textwrap
from dotenv import load_dotenv
load_dotenv()

class LLMClient:
	def __init__(self, model):
		self.client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
		self.model = model

	def textWrapper(self, text):
		output = ''
		textArr = text.rstrip().split('\n')
		for line in textArr[:-1]:
			output += line.strip().rstrip() + '\n'
		output += textArr[-1].strip().rstrip()
		return output

	def generate_playlist_description(self, user_input, user_track_list=None):
		promptDesc = f"""Generate a playlist description based on: {user_input}
				The description will be used as a prompt to generate a playlist for Spotify.
				Make it a simple paragraph, no more than 100 words.
				Output the description only, no other text.
				"""
		if user_track_list:
			promptTracks = f'\nUse these tracks as inspiration:\n'
			for trackObj in user_track_list.values():
				promptTracks += f'Track: {trackObj['name']} - Artist: {trackObj['artist']}\n'

			prompt = self.textWrapper(promptDesc) + self.textWrapper(promptTracks)	
		else:
			prompt = self.textWrapper(promptDesc)
		
		response = self.client.responses.create(model=self.model,
		input=prompt,
		max_output_tokens=1000000)
		return response

	def suggest_tracks(self, description, user_track_list=None):
		promptDesc = f"""Based on this description: {description}
				Generate a playlist for Spotify of 10 songs.
				Structure the response as a JSON array of objects with 'name' and 'artist' fields.
				Output the JSON array only, no other text.
			"""
		if user_track_list:
			promptTracks = f'Use these tracks as inspiration and include them in the final playlist:\n'
			for trackObj in user_track_list.values():
				promptTracks += f'Track: {trackObj['name']} - Artist: {trackObj['artist']}\n'

			prompt = self.textWrapper(promptDesc) + self.textWrapper(promptTracks)	
		else:
			prompt = self.textWrapper(promptDesc)

		print(self.model)

		prompt = self.textWrapper(promptDesc) + self.textWrapper(promptTracks)
		response = self.client.responses.create(model=self.model,
		input=prompt,
		max_output_tokens=1000000)
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