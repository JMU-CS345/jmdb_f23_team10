document.addEventListener("DOMContentLoaded", async function () {
    const movieListContainer = document.getElementById("movie-list");

    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        try {
            const userData = await fetchUserData(currentUser);
            const movieIds = userData.key3 || [];

            if (movieIds.length === 0) {
                // Display a styled message when there are no movies in favorites
                const noMoviesMessage = document.createElement('p');
                noMoviesMessage.innerText = 'No movies in favorites.';
                noMoviesMessage.classList.add('no-movies-message'); // Add a class for styling
                movieListContainer.replaceWith(noMoviesMessage);
            } else {
                // Display favorite movies in the movie list container
                await showFavoriteMovies(movieIds);
            }
        } catch (error) {
            alert('Error fetching user data. Please sign in.');
            console.error(error.message);
        }
    }

    async function fetchUserData(username) {
        const response = await fetch(main.url_for(username));
        if (!response.ok) {
            throw new Error('User not found');
        }
        return response.json();
    }

    async function showFavoriteMovies(movieIds) {
        for (const movieId of movieIds) {
            const movie = await fetchMovieDetails(movieId);
            createMovieItem(movie);
        }
    }

    async function fetchMovieDetails(movieId) {
        const response = await fetch(`${BASE_URL}movie/${movieId}?${API_KEY}`);
        if (!response.ok) {
            throw new Error(`Error fetching movie details for ID ${movieId}`);
        }
        return response.json();
    }

    function createMovieItem(movie) {
        const { title, poster_path, id } = movie;

        const movieDiv = document.createElement('div');
        movieDiv.classList.add('movie-item');

        const img = document.createElement('img');
        img.src = IMG_URL + poster_path;
        img.alt = title;

        // Create a link for each movie to navigate to the movie detail page
        const movieLink = document.createElement('a');
        movieLink.href = `movie_detail.html?movie_id=${id}`;
        movieLink.appendChild(img);

        const titleElement = document.createElement('h3');
        titleElement.innerText = title;

        movieDiv.appendChild(movieLink);
        movieDiv.appendChild(titleElement);

        movieListContainer.appendChild(movieDiv);
    }
});
