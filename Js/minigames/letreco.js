// Palavras para o jogo
const palavras = [
    "LUCRO", "SALDO", "JUROS", "PAGAR", "CUSTO", "METAS", "VERBA", "TAXAS", "POUPE", "TROCO", "BOLSA", "RENDA", "DADOS", "AULAS", "NOTAS", "LIVRO", "GRANA", "BONUS", "CIFRA", "CHEFE", "LUCRA", "CONTA", "BANCO", "PRECO", "CAIXA", "TROCA", "SABER", "REAIS", "MEDIA", "PLANO", "FALHA", "GRUPO", "PARTE", "GASTO", "CAROS", "CURSO", "DOADO", "ATIVO", "APURO", "FUNDO", "JOGAR", "RISCO", "SOMAR", "CAMPO", "PASSO", "COBRO", "GRATO", "GUIAR", "GANHO", "REPOR", "SERIO", "MARCA", "SOMAR", "PAUTA", "FEIRA", "PLENA", "MUDAR", "SALTO", "CINCO", "TEMAS", "CEDER", "PEDIR", "VENDA", "FASES", "VERBO", "TOMAR", "CALMO", "DOLAR", "PESOS", "EUROS", "DINAR", "RIYAL", "LIBRA", "BAZAR", "MENTE", "TEXTO", "PRAZO", "VALOR", "MESES", "ACOES", "POBRE"
];

const indiceAleatorio = Math.floor(Math.random() * palavras.length); // Cria um número aleatório com base nas palavras existentes
const palavraAleatoria = palavras[indiceAleatorio]; // Seleciona a palavra aleatória
const tiles = document.querySelector(".tile-container"); // área de digitação do letreco
const backspaceAndEnterRow = document.querySelector("#backspaceAndEnterRow"); // linha dos botões backspace e enter
const keyboardFirstRow = document.querySelector("#keyboardFirstRow"); // primeira linha da teclado
const keyboardSecondRow = document.querySelector("#keyboardSecondRow"); // segunda linha da teclado
const keyboardThirdRow = document.querySelector("#keyboardThirdRow"); // terceira linha da teclado
const keysFirstRow = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"]; // Array com as letras da primeira linha
const keysSecondRow = ["A", "S", "D", "F", "G", "H", "J", "K", "L"]; // Array com as letras da segunda linha
const keysThirdRow = ["Z", "X", "C", "V", "B", "N", "M"]; // Array com as letras da terceira linha
const modalVitoria = document.querySelector(".modal-vitoria"); // Modal de vitoria
const modalDerrota = document.querySelector(".modal-derrota"); // Modal de derrota
const textoPalavraCorreta = document.querySelector(".palavra"); //Armazena a palavra correta para exibição no modal de derrota
const rows = 6; // Quantidade de tentativas do jogador
const columns = 5; // Quantidade de caracteres da palavra
const guesses = []; // Matriz para armazenar as tentativas
const tempoInicio = Date.now(); // Tempo de inicio do jogo
let jogoVencido = false; // Variável que verifica se o jogo foi vencido
let letreco = palavraAleatoria; // Armazena a palavra aleatória
let currentRow = 0; // Linha atual
let currentColumn = 0; // Coluna atual
let tentativas = 0; // Contador de tentativas
let pontuacao = 0; // Contador de pontos

// Criando o letrecoMap que irá mapear as letras e a posição correta na palavra
let letrecoMap = {};
// Para cada letra da palavra
for (let index = 0; index < letreco.length; index++) {
  if (!letrecoMap[letreco[index]]) { // Se a letra ainda não foi mapeada
    letrecoMap[letreco[index]] = []; // Cria um array para armazenar as posicoes
  }
  letrecoMap[letreco[index]].push(index); // Adiciona a posicao na palavra
}

// Cria as linhas do letreco
for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
  guesses[rowIndex] = new Array(columns); // Cria um array para armazenar as tentativas
  const tileRow = document.createElement("div"); // Cria uma nova linha
  tileRow.setAttribute("id", "row" + rowIndex); // Define o id da linha
  tileRow.setAttribute("class", "tile-row"); // Define a classe da linha
  for (let columnIndex = 0; columnIndex < columns; columnIndex++) { // Para cada coluna
    const tileColumn = document.createElement("div"); // Cria uma nova coluna
    tileColumn.setAttribute("id", "row" + rowIndex + "column" + columnIndex); // Define o id da coluna
    // Define a classe da coluna
    tileColumn.setAttribute(
      "class",
      rowIndex === 0 ? "tile-column typing" : "tile-column disabled" 
    );
    tileRow.append(tileColumn); // Adiciona a coluna na linha
    guesses[rowIndex][columnIndex] = ""; // Inicializa a tentativa
  }
  tiles.append(tileRow); // Adiciona a linha na area de digitação
}


