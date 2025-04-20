<?php 

include("config.php");

$id_usuario = $_POST['id_usuario']; // ID do usuário
$nome_conta = $_POST['conta']; // Nome da conta
$saldo = $_POST['saldo']; // Saldo da conta
$tipo = $_POST['tipo']; // Tipo da conta

$saldo = formatarSalario($saldo); // Formata o saldo

$sqlTest = "SELECT * FROM contas WHERE nome_conta = '$nome_conta' AND categoria = '$tipo'"; // Verifica se a conta ja existe

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
