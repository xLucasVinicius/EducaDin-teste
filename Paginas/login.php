
<?php 
session_start();

$error_email = false;
$error_senha = false;

if(isset($_POST['email'])){
    include('config.php');
    
    // Sanitizando o input para prevenir SQL Injection
    $email = $mysqli->real_escape_string($_POST['email']);
    $senha = $_POST['senha'];

    $sql_code = "SELECT * FROM usuarios WHERE email = '$email' LIMIT 1";
    $sql_exec = $mysqli->query($sql_code) or die($mysqli->error);

    // Verifica se a consulta retornou algum usuário
    if ($sql_exec->num_rows > 0) {
        $usuario = $sql_exec->fetch_assoc();
        
        // Verifica a senha
        if (password_verify($senha, $usuario['senha'])) {
            // Armazenando os dados do usuário na sessão
            $_SESSION['nome'] = $usuario['nome'];
            $_SESSION['sobrenome'] = $usuario['sobrenome'];
            $_SESSION['file'] = $usuario['path'];
            $_SESSION['id'] = $usuario['id'];
            $_SESSION['email'] = $usuario['email'];
            $_SESSION['telefone'] = $usuario['num_tel'];
            $_SESSION['data_nasc'] = $usuario['data_nasc'];
            $_SESSION['estado'] = $usuario['estado'];
            
            // Redireciona para a página inicial
            header('location: index.php');
            exit(); // Certifique-se de sair após o redirecionamento
        } else {
            $error_senha = true;
        }
    } else {
        $error_email = true;
    }
}
?>

<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
    <link rel="stylesheet" href="../Style/login.css">
    <link rel="shortcut icon" href="../imagens/favicon.ico" type="image/x-icon">
</head>
<body>

    <div class="content">
        <form action="" method="post" id="form" class="form">
            <h1>Educa<span id="titulo">Din</span></h1>

            <span class="form-span <?php echo ($error_email) ? 'error' : ''; ?>">
                <label for="email">Endereço de Email</label>
                <input class="input" type="email" name="email" id="email" placeholder="exemplo@mail.com" required>
                <d>Email incorreto</d>
            </span>
            
            <span class="form-span <?php echo ($error_senha) ? 'error' : ''; ?>">
                <label for="senha">Senha</label>
                <input class="input" type="password" name="senha" id="senha" required placeholder="********">
                <d>Senha incorreta</d>
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
             <button>login com o google</button>
        </div>
        
        <a href="cadastro.php">Realizar cadastro</a>
    </div>

</body>
</html>