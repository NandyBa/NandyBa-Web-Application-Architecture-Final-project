
API_Key = '12eefe636084e06b2430cf9b2a084aff';

movie_id = 550

URL = `https://api.themoviedb.org/3/movie/${movie_id}?api_key=${API_Key}&language=en-US`;



// Make a request for a user with a given ID
fetch(URL)
.then(response => response.json())
.then(movie => {
	console.log(movie);
	movieCoverUrl = 'https://www.themoviedb.org/t/p/w220_and_h330_face/'+ movie.backdrop_path ;
	movieTitle = movie.original_title ;
	movieReleaseDate = movie.release_date ;
	document.getElementById('movieCover').src = movieCoverUrl ;
	document.getElementById('movieTitle').innerHTML = movieTitle ;
	document.getElementById('movieReleaseDate').innerHTML = 'Release date: ' + movieReleaseDate ;
})
.then(function () {
  // always executed
});
