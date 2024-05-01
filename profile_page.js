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
                await showFavoriteMovies(movieIds);
            }
        } catch (error) {
            console.error('Error fetching user data. Please sign in.', error);
            alert('Error fetching user data. Please sign in.');
        }
    }

    async function fetchUserData(username) {
        const response = await fetch(main.url_for(username));

        if (!response.ok) {
            throw new Error(`User not found. Status: ${response.status}`);
        }
        const userData = await response.json();

        // Reverse the order of movies
        userData.key3 = userData.key3.reverse();

        return userData;
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
            throw new Error(`Error fetching movie details for ID ${movieId}. Status: ${response.status}`);
        }

        return response.json();
    }

    function createMovieItem(movie) {
        const { title, poster_path, vote_average, overview, id } = movie;

        const movieDiv = document.createElement('div');
        movieDiv.classList.add('movie-item');

        const img = document.createElement('img');
        img.src = IMG_URL + poster_path;
        img.alt = title;

        // Create a link for each movie to navigate to the movie detail page
        const movieLink = document.createElement('a');
        movieLink.href = `movie_detail.html?movie_id=${id}`;
        movieLink.appendChild(img);

        const movieInfo = document.createElement('div');
        movieInfo.classList.add('movie-info');

        const titleHeading = document.createElement('h3');
        titleHeading.innerText = title;

        const ratingPara = document.createElement('p');
        updateColor(ratingPara, vote_average);
        ratingPara.innerText = `Rating: ${vote_average}`;

        const overviewPara = document.createElement('p');
        overviewPara.innerText = overview;

        movieInfo.appendChild(titleHeading);
        movieInfo.appendChild(ratingPara);
        movieDiv.appendChild(movieLink);
        movieDiv.appendChild(movieInfo);

        if (movieListContainer !== undefined) {
            movieListContainer.appendChild(movieDiv);
        }
    }
});