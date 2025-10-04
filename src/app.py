from fastapi import FastAPI
from pydantic import BaseModel
from main import generate_playlist

app = FastAPI()

class PlaylistRequest(BaseModel):
    user_input: str

@app.post("/generate_playlist")
def create_playlist(request: PlaylistRequest):
    description, tracks = generate_playlist(request.user_input)
    return {"description": description, "tracks": tracks}

@app.get("/")
def read_root():
    return {"message": "LLM Spotify Playlist Generator"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)