<?php

$sql_busca_moedas = "SELECT moedas FROM usuarios WHERE id_usuario = '{$_SESSION['id_usuario']}' LIMIT 1";
$result_moedas = $mysqli->query($sql_busca_moedas);
$moedas = $result_moedas->fetch_assoc();
$_SESSION['moedas'] = $moedas['moedas'];

?>

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
        <span class="loja"><i class="bi bi-cart-plus"></i></span>
        <div class="moedas-usuario">
            <i class="bi bi-coin"></i>
            <?php echo $_SESSION['moedas']; ?>
        </div>

        <section class="topo-minigames">
            <h1>Minigames</h1>
        </section>
        <section class="conteudo-minigames">
            <div class="container-card-minigames">
                <!-- Letreco -->
                <div class="card-minigames">
                    <a href="?page=letreco">
                        <span class="tela-escura"></span>
                        <img src="../imagens/minigames/1.png" alt="Letreco">
                    </a>
                </div>
                <!-- Snake -->
                <div class="card-minigames">
                    <a href="?page=snake">
                        <span class="tela-escura"></span>
                        <img src="../imagens/minigames/2.png" alt="Snake Game">
                    </a>
                </div>
                <!-- Forca -->
                <div class="card-minigames">
                    <a href="?page=forca">
                        <span class="tela-escura"></span>
                        <img src="../imagens/minigames/3.png" alt="Jogo da Forca">
                    </a>
                </div>
                <!-- Memória -->
                <div class="card-minigames">
                    <a href="?page=memoria">
                        <span class="tela-escura"></span>
                        <img src="../imagens/minigames/4.png" alt="Jogo da Memória">
                    </a>
                </div>
            </div>
        </section>
    </section>
</body>

<script>
document.querySelector('.loja').addEventListener('click', function() {
    window.location.href = '?page=loja';
})
</script>

</html>