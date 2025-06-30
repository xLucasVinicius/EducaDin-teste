<?php
session_start();
include("../configs/config.php");

header('Content-Type: application/json');

$id_usuario = $_SESSION['id_usuario'];

$sql = "SELECT * FROM contas WHERE id_usuario = $id_usuario";
$sql2 = "SELECT * FROM cartoes WHERE id_usuario = $id_usuario";
$sql3 = "SELECT * FROM lancamentos WHERE id_usuario = $id_usuario AND metodo_pagamento = 'Crédito'";
$sql4 = "SELECT * FROM lancamentos WHERE id_usuario = $id_usuario AND metodo_pagamento = 'Débito'";

$result = $mysqli->query($sql);
$result2 = $mysqli->query($sql2);
$result3 = $mysqli->query($sql3);
$result4 = $mysqli->query($sql4);

$response = [];

// Contas
$response['contas'] = $result->num_rows > 0 ? $result->fetch_all(MYSQLI_ASSOC) : [];

// Cartões
$cartoes = $result2->num_rows > 0 ? $result2->fetch_all(MYSQLI_ASSOC) : [];
$response['cartoes'] = [];

// Lançamentos Crédito
$lancamentosCredito = $result3->num_rows > 0 ? $result3->fetch_all(MYSQLI_ASSOC) : [];
$response['lancamentos_credito'] = $lancamentosCredito;

// Lançamentos Débito
$response['lancamentos_debito'] = $result4->num_rows > 0 ? $result4->fetch_all(MYSQLI_ASSOC) : [];

// Processar cada cartão para adicionar limite disponível e fatura atual
foreach ($cartoes as &$cartao) {
    if ($cartao['tipo'] == '1') { // Apenas cartão de crédito
        $limite_total = (float)$cartao['limite_total'];
        $id_cartao = $cartao['id_cartao'];
        $dia_fechamento = (int)$cartao['dia_fechamento'];

        $hoje = new DateTime();
        $diaAtual = (int)$hoje->format('d');
        $mesAtual = (int)$hoje->format('m');
        $anoAtual = (int)$hoje->format('Y');

        // Data de fechamento atual
        if ($diaAtual >= $dia_fechamento) {
            $dataFechamentoAtual = new DateTime("$anoAtual-$mesAtual-$dia_fechamento");
        } else {
            $dataFechamentoAtual = (new DateTime("$anoAtual-$mesAtual-01"))->modify("-1 month")->setDate($anoAtual, $mesAtual - 1, $dia_fechamento);
        }
        $dataFechamentoAtual->setTime(0, 0, 0);

        // Próximo fechamento
        $dataFechamentoProximo = clone $dataFechamentoAtual;
        $dataFechamentoProximo->modify('+1 month');

        // Comprometimento futuro
        $comprometido = 0;
        $faturaAtual = 0;

        foreach ($lancamentosCredito as $lanc) {
            if ($lanc['id_cartao'] == $id_cartao) {
                $dataLanc = new DateTime($lanc['data']);
                $dataLanc->setTime(0, 0, 0);

                // Comprometido se >= fechamento atual
                if ($dataLanc >= $dataFechamentoAtual) {
                    $comprometido += (float)$lanc['valor'];
                }

                // Fatura atual se entre fechamento atual e próximo
                if ($dataLanc >= $dataFechamentoAtual && $dataLanc < $dataFechamentoProximo) {
                    $faturaAtual += (float)$lanc['valor'];
                }
            }
        }

        $cartao['limite_disponivel'] = $limite_total - $comprometido;
        $cartao['fatura_atual'] = $faturaAtual;
    }

    $response['cartoes'][] = $cartao;
}

echo json_encode($response);
