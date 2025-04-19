<?php
session_start();
include("../configs/config.php");

$query = "SELECT * FROM lancamentos WHERE id_usuario = ? AND id_lancamento = ?";
$stmt = $mysqli->prepare($query);
$stmt->bind_param("ii", $_SESSION['id'], $_GET['id_lancamento']);
$stmt->execute();
$result = $stmt->get_result();
$lancamento = $result->fetch_assoc();

echo json_encode($lancamento);


?>