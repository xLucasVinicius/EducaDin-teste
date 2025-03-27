<?php
include('config.php');

$id_conta = $_GET['id_conta']; // Obtenha o ID da conta da URL
$id_usuario = $_GET['id_usuario']; // Obtenha o ID do usuário da URL

if ($id_conta && $id_usuario) {
    // Realize a exclusão da conta no banco de dados
    $sql = "DELETE FROM contas WHERE id_conta = ? AND id_usuario = ?";
    $stmt = $mysqli->prepare($sql);
    $stmt->bind_param("ii", $id_conta, $id_usuario);
    
    if ($stmt->execute()) {
        echo json_encode(['sucesso' => true, 'mensagem' => 'Conta excluída com sucesso.']); // Retorne uma resposta de sucesso
    } else {
        echo json_encode(['sucesso' => false, 'mensagem' => 'Erro ao excluir a conta.']); // Retorne uma resposta de erro
    }
} else {
    echo json_encode(['sucesso' => false, 'mensagem' => 'Parâmetros inválidos.']); // Retorne uma resposta de erro
}
?>
