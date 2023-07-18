// https://api.themoviedb.org/3/movie/550?api_key=2108ba002735557392b137d4d3ea5000
// const apiKey = "2108ba002735557392b137d4d3ea5000";

// console.log(window.location.pathname);

const global = {
  currentPage: window.location.pathname,
  search: {
    term: "",
    type: "",
    page: 1,
    totalPages: 1,
  },
  api: {
    apiKey: "2108ba002735557392b137d4d3ea5000",
    apiUrl: "https://api.themoviedb.org/3/",
  },
};
// DISPLAY NOW PLAYING IN INDEX
async function displayNowPlayingMovies() {
  const { results } = await fetchAPIData("movie/now_playing");
  // console.log(results);
  results.forEach((movie) => {
    const swiper = new Swiper(".swiper", {
      slidesPerView: 4,
      spaceBetween: 25,
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
    });
    const div = document.createElement("div");
    div.classList.add("swiper-slide");
    div.innerHTML = ` <a href="movie-details.html?id=${movie.id}">

    ${
      movie.poster_path
        ? `<img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" class="card-img-top" alt="${movie.title}"/>`
        : `  <img
    src="./images/no-image.jpg"
    alt="${movie.title}"
  />`
    }
  </a>
  <h4 class="swiper-rating">
    <i class="fas fa-star text-secondary"></i> ${movie.vote_average}/ 10
  </h4>`;
    document.querySelector(".swiper-wrapper").appendChild(div);
  });
}
// DISPLAY MOVIE-DETAILS
async function displayMovieDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const movieId = urlParams.get("id");
  // console.log(movieId);
  const movieDetails = await fetchAPIData(`movie/${movieId}`);
  // console.log(movieDetails);

  // console.log(backdropUrl);

  const movieDetailsHTML = `<div class="details-top">
  <div style="background-image: url('https://image.tmdb.org/t/p/original${
    movieDetails.backdrop_path
  }'); background-size: cover; background-position: center center; background-repeat: no-repeat; height: 100vh; width: 100vw; position: absolute; top: 0px; left: 0px; z-index: -1; opacity: 0.1;"></div>
  <div>
  ${
    movieDetails.poster_path
      ? `<img src="https://image.tmdb.org/t/p/w500${movieDetails.poster_path}" class="card-img-top" alt="${movieDetails.title}"/>`
      : `  <img
  src="./images/no-image.jpg"
  alt="${movieDetails.title}"
/>`
  }
  </div>
  <div>
    <h2>${movieDetails.title}</h2>
    <p>
      <i class="fas fa-star text-primary"></i>
      ${movieDetails.vote_average.toFixed(1)} / 10
    </p>
    <p class="text-muted">Release Date: ${movieDetails.release_date}</p>
    <p>
     ${movieDetails.overview}
    </p>
    <h5>Genres</h5>
    <ul class="list-group">
      ${movieDetails.genres.map((genre) => `<li>${genre.name}</li>`).join("")}
    </ul>
    <a href="${
      movieDetails.homepage
    }" target="_blank" class="btn">Visit Movie Homepage</a>
  </div>
