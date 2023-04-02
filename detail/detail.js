const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get('id');

const baseUrl = 'http://www.omdbapi.com/?apikey=44cd7259&plot=full&i='

const movieInfo = document.querySelector('.movie-info');
const loader = document.querySelector('.loading');

if (movieId != '') {
  const url = baseUrl + movieId;
  fetchMovieDetail(url);
};

async function fetchMovieDetail(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    const img = document.createElement('img');

    if (data.Poster == 'N/A') {
      img.src = 'no-image.avif';
    } else {
      img.src = data.Poster;
    }

    const h1 = document.createElement('h1');
    h1.textContent = data.Title;

    const p = document.createElement('p');
    p.textContent = data.Plot;

    loader.style.display = 'none';

    movieInfo.innerHTML = '';

    movieInfo.appendChild(img);
    movieInfo.appendChild(h1);
    movieInfo.appendChild(p);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}
