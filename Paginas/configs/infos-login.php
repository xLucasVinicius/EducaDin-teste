<?php 
session_start();

$error_email = false;
$error_senha = false;

if(isset($_POST['email'])){
    include('configs/config.php');
    
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
            
            // Verificar se o usuário optou por "manter conectado"
            if (isset($_POST['remember'])) {
                // Definir um cookie com tempo de expiração de 30 dias
                setcookie('user', $usuario['email'], time() + (86400 * 30), "/");
            }
            // Redireciona para a página inicial
            header('location: navbar.php?page=dashboard');
            exit(); // Certifique-se de sair após o redirecionamento
        } else {
            $error_senha = true;
        }
    } else {
        $error_email = true;
    }
}
?>