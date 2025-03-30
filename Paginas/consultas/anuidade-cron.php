<?php

include("../configs/config.php");

// Buscar todos os cartões com anuidade
$sql = "SELECT id_cartao, id_conta, id_usuario, anuidade FROM cartoes WHERE anuidade IS NOT NULL";
$result = $mysqli->query($sql);

while ($cartao = $result->fetch_assoc()) {
    // Inserir a cobrança mensal de anuidade
    $sqlInsert = "INSERT INTO lancamentos (id_lancamento, id_usuario, id_conta, id_cartao, descricao, valor, tipo, metodo_pagamento, categoria, subcategoria, data, parcelas) VALUES (?, ?, ?, 'anuidade', ?, '1', 'cartão de crédito', 'Impostos', 'anuidade', NOW(), '1')";
    $stmt = $mysqli->prepare($sqlInsert);
    $stmt->bind_param("iiid", $cartao['id_usuario'], $cartao['id_conta'], $cartao['id_cartao'], $cartao['anuidade']);
    $stmt->execute();
}

$mysqli->close();
?>
