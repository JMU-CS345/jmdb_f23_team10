const movieContainer = document.getElementById('movie-container2');


document.addEventListener("DOMContentLoaded", function () {
  const movieDetailButton = document.getElementById("movie-detail");
  const urlParams = new URLSearchParams(window.location.search);
  const movieId = urlParams.get("movie_id");

  if (movieId) {
    // Fetch and display movie details when the button is clicked
    fetchMovieDetails(movieId);
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
    movieDiv.classList.add('movie2');

    const titleElement = document.createElement("h1");
    titleElement.textContent = title;
    titleElement.classList.add("movie-title"); // Add a class for styling


    const img = document.createElement("img");
    img.width = 350;
    img.src = IMG_URL + poster_path;
    img.alt = title;
    img.classList.add("movie-poster");

    const ratingElement = document.createElement("strong");
    ratingElement.innerText = `Rating: ${vote_average}`;
    ratingElement.classList.add("movie-rating"); // Add a class for styling


    const overviewElement = document.createElement("p");
    overviewElement.textContent = overview;
    overviewElement.classList.add("movie-overview"); // Add a class for styling


    // Apply CSS to wrap text at a specified width
    overviewElement.style.width = "350px";
    overviewElement.style.whiteSpace = "pre-wrap";

    // Display movie details in the page
    document.body.appendChild(img);
    document.body.appendChild(titleElement);
    document.body.appendChild(ratingElement);
    document.body.appendChild(overviewElement);
  }
});
