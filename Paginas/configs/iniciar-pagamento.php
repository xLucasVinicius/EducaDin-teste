<?php
session_start();

require dirname(dirname(__DIR__)) . '/vendor/autoload.php';

use MercadoPago\MercadoPagoConfig;
use MercadoPago\Client\Preference\PreferenceClient;
use MercadoPago\Client\Preference\PreferenceRequest;
use MercadoPago\Client\Preference\PreferenceItemRequest;

// Configurar o token de acesso
MercadoPagoConfig::setAccessToken('APP_USR-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');

// Obter ID do usuário e plano selecionado
$id_Usuario = $_SESSION['id_usuario'];
$plano = $_POST['plano'];

// Criar item
$item = new PreferenceItemRequest();
$item->title = 'Plano Premium';
$item->quantity = 1;
$item->unit_price = $plano === 'premium' ? 20.00 : 0.00;

// Criar preferência
$request = new PreferenceRequest();
$request->items = [$item];
$request->back_urls = [
    "success" => "http://localhost:3000/EducaDin-teste/Paginas/configs/retorno-pagamento.php?id_usuario=$id_Usuario",
    "failure" => "http://localhost:3000/EducaDin-teste/Paginas/configs/falha.php",
    "pending" => "http://localhost:3000/EducaDin-teste/Paginas/configs/pendente.php"
];
$request->auto_return = "approved";

// Criar cliente e enviar
$client = new PreferenceClient();
$preference = $client->create($request);

// Redirecionar para o Mercado Pago
header("Location: " . $preference->init_point);
exit;
?>
