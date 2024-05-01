const actorContainer = document.getElementById('actor-container');
const actorMoviesContainer = document.getElementById('actor-movies-container');
const orderSelect = document.getElementById('order-select');

document.addEventListener("DOMContentLoaded", function () {
    // Get actor ID from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const actorId = urlParams.get('actor_id');

    if (actorId) {
        // Fetch and display actor details when the page is loaded
        fetchActorDetails(actorId);
        // Fetch and display actor movies when the page is loaded
        fetchActorMovies(actorId);
    }

    function fetchActorDetails(actorId) {
        // Make an API request to get actor details using the actorId
        fetch(`${BASE_URL}person/${actorId}?${API_KEY}`)
            .then((response) => response.json())
            .then((actor) => {
                displayActorDetails(actor);
            })
            .catch((error) => {
                console.error('Error fetching actor details:', error);
            });
    }

    function displayActorDetails(actor) {
        const { name, profile_path, biography, popularity, birthday, deathday } = actor;

        const actorDiv = document.createElement('div');
        actorDiv.classList.add('actor-details');

        const img = document.createElement('img');
        img.src = IMG_URL + profile_path;
        img.alt = name;

        const actorInfo = document.createElement('div');
        actorInfo.classList.add('actor-info');

        const nameHeading = document.createElement('h1');
        nameHeading.innerText = name;

        const actorDate = document.createElement('div');
        actorDate.classList.add('actor-date');

        const birthdayPara = document.createElement('p');
        birthdayPara.innerText = `Birthday: ${formatBirthDate(birthday)}`;
        if (deathday == null) {
            birthdayPara.innerText += ` (Age: ${calculateAge(birthday)})`;
        }
        birthdayPara.classList.add('birth-date');

        const deathdayPara = document.createElement('p');
        deathdayPara.innerText = `Death Date: ${formatBirthDate(deathday)}`;
        if (deathday !== null) {
            deathdayPara.innerText += ` (Age: ${calculateAge(birthday, deathday)})`;
        }
        deathdayPara.classList.add('death-date');

        const popularityPara = document.createElement('p');
        actorUpdateColor(popularityPara, popularity);
        popularityPara.innerText = `Popularity: ${Math.floor(popularity)}`;

        const actorContent = document.createElement('div');
        actorContent.classList.add('actor-content');

        const biographyPara = document.createElement('p');
        biographyPara.innerText = biography;
        biographyPara.classList.add('actor-biography');

        actorContent.appendChild(img);
        actorContent.appendChild(biographyPara);

        biographyPara.innerText = biography;

        actorInfo.appendChild(nameHeading);
        actorInfo.appendChild(popularityPara);

        actorDate.appendChild(birthdayPara);
        if (deathday != null) {
            actorDate.appendChild(deathdayPara);
        }

        actorDiv.appendChild(actorInfo);
        actorDiv.appendChild(actorDate);
        actorDiv.appendChild(actorContent);

        actorContainer.appendChild(actorDiv);
    }

    function formatBirthDate(rawDate) {
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        const formattedDate = new Date(rawDate).toLocaleDateString('en-US', options);
        return formattedDate;
    }

    function calculateAge(birthDate, deathDate = new Date()) {
        const birth = new Date(birthDate);
        const death = new Date(deathDate);
        const age = death.getFullYear() - birth.getFullYear();
        const monthDiff = death.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && death.getDate() < birth.getDate())) {
            return age - 1;
        } else {
            return age;
        }
    }

    function fetchActorMovies(actorId, order = 'popularity') {
        // Make an API request to get movies that the actor has been in
        fetch(`${BASE_URL}person/${actorId}/movie_credits?${API_KEY}`)
            .then((response) => response.json())
            .then((movies) => {
                // Sort movies based on the selected order
                const sortedMovies = (order === 'popularity')
                    ? movies.cast.sort((a, b) => b.popularity - a.popularity)
                    : movies.cast.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));

                displayActorMovies(sortedMovies);
            })
            .catch((error) => {
                console.error('Error fetching actor movies:', error);
            });
    }


    function displayActorMovies(actorMovies) {
        // Clear existing content before appending new movies
        actorMoviesContainer.innerHTML = '';

        actorMovies.forEach((movie) => {
            const { id, title, poster_path, release_date } = movie;

            const movieDiv = document.createElement('div');
            movieDiv.classList.add('movie');

            const img = document.createElement('img');
            if (poster_path !== null) {
                img.src = IMG_URL + poster_path;
            } else {
                img.src = 'default-poster.png';
            }
            img.alt = title;

            movieDiv.addEventListener('click', () => {
                console.log(`Clicked on movie with ID: ${movie.id}`);
                window.location.href = `movie_detail.html?movie_id=${id}`;
            });

            const movieInfo = document.createElement('div');
            movieInfo.classList.add('movie-info');

            const titleHeading = document.createElement('h3');
            titleHeading.innerText = title;

            const releaseDatePara = document.createElement('p');
            if (release_date != '') {
                releaseDatePara.innerText = formatReleaseDate(release_date);
            }

            movieInfo.appendChild(titleHeading);
            movieInfo.appendChild(releaseDatePara);
            movieDiv.appendChild(img);
            movieDiv.appendChild(movieInfo);

            actorMoviesContainer.appendChild(movieDiv);
        });
    }

    function formatReleaseDate(rawDate) {
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        const formattedDate = new Date(rawDate).toLocaleDateString('en-US', options);
        return formattedDate;
    }

    const orderSelect = document.getElementById('order-select');
    orderSelect.addEventListener('change', function () {
        // Fetch and display actor movies based on the selected order
        const selectedOrder = orderSelect.value;
        fetchActorMovies(actorId, selectedOrder);
    });
});

function actorUpdateColor(elt, vote_average) {
    if (vote_average > 100) {
        elt.style['color'] = 'purple';
    }
    else if (vote_average < 100 && vote_average > 50) {
        elt.style['color'] = 'green';
    } else if (vote_average < 50 && vote_average > 10) {
        elt.style['color'] = 'orange';
    } else {
        elt.style['color'] = 'red';
    }
}
