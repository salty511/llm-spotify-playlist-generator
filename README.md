# LLM Spotify Playlist Generator

A project to generate Spotify playlists using Large Language Models (LLMs) based on user descriptions.

## Overview
The application allows users to input natural language descriptions of desired playlists (e.g., "upbeat workout music" or "chill vibes for studying"). It leverages OpenAI's GPT models to interpret the input and generate a playlist description, then queries the Spotify API to find matching tracks. The results are presented through a simple web interface.

### How It Works
1. **User Input**: Enter a playlist theme via the web interface at `http://localhost:8000`
2. **LLM Processing**: The input is sent to an LLM (OpenAI GPT-3.5) to generate a playlist description and theme interpretation
3. **Spotify Search**: The Spotify Web API is queried for tracks matching the theme
4. **Track Selection**: The LLM suggests relevant tracks from the search results
5. **Display Results**: Playlist description and suggested tracks are shown to the user

## Features
- Natural language playlist generation
- Spotify API integration for track search
- LLM-powered track suggestions and descriptions
- Web interface with real-time generation
- Docker containerization for easy deployment
- REST API for programmatic access

## Setup
1. Clone the repository
2. Install dependencies: `pip install -r requirements.txt`
3. Set up environment variables in `.env` (Spotify client ID/secret and OpenAI API key)
4. Run the app: `python src/app.py` or use Docker: `docker-compose up`

## Usage
- **Web Interface**: Visit `http://localhost:8000` for the interactive frontend
- **CLI**: Run `python src/main.py` for command-line usage
- **API**: POST to `/generate_playlist` with JSON `{"user_input": "your theme"}`

## Project Structure
- `src/`: Core application code (API, clients, main logic)
- `static/`: Frontend HTML, CSS, and JavaScript
- `tests/`: Unit tests
- `docs/`: Documentation
- `config/`: Configuration files

## Contributing
See plan.md for detailed project plan and future enhancements.