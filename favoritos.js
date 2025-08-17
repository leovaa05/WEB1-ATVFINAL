const favoritosContainer = document.getElementById('favoritos-container');

function carregarFavoritos() {
    let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];

  favoritos = favoritos.filter(fav => fav && fav.id && fav.title && fav.poster);

  if (favoritos.length === 0) {
    favoritosContainer.innerHTML = '<p>Você ainda não adicionou nenhum filme aos favoritos.</p>';
    return;
  }

  favoritosContainer.innerHTML = favoritos.map(fav => `
    <div class="movie-card" data-id="${fav.id}">
      <img src="${fav.poster}" alt="${fav.title}" width="150" />
      <h3>${fav.title}</h3>
      <button class="remover-btn" data-id="${fav.id}">Remover dos favoritos</button>
    </div>
  `).join('');
}

favoritosContainer.addEventListener('click', (event) => {
  if(event.target.classList.contains('remover-btn')){
    const id = event.target.dataset.id;
    removerFavorito(id);
  }
});

function removerFavorito(id) {
  let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
  favoritos = favoritos.filter(fav => String(fav.id) !== String(id));
  localStorage.setItem('favoritos', JSON.stringify(favoritos));
  carregarFavoritos();
}

carregarFavoritos();