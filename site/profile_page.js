const API_KEY = "api_key=f61be177e52665e7c5e6973bb615e517";
const BASE_URL = 'https://api.themoviedb.org/3/';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const API_URL = BASE_URL + 'movie/popular?' + API_KEY;

document.addEventListener("DOMContentLoaded", async function () {
    const movieListContainer = document.getElementById("movie-list");

    // Sample array of movie IDs from TMDb
    const movieIds = [123, 345, 789]; // Replace with your actual movie IDs

    // Display movies in the movie list container
    await showMovies(movieIds);

    async function showMovies(movieIds) {
        for (const movieId of movieIds) {
            const movie = await fetchMovieDetails(movieId);
            createMovieItem(movie);
        }
    }

    async function fetchMovieDetails(movieId) {
        const response = await fetch(`${BASE_URL}movie/${movieId}?${API_KEY}`);
        const movie = await response.json();
        return movie;
    }

    function createMovieItem(movie) {
        const { title, poster_path, id, overview } = movie;

        const movieDiv = document.createElement('div');
        movieDiv.classList.add('movie-item');

        const img = document.createElement('img');
        img.src = IMG_URL + poster_path;
        img.alt = title;

        const titleElement = document.createElement('h3');
        titleElement.innerText = title;

        const overviewElement = document.createElement('p');
        overviewElement.innerText = overview;

        movieDiv.appendChild(img);
        movieDiv.appendChild(titleElement);
        movieDiv.appendChild(overviewElement);

        movieListContainer.appendChild(movieDiv);
    }
});