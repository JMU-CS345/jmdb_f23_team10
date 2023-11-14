const API_KEY = "api_key=f61be177e52665e7c5e6973bb615e517";
const BASE_URL = 'https://api.themoviedb.org/3/';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const API_URL = BASE_URL + 'movie/popular?' + API_KEY;

document.addEventListener("DOMContentLoaded", function () {
    const movieListContainer = document.getElementById("movie-list");

    // Sample array of movie IDs from TMDb
    const movieIds = [123, 456, 789]; // Replace with your actual movie IDs

    // Display movies in the movie list container
    showMovies(movieIds);

    async function showMovies(movieIds) {
        for (const movieId of movieIds) {
            try {
                const movie = await fetchMovieDetails(movieId);
                createMovieItem(movie);
            } catch (error) {
                console.error(`Error fetching details for movie ID ${movieId}:`, error);
            }
        }
    }

    async function fetchMovieDetails(movieId) {
        const response = await fetch(`${BASE_URL}movie/${movieId}?${API_KEY}`);
        const movie = await response.json();
        return movie;
    }

    function createMovieItem(movie) {
        const movieItem = document.createElement("div");
        movieItem.classList.add("movie-item");

        const titleElement = document.createElement("h3");
        titleElement.textContent = movie.title;

        const overviewElement = document.createElement("p");
        overviewElement.textContent = movie.overview;

        movieItem.appendChild(titleElement);
        movieItem.appendChild(overviewElement);

        movieListContainer.appendChild(movieItem);
    }
});
