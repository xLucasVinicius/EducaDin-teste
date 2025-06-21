<?php

include("../configs/config.php");

if (isset($_POST['nome-premio']) && isset($_POST['descricao-premio']) && isset($_POST['preco-premio']) && isset($_FILES['foto-premio']) && $_POST['limite-trocas']) {
    $nome = $_POST['nome-premio'];
    $descricao = $_POST['descricao-premio'];
    $preco = $_POST['preco-premio'];
    $limite = $_POST['limite-trocas'];

    // Verifica se foi enviada uma imagem
    if (isset($_FILES['foto-premio']) && $_FILES['foto-premio']['error'] === UPLOAD_ERR_OK) {
        $arquivoTmp = $_FILES['foto-premio']['tmp_name'];
        $nomeArquivo = basename($_FILES['foto-premio']['name']);

        // Cria diretório se não existir
        $diretorioDestino = "../../imagens/cupons";
        if (!is_dir($diretorioDestino)) {
            mkdir($diretorioDestino, 0777, true);
        }

        // Caminho final da imagem
        $nomeArquivo = uniqid() . '.' . strtolower(pathinfo($nomeArquivo, PATHINFO_EXTENSION));
        $caminhoFinal = $diretorioDestino . '/' . $nomeArquivo;

        // Move o arquivo
        if (move_uploaded_file($arquivoTmp, $caminhoFinal)) {
            // Caminho salvo no banco (relativo ao site)
            $caminhoParaBanco = "../imagens/cupons/" . $nomeArquivo;

            // Insere no banco com o caminho da imagem
            $sql = "INSERT INTO premios (imagem_premio, nome_premio, descricao_premio, valor_moedas, limite_trocas) 
                    VALUES ('$caminhoParaBanco', '$nome', '$descricao', '$preco', '$limite')";

            if ($mysqli->query($sql) === TRUE) {
                echo json_encode(array("status" => "success"));
            } else {
                echo json_encode(array("status" => "db_error"));
            }
        } else {
            echo json_encode(array("status" => "upload_error"));
        }
    } else {
        echo json_encode(array("status" => "no_file"));
    }
} else {
    echo json_encode(array("status" => "missing_fields"));
}
?>
