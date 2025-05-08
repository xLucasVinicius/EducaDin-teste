<?php
session_start();
include("../configs/config.php");
header('Content-Type: application/json');

$id_usuario = $_SESSION['id_usuario'];
$resposta = [];

// Buscar salário e plano do usuário
$sqlUsuario = "SELECT salario, plano FROM usuarios WHERE id_usuario = $id_usuario LIMIT 1";
$resultUsuario = $mysqli->query($sqlUsuario);
$salario = 0;
$plano = 0;

if ($resultUsuario && $resultUsuario->num_rows > 0) {
    $rowUsuario = $resultUsuario->fetch_assoc();
    $salario = (float)$rowUsuario['salario'];
    $plano = (int)$rowUsuario['plano'];
}

$resposta['salario'] = $salario;
$resposta['plano'] = $plano == 1 ? 'premium' : 'gratis';

// Obter a data recebida via GET
$dataSelecionada = isset($_GET['data']) ? $_GET['data'] : date('m/Y');
list($mesSelecionado, $anoSelecionado) = explode('/', $dataSelecionada);

// Verificação para plano gratuito: limitar aos últimos 3 meses
if ($plano == 0) {
    $dataInformada = DateTime::createFromFormat('m/Y', $dataSelecionada);
    $dataLimite = new DateTime(); // mês atual
    $dataLimite->modify('-2 months'); // inclui o mês atual e os dois anteriores

    if ($dataInformada < $dataLimite) {
        echo json_encode([
            'erro' => 'Acesso restrito aos últimos 3 meses para usuários do plano gratuito.'
        ]);
        exit;
    }
}

// Consulta filtrada por mês/ano
$sql = "
    SELECT 
        categoria,
        SUM(valor) AS total
    FROM lancamentos
    WHERE id_usuario = $id_usuario
      AND tipo = 1
      AND categoria IS NOT NULL
      AND categoria != ''
      AND MONTH(data) = $mesSelecionado
      AND YEAR(data) = $anoSelecionado
    GROUP BY categoria
    ORDER BY total DESC
";

$result = $mysqli->query($sql);
$resposta['totais'] = [];
$resposta['essenciais'] = 0;
$resposta['desnecessarias'] = 0;

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $categoria = $row['categoria'];
        $total = (float)$row['total'];

        $essenciais = ['Moradia', 'Alimentação', 'Transporte', 'Educação', 'Saúde', 'Impostos', 'Serviços'];
        $desnecessarias = ['Lazer', 'Vestuário', 'Despesas_Gerais', 'Outros'];

        if (in_array($categoria, $essenciais)) {
            $resposta['essenciais'] += $total;
        } elseif (in_array($categoria, $desnecessarias)) {
            $resposta['desnecessarias'] += $total;
        }

        $resposta['totais'][] = [
            'categoria' => $categoria,
            'total' => $total
        ];
    }
}

// Popular seletor de datas
$mesAtual = (int)date('n');
$anoAtual = (int)date('Y');
$anoAnterior = $anoAtual - 1;
$resposta['seletor'] = [];

if ($plano == 1) {
    // Premium: ano anterior completo + até mês atual deste ano
    for ($ano = $anoAnterior; $ano <= $anoAtual; $ano++) {
        $limiteMes = ($ano == $anoAtual) ? $mesAtual : 12;
        for ($mes = 1; $mes <= $limiteMes; $mes++) {
            $resposta['seletor'][] = str_pad($mes, 2, '0', STR_PAD_LEFT) . '/' . $ano;
        }
    }
} else {
    // Grátis: últimos 3 meses
    for ($i = 0; $i < 3; $i++) {
        $data = new DateTime();
        $data->modify("-$i month");
        $resposta['seletor'][] = $data->format('m/Y');
    }
}

echo json_encode($resposta, JSON_UNESCAPED_UNICODE);
?>
