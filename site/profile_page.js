

document.addEventListener("DOMContentLoaded", async function () {
    const movieListContainer = document.getElementById("movie-list");

    // Sample array of movie IDs from TMDb
    const movieIds = [123, 236, 789]; // Replace with your actual movie IDs

    // Display movies in the movie list container
    await showFavoriteMovies(movieIds);

    async function showFavoriteMovies(movieIds) {
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
        const { title, poster_path, id} = movie;

        const movieDiv = document.createElement('div');
        movieDiv.classList.add('movie-item');

        const img = document.createElement('img');
        img.src = IMG_URL + poster_path;
        img.alt = title;

        const titleElement = document.createElement('h3');
        titleElement.innerText = title;

        movieDiv.appendChild(img);
        movieDiv.appendChild(titleElement);

        movieListContainer.appendChild(movieDiv);
    }
});