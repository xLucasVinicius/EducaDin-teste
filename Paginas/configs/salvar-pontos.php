<?php

session_start();
include('config.php');

// Receber o corpo da requisição JSON
$data = json_decode(file_get_contents('php://input'), true);

// Verificar se os dados foram enviados corretamente
if (isset($data['pontuacao']) && isset($data['id_minigame']) && isset($data['moedas_ganhas'])) {
    
    // Dados recebidos
    $id_usuario = $_SESSION['id']; // Pega o ID do usuário da sessão
    $pontos = $data['pontuacao'];
    $id_minigame = $data['id_minigame'];
    $moedas_ganhas = $data['moedas_ganhas'];

    // Inserir sempre a pontuação atual na tabela pontuacoes_mg
    $query_pontuacoes = "INSERT INTO pontuacoes_mg (id_usuario, id_minigame, pontuacao_rodada) VALUES (?, ?, ?)";
    $stmt_pontuacoes = $mysqli->prepare($query_pontuacoes);
    $stmt_pontuacoes->bind_param("iii", $id_usuario, $id_minigame, $pontos);
    $stmt_pontuacoes->execute();

    // Atualizar as moedas na tabela usuarios
    $query_moedas = "UPDATE usuarios SET moedas = moedas + ? WHERE id = ?";
    $stmt_moedas = $mysqli->prepare($query_moedas);
    $stmt_moedas->bind_param("ii", $moedas_ganhas, $id_usuario);
    $stmt_moedas->execute();
    $stmt_moedas->close();

    // Buscar os 10 melhores recordes do minigame atual
    $query_ranking = "SELECT id_usuario, recorde_pontos FROM recordes_mg WHERE id_minigame = ? ORDER BY recorde_pontos DESC LIMIT 10";
    $stmt_ranking = $mysqli->prepare($query_ranking);
    $stmt_ranking->bind_param("i", $id_minigame);
    $stmt_ranking->execute();
    $result_ranking = $stmt_ranking->get_result();
    $ranking = $result_ranking->fetch_all(MYSQLI_ASSOC);

    // Verificar se o novo recorde entra no top 10
    $entrouNoRanking = false;

    // Se o ranking tiver menos de 10 recordes ou a nova pontuação for maior que o último colocado
    if (count($ranking) < 10 || $pontos > $ranking[count($ranking) - 1]['recorde_pontos']) {
        $entrouNoRanking = true;

        // Inserir o novo recorde na tabela recordes_mg
        $query_insert = "INSERT INTO recordes_mg (id_usuario, id_minigame, recorde_pontos) VALUES (?, ?, ?)";
        $stmt_insert = $mysqli->prepare($query_insert);
        $stmt_insert->bind_param("iii", $id_usuario, $id_minigame, $pontos);
        $stmt_insert->execute();

        // Se o ranking tiver 10 recordes, remover o último colocado
        if (count($ranking) == 10) {
            $ultimoRecorde = $ranking[count($ranking) - 1];
            $query_remove_ultimo = "DELETE FROM recordes_mg WHERE id_usuario = ? AND id_minigame = ? AND recorde_pontos = ?";
            $stmt_remove_ultimo = $mysqli->prepare($query_remove_ultimo);
            $stmt_remove_ultimo->bind_param("iii", $ultimoRecorde['id_usuario'], $id_minigame, $ultimoRecorde['recorde_pontos']);
            $stmt_remove_ultimo->execute();
            $stmt_remove_ultimo->close();
        }
        $stmt_insert->close();
    }

    // Fechar as conexões
    $stmt_pontuacoes->close();
    $stmt_ranking->close();

    $mysqli->close();

    // Enviar uma resposta de sucesso
    echo json_encode(['message' => 'Pontuação salva com sucesso!', 'entrou_no_ranking' => $entrouNoRanking]);
} else {
    // Se os dados estiverem incompletos, enviar um erro
    echo json_encode(['message' => 'Dados incompletos.']);
}

?>
