const movieContainer2 = document.getElementById('movie-container2');
const castContainer = document.getElementById("cast-container");

document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const movieId = urlParams.get("movie_id");
  fetch(main.url_for(movieId))
    .then(response => {
      if (response.status === 404) {
        throw new Error('Server not set');
      }
      return response.json();
    })
    .then(data => {
      console.log('d', data);
    })
    .catch(error => {
      const JSONArray = { commentArray: [] };
      main.set(movieId, JSON.stringify(JSONArray), function (res) {
      })
      console.error(error.message);
    });
  if (movieId) {
    // Fetch and display movie details when the button is clicked
    fetchMovieDetails(movieId);
    fetchCastDetails(movieId); // Fetch cast details
    displayFavoriteButton(movieId);
  }

  function fetchMovieDetails(movieId) {
    // Make an API request to get movie details using the movieId
    fetch(`${BASE_URL}movie/${movieId}?${API_KEY}&append_to_response=videos`)
      .then((response) => response.json())
      .then((movie) => {
        displayMovieDetails(movie);
      })
      .catch((error) => {
        console.error("Error fetching movie details:", error);
      });
  }

  function displayMovieDetails(movie) {
    const { title, poster_path, vote_average, overview, release_date, original_language } = movie;

    const movieDiv = document.createElement('div');
    movieDiv.classList.add('movie');

    const img = document.createElement('img');
    if (poster_path !== null) {
      img.src = IMG_URL + poster_path;
    } else {
      img.src = 'default-poster.png';
    }
    img.alt = title;

    const movieInfo = document.createElement('div');
    movieInfo.classList.add('movie-info');

    const titleHeading = document.createElement('h3');
    titleHeading.innerText = title;

    const movieDate = document.createElement('div');
    movieDate.classList.add('movie-date');

    const releaseDatePara = document.createElement('p');
    releaseDatePara.innerText = `Release Date: ${formatReleaseDate(release_date)}`;
    releaseDatePara.classList.add('release-date');

    const ratingPara = document.createElement('p');
    updateColor(ratingPara, vote_average);
    ratingPara.innerText = `Rating: ${Math.floor(vote_average)}`;

    const movieContent = document.createElement('div');
    movieContent.classList.add('movie-content');

    const overviewPara = document.createElement('p');
    overviewPara.innerText = `${overview} (Language: ${getLanguageName(original_language)})`;
    overviewPara.classList.add('movie-overview');

    movieContent.appendChild(img);
    movieContent.appendChild(overviewPara);

    movieInfo.appendChild(titleHeading);
    movieInfo.appendChild(ratingPara);

    movieDate.appendChild(releaseDatePara);

    movieDiv.appendChild(movieInfo);
    movieDiv.appendChild(movieDate);
    movieDiv.appendChild(movieContent);
    movieContainer2.appendChild(movieDiv);

    // Check if trailers are available
    if (movie.videos && movie.videos.results && movie.videos.results.length > 0) {
      const trailerSection = document.createElement('div');
      trailerSection.classList.add('trailer-section');

      const trailersHeading = document.createElement('h3');
      trailersHeading.innerText = 'Trailers';

      const trailersList = document.createElement('div');
      trailersList.classList.add('trailers-list');

      // Reverse the array of trailers
      const reversedTrailers = movie.videos.results.slice().reverse();

      reversedTrailers.forEach((trailer) => {
        const trailerItem = document.createElement('div');
        trailerItem.classList.add('trailer-item');

        const iframe = document.createElement('iframe');
        iframe.width = '560';
        iframe.height = '315';
        iframe.src = `https://www.youtube.com/embed/${trailer.key}`;
        iframe.frameborder = '0';
        iframe.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture';
        iframe.allowfullscreen = true;

        trailerItem.appendChild(iframe);
        trailersList.appendChild(trailerItem);
      });

      trailerSection.appendChild(trailersHeading);
      trailerSection.appendChild(trailersList);
      movieContainer2.appendChild(trailerSection);
    }
  }

  function formatReleaseDate(rawDate) {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    const formattedDate = new Date(rawDate).toLocaleDateString('en-US', options);
    return formattedDate;
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
      const { id, name, profile_path, character } = actor;

      const actorDiv = document.createElement("div");
      actorDiv.classList.add('actor');
      actorDiv.dataset.actorId = id;

      const actorImg = document.createElement('img');
      actorImg.classList.add('actor-image');
      if (profile_path !== null) {
        actorImg.src = IMG_URL + profile_path;
      } else {
        actorImg.src = 'default-profile.jpg';
      }
      actorImg.alt = name;

      const actorInfoDiv = document.createElement('div');
      actorInfoDiv.classList.add('actor-info');

      const actorName = document.createElement('h3');
      actorName.classList.add('actor-name');
      actorName.innerText = name;

      const characterName = document.createElement('p');
      characterName.classList.add('character-name');
      characterName.innerText = `as ${character}`;

      actorInfoDiv.appendChild(actorName);
      actorInfoDiv.appendChild(characterName);

      actorDiv.appendChild(actorImg);
      actorDiv.appendChild(actorInfoDiv);

      castContainer.appendChild(actorDiv);
    });
  }

  async function displayFavoriteButton(movieId) {
    const favoriteButtonContainer = document.getElementById("favorite-button-container");

    // Check if the user is logged in
    const isLoggedIn = localStorage.getItem('currentUser') != null;


    if (isLoggedIn) {
      try {
        const favorites = await getFavorites();
        const isMovieInFavorites = favorites.includes(movieId);

        const favoriteButton = document.createElement("button");
        favoriteButton.innerText = isMovieInFavorites ? "Remove movie from Favorites" : "Add movie to Favorites";
        favoriteButton.addEventListener("click", async function () {
          await toggleFavoriteStatus(movieId);
          displayFavoriteButton(movieId); // Update button text after toggle
        });


        favoriteButtonContainer.innerHTML = ''; // Clear existing content
        favoriteButtonContainer.appendChild(favoriteButton);
      } catch (error) {
        console.error('Error displaying favorite button:', error);
      }
    }
  }

  async function getFavorites() {
    const currentUser = localStorage.getItem('currentUser');

    if (currentUser) {
      try {
        const userData = await fetchUserData(currentUser);
        return userData.key3 || [];
      } catch (error) {
        console.error('Error fetching user data:', error);
        return [];
      }
    } else {
      console.error('User not signed in.');
      return [];
    }
  }

  async function fetchUserData(username) {
    const response = await fetch(main.url_for(username));
    if (!response.ok) {
      throw new Error('User not found');
    }
    return response.json();
  }

  async function toggleFavoriteStatus(movieId) {
    const favorites = await getFavorites();
    const isMovieInFavorites = favorites.includes(movieId);

    if (isMovieInFavorites) {
      // Remove the movie from favorites
      const updatedFavorites = favorites.filter((id) => id !== movieId);
      await setFavorites(updatedFavorites);
      alert("Movie removed from favorites!");
    } else {
      // Add the movie to favorites
      const updatedFavorites = [...favorites, movieId];
      await setFavorites(updatedFavorites);
      alert("Movie added to favorites!");
    }
  }

  async function setFavorites(updatedFavorites) {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const userKey = main.url_for(currentUser);

      try {
        const userData = await fetchUserData(currentUser);
        userData.key3 = updatedFavorites;

        await fetch(userKey, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });

      } catch (error) {
        alert('Error updating movie favorites');
        console.error(error);
      }
    } else {
      alert('User not signed in. Please sign in.');
    }
  }

  // Add event listener to actor containers within the cast container
  castContainer.addEventListener('click', function (event) {
    const actorContainer = event.target.closest('.actor');
    if (actorContainer) {
      // If the clicked element is an actor container, prevent the default behavior (navigation)
      event.preventDefault();

      // Get the actor_id from the actor container's dataset
      const actorId = actorContainer.dataset.actorId;

      // Navigate to the actor details page
      window.location.href = `actor_details.html?actor_id=${actorId}`;
    }
  });
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
