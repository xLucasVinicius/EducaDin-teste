<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
    <link rel="stylesheet" href="../Style/login/login.css">
    <link rel="stylesheet" href="../Style/globais/msg-confirmacao.css">
    <link rel="shortcut icon" href="../imagens/logos/favicon.ico" type="image/x-icon">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css">
    <script src="https://cdn.jsdelivr.net/npm/jwt-decode@3.1.2/build/jwt-decode.min.js"></script>
    <script src="https://accounts.google.com/gsi/client" async></script>
</head>

<body>
    <!-- Fundo com efeito hexagonal -->
    <div id="gradient"></div>
    <div id="pattern"></div>

    <div id="errorModalEmailBanido" class="modal">
        <div class="modal-content">
            <h2>Erro!</h2>
            <p>O email utilizado foi banido.</p>
            <button id="closeModalBtnBanido">OK</button>
        </div>
    </div>
    
    <!-- Modal para recuperaçãor senha -->
    <div id="modalRecuperar" class="modal">
        <div class="modal-content error-conta">
            <h1>Recuperar Senha</h1>
            <form method="post" id="form-recuperar" action="configs/recuperando-senha.php">
                <span id="fecharModalRecuperar"><i class="bi bi-x-lg"></i></span>
                <input id="email-recuperar" type="email" name="email" placeholder="Email" required>
                <p id="mensagem-erro"></p>
                <input type="submit" name="recuperar" value="verificar">
            </form>
        </div>
    </div>
    
    <!-- Todo o conteúdo -->
    <div class="content">
        <span class="icon-voltar">
            <a href="../index.php"><i class="bi bi-x-lg"></i></a>
        </span>
        <form id="form" class="form">
            <!-- Formulário de login -->
            <h1>Educa<span id="titulo">Din</span></h1> <!-- Logo -->

            <span class="form-span email <?php echo ($error_email) ? 'error' : ''; ?>">
                <!-- Campo de email -->
                <label for="email">Endereço de Email</label>
                <input class="input" type="email" name="email" id="email" placeholder="exemplo@mail.com" required>
                <d>Email incorreto</d>
            </span>

            <span class="form-span <?php echo ($error_senha) ? 'error' : ''; ?> senha">
                <!-- Campo de senha -->
                <label for="senha">Senha</label>
                <input class="input" type="password" name="senha" id="senha" required placeholder="********">
                <d>Senha incorreta</d>
                <span class="toggle-password" onclick="togglePassword()"><i class="bi bi-eye"></i></span>
            </span>

            <span id="remember-box">
                <!-- Checkbox de manter conectado -->
                <input type="checkbox" name="remember" id="remember">
                <label for="remember" id="remember-label">Manter conectado</label>
            </span>

            <input type="submit" value="Login" id="btn-login">
            <z id="esqueci-senha">Esqueci a senha</z>
        </form>
        <div class="login-google">
            <!-- Botão de login com o google -->
            <span class="linha1"></span>
            <span class="linha2"></span>
            <p>Acessar com</p>
            <!-- Aqui vem botao de login com o google -->
            <div id="buttonDiv"></div>
        </div>

        <a href="cadastro.html">Realizar cadastro</a>
    </div>

    <script src="../Js/login/login.js"></script> <!-- JS Personalizado -->
    <script src="../Js/paginas/background.js"></script> <!-- JS Personalizado -->
    <script src="../Js/botaogoogle/botao-google-login.js"></script>
</body>

</html>