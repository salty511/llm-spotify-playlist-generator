from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from main import generate_playlist

app = FastAPI(title="LLM Spotify Playlist Generator", description="Generate Spotify playlists using LLMs")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="static"), name="static")

class PlaylistRequest(BaseModel):
    user_input: str

@app.post("/generate_playlist")
def create_playlist(request: PlaylistRequest):
    description, tracks = generate_playlist(request.user_input, )
    return {"description": description, "tracks": tracks}

@app.get("/", response_class=HTMLResponse)
def read_root():
    with open("static/index.html") as f:
        return f.read()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)