<?php 

include("config.php");

// Receber dados do formulário
$id_usuario = $_POST['id_usuario'];
$id_conta = $_POST['conta'];
$limite_total = $_POST['limite'];
$dia_fechamento = $_POST['fechamento'];
$dia_vencimento = $_POST['vencimento'];
$anuidade = $_POST['anuidade'] ?? null;
$pontos = $_POST['pontos'];

// Formatar anuidade, se não for zero
if (!empty($anuidade)) {
    $anuidade = formatarLimite($anuidade);
} else {
    $anuidade = null;
}

// Formatar o limite total
$limite_total = formatarLimite($limite_total);

// Verificar se já existe um cartão associado à conta
$sqlTest = "SELECT * FROM cartoes WHERE id_conta = ?";
$stmtTest = $mysqli->prepare($sqlTest);
$stmtTest->bind_param("i", $id_conta);
$stmtTest->execute();
$result_cartao = $stmtTest->get_result();

if ($result_cartao->num_rows == 0) {
    // Inserir cartão se ainda não existir
    if (is_null($anuidade)) {
        $sql = "INSERT INTO cartoes (id_conta, id_usuario, limite_total, dia_fechamento, dia_vencimento, pontos) VALUES (?, ?, ?, ?, ?, ?)";
        $stmt = $mysqli->prepare($sql);
        $stmt->bind_param("iidiii", $id_conta, $id_usuario, $limite_total, $dia_fechamento, $dia_vencimento, $pontos);
    } else {
        $sql = "INSERT INTO cartoes (id_conta, id_usuario, limite_total, dia_fechamento, dia_vencimento, anuidade, pontos) VALUES (?, ?, ?, ?, ?, ?, ?)";
        $stmt = $mysqli->prepare($sql);
        $stmt->bind_param("iidiidi", $id_conta, $id_usuario, $limite_total, $dia_fechamento, $dia_vencimento, $anuidade, $pontos);
    }
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        echo json_encode(['status' => 'success']); // Retorna uma resposta de sucesso
    } else {
        echo json_encode(['status' => 'error']); // Retorna uma resposta de erro
    }

    $stmt->close();
} else {
    echo json_encode(['status' => 'error_cartao']); // Retorna uma resposta de erro para cartão existente
}

$stmtTest->close();
$mysqli->close();

// Função para formatar o limite
function formatarLimite($limite_total) {
    $limite_total = str_replace("R$", "", $limite_total);
    $limite_total = str_replace(".", "", $limite_total);
    $limite_total = str_replace(",", ".", trim($limite_total));
    return floatval($limite_total);
}
?>
