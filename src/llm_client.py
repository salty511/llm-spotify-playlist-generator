from openai import OpenAI
import os
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
		if user_track_list:
			promptTracks = ""
			for trackObj in user_track_list.values():
				promptTracks += f"Track: {trackObj['name']} - Artist: {trackObj['artist']}\n"

			promptTracks = self.textWrapper(promptTracks)	
		else: promptTracks = ""

		# Reusable prompt defined in OpenAI Dashboard
		response = self.client.responses.create(model=self.model,
			prompt={
				"id": "pmpt_68e654af374081949cb3f2f895b057390461405fb9fe7617",
				"version": "2",
				"variables": {
				"user_input": user_input,
				"tracks": promptTracks
				}
			},
			max_output_tokens=1000000
		)
		return response

	def suggest_tracks(self, description, user_track_list=None):
		
		if user_track_list:
			promptTracks = ""
			for trackObj in user_track_list.values():
				promptTracks += f"Track: {trackObj['name']} - Artist: {trackObj['artist']}\n"

			promptTracks = self.textWrapper(promptTracks)
		else:
			promptTracks = ""


		print(self.model)
		response = self.client.responses.create(model=self.model,
			prompt={
				"id": "pmpt_68e65207a4488190a23c631ce0a9d1500129f091d76c03ed",
				"version": "4",
				"variables": {
				"desc": description,
				"tracks": promptTracks
				}
			},
			max_output_tokens=1000000
		)
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