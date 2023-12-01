

const movieContainer2 = document.getElementById('movie-container2');
const castContainer = document.getElementById("cast-container");

document.addEventListener("DOMContentLoaded", function () {
  const movieDetailButton = document.getElementById("movie-detail");
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

    const movieContent = document.createElement('div');
    movieContent.classList.add('movie-content');
    const overviewPara = document.createElement('p');

    movieContent.appendChild(img);
    movieContent.appendChild(overviewPara);

    overviewPara.innerText = overview;

    movieInfo.appendChild(titleHeading);
    movieInfo.appendChild(ratingPara);
    movieDiv.appendChild(movieInfo);
    movieDiv.appendChild(movieContent);
    //movieInfo.appendChild(img);
    //movieDiv.appendChild(overviewPara);
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
      const { id, name, profile_path } = actor;

      const actorDiv = document.createElement("div");
      actorDiv.classList.add('actor');
      actorDiv.dataset.actorId = id; // Set the actor_id in the dataset

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


        alert("Movie favorites updated successfully!");
      } catch (error) {
        alert('Error updating movie favorites');
        console.error(error);
      }
    } else {
      alert('User not signed in. Please sign in.');
    }
  }

  function createActorLink(actorId) {
    const actorLink = document.createElement('a');
    actorLink.href = `actor_details.html?actor_id=${actorId}`;
    return actorLink;
  }

  // Add event listener to actor containers within the cast container
  const castContainer = document.getElementById('cast-container');
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
