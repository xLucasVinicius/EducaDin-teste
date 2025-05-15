<?php

require __DIR__ . '/../../vendor/autoload.php';

MercadoPago\SDK::setAccessToken('APP_USR-5025392289696892-031815-76d692fa75852cfa3fb6d72523ff1a78-2335238967');

$item = new MercadoPago\Item();
$item->title = "Plano Premium EducaDin";
$item->quantity = 1;
$item->unit_price = 20.00;

$preference = new MercadoPago\Preference();
$preference->items = [$item];
$preference->back_urls = [
    "success" => "https://2c46-2804-1b3-a341-73b-c041-3fcd-9882-26e6.ngrok-free.app/EducaDin-teste/Paginas/configs/retorno-pagamento.php?status=approved",
    "failure" => "https://2c46-2804-1b3-a341-73b-c041-3fcd-9882-26e6.ngrok-free.app/EducaDin-teste/Paginas/navbar.php?page=planos&status=failure",
    "pending" => "https://2c46-2804-1b3-a341-73b-c041-3fcd-9882-26e6.ngrok-free.app/EducaDin-teste/Paginas/navbar.php?page=planos&status=pending"
];
$preference->auto_return = "approved";
$preference->save();

echo json_encode([
    "id" => $preference->id,
    "init_point" => $preference->init_point
]);
exit;

?>
