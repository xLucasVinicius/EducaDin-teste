<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Snake Game</title>
    <link rel="stylesheet" href="../Style/minigames/snake.css">
    <link rel="stylesheet" href="../Style/globais/ranking-minigames.css">
</head>
<body>
    <section class="game-container">
        <div class="game">
            <div class="botoes-navegar">
                <i class="bi bi-arrow-left-circle" id="voltar" title="Voltar"></i>
                <i class="bi bi-trophy" id="ranking" title="Ranking"></i>
            </div>
            <div class="ranking-container">
                <div class="placar-ranking">
                    <i class="bi bi-x-circle" id="fechar-ranking"></i>
                    <h1>Ranking</h1>
                    <div class="ranking"></div>
                </div>
            </div>
            <div class="score">
                Pontos:
                <span class="score-value">00</span>
            </div>
            <div class="menu-screen">
                <span class="game-over">game over</span>
                <span class="final-score">
                Pontos:
                <span>00</span>
                </span>
                <span class="final-coins">
                    Moedas Ganhas:
                    <span>00</span>
                </span>
                <button class="play-again">
                    <i class="bi bi-play-fill"></i>
                </button>
            </div>
            <canvas width="600" height="600" id="minigame" data-id-mg="2"></canvas>
            <div class="btns-movimentar">
                <span class="btn-movimento"><i class="bi bi-arrow-up" id="up"></i></span>
                <span class="btn-movimento-lateral">
                    <span class="btn-movimento"><i class="bi bi-arrow-left" id="left"></i></span>
                    <span class="btn-movimento"><i class="bi bi-arrow-right" id="right"></i></span>
                </span>
                <span class="btn-movimento"><i class="bi bi-arrow-down" id="down"></i></span>
            </div>
        </div>
    </section>


    <script src="../Js/minigames/snake.js"></script>
    <script src="../Js/minigames/ranking.js"></script>
</body>
</html>