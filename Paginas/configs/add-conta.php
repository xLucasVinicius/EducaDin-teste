<?php 

    include("config.php");

    $id_usuario = $_POST['id_usuario']; // ID do usuário
    $nome_conta = $_POST['conta']; // Nome da conta
    $saldo = $_POST['saldo']; // Saldo da conta

    $saldo = formatarSalario($saldo); // Formata o saldo

    $sqlTest = "SELECT * FROM contas WHERE nome_conta = '$nome_conta'"; // Verifica se a conta ja existe

    if ($mysqli->query($sqlTest)->num_rows == 0) { // Se a conta nao existir
        $sql = "INSERT INTO contas (id_usuario, nome_conta, saldo_atual) VALUES (?, ?, ?)"; // Insere a conta
        $stmt = $mysqli->prepare($sql); 
        $stmt->bind_param("iss", $id_usuario, $nome_conta, $saldo);
        $stmt->execute();

        if ($stmt->affected_rows > 0) {
            echo json_encode(['status' => 'success']); // Retorna uma resposta de sucesso
        } else {
            echo json_encode(['status' => 'error']); // Retorna uma resposta de erro
        }

        $stmt->close();
        $mysqli->close();

    } else {
        echo json_encode(['status' => 'error_conta']); // Retorna uma resposta de erro por contaexistente
    }

    // Funcao para formatar o salario
    function formatarSalario($valor) {
        $valor = str_replace("R$", "", $valor);
        $valor = str_replace(".", "", $valor);
        $valor = str_replace(",", ".", trim($valor));
        $valor = floatval($valor);
        return $valor;
    }
?>