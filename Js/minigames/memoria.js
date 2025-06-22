const painel = document.getElementById('painel');
const info = document.getElementById('info');
const barraTempo = document.getElementById('barra-tempo');

let timer, inicioTempo, tempoLimite;
let primeiroCard = null;
let painelBloqueado = false;
let paresCombinados = 0;
let tempoFinal = 0;
let pontuacao = 0;

function startGame(count) {
    clearInterval(timer);
    primeiroCard = null;
    painelBloqueado = false;
    paresCombinados = 0;
    painel.innerHTML = '';
    painel.style.gridTemplateColumns = `repeat(${Math.sqrt(count * 2)}, 1fr)`;

    let values = [];
    for (let i = 0; i < count; i++) values.push(i, i);
    values.sort(() => 0.5 - Math.random());

    values.forEach(val => {
        const card = document.createElement('div');
        const conteudoCard = document.createElement('span');
        card.className = 'card';
        card.dataset.value = val;
        card.appendChild(conteudoCard);
        conteudoCard.textContent = val;
        card.onclick = () => flipCard(card);
        painel.appendChild(card);
    });

    inicioTempo = Date.now();
    tempoLimite = count * 4000;
    timer = setInterval(updateTimer, 100);
}

function updateTimer() {
    const elapsed = Date.now() - inicioTempo;
    const progress = Math.min(1, elapsed / tempoLimite);
    barraTempo.style.width = `${progress * 100}%`;
    if (progress >= 1) {
        clearInterval(timer);
        document.getElementById('modalDerrota').style.display = 'flex';
    }
}

function flipCard(card) {
    if (painelBloqueado || card.classList.contains('flipped') || card.classList.contains('matched')) return;
    card.classList.add('flipped');

    if (!primeiroCard) {
        primeiroCard = card;
    } else {
        painelBloqueado = true;
        if (primeiroCard.dataset.value === card.dataset.value) {
            primeiroCard.classList.add('matched');
            card.classList.add('matched');
            paresCombinados++;
            if (paresCombinados * 2 === painel.children.length) {
                clearInterval(timer);
                tempoFinal = Date.now() - inicioTempo;

                const tempoRestante = tempoLimite - tempoFinal;
                const fatorDificuldade = painel.children.length / 2 * 35;
                pontuacao = Math.round((tempoRestante / tempoLimite) * fatorDificuldade);

                // Exibir no modal
                document.querySelector('#modalVitoria .tempo').textContent = `Tempo: ${(tempoFinal / 1000).toFixed(1)}s`;
                document.querySelector('#modalVitoria .pontuacao').textContent = `Pontuação: ${pontuacao} pontos`;
                document.getElementById('modalVitoria').style.display = 'flex';

                salvarPontos();
            }
            resetTurn();
        } else {
            setTimeout(() => {
                primeiroCard.classList.remove('flipped');
                card.classList.remove('flipped');
                resetTurn();
            }, 400);
        }
    }
}

function resetTurn() {
    primeiroCard = null;
    painelBloqueado = false;
}

function salvarPontos() {
    const miniGame = document.getElementById('minigame');
    const idMinigame = miniGame.dataset;

    fetch('../Paginas/configs/salvar-pontos.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            pontuacao: pontuacao,
            id_minigame: idMinigame.idMg,
            moedas_ganhas: (pontuacao / 10).toFixed(0)
        })
    })
    .then(response => response.json())
    .catch(error => console.error('Erro:', error));
}

document.getElementById("btnReiniciar").addEventListener("click", () => {
    location.reload();
});

document.getElementById("btnReiniciarPerdeu").addEventListener("click", () => {
    location.reload();
});
