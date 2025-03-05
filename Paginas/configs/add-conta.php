<?php 

    include("config.php");

    $id_usuario = $_POST['id_usuario'];
    $nome_conta = $_POST['conta'];
    $saldo = $_POST['saldo'];

    $saldo = formatarSalario($saldo);

    $sqlTest = "SELECT * FROM contas WHERE nome_conta = '$nome_conta'";

    if ($mysqli->query($sqlTest)->num_rows == 0) {
        $sql = "INSERT INTO contas (id_usuario, nome_conta, saldo_atual) VALUES (?, ?, ?)";
        $stmt = $mysqli->prepare($sql);
        $stmt->bind_param("iss", $id_usuario, $nome_conta, $saldo);
        $stmt->execute();

        if ($stmt->affected_rows > 0) {
            echo json_encode(['status' => 'success']);
        } else {
            echo json_encode(['status' => 'error']);
        }

        $stmt->close();
        $mysqli->close();

    } else {
        echo json_encode(['status' => 'error_conta']);
    }

    function formatarSalario($valor) {
        $valor = str_replace("R$", "", $valor);
        $valor = str_replace(".", "", $valor);
        $valor = str_replace(",", ".", trim($valor));
        $valor = floatval($valor);
        return $valor;
    }
?>