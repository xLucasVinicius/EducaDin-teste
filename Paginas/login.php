<?php
include 'configs/infos-login.php';
?>

<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
    <link rel="stylesheet" href="../Style/login/login.css">
    <link rel="shortcut icon" href="../imagens/logos/favicon.ico" type="image/x-icon">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css">
    
</head>
<body>
    <div id="gradient"></div>
    <div id="pattern"></div>

    <div class="content">
        <form action="" method="post" id="form" class="form">
            <h1>Educa<span id="titulo">Din</span></h1>

            <span class="form-span <?php echo ($error_email) ? 'error' : ''; ?>">
                <label for="email">Endereço de Email</label>
                <input class="input" type="email" name="email" id="email" placeholder="exemplo@mail.com" required>
                <d>Email incorreto</d>
            </span>
            
            <span class="form-span <?php echo ($error_senha) ? 'error' : ''; ?> senha">
                <label for="senha">Senha</label>
                <input class="input" type="password" name="senha" id="senha" required placeholder="********">
                <d>Senha incorreta</d>
                <span class="toggle-password" onclick="togglePassword()"><i class="bi bi-eye"></i></span>
            </span>

            <span id="remember-box">
                <input type="checkbox" name="remember" id="remember">
                <label for="remember" id="remember-label">Manter conectado</label>
            </span>

            <input type="submit" value="Login">
            <a href="#">Esqueci a senha</a>
        </form>
        <div class="login-google">
            <span class="linha1"></span>
            <span class="linha2"></span>
            <p>Acessar com</p>
            <!-- Aqui vem botao de login com o google -->
            <div id="buttonDiv"></div>
        </div>
        
        <a href="cadastro.php">Realizar cadastro</a>
    </div>

<script src="../Js/login.js"></script>
<script src="../Js/background.js"></script>
<script src="https://accounts.google.com/gsi/client" async></script>
<script src="https://unpkg.com/jwt-decode/build/jwt-decode.js"></script>
</body>
</html>