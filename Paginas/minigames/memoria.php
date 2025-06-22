
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="../Style/minigames/memoria.css">
    <link rel="stylesheet" href="../Style/globais/ranking-minigames.css">
    <link rel="stylesheet" href="../Style/globais/msg-confirmacao.css">
</head>
<body>

<section class="conteudo-memoria">
    <!-- Modal de Vitória -->
    <div id="modalVitoria" class="modal">
        <div class="modal-content">
            <h2 style="color: green;">Vitória!</h2>
            <p class="tempo"></p>
            <p class="pontuacao"></p>
            <button id="btnReiniciar">Jogar Novamente</button>
        </div>
    </div>
    <!-- Modal de Derrota -->
    <div id="modalDerrota" class="modal">
        <div class="modal-content">
            <h2 style="color: red;">Você perdeu!</h2>
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

        

        <div id="minigame" data-id-mg="4">
            <div class="botoes-navegar">
                <i class="bi bi-arrow-left-circle" id="voltar" title="Voltar" style="top: -70px;"></i>
                <i class="bi bi-trophy" id="ranking" title="Ranking" style="top: -70px;"></i>
                <div class="barra-conteiner">
                    <div class="barra-tempo" id="barra-tempo"></div>
                </div>
            </div>
            

            <div class="painel" id="painel"></div>
            <div class="info" id="info">Escolha a dificuldade</div>

            <div class="btn-dificuldade">
            <button onclick="startGame(8)">Casual</button>
            <button onclick="startGame(18)">Medium</button>
            <button onclick="startGame(32)">Hard</button>
            </div>

    </div>
</section>

<script src="../Js/minigames/memoria.js"></script>
<script src="../Js/minigames/ranking.js"></script>
</body>
</html>