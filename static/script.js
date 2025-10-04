async function generatePlaylist() {
    const userInput = document.getElementById('userInput').value.trim();
    if (!userInput) {
        alert('Please enter a playlist theme.');
        return;
    }

    const loading = document.getElementById('loading');
    const result = document.getElementById('result');
    loading.style.display = 'block';
    result.innerHTML = '';

    try {
        const response = await fetch('/generate_playlist', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_input: userInput }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        displayResult(data);
    } catch (error) {
        result.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
    } finally {
        loading.style.display = 'none';
    }
}

function displayResult(data) {
    const result = document.getElementById('result');
    let html = `<h2>Playlist Description</h2><p>${data.description}</p><h2>Suggested Tracks</h2><ul>`;
    data.tracks.forEach(track => {
        html += `<li class="track"><strong>${track.name}</strong> by ${track.artist}</li>`;
    });
    html += '</ul>';
    result.innerHTML = html;
}

// Allow Enter key to trigger generation
document.getElementById('userInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        generatePlaylist();
    }
});