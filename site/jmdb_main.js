const API_KEY = "api_key=f61be177e52665e7c5e6973bb615e517";
const BASE_URL = 'https://api.themoviedb.org/3/';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const API_URL = BASE_URL + 'movie/popular?' + API_KEY;
const KEYVAL_API_KEY="EV9B4A3DLp";
let main = new Keyval(KEYVAL_API_KEY);
let currentUser;

const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const movieContainer = document.getElementById('movie-container');

const movieDetail = document.getElementById('movie-detail');
getMovies(API_URL);

function getMovies(url) {
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      showMovies(data.results);
    });
}
if (searchButton != undefined){
  searchButton.addEventListener('click', performSearch);
}
if (searchInput != undefined){
  searchInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
      performSearch();
    }
  });
}

function performSearch() {
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
}

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
    updateColor(ratingPara, vote_average);
    ratingPara.innerText = `Rating: ${vote_average}`;

    const overviewPara = document.createElement('p');
    overviewPara.innerText = overview;

    movieInfo.appendChild(titleHeading);
    movieInfo.appendChild(ratingPara);
    movieDiv.appendChild(movieLink);
    movieDiv.appendChild(movieInfo);
    if (movieContainer != undefined){
      movieContainer.appendChild(movieDiv);
    }
  });

}

function updateColor(elt ,vote_average) {
  if (vote_average > 7){
    elt.style['color'] = 'green';
  } 
  if (vote_average < 7 && vote_average > 4.5) {
    elt.style['color'] = 'orange';
  } else {
    elt.style['color'] = 'green';
  }
}


function signInUser(username, password) {
  fetch(main.url_for(username))
    .then(response => {
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('User not found - 404 Error');
        } else {
          throw new Error('Server error: ' + response.status);
        }
      }
      return response.json();
    })
    .then(data => {
      console.log(data);
      currentUser = username;
      if (data.key2 === password){
        localStorage.setItem(username, data.key1);
        window.location.href = 'profile_page.html';
      } else{
        alert('Wrong Password Retry.');
      }
    })
    .catch(error => {
      alert('Username not found or server error');
      console.error(error.message);
    });
}

function signUpUser(username, password){
  let user = username
  fetch(main.url_for(user))
  .then(response => {
    if (response.status === 404) {
      throw new Error('Resource not found');
    }
  })
  .then(data => {
    console.log(data);
    alert('User Already In Use Please Sign In.');
  })
  .catch(error => {
    const JSONInfo = {key1: username, key2: password};
    main.set(username, JSON.stringify(JSONInfo), function(res){
      alert('Sign up Successful Redirecting.');
      window.location.href = 'profile_page.html';
    })
  });
}


