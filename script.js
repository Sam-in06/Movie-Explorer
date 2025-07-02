const apiKey = "65050a16";
const popularMovies = [
  "tt3896198", // Guardians of the Galaxy Vol. 2
  "tt0111161", // The Shawshank Redemption
  "tt4154796", // Avengers: Endgame
  "tt1375666", // Inception
  "tt0133093", // The Matrix
  "tt0120737", // The Lord of the Rings
];


async function fetchMovieById(id) {
  const res = await fetch(`https://www.omdbapi.com/?i=${id}&apikey=${apiKey}`);
  return await res.json();
}


async function fetchMovieByTitle(title) {
  const res = await fetch(`https://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${apiKey}`);
  return await res.json();
}


async function loadHomeMovies() {
  const movieListDiv = document.getElementById("movieList");
  const movieDetailsDiv = document.getElementById("movieDetails");
  const backHomeBtn = document.getElementById("backHome");

  backHomeBtn.classList.add("hidden");
  movieDetailsDiv.innerHTML = "";
  movieListDiv.classList.remove("hidden");
  movieListDiv.innerHTML = "";

 
  const moviesData = await Promise.all(popularMovies.map(id => fetchMovieById(id)));

  moviesData.forEach(data => {
    if (data && data.Response !== "False") {
      const card = document.createElement("div");
      card.className = "movie-card";
      card.onclick = () => showMovieDetails(data, true);

      card.innerHTML = `
        <img src="${data.Poster !== "N/A" ? data.Poster : ""}" alt="${data.Title}" />
        <div class="title">${data.Title}</div>
        <div class="short-plot">${truncateText(data.Plot, 100)}</div>
      `;

      movieListDiv.appendChild(card);
    }
  });
}


function showMovieDetails(data, showBackBtn = true) {
  const detailsDiv = document.getElementById("movieDetails");
  const movieListDiv = document.getElementById("movieList");
  const backHomeBtn = document.getElementById("backHome");

  movieListDiv.classList.add("hidden");
  detailsDiv.innerHTML = `
    <img src="${data.Poster !== "N/A" ? data.Poster : ""}" alt="${data.Title} Poster"/>
    <div>
      <h2>${data.Title} (${data.Year})</h2>
      <p><strong>Genre:</strong> ${data.Genre}</p>
      <p><strong>Plot:</strong> ${data.Plot}</p>
      <p><strong>Director:</strong> ${data.Director}</p>
      <p><strong>Actors:</strong> ${data.Actors}</p>
      <p><strong>IMDB Rating:</strong> ${data.imdbRating}</p>
    </div>
    <div style="clear: both;"></div>
  `;

  if (showBackBtn) {
    backHomeBtn.classList.remove("hidden");
  } else {
    backHomeBtn.classList.add("hidden");
  }
}

async function searchMovie() {
  const input = document.getElementById("searchInput").value.trim();
  const detailsDiv = document.getElementById("movieDetails");
  const backHomeBtn = document.getElementById("backHome");

  if (!input) {
    detailsDiv.innerHTML = "<p>Please enter a movie title.</p>";
    return;
  }

  try {
    const data = await fetchMovieByTitle(input);

    if (data.Response === "False") {
      detailsDiv.innerHTML = `<p>${data.Error}</p>`;
      backHomeBtn.classList.remove("hidden");
      return;
    }

    showMovieDetails(data, true);
  } catch (error) {
    detailsDiv.innerHTML = "<p>Failed to fetch movie data.</p>";
    console.error(error);
  }
}

function backToHome() {
  loadHomeMovies();
  document.getElementById("searchInput").value = "";
}


function truncateText(text, maxLength) {
  if (!text) return "";
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
}

document.getElementById("searchInput").addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    searchMovie();
  }
});

window.onload = loadHomeMovies;



