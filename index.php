<?php

session_start();
include("Paginas/configs/config.php");

if (isset($_SESSION['email'])) {
    header("Location: Paginas/navbar.php");
    exit();
} else if (isset($_COOKIE['user'])) {
    $sqlUser = "SELECT * FROM usuarios WHERE email = '{$_COOKIE['user']}' LIMIT 1";
    $result = $mysqli->query($sqlUser);
    $user = $result->fetch_assoc();
    $_SESSION['id_usuario'] = $user['id_usuario'];;
    $_SESSION['foto_perfil'] = $user['foto_perfil'];
    $_SESSION['nome'] = $user['nome'];
    $_SESSION['sobrenome'] = $user['sobrenome'];
    $_SESSION['email'] = $user['email'];
    $_SESSION['salario'] = $user['salario'];
    $_SESSION['plano'] = $user['plano'];
    $_SESSION['poder'] = $user['poder'];
    $_SESSION['moedas'] = $user['moedas'];
    $_SESSION['data_nascimento'] = $user['data_nascimento'];
    header("Location: Paginas/navbar.php");
    exit();
}

?>


<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EducaDin</title>
    <link rel="shortcut icon" href="imagens/logos/moeda.png" type="image/x-icon">
    <link rel="stylesheet" href="Style/index/index.css">
    <link rel="stylesheet" href="Style/index/media-index.css">
    <link rel="stylesheet" href="Style/globais/msg-confirmacao.css">
    <script src="Js/botaogoogle/botao-google-index.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/jwt-decode@3.1.2/build/jwt-decode.min.js"></script>
    <script src="https://accounts.google.com/gsi/client" async></script>

<body>
    <div id="gradient"></div>
    <div id="pattern"></div>
    <div id="errorModalEmailBanido" class="modal">
        <div class="modal-content">
            <h2>Erro!</h2>
            <p>O email utilizado foi banido.</p>
            <button id="closeModalBtnBanido">OK</button>
        </div>
    </div>
    <div class="content">
        <div class="introducao">
            <h1>Seja bem-vindo ao</h1>
            <h1 id="animado">EducaDin!</h1>
        </div>
        <div class="links">
            <a href="Paginas/login.php">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                Login
            </a>
            <a href="Paginas/cadastro.html">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                Cadastro
            </a>

            <div class="login-google">
                <!-- Botão de login com o google -->
                <!-- Aqui vem botao de login com o google -->
                <div id="buttonDiv"></div>
            </div>
        </div>
        <div class="img-edu">
            <div class="img-content">
                <img src="imagens/logos/edu-fala.png" alt="Logo EducaDin">
                <p>Olá,<br> eu sou Edu!</p>
            </div>
        </div>
    </div>

    <script src="Js/paginas/background.js"></script>
</body>

</html>