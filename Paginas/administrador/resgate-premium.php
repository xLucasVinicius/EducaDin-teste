<?php
session_start();
include("../configs/config.php");
header('Content-Type: application/json');

$response = [];

if (!isset($_SESSION['id_usuario'])) {
    http_response_code(401);
    echo json_encode(['erro' => 'Usuário não autenticado.']);
    exit;
}

$usuario_id = $_SESSION['id_usuario'];
$premio_id = $_GET['premio_id'] ?? null;
$nome_premio = $_GET['premio_nome'] ?? null;
$valor_premio = $_GET['valor_moedas'] ?? null;

if (!$premio_id || !$nome_premio) {
    http_response_code(400);
    echo json_encode(['erro' => 'Parâmetros inválidos.']);
    exit;
}

if ($nome_premio === 'Plano Premium') {
    $sql_busca = "SELECT * FROM status_plano WHERE id_usuario = ?";
    $stmt_busca = $mysqli->prepare($sql_busca);
    $stmt_busca->bind_param("i", $usuario_id);
    $stmt_busca->execute();
    $result = $stmt_busca->get_result();
    $stmt_busca->close();

    $hoje = date('Y-m-d');

    if ($result->num_rows > 0) {
        $status = $result->fetch_assoc();

        if ($status['data_fim'] > $hoje) {
            $data_prorrogada = (new DateTime($status['data_fim']))->modify('+1 month')->format('Y-m-d');

            $sql_att = "UPDATE status_plano SET data_fim = ? WHERE id_usuario = ?";
            $stmt_att = $mysqli->prepare($sql_att);
            $stmt_att->bind_param("si", $data_prorrogada, $usuario_id);
            $stmt_att->execute();
            $stmt_att->close();
            $data_formatada = date('d/m/Y', strtotime($data_prorrogada));

            $response['mensagem'] = "foi prorrogado até $data_formatada";
        } else {
            // Caso a data atual já tenha passado, reinicia o plano por 1 mês
            $data_inicio = $hoje;
            $data_fim = (new DateTime($data_inicio))->modify('+1 month')->format('Y-m-d');

            $sql_renova = "UPDATE status_plano SET data_inicio = ?, data_fim = ? WHERE id_usuario = ?";
            $stmt_renova = $mysqli->prepare($sql_renova);
            $stmt_renova->bind_param("ssi", $data_inicio, $data_fim, $usuario_id);
            $stmt_renova->execute();
            $stmt_renova->close();

            $response['mensagem'] = "Plano reiniciado até $data_fim";
        }

    } else {
        $data_inicio = $hoje;
        $data_fim = (new DateTime($data_inicio))->modify('+1 month')->format('Y-m-d');

        $sql_insere = "INSERT INTO status_plano (id_usuario, data_inicio, data_fim) VALUES (?, ?, ?)";
        $stmt_insere = $mysqli->prepare($sql_insere);
        $stmt_insere->bind_param("iss", $usuario_id, $data_inicio, $data_fim);
        $stmt_insere->execute();
        $stmt_insere->close();
        $data_formatada = date('d/m/Y', strtotime($data_fim));
        $response['mensagem'] = "ativado até $data_formatada";

        $sql_att = "UPDATE usuarios SET plano = 1 WHERE id_usuario = ?";
        $stmt_att = $mysqli->prepare($sql_att);
        $stmt_att->bind_param("i", $usuario_id);
        $stmt_att->execute();
        $stmt_att->close();
    }
}

// Registrar troca do prêmio
$data_troca = date('Y-m-d');
$sql_insert_troca = "INSERT INTO trocas_premios (id_usuario, id_premio, data_troca) VALUES (?, ?, ?)";
$stmt_insert_troca = $mysqli->prepare($sql_insert_troca);
$stmt_insert_troca->bind_param("iis", $usuario_id, $premio_id, $data_troca);
$stmt_insert_troca->execute();
$stmt_insert_troca->close();

$sql_att_moedas = "UPDATE usuarios SET moedas = moedas - ? WHERE id_usuario = ?";
$stmt_att_moedas = $mysqli->prepare($sql_att_moedas);
$stmt_att_moedas->bind_param("ii", $valor_premio, $usuario_id);
$stmt_att_moedas->execute();
$stmt_att_moedas->close();

$response['status'] = 'success';
$response['premio'] = $nome_premio;

echo json_encode($response);
?>
