<?php
session_start();
session_unset();  // Remove todas as variáveis de sessão
session_destroy();  // Destroi a sessão

// Limpar o cookie
if (isset($_COOKIE['user'])) {
    setcookie('user', '', time() - 3600, "/");  // Define o cookie com tempo expirado
}

// Redirecionar para a página de login
header("Location: inicio.php");
exit();
?>
