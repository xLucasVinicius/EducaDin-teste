<?php
include('config.php');

$id_cartao = $_GET['id_cartao']; // Obtenha o ID da cartao da URL
$id_usuario = $_GET['id_usuario']; // Obtenha o ID do usuário da URL

if ($id_cartao && $id_usuario) {
    // Realize a exclusão da cartao no banco de dados
    $sql = "DELETE FROM cartoes WHERE id_cartao = ? AND id_usuario = ?";
    $stmt = $mysqli->prepare($sql);
    $stmt->bind_param("ii", $id_cartao, $id_usuario);
    
    if ($stmt->execute()) {
        echo json_encode(['sucesso' => true, 'mensagem' => 'Cartao excluída com sucesso.']); // Retorne uma resposta de sucesso
    } else {
        echo json_encode(['sucesso' => false, 'mensagem' => 'Erro ao excluir a cartao.']); // Retorne uma resposta de erro
    }
} else {
    echo json_encode(['sucesso' => false, 'mensagem' => 'Parâmetros inválidos.']); // Retorne uma resposta de erro
}
?>
