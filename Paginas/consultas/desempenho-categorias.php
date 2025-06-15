<?php
session_start();
include("../configs/config.php");

header('Content-Type: application/json');

$id_usuario = $_SESSION['id_usuario'];
if (!$id_usuario) {
    echo json_encode(['erro' => 'Usuário não autenticado']);
    exit;
}

// Verificar o plano do usuário
$plano = 0; // padrão: grátis
$sqlPlano = "SELECT plano FROM usuarios WHERE id_usuario = ? LIMIT 1";
$stmtPlano = $mysqli->prepare($sqlPlano);
$stmtPlano->bind_param("i", $id_usuario);
$stmtPlano->execute();
$resultPlano = $stmtPlano->get_result();

if ($resultPlano && $resultPlano->num_rows > 0) {
    $plano = (int)$resultPlano->fetch_assoc()['plano'];
}

$anoAtual = (int)date('Y');
$mesAtual = (int)date('n');
$anoAnterior = $anoAtual - 1;

$condicaoData = "";
$params = [];
$types = "i";

// Condições por plano
if ($plano === 0) {
    // Plano grátis: apenas os 3 meses recentes do ano atual
    $mesesPermitidos = [
        ($mesAtual - 2 + 12) % 12 ?: 12,
        ($mesAtual - 1 + 12) % 12 ?: 12,
        $mesAtual
    ];
    sort($mesesPermitidos);

    $condicaoData = "AND YEAR(data) = ? AND MONTH(data) IN (?, ?, ?)";
    $params = [$id_usuario, $anoAtual, $mesesPermitidos[0], $mesesPermitidos[1], $mesesPermitidos[2]];
    $types .= "iiii";
} else {
    // Plano premium: ano anterior inteiro + ano atual até mês atual
    $condicaoData = "AND (
        (YEAR(data) = ?)
        OR (YEAR(data) = ? AND MONTH(data) <= ?)
    )";
    $params = [$id_usuario, $anoAnterior, $anoAtual, $mesAtual];
    $types .= "iii";
}

// Montar a consulta
$sql = "SELECT 
        YEAR(data) AS ano,
        MONTH(data) AS mes,
        categoria,
        SUM(valor) AS total
        FROM lancamentos
        WHERE id_usuario = ?
        AND tipo = 1
        AND categoria IS NOT NULL AND categoria != ''
        $condicaoData
        GROUP BY ano, mes, categoria
        ORDER BY ano, mes
";

// Preparar a query com parâmetros dinâmicos
$stmt = $mysqli->prepare($sql);
$stmt->bind_param($types, ...$params);
$stmt->execute();
$result = $stmt->get_result();

$dados = [];

// Organizar os dados
while ($row = $result->fetch_assoc()) {
    $ano = $row['ano'];
    $mes = $row['mes'];
    $categoria = $row['categoria'];
    $total = (float)$row['total'];

    if (!isset($dados[$ano])) {
        $dados[$ano] = [];
    }
    if (!isset($dados[$ano][$mes])) {
        $dados[$ano][$mes] = [];
    }
    if (!isset($dados[$ano][$mes][$categoria])) {
        $dados[$ano][$mes][$categoria] = 0;
    }

    $dados[$ano][$mes][$categoria] += $total;
}

echo json_encode([
    'plano' => $plano === 1 ? 'premium' : 'gratis',
    'dados' => $dados
], JSON_UNESCAPED_UNICODE);
?>