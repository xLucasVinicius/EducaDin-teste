<?php
// Arquivo de notificação (webhook)
require dirname(dirname(__DIR__)) . '/vendor/autoload.php';
use MercadoPago\SDK;
use MercadoPago\Payment;

// Defina seu token de acesso
SDK::setAccessToken('APP_USR-5025392289696892-031815-76d692fa75852cfa3fb6d72523ff1a78-2335238967');

// Receber a notificação do Mercado Pago
$mpData = file_get_contents('php://input'); // Dados recebidos do Mercado Pago

// Decodificar o JSON enviado pelo Mercado Pago
$data = json_decode($mpData);

// Aqui você pode tratar os dados. Exemplo, verificar o status do pagamento
if (isset($data->id)) {
    // Buscar o pagamento pela ID
    $payment = Payment::find_by_id($data->id);
    // Verifique o status do pagamento (exemplo)
    if ($payment->status == 'approved') {
        // O pagamento foi aprovado
        // Realize ações necessárias, como atualizar o status da compra ou enviar um e-mail para o usuário
    }
}

// Retorne um status de sucesso para o Mercado Pago
header("HTTP/1.1 200 OK");
echo "OK";
?>
