const resenhasContainer = document.getElementById('resenhas-container');

function carregarResenhas() {
  let resenhas = JSON.parse(localStorage.getItem('resenhas')) || [];

  if (resenhas.length === 0) {
    resenhasContainer.innerHTML = '<p>Você ainda não escreveu nenhuma resenha.</p>';
    return;
  }

  resenhas.sort((a,b) => new Date(b.data) - new Date(a.data));

  resenhasContainer.innerHTML = resenhas.map(resenha => `
    <div class="resenha-card" data-id="${resenha.id}">
      <h3>${resenha.title}</h3>
      <p><strong>Nota:</strong> ${resenha.nota.toFixed(1)} / 10</p>
      <p>${resenha.texto}</p>
      <button class="remover-resenha-btn" data-id="${resenha.id}">Remover Resenha</button>
    </div>
  `).join('');
}

resenhasContainer.addEventListener('click', (event) => {
  if (event.target.classList.contains('remover-resenha-btn')) {
    const id = event.target.dataset.id;
    removerResenha(id);
  }
});

function removerResenha(id) {
  let resenhas = JSON.parse(localStorage.getItem('resenhas')) || [];

  resenhas = resenhas.filter(resenha => String(resenha.id) !== String(id));

  localStorage.setItem('resenhas', JSON.stringify(resenhas));

  carregarResenhas();
}

carregarResenhas();