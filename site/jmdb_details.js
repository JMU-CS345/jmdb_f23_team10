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
        fetchActorDetails(movie);
      })
      .catch((error) => {
        console.error("Error fetching movie details:", error);
      });
  }

  function fetchActorDetails(movie) {
    // Retrieve the list of actors for the movie
    const movieCreditsURL = `${BASE_URL}movie/${movie.id}/credits?${API_KEY}`;

    fetch(movieCreditsURL)
      .then((response) => response.json())
      .then((credits) => {
        displayMovieDetails(movie, credits);
      })
      .catch((error) => {
        console.error("Error fetching actor details:", error);
      });
  }

  function displayMovieDetails(movie, credits) {
    const { title, poster_path, vote_average, overview } = movie;
    const actors = credits.cast;

    const titleElement = document.createElement("h1");
    titleElement.textContent = title;
    titleElement.classList.add("movie-title");

    const img = document.createElement("img");
    img.width = 350;
    img.src = IMG_URL + poster_path;
    img.alt = title;
    img.classList.add("movie-poster");

    const ratingElement = document.createElement("strong");
    ratingElement.innerText = `Rating: ${vote_average}`;
    ratingElement.classList.add("movie-rating");

    const overviewElement = document.createElement("p");
    overviewElement.textContent = overview;
    overviewElement.classList.add("movie-overview");
    overviewElement.style.width = "350px";
    overviewElement.style.whiteSpace = "pre-wrap";

    // Create a section to display actor information
    const actorSection = document.createElement("div");
    actorSection.classList.add("actor-section");

    actors.forEach((actor) => {
      const actorDiv = document.createElement("div");
      actorDiv.classList.add("actor");

      const actorName = document.createElement("h3");
      actorName.innerText = actor.name;
      actorName.classList.add("actor-name");

      const actorPhoto = document.createElement("img");
      actorPhoto.width = 250;
      actorPhoto.src = IMG_URL + actor.profile_path;
      actorPhoto.alt = actor.name;
      actorPhoto.classList.add("actor-photo");

      actorDiv.appendChild(actorName);
      actorDiv.appendChild(actorPhoto);

      actorSection.appendChild(actorDiv);
    });

    // Display movie details and actor information in the page
    document.body.appendChild(img);
    document.body.appendChild(titleElement);
    document.body.appendChild(ratingElement);
    document.body.appendChild(overviewElement);
    document.body.appendChild(actorSection);
  }
});

