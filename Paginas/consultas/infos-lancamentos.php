<?php

include("../configs/config.php");

$query = "SELECT * FROM lancamentos WHERE id_usuario = 1 ORDER BY data DESC LIMIT 5";
$result = $mysqli->query($query);

echo json_encode($result->fetch_all(MYSQLI_ASSOC));

?>