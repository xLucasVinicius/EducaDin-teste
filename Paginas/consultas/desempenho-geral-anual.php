<?php

session_start();
include("../configs/config.php");

$id_usuario = $_SESSION['id'];

// Verifica se o ano foi passado como parâmetro, se não, assume o ano atual
$ano_usuario = isset($_GET['ano']) ? $_GET['ano'] : date('Y');

// Buscar o plano do usuário
$query_plano = "SELECT plano FROM usuarios WHERE id_usuario = ?";
$stmt_plano = $mysqli->prepare($query_plano);
$stmt_plano->bind_param("i", $id_usuario);
$stmt_plano->execute();
$result_plano = $stmt_plano->get_result();
$plano = $result_plano->fetch_assoc()['plano'] ?? 0;

$dados = [];
$meses_do_ano = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

// Inicializa os meses com valores 0
for ($i = 0; $i < 12; $i++) {
    $dados[$ano_usuario][$meses_do_ano[$i]] = [
        'total_receitas' => 0,
        'total_despesas' => 0
    ];
}

// Verificar se o ano selecionado é o ano atual ou um ano anterior
$current_year = date('Y');
$current_month = date('m'); // Mês atual (1 a 12)

// Se o ano selecionado for o ano atual, limitar a busca até o mês atual
if ($ano_usuario == $current_year) {
    $limit_month = $current_month; // Limitar até o mês atual
} else {
    // Se o ano já passou, buscar os últimos 3 meses do ano
    $limit_month = 12;
}

// Lógica para definir os meses a serem considerados com base no plano
if ($plano == 0) {
    // Plano grátis: Buscar os últimos 3 meses
    $start_month = max(1, $limit_month - 3); // Garantir que o mês inicial seja pelo menos o mês 1

    // Buscar dados apenas para os últimos 3 meses
    for ($i = $start_month; $i <= $limit_month; $i++) {
        $mes_nome = $meses_do_ano[$i - 1]; // Nome do mês (ex: "Jan", "Fev", etc.)

        // Consultar receitas e despesas para esse mês
        $query = "SELECT 
                    SUM(total_receitas) AS total_receitas,
                    SUM(total_despesas) AS total_despesas
                  FROM desempenho_anual
                  WHERE id_usuario = ? 
                    AND YEAR(data_ref) = ? 
                    AND MONTH(data_ref) = ?";
        $stmt = $mysqli->prepare($query);
        $stmt->bind_param("iii", $id_usuario, $ano_usuario, $i);
        $stmt->execute();
        $result = $stmt->get_result();

        while ($row = $result->fetch_assoc()) {
            $dados[$ano_usuario][$mes_nome] = [
                'total_receitas' => (float)($row['total_receitas'] ?? 0),
                'total_despesas' => (float)($row['total_despesas'] ?? 0)
            ];
        }
    }
} else {
    // Plano premium: Buscar todos os meses até o mês atual (se for o ano atual)
    for ($i = 1; $i <= $limit_month; $i++) {
        $mes_nome = $meses_do_ano[$i - 1]; // Nome do mês (ex: "Jan", "Fev", etc.)

        // Consultar receitas e despesas para esse mês
        $query = "SELECT 
                    SUM(total_receitas) AS total_receitas,
                    SUM(total_despesas) AS total_despesas
                  FROM desempenho_anual
                  WHERE id_usuario = ? 
                    AND YEAR(data_ref) = ? 
                    AND MONTH(data_ref) = ?";
        $stmt = $mysqli->prepare($query);
        $stmt->bind_param("iii", $id_usuario, $ano_usuario, $i);
        $stmt->execute();
        $result = $stmt->get_result();

        while ($row = $result->fetch_assoc()) {
            $dados[$ano_usuario][$mes_nome] = [
                'total_receitas' => (float)($row['total_receitas'] ?? 0),
                'total_despesas' => (float)($row['total_despesas'] ?? 0)
            ];
        }
    }
}

header('Content-Type: application/json');
echo json_encode($dados, JSON_UNESCAPED_UNICODE);

?>

