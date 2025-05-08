<?php
session_start();
require dirname(dirname(__DIR__)) . '/vendor/autoload.php';


use MercadoPago\SDK;
use MercadoPago\Preference;
use MercadoPago\Item;

SDK::setAccessToken('APP_USR-5025392289696892-031815-76d692fa75852cfa3fb6d72523ff1a78-2335238967');

// Verifique o ID do usuário na sessão
$id_Usuario = $_SESSION['id_usuario']; // ID do usuário logado

// Verifique qual plano foi selecionado
$plano = $_POST['plano'];

// Crie a preferência de pagamento
$preference = new Preference();

$item = new Item();
$item->title = 'Plano Premium';
$item->quantity = 1;

if ($plano == 'premium') {
    $item->unit_price = 20.00; // Preço do plano Premium mensal
} else {
    // Caso necessário, adicionar outros planos
    $item->unit_price = 0.00;
}

$preference->items = array($item);

// URLs de redirecionamento
$preference->back_urls = array(
    "success" => "http://localhost:3000/EducaDin-teste/Paginas/configs/retorno-pagamento.php?id_usuario=" . $id_Usuario,
    "failure" => "http://localhost:3000/EducaDin-teste/Paginas/configs/falha.php",
    "pending" => "http://localhost:3000/EducaDin-teste/Paginas/configs/pendente.php"
);

$preference->auto_return = "approved"; // Retornar automaticamente após pagamento aprovado
$preference->save();

header("Location: " . $preference->init_point); // Redirecionar para o Mercado Pago
?>
