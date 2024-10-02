const apiKey = 'API-KEY';
const baseUrl = 'https://api.themoviedb.org/3';
const currentPage = { popular: 1, top_rated: 1, now_playing: 1, upcoming: 1, search: 1, recommended: 1, new_releases: 1 };

document.addEventListener('DOMContentLoaded', () => {
    fetchMovies('popular', '#popular-movies .carousel-container', '#popular-pagination');
    fetchMovies('top_rated', '#top-rated-movies .carousel-container', '#top-rated-pagination');
    fetchMovies('now_playing', '#now-playing-movies .carousel-container', '#now-playing-pagination');
    fetchMovies('upcoming', '#upcoming-movies .carousel-container', '#upcoming-pagination');
    fetchMovies('recommendations', '#recommended-movies .carousel-container', '#recommended-pagination');
    fetchMovies('now_playing', '#new-releases .carousel-container', '#new-releases-pagination');

    const searchButton = document.getElementById('search-button');
    const searchInput = document.getElementById('search-input');
    searchButton.addEventListener('click', () => searchMovies(searchInput.value));
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchMovies(searchInput.value);
        }
    });

    autoScrollCarousel('#popular-movies .carousel-container');
    autoScrollCarousel('#top-rated-movies .carousel-container');
    autoScrollCarousel('#now-playing-movies .carousel-container');
    autoScrollCarousel('#upcoming-movies .carousel-container');
    autoScrollCarousel('#recommended-movies .carousel-container');
    autoScrollCarousel('#new-releases .carousel-container');
});

function fetchMovies(genre, containerSelector, paginationSelector) {
    const url = `${baseUrl}/movie/${genre}?api_key=${apiKey}&page=${currentPage[genre]}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayMovies(data.results, containerSelector);
            setupPagination(data.page, data.total_pages, genre, paginationSelector);
        })
        .catch(error => console.error('Error fetching movies:', error));
}

function searchMovies(query) {
    const url = `${baseUrl}/search/movie?api_key=${apiKey}&query=${query}&page=${currentPage.search}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayMovies(data.results, '#search-results .movies-container');
            setupPagination(data.page, data.total_pages, 'search', '#search-pagination');
            document.getElementById('search-results').style.display = 'block';
        })
        .catch(error => console.error('Error searching movies:', error));
}

function displayMovies(movies, containerSelector) {
    const container = document.querySelector(containerSelector);
    container.innerHTML = '';

    movies.forEach(movie => {
        const card = document.createElement('div');
        card.classList.add('movie-card');
        card.addEventListener('click', () => showMovieDetails(movie.id));

        const posterPath = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'default-poster.jpg';
        const releaseDate = movie.release_date ? movie.release_date.split('-')[0] : 'N/A';
        const rating = movie.vote_average || 'N/A';
        const overview = movie.overview || 'No overview available.';

        card.innerHTML = `
            <img src="${posterPath}" alt="${movie.title}">
            <div class="movie-info">
                <h3 class="movie-title">${movie.title}</h3>
                <p class="movie-release-date">${releaseDate}</p>
                <p class="movie-rating"><span class="star">★</span> ${rating}</p>
            </div>
            <div class="hover-info">
                <h3>${movie.title}</h3>
                <p>${overview}</p>
            </div>
        `;

        container.appendChild(card);
    });
}

function setupPagination(currentPage, totalPages, genre, paginationSelector) {
    const paginationContainer = document.querySelector(paginationSelector);
    paginationContainer.innerHTML = '';

    const prevButton = document.createElement('button');
    prevButton.innerText = 'Prev';
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            fetchMovies(genre, paginationSelector.replace('-pagination', ' .carousel-container'), paginationSelector);
        }
    });

    const nextButton = document.createElement('button');
    nextButton.innerText = 'Next';
    nextButton.disabled = currentPage === totalPages;
    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            fetchMovies(genre, paginationSelector.replace('-pagination', ' .carousel-container'), paginationSelector);
        }
    });

    paginationContainer.appendChild(prevButton);
    paginationContainer.appendChild(document.createTextNode(` Page ${currentPage} of ${totalPages} `));
    paginationContainer.appendChild(nextButton);
}

function showMovieDetails(movieId) {
    const url = `${baseUrl}/movie/${movieId}?api_key=${apiKey}`;
    fetch(url)
        .then(response => response.json())
        .then(movie => {
            document.getElementById('movie-poster').src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
            document.getElementById('movie-title').innerText = movie.title;
            document.getElementById('movie-overview').innerText = movie.overview;
            document.getElementById('movie-release-date').innerText = `Release Date: ${movie.release_date}`;
            document.getElementById('movie-rating').innerHTML = `Rating: <span class="star">★</span> ${movie.vote_average}`;
            document.getElementById('movie-details').style.display = 'flex';
        })
        .catch(error => console.error('Error fetching movie details:', error));
}

function autoScrollCarousel(selector) {
    const container = document.querySelector(selector);
    let scrollAmount = 0;
    const scrollInterval = setInterval(() => {
        if (container.scrollWidth - container.clientWidth <= scrollAmount) {
            container.scrollTo({ left: 0, behavior: 'smooth' });
            scrollAmount = 0;
        } else {
            scrollAmount += container.clientWidth;
            container.scrollBy({ left: container.clientWidth, behavior: 'smooth' });
        }
    }, 2000); // Slowed down the interval (in milliseconds)
}
function showMovieDetails(movieId) {
    window.location.href = `movie-details.html?id=${movieId}`;
}
