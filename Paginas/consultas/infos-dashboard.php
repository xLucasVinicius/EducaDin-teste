<?php

session_start();
include("../configs/config.php");
header('Content-Type: application/json');

$id_usuario = $_SESSION['id'];
$resposta = [];

// Consulta: Obter o plano (como TINYINT: 0 = grátis, 1 = premium)
$sqlPlano = "SELECT plano FROM usuarios WHERE id_usuario = $id_usuario LIMIT 1";
$resultPlano = $mysqli->query($sqlPlano);

$plano = 0; // valor padrão: grátis

if ($resultPlano && $resultPlano->num_rows > 0) {
    $plano = (int)$resultPlano->fetch_assoc()['plano'];
}

$resposta['plano'] = $plano === 1 ? 'premium' : 'gratis';

// Consulta: Dados do desempenho anual
$sqlDesempenho = "SELECT MONTH(data_ref) AS mes, YEAR(data_ref) AS ano, saldo_final FROM desempenho_anual WHERE id_usuario = $id_usuario";
$resultDesempenho = $mysqli->query($sqlDesempenho);

$valoresMensais = array_fill(0, 12, 0);
$anoAtual = date('Y');

if ($resultDesempenho && $resultDesempenho->num_rows > 0) {
    while ($row = $resultDesempenho->fetch_assoc()) {
        $mesIndex = (int)$row['mes'] - 1;
        $anoRegistro = $row['ano'];

        // Só soma os dados do ano atual
        if ($anoRegistro == $anoAtual) {
            $valoresMensais[$mesIndex] += (float)$row['saldo_final'];
        }
    }
}

// Filtro: apenas 3 meses se for plano grátis
$mesAtual = (int)date('n');
if ($plano === 0) {
    $mesesPermitidos = [
        ($mesAtual - 2 + 12) % 12 ?: 12,
        ($mesAtual - 1 + 12) % 12 ?: 12,
        $mesAtual
    ];
    $valoresFiltrados = array_fill(0, 12, 0);
    foreach ($mesesPermitidos as $mes) {
        $valoresFiltrados[$mes - 1] = $valoresMensais[$mes - 1];
    }
    $valoresMensais = $valoresFiltrados;
}

$resposta['ano'] = $anoAtual;
$resposta['valoresMensais'] = $valoresMensais;

// Consulta: Categorias dos lançamentos
$sqlCategorias = "SELECT categoria, COUNT(*) as quantidade FROM lancamentos WHERE id_usuario = $id_usuario AND categoria IS NOT NULL AND categoria != '' AND tipo = 1 GROUP BY categoria";
$resultCategorias = $mysqli->query($sqlCategorias);
$resposta['categorias'] = [];

if ($resultCategorias && $resultCategorias->num_rows > 0) {
    while ($row = $resultCategorias->fetch_assoc()) {
        $resposta['categorias'][] = ['nome' => $row['categoria'], 'quantidade' => (int)$row['quantidade']];
    }
}

//Consulta dos 5 lançamentos mais recentes
$sqlLancamentos = "SELECT descricao, valor, metodo_pagamento, categoria, subcategoria, data, parcelas FROM lancamentos WHERE id_usuario = $id_usuario ORDER BY data DESC LIMIT 5";

$resultLancamentos = $mysqli->query($sqlLancamentos);
$resposta['lancamentos'] = [];

if ($resultLancamentos && $resultLancamentos->num_rows > 0) {
    while ($row = $resultLancamentos->fetch_assoc()) {
        $resposta['lancamentos'][] = $row;
    }
}

echo json_encode($resposta, JSON_UNESCAPED_UNICODE);
?>
