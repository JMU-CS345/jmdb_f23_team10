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
      const title = movie.title;
      const overview = movie.overview;
  
      const titleElement = document.createElement("h1");
      titleElement.textContent = title;
  
      const img = document.createElement("img");
      img.src = IMG_URL + movie.poster_path;
      img.alt = title;
  
      const overviewElement = document.createElement("p");
      overviewElement.textContent = overview;
  
      // Display movie details in the page
      document.body.appendChild(titleElement);
      document.body.appendChild(img);
      document.body.appendChild(overviewElement);
    }
  });
  