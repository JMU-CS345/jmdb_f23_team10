document.addEventListener("DOMContentLoaded", function () {
    const actorContainer = document.getElementById('actor-container');

    // Get actor ID from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const actorId = urlParams.get('actor_id');

    if (actorId) {
        // Fetch and display actor details when the page is loaded
        fetchActorDetails(actorId);
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
        const { name, profile_path, biography, popularity } = actor;

        const actorDiv = document.createElement('div');
        actorDiv.classList.add('actor-details');

        const img = document.createElement('img');
        img.src = IMG_URL + profile_path;
        img.alt = name;

        const actorInfo = document.createElement('div');
        actorInfo.classList.add('actor-info');

        const nameHeading = document.createElement('h1');
        nameHeading.innerText = name;

        const popularityPara = document.createElement('p');
        popularityPara.innerText = `Popularity: ${popularity}`;

        const biographyPara = document.createElement('p');
        biographyPara.innerText = biography;

        actorInfo.appendChild(nameHeading);
        actorInfo.appendChild(popularityPara);
        actorDiv.appendChild(img);
        actorDiv.appendChild(actorInfo);
        actorDiv.appendChild(biographyPara);

        actorContainer.appendChild(actorDiv);
    }
});
