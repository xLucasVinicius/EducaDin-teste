<?php

$sql_busca_moedas = "SELECT moedas FROM usuarios WHERE id_usuario = '{$_SESSION['id_usuario']}' LIMIT 1";
$result_moedas = $mysqli->query($sql_busca_moedas);
$moedas = $result_moedas->fetch_assoc();
$_SESSION['moedas'] = $moedas['moedas'];

?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Resgate</title>
    <link rel="stylesheet" href="../Style/resgate/resgate.css">
    <link rel="stylesheet" href="../Style/resgate/resgate-media.css">
    <link rel="stylesheet" href="../Style/globais/msg-confirmacao.css">
</head>

<body>
    <div id="modalSucesso" class="modal">
        <div class="modal-content">
            <h2 style="color: green;">Sucesso!</h2>
            <p></p>
            <button id="btnModalSucesso">Ok</button>
        </div>
    </div>
    <section class="conteudo-total-loja">
        <span class="btn-voltar" onclick="window.history.back()" title="Voltar"><i class="bi bi-arrow-left"></i></span>
        <div class="moedas-usuario">
            <i class="bi bi-coin"></i>
            <?php echo $_SESSION['moedas']; ?>
        </div>
        <div class="txt-loja">
            <h1>Resgate de Cupons</h1>
            <p>Escolha o cupom que deseja e utilize suas moedas para resgatar!</p>
        </div>
            <div class="premios-loja-conteiner">

            </div>
    </section>
</body>
<script src="../Js/minigames/premios.js"></script>
</html>