<?php 

include("config.php");

// Receber dados do formulário
$id_usuario = $_POST['id_usuario'];
$id_conta = $_POST['conta'];  // Já é o id da conta
$limite_total = $_POST['limite'];
$dia_fechamento = $_POST['fechamento'];
$dia_vencimento = $_POST['vencimento'];

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
    $sql = "INSERT INTO cartoes (id_conta, id_usuario, limite_total, dia_fechamento, dia_vencimento) VALUES (?, ?, ?, ?, ?)";
    $stmt = $mysqli->prepare($sql);
    $stmt->bind_param("iidii", $id_conta, $id_usuario, $limite_total, $dia_fechamento, $dia_vencimento);
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        echo json_encode(['status' => 'success']);
    } else {
        echo json_encode(['status' => 'error']);
    }

    $stmt->close();
} else {
    echo json_encode(['status' => 'error_cartao']);
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
