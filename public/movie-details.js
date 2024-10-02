const apiKey = 'Api-key';
const baseUrl = 'https://api.themoviedb.org/3';
const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get('id');

document.addEventListener('DOMContentLoaded', () => {
    if (movieId) {
        fetchMovieDetails(movieId);
        fetchMovieTrailer(movieId);
        fetchMoviePhotos(movieId);
        fetchSimilarMovies(movieId);
    }

    const playButton = document.getElementById('play-button');
    playButton.addEventListener('click', playMovie);
});

function fetchMovieDetails(movieId) {
    const url = `${baseUrl}/movie/${movieId}?api_key=${apiKey}`;
    fetch(url)
        .then(response => response.json())
        .then(movie => {
            document.getElementById('movie-poster').src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
            document.getElementById('movie-title').innerText = movie.title;
            document.getElementById('movie-overview').innerText = movie.overview;
            document.getElementById('movie-release-date').innerText = movie.release_date;
            document.getElementById('movie-rating').innerHTML = `<span class="star">★</span> ${movie.vote_average}`;
        })
        .catch(error => console.error('Error fetching movie details:', error));
}

function fetchMovieTrailer(movieId) {
    const url = `${baseUrl}/movie/${movieId}/videos?api_key=${apiKey}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const trailer = data.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');
            if (trailer) {
                document.getElementById('movie-trailer').src = `https://www.youtube.com/embed/${trailer.key}`;
            }
        })
        .catch(error => console.error('Error fetching movie trailer:', error));
}

function fetchMoviePhotos(movieId) {
    const url = `${baseUrl}/movie/${movieId}/images?api_key=${apiKey}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const photosContainer = document.getElementById('movie-photos');
            data.backdrops.forEach(photo => {
                const img = document.createElement('img');
                img.src = `https://image.tmdb.org/t/p/w500${photo.file_path}`;
                img.alt = 'Movie Photo';
                photosContainer.appendChild(img);
            });
        })
        .catch(error => console.error('Error fetching movie photos:', error));
}

function fetchSimilarMovies(movieId) {
    const url = `${baseUrl}/movie/${movieId}/similar?api_key=${apiKey}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const similarMoviesContainer = document.getElementById('similar-movies');
            data.results.forEach(movie => {
                const card = document.createElement('div');
                card.classList.add('movie-card');
                card.addEventListener('click', () => window.location.href = `movie-details.html?id=${movie.id}`);

                const posterPath = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'default-poster.jpg';
                const releaseDate = movie.release_date ? movie.release_date.split('-')[0] : 'N/A';
                const rating = movie.vote_average || 'N/A';

                card.innerHTML = `
                    <img src="${posterPath}" alt="${movie.title}">
                    <div class="movie-info">
                        <h3 class="movie-title">${movie.title}</h3>
                        <p class="movie-release-date">${releaseDate}</p>
                        <p class="movie-rating"><span class="star">★</span> ${rating}</p>
                    </div>
                `;

                similarMoviesContainer.appendChild(card);
            });
        })
        .catch(error => console.error('Error fetching similar movies:', error));
}

function playMovie() {
    const movieSection = document.getElementById('movie-section');
    movieSection.style.display = 'block';
    
    // This is a placeholder. In a real implementation, you would have a way to stream the full movie.
    const movieUrl = 'https://www.example.com/full-movie'; // Replace with actual URL or logic to fetch the full movie URL
    document.getElementById('movie-frame').src = movieUrl;
}
