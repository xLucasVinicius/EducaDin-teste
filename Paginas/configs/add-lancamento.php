<?php 
include('config.php');
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Verifica se é edição ou inserção
$id_lancamento = $_POST['id-lancamento'] ?? null;
$ehEdicao = isset($_POST['descricao-editar']);
$prefixo = $ehEdicao ? '-editar' : '';

// Pega os dados com base no prefixo
$id_usuario = $_POST['id_usuario' . $prefixo];
$metodo = $_POST['metodo' . $prefixo];
$id_conta = $_POST['conta' . $prefixo] ?? null;
$id_cartao = $_POST['cartao' . $prefixo] ?? null;
$descricao = $_POST['descricao' . $prefixo];
$valor = $_POST['valor' . $prefixo];
$tipo = $_POST['tipo' . $prefixo] ?? null;
$tranferenciaContas = $_POST['transferencia-contas' . $prefixo] ?? null;
$contaSaida = $_POST['conta-saida' . $prefixo] ?? null;
$contaEntrada = $_POST['conta-entrada' . $prefixo] ?? null;
$categoria = $_POST['categoria' . $prefixo];
$subcategoria = $_POST['subcategoria' . $prefixo];
$data = $_POST['data' . $prefixo];
$parcelas = $_POST['parcelas' . $prefixo];
$valor = formatarValor($valor);
if ($tipo == 0) $parcelas = 0;

$data_ref = date('Y-m-01', strtotime($data));
$mesAtual = date('Y-m'); // Mês atual

if ($metodo == 'Dinheiro') {
    $sql_buscar_conta_dinheiro = "SELECT id_conta FROM contas WHERE id_usuario = ? AND nome_conta = 'Carteira'";
    $stmt_buscar_conta_dinheiro = $mysqli->prepare($sql_buscar_conta_dinheiro);
    $stmt_buscar_conta_dinheiro->bind_param("i", $id_usuario);
    $stmt_buscar_conta_dinheiro->execute();
    $stmt_buscar_conta_dinheiro->bind_result($id_conta);
    $stmt_buscar_conta_dinheiro->fetch();
    $stmt_buscar_conta_dinheiro->close();
}

// Se for cartão de débito e a conta não tiver sido definida, buscar a conta vinculada ao cartão
if ($metodo === 'Débito' || $metodo === 'Crédito' && empty($id_conta) && !empty($id_cartao)) {
    $query = "SELECT id_conta FROM cartoes WHERE id_cartao = ? AND id_usuario = ?";
    $stmt = $mysqli->prepare($query);
    $stmt->bind_param("ii", $id_cartao, $id_usuario);
    $stmt->execute();
    $stmt->bind_result($id_conta_vinculada);
    if ($stmt->fetch()) {
        $id_conta = $id_conta_vinculada;
    }
    $stmt->close();
}


