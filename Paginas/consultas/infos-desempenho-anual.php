<?php
session_start();
include("../configs/config.php");

$id_usuario = $_SESSION['id'];
$data_atual = date('Y-m-d');
$id_conta = $_GET['id_conta'];

// Dados do mês atual
$query = "SELECT * FROM desempenho_anual WHERE id_usuario = ? AND id_conta = ? AND mes = MONTH(CURRENT_DATE())";
$stmt = $mysqli->prepare($query);
$stmt->bind_param("ii", $id_usuario, $id_conta);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $id_conta_atual = $row['id_conta'];
    $total_receitas = $row['total_receitas'];
    $total_despesas = $row['total_despesas'];
} else {
    $id_conta_atual = $id_conta;
    $total_receitas = 0;
    $total_despesas = 0;
}

// Dados do mês anterior
$query_mes_anterior = "SELECT * FROM desempenho_anual WHERE id_usuario = ? AND id_conta = ? AND mes = MONTH(DATE_SUB(CURRENT_DATE(), INTERVAL 1 MONTH))";
$stmt_mes_anterior = $mysqli->prepare($query_mes_anterior);
$stmt_mes_anterior->bind_param("ii", $id_usuario, $id_conta);
$stmt_mes_anterior->execute();
$result_mes_anterior = $stmt_mes_anterior->get_result();

if ($result_mes_anterior->num_rows > 0) {
    $row_mes_anterior = $result_mes_anterior->fetch_assoc();
    $id_conta_anterior = $row_mes_anterior['id_conta'];
    $total_receitas_anterior = $row_mes_anterior['total_receitas'];
    $total_despesas_anterior = $row_mes_anterior['total_despesas'];
} else {
    $id_conta_anterior = $id_conta;
    $total_receitas_anterior = 0;
    $total_despesas_anterior = 0;
}

echo json_encode([
    'id_conta_anterior' => $id_conta_anterior,
    'total_receitas_anterior' => $total_receitas_anterior,
    'total_despesas_anterior' => $total_despesas_anterior,
    'id_conta_atual' => $id_conta_atual,
    'total_receitas_atual' => $total_receitas,
    'total_despesas_atual' => $total_despesas
]);
?>
