<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EducaDin</title>
    <link rel="stylesheet" href="../Style/minigames/minigames.css">
</head>

<body>
    <section class="conteudo-total-minigames">
        <div class="moedas-usuario">
            <i class="bi bi-coin"></i>
            <?php echo $_SESSION['moedas']; ?>
        </div>

        <section class="topo-minigames">
            <h1>Minigames</h1>
        </section>
        <section class="conteudo-minigames">
            <div class="container-card-minigames">
                <div class="card-minigames">
                    <a href="?page=letreco">
                        <span class="tela-escura"></span>
                        <img src="../imagens/minigames/1.png" alt="Letreco">
                    </a>
                </div>
                <div class="card-minigames">
                    <a href="?page=snake">
                        <span class="tela-escura"></span>
                        <img src="../imagens/minigames/2.png" alt="Snake Game">
                    </a>
                </div>
                <div class="card-minigames">
                    <a href="">
                        <span class="tela-escura"></span>
                        <img src="../imagens/minigames/3.png" alt="Jogo da Forca">
                    </a>
                </div>
                <div class="card-minigames">
                    <a href="">
                        <span class="tela-escura"></span>
                        <img src="../imagens/minigames/3.png" alt="Minigame 4">
                    </a>
                </div>
            </div>
        </section>
    </section>
</body>

<script>
document.querySelector('.moedas-usuario').addEventListener('click', function() {
    window.location.href = '?page=loja';
})
</script>

</html>