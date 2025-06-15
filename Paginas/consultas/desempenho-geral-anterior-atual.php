<?php

session_start();
date_default_timezone_set('America/Sao_Paulo');

include("../configs/config.php");

$id_usuario = $_SESSION['id_usuario'];


// Define as datas com o primeiro dia do mês usando DateTime para evitar bugs de overflow
$data_atual = (new DateTime('first day of this month'))->format('Y-m-d');
$data_mes_anterior = (new DateTime('first day of last month'))->format('Y-m-d');

// Mês atual
$query_atual = "SELECT SUM(total_receitas) AS total_receitas, 
                SUM(total_despesas) AS total_despesas, 
                SUM(saldo_final) AS saldo_final 
                FROM desempenho_anual 
                WHERE id_usuario = ? AND data_ref = ?";
$stmt_atual = $mysqli->prepare($query_atual);
$stmt_atual->bind_param("is", $id_usuario, $data_atual);
$stmt_atual->execute();
$result_atual = $stmt_atual->get_result();

$total_receitas_atual = 0;
$total_despesas_atual = 0;
$saldo_final_atual = 0;

if ($result_atual->num_rows > 0) {
    $row_atual = $result_atual->fetch_assoc();
    $total_receitas_atual = (float)$row_atual['total_receitas'];
    $total_despesas_atual = (float)$row_atual['total_despesas'];
    $saldo_final_atual = (float)$row_atual['saldo_final'];
}

// Mês anterior
$query_anterior = "SELECT SUM(total_receitas) AS total_receitas, 
                   SUM(total_despesas) AS total_despesas, 
                   SUM(saldo_final) AS saldo_final 
                   FROM desempenho_anual 
                   WHERE id_usuario = ? AND data_ref = ?";
$stmt_anterior = $mysqli->prepare($query_anterior);
$stmt_anterior->bind_param("is", $id_usuario, $data_mes_anterior);
$stmt_anterior->execute();
$result_anterior = $stmt_anterior->get_result();

$total_receitas_anterior = 0;
$total_despesas_anterior = 0;
$saldo_final_anterior = 0;

if ($result_anterior->num_rows > 0) {
    $row_anterior = $result_anterior->fetch_assoc();
    $total_receitas_anterior = (float)$row_anterior['total_receitas'];
    $total_despesas_anterior = (float)$row_anterior['total_despesas'];
    $saldo_final_anterior = (float)$row_anterior['saldo_final'];
}

header('Content-Type: application/json');
echo json_encode([
    'total_receitas_anterior' => $total_receitas_anterior,
    'total_despesas_anterior' => $total_despesas_anterior,
    'saldo_final_anterior' => $saldo_final_anterior,
    'total_receitas_atual' => $total_receitas_atual,
    'total_despesas_atual' => $total_despesas_atual,
    'saldo_final_atual' => $saldo_final_atual
]);

?>