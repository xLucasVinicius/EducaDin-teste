<?php
session_start();
require dirname(dirname(__DIR__)) . '/vendor/autoload.php';

include("config.php");

// Verifique se o pagamento foi aprovado
if (isset($_GET['status']) && $_GET['status'] == 'approved') {
    
    // Capturar o ID do usuário da URL
    $idUsuario = $_SESSION['id_usuario'];

    // Atualizar o plano do usuário para 'premium'
    $sql = "UPDATE usuarios SET plano = 1 WHERE id_usuario = ?";
    $stmt = $mysqli->prepare($sql);
    $stmt->bind_param("i", $idUsuario);
    
    if ($stmt->execute()) {
        echo "Plano atualizado com sucesso!";
        // Redirecionar para uma página de sucesso ou dashboard
        header("Location: https://2c46-2804-1b3-a341-73b-c041-3fcd-9882-26e6.ngrok-free.app/EducaDin-teste/Paginas/navbar.php?page=planos&status=success");
        exit;
    } else {
        echo "Erro ao atualizar o plano: " . $stmt->error; // Usar $stmt->error ao invés de $conn->error
    }
    $stmt->close();
} else {
    echo "Pagamento não aprovado.";
    // Redirecionar para a página de pagamento novamente
    header("Location: https://2c46-2804-1b3-a341-73b-c041-3fcd-9882-26e6.ngrok-free.app/EducaDin-teste/Paginas/navbar.php?page=planos");
    exit;
}

// Fechar a conexão
$mysqli->close();
?>
