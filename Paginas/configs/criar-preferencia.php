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
    "success" => "https://educadin.ct.ws/Paginas/configs/retorno-pagamento.php?status=approved",
    "failure" => "https://educadin.ct.ws/Paginas/navbar.php?page=planos&status=failure",
    "pending" => "https://educadin.ct.ws/Paginas/navbar.php?page=planos&status=pending"
];
$preference->auto_return = "approved";
$preference->save();

echo json_encode([
    "id" => $preference->id,
    "init_point" => $preference->init_point
]);
exit;

?>
