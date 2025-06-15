<?php
session_start();
include("../configs/config.php");

header('Content-Type: application/json');  // Defina o tipo de conteúdo como JSON

// Decodificando o corpo JSON enviado pelo JavaScript
$data = json_decode(file_get_contents('php://input'), true);

$_SESSION['id_minigame'] = $data['id_minigame'];

// Query SQL para buscar os 10 melhores recordes junto com as informações do usuário
$sql = "SELECT r.id_usuario, r.recorde_pontos, u.nome, u.sobrenome, u.foto_perfil 
        FROM recordes_mg r 
        JOIN usuarios u ON r.id_usuario = u.id_usuario
        WHERE r.id_minigame = ? 
        ORDER BY r.recorde_pontos DESC
        LIMIT 10
";

// Preparando e executando a query
$stmt = $mysqli->prepare($sql);
$stmt->bind_param("i", $_SESSION['id_minigame']);  // Bind do parâmetro para segurança
$stmt->execute();
$result = $stmt->get_result();

$response = array();  // Array principal para a resposta

// Verificando se a consulta retornou resultados
if ($result->num_rows > 0) {
    $ranking = array();
    while($row = $result->fetch_assoc()) {
        $ranking[] = $row;
    }
    $response['ranking'] = $ranking;  // Adiciona o ranking ao array de resposta
} else {
    $response['ranking'] = array();  // Caso não haja resultados, retorna um array vazio
}

echo json_encode($response);  // Retorna o JSON com o ranking
?>
