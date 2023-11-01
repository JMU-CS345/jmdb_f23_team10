const API_KEY= "api_key=f61be177e52665e7c5e6973bb615e517";
const BASE_URL = 'https://api.themoviedb.org/3/'
const API_URL = BASE_URL + '/discover/movie?sort_by=popularity.desc&' + API_KEY
const IMG_URL = 'https://image.tmdb.org/t/p/w500';


getMovies(API_URL);

function getMovies(url) {
    fetch(url).then(res => res.json).then(data => {
        console.log(data.results)
        showMovies(data.results)
    })
}

function showMovies(data) {
    data.foreach(movie => {
        const {title, poster_path, vote_average, overview} = movie
        
        
    })
}
