<?php 
session_start();

$error_email = false;
$error_senha = false;

if (isset($_POST['email'])) {
    include("../configs/config.php");

    $email = $mysqli->real_escape_string($_POST['email']);
    $senha = $_POST['senha'];

    $sql_code = "SELECT * FROM usuarios WHERE email = '$email' LIMIT 1";
    $sql_exec = $mysqli->query($sql_code) or die($mysqli->error);
    if ($sql_exec->num_rows > 0) {
        $usuario = $sql_exec->fetch_assoc();

        if ($usuario['status_atividade'] == 0) {
            echo json_encode(['status' => 'banido']);
            exit;
        }

        if (password_verify($senha, $usuario['senha'])) {
            $_SESSION['id_usuario'] = $usuario['id_usuario'];
            $_SESSION['foto_perfil'] = $usuario['foto_perfil'];
            $_SESSION['nome'] = $usuario['nome'];
            $_SESSION['sobrenome'] = $usuario['sobrenome'];
            $_SESSION['email'] = $usuario['email'];
            $_SESSION['data_nasc'] = $usuario['data_nascimento'];
            $_SESSION['salario'] = $usuario['salario'];
            $_SESSION['plano'] = $usuario['plano'];
            $_SESSION['poder'] = $usuario['poder'];
            $_SESSION['moedas'] = $usuario['moedas'];

            if (isset($_POST['remember'])) {
                setcookie('user', $usuario['email'], time() + (86400 * 30), "/");
            }

            echo json_encode(['status' => 'success']);
            exit;
        } else {
            echo json_encode(['status' => 'senha_error']);
            exit;
        }
    } else {
        echo json_encode(['status' => 'email_error']);
        exit;
    }
} else {
    // Retorno padrão para requisições que não vieram com POST
    echo json_encode(['status' => 'invalid_request']);
    exit;
}
?>
