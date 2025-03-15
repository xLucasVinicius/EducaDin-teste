<?php
session_start();
include("config.php");

header('Content-Type: application/json');  // Defina o tipo de conteúdo como JSON

$sql = "SELECT * FROM contas WHERE id_usuario = " . $_SESSION['id'];
$sql2 = "SELECT * FROM lancamentos WHERE id_usuario = " . $_SESSION['id'] . " AND categoria = 'cartao de credito'";
$result = $mysqli->query($sql);
$result2 = $mysqli->query($sql2);

$response = array();  // Array principal para a resposta

// Verifica se há dados nas contas
if ($result->num_rows > 0) {
    $contas = array();
    while($row = $result->fetch_assoc()) {
        $contas[] = $row;
    }
    $response['contas'] = $contas;  // Adiciona as contas ao array de resposta
} else {
    $response['contas'] = array();  // Caso não haja contas, retorna um array vazio
}

// Verifica se há dados nos lançamentos
if ($result2->num_rows > 0) {
    $lancamentos = array();
    while($row = $result2->fetch_assoc()) {
        $lancamentos[] = $row;
    }
    $response['lancamentos'] = $lancamentos;  // Adiciona os lançamentos ao array de resposta
} else {
    $response['lancamentos'] = array();  // Caso não haja lançamentos, retorna um array vazio
}

echo json_encode($response);  // Retorna o JSON com ambas as seções
