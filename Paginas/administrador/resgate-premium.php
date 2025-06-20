<?php
session_start();
include("../configs/config.php");
header('Content-Type: application/json');

$usuario_id = $_SESSION['id_usuario'];
$id_premio = $_GET['id_premio'];
?>
