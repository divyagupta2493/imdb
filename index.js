// Base URL of API
const baseUrl = 'https://www.omdbapi.com?'

// Get element and hold in constants
const loader = document.querySelector('.loading');
const search = document.getElementById('search');
const searchResults = document.getElementById('results');

// Default search parametrs
// Considering movies only
const defaultSerachParams = {
    apikey: '44cd7259',
    type: 'movie'
}

// Currently searched parameters
var currentSearchParams = {};

// Hold total no of pages returned
var pages = null;

// Create movie element and append to searchResults
function createMovieElement(element) {
    const li = document.createElement('li');
    const h2 = document.createElement('h2');
    const favButton = document.createElement('button');
    const detail = document.createElement('a');

    // Assign unique id
    favButton.dataset.imdbid = element.imdbID;
    favButton.dataset.title = element.Title;
    favButton.className = 'favorite-button';

    detail.href = 'detail/detail.html?id=' + element.imdbID;
    detail.className = 'favorite-button';
    detail.textContent = 'Show Details';

    h2.innerHTML = `${element.Title}`;
    favButton.innerHTML = 'Add to Favourites';

    favButton.addEventListener('click', (e) => {
        const target = e.target;
        // get the movie title and id
        const movieTitle = target.dataset.title;
        const movieId = target.dataset.imdbid;
        var favMovies = JSON.parse(localStorage.getItem("favMovies") || '{}');
        favMovies[movieId] = movieTitle;
        localStorage.setItem('favMovies', JSON.stringify(favMovies));
    });

    li.appendChild(h2);
    li.appendChild(favButton);
    li.appendChild(detail);
    searchResults.appendChild(li);
}

// Get movies based on given URL
function showMovies(url) {
    // Hit API and get JSON response
    fetch(url).then(res => res.json())
        .then(function (data) {
            // Handle error
            if (data.Error) {
                searchResults.innerHTML = 'Error: ' + data.Error;
            } else {
                // Assign pages with total number of possible pages
                pages = Math.ceil(data.totalResults / 10);
                // Create movie element and Append to searchResults
                data.Search.forEach(createMovieElement);
            }
            // Hide loader once data loaded
            loader.style.display = 'none';
        });
}

// Debouncing is a strategy that lets us improve performance by 
// waiting until a certain amount of time has passed before triggering an event
const debounce = (callback, wait) => {
    let timeoutId = null;
    return (...args) => {
        window.clearTimeout(timeoutId);
        timeoutId = window.setTimeout(() => {
            callback.apply(null, args);
        }, wait);
    };
}

// Serach input handler
const handleSearchInput = debounce((e) => {
    e.preventDefault();
    searchResults.innerHTML = '';
    if (search.value) {
        loader.style.display = 'flex';
        showMovies(getUrl());
    }
}, 1500);

// Add input event listner on search input
search.addEventListener('input', handleSearchInput);

// Return paginated URL
function getUrl(page = 1) {
    currentSearchParams = JSON.parse(JSON.stringify(defaultSerachParams))
    currentSearchParams['s'] = search.value;
    currentSearchParams['page'] = page;
    const searchParams = new URLSearchParams(currentSearchParams);
    return baseUrl + searchParams.toString();
}

// The Scroll Event
// Load movies with infinite scroll
window.addEventListener('scroll', function () {
    var scrollHeight = document.documentElement.scrollHeight;
    var scrollTop = document.documentElement.scrollTop;
    var clientHeight = document.documentElement.clientHeight;

    if ((scrollTop + clientHeight) > (scrollHeight - 5)) {
        const page = currentSearchParams['page'] + 1;
        if (page <= pages) {
            loader.style.display = 'flex';
            showMovies(getUrl(page));
        }
    }
});