// Função para verificar a palavra
const checkGuess = () => {
  const guess = guesses[currentRow].join(""); // Junta as letras digitadas em uma string
  if (guess.length !== columns) { // Verifica se a palavra digitada tem a quantidade correta de letras
    return;
  }

  tentativas++; // Incrementa o contador de tentativas

  var currentColumns = document.querySelectorAll(".typing"); // Seleciona todas as colunas da linha atual
  for (let index = 0; index < columns; index++) { // Para cada letra da palavra
    const letter = guess[index]; // Armazena a letra
    const keyboardKey = document.getElementById(letter); // Captura o botão do teclado virtual

    if (letrecoMap[letter] === undefined) { // Se a letra não está na palavra
      currentColumns[index].classList.add("wrong"); // Adiciona a classe "wrong" (errado)
      if (keyboardKey) { // Se o botão do teclado virtual foi encontrado
        keyboardKey.style = "border: 1px solid black; color: white; background-color: #2e2b2b;"; // Define o estilo
        keyboardKey.disabled = true; // Desativa o botão
      }
    } else {
      const correctIndexes = letrecoMap[letter]; // Armazena as posicoes da letra
      if (correctIndexes.includes(index)) { // Verifica se a letra esta na posicao correta
        currentColumns[index].classList.add("right"); // Adiciona a classe "right" (acertou)
        if (keyboardKey) { // Se o botão do teclado virtual foi encontrado
          keyboardKey.style = "background-color: #51b36e; color: white;"; // Define o estilo
        }
      } else if (correctIndexes.length > 0) { // Verifica se a letra nao esta na posicao correta
        currentColumns[index].classList.add("displaced"); // Adiciona a classe "displaced" (deslocada)
        if (keyboardKey) {
          keyboardKey.style = "background-color: #c79c2e; color: white;"; // Define o estilo
        }
      }
    }
  }

// Adiciona um delay antes de mover para a próxima ação
setTimeout(() => {
  if (guess === letreco) { // Se o jogador acertou a palavra
    const tempoFinal = (Date.now() - tempoInicio) / 1000; // Calcula o tempo de jogo
    pontuacao = Math.max(0, (7 - tentativas) * 60 - tempoFinal * 2); // Calcula a pontuação
    if (pontuacao < 30) { // Se a pontuação for menor que 30
      pontuacao = 30; // Define a pontuação minima como 30
    }

    pontuacao = Math.round(pontuacao); // Arredonda a pontuação
    document.querySelector('.modal-vitoria .tempo').textContent = `Tempo: ${tempoFinal.toFixed(2)} segundos`; // Exibe o tempo de jogo
    document.querySelector('.modal-vitoria .pontuacao').textContent = `Pontuação: ${pontuacao}`; // Exibe a pontuação final

    modalVitoria.style = "display: flex"; // Exibe o modal de vitória

    salvarPontos(); // Salva a pontuação
    jogoVencido = true; // Define o jogo como vencido
  } else {
    if (currentRow === rows - 1) { // Se o jogador chegou ao fim das tentativas
      palavraCorreta = letreco; // Armazena a palavra correta
      textoPalavraCorreta.textContent = `A palavra correta era: ${palavraCorreta}`; // Exibe a palavra correta

      modalDerrota.style = "display: flex"; // Exibe o modal de derrota
    } else {
      moveToNextRow(); // Move para a próxima linha
    }
  }
}, 500);
};

// Função para mover para a próxima linha ao verificar a palavra
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

// Função para lidar com o clique no teclado
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

// Função para criar as linhas do teclado
const createKeyboardRow = (keys, keyboardRow) => {
  keys.forEach((key) => {
    var buttonElement = document.createElement("button");
    buttonElement.textContent = key;
    buttonElement.setAttribute("id", key);
    buttonElement.addEventListener("click", () => handleKeyboardOnClick(key));
    keyboardRow.append(buttonElement);
  });
};

// Cria as linhas do teclado
createKeyboardRow(keysFirstRow, keyboardFirstRow);
createKeyboardRow(keysSecondRow, keyboardSecondRow);
createKeyboardRow(keysThirdRow, keyboardThirdRow);

// Função para adicionar o botão de backspace no teclado
const handleBackspace = () => {
  if (currentColumn === 0) {
    return;
  }

  currentColumn--;
  guesses[currentRow][currentColumn] = "";
  const tile = document.querySelector("#row" + currentRow + "column" + currentColumn);
  tile.textContent = "";
};

// Adiciona o botão de backspace no teclado
const backspaceButton = document.createElement("button"); // Botão de backspace
backspaceButton.addEventListener("click", handleBackspace);
backspaceButton.textContent = "<";
backspaceAndEnterRow.append(backspaceButton);

// Adiciona o botão de enter no teclado
const enterButton = document.createElement("button"); // Botão de enter
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

// Evento para fechar o modal de vitoria quando clicar no botão
document.getElementById('jogar-novamente').addEventListener('click', function () {
  modalVitoria.style = 'display: none';
  location.reload();
});

// Evento para fechar o modal de derrota quando clicar no botão
document.getElementById('jogar-novamente-derrota').addEventListener('click', function () {
  modalDerrota.style = 'display: none';
  location.reload();
});

// Função para salvar a pontuação no banco de dados
function salvarPontos() {
  const miniGame = document.getElementById('minigame');
  const idMinigame = miniGame.dataset;
  fetch('../Paginas/configs/salvar-pontos.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ pontuacao: pontuacao, id_minigame: idMinigame.idMg, moedas_ganhas: (pontuacao / 10).toFixed(0) })
  })
  .then(response => response.json())
  .then(data => {})
  .catch(error => console.error('Erro:', error));
}







