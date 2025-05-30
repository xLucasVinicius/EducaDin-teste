<?php

session_start();
include("Paginas/configs/config.php");

if (isset($_SESSION['email'])) {
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
    <link rel="shortcut icon" href="imagens/logos/favicon.ico" type="image/x-icon">
    <link rel="stylesheet" href="Style/index/index.css">
    <link rel="stylesheet" href="Style/index/media-index.css">
    <script src="Js/botaogoogle/botao-google-index.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/jwt-decode@3.1.2/build/jwt-decode.min.js"></script>
    <script src="https://accounts.google.com/gsi/client" async></script>

<body>
    <div id="gradient"></div>
    <div id="pattern"></div>
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