if ($id_lancamento) {
    // ====== EDIÇÃO ======
    
    if ($tranferenciaContas !== null) {
        // ====== EDIÇÃO DE TRANSFERência ======
        // 1. Buscar dados antigos do lançamento
        $query_old = "SELECT valor, tipo, id_conta, id_conta_entrada, data FROM lancamentos WHERE id_lancamento = ? AND id_usuario = ?";
        $stmt_old = $mysqli->prepare($query_old);
        $stmt_old->bind_param("ii", $id_lancamento, $id_usuario);
        $stmt_old->execute();
        $stmt_old->bind_result($valor_antigo, $tipo_antigo, $id_conta_saida_antiga, $id_conta_entrada_antiga, $data_antiga);
        $stmt_old->fetch();
        $stmt_old->close();

        $data_ref_antiga = date('Y-m-01', strtotime($data_antiga));
        $mesAntigo = date('Y-m', strtotime($data_antiga));
        $mesLancamento = date('Y-m', strtotime($data));
        $tipo = 2;
        // 2. Atualiza lançamento
        $query = "UPDATE lancamentos SET id_conta=?, id_conta_entrada=?, id_cartao=?, descricao=?, valor=?, tipo=?, metodo_pagamento=?, categoria=?, subcategoria=?, data=?, parcelas=? WHERE id_lancamento=? AND id_usuario=?";
        $stmt = $mysqli->prepare($query);
        $stmt->bind_param("iiissssssssii", $id_conta, $contaEntrada, $id_cartao, $descricao, $valor, $tipo, $metodo, $categoria, $subcategoria, $data, $parcelas, $id_lancamento, $id_usuario);
        $stmt->execute();
        $stmt->close();

        // 3. Atualiza saldo das contas
        if ($mesAtual === $mesLancamento) {
            if ($id_conta !== $id_conta_saida_antiga) {
                $ajuste_saida = $valor_antigo;
                $query_saldo_saida_antiga = "UPDATE contas SET saldo_atual = saldo_atual + ? WHERE id_conta = ? AND id_usuario = ?";
                $stmt_saida = $mysqli->prepare($query_saldo_saida_antiga);
                $stmt_saida->bind_param("dii", $ajuste_saida, $id_conta_saida_antiga, $id_usuario);
                $stmt_saida->execute();
                $stmt_saida->close();

                $ajuste_saida = $valor;
                $query_saldo_saida = "UPDATE contas SET saldo_atual = saldo_atual - ? WHERE id_conta = ? AND id_usuario = ?";
                $stmt_saida = $mysqli->prepare($query_saldo_saida);
                $stmt_saida->bind_param("dii", $ajuste_saida, $id_conta, $id_usuario);
                $stmt_saida->execute();
                $stmt_saida->close();
            } else {
                $ajuste_saida = $valor - $valor_antigo;
                $query_saldo_saida = "UPDATE contas SET saldo_atual = saldo_atual + ? WHERE id_conta = ? AND id_usuario = ?";
                $stmt_saida = $mysqli->prepare($query_saldo_saida);
                $stmt_saida->bind_param("dii", $ajuste_saida, $id_conta, $id_usuario);
                $stmt_saida->execute();
                $stmt_saida->close();
            }
        } else {
            $query_check = "SELECT id_desempenho FROM desempenho_anual WHERE id_usuario = ? AND id_conta = ? AND data_ref = ?";
            $stmt_check = $mysqli->prepare($query_check);
            $stmt_check->bind_param("iis", $id_usuario, $id_conta, $data_ref);
            $stmt_check->execute();
            $stmt_check->store_result();

            if ($stmt_check->num_rows > 0) {
                $stmt_check->close();

                if ($valor != $valor_antigo) {
                    $diferenca = $valor - $valor_antigo;
                } else {
                    $diferenca = $valor;
                }

                $query = "UPDATE desempenho_anual SET saldo_final = saldo_final - ? WHERE id_usuario = ? AND id_conta = ? AND data_ref = ?";
                $stmt = $mysqli->prepare($query);
                $stmt->bind_param("diis", $diferenca, $id_usuario, $id_conta, $data_ref);
                $stmt->execute();
                $stmt->close();
                if ($id_conta !== $id_conta_saida_antiga) {
                    $query_conta_saida_antiga = "UPDATE desempenho_anual SET saldo_final = saldo_final + ? WHERE id_usuario = ? AND id_conta = ? AND data_ref = ?";
                    $stmt = $mysqli->prepare($query_conta_saida_antiga);
                    $stmt->bind_param("diis", $diferenca, $id_usuario, $id_conta_saida_antiga, $data_ref);
                    $stmt->execute();
                    $stmt->close();
                }
            }
        }

        if ($mesAtual === $mesLancamento) {
            if ($contaEntrada !== $id_conta_entrada_antiga) {
                $ajuste_entrada = -$valor_antigo;
                $query_saldo_entrada_antiga = "UPDATE contas SET saldo_atual = saldo_atual + ? WHERE id_conta = ? AND id_usuario = ?";
                $stmt_entrada = $mysqli->prepare($query_saldo_entrada_antiga);
                $stmt_entrada->bind_param("dii", $ajuste_entrada, $id_conta_entrada_antiga, $id_usuario);
                $stmt_entrada->execute();
                $stmt_entrada->close();

                $ajuste_entrada = $valor;
                $query_saldo_entrada = "UPDATE contas SET saldo_atual = saldo_atual - ? WHERE id_conta = ? AND id_usuario = ?";
                $stmt_entrada = $mysqli->prepare($query_saldo_entrada);
                $stmt_entrada->bind_param("dii", $ajuste_entrada, $id_conta_entrada, $id_usuario);
                $stmt_entrada->execute();
                $stmt_entrada->close();
            } else {
                $ajuste_entrada = $valor - $valor_antigo;
                $query_saldo_entrada = "UPDATE contas SET saldo_atual = saldo_atual + ? WHERE id_conta = ? AND id_usuario = ?";
                $stmt_entrada = $mysqli->prepare($query_saldo_entrada);
                $stmt_entrada->bind_param("dii", $ajuste_entrada, $id_conta_entrada, $id_usuario);
                $stmt_entrada->execute();
                $stmt_entrada->close();
            }
        } else {
            $query_check = "SELECT id_desempenho FROM desempenho_anual WHERE id_usuario = ? AND id_conta = ? AND data_ref = ?";
            $stmt_check = $mysqli->prepare($query_check);
            $stmt_check->bind_param("iis", $id_usuario, $id_conta_entrada, $data_ref);
            $stmt_check->execute();
            $stmt_check->store_result();

            if ($stmt_check->num_rows > 0) {
                $stmt_check->close();

                if ($valor != $valor_antigo) {
                    $diferenca = $valor - $valor_antigo;
                } else {
                    $diferenca = $valor;
                }

                $query = "UPDATE desempenho_anual SET saldo_final = saldo_final + ? WHERE id_usuario = ? AND id_conta = ? AND data_ref = ?";
                $stmt = $mysqli->prepare($query);
                $stmt->bind_param("diis", $diferenca, $id_usuario, $id_conta_entrada, $data_ref);
                $stmt->execute();
                $stmt->close();
                if ($id_conta_entrada !== $id_conta_entrada_antiga) {
                    $query_conta_entrada_antiga = "UPDATE desempenho_anual SET saldo_final = saldo_final - ? WHERE id_usuario = ? AND id_conta = ? AND data_ref = ?";
                    $stmt = $mysqli->prepare($query_conta_entrada_antiga);
                    $stmt->bind_param("diis", $diferenca, $id_usuario, $id_conta_entrada_antiga, $data_ref);
                    $stmt->execute();
                    $stmt->close();
                }
            }
        }

        echo json_encode(['status' => 'success']);
        exit;

    } else {
        // ====== EDIÇÃO DE LANCAMENTO NORMAL ======
        // 1. Buscar dados antigos do lançamento
        $query_old = "SELECT valor, tipo, id_conta, data FROM lancamentos WHERE id_lancamento = ? AND id_usuario = ?";
        $stmt_old = $mysqli->prepare($query_old);
        $stmt_old->bind_param("ii", $id_lancamento, $id_usuario);
        $stmt_old->execute();
        $stmt_old->bind_result($valor_antigo, $tipo_antigo, $id_conta_antiga, $data_antiga);
        $stmt_old->fetch();
        $stmt_old->close();

        $data_ref_antiga = date('Y-m-01', strtotime($data_antiga));

        // 2. Atualiza lançamento
        $query = "UPDATE lancamentos SET id_conta=?, id_cartao=?, descricao=?, valor=?, tipo=?, metodo_pagamento=?, categoria=?, subcategoria=?, data=?, parcelas=? WHERE id_lancamento=? AND id_usuario=?";
        $stmt = $mysqli->prepare($query);
        $stmt->bind_param("iissssssssii", $id_conta, $id_cartao, $descricao, $valor, $tipo, $metodo, $categoria, $subcategoria, $data, $parcelas, $id_lancamento, $id_usuario);
        $stmt->execute();
        $stmt->close();

        // 3. Corrige o saldo da conta antiga
        $mesAntigo = date('Y-m', strtotime($data_antiga));
        if (!is_null($id_conta_antiga) && $mesAtual === $mesAntigo) {
            $ajuste = ($tipo_antigo == 0) ? -$valor_antigo : $valor_antigo;
            $query_saldo_old = "UPDATE contas SET saldo_atual = saldo_atual + ? WHERE id_conta = ? AND id_usuario = ?";
            $stmt_saldo_old = $mysqli->prepare($query_saldo_old);
            $stmt_saldo_old->bind_param("dii", $ajuste, $id_conta_antiga, $id_usuario);
            $stmt_saldo_old->execute();
            $stmt_saldo_old->close();
        }

        // 4. Corrige o desempenho anual da referência antiga
        if (!is_null($id_conta_antiga)) {
            if ($tipo_antigo == 0) {
                $query = "UPDATE desempenho_anual SET total_receitas = total_receitas - ?, saldo_final = saldo_final - ? WHERE id_usuario = ? AND id_conta = ? AND data_ref = ?";
            } else {
                $query = "UPDATE desempenho_anual SET total_despesas = total_despesas - ?, saldo_final = saldo_final + ? WHERE id_usuario = ? AND id_conta = ? AND data_ref = ?";
            }
            $stmt = $mysqli->prepare($query);
            $stmt->bind_param("ddiis", $valor_antigo, $valor_antigo, $id_usuario, $id_conta_antiga, $data_ref_antiga);
            $stmt->execute();
            $stmt->close();
        }

        // 5. Aplica novo saldo com base no lançamento novo
        $mesNovo = date('Y-m', strtotime($data));
        if (!is_null($id_conta) && $mesAtual === $mesNovo) {
            $ajuste = ($tipo == 0) ? $valor : -$valor;
            $query_saldo_new = "UPDATE contas SET saldo_atual = saldo_atual + ? WHERE id_conta = ? AND id_usuario = ?";
            $stmt_saldo_new = $mysqli->prepare($query_saldo_new);
            $stmt_saldo_new->bind_param("dii", $ajuste, $id_conta, $id_usuario);
            $stmt_saldo_new->execute();
            $stmt_saldo_new->close();
        }

        // 6. Verifica se existe um registro no desempenho anual com o mês do lançamento e o id_conta
        $query_check = "SELECT id_desempenho FROM desempenho_anual WHERE id_usuario = ? AND id_conta = ? AND data_ref = ?";
        $stmt_check = $mysqli->prepare($query_check);
        $stmt_check->bind_param("iis", $id_usuario, $id_conta, $data_ref);
        $stmt_check->execute();
        $stmt_check->store_result();

        if ($stmt_check->num_rows > 0) {
            // Atualiza o saldo no desempenho anual
            $stmt_check->close();
            if ($tipo == 0) {
                $query = "UPDATE desempenho_anual SET total_receitas = total_receitas + ?, saldo_final = saldo_final + ? WHERE id_usuario = ? AND id_conta = ? AND data_ref = ?";
            } else {
                $query = "UPDATE desempenho_anual SET total_despesas = total_despesas + ?, saldo_final = saldo_final - ? WHERE id_usuario = ? AND id_conta = ? AND data_ref = ?";
            }
            $stmt_update = $mysqli->prepare($query);
            $stmt_update->bind_param("ddiis", $valor, $valor, $id_usuario, $id_conta, $data_ref);
            $stmt_update->execute();
            $stmt_update->close();
        } else {
            // Insere um novo registro no desempenho anual
            $stmt_check->close();

            // saldo atual da conta
            $query_saldo_atual = "SELECT saldo_atual FROM contas WHERE id_conta = ? AND id_usuario = ?";
            $stmt = $mysqli->prepare($query_saldo_atual);
            $stmt->bind_param("ii", $id_conta, $id_usuario);
            $stmt->execute();
            $stmt->bind_result($saldo_atual);
            $stmt->fetch();
            $stmt->close();

            $total_receitas = ($tipo == 0) ? $valor : 0;
            $total_despesas = ($tipo == 1) ? $valor : 0;

            $query = "INSERT INTO desempenho_anual (id_usuario, id_conta, data_ref, total_receitas, total_despesas, saldo_final) VALUES (?, ?, ?, ?, ?, ?)";
            $stmt_insert = $mysqli->prepare($query);
            $stmt_insert->bind_param("iissdd", $id_usuario, $id_conta, $data_ref, $total_receitas, $total_despesas, $saldo_atual);
            $stmt_insert->execute();
            $stmt_insert->close();
        }

        echo json_encode(['status' => 'success']);
    }

} else {
    // ====== INSERÇÃO ======
    if ($tranferenciaContas) {
        $mysqli->begin_transaction();

        try {
            $tipo = 2;

            // Inserir lançamento de transferência
            $query = "INSERT INTO lancamentos (id_usuario, id_conta, id_conta_entrada, descricao, valor, tipo, metodo_pagamento, categoria, subcategoria, data, parcelas) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            $stmt = $mysqli->prepare($query);
            $stmt->bind_param("iiississssi", $id_usuario, $contaSaida, $contaEntrada, $descricao, $valor, $tipo, $metodo, $categoria, $subcategoria, $data, $parcelas);
            $stmt->execute();
            $stmt->close();

            // Atualizar saldo das contas
            $ajuste_saida = -$valor;
            $ajuste_entrada = $valor;

            $stmt = $mysqli->prepare("UPDATE contas SET saldo_atual = saldo_atual + ? WHERE id_conta = ? AND id_usuario = ?");
            $stmt->bind_param("dii", $ajuste_saida, $contaSaida, $id_usuario);
            $stmt->execute();
            $stmt->close();

            $stmt = $mysqli->prepare("UPDATE contas SET saldo_atual = saldo_atual + ? WHERE id_conta = ? AND id_usuario = ?");
            $stmt->bind_param("dii", $ajuste_entrada, $contaEntrada, $id_usuario);
            $stmt->execute();
            $stmt->close();

            // Obter saldo atual da conta de saída
            $stmt = $mysqli->prepare("SELECT saldo_atual FROM contas WHERE id_conta = ? AND id_usuario = ?");
            $stmt->bind_param("ii", $contaSaida, $id_usuario);
            $stmt->execute();
            $stmt->bind_result($saldo_atual_saida);
            $stmt->fetch();
            $stmt->close();

            // ================== CONTA DE SAÍDA ==================
            $stmt = $mysqli->prepare("SELECT id_desempenho FROM desempenho_anual WHERE id_usuario = ? AND id_conta = ? AND data_ref = ?");
            $stmt->bind_param("iis", $id_usuario, $contaSaida, $data_ref);
            $stmt->execute();
            $stmt->store_result();

            if ($stmt->num_rows > 0) {
                $stmt->close();
                $stmt = $mysqli->prepare("UPDATE desempenho_anual SET saldo_final = saldo_final + ? WHERE id_usuario = ? AND id_conta = ? AND data_ref = ?");
                $stmt->bind_param("diis", $ajuste_saida, $id_usuario, $contaSaida, $data_ref);
                $stmt->execute();
                $stmt->close();
            } else {
                $stmt->close();
                $total_receitas = 0;
                $total_despesas = 0;

                $stmt = $mysqli->prepare("INSERT INTO desempenho_anual (id_usuario, id_conta, data_ref, total_receitas, total_despesas, saldo_final) 
                                        VALUES (?, ?, ?, ?, ?, ?)");
                $stmt->bind_param("iisddd", $id_usuario, $contaSaida, $data_ref, $total_receitas, $total_despesas, $saldo_atual_saida);
                $stmt->execute();
                $stmt->close();
            }

            // ================== CONTA DE ENTRADA ==================
            $stmt = $mysqli->prepare("SELECT saldo_atual FROM contas WHERE id_conta = ? AND id_usuario = ?");
            $stmt->bind_param("ii", $contaEntrada, $id_usuario);
            $stmt->execute();
            $stmt->bind_result($saldo_atual_entrada);
            $stmt->fetch();
            $stmt->close();

            $stmt = $mysqli->prepare("SELECT id_desempenho FROM desempenho_anual WHERE id_usuario = ? AND id_conta = ? AND data_ref = ?");
            $stmt->bind_param("iis", $id_usuario, $contaEntrada, $data_ref);
            $stmt->execute();
            $stmt->store_result();

            if ($stmt->num_rows > 0) {
                $stmt->close();
                $stmt = $mysqli->prepare("UPDATE desempenho_anual SET saldo_final = saldo_final + ? WHERE id_usuario = ? AND id_conta = ? AND data_ref = ?");
                $stmt->bind_param("diis", $ajuste_entrada, $id_usuario, $contaEntrada, $data_ref);
                $stmt->execute();
                $stmt->close();
            } else {
                $stmt->close();
                $total_receitas = 0;
                $total_despesas = 0;

                $stmt = $mysqli->prepare("INSERT INTO desempenho_anual (id_usuario, id_conta, data_ref, total_receitas, total_despesas, saldo_final) 
                                        VALUES (?, ?, ?, ?, ?, ?)");
                $stmt->bind_param("iisddd", $id_usuario, $contaEntrada, $data_ref, $total_receitas, $total_despesas, $saldo_atual_entrada);
                $stmt->execute();
                $stmt->close();
            }

            $mysqli->commit();
            echo json_encode(['status' => 'success']);
            exit;

        } catch (Exception $e) {
            $mysqli->rollback();
            echo json_encode(['status' => 'error', 'mensagem' => 'Erro na transação: ' . $e->getMessage()]);
            exit;
        }
    }


    if ($metodo === 'Crédito' && $parcelas > 1) {
        // Buscar data de fechamento da fatura
        $query_fechamento = "SELECT dia_fechamento FROM cartoes WHERE id_cartao = ? AND id_usuario = ?";
        $stmt = $mysqli->prepare($query_fechamento);
        $stmt->bind_param("ii", $id_cartao, $id_usuario);
        $stmt->execute();
        $stmt->bind_result($dia_fechamento);
        $stmt->fetch();
        $stmt->close();

        $valor_parcela = round($valor / $parcelas, 2);  // Valor dividido
        $data_lancamento = new DateTime($data);
        $hoje = new DateTime();

        $dia_lancamento = (int)$data_lancamento->format('d');
        $mes_lancamento = (int)$data_lancamento->format('m');
        $ano_lancamento = (int)$data_lancamento->format('Y');

        // Se o lançamento foi antes ou no dia do fechamento, começa no mês atual, senão no próximo
        $mes_base = $dia_lancamento <= $dia_fechamento ? $data_lancamento : $data_lancamento->modify('+1 month');

        // Inserir uma linha para cada parcela
        for ($i = 0; $i < $parcelas; $i++) {
            $data_parcela = (clone $mes_base)->modify("+$i months");
            $data_sql = $data_parcela->format('Y-m-d');

            $descricao_parcela = $descricao . " (" . ($i+1) . "/" . $parcelas . ")";

            $query = "INSERT INTO lancamentos (id_usuario, id_conta, id_cartao, descricao, valor, tipo, metodo_pagamento, categoria, subcategoria, data, parcelas) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            $stmt = $mysqli->prepare($query);
            $stmt->bind_param("iiisssssssi", $id_usuario, $id_conta, $id_cartao, $descricao_parcela, $valor_parcela, $tipo, $metodo, $categoria, $subcategoria, $data_sql, $parcelas);
            $stmt->execute();
            $stmt->close();
        }

    } else {
        // Lançamento único (sem parcelamento)
        $query = "INSERT INTO lancamentos (id_usuario, id_conta, id_cartao, descricao, valor, tipo, metodo_pagamento, categoria, subcategoria, data, parcelas) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt = $mysqli->prepare($query);
        $stmt->bind_param("iiisssssssi", $id_usuario, $id_conta, $id_cartao, $descricao, $valor, $tipo, $metodo, $categoria, $subcategoria, $data, $parcelas);
        $stmt->execute();
        $stmt->close();
    }

    if (isset($id_conta) || $tipo  && $mesAtual == $data_ref) {
        $ajuste = ($tipo == 0) ? $valor : -$valor;
        $query_saldo = "UPDATE contas SET saldo_atual = saldo_atual + ? WHERE id_conta = ? AND id_usuario = ?";
        $stmt_saldo = $mysqli->prepare($query_saldo);
        $stmt_saldo->bind_param("dii", $ajuste, $id_conta, $id_usuario);
        $stmt_saldo->execute();
        $stmt_saldo->close();
    }

    $query_check = "SELECT id_desempenho FROM desempenho_anual WHERE id_usuario = ? AND id_conta = ? AND data_ref = ?";
    $stmt_check = $mysqli->prepare($query_check);
    $stmt_check->bind_param("iis", $id_usuario, $id_conta, $data_ref);
    $stmt_check->execute();
    $stmt_check->store_result();

    if ($stmt_check->num_rows > 0) {
        $stmt_check->close();
        if ($tipo == 0) {
            $query = "UPDATE desempenho_anual SET total_receitas = total_receitas + ?, saldo_final = saldo_final + ? WHERE id_usuario = ? AND id_conta = ? AND data_ref = ?";
        } else {
            $query = "UPDATE desempenho_anual SET total_despesas = total_despesas + ?, saldo_final = saldo_final - ? WHERE id_usuario = ? AND id_conta = ? AND data_ref = ?";
        }
        $stmt_update = $mysqli->prepare($query);
        $stmt_update->bind_param("ddiis", $valor, $valor, $id_usuario, $id_conta, $data_ref);
        $stmt_update->execute();
        $stmt_update->close();
    } else {
        $stmt_check->close();
        $total_receitas = ($tipo == 0) ? $valor : 0;
        $total_despesas = ($tipo == 1) ? $valor : 0;

        $query_saldo_atual = "SELECT saldo_atual FROM contas WHERE id_conta = ? AND id_usuario = ?";
        $stmt = $mysqli->prepare($query_saldo_atual);
        $stmt->bind_param("ii", $id_conta, $id_usuario);
        $stmt->execute();
        $stmt->bind_result($saldo_atual);
        $stmt->fetch();
        $stmt->close();

        // Verificar se o mês do lançamento é diferente do mês atual
        if ($data_ref !== $mesAtual) {
            // Verificar se já existe o registro de desempenho para o mês do lançamento
            $query_check = "SELECT id_desempenho FROM desempenho_anual WHERE id_usuario = ? AND id_conta = ? AND data_ref = ?";
            $stmt_check = $mysqli->prepare($query_check);
            $stmt_check->bind_param("iis", $id_usuario, $id_conta, $data_ref);
            $stmt_check->execute();
            $stmt_check->store_result();

            if ($stmt_check->num_rows > 0) {
                $stmt_check->close();
                // Atualizar o saldo do desempenho anual
                if ($tipo == 0) {
                    $query = "UPDATE desempenho_anual SET total_receitas = total_receitas + ?, saldo_final = saldo_final + ? WHERE id_usuario = ? AND id_conta = ? AND data_ref = ?";
                } else {
                    $query = "UPDATE desempenho_anual SET total_despesas = total_despesas + ?, saldo_final = saldo_final - ? WHERE id_usuario = ? AND id_conta = ? AND data_ref = ?";
                }
                $stmt_update = $mysqli->prepare($query);
                $stmt_update->bind_param("ddiis", $valor, $valor, $id_usuario, $id_conta, $data_ref);
                $stmt_update->execute();
                $stmt_update->close();
            } else {
                if ($tipo == 0) {
                    $saldo_atual = $total_receitas;
                } else {
                    $saldo_atual = -$total_despesas;
                }

                // Inserir novo registro de desempenho anual para o mês do lançamento
                $query_insert = "INSERT INTO desempenho_anual (id_usuario, id_conta, data_ref, total_receitas, total_despesas, saldo_final) VALUES (?, ?, ?, ?, ?, ?)";
                $stmt_insert = $mysqli->prepare($query_insert);
                $stmt_insert->bind_param("iisddd", $id_usuario, $id_conta, $data_ref, $total_receitas, $total_despesas, $saldo_atual);
                $stmt_insert->execute();
                $stmt_insert->close();
                
                
            }
        } else {
            // Inserir desempenho anual com o mês atual se for o mesmo
            $query_insert = "INSERT INTO desempenho_anual (id_usuario, id_conta, data_ref, total_receitas, total_despesas, saldo_final) VALUES (?, ?, ?, ?, ?, ?)";
            $stmt_insert = $mysqli->prepare($query_insert);
            $stmt_insert->bind_param("iisddd", $id_usuario, $id_conta, $data_ref, $total_receitas, $total_despesas, $saldo_atual);
            $stmt_insert->execute();
            $stmt_insert->close();
        }
    }

    echo json_encode(['status' => 'success']);
}


// Função para formatar o valor
function formatarValor($valor) {
    $valor = str_replace("R$", "", $valor);
    $valor = str_replace(".", "", $valor);
    $valor = str_replace(",", ".", trim($valor));
    return floatval($valor);
}

?>