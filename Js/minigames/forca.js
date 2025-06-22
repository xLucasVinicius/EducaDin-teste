const imgForca = document.querySelector("#imagem-forca"); // Imagem da forca
const backspaceAndEnterRow = document.querySelector("#backspaceAndEnterRow"); // linha dos botões backspace e enter
const keyboardFirstRow = document.querySelector("#keyboardFirstRow"); // primeira linha da teclado
const keyboardSecondRow = document.querySelector("#keyboardSecondRow"); // segunda linha da teclado
const keyboardThirdRow = document.querySelector("#keyboardThirdRow"); // terceira linha da teclado
const keysFirstRow = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"]; // Array com as letras da primeira linha
const keysSecondRow = ["A", "S", "D", "F", "G", "H", "J", "K", "L"]; // Array com as letras da segunda linha
const keysThirdRow = ["Z", "X", "C", "V", "B", "N", "M"]; // Array com as letras da terceira linha
const palavras = ["educacao", "financas", "orcamento", "economia", "poupanca", "investimento", "controle", "disciplina", "organizacao", "planejamento", "metas", "carteira", "salario", "despesa", "receita", "debito", "credito", "juros", "divida", "lucro", "prejuizo", "banco", "extrato", "rendimento", "planilha", "aplicativo", "gestao", "cartao", "cofrinho", "moeda", "nota", "conta", "digital", "financeiro", "responsabilidade", "sabedoria", "decisao", "analise", "perfil", "usuario", "aprendizado", "conhecimento", "liberdade", "seguranca", "futuro", "renda", "passivo", "ativo", "estrategia", "gasto", "foco", "escolha", "inteligencia", "minigame", "desafio", "progresso", "evolucao", "conquista", "saldo", "simulador", "objetivo", "jornada", "desenvolvimento", "pratica", "eficiencia", "urgencia", "necessidade", "consumo", "infancia", "juventude", "adulto", "aposentadoria", "freelancer", "digitalizacao", "comportamento", "recompensa", "estabilidade", "superavit", "inadimplencia", "boletos", "taxa", "cpf", "iof", "fixo", "variavel", "grafico", "metrica", "estatistica", "investidor", "educador", "consumidor", "mercado", "valores", "bens", "servicos", "pagamento", "divisao", "prioridade", "objetividade", "faturamento"];
let palavraEscolhida;
let exibicaoPalavra;
let tentativasRestantes;
let numeroErros;
let tempoDeJogo = 0;
let cronometro;
let pontuacao = 0;

const createKeyboardRow = (keys, keyboardRow) => {
  keys.forEach((key) => {
    var buttonElement = document.createElement("button");
    buttonElement.textContent = key;
    buttonElement.setAttribute("id", key);
    buttonElement.addEventListener("click", () => chutarLetra(key));
    keyboardRow.append(buttonElement);
  });
};

// Cria as linhas do teclado
createKeyboardRow(keysFirstRow, keyboardFirstRow);
createKeyboardRow(keysSecondRow, keyboardSecondRow);
createKeyboardRow(keysThirdRow, keyboardThirdRow);

function iniciarJogo() {
    palavraEscolhida = palavras[Math.floor(Math.random() * palavras.length)];
    exibicaoPalavra = Array(palavraEscolhida.length).fill("_");
    tentativasRestantes = 5;
    numeroErros = 0;
    tempoDeJogo = 0;
    pontuacao = 0;

    // Inicia o cronômetro
    cronometro = setInterval(() => {
        tempoDeJogo++;
    }, 1000);

    atualizarExibicao();
}

function atualizarExibicao() {
  const exibirPalavra = document.getElementById("exibicao-palavra");
  exibirPalavra.textContent = exibicaoPalavra.join(" ");
  document.getElementById("imagem-forca").src = `../imagens/minigames/forca${numeroErros}.png`;

  if (tentativasRestantes === 0) {
    clearInterval(cronometro);
    setTimeout(() => {
        encerrarJogo(palavraEscolhida);
    }, 2000);
  } else if (exibicaoPalavra.every((letra) => letra !== "_")) {
    clearInterval(cronometro);
    setTimeout(() => {
        VitoriaJogo();
    }, 1000);
  }
}

function encerrarJogo(palavraEscolhida) {
    document.getElementById("modalDerrota").style.display = "flex";
    document.getElementById("palavra").textContent = palavraEscolhida;
}

function VitoriaJogo() {
    // Calcula a pontuação final
    pontuacao = (tentativasRestantes * 10) + (palavraEscolhida.length * 5) + Math.max(0, 100 - tempoDeJogo);

    salvarPontos();

    document.getElementById("modalVitoria").style.display = "flex";
    document.querySelector(".tempo").textContent = "Tempo: " + tempoDeJogo + "s";

    // Opcional: mostrar pontuação
    const pontuacaoElemento = document.querySelector(".pontuacao");
    if (pontuacaoElemento) {
        pontuacaoElemento.textContent = pontuacao + " pontos";
    }
}

function chutarLetra(letra) {
    letra = letra.toLowerCase();
    if (tentativasRestantes > 0) {
        if (palavraEscolhida.includes(letra)) {
            for (let i = 0; i < palavraEscolhida.length; i++) {
                if (palavraEscolhida[i] === letra) {
                    exibicaoPalavra[i] = letra;
                }
            }
            letra = letra.toUpperCase();
            const botao = document.getElementById(letra);
            botao.disabled = true;
            botao.style = "border-color: rgb(0, 255, 0); color:rgb(0, 255, 0);";
        } else {
            letra = letra.toUpperCase();
            const botao = document.getElementById(letra);
            botao.disabled = true;
            botao.style = "border-color: rgb(88, 88, 88); color:rgb(88, 88, 88);";

            tentativasRestantes--;
            document.getElementById("barra-progresso").style.width = `${(tentativasRestantes / 5) * 100}%`;

            numeroErros++;
        }
        atualizarExibicao();
    }
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

document.addEventListener("keydown", (event) => {
    chutarLetra(event.key.toLowerCase());
});

document.getElementById("btnReiniciar").addEventListener("click", () => {
    location.reload();
});

document.getElementById("btnReiniciarPerdeu").addEventListener("click", () => {
    location.reload();
});

iniciarJogo();
