<?php
include('configs/config.php');
if(isset($_POST['email'])) {
$arquivo = $_FILES['file'];
    if($arquivo['error'])
        die("Falha ao enviar arquivo");
    if ($arquivo['size'] > 2097152)
        die("Arquivo muito grande! Max: 7mb");


    $pasta = "../foto-perfil/";
    $nomeDoArquivo = $arquivo['name'];
    $novoNomeDoArquivo = uniqid();
    $extensao = strtolower(pathinfo($nomeDoArquivo, PATHINFO_EXTENSION));

    if($extensao != 'jpg' && $extensao != 'png')
        die("Tipo de arquivo não aceito");

    $path = $pasta . $novoNomeDoArquivo . "." . $extensao;
    $deu_certo = move_uploaded_file($arquivo["tmp_name"], $path);

    $nome = $_POST['nome'];
    $sobrenome = $_POST['sobrenome'];
    $email = $_POST['email'];
    $senha = password_hash($_POST['senha'], PASSWORD_DEFAULT);
    $num_cel = $_POST['telefone'];
    $data_nasc = $_POST['data-nasc'];
    $estado = $_POST['estado'];

        if($deu_certo){
            $mysqli->query("INSERT INTO usuarios (path , nome, sobrenome, email, senha, num_tel, data_nasc, estado) VALUES ('$path','$nome', '$sobrenome', '$email', '$senha', '$num_cel', '$data_nasc', '$estado')");
            echo "<script>alert('Cadastrado com sucesso')</script>";
            echo "<script>location.href='login.php'</script>";

        } else {
            echo "<h1>Falha ao enviar arquivo de midia</h1>";
        }
}
?>

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
    <form action="" method="post" enctype="multipart/form-data" id="form-cadastro">
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
                <input type="date" name="data-nasc" id="data-nasc">
                <span class="error"></span>
            </span>
    
            <span class="input-box">
            <label for="telefone">Número</label>
            <input type="tel" name="telefone" id="telefone" placeholder="(99) 99999-9999">
            <span class="error"></span>
            </span>
        </div>
    
        <div class="termos-politicas"> <!-- div com links dos termos e politicas -->
            <a href="politicas.html">Politicas de uso</a>
            <a href="termos.html">Termos de uso</a>
        </div>
    
        <div class="input-termos-politicas"> <!-- div com checkbox dos termos e politicas -->
            <input type="checkbox" name="termos" id="termos" onchange="aceitarTermos()">
            <label for="termos" id="termos-label" >
                Eu aceito os termos e politicas de uso
            </label>
        </div>
    
        <div class="btn-form"> <!-- div com botoes de cancelar e salvar -->
            <span id="btn-input1"><button>Cancelar</button></span>
            <input id="btn-salvar" type="submit" value="Salvar">
        </div>
    </form>
</main>

<script src="../Js/background.js"></script> <!-- Js de background -->
<script src="../Js/cadastro.js"></script> <!-- Js de cadastro -->
</body>
</html>


