<?php 

include("config.php");

// Percorrer $_POST e corrigir os nomes dos atributos
foreach ($_POST as $key => $value) {
  $newKey = str_replace('-editar', '', $key);
  $_POST[$newKey] = $value; // Substitui no array $_POST
}

$id_usuario = $_POST['id_usuario'] ?? null;
$id_conta = $_POST['conta'] ?? null;
$tipo = $_POST['tipo'];
$limite_total = $_POST['limite'] ?? null;
$dia_fechamento = $_POST['fechamento'] ?? null;
$dia_vencimento = $_POST['vencimento'] ?? null;
$anuidade = $_POST['anuidade-valor'];
$pontos = $_POST['pontos'];
$id_cartao = $_POST['id_cartao'] ?? null;

// Formatar anuidade, se não for zero
$anuidade = (!empty($anuidade)) ? formatarLimite($anuidade) : null;

// Formatar o limite total
$limite_total = formatarLimite($limite_total);

if (!isset($_POST['id_cartao']) || empty($_POST['id_cartao'])) {  
    // Verificar se já existe um cartão associado à conta
    $sqlTest = "SELECT * FROM cartoes WHERE id_conta = ?";
    $stmtTest = $mysqli->prepare($sqlTest);
    $stmtTest->bind_param("i", $id_conta);
    $stmtTest->execute();
    $result_cartao = $stmtTest->get_result();

    if ($result_cartao->num_rows == 0) { 
        // Inserir novo cartão
        if (is_null($anuidade)) {
                $sql = "INSERT INTO cartoes (id_conta, id_usuario, tipo, limite_total, dia_fechamento, dia_vencimento, pontos) VALUES (?, ?, ?, ?, ?, ?, ?)";
                $stmt = $mysqli->prepare($sql);
                $stmt->bind_param("iiidiii", $id_conta, $id_usuario, $tipo, $limite_total, $dia_fechamento, $dia_vencimento, $pontos);
        } else {
                $sql = "INSERT INTO cartoes (id_conta, id_usuario, tipo, limite_total, dia_fechamento, dia_vencimento, anuidade, pontos) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
                $stmt = $mysqli->prepare($sql);
                $stmt->bind_param("iiidiidi", $id_conta, $id_usuario, $tipo, $limite_total, $dia_fechamento, $dia_vencimento, $anuidade, $pontos);
        }

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
} else {
    // Atualizar cartão existente
    $id_cartao = $_POST['id_cartao'];
    
    if (is_null($anuidade)) {
        $sql = "UPDATE cartoes SET limite_total = ?, dia_fechamento = ?, dia_vencimento = ?, pontos = ? WHERE id_cartao = ?";
        $stmt = $mysqli->prepare($sql);
        $stmt->bind_param("diiii", $limite_total, $dia_fechamento, $dia_vencimento, $pontos, $id_cartao);
    } else {
        $sql = "UPDATE cartoes SET limite_total = ?, dia_fechamento = ?, dia_vencimento = ?, anuidade = ?, pontos = ? WHERE id_cartao = ?";
        $stmt = $mysqli->prepare($sql);
        $stmt->bind_param("diiidi", $limite_total, $dia_fechamento, $dia_vencimento, $anuidade, $pontos, $id_cartao);
    }

    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        echo json_encode(['status' => 'updated']); 
    } else {
        echo json_encode(['status' => 'no_changes']); 
    }

    $stmt->close();
}

// Função para formatar o limite
function formatarLimite($limite_total) {
    $limite_total = str_replace("R$", "", $limite_total);
    $limite_total = str_replace(".", "", $limite_total);
    $limite_total = str_replace(",", ".", trim($limite_total));
    return floatval($limite_total);
}
?>