</div>
<div class="details-bottom">
          <h2>Movie Info</h2>
          <ul>
            <li><span class="text-secondary">Budget:</span> $${movieDetails.budget.toLocaleString()}</li>
            <li><span class="text-secondary">Revenue:</span> $${movieDetails.revenue.toLocaleString()}</li>
            <li><span class="text-secondary">Runtime:</span> ${
              movieDetails.runtime
            } minutes</li>
            <li><span class="text-secondary">Status:</span> ${
              movieDetails.status
            }</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">${movieDetails.production_companies
            .map((company) => company.name)
            .join(", ")}</div>
        </div> `;
  document.querySelector("#movie-details").innerHTML = movieDetailsHTML;
}

// show alert
function showAlert(message, timeout = 3000) {
  const alertDiv = document.querySelector("#alert");
  const alertMsg = document.createElement("div");
  const pagination = document.querySelector(".pagination");
  pagination.innerHTML = "";
  alertMsg.classList.add("alert", "error");
  alertMsg.textContent = message;
  alertDiv.appendChild(alertMsg);

  setTimeout(() => {
    alertMsg.remove();
  }, timeout);
}

// SEARCHMOVIE
async function search() {
  const urlParams = new URLSearchParams(window.location.search);
  global.search.term = urlParams.get("search-term");
  global.search.type = urlParams.get("type");
  if (global.search.term !== "" && global.search.term !== null) {
    const { results, total_pages, page, total_results } = await searchAPIData();

    global.search.page = page;
    global.search.totalPages = total_pages;
    global.search.totalResults = total_results;

    if (results.length === 0) {
      showAlert("No results found");
      return;
    }
    displaySearchResults(results);
    document.querySelector("#search-term").value = "";
  } else {
    showAlert("Please enter a search term");
  }
}
// DISPLAY SEARCH RESULTS
function displaySearchResults(results) {
  // clear
  document.querySelector("#search-results").innerHTML = "";
  document.querySelector("#search-results-heading").innerHTML = "";
  document.querySelector("#pagination").innerHTML = "";

  results.forEach((result) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `

    <a href="${global.search.type}-details.html?id=${result.id}">
    ${
      result.poster_path
        ? `<img src="https://image.tmdb.org/t/p/w500${
            result.poster_path
          }" class="card-img-top" alt="${
            global.search.type === "movie" ? result.title : result.name
          }"/>`
        : `  <img
    src="./images/no-image.jpg"
    class="card-img-top"
    alt="${global.search.type === "movie" ? result.title : result.name}"
  />`
    }
  </a>
  <div class="card-body">
    <h5 class="card-title">${
      global.search.type === "movie" ? result.title : result.name
    }</h5>
    <p class="card-text">
      <small class="text-muted">Release: ${
        global.search.type === "movie"
          ? result.release_date
          : result.first_air_date
      }</small>
    </p>
  </div>
    `;
    document.querySelector(
      "#search-results-heading"
    ).innerHTML = `<h2>${results.length} OF ${global.search.totalResults} RESULTS FOR ${global.search.term}</h2>`;
    document.querySelector("#search-results").appendChild(div);
  });

  displayPagination();
}
// CREAT & DISPLAY PAGINATION FOR SEARCH
function displayPagination() {
  const div = document.createElement("div");
  div.classList.add("pagination");
  div.innerHTML = `
    <button class="btn btn-primary" id="prev">Prev</button>
    <button class="btn btn-primary" id="next">Next</button>
    <div class="page-counter">Page ${global.search.page} of ${global.search.totalPages}</div>
  `;

  document.querySelector("#pagination").appendChild(div);

  // Disable prev button if on the first page
  if (global.search.page === 1) {
    document.querySelector("#prev").disabled = true;
  }
  // Disable next button if on the last page
  if (global.search.page === global.search.totalPages) {
    document.querySelector("#next").disabled = true;
  }
  // Next page
  document.querySelector("#next").addEventListener("click", async () => {
    global.search.page++;
    const { results, total_pages } = await searchAPIData();
    displaySearchResults(results);
  });
  // PRev page
  document.querySelector("#prev").addEventListener("click", async () => {
    global.search.page--;
    const { results, total_pages } = await searchAPIData();
    displaySearchResults(results);
  });
}
// MAKE REQUEST TO SEARCH
async function searchAPIData() {
  const API_KEY = global.api.apiKey;
  const API_URL = global.api.apiUrl;

  showSpinner();

  const response = await fetch(
    `${API_URL}search/${global.search.type}?api_key=${API_KEY}&language=en-us&query=${global.search.term}&page=${global.search.page}`
  );
  const data = await response.json();
  hideSpinner();
  return data;
}
// DISPLAY POPULAR MOVIE IN INDEX
async function displayPopularMovies(movieId) {
  const { results } = await fetchAPIData("movie/popular");
  // console.log(results[0]);
  results.forEach((movie) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `
    <a href="movie-details.html?id=${movie.id}">
    ${
      movie.poster_path
        ? `<img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" class="card-img-top" alt="${movie.title}"/>`
        : `  <img
    src="./images/no-image.jpg"
    class="card-img-top"
    alt="${movie.title}"
  />`
    }
    </a>
    <div class="card-body">
            <h5 class="card-title">${movie.title}</h5>
            <p class="card-text">
              <small class="text-muted">Release: ${movie.release_date}</small>
            </p>
          </div>`;
    document.querySelector("#popular-movies").appendChild(div);
  });
}
// Display TVSHOW DETAILS
async function displayTVShowsDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const tvId = urlParams.get("id");
  // console.log(tvId);
  const tvDetails = await fetchAPIData(`tv/${tvId}`);
  console.log(tvDetails);
  const tvDetailsHTML = `<div class="details-top">
  <div style="background-image: url('https://image.tmdb.org/t/p/original${
    tvDetails.backdrop_path
  }'); background-size: cover; background-position: center center; background-repeat: no-repeat; height: 100vh; width: 100vw; position: absolute; top: 0px; left: 0px; z-index: -1; opacity: 0.1;"></div>
  <div>
  ${
    tvDetails.poster_path
      ? `<img src="https://image.tmdb.org/t/p/w500${tvDetails.poster_path}" class="card-img-top" alt="${tvDetails.original_name}"/>`
      : `  <img
  src="./images/no-image.jpg"
  alt="${tvDetails.original_name}"
/>`
  }
  </div>
  <div>
    <h2>${tvDetails.original_name}</h2>
    <p>
      <i class="fas fa-star text-primary"></i>
      ${tvDetails.vote_average.toFixed(1)} / 10
    </p>
    <p class="text-muted">Last Air Date: ${tvDetails.last_air_date}</p>
    <p>
     ${tvDetails.overview}
    </p>
    <h5>Genres</h5>
    <ul class="list-group">
      ${tvDetails.genres.map((genre) => `<li>${genre.name}</li>`).join("")}
    </ul>
    <a href="${
      tvDetails.homepage
    }" target="_blank" class="btn">Visit Movie Homepage</a>
  </div>
