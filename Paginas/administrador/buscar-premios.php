<?php
session_start();
include("../configs/config.php");
header('Content-Type: application/json');

$usuario_id = $_SESSION['id_usuario'];

$busca = "SELECT * FROM premios";
$result = $mysqli->query($busca);
$premios = $result->fetch_all(MYSQLI_ASSOC);

$premiosComResgates = [];

foreach ($premios as $premio) {
    $id_premio = $premio['id_premio'];

    $sql = "SELECT COUNT(*) as total FROM trocas_premios WHERE id_usuario = ? AND id_premio = ?";
    $stmt = $mysqli->prepare($sql);
    $stmt->bind_param("ii", $usuario_id, $id_premio);
    $stmt->execute();
    $resultado = $stmt->get_result()->fetch_assoc();

    // Adiciona a contagem de resgates ao array do prêmio
    $premio['quantidade_resgates'] = $resultado['total'];
    $premiosComResgates[] = $premio;
}

echo json_encode(['premios' => $premiosComResgates]);
?>
