const modalRanking = document.querySelector('.ranking-container'); // Modal de ranking de pontuaçõo

// Evento de clique no botão "Voltar", retornando para a tela de minigames
document.getElementById('voltar').addEventListener('click', function () { 
    window.location.href = '?page=minigames';
  });
  
  document.getElementById('ranking').addEventListener('click', function () {
    const minigame = document.getElementById('minigame');
    const idMinigame = minigame.dataset;
  
    // Envia uma solicitação POST para o arquivo PHP para obter o ranking de pontuaçõo
    fetch('../Paginas/consultas/ranking.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({id_minigame: idMinigame.idMg})
    })
      .then(response => response.json())
      .then(data => {
        // Verifica se há dados de ranking na resposta
        if (data.ranking && data.ranking.length > 0) {
          const rankingList = document.querySelector('.ranking');
          rankingList.innerHTML = '';  // Limpa o conteúdo anterior, se houver
  
          // Itera sobre os dados do ranking e cria os elementos para exibição
          data.ranking.forEach((item, index) => {
            const rankingItem = document.createElement('div');
            rankingItem.classList.add('ranking-item');  // Adiciona uma classe para estilo
  
            let positionContent;  // Variável para armazenar o conteúdo da posição (medalha ou número)
  
            // Lógica para exibir medalhas ou o número da colocação
            if (index === 0) {
              positionContent = '<i class="bi bi-award" style="color: gold;"></i>';
            } else if (index === 1) {
              positionContent = '<i class="bi bi-award" style="color: silver;"></i>';
            } else if (index === 2) {
              positionContent = '<i class="bi bi-award" style="color: #cd7f32;"></i>';
            } else if (index < 9) {
              positionContent = `<span class="ranking-position">0${index + 1}</span>`;
            } else {
              positionContent = `<span class="ranking-position">${index + 1}</span>`;
            }
  
            // Conteúdo do ranking - posição (medalha ou número), nome e pontuação
            rankingItem.innerHTML = `
              ${positionContent}  <!-- Exibe a medalha ou a posição numérica -->
              <span>
                <span class="foto-perfil"><img src="${item.foto_perfil}" alt="Foto de Perfil"></span>
                <span class="ranking-nome">${item.nome} ${item.sobrenome}</span> <!-- Nome do jogador -->
                <span class="ranking-pontos">${item.recorde_pontos} pontos</span> <!-- Pontuação -->
              </span>
            `;
  
            // Adiciona o item ao rankingList
            rankingList.appendChild(rankingItem);
          });
        } else {
          const rankingList = document.querySelector('.ranking');
          rankingList.innerHTML = '<p>Nenhum recorde encontrado.</p>';  // Caso não haja ranking
        }
      })
      .catch(error => console.error('Erro:', error));
  
    modalRanking.style = 'display: flex';  // Mostra o modal de ranking
  });
  
  // Evento para fechar o modal de ranking quando clicar no botão
  document.getElementById('fechar-ranking').addEventListener('click', function () {
    modalRanking.style = 'display: none';
  });