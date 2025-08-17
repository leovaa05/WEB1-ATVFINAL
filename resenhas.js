const resenhasContainer = document.getElementById('resenhas-container');

function carregarResenhas() {
  const resenhas = JSON.parse(localStorage.getItem('resenhas')) || [];

  if (resenhas.length === 0) {
    resenhasContainer.innerHTML = '<p>Você ainda não escreveu nenhuma resenha.</p>';
    return;
  }

  resenhasContainer.innerHTML = resenhas.map(resenha => {
    const dataFormatada = new Date(resenha.data).toLocaleString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });

    return `
      <div class="resenha-card" data-id="${resenha.id}">
        <img class="resenha-poster" src="${resenha.poster || 'images/no-image.png'}" alt="Poster de ${resenha.title}" />
        <div class="resenha-content">
          <h3>${resenha.title}</h3>
          <div class="resenha-info">Avaliação: <strong>${resenha.nota}</strong> - ${dataFormatada}</div>
          <p class="resenha-texto">${resenha.texto}</p>
          <button class="remover-resenha-btn" data-id="${resenha.id}">Remover resenha</button>
        </div>
      </div>
    `;
  }).join('');
}

resenhasContainer.addEventListener('click', (event) => {
  if (event.target.classList.contains('remover-resenha-btn')) {
    const id = event.target.dataset.id;
    removerResenha(id);
  }
});

function removerResenha(id) {
  let resenhas = JSON.parse(localStorage.getItem('resenhas')) || [];

  resenhas = resenhas.filter(res => res.id !== id);

  localStorage.setItem('resenhas', JSON.stringify(resenhas));

  carregarResenhas();
}

carregarResenhas();