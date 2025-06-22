<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="../Style/minigames/forca.css">
    <link rel="stylesheet" href="../Style/globais/ranking-minigames.css">
    <link rel="stylesheet" href="../Style/globais/msg-confirmacao.css">
</head>
<body>
    <section class="conteudo-forca">
        <!-- Modal de Vitória -->
    <div id="modalVitoria" class="modal">
        <div class="modal-content">
            <h2 style="color: green;">Vitória!</h2>
            <p>Você descobriu a palavra!</p>
            <p class="tempo"></p>
            <p class="pontuacao"></p>
            <button id="btnReiniciar">Jogar Novamente</button>
        </div>
    </div>
    <!-- Modal de Derrota -->
    <div id="modalDerrota" class="modal">
        <div class="modal-content">
            <h2 style="color: red;">Você perdeu!</h2>
            <p>A palavra era: <span id="palavra"></span></p>
            <button id="btnReiniciarPerdeu">Jogar Novamente</button>
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

        <div class="section" id="minigame" data-id-mg="3">
            <div class="botoes-navegar">
                <i class="bi bi-arrow-left-circle" id="voltar" title="Voltar"></i>
                <i class="bi bi-trophy" id="ranking" title="Ranking"></i>
            </div>

            <div class="painel-jogo">
                <span id="barra-progresso-forca"><span id="barra-progresso"></span></span>
                <img id="imagem-forca">
            </div>

            <div id="exibicao-palavra">
                
            </div>

            <div class="keybord-container">
                <div class="keyboard-row-container" id="keyboardFirstRow"></div>
                <div class="keyboard-row-container" id="keyboardSecondRow"></div>
                <div class="keyboard-row-container" id="keyboardThirdRow"></div>
                <div class="keyboard-row-container notAlphabetic" id="backspaceAndEnterRow"></div>
            </div>
        </div>
    </section>

    <script src="../Js/minigames/forca.js"></script>
    <script src="../Js/minigames/ranking.js"></script>
</body>
</html>