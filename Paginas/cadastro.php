<?php
include('config.php');
if(isset($_POST['email'])) {
$arquivo = $_FILES['file'];
    if($arquivo['error'])
        die("Falha ao enviar arquivo");
    if ($arquivo['size'] > 2097152)
        die("Arquivo muito grande! Max: 2mb");


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
    <link rel="stylesheet" href="../Style/cadastro.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
</head>
<body>
<form action="" method="post" enctype="multipart/form-data">
    <h1>Cadastro</h1>
    <div class="input-img-perfil">
        <div class="img-perfil">
            <img id="imagem-perfil" src="../foto-perfil/default.png" alt="">
        </div>
        <label for="file" class="file-label">
        <i class="bi bi-pencil"></i>
        </label>
        <input type="file" name="file" id="file">
    </div>
    
    <div class="input-name">
        <span>
            <label for="nome">Nome</label>
            <input type="text" name="nome" id="nome" placeholder="Digite seu nome" required>
        </span>

        <span>
            <label for="sobrenome">Sobrenome</label>
            <input type="text" name="sobrenome" id="sobrenome" placeholder="Digite seu sobrenome" required>
        </span>
    </div>
    <div class="input-login">
        <label for="email">Email</label>
        <input type="email" name="email" id="email" placeholder="exemplo@gmail.com" required>

        <label for="senha">Senha</label>
        <input type="password" name="senha" id="senha" placeholder="digite sua senha" required>

        <label for="senha">Confirmar Senha</label>
        <input type="password" name="senha" id="confirmarsenha" placeholder="digite sua senha novamente" required>
    </div>
    <div class="input-outras-infos">
        <span>
            <label for="data-nasc">Data de Nascimento</label>
            <input type="date" name="data-nasc" id="data-nasc">
        </span>

        <span>
        <label for="telefone">Número</label>
        <input type="tel" name="telefone" id="telefone" placeholder="11 99999-9999" required>
        </span>
    </div>
    <div class="btn-form">
        <span id="btn-input1"><button>Cancelar</button></span>
        <span id="btn-input2"><input id="btn-salvar" type="submit" value="Salvar"></span>
    </div>
</form>

<script src="../Js/cadastro.js"></script>
</body>
</html>


