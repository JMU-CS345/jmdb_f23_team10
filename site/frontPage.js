const apiKey = 'f61be177e52665e7c5e6973bb615e517';

function setup() {
    noCanvas();
    const movieList = select('#movieList');
    const url = 'https://api.themoviedb.org/3/discover/movie?api_key=' + apiKey;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const movies = data.results;
            movies.forEach(movie => {
                const movieElement = createDiv('');
                const title = createP(movie.title);
                const overview = createP(movie.overview);
                const poster = createImg('https://image.tmdb.org/t/p/w185/' + movie.poster_path, "Poster for " + movie.title);

                // Add a click event handler to navigate to the movie page
                movieElement.mouseClicked(() => {
                    window.location.href = 'movie.html?movie_id=' + movie.id;
                });

                movieElement.child(title);
                movieElement.child(overview);
                movieElement.child(poster);
                movieList.child(movieElement);
            });
        })
        .catch(error => console.error(error));
}
