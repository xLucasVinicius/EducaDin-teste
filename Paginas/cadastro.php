<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cadastro</title>
    <link rel="shortcut icon" href="../imagens/logos/favicon.ico" type="image/x-icon">
    <link rel="stylesheet" href="../Style/cadastro/cadastro.css">
    <link rel="stylesheet" href="../Style/cadastro/cadastro-media.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
</head>
<body>
<div id="gradient"></div>
    <div id="pattern"></div>    
    
<main class="form-container-cadastro">
    <form action="configs/salvar-usuario.php" method="post" enctype="multipart/form-data" id="form-cadastro">
        <h1>Cadastro</h1>
        <div class="input-img-perfil">
            <div class="img-perfil">
                <img id="imagem-perfil" src="../foto-perfil/default.png" alt="">
            </div>
            <a href="editar-imagem.html" class="file-label">
            <i class="bi bi-pencil"></i>
            </a>
        </div>
    
        <div class="input-name"> <!-- div com inputs do nome -->
            <span class="input-box">
                <label for="nome">Nome</label>
                <input type="text" name="nome" id="nome" placeholder="Digite seu nome">
                <span class="error"></span>
            </span>
    
            <span class="input-box">
                <label for="sobrenome">Sobrenome</label>
                <input type="text" name="sobrenome" id="sobrenome" placeholder="Digite seu sobrenome">
                <span class="error"></span>
            </span>
        </div>
        <div class="input-login"> <!-- div com inputs de login -->
            <span class="input-box">
                <label for="email">Email</label>
                <input type="email" name="email" id="email" placeholder="exemplo@gmail.com">
                <span class="error"></span>
            </span>
    
            <span class="input-box" id="span-senha">
                <label for="senha">Senha</label>
                <input type="password" name="senha" id="senha" placeholder="digite sua senha">
                <i class="bi bi-eye" id="senha-icon" onclick="mostrarSenha()"></i>
                <span class="error"></span>
            </span>
    
            <span class="input-box" id="span-confirmarsenha">
                <label for="confirmar-senha">Confirmar Senha</label>
                <input type="password" name="senha" id="confirmar-senha" placeholder="Digite sua senha novamente">
                <i class="bi bi-eye" id="confirmarsenha-icon" onclick="mostrarConfirmarSenha()"></i>
                <span class="error"></span>
            </span>

        </div>
        <div class="input-outras-infos"> <!-- div com inputs das outras infos -->
            <span class="input-box">
                <label for="data-nasc">Data de Nascimento</label>
                <input type="date" name="data-nascimento" id="data-nasc">
                <span class="error"></span>
                <i class="bi bi-calendar3"></i>
            </span>
    
            <span class="input-box">
                <label for="salario">Salário</label>
                <input type="text" name="salario" id="salario" placeholder="R$ 0,00">
                <span class="error"></span>
            </span>

        </div>
    
        <div class="termos-politicas"> <!-- div com links dos termos e politicas -->
            <a href="politicas.html">Politicas de uso</a>
            <a href="termos.html">Termos de uso</a>
        </div>
    
        <div class="input-termos-politicas"> <!-- div com checkbox dos termos e politicas -->
            <input type="checkbox" name="termos" id="termos">
            <label for="termos" id="termos-label" >
                Eu aceito os termos e politicas de uso
            </label>
        </div>
    
        <div class="btn-form"> <!-- div com botoes de cancelar e salvar -->
            <span id="btn-input1"><button type="button">Cancelar</button></span>
            <input id="btn-salvar" type="submit" value="Salvar" class="disabled" disabled>
        </div>

        <!-- Campo oculto para enviar a imagem em base64 -->
        <input type="hidden" name="base64-image" id="base64-image">
    </form>
</main>

<script src="../Js/background.js"></script> <!-- Js de background -->
<script src="../Js/cadastro.js"></script> <!-- Js de cadastro -->
</body>
</html>


