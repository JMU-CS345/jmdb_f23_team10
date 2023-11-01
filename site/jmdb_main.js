const API_KEY = "api_key=f61be177e52665e7c5e6973bb615e517";
const BASE_URL = 'https://api.themoviedb.org/3/';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const API_URL = BASE_URL + 'movie/popular?' + API_KEY;

const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const movieContainer = document.getElementById('movie-container');

getMovies(API_URL);

function getMovies(url) {
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      showMovies(data.results);
    });
}

searchButton.addEventListener('click', function () {
  const searchTerm = searchInput.value;

  movieContainer.innerHTML = '';

  if (searchTerm) {
    const searchURL = `${BASE_URL}search/movie?${API_KEY}&query=${searchTerm}`;

    fetch(searchURL)
      .then((response) => response.json())
      .then((data) => {
        showMovies(data.results);
      })
      .catch((error) => {
        console.error('An error occurred:', error);
      });
  }
});

function showMovies(data) {
  data.forEach((movie) => {
    const { title, poster_path, vote_average, overview, id } = movie;

    const movieDiv = document.createElement('div');
    movieDiv.classList.add('movie');

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
    ratingPara.innerText = `Rating: ${vote_average}`;

    const overviewPara = document.createElement('p');
    overviewPara.innerText = overview;

    movieInfo.appendChild(titleHeading);
    movieInfo.appendChild(ratingPara);
    movieInfo.appendChild(overviewPara);

    movieDiv.appendChild(movieLink);
    movieDiv.appendChild(movieInfo);

    movieContainer.appendChild(movieDiv);
  });
}
