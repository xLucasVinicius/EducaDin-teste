<?php
session_start();
include("../configs/config.php");

header('Content-Type: application/json');  // Defina o tipo de conteúdo como JSON

$sql = "SELECT * FROM contas WHERE id_usuario = " . $_SESSION['id'];
$sql2 = "SELECT * FROM cartoes WHERE id_usuario = " . $_SESSION['id'];
$sql3 = "SELECT * FROM lancamentos WHERE id_usuario = " . $_SESSION['id'] . " AND metodo_pagamento = 'cartao de credito'";
$result = $mysqli->query($sql);
$result2 = $mysqli->query($sql2);
$result3 = $mysqli->query($sql3);

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

// Verifica se há dados nos cartões
if ($result2->num_rows > 0) {
    $cartoes = array();
    while($row = $result2->fetch_assoc()) {
        $cartoes[] = $row;
    }
    $response['cartoes'] = $cartoes;  // Adiciona os cartões ao array de resposta
} else {
    $response['cartoes'] = array();  // Caso não haja cartões, retorna um array vazio
}

// Verifica se há dados nos lançamentos
if ($result3->num_rows > 0) {
    $lancamentos = array();
    while($row = $result3->fetch_assoc()) {
        $lancamentos[] = $row;
    }
    $response['lancamentos'] = $lancamentos;  // Adiciona os lançamentos ao array de resposta
} else {
    $response['lancamentos'] = array();  // Caso não haja lançamentos, retorna um array vazio
}

echo json_encode($response);  // Retorna o JSON com ambas as seções
