class movieButton {
    constructor(apiKey) {
      this.apiKey = apiKey;
      this.title = "";
      this.image = "";
      this.description = "";
    }
  
    async getMovieDetails(movieId) {
      const movieUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${this.apiKey}`;
      
      try {
        const response = await fetch(movieUrl);
        const movie = await response.json();
        
        this.title = movie.title;
        this.description = movie.overview;
        this.image = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
      } catch (error) {
        console.error("Error fetching movie data:", error);
      }
    }
    
    display(x, y, onClick) {
      if (this.title) {
        // Create a clickable button
        let button = createButton(this.title);
        button.position(x, y);
        button.mousePressed(onClick);
  
        // Display movie image
        if (this.image) {
          const img = createImg(this.image);
          img.position(x, y + 20);
          img.size(200, 300);
        }
  
        // Display movie description
        if (this.description) {
          textSize(12);
          text(this.description, x, y + 340);
        }
      } else {
        textSize(16);
        text("Movie not found", x, y);
      }
    }
  }

function movieButtonClick() {
    //placeholder function to allow buttons to be constructed
}