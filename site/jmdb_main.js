const API_KEY = "api_key=f61be177e52665e7c5e6973bb615e517";
const BASE_URL = 'https://api.themoviedb.org/3/';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const API_URL_MOVIE = BASE_URL + 'movie/popular?' + API_KEY;
const API_URL_ACTOR = BASE_URL + 'person/popular?' + API_KEY;
const KEYVAL_API_KEY = "EV9B4A3DLp";
let main = new Keyval(KEYVAL_API_KEY);
let currentUser;

const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const movieContainer = document.getElementById('movie-container');

const movieDetail = document.getElementById('movie-detail');
getMovies(API_URL_MOVIE);

const switchSearchTypeButton = document.getElementById('switch-search-type');

function getMovies(url) {
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      showMovies(data.results);
    });
}

function getActors(url) {
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      showActors(data.results);
    });
}

if (searchButton != undefined) {
  searchButton.addEventListener('click', performSearch);
}
if (searchInput != undefined) {
  searchInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
      performSearch();
    }
  });
}

function performSearch() {
  const searchTerm = searchInput.value;

  movieContainer.innerHTML = '';

  if (searchTerm.length > 0) {
    if (isSearchingForMovies) {
      // Perform movie search
      const searchURL = `${BASE_URL}search/movie?${API_KEY}&query=${searchTerm}`;

      fetch(searchURL)
        .then((response) => response.json())
        .then((data) => {
          showMovies(data.results);
        })
        .catch((error) => {
          console.error('An error occurred:', error);
        });
    } else {
      // Perform actor search
      const searchURL = `${BASE_URL}search/person?${API_KEY}&query=${searchTerm}`;

      fetch(searchURL)
        .then((response) => response.json())
        .then((data) => {
          showActors(data.results);
        })
        .catch((error) => {
          console.error('An error occurred:', error);
        });
    }
  } else {
    alert('Must enter something to be searched.');
    if (isSearchingForMovies) {
      getMovies(API_URL_MOVIE);
    } else {
      getActors(API_URL_ACTOR);
    }
  }
}

function showMovies(data) {
  if (data.length === 0) {
    // If no movies found, display a message
    const noResultsMessage = document.createElement('p');
    noResultsMessage.textContent = 'No movies found.';
    noResultsMessage.classList.add('no-results-message');
    movieContainer.appendChild(noResultsMessage);
    return;
  }

  // Sort movies by rating in descending order
  const sortedMovies = data.sort((a, b) => {
    // Sort by rating in descending order
    if (b.vote_average !== a.vote_average) {
      return b.vote_average - a.vote_average;
    }

    // If ratings are equal, sort by the presence of poster path (null values come last)
    return a.poster_path === null ? 1 : -1;
  });

  sortedMovies.forEach((movie) => {
    const { title, poster_path, vote_average, overview, id, release_date } = movie;

    const movieDiv = document.createElement('div');
    movieDiv.classList.add('movie');

    const img = document.createElement('img');
    if (poster_path !== null) {
      img.src = IMG_URL + poster_path;
    } else {
      img.src = 'default-poster.png';
    }
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
    ratingPara.innerText = `Rating: ${Math.floor(vote_average)}`;

    const overviewPara = document.createElement('p');
    overviewPara.innerText = overview;

    movieInfo.appendChild(titleHeading);
    movieInfo.appendChild(ratingPara);

    movieDiv.appendChild(movieLink);
    movieDiv.appendChild(movieInfo);
    if (movieContainer != undefined) {
      movieContainer.appendChild(movieDiv);
    }
  });
}

function formatReleaseDate(rawDate) {
  const options = { month: 'short', day: 'numeric', year: 'numeric' };
  const formattedDate = new Date(rawDate).toLocaleDateString('en-US', options);
  return formattedDate;
}

if (switchSearchTypeButton != null) {
  switchSearchTypeButton.addEventListener('click', switchSearchType);
}

// Add a variable to keep track of the current search type
let isSearchingForMovies = true;

// Update the page title based on the current search type
function updatePageTitle() {
  const pageTitle = document.querySelector('.page-title');
  pageTitle.textContent = isSearchingForMovies ? 'Trending Movies' : 'Trending Actors';
}

