<?php
include("../configs/config.php");

date_default_timezone_set('America/Sao_Paulo');
$dataAtual = date('Y-m-d');

// Busca todos os usuários com plano ativo
$sql_busca_usuarios = "SELECT * FROM usuarios WHERE plano = 1";
$result = $mysqli->query($sql_busca_usuarios);
$usuarios = $result->fetch_all(MYSQLI_ASSOC);

foreach ($usuarios as $usuario) {
    $id_usuario = $usuario['id_usuario'];

    // Verifica se a data_fim do plano já passou
    $sql_status = "SELECT data_fim FROM status_plano WHERE id_usuario = ?";
    $stmt_status = $mysqli->prepare($sql_status);
    $stmt_status->bind_param("i", $id_usuario);
    $stmt_status->execute();
    $resultado = $stmt_status->get_result();

    if ($resultado->num_rows > 0) {
        $status = $resultado->fetch_assoc();
        $data_fim = $status['data_fim'];

        if ($data_fim < $dataAtual) {
            // Atualiza o plano do usuário para 0 (grátis)
            $sql_update = "UPDATE usuarios SET plano = 0 WHERE id_usuario = ?";
            $stmt_update = $mysqli->prepare($sql_update);
            $stmt_update->bind_param("i", $id_usuario);
            $stmt_update->execute();

            // Remove o plano da tabela status_plano
            $sql_delete = "DELETE FROM status_plano WHERE id_usuario = ?";
            $stmt_delete = $mysqli->prepare($sql_delete);
            $stmt_delete->bind_param("i", $id_usuario);
            $stmt_delete->execute();
        }
    }
}
?>
