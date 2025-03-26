const palavras = [
    "LUCRO", "SALDO", "JUROS", "PAGAR", "CUSTO", "METAS", "VERBA", "TAXAS", "POUPE", "TROCO", "BOLSA", "RENDA", "DADOS", "AULAS", "NOTAS", "LIVRO", "GRANA", "BONUS", "CIFRA", "CHEFE", "LUCRA", "CONTA", "BANCO", "PRECO", "CAIXA", "TROCA", "SABER", "FICHA", "REAIS", "LIMPA", "MEDIA", "PLANO", "CERTO", "FALHA", "GRUPO", "PARTE", "FICAR", "GASTO", "CAROS", "CURSO", "DOADO", "ATIVO", "APURO", "DEVER", "ALUNO", "FUNDO", "TRAMA", "JOGAR", "RISCO", "SOMAR", "CAMPO", "PASSO", "COBRO", "GRATO", "TOCAR", "GUIAR", "GANHO", "REPOR", "SERIO", "MARCA", "PACTO", "SOMAR", "PAUTA", "FEIRA", "TENSA", "PLENA", "MUDAR", "SALTO", "CINCO", "TEMAS", "CEDER", "DEIXA", "VAGAR", "TIVER", "CENAR", "PEDIR", "VENDA", "ENFIM", "FASES", "SIGNO", "VERBO", "TOMAR", "CALMO"
];

const indiceAleatorio = Math.floor(Math.random() * palavras.length);
const palavraAleatoria = palavras[indiceAleatorio];
console.log(palavraAleatoria);
let letreco = palavraAleatoria;

const tiles = document.querySelector(".tile-container");
const backspaceAndEnterRow = document.querySelector("#backspaceAndEnterRow");
const keyboardFirstRow = document.querySelector("#keyboardFirstRow");
const keyboardSecondRow = document.querySelector("#keyboardSecondRow");
const keyboardThirdRow = document.querySelector("#keyboardThirdRow");

const keysFirstRow = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"];
const keysSecondRow = ["A", "S", "D", "F", "G", "H", "J", "K", "L"];
const keysThirdRow = ["Z", "X", "C", "V", "B", "N", "M"];
const modalVitoria = document.querySelector(".modal-vitoria");
const modalDerrota = document.querySelector(".modal-derrota");
const textoPalavraCorreta = document.querySelector(".palavra");
let jogoVencido = false;

const rows = 6;
const columns = 5;
let currentRow = 0;
let currentColumn = 0;

// Criando o letrecoMap que irá mapear a letra e a posição correta da palavra
let letrecoMap = {};
for (let index = 0; index < letreco.length; index++) {
  // Para cada letra da palavra aleatória, atribuímos a posição dessa letra
  if (!letrecoMap[letreco[index]]) {
    letrecoMap[letreco[index]] = [];
  }
  letrecoMap[letreco[index]].push(index);
}

const guesses = [];

for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
  guesses[rowIndex] = new Array(columns);
  const tileRow = document.createElement("div");
  tileRow.setAttribute("id", "row" + rowIndex);
  tileRow.setAttribute("class", "tile-row");
  for (let columnIndex = 0; columnIndex < columns; columnIndex++) {
    const tileColumn = document.createElement("div");
    tileColumn.setAttribute("id", "row" + rowIndex + "column" + columnIndex);
    tileColumn.setAttribute(
      "class",
      rowIndex === 0 ? "tile-column typing" : "tile-column disabled"
    );
    tileRow.append(tileColumn);
    guesses[rowIndex][columnIndex] = "";
  }
  tiles.append(tileRow);
}

let tentativas = 0;
let pontuacao = 0;
const tempoInicio = Date.now();

const checkGuess = () => {
  const guess = guesses[currentRow].join("");
  if (guess.length !== columns) {
    return;
  }

  tentativas++;

  var currentColumns = document.querySelectorAll(".typing");
  for (let index = 0; index < columns; index++) {
    const letter = guess[index];
    const keyboardKey = document.getElementById(letter); // Captura o botão do teclado virtual

    if (letrecoMap[letter] === undefined) {
      // Se a letra não está na palavra
      currentColumns[index].classList.add("wrong");
      if (keyboardKey) {
        keyboardKey.style = "border: 1px solid black; color: white; background-color: #2e2b2b;";
        keyboardKey.disabled = true; // Desativa o botão
      }
    } else {
      const correctIndexes = letrecoMap[letter];
      if (correctIndexes.includes(index)) {
        // Se a letra está na posição correta
        currentColumns[index].classList.add("right");
        if (keyboardKey) {
          keyboardKey.style = "background-color: #51b36e; color: white;";
        }
      } else if (correctIndexes.length > 0) {
        // Se a letra está na palavra, mas em posição errada
        currentColumns[index].classList.add("displaced");
        if (keyboardKey) {
          keyboardKey.style = "background-color: #c79c2e; color: white;";
        }
      }
    }
  }



// Adiciona um delay antes de mover para a próxima ação
setTimeout(() => {
  if (guess === letreco) {
    const tempoFinal = (Date.now() - tempoInicio) / 1000;
    pontuacao = Math.max(0, (7 - tentativas) * 60 - tempoFinal * 2);
    if (pontuacao < 30) {
      pontuacao = 30;
    }

    pontuacao = Math.round(pontuacao);
    document.querySelector('.modal-vitoria .tempo').textContent = `Tempo: ${tempoFinal.toFixed(2)} segundos`;
    document.querySelector('.modal-vitoria .pontuacao').textContent = `Pontuação: ${pontuacao}`;

    modalVitoria.style = "display: flex"; // Exibe o modal de vitória

    salvarPontos();
    jogoVencido = true;
  } else {
    if (currentRow === rows - 1) {
      palavraCorreta = letreco;
      textoPalavraCorreta.textContent = `A palavra correta era: ${palavraCorreta}`;

      modalDerrota.style = "display: flex";
    } else {
      moveToNextRow(); // Move para a próxima linha
    }
  }
}, 500);
};


