const API_KEY = "api_key=f61be177e52665e7c5e6973bb615e517";
const BASE_URL = 'https://api.themoviedb.org/3/';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';


const movieContainer2 = document.getElementById('movie-container2');
const castContainer = document.getElementById("cast-container");

document.addEventListener("DOMContentLoaded", function () {
  const movieDetailButton = document.getElementById("movie-detail");
  const urlParams = new URLSearchParams(window.location.search);
  const movieId = urlParams.get("movie_id");

  if (movieId) {
    // Fetch and display movie details when the button is clicked
    fetchMovieDetails(movieId);
    fetchCastDetails(movieId); // Fetch cast details
    displayFavoriteButton(movieId);
  }

  function fetchMovieDetails(movieId) {
    // Make an API request to get movie details using the movieId
    fetch(`${BASE_URL}movie/${movieId}?${API_KEY}`)
      .then((response) => response.json())
      .then((movie) => {
        displayMovieDetails(movie);
      })
      .catch((error) => {
        console.error("Error fetching movie details:", error);
      });
  }

  function displayMovieDetails(movie) {
    const { title, poster_path, vote_average, overview } = movie;

    const movieDiv = document.createElement('div');
    movieDiv.classList.add('movie');

    const img = document.createElement('img');
    img.src = IMG_URL + poster_path;
    img.alt = title;

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
    movieDiv.appendChild(movieInfo);
    movieInfo.appendChild(img);
    movieDiv.appendChild(overviewPara);
    movieContainer2.appendChild(movieDiv);
  }

  function fetchCastDetails(movieId) {
    // Make an API request to get cast details for the movie
    fetch(`${BASE_URL}movie/${movieId}/credits?${API_KEY}`)
      .then((response) => response.json())
      .then((cast) => {
        displayCastDetails(cast.cast); // Assuming cast is an array of actors
      })
      .catch((error) => {
        console.error("Error fetching cast details:", error);
      });
  }

  function displayCastDetails(cast) {

    cast.forEach((actor) => {
      const { name, profile_path } = actor;

      const actorDiv = document.createElement("div");
      actorDiv.classList.add('actor');

      const actorImg = document.createElement('img');
      actorImg.src = IMG_URL + profile_path;
      actorImg.alt = name;

      const actorName = document.createElement('p');
      actorName.innerText = name;

      actorDiv.appendChild(actorImg);
      actorDiv.appendChild(actorName);

      castContainer.appendChild(actorDiv);
    });
  }

  function displayFavoriteButton(movieId) {
    const favoriteButtonContainer = document.getElementById("favorite-button-container");

    // Check if the user is logged in
    const isLoggedIn = true; // Replace with authentication check

    if (isLoggedIn) {
      const favorites = getFavorites();
      const isMovieInFavorites = favorites.includes(movieId);

      const favoriteButton = document.createElement("button");
      favoriteButton.innerText = isMovieInFavorites ? "Remove movie from Favorites" : "Add movie to Favorites";
      favoriteButton.addEventListener("click", function () {
        toggleFavoriteStatus(movieId);
        displayFavoriteButton(movieId); // Update button text after toggle
      });

      favoriteButtonContainer.innerHTML = ''; // Clear existing content
      favoriteButtonContainer.appendChild(favoriteButton);
    }
  }

  function toggleFavoriteStatus(movieId) {
    const favorites = getFavorites();
    const isMovieInFavorites = favorites.includes(movieId);

    if (isMovieInFavorites) {
      // Remove the movie from favorites
      const updatedFavorites = favorites.filter((id) => id !== movieId);
      setFavorites(updatedFavorites);
      alert("Movie removed from favorites!");
    } else {
      // Add the movie to favorites
      favorites.push(movieId);
      setFavorites(favorites);
      alert("Movie added to favorites!");
    }
  }

  function getFavorites() {
    return JSON.parse(localStorage.getItem("favorites")) || [];
  }


  function setFavorites(favorites) {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }
});

function updateColor(elt, vote_average) {
  if (vote_average > 7) {
    elt.style['color'] = 'green';
  }
  if (vote_average < 7 && vote_average > 4.5) {
    elt.style['color'] = 'orange';
  } else {
    elt.style['color'] = 'green';
  }
}