// Update the search bar placeholder based on the current search type
function updateSearchBarPlaceholder() {
  const searchInput = document.getElementById('search-input');
  searchInput.placeholder = isSearchingForMovies ? 'Search Movies' : 'Search Actors';
}

// Modify your switchSearchType function to update the search bar placeholder
function switchSearchType() {
  isSearchingForMovies = !isSearchingForMovies;

  // Update the button text based on the current search type
  switchSearchTypeButton.textContent = isSearchingForMovies ? 'Switch to Actor Search' : 'Switch to Movie Search';

  // Update the page title
  updatePageTitle();

  // Update the search bar placeholder
  updateSearchBarPlaceholder();

  updatePageTitle();

  // Clear the previous search results
  movieContainer.innerHTML = '';

  // Perform a search based on the new search type
  if (isSearchingForMovies) {
    // Perform movie search
    getMovies(API_URL_MOVIE);
  } else {
    getActors(API_URL_ACTOR);
  }
}

if (switchSearchTypeButton != null) {
  // Call updateSearchBarPlaceholder to set the initial placeholder
  updateSearchBarPlaceholder();
}

// Function to show actor search results
function showActors(data) {
  if (data.length === 0) {
    // If no actors found, display a message
    const noResultsMessage = document.createElement('p');
    noResultsMessage.textContent = 'No actors found.';
    noResultsMessage.classList.add('no-results-message');
    movieContainer.appendChild(noResultsMessage);
    return;
  }

  // Sort actors by rating in descending order
  const sortedActors = data.sort((a, b) => {
    // Sort by rating in descending order
    if (b.popularity !== a.popularity) {
      return b.popularity - a.popularity;
    }

    // If ratings are equal, sort by the presence of poster path (null values come last)
    return a.profile_path === null ? 1 : -1;
  });

  sortedActors.forEach((actor) => {
    const { name, profile_path, id } = actor;

    const actorDiv = document.createElement('div');
    actorDiv.classList.add('actor');

    const img = document.createElement('img');
    if (profile_path !== null) {
      img.src = IMG_URL + profile_path;
    } else {
      img.src = 'default-profile.jpg';
    }
    img.alt = name;

    // Create a link for each actor to navigate to the actor detail page
    const actorLink = document.createElement('a');
    actorLink.href = `actor_details.html?actor_id=${id}`;
    actorLink.appendChild(img);

    const actorInfo = document.createElement('div');
    actorInfo.classList.add('actor-info');

    const nameHeading = document.createElement('h3');
    nameHeading.innerText = name;

    actorInfo.appendChild(nameHeading);
    actorDiv.appendChild(actorLink);
    actorDiv.appendChild(actorInfo);

    if (movieContainer != undefined) {
      movieContainer.appendChild(actorDiv);
    }
  });
}

function updateColor(elt, vote_average) {
  if (vote_average > 7) {
    elt.style['color'] = 'green';
  }
  else if (vote_average < 7 && vote_average > 4.5) {
    elt.style['color'] = 'orange';
  } else {
    elt.style['color'] = 'red';
  }
}

function signInUser(username, password) {
  fetch(main.url_for(username))
    .then(response => {
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('User not found');
        }
      }
      return response.json();
    })
    .then(data => {
      console.log(data);
      if (data.key2 === password) {
        localStorage.setItem('currentUser', data.key1);
        window.location.href = 'profile_page.html';

      } else {
        alert('Wrong Password Retry.');
      }
    })
    .catch(error => {
      alert('Username not found or server error');
      console.error(error.message);
    });
}

function signUpUser(username, password) {
  let user = username;

  fetch(main.url_for(user))
    .then(response => {
      if (response.status === 404) {
        // User doesn't exist, proceed with sign-up
        const JSONInfo = { key1: username, key2: password, key3: [] };
        main.set(username, JSON.stringify(JSONInfo), function (res) {
          alert('Sign up Successful. Please Log In.');
          localStorage.setItem('currentUser', username);
          currentUser = localStorage.getItem('currentUser');
        });
      } else {
        // User already exists
        throw new Error('User Already In Use. Please Sign In.');
      }
    })
    .catch(error => {
      alert(error.message);
    });
}

function getCurrentUser() {
  return currentUser;
}

function updatePageTitle() {
  const pageTitle = document.querySelector('#trend');
  pageTitle.textContent = isSearchingForMovies ? 'Trending Movies' : 'Trending Actors';
}