const moveToNextRow = () => {
    var typingColumns = document.querySelectorAll(".typing")
    for (let index = 0; index < typingColumns.length; index++) {
        typingColumns[index].classList.remove("typing")
        typingColumns[index].classList.add("disabled")
    }
    currentRow++
    currentColumn = 0;

    const currentRowEl = document.querySelector("#row" + currentRow);
    var currentColumns = currentRowEl.querySelectorAll(".tile-column");
    for (let index = 0; index < currentColumns.length; index++) {
        currentColumns[index].classList.remove("disabled");
        currentColumns[index].classList.add("typing");
    }
};

const handleKeyboardOnClick = (key) => {
  if (currentColumn === columns) {
    return;
  }
  const currentTile = document.querySelector(
    "#row" + currentRow + "column" + currentColumn
  );
  currentTile.textContent = key;
  guesses[currentRow][currentColumn] = key;
  currentColumn++;
};

const createKeyboardRow = (keys, keyboardRow) => {
  keys.forEach((key) => {
    var buttonElement = document.createElement("button");
    buttonElement.textContent = key;
    buttonElement.setAttribute("id", key);
    buttonElement.addEventListener("click", () => handleKeyboardOnClick(key));
    keyboardRow.append(buttonElement);
  });
};

createKeyboardRow(keysFirstRow, keyboardFirstRow);
createKeyboardRow(keysSecondRow, keyboardSecondRow);
createKeyboardRow(keysThirdRow, keyboardThirdRow);

const handleBackspace = () => {
  if (currentColumn === 0) {
    return;
  }

  currentColumn--;
  guesses[currentRow][currentColumn] = "";
  const tile = document.querySelector("#row" + currentRow + "column" + currentColumn);
  tile.textContent = "";
};

const backspaceButton = document.createElement("button");
backspaceButton.addEventListener("click", handleBackspace);
backspaceButton.textContent = "<";
backspaceAndEnterRow.append(backspaceButton);

const enterButton = document.createElement("button");
enterButton.addEventListener("click", checkGuess);
enterButton.textContent = "ENTER";
backspaceAndEnterRow.append(enterButton);

document.onkeydown = function (evt) {
  evt = evt || window.evt;
  const isAlphabetKey = /^[a-zA-Z]$/.test(evt.key); // Verifica se a tecla pressionada é uma letra

  if (jogoVencido === true) {
    // Impede qualquer ação de tecla quando o jogo for vencido
    if (evt.key === "Enter" || evt.key === "Backspace") {
      evt.preventDefault();
    }
    return; // Impede o restante da execução quando o jogo foi vencido
  }

  if (evt.key === "Enter") {
      checkGuess(); // Verifica a resposta quando Enter é pressionado
  } else if (evt.key === "Backspace") {
      handleBackspace(); // Permite a exclusão de caracteres
  } else if (isAlphabetKey) {
      handleKeyboardOnClick(evt.key.toUpperCase()); // Aceita apenas letras do alfabeto
  }
};

const modalRanking = document.querySelector('.ranking-container');

document.getElementById('voltar').addEventListener('click', function () { 
  window.location.href = '?page=minigames';
});

document.getElementById('ranking').addEventListener('click', function () {
  

  fetch('../Paginas/consultas/ranking.php')
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

  modalRanking.style = 'display: flex';  // Mostra o modal com estilo 'flex'
});

document.getElementById('fechar-ranking').addEventListener('click', function () {
  modalRanking.style = 'display: none';  // Oculta o modal com estilo 'none'
});

document.getElementById('jogar-novamente').addEventListener('click', function () {
  modalVitoria.style = 'display: none';  // Oculta o modal com estilo 'none'
  location.reload();
});

document.getElementById('jogar-novamente-derrota').addEventListener('click', function () {
  modalDerrota.style = 'display: none';  // Oculta o modal com estilo 'none'
  location.reload();
});

function salvarPontos() {
  fetch('../Paginas/configs/salvar-pontos.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ pontuacao: pontuacao, id_minigame: 1, moedas_ganhas: (pontuacao / 10).toFixed(0) })
  })
  .then(response => response.json())
  .then(data => {})
  .catch(error => console.error('Erro:', error));
}







