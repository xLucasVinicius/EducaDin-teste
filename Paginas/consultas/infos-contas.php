<?php
session_start();
include("../configs/config.php");

header('Content-Type: application/json');  // Defina o tipo de conteúdo como JSON

$sql = "SELECT * FROM contas WHERE id_usuario = " . $_SESSION['id']; // Consulta para obter as contas
$sql2 = "SELECT * FROM lancamentos WHERE id_usuario = " . $_SESSION['id'] . " AND metodo_pagamento = 'Pix' OR metodo_pagamento = 'Boleto' OR metodo_pagamento = 'Transferência' OR metodo_pagamento = 'Dinheiro'"; // Consulta para obter os lançamentos
$result = $mysqli->query($sql); // Executa a consulta
$result2 = $mysqli->query($sql2); // Executa a consulta

$response = array();  // Array principal para a resposta

// Verifica se há dados nas contas
if ($result->num_rows > 0) {
    $contas = array();
    while($row = $result->fetch_assoc()) { // Adiciona as contas ao array
        $contas[] = $row;
    }
    $response['contas'] = $contas;  // Adiciona as contas ao array de resposta
} else {
    $response['contas'] = array();  // Caso não haja contas, retorna um array vazio
}

// Verifica se há dados nos lançamentos
if ($result2->num_rows > 0) {
    $lancamentos = array();
    while($row = $result2->fetch_assoc()) { // Adiciona os lançamentos ao array
        $lancamentos[] = $row;
    }
    $response['lancamentos'] = $lancamentos;  // Adiciona os lançamentos ao array de resposta
} else {
    $response['lancamentos'] = array();  // Caso não haja lançamentos, retorna um array vazio
}

echo json_encode($response);  // Retorna o JSON com ambas as seções
