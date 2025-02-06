<?php
include('config.php');

// Verifique se o arquivo foi enviado antes de processar a imagem
if (isset($_FILES['file']) && $_FILES['file']['error'] == 0) {
    $arquivo = $_FILES['file'];

    // Verifique o tamanho do arquivo
    if ($arquivo['size'] > 7340032) {
        die("Arquivo muito grande! Max: 7mb");
    }

    // Caminho relativo para exibir no frontend
    $pasta_relativa = "../foto-perfil/";
    // Caminho absoluto para mover o arquivo no backend
    $pasta_absoluta = $_SERVER['DOCUMENT_ROOT'] . '/EducaDin-teste/foto-perfil/';
    
    $nomeDoArquivo = $arquivo['name'];
    $novoNomeDoArquivo = uniqid();
    $extensao = strtolower(pathinfo($nomeDoArquivo, PATHINFO_EXTENSION));

    // Verifique a extensão do arquivo
    if ($extensao != 'jpg' && $extensao != 'png') {
        die("Tipo de arquivo não aceito");
    }

    // Caminho absoluto para mover a imagem
    $path_absoluto = $pasta_absoluta . $novoNomeDoArquivo . "." . $extensao;
    // Caminho relativo para salvar no banco e exibir no frontend
    $path_relativo = $pasta_relativa . $novoNomeDoArquivo . "." . $extensao;

    // Verificar se o diretório absoluto existe e criar se necessário
    if (!is_dir($pasta_absoluta)) {
        mkdir($pasta_absoluta, 0777, true);
    }

    // 1. Recuperar o caminho da imagem antiga do banco de dados usando prepared statement
    $id = $_REQUEST['id'];
    $stmt = $mysqli->prepare("SELECT path FROM usuarios WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $res_select = $stmt->get_result();

    if ($res_select->num_rows > 0) {
        $row = $res_select->fetch_assoc();
        $imagem_antiga = $_SERVER['DOCUMENT_ROOT'] . '/EducaDin-teste/' . $row['path']; // Caminho absoluto da imagem antiga

        // 2. Excluir a imagem antiga, se existir
        if (file_exists($imagem_antiga)) {
            if (!unlink($imagem_antiga)) {
                echo "Erro ao excluir a imagem antiga";
            }
        }
    }

    // 3. Mover a nova imagem para o diretório absoluto
    $deu_certo = move_uploaded_file($arquivo["tmp_name"], $path_absoluto);

    if (!$deu_certo) {
        die("Falha ao mover o arquivo");
    }

    // Agora o novo caminho relativo da imagem será atualizado no banco de dados
} else {
    // Caso o usuário não tenha enviado uma nova imagem, não faça nada com a imagem
    $path_relativo = null; // Define como null se nenhuma nova imagem for carregada
}

// Informações do usuário
$nome = $_POST['nome'];
$sobrenome = $_POST['sobrenome'];
$email = $_POST['email'];
$telefone = $_POST['telefone'];
$data_nascimento = $_POST['data_nascimento'];

// Preparar a consulta de atualização
$sql_update = "UPDATE usuarios SET 
        nome = ?, 
        sobrenome = ?, 
        email = ?, 
        telefone = ?, 
        data_nascimento = ?";

// Se o usuário adicionou uma nova imagem, inclua o campo path no SQL
if ($path_relativo !== null) {
    $sql_update .= ", path = ?";
}

$sql_update .= " WHERE id = ?";

$stmt_update = $mysqli->prepare($sql_update);

// Bind dos parâmetros para evitar SQL injection
if ($path_relativo !== null) {
    $stmt_update->bind_param("ssssssi", $nome, $sobrenome, $email, $telefone, $data_nascimento, $path_relativo, $id);
} else {
    $stmt_update->bind_param("sssssi", $nome, $sobrenome, $email, $telefone, $data_nascimento, $id);
}

// Verificar se a execução foi bem-sucedida
if ($stmt_update->execute()) {
    echo "<script>alert('Editado com sucesso')</script>";
    echo "<script>location.href='logout.php'</script>";
} else {
    // Exibir mensagem de erro específica do MySQL
    echo "Erro ao atualizar: " . $stmt_update->error;
}
?>
