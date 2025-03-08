<?php
include('config.php');

$id_conta = $_GET['id_conta'];
$id_usuario = $_GET['id_usuario'];

if ($id_conta && $id_usuario) {
    // Realize a exclusão da conta no banco de dados, por exemplo:
    $sql = "DELETE FROM contas WHERE id_conta = ? AND id_usuario = ?";
    $stmt = $mysqli->prepare($sql);
    $stmt->bind_param("ii", $id_conta, $id_usuario);
    
    if ($stmt->execute()) {
        echo json_encode(['sucesso' => true, 'mensagem' => 'Conta excluída com sucesso.']);
    } else {
        echo json_encode(['sucesso' => false, 'mensagem' => 'Erro ao excluir a conta.']);
    }
} else {
    echo json_encode(['sucesso' => false, 'mensagem' => 'Parâmetros inválidos.']);
}
?>
