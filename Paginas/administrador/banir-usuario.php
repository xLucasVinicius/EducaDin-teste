<?php
session_start();
include("../configs/config.php");
header('Content-Type: application/json');

$id_usuario = $_GET['id_usuario'];
$acao = $_GET['acao'];

if ($acao == 'banir') {
    $sql_banir = "UPDATE usuarios SET status_atividade = 0 WHERE id_usuario = ?";
    $stmt_banir = $mysqli->prepare($sql_banir);
    $stmt_banir->bind_param("i", $id_usuario);
    $stmt_banir->execute();
    $stmt_banir->close();
} else if ($acao == 'desbanir') {
    $sql_desbanir = "UPDATE usuarios SET status_atividade = 1 WHERE id_usuario = ?";
    $stmt_desbanir = $mysqli->prepare($sql_desbanir);
    $stmt_desbanir->bind_param("i", $id_usuario);
    $stmt_desbanir->execute();
    $stmt_desbanir->close();
}

echo json_encode(['status' => 'success']); // Retorna uma resposta de sucesso

?>