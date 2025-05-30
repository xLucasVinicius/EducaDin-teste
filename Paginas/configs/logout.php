<?php
session_start();  // Inicia a sessão
session_unset();  // Remove todas as variáveis de sessão
session_destroy();  // Destroi a sessão

// Limpar o cookie
if (isset($_COOKIE['user'])) { // Verifica se o cookie existe
    setcookie('user', '', time() - 3600, "/");  // Define o cookie com tempo expirado
}

// Redirecionar para a página de login
header("Location: ../../index.php");
exit();
?>