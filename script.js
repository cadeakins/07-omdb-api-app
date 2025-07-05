// This is your OMDb API key. Replace 'YOUR_API_KEY' with your actual OMDb API key.
const API_KEY = '9437f1d7';

// Get references to DOM elements
const searchForm = document.getElementById('search-form');
const movieSearchInput = document.getElementById('movie-search');
const movieResults = document.getElementById('movie-results');
const watchlistDiv = document.getElementById('watchlist');

// Load the watchlist from localStorage, or start with an empty array
let watchlist = [];
const savedWatchlist = localStorage.getItem('watchlist');
if (savedWatchlist) {
  watchlist = JSON.parse(savedWatchlist);
}

// Show the watchlist when the page loads
displayWatchlist();

// Listen for the search form submission
searchForm.addEventListener('submit', async function(event) {
  // Prevent the page from reloading
  event.preventDefault();

  // Get the search term from the input box
  const searchTerm = movieSearchInput.value.trim();

  // If the search box is empty, do nothing
  if (!searchTerm) {
    return;
  }

  // Fetch movies from the OMDb API
  await fetchMovies(searchTerm);
});

// Function to fetch movies from the OMDb API
async function fetchMovies(searchTerm) {
  // Build the API URL using the search term and API key
  const url = `https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(searchTerm)}`;

  // Fetch data from the API
  const response = await fetch(url);

  // Convert the response to JSON
  const data = await response.json();

  // Check if the API returned movies
  if (data.Response === 'True') {
    // Display the movies in the results grid
    displayMovies(data.Search);
  } else {
    // If no movies found, show a message
    movieResults.innerHTML = `<div class="no-results">No movies found. Try another search!</div>`;
  }
}

// Function to display movies in the results grid
function displayMovies(movies) {
  // Create HTML for each movie
  const moviesHTML = movies.map(movie => {
    // Use a placeholder image if the poster is not available
    const poster = movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Image';

    // Return HTML for one movie card, including an Add to Watchlist button
    return `
      <div class="movie-card">
        <img class="movie-poster" src="${poster}" alt="Poster for ${movie.Title}">
        <div class="movie-info">
          <div class="movie-title">${movie.Title}</div>
          <div class="movie-year">${movie.Year}</div>
          <button class="btn btn-add" data-imdbid="${movie.imdbID}">Add to Watchlist</button>
        </div>
      </div>
    `;
  }).join('');

  // Insert the movies into the results grid
  movieResults.innerHTML = moviesHTML;

  // Add event listeners to all Add to Watchlist buttons
  const addButtons = document.querySelectorAll('.btn-add');
  addButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Find the movie by imdbID
      const imdbID = button.getAttribute('data-imdbid');
      const movieToAdd = movies.find(m => m.imdbID === imdbID);

      // Check if the movie is already in the watchlist
      const alreadyInWatchlist = watchlist.some(m => m.imdbID === imdbID);

      // If not in the watchlist, add it and update the watchlist display
      if (!alreadyInWatchlist) {
        watchlist.push(movieToAdd);

        // Save the updated watchlist to localStorage
        localStorage.setItem('watchlist', JSON.stringify(watchlist));

        // Update the watchlist display
        displayWatchlist();
      }
    });
  });
}

// Function to display the watchlist
function displayWatchlist() {
  // If the watchlist is empty, show a message
  if (watchlist.length === 0) {
    watchlistDiv.innerHTML = 'Your watchlist is empty. Search for movies to add!';
    return;
  }

  // Create HTML for each movie in the watchlist, including a Remove button
  const watchlistHTML = watchlist.map(movie => {
    const poster = movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Image';
    return `
      <div class="movie-card">
        <img class="movie-poster" src="${poster}" alt="Poster for ${movie.Title}">
        <div class="movie-info">
          <div class="movie-title">${movie.Title}</div>
          <div class="movie-year">${movie.Year}</div>
          <!-- Remove from Watchlist button -->
          <button class="btn btn-remove" data-imdbid="${movie.imdbID}">Remove</button>
        </div>
      </div>
    `;
  }).join('');

  // Insert the watchlist movies into the watchlist grid
  watchlistDiv.innerHTML = watchlistHTML;

  // Add event listeners to all Remove buttons
  const removeButtons = document.querySelectorAll('.btn-remove');
  removeButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Get the imdbID of the movie to remove
      const imdbID = button.getAttribute('data-imdbid');
      // Remove the movie from the watchlist array
      watchlist = watchlist.filter(m => m.imdbID !== imdbID);
      // Save the updated watchlist to localStorage
      localStorage.setItem('watchlist', JSON.stringify(watchlist));
      // Update the watchlist display
      displayWatchlist();
    });
  });
}