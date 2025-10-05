from openai import OpenAI
import os
from dotenv import load_dotenv
load_dotenv()

class LLMClient:
	def __init__(self):
		self.client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

	def generate_playlist_description(self, user_input, user_tracks=None):
		prompt = f"Generate a playlist description based on: {user_input}"
		if user_tracks:
			prompt += f"\nUser's top tracks: {', '.join([t['name'] for t in user_tracks])}"

		response = self.client.responses.create(model="gpt-4",
		input=prompt,
		max_output_tokens=500)
		return response

	def suggest_tracks(self, description, available_tracks=None):
		prompt = f"Based on this description: {description}\n generate a playlist "
		if available_tracks: 
			prompt += f"Suggest tracks from: {', '.join([t['name'] for t in available_tracks])}"
		response = self.client.responses.create(model="gpt-4",
		input=prompt,
		max_output_tokens=500)
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