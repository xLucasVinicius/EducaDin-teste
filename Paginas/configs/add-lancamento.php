<?php 

include('config.php');

$id_usuario = $_POST['id_usuario'];
$metodo = $_POST['metodo'];
$tipo_pagamento = explode("-", $metodo)[0];
$id_metodo = explode("-", $metodo)[1];
$descricao = $_POST['descricao'];
$valor = $_POST['valor'];
$tipo = $_POST['tipo'];
$categoria = $_POST['categoria'];
$subcategoria = $_POST['subcategoria'];
$data = $_POST['data'];
$parcelas = $_POST['parcelas'];
$valor = formatarValor($valor);


if ($parcelas > 0) {
    $parcelas = $parcelas;
} else {
    $parcelas = null;
}

if ($tipo_pagamento == "cartao") {
    $query = "INSERT INTO lancamentos (id_usuario, id_conta, id_cartao, descricao, valor, tipo, metodo_pagamento, categoria, subcategoria, data, parcelas) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt = $mysqli->prepare($query);
    $stmt->bind_param("iiississssi", $id_usuario, $id_metodo, $id_metodo, $descricao, $valor, $tipo, $tipo_pagamento, $categoria, $subcategoria, $data, $parcelas);
    $stmt->execute();
} else {
    $query = "INSERT INTO lancamentos (id_usuario, id_conta, descricao, valor, tipo, metodo_pagamento, categoria, subcategoria, data, parcelas) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt = $mysqli->prepare($query);
    $stmt->bind_param("iississssi", $id_usuario, $id_metodo, $descricao, $valor, $tipo, $tipo_pagamento, $categoria, $subcategoria, $data, $parcelas);
    $stmt->execute();
}


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