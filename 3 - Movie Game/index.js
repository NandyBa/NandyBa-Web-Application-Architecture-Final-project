
API_Key = '12eefe636084e06b2430cf9b2a084aff';

movie_id = 550;

URL = `https://api.themoviedb.org/3/movie/${movie_id}?api_key=${API_Key}&language=en-US`;

async function getMovieCredit(){
	return await fetch(`https://api.themoviedb.org/3/movie/${movie_id}/credits?api_key=${API_Key}&language=en-US`)
	.then(response =>{ return response.json()})
}

async function getPersonMovieCredit(person_id){
	url = `https://api.themoviedb.org/3/person/${person_id}/movie_credits?api_key=${API_Key}&language=en-US`;
	return await fetch(url)
	.then(response => { return response.json()})
}

fetch(URL)
.then(response => response.json())
.then(movie => {
	movieCoverUrl = 'https://www.themoviedb.org/t/p/w220_and_h330_face/'+ movie.backdrop_path ;
	movieTitle = movie.original_title ;
	movieReleaseDate = movie.release_date ;
	document.getElementById('movieCover').src = movieCoverUrl ;
	document.getElementById('movieTitle').innerHTML = movieTitle ;
	document.getElementById('movieReleaseDate').innerHTML = 'Release date: ' + movieReleaseDate ;

	getMovieCredit(movie_id).then( credits =>{
		actors = [];
		credits.cast.forEach(person =>{
			if(person.known_for_department == "Acting"){
				actors.push(person.name.toLowerCase());
			}
		})
		document.getElementById('form-who-play').addEventListener("submit", function(e){
			e.preventDefault();
			response = document.getElementById('form-actor').value.toLowerCase();

			if(actors.includes(response)){
				var imgurl;
				var actor_id;
				credits.cast.forEach(person =>{
					if(person.name.toLowerCase() == response.toLowerCase()){
						imgurl = "https://www.themoviedb.org/t/p/w220_and_h330_face" + person.profile_path;
						actor_id = person.id;
					}
				})
				var $actor_info = document.getElementById('actor-info');
				$actor_info.innerHTML = '<img src="'+ imgurl +'"/><span class="name">' + response +'</span>';
				$form_div = document.createElement("div");
				$form = document.createElement("form");
				$form_div.append($form);
				$form.id = 'form-movie';
				$form.innerHTML = '\
					<label for="form-movie">In what other movie this actor / actrice plays ?</label>\
					<input id="form-movie-name" type="text" placeholder="Movie name">\
					<input type="submit" value="V??rifier">\
				';
				$actor_info.parentNode.insertBefore($form_div, $actor_info.nextSibling);
				var movies_titles = [];
				getPersonMovieCredit(actor_id).then(movies =>{	
					movies.cast.forEach( movie =>{
						movies_titles.push(movie.title.toLowerCase());
					});
				});
				document.getElementById('form-movie').addEventListener("submit", function(e){
					e.preventDefault();
					response = document.getElementById('form-movie-name').value.toLowerCase();

					if(movies_titles.includes(response)){
						alert('correct');
					}else{
						alert('incorrect');
					}
				});

				
				

			}else{
				document.getElementById('response').innerHTML = "incorrect";
			}
		});
	})
	
})


