<?php 

include('config.php');

$id_usuario = $_POST['id_usuario'];
$metodo = $_POST['metodo'];
$id_conta = $_POST['conta'] ?? null;
$id_cartao = $_POST['cartao'] ?? null;
$descricao = $_POST['descricao'];
$valor = $_POST['valor'];
$tipo = $_POST['tipo'];
$categoria = $_POST['categoria'];
$subcategoria = $_POST['subcategoria'];
$data = $_POST['data'];
$parcelas = $_POST['parcelas'];
$valor = formatarValor($valor);


if ($tipo == 0) {
    $parcelas = 0;
} else {
    $parcelas = $parcelas;
}

$query = "INSERT INTO lancamentos (id_usuario, id_conta, id_cartao, descricao, valor, tipo, metodo_pagamento, categoria, subcategoria, data, parcelas) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
$stmt = $mysqli->prepare($query);
$stmt->bind_param("iiisssssssi", $id_usuario, $id_conta, $id_cartao, $descricao, $valor, $tipo, $metodo, $categoria, $subcategoria, $data, $parcelas);
$stmt->execute();



if ($stmt->affected_rows > 0) {
    echo json_encode(['status' => 'success']); // Retorna uma resposta de sucesso
} else {
    echo json_encode(['status' => 'error']); // Retorna uma resposta de erro
}


function formatarValor($valor) {
    $valor = str_replace("R$", "", $valor);
    $valor = str_replace(".", "", $valor);
    $valor = str_replace(",", ".", trim($valor));
    return floatval($valor);
}
?>