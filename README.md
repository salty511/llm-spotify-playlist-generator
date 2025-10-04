# LLM Spotify Playlist Generator

A project to generate Spotify playlists using Large Language Models (LLMs) based on user descriptions.

## Features
- Natural language playlist generation
- Spotify API integration
- LLM-powered track suggestions
- Web interface via FastAPI
- Docker containerization

## Setup
1. Clone the repository
2. Install dependencies: `pip install -r requirements.txt`
3. Set up environment variables in `.env`
4. Run the app: `python src/app.py` or use Docker: `docker-compose up`

## Usage
- CLI: `python src/main.py`
- Web: POST to `/generate_playlist` with JSON `{"user_input": "your theme"}`

## Project Structure
- `src/`: Source code
- `tests/`: Unit tests
- `docs/`: Documentation
- `config/`: Configuration files

## Contributing
See plan.md for detailed project plan.