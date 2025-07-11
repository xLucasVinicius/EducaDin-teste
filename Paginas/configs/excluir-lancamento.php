<?php

session_start();
include("config.php");

header('Content-Type: application/json');

$response = ['status' => 'error', 'message' => 'Ocorreu um erro.'];

if (!isset($_SESSION['id_usuario']) || !isset($_GET['id_lancamento'])) {
    echo json_encode(['status' => 'error', 'message' => 'Dados incompletos.']);
    exit;
}

$id_usuario = $_SESSION['id_usuario'];
$id_lancamento = $_GET['id_lancamento'];

$query_valor = "SELECT * FROM lancamentos WHERE id_lancamento = ? AND id_usuario = ?";
$stmt_valor = $mysqli->prepare($query_valor);
$stmt_valor->bind_param("ii", $id_lancamento, $id_usuario);
$stmt_valor->execute();
$result_valor = $stmt_valor->get_result();
$lancamento = $result_valor->fetch_assoc();
$stmt_valor->close();

if (!$lancamento) {
    echo json_encode(['status' => 'error', 'message' => 'Lançamento não encontrado.']);
    exit;
}

if ($lancamento['tipo'] == 2) {
    $valor = $lancamento['valor'];
    $id_conta_saida = $lancamento['id_conta'];
    $id_conta_entrada = $lancamento['id_conta_entrada'];
    $data = $lancamento['data'];
    $tipo = $lancamento['tipo'];
    $data_ref = date('Y-m-01', strtotime($data));

    if ($data_ref === date('Y-m-01')) {
        $query_att_saldo_conta_saida = "UPDATE contas SET saldo_atual = saldo_atual + ? WHERE id_conta = ? AND id_usuario = ?";
        $stmt_att_saldo_conta_saida = $mysqli->prepare($query_att_saldo_conta_saida);
        $stmt_att_saldo_conta_saida->bind_param("dii", $valor, $id_conta_saida, $id_usuario);
        $stmt_att_saldo_conta_saida->execute();
        $stmt_att_saldo_conta_saida->close();

        $query_att_desempenho = "UPDATE desempenho_anual SET total_despesas = total_despesas - ?, saldo_final = saldo_final + ? WHERE id_usuario = ? AND id_conta = ? AND data_ref = ?";
        $stmt_att_desempenho = $mysqli->prepare($query_att_desempenho);
        $stmt_att_desempenho->bind_param("ddiis", $valor, $valor, $id_usuario, $id_conta_saida, $data_ref);
        $stmt_att_desempenho->execute();
        $stmt_att_desempenho->close();

        $query_att_saldo_conta_entrada = "UPDATE contas SET saldo_atual = saldo_atual - ? WHERE id_conta = ? AND id_usuario = ?";
        $stmt_att_saldo_conta_entrada = $mysqli->prepare($query_att_saldo_conta_entrada);
        $stmt_att_saldo_conta_entrada->bind_param("dii", $valor, $id_conta_entrada, $id_usuario);
        $stmt_att_saldo_conta_entrada->execute();
        $stmt_att_saldo_conta_entrada->close();

        $query_att_desempenho = "UPDATE desempenho_anual SET total_receitas = total_receitas - ?, saldo_final = saldo_final - ? WHERE id_usuario = ? AND id_conta = ? AND data_ref = ?";
        $stmt_att_desempenho = $mysqli->prepare($query_att_desempenho);
        $stmt_att_desempenho->bind_param("ddiis", $valor, $valor, $id_usuario, $id_conta_entrada, $data_ref);
        $stmt_att_desempenho->execute();
        $stmt_att_desempenho->close();
    } else {
        $query_att_desempenho = "UPDATE desempenho_anual SET total_despesas = total_despesas - ?, saldo_final = saldo_final + ? WHERE id_usuario = ? AND id_conta = ? AND data_ref = ?";
        $stmt_att_desempenho = $mysqli->prepare($query_att_desempenho);
        $stmt_att_desempenho->bind_param("ddiis", $valor, $valor, $id_usuario, $id_conta_saida, $data_ref);
        $stmt_att_desempenho->execute();
        $stmt_att_desempenho->close();

        $query_att_desempenho = "UPDATE desempenho_anual SET total_receitas = total_receitas - ?, saldo_final = saldo_final - ? WHERE id_usuario = ? AND id_conta = ? AND data_ref = ?";
        $stmt_att_desempenho = $mysqli->prepare($query_att_desempenho);
        $stmt_att_desempenho->bind_param("ddiis", $valor, $valor, $id_usuario, $id_conta_entrada, $data_ref);
        $stmt_att_desempenho->execute();
        $stmt_att_desempenho->close();
    }

} else {
    $valor = $lancamento['valor'];
    $id_conta = $lancamento['id_conta'];
    $data = $lancamento['data'];
    $tipo = $lancamento['tipo'];
    $data_ref = date('Y-m-01', strtotime($data));

    if ($data_ref === date('Y-m-01')) {
        if ($tipo == 0) {
            $query_att_saldo_conta = "UPDATE contas SET saldo_atual = saldo_atual - ? WHERE id_conta = ? AND id_usuario = ?";
            $stmt_att_saldo_conta = $mysqli->prepare($query_att_saldo_conta);
            $stmt_att_saldo_conta->bind_param("dii", $valor, $id_conta, $id_usuario);
            $stmt_att_saldo_conta->execute();
            $stmt_att_saldo_conta->close();

            $query_att_desempenho = "UPDATE desempenho_anual SET total_receitas = total_receitas - ?, saldo_final = saldo_final - ? WHERE id_usuario = ? AND id_conta = ? AND data_ref = ?";
            $stmt_att_desempenho = $mysqli->prepare($query_att_desempenho);
            $stmt_att_desempenho->bind_param("ddiis", $valor, $valor, $id_usuario, $id_conta, $data_ref);
            $stmt_att_desempenho->execute();
            $stmt_att_desempenho->close();
        } else {
            $query_att_saldo_conta = "UPDATE contas SET saldo_atual = saldo_atual + ? WHERE id_conta = ? AND id_usuario = ?";
            $stmt_att_saldo_conta = $mysqli->prepare($query_att_saldo_conta);
            $stmt_att_saldo_conta->bind_param("dii", $valor, $id_conta, $id_usuario);
            $stmt_att_saldo_conta->execute();
            $stmt_att_saldo_conta->close();

            $query_att_desempenho = "UPDATE desempenho_anual SET total_despesas = total_despesas - ?, saldo_final = saldo_final + ? WHERE id_usuario = ? AND id_conta = ? AND data_ref = ?";
            $stmt_att_desempenho = $mysqli->prepare($query_att_desempenho);
            $stmt_att_desempenho->bind_param("ddiis", $valor, $valor, $id_usuario, $id_conta, $data_ref);
            $stmt_att_desempenho->execute();
            $stmt_att_desempenho->close();
        }
    } else {
        if ($tipo == 0) {
            $query_att_desempenho = "UPDATE desempenho_anual SET total_receitas = total_receitas - ?, saldo_final = saldo_final - ? WHERE id_usuario = ? AND id_conta = ? AND data_ref = ?";
            $stmt_att_desempenho = $mysqli->prepare($query_att_desempenho);
            $stmt_att_desempenho->bind_param("ddiis", $valor, $valor, $id_usuario, $id_conta, $data_ref);
            $stmt_att_desempenho->execute();
            $stmt_att_desempenho->close();
        } else {
            $query_att_desempenho = "UPDATE desempenho_anual SET total_despesas = total_despesas - ?, saldo_final = saldo_final + ? WHERE id_usuario = ? AND id_conta = ? AND data_ref = ?";
            $stmt_att_desempenho = $mysqli->prepare($query_att_desempenho);
            $stmt_att_desempenho->bind_param("ddiis", $valor, $valor, $id_usuario, $id_conta, $data_ref);
            $stmt_att_desempenho->execute();
            $stmt_att_desempenho->close();
        }
    }
}

$query = "DELETE FROM lancamentos WHERE id_lancamento = ? AND id_usuario = ?";
$stmt = $mysqli->prepare($query);
$stmt->bind_param("ii", $id_lancamento, $id_usuario);
$success = $stmt->execute();
$stmt->close();

if ($success) {
    echo json_encode(['status' => 'success', 'message' => 'Lançamento excluído com sucesso.']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Erro ao excluir o lançamento.']);
}
?>
