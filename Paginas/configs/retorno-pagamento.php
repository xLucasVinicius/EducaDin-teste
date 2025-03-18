<?php
session_start();
require dirname(dirname(__DIR__)) . '/vendor/autoload.php';

include("config.php");

// Verifique se o pagamento foi aprovado
if (isset($_GET['status']) && $_GET['status'] == 'approved') {
    
    // Capturar o ID do usuário da URL
    $idUsuario = $_GET['id_usuario'];

    // Atualizar o plano do usuário para 'premium'
    $sql = "UPDATE usuarios SET plano = 'premium' WHERE id_usuario = ?";
    $stmt = $mysqli->prepare($sql);

    if ($stmt === false) {
        die("Erro ao preparar a consulta: " . $mysqli->error);
    }

    $stmt->bind_param("i", $idUsuario);
    
    if ($stmt->execute()) {
        echo "Plano atualizado com sucesso!";
        // Redirecionar para uma página de sucesso ou dashboard
        header("Location: logout.php");
        exit;
    } else {
        echo "Erro ao atualizar o plano: " . $stmt->error; // Usar $stmt->error ao invés de $conn->error
    }

    $stmt->close();
} else {
    echo "Pagamento não aprovado.";
    // Redirecionar para a página de erro
    header("Location: planos.php?status=failure");
    exit;
}

// Fechar a conexão
$mysqli->close();
?>
