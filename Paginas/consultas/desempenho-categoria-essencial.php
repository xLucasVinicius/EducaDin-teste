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
    $dataLimite->modify('-3 months'); // inclui o mês atual e os dois anteriores

    if ($dataInformada < $dataLimite) {
        echo json_encode([
            'erro' => 'Acesso restrito aos últimos 3 meses para usuários do plano gratuito.'
        ]);
        exit;
    }
}

// Consulta filtrada por mês/ano
$sql = "SELECT categoria, SUM(valor) AS total 
        FROM lancamentos 
        WHERE id_usuario = $id_usuario 
        AND tipo = 1 
        AND categoria IS NOT NULL 
        AND categoria != '' 
        AND MONTH(data) = $mesSelecionado 
        AND YEAR(data) = $anoSelecionado 
        GROUP BY categoria 
        ORDER BY total DESC";

$result = $mysqli->query($sql);
$resposta['totais'] = [];
$resposta['essenciais'] = 0;
$resposta['desnecessarias'] = 0;

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $categoria = $row['categoria'];
        $total = (float)$row['total'];

        $essenciais = ['Moradia', 'Educação', 'Saúde', 'Investimentos'];
        $desnecessarias = ['Transporte','Alimentação', 'Lazer', 'Vestuário', 'Despesas_Gerais', 'Outros', 'Assinaturas', 'Impostos'];

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

// Buscar todos os meses com lançamentos válidos (tipo 1 e categoria preenchida)
$resposta['seletor'] = [];

$sqlDatas = "SELECT DISTINCT 
             DATE_FORMAT(data, '%m/%Y') AS mes_ano, 
             DATE_FORMAT(data, '%Y-%m-01') AS data_formatada 
             FROM lancamentos 
             WHERE id_usuario = $id_usuario 
             AND tipo = 1 
             AND categoria IS NOT NULL 
             AND categoria != '' 
             ORDER BY data_formatada DESC";

$resultDatas = $mysqli->query($sqlDatas);

$mesAtual = (int)date('m');
$anoAtual = (int)date('Y');
$mesAnoAtual = str_pad($mesAtual, 2, '0', STR_PAD_LEFT) . '/' . $anoAtual;

$mesesExistentes = [];

if ($resultDatas && $resultDatas->num_rows > 0) {
    $contador = 0;

    while ($row = $resultDatas->fetch_assoc()) {
        $dataLancamento = DateTime::createFromFormat('Y-m-d', $row['data_formatada']);
        $mesLancamento = (int)$dataLancamento->format('m');
        $anoLancamento = (int)$dataLancamento->format('Y');

        // Plano grátis: ignorar meses futuros
        if ($plano == 0 && ($anoLancamento > $anoAtual || ($anoLancamento === $anoAtual && $mesLancamento > $mesAtual))) {
            continue;
        }

        // Limitar a 3 meses no plano grátis
        if ($plano == 0 && $contador >= 3) break;

        $mesAno = $row['mes_ano'];
        $mesesExistentes[] = $mesAno;
        $resposta['seletor'][] = $mesAno;
        $contador++;
    }
}

// Adicionar o mês atual se ainda não estiver no seletor
if (!in_array($mesAnoAtual, $mesesExistentes)) {
    if ($plano == 0 && count($resposta['seletor']) >= 3) {
        // Se já existem 3 meses no plano grátis, substituir o mais antigo
        array_pop($resposta['seletor']); // remove o último
    }
    array_unshift($resposta['seletor'], $mesAnoAtual); // adiciona o mês atual no início
}


echo json_encode($resposta, JSON_UNESCAPED_UNICODE);
?>