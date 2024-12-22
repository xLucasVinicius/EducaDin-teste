<?php 
include('config.php');

// Verifique se o arquivo foi enviado antes de processar a imagem
if (isset($_FILES['file']) && $_FILES['file']['error'] == 0) {
    $arquivo = $_FILES['file'];

    // Verifique o tamanho do arquivo
    if ($arquivo['size'] > 2097152) {
        die("Arquivo muito grande! Max: 2mb");
    }

    $pasta = "../foto-perfil/";
    $nomeDoArquivo = $arquivo['name'];
    $novoNomeDoArquivo = uniqid();
    $extensao = strtolower(pathinfo($nomeDoArquivo, PATHINFO_EXTENSION));

    // Verifique a extensão do arquivo
    if ($extensao != 'jpg' && $extensao != 'png') {
        die("Tipo de arquivo não aceito");
    }

    $path = $pasta . $novoNomeDoArquivo . "." . $extensao;

    // 1. Recuperar o caminho da imagem antiga do banco de dados
    $id = $_REQUEST['id'];
    $sql_select = "SELECT path FROM usuarios WHERE id = $id";
    $res_select = $mysqli->query($sql_select);

    if ($res_select->num_rows > 0) {
        $row = $res_select->fetch_assoc();
        $imagem_antiga = $row['path'];

        // 2. Excluir a imagem antiga, se existir
        if (file_exists($imagem_antiga)) {
            unlink($imagem_antiga);  // Remove a imagem antiga
        }
    }

    // 3. Mover a nova imagem
    $deu_certo = move_uploaded_file($arquivo["tmp_name"], $path);

    if (!$deu_certo) {
        die("Falha ao mover o arquivo");
    }

    // Agora o novo caminho da imagem será atualizado no banco de dados
} else {
    // Caso o usuário não tenha enviado uma nova imagem, não faça nada com a imagem
    $path = null; // Define como null se nenhuma nova imagem for carregada
}

// Informações do usuário
$nome = $_POST['nome'];
$sobrenome = $_POST['sobrenome'];
$email = $_POST['email'];
$senha = password_hash($_POST['senha'], PASSWORD_DEFAULT);
$num_cel = $_POST['telefone'];
$data_nasc = $_POST['data-nasc'];
$estado = $_POST['estado'];

// 4. Atualizar o banco de dados
$sql_update = "UPDATE usuarios SET 
        nome = '{$nome}',
        sobrenome = '{$sobrenome}',
        email = '{$email}',
        senha = '{$senha}',
        num_tel = '{$num_cel}',
        data_nasc = '{$data_nasc}',
        estado = '{$estado}'";

// Se o usuário adicionou uma nova imagem, inclua o campo path no SQL
if ($path !== null) {
    $sql_update .= ", path = '{$path}'";
}

$sql_update .= " WHERE id = $id";

$res_update = $mysqli->query($sql_update);

if ($res_update == true) {
    echo "<script>alert('Editado com sucesso')</script>";
    echo "<script>location.href='logout.php'</script>";
} else {
    echo "<script>alert('Não foi possível editar')</script>";
}
?>