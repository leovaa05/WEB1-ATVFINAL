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
      <div class="movie-card" 
           data-id="${movie.id}" 
           data-title="${movie.title}" 
           data-poster="${poster}">
        <img src="${poster}" alt="${movie.title}">
        <h3>${movie.title} (${releaseYear})</h3>
        <button class="fav-btn" data-id="${movie.id}">Favoritar</button>
        <button class="review-btn" data-id="${movie.id}">Resenhar</button>        
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

const body = document.querySelector('body');

function criarModalResenha(movieId, movieTitle) {
  const modalBg = document.createElement('div');
  modalBg.id = 'modal-bg';
  modalBg.style = `
    position: fixed;
    top:0; left:0; right:0; bottom:0;
    background: rgba(0,0,0,0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
  `;

  const modalContent = document.createElement('div');
  modalContent.style = `
    background: #222;
    padding: 20px;
    border-radius: 8px;
    max-width: 400px;
    width: 90%;
    color: #eee;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  `;

  modalContent.innerHTML = `
    <h2>Resenhar: ${movieTitle}</h2>
    <form id="form-resenha">
      <label for="nota">Nota (0 a 10):</label><br>
      <input type="number" id="nota" name="nota" min="0" max="10" step="0.1" required style="width: 100%; padding: 8px; margin-bottom: 10px; border-radius: 4px; border: none;"><br>

      <label for="textoResenha">Sua Resenha:</label><br>
      <textarea id="textoResenha" name="textoResenha" rows="5" required style="width: 100%; padding: 8px; margin-bottom: 10px; border-radius: 4px; border: none; resize: vertical;"></textarea><br>

      <button type="submit" style="background:#e67e22; color:#fff; padding: 10px 15px; border:none; border-radius: 4px; cursor:pointer; font-weight:700;">Enviar Resenha</button>
      <button type="button" id="fechar-modal" style="background:#555; color:#fff; padding: 10px 15px; border:none; border-radius: 4px; cursor:pointer; font-weight:700; margin-left: 10px;">Cancelar</button>
    </form>
  `;

  modalBg.appendChild(modalContent);
  body.appendChild(modalBg);

  document.getElementById('fechar-modal').addEventListener('click', () => {
    body.removeChild(modalBg);
  });

  document.getElementById('form-resenha').addEventListener('submit', (e) => {
    e.preventDefault();

    const nota = parseFloat(document.getElementById('nota').value);
    const textoResenha = document.getElementById('textoResenha').value.trim();

    if (nota < 0 || nota > 10) {
      alert('Por favor, digite uma nota entre 0 e 10.');
      return;
    }
    if (!textoResenha) {
      alert('Por favor, escreva sua resenha.');
      return;
    }

    const movieCard = document.querySelector(`.movie-card[data-id="${movieId}"]`);
    const poster = movieCard ? movieCard.querySelector('img').src : 'images/no-image.png';

    salvarResenha(movieId, movieTitle, nota, textoResenha, poster);

    alert('Resenha enviada com sucesso!');
    body.removeChild(modalBg);
  });
}

function salvarResenha(id, title, nota, texto, poster) {
  let resenhas = JSON.parse(localStorage.getItem('resenhas')) || [];
  
  resenhas.push({
    id,
    title,
    nota,
    texto,
    poster,
    data: new Date().toISOString()
  });

  localStorage.setItem('resenhas', JSON.stringify(resenhas));
}

resultsContainer.addEventListener('click', (event) => {
  if (event.target.classList.contains('review-btn')) {
    const movieCard = event.target.closest('.movie-card');
    const movieId = event.target.dataset.id;
    const movieTitle = movieCard.querySelector('h3').innerText.split(' (')[0];

    criarModalResenha(movieId, movieTitle);
  }
});