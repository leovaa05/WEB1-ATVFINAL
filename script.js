const apiKey = '481f07d4ec894d6d0fab58654528a31d';

const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const resultsContainer = document.getElementById('results-container');

function buscarFilmes() {
  const query = searchInput.value.trim();
  if (!query) {
    alert('Por favor, digite o nome de um filme.');
    return;
  }

  fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=pt-BR&query=${encodeURIComponent(query)}`)
    .then(res => res.json())
    .then(data => {
      if (data.results && data.results.length > 0) {
        mostrarResultados(data.results);
      } else {
        resultsContainer.innerHTML = `<p>Nenhum filme encontrado para "${query}".</p>`;
      }
    })
    .catch(() => {
      resultsContainer.innerHTML = `<p>Erro ao buscar filmes. Tente novamente.</p>`;
    });
}

function mostrarResultados(movies) {
  resultsContainer.innerHTML = movies.map(movie => {
    const poster = movie.poster_path 
      ? `https://image.tmdb.org/t/p/w300${movie.poster_path}` 
      : 'images/no-image.png';

    const releaseYear = movie.release_date ? movie.release_date.split('-')[0] : 'N/A';

    return `
        <div class="movie-card" data-id="${movie.id}" data-title="${movie.title}" data-poster="${poster}">
            <img src="${poster}" alt="${movie.title}" width="150">
            <h3>${movie.title} (${releaseYear})</h3>
        <button class="fav-btn">Favoritar</button>
        </div>
    `;
  }).join('');
}

function adicionarFavorito(movie) {
  let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];

  if (favoritos.find(fav => fav.id === movie.id)) {
    alert('Filme já está nos favoritos!');
    return;
  }

  favoritos.push(movie);
  localStorage.setItem('favoritos', JSON.stringify(favoritos));
  alert(`Filme "${movie.title}" adicionado aos favoritos!`);
}

searchButton.addEventListener('click', buscarFilmes);

resultsContainer.addEventListener('click', (event) => {
  if (event.target.classList.contains('fav-btn')) {
    const movieCard = event.target.closest('.movie-card');
    const movie = {
      id: movieCard.getAttribute('data-id'),
      title: movieCard.getAttribute('data-title'),
      poster: movieCard.getAttribute('data-poster'),
    };

    adicionarFavorito(movie);
  }
});