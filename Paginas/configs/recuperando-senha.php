<?php 

include("config.php");
header('Content-Type: application/json');

if (isset($_POST['recuperar'])) {

    $sql_validar = "SELECT * FROM usuarios WHERE email = ?";
    $stmt_validar = $mysqli->prepare($sql_validar);
    $stmt_validar->bind_param("s", $_POST['email']);
    $stmt_validar->execute();
    $stmt_validar->store_result();
    $stmt_validar->fetch();

    if ($stmt_validar->num_rows == 0) {
        echo json_encode(['status' => 'error_email']);
        $stmt_validar->close();
        die();

    } else if ($stmt_validar->num_rows > 0) {
        $novasenha = substr(password_hash(time(), PASSWORD_DEFAULT), 0, 8);
        $nscriptografada = password_hash($novasenha, PASSWORD_DEFAULT);
        $email = $mysqli->real_escape_string($_POST['email']);

        if (mail($email, "Nova Senha", "Sua nova senha é: $novasenha")) {
            $sql_update = "UPDATE usuarios SET senha = ? WHERE email = ?";
            $stmt_update = $mysqli->prepare($sql_update);
            $stmt_update->bind_param("ss", $nscriptografada, $email);
            $stmt_update->execute();
            $stmt_update->close();
            echo json_encode(['status' => 'success']);
            die();
        } else {
            echo json_encode(['status' => 'error_envio']);
            die();
        }
    }  
} else {
    echo json_encode(['status' => 'invalid_request']);
    die();
}

?>