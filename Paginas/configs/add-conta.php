<?php 

include("config.php");

$id_usuario = $_POST['id_usuario']; // ID do usuário
$nome_conta = $_POST['conta']; // Nome da conta
$saldo = $_POST['saldo']; // Saldo da conta
$tipo = $_POST['tipo']; // Tipo da conta

$sql_buscar_plano = "SELECT plano FROM usuarios WHERE id_usuario = ?";
$stmt_buscar_plano = $mysqli->prepare($sql_buscar_plano);
$stmt_buscar_plano->bind_param("i", $id_usuario);
$stmt_buscar_plano->execute();
$result_buscar_plano = $stmt_buscar_plano->get_result();
$plano = $result_buscar_plano->fetch_assoc()['plano'] ?? 0;

if ($plano == 0) {
    $sql_qntd_contas = "SELECT COUNT(*) FROM contas WHERE id_usuario = '$id_usuario'"; // Conta quantas contas o usuário tem
    $result_qntd_contas = $mysqli->query($sql_qntd_contas);
    $qntd_contas = $result_qntd_contas->fetch_row()[0];

    if ($qntd_contas >= 4) {
        echo json_encode(['status' => 'limite_contas']);
        exit();
    }
}

$saldo = formatarSalario($saldo); // Formata o saldo

$sqlTest = "SELECT * FROM contas WHERE nome_conta = '$nome_conta' AND categoria = '$tipo' AND id_usuario = '$id_usuario'"; // Verifica se a conta ja existe

if ($mysqli->query($sqlTest)->num_rows == 0) { // Se a conta nao existir
    $sql = "INSERT INTO contas (id_usuario, nome_conta, saldo_atual, categoria) VALUES (?, ?, ?, ?)"; // Insere a conta
    $stmt = $mysqli->prepare($sql); 
    $stmt->bind_param("issi", $id_usuario, $nome_conta, $saldo, $tipo);
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        // Pegar o ID da conta recém-criada
        $id_conta = $stmt->insert_id;

        // Dados para desempenho
        $mes = date('Y-m-01');
        $total_receitas = 0;
        $total_despesas = 0;
        $saldo_final = $saldo;

        // Inserir desempenho inicial
        $query_insert = "INSERT INTO desempenho_anual (id_usuario, id_conta, data_ref, total_receitas, total_despesas, saldo_final) VALUES (?, ?, ?, ?, ?, ?)";
        $stmt_insert = $mysqli->prepare($query_insert);
        $stmt_insert->bind_param("iisddd", $id_usuario, $id_conta, $mes, $total_receitas, $total_despesas, $saldo_final);
        $stmt_insert->execute();
        $stmt_insert->close();

        echo json_encode(['status' => 'success']); // Retorna uma resposta de sucesso
    } else {
        echo json_encode(['status' => 'error']); // Retorna uma resposta de erro
    }

    $stmt->close();
    $mysqli->close();

} else {
    echo json_encode(['status' => 'error_conta']); // Retorna uma resposta de erro por conta existente
}

// Funcao para formatar o salario
function formatarSalario($valor) {
    $valor = str_replace("R$", "", $valor);
    $valor = str_replace(".", "", $valor);
    $valor = str_replace(",", ".", trim($valor));
    $valor = floatval($valor);
    return $valor;
}
?>