</div>
<div class="details-bottom">
          <h2>Show Info</h2>
          <ul>
            <li><span class="text-secondary">Number Of Episodes:</span> ${
              tvDetails.number_of_episodes
            }</li>
            <li>
              <span class="text-secondary">Last Episode To Air:</span> ${
                tvDetails.last_episode_to_air.name
              }
            </li>
            <li><span class="text-secondary">Status:</span> ${
              tvDetails.status
            }</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">${tvDetails.production_companies
            .map((company) => company.name)
            .join(", ")}</div>
        </div> `;
  document.querySelector("#show-details").innerHTML = tvDetailsHTML;
}
// Display TVSHOWS
async function displayTVShows() {
  const { results } = await fetchAPIData("tv/popular");
  console.log(results);
  results.forEach((show) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `
    <a href="tv-details.html?id=${show.id}">
    ${
      show.poster_path
        ? `<img
    src="https://image.tmdb.org/t/p/w500${show.poster_path}"
    alt="${show.name}"
  />`
        : ` <img
  src="./images/no-image.jpg"
  class="card-img-top"
  alt="${show.name}"
/>`
    }
          </a>
          <div class="card-body">
            <h5 class="card-title">${show.name}</h5>
            <p class="card-text">
              <small class="text-muted">Aired: ${show.first_air_date}</small>
            </p>
          </div>
    `;
    document.querySelector("#popular-shows").appendChild(div);
  });
}
// FETCH APIDATA TO API.THEMOVIEDB
async function fetchAPIData(endpoint, query) {
  const API_KEY = global.api.apiKey;
  const API_URL = global.api.apiUrl;
  showSpinner();
  const response = await fetch(
    `${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US&query=${query}`
  );
  const data = await response.json();
  hideSpinner();
  return data;
}

// Highlight Active link
function highlightActiveLink() {
  const links = document.querySelectorAll(".nav-link");
  links.forEach((link) => {
    if (link.getAttribute("href") === global.currentPage) {
      link.classList.add("active");
    }
  });
}

// SHOW SPINNER
function showSpinner() {
  const spin = document.querySelector(".spinner");
  spin.classList.add("show");
}
// HIDE SPINNER
function hideSpinner() {
  const spin = document.querySelector(".spinner");
  spin.classList.remove("show");
}

function init() {
  switch (global.currentPage) {
    case "/":
    case "/index.html":
      displayPopularMovies();
      displayNowPlayingMovies();

      console.log("home");
      break;
    case "/shows.html":
      console.log("Shows");
      displayTVShows();
      break;
    case "/movie-details.html":
      console.log("Movie Details");
      displayMovieDetails();
      break;
    case "/tv-details.html":
      console.log("Tv Details");
      displayTVShowsDetails();
      break;
    case "/search.html":
      console.log("Search");
      search();
      break;
  }
  highlightActiveLink();
}

document.addEventListener("DOMContentLoaded", init);
