from openai import OpenAI
import os
from dotenv import load_dotenv
load_dotenv()


client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
class LLMClient:
	def __init__(self):
		self.api_key = os.getenv('OPENAI_API_KEY')

	def generate_playlist_description(self, user_input, user_tracks=None):
		prompt = f"Generate a playlist description based on: {user_input}"
		if user_tracks:
			prompt += f"\nUser's top tracks: {', '.join([t['name'] for t in user_tracks])}"

		response = client.chat.completions.create(model="gpt-3.5-turbo",
		messages=[{"role": "user", "content": prompt}],
		max_tokens=100)
		return response.choices[0].message.content.strip()

	def suggest_tracks(self, description, available_tracks):
		prompt = f"Based on this description: {description}\nSuggest tracks from: {', '.join([t['name'] for t in available_tracks])}"
		response = client.chat.completions.create(model="gpt-3.5-turbo",
		messages=[{"role": "user", "content": prompt}],
		max_tokens=50)
		return response.choices[0].message.content.strip()

# Example usage
if __name__ == "__main__":
	client = LLMClient()
	desc = client.generate_playlist_description("chill vibes")
	print(desc)