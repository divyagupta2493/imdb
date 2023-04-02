const movieList = document.getElementById('movieList');

function populateList() {
  movieList.innerHTML = '';
  const favMovies = JSON.parse(localStorage.getItem("favMovies") || '{}');
  Object.keys(favMovies).forEach((key) => { 
    var value = favMovies[key]
    // iteration code
    const li = document.createElement('li');
    const removeButton = document.createElement('button');

    removeButton.dataset.title = value;
    removeButton.dataset.imdbid = key;
    removeButton.textContent = 'Remove';

    removeButton.addEventListener('click',  (e) => {
      const target = e.target;
      var localFavMovies = JSON.parse(localStorage.getItem("favMovies") || '{}');
      delete localFavMovies[target.dataset.imdbid];
      localStorage.setItem('favMovies', JSON.stringify(localFavMovies));
      target.parentElement.parentElement.removeChild(target.parentElement);
    });

    li.textContent = value;
    li.appendChild(removeButton);
    movieList.appendChild(li);
  });

};

populateList();
