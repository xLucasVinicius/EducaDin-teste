<?php
session_start();
include("../configs/config.php");
header('Content-Type: application/json');

$txtBusca = isset($_GET['search']) ? trim($_GET['search']) : '';
$response = [];

// Sempre busca todos os usuários no início
$sql_todos = "SELECT * FROM usuarios";
$result_todos = $mysqli->query($sql_todos);
$todos_usuarios = $result_todos->fetch_all(MYSQLI_ASSOC);

// Estatísticas iniciais
$totalUsuarios = count($todos_usuarios);
$totalMoedas = 0;
$totalPremium = 0;
$usuariosPorMes = [];

foreach ($todos_usuarios as $usuario) {
    $totalMoedas += isset($usuario['moedas']) ? (int)$usuario['moedas'] : 0;

    if (isset($usuario['plano']) && $usuario['plano'] == '1') {
        $totalPremium++;
    }

    if (isset($usuario['data_cadastro'])) {
        $data = new DateTime($usuario['data_cadastro']);
        $mesAno = $data->format('Y-m');

        if (!isset($usuariosPorMes[$mesAno])) {
            $usuariosPorMes[$mesAno] = 0;
        }

        $usuariosPorMes[$mesAno]++;
    }
}

// Média de trocas de prêmios por mês
$sql_trocas = "SELECT COUNT(*) AS total_trocas, MIN(data_troca) AS primeira_troca, MAX(data_troca) AS ultima_troca FROM trocas_premios";
$result_trocas = $mysqli->query($sql_trocas);
$dados_trocas = $result_trocas->fetch_assoc();

$totalTrocas = (int)$dados_trocas['total_trocas'];
$mediaTrocasMes = 0;

if ($totalTrocas > 0 && $dados_trocas['primeira_troca'] && $dados_trocas['ultima_troca']) {
    $dataInicio = new DateTime($dados_trocas['primeira_troca']);
    $dataFim = new DateTime($dados_trocas['ultima_troca']);
    $intervalo = $dataInicio->diff($dataFim);
    $meses = max(1, ($intervalo->y * 12) + $intervalo->m);
    $mediaTrocasMes = round($totalTrocas / $meses, 1);
}

// Média de contas por usuário (desconsiderando "Carteira")
$sql_contas = "SELECT COUNT(*) AS total_contas FROM contas WHERE nome_conta != 'Carteira'";
$result_contas = $mysqli->query($sql_contas);
$dados_contas = $result_contas->fetch_assoc();
$totalContas = (int)$dados_contas['total_contas'];

// Média de cartões por usuário
$sql_cartoes = "SELECT COUNT(*) AS total_cartoes FROM cartoes";
$result_cartoes = $mysqli->query($sql_cartoes);
$dados_cartoes = $result_cartoes->fetch_assoc();
$totalCartoes = (int)$dados_cartoes['total_cartoes'];

// Média combinada contas + cartões por usuário
$totalItens = $totalContas + $totalCartoes;
$mediaItensPorUsuario = $totalUsuarios > 0 ? round($totalItens / $totalUsuarios, 1) : 0;

$response['estatisticas'] = [
    'total_usuarios' => $totalUsuarios,
    'total_premium' => $totalPremium,
    'total_moedas' => $totalMoedas,
    'usuarios_por_mes' => $usuariosPorMes,
    'media_trocas_por_mes' => $mediaTrocasMes,
    'media_contas_cartoes' => $mediaItensPorUsuario
];

// Define a query de usuários com ou sem filtro
if ($txtBusca === '' || strtolower($txtBusca) === 'todos') {
    $response['usuarios'] = $todos_usuarios;
} else {
    $palavras = explode(' ', $txtBusca);
    $sql_usuarios = "SELECT * FROM usuarios WHERE 1=1";

    foreach ($palavras as $palavra) {
        $palavra = strtolower(trim($palavra));
        $palavraEscapada = $mysqli->real_escape_string($palavra);

        if ($palavra === 'gratis') {
            $sql_usuarios .= " AND plano = '0'";
        } elseif ($palavra === 'premium') {
            $sql_usuarios .= " AND plano = '1'";
        } else {
            $sql_usuarios .= " AND (
                nome LIKE '%$palavraEscapada%' OR 
                sobrenome LIKE '%$palavraEscapada%' OR 
                email LIKE '%$palavraEscapada%' OR 
                data_cadastro LIKE '%$palavraEscapada%'
            )";
        }
    }

    $sql_usuarios .= " ORDER BY id_usuario ASC";

    $result_usuarios = $mysqli->query($sql_usuarios);
    $usuarios_filtrados = $result_usuarios->fetch_all(MYSQLI_ASSOC);

    $response['usuarios'] = $usuarios_filtrados;
}

echo json_encode($response, JSON_PRETTY_PRINT);
?>
