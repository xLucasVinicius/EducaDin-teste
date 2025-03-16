<?php
include('config.php');

$id_cartao = $_GET['id_cartao'];
$id_usuario = $_GET['id_usuario'];

if ($id_cartao && $id_usuario) {
    // Realize a exclusão da cartao no banco de dados, por exemplo:
    $sql = "DELETE FROM cartoes WHERE id_cartao = ? AND id_usuario = ?";
    $stmt = $mysqli->prepare($sql);
    $stmt->bind_param("ii", $id_cartao, $id_usuario);
    
    if ($stmt->execute()) {
        echo json_encode(['sucesso' => true, 'mensagem' => 'Cartao excluída com sucesso.']);
    } else {
        echo json_encode(['sucesso' => false, 'mensagem' => 'Erro ao excluir a cartao.']);
    }
} else {
    echo json_encode(['sucesso' => false, 'mensagem' => 'Parâmetros inválidos.']);
}
?>
