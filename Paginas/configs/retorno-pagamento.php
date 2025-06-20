<?php
session_start();
require dirname(dirname(__DIR__)) . '/vendor/autoload.php';
include("config.php");

// Define seu access token do Mercado Pago
MercadoPago\SDK::setAccessToken("APP_USR-5025392289696892-031815-76d692fa75852cfa3fb6d72523ff1a78-2335238967");

// Verifica se o payment_id está presente na URL
if (isset($_GET['payment_id'])) {
    $payment_id = $_GET['payment_id'];

    try {
        // Busca os dados do pagamento via API REST
        $payment = MercadoPago\Payment::find_by_id($payment_id);

        // Confirma se o pagamento existe e foi aprovado
        if ($payment && $payment->status === 'approved') {
            $idUsuario = $_SESSION['id_usuario'];

            // Atualiza o plano no banco de dados
            $sql = "UPDATE usuarios SET plano = 1 WHERE id_usuario = ?";
            $stmt = $mysqli->prepare($sql);
            $stmt->bind_param("i", $idUsuario);

            if ($stmt->execute()) {
                header("Location: https://educadin.com/Paginas/navbar.php?page=planos&status=success");
                exit;
            } else {
                echo "Erro ao atualizar o plano: " . $stmt->error;
            }

            $stmt->close();

            $data_atual = date('Y-m-d');
            $data_final = date('Y-m-d', strtotime('+1 month'));

            $sql_busca = "SELECT * FROM status_plano WHERE id_usuario = ?";
            $stmt_busca = $mysqli->prepare($sql_busca);
            $stmt_busca->bind_param("i", $idUsuario);
            $stmt_busca->execute();
            $result = $stmt_busca->get_result();

            if ($result->num_rows > 0) {
                $sql_update = "UPDATE status_plano SET data_inicio = ?, data_fim = ? WHERE id_usuario = ?";
                $stmt_update = $mysqli->prepare($sql_update);
                $stmt_update->bind_param("ssi", $data_atual, $data_final, $idUsuario);
                $stmt_update->execute();
                $stmt_update->close();
            } else {
                $sql_insert = "INSERT INTO status_plano (id_usuario, data_inicio, data_fim) VALUES (?, ?, ?)";
                $stmt_insert = $mysqli->prepare($sql_insert);
                $stmt_insert->bind_param("iss", $idUsuario, $data_atual, $data_final);
                $stmt_insert->execute();
                $stmt_insert->close();
            }

        } else {
            // Pagamento não aprovado
            header("Location: https://educadin.com/Paginas/navbar.php?page=planos&status=failure");
            exit;
        }

    } catch (Exception $e) {
        echo "Erro ao verificar pagamento: " . $e->getMessage();
    }

} else {
    echo "ID do pagamento não fornecido.";
    header("Location: https://educadin.com/Paginas/navbar.php?page=planos");
    exit;
}

$mysqli->close();
?>
