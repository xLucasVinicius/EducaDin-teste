<?php
// Dados da preferência
$preferenceData = [
    "items" => [[
        "title" => "Plano Premium EducaDin",
        "quantity" => 1,
        "unit_price" => 20.00
    ]],
    "back_urls" => [
        "success" => "https://educadin.com/Paginas/configs/retorno-pagamento.php?status=approved",
        "failure" => "https://educadin.com/Paginas/navbar.php?page=planos&status=failure",
        "pending" => "https://educadin.com/Paginas/navbar.php?page=planos&status=pending"
    ],
    "auto_return" => "approved"
];

// Inicializa cURL
$ch = curl_init("https://api.mercadopago.com/checkout/preferences");

curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($preferenceData));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Content-Type: application/json",
    "Authorization: Bearer APP_USR-5025392289696892-031815-76d692fa75852cfa3fb6d72523ff1a78-2335238967"
]);

$response = curl_exec($ch);

if (curl_errno($ch)) {
    http_response_code(500);
    echo json_encode(["error" => curl_error($ch)]);
} else {
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    if ($httpCode >= 200 && $httpCode < 300) {
        echo $response;
    } else {
        http_response_code($httpCode);
        echo json_encode(["error" => "Erro HTTP $httpCode", "response" => $response]);
    }
}

curl_close($ch);
exit;
?>
