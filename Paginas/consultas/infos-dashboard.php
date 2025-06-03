<?php

session_start();
date_default_timezone_set('America/Sao_Paulo');
include("../configs/config.php");
header('Content-Type: application/json');

$id_usuario = $_SESSION['id_usuario'];
$resposta = [];

if (isset($_GET['data']) && preg_match('/^\d{2}\/\d{4}$/', $_GET['data'])) {
    [$mesSelecionado, $anoSelecionado] = explode('/', $_GET['data']);
    $mesSelecionado = (int)$mesSelecionado;
    $anoSelecionado = (int)$anoSelecionado;
} else {
    $mesSelecionado = (int)date('n');
    $anoSelecionado = (int)date('Y');
}

// Consulta: Obter o plano (0 = grátis, 1 = premium)
$sqlPlano = "SELECT plano FROM usuarios WHERE id_usuario = $id_usuario LIMIT 1";
$resultPlano = $mysqli->query($sqlPlano);

$plano = 0; // padrão: grátis
if ($resultPlano && $resultPlano->num_rows > 0) {
    $plano = (int)$resultPlano->fetch_assoc()['plano'];
}

$resposta['plano'] = $plano === 1 ? 'premium' : 'gratis';

// Consulta: Dados do desempenho anual
$sqlDesempenho = "SELECT MONTH(data_ref) AS mes, YEAR(data_ref) AS ano, saldo_final FROM desempenho_anual WHERE id_usuario = $id_usuario";
$resultDesempenho = $mysqli->query($sqlDesempenho);

$valoresMensais = array_fill(0, 12, 0);
$anoAtual = (int)date('Y');

if ($resultDesempenho && $resultDesempenho->num_rows > 0) {
    while ($row = $resultDesempenho->fetch_assoc()) {
        $mesIndex = (int)$row['mes'] - 1;
        $anoRegistro = (int)$row['ano'];

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

// --------- Montar array dos meses disponíveis para o seletor ---------

$resposta['seletor'] = [];

$sqlDatas = "SELECT DISTINCT DATE_FORMAT(data, '%m/%Y') AS mes_ano, data
             FROM lancamentos
             WHERE id_usuario = $id_usuario
               AND tipo = 1
               AND categoria IS NOT NULL
               AND categoria != ''
             ORDER BY data DESC";

$resultDatas = $mysqli->query($sqlDatas);

$anoAtual = (int)date('Y');
$mesAtual = (int)date('m');
$mesAnoAtual = str_pad($mesAtual, 2, '0', STR_PAD_LEFT) . '/' . $anoAtual;

$mesesExistentes = [];

if ($resultDatas && $resultDatas->num_rows > 0) {
    $contador = 0;

    while ($row = $resultDatas->fetch_assoc()) {
        $dataLancamento = DateTime::createFromFormat('Y-m-d', $row['data']);
        $mesLancamento = (int)$dataLancamento->format('m');
        $anoLancamento = (int)$dataLancamento->format('Y');

        // Para plano grátis: ignora meses futuros
        if ($plano === 0 && ($anoLancamento > $anoAtual || ($anoLancamento === $anoAtual && $mesLancamento > $mesAtual))) {
            continue;
        }

        // Para plano grátis: limita a 3 meses mais recentes
        if ($plano === 0 && $contador >= 3) {
            break;
        }

        $mesAno = $row['mes_ano'];
        $mesesExistentes[] = $mesAno;
        $resposta['seletor'][] = $mesAno;
        $contador++;
    }
}

// Garante que o mês atual esteja presente
if (!in_array($mesAnoAtual, $mesesExistentes)) {
    if ($plano === 0 && count($resposta['seletor']) >= 3) {
        array_pop($resposta['seletor']); // remove o mais antigo
    }
    array_unshift($resposta['seletor'], $mesAnoAtual); // adiciona o mês atual no início
}


// Verifica se o plano gratuito está acessando meses fora dos permitidos (bloqueio categorias)
$bloquearCategorias = false;
if ($plano === 0) {
    $dataAtual = new DateTime();
    $dataSelecionada = DateTime::createFromFormat('m/Y', str_pad($mesSelecionado, 2, '0', STR_PAD_LEFT) . '/' . $anoSelecionado);

    // Pega 2 meses anteriores
    $dataLimite = (clone $dataAtual)->modify('-2 months');

    if ($dataSelecionada < $dataLimite) {
        $bloquearCategorias = true;
    }
}

// Consulta: Categorias dos lançamentos (somente se não bloqueado)
$resposta['categorias'] = [];
if (!$bloquearCategorias) {
    $sqlCategorias = "SELECT categoria, COUNT(*) as quantidade FROM lancamentos 
                      WHERE id_usuario = $id_usuario 
                      AND categoria IS NOT NULL AND categoria != '' 
                      AND MONTH(data) = $mesSelecionado AND YEAR(data) = $anoSelecionado  
                      AND tipo = 1 
                      GROUP BY categoria";
    $resultCategorias = $mysqli->query($sqlCategorias);

    if ($resultCategorias && $resultCategorias->num_rows > 0) {
        while ($row = $resultCategorias->fetch_assoc()) {
            $resposta['categorias'][] = [
                'nome' => $row['categoria'],
                'quantidade' => (int)$row['quantidade']
            ];
        }
    }
}

// Consulta dos 5 lançamentos mais recentes
$sqlLancamentos = "SELECT descricao, valor, metodo_pagamento, categoria, subcategoria, data, parcelas 
                   FROM lancamentos 
                   WHERE id_usuario = $id_usuario 
                   ORDER BY data DESC LIMIT 5";
$resultLancamentos = $mysqli->query($sqlLancamentos);
$resposta['lancamentos'] = [];

if ($resultLancamentos && $resultLancamentos->num_rows > 0) {
    while ($row = $resultLancamentos->fetch_assoc()) {
        $resposta['lancamentos'][] = $row;
    }
}

echo json_encode($resposta, JSON_UNESCAPED_UNICODE);

?>