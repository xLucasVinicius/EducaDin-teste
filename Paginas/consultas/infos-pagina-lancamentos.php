<?php
session_start();
date_default_timezone_set('America/Sao_Paulo');

include("../configs/config.php");

$id_usuario = $_SESSION['id_usuario'];
$mes_escolhido = $_POST['mes'] ?? date('Y-m');

// Calcular intervalo do mês
$inicio_mes = $mes_escolhido . '-01';
$fim_mes = date("Y-m-t", strtotime($inicio_mes));

// Buscar o plano do usuário
$query_plano = "SELECT plano FROM usuarios WHERE id_usuario = ?";
$stmt_plano = $mysqli->prepare($query_plano);
$stmt_plano->bind_param("i", $id_usuario);
$stmt_plano->execute();
$result_plano = $stmt_plano->get_result();
$plano = $result_plano->fetch_assoc()['plano'] ?? 0;

// Verificar acesso baseado no plano
if ($plano == 0) {
    $data_limite = new DateTime(); // Data atual
    $data_limite->modify('-2 months'); // Limite: 2 meses atrás
    $data_escolhida = DateTime::createFromFormat('Y-m', $mes_escolhido);

    if ($data_escolhida < $data_limite) {
        echo json_encode([
            'lancamentos' => [],
            'status' => 'limite_gratis',
            'total_receitas' => 0,
            'total_despesas' => 0,
            
        ]);
        exit;
    }
}

// Buscar lançamentos do mês
$query = "SELECT * FROM lancamentos WHERE id_usuario = ? AND data BETWEEN ? AND ?";
$stmt = $mysqli->prepare($query);
$stmt->bind_param("iss", $id_usuario, $inicio_mes, $fim_mes);
$stmt->execute();
$result = $stmt->get_result();
$lancamentos = $result->fetch_all(MYSQLI_ASSOC);

// Somar receitas
$query_total_receitas = "SELECT SUM(valor) AS total_receitas FROM lancamentos WHERE id_usuario = ? AND tipo = 0 AND data BETWEEN ? AND ?";
$stmt_total_receitas = $mysqli->prepare($query_total_receitas);
$stmt_total_receitas->bind_param("iss", $id_usuario, $inicio_mes, $fim_mes);
$stmt_total_receitas->execute();
$result_total_receitas = $stmt_total_receitas->get_result();
$total_receitas = $result_total_receitas->fetch_assoc()['total_receitas'] ?? 0;

// Somar despesas
$query_total_despesas = "SELECT SUM(valor) AS total_despesas FROM lancamentos WHERE id_usuario = ? AND tipo = 1 AND data BETWEEN ? AND ?";
$stmt_total_despesas = $mysqli->prepare($query_total_despesas);
$stmt_total_despesas->bind_param("iss", $id_usuario, $inicio_mes, $fim_mes);
$stmt_total_despesas->execute();
$result_total_despesas = $stmt_total_despesas->get_result();
$total_despesas = $result_total_despesas->fetch_assoc()['total_despesas'] ?? 0;

// Somar saldo final
$query_saldo_final = "SELECT SUM(saldo_final) AS saldo_final FROM desempenho_anual WHERE id_usuario = ? AND data_ref BETWEEN ? AND ?";
$stmt_saldo_final = $mysqli->prepare($query_saldo_final);
$stmt_saldo_final->bind_param("iss", $id_usuario, $inicio_mes, $fim_mes);
$stmt_saldo_final->execute();
$result_saldo_final = $stmt_saldo_final->get_result();
$saldo_final = $result_saldo_final->fetch_assoc()['saldo_final'] ?? 0;

// Retorno em JSON
echo json_encode([
    'lancamentos' => $lancamentos,
    'total_receitas' => $total_receitas,
    'total_despesas' => $total_despesas,
    'saldo_final' => $saldo_final
], JSON_UNESCAPED_UNICODE);
?>
