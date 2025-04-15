<?php 

include('config.php');

$id_usuario = $_POST['id_usuario'];
$metodo = $_POST['metodo'];
$id_conta = $_POST['conta'] ?? null;
$id_cartao = $_POST['cartao'] ?? null;
$descricao = $_POST['descricao'];
$valor = $_POST['valor'];
$tipo = $_POST['tipo'];
$categoria = $_POST['categoria'];
$subcategoria = $_POST['subcategoria'];
$data = $_POST['data'];
$parcelas = $_POST['parcelas'];
$valor = formatarValor($valor);

if ($tipo == 0) {
    $parcelas = 0;
}

// Inserir o lançamento
$query = "INSERT INTO lancamentos (id_usuario, id_conta, id_cartao, descricao, valor, tipo, metodo_pagamento, categoria, subcategoria, data, parcelas) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
$stmt = $mysqli->prepare($query);
$stmt->bind_param("iiisssssssi", $id_usuario, $id_conta, $id_cartao, $descricao, $valor, $tipo, $metodo, $categoria, $subcategoria, $data, $parcelas);
$stmt->execute();

// Se inseriu com sucesso, atualizar saldo_atual e desempenho
if ($stmt->affected_rows > 0) {

    // Atualizar o saldo atual da conta
    if (!is_null($id_conta)) {
        if ($tipo == 0) {
            // Receita: somar ao saldo
            $query_saldo = "UPDATE contas SET saldo_atual = saldo_atual + ? WHERE id_conta = ? AND id_usuario = ?";
        } else {
            // Despesa: subtrair do saldo
            $query_saldo = "UPDATE contas SET saldo_atual = saldo_atual - ? WHERE id_conta = ? AND id_usuario = ?";
        }

        $stmt_saldo = $mysqli->prepare($query_saldo);
        $stmt_saldo->bind_param("dii", $valor, $id_conta, $id_usuario);
        $stmt_saldo->execute();
    }

    $mes = date('n', strtotime($data)); // Extrai o mês (1 a 12)

    // Verifica se já existe um registro de desempenho para esse usuário, conta e mês
    $query_check = "SELECT id_desempenho FROM desempenho_anual WHERE id_usuario = ? AND id_conta = ? AND mes = ?";
    $stmt_check = $mysqli->prepare($query_check);
    $stmt_check->bind_param("iii", $id_usuario, $id_conta, $mes);
    $stmt_check->execute();
    $stmt_check->store_result();

    if ($stmt_check->num_rows > 0) {
        // Atualiza o valor dependendo do tipo
        if ($tipo == 0) {
            // Receita
            $query_update = "UPDATE desempenho_anual SET total_receitas = total_receitas + ? WHERE id_usuario = ? AND id_conta = ? AND mes = ?";
        } else {
            // Despesa
            $query_update = "UPDATE desempenho_anual SET total_despesas = total_despesas + ? WHERE id_usuario = ? AND id_conta = ? AND mes = ?";
        }
        $stmt_update = $mysqli->prepare($query_update);
        $stmt_update->bind_param("diii", $valor, $id_usuario, $id_conta, $mes);
        $stmt_update->execute();
    } else {
        // Cria novo registro com os valores corretos
        if ($tipo == 0) {
            $total_receitas = $valor;
            $total_despesas = 0;
        } else {
            $total_receitas = 0;
            $total_despesas = $valor;
        }

        $query_insert = "INSERT INTO desempenho_anual (id_usuario, id_conta, mes, total_receitas, total_despesas) VALUES (?, ?, ?, ?, ?)";
        $stmt_insert = $mysqli->prepare($query_insert);
        $stmt_insert->bind_param("iiidd", $id_usuario, $id_conta, $mes, $total_receitas, $total_despesas);
        $stmt_insert->execute();
    }

    echo json_encode(['status' => 'success']);
} else {
    echo json_encode(['status' => 'error']);
}

function formatarValor($valor) {
    $valor = str_replace("R$", "", $valor);
    $valor = str_replace(".", "", $valor);
    $valor = str_replace(",", ".", trim($valor));
    return floatval($valor);
}
?>
