<?php 

include("../configs/config.php");
$id_premio = $_GET['id_premio'];
$premio = $mysqli->query("DELETE FROM premios WHERE id_premio = $id_premio");

if ($premio) {
    echo json_encode(['status' => 'success']);
}

?>