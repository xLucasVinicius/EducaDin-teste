<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../Style/minigames/letreco.css">
    <link rel="stylesheet" href="../Style/globais/ranking-minigames.css">
</head>
<body>
    <section class="conteudo-letreco">
        <div class="modal-vitoria">
            <div class="vitoria">
                <h1>Vitória!</h1>
                <p>Você descobriu a palavra!</p>
                <p class="tempo"></p>
                <p class="pontuacao"></p>
                <button id="jogar-novamente">Jogar Novamente</button>
            </div>
        </div>
        <div class="modal-derrota">
            <div class="derrota">
                <h1>Errou!</h1>
                <p class="palavra"></p>
                <p class="tempo"></p>
                <p class="pontuacao"></p>
                <button id="jogar-novamente-derrota">Jogar Novamente</button>
            </div>
        </div>
        <div class="ranking-container">
            <div class="placar-ranking">
                <i class="bi bi-x-circle" id="fechar-ranking"></i>
                <h1>Ranking</h1>
                <div class="ranking">
                
                </div>
            </div>
        </div>
        <div class="app-container" id="minigame" data-id-mg="1">
            <div class="botoes-navegar">
                <i class="bi bi-arrow-left-circle" id="voltar" title="Voltar"></i>
                <i class="bi bi-trophy" id="ranking" title="Ranking"></i>
            </div>
            <div class="title-container">
                <h1>
                    <span>L</span>
                    <span>E</span>
                    <span class="letter-yellow">T</span>
                    <span>R</span>
                    <span class="letter-red">E</span>
                    <span>C</span>
                    <span class="letter-green">O</span>
                </h1>
        
            </div>
            <div class="tile-container"></div>
            <div class="keybord-container">
                <div class="keyboard-row-container notAlphabetic" id="backspaceAndEnterRow"></div>
                <div class="keyboard-row-container" id="keyboardFirstRow"></div>
                <div class="keyboard-row-container" id="keyboardSecondRow"></div>
                <div class="keyboard-row-container" id="keyboardThirdRow"></div>
            </div>
        </div>
    </section>

    <script src="../Js/minigames/letreco.js"></script>
    <script src="../Js/minigames/ranking.js"></script>
</body>
</html>