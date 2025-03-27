<?php
include('config.php'); // Incluindo o arquivo de configuração

// Recebe os dados enviados via POST
$data = json_decode(file_get_contents('php://input'), true);

// Dados do usuário
$nome = $data['nome'];
$sobrenome = $data['sobrenome'];
$email = $data['email'];
$link_foto_perfil_google = $data['foto_perfil']; // Link da foto de perfil retornado pelo Google
$salario = null;
$data_nascimento = null;

// Função para salvar a imagem da URL do Google
function salvarImagemGoogle($url, $novo_nome) {
    // Diretório absoluto/relativo ao servidor para salvar as imagens
    $diretorio_absoluto = '../../foto-perfil/';
    
    // Caminho relativo ao front-end para exibir as imagens
    $diretorio_frontend = '../foto-perfil/';

    // Gerar o nome da imagem com o novo nome + extensão
    $nome_imagem = $novo_nome . '.jpg';
    
    // Caminho completo para salvar a imagem no servidor
    $caminho_imagem_absoluto = $diretorio_absoluto . $nome_imagem;

    // Caminho relativo que será usado no front-end
    $caminho_imagem_frontend = $diretorio_frontend . $nome_imagem;

    // Baixar a imagem do Google e salvar no servidor
    $conteudo_imagem = file_get_contents($url);

    if ($conteudo_imagem) {
        file_put_contents($caminho_imagem_absoluto, $conteudo_imagem);
        return $caminho_imagem_frontend; // Retorna o caminho da imagem a ser usado no front-end
    } else {
        return false; // Falhou ao baixar a imagem
    }
}

// Inicia a sessão
session_start();

// Verifica se o email já está cadastrado
$stmt_check_email = $mysqli->prepare("SELECT id_usuario, nome, sobrenome, email, foto_perfil, salario, data_nascimento FROM usuarios WHERE email = ?");
$stmt_check_email->bind_param("s", $email);
$stmt_check_email->execute();
$stmt_check_email->store_result();

if ($stmt_check_email->num_rows > 0) { // O email já existe no banco de dados, logar o usuário
    
    $stmt_check_email->bind_result($id_usuario, $nome_usuario, $sobrenome_usuario, $email_usuario, $foto_perfil_usuario, $salario_usuario, $data_nascimento_usuario);
    $stmt_check_email->fetch();

    // Salvar as informações do usuário nas variáveis de sessão
    $_SESSION['id'] = $id_usuario;
    $_SESSION['nome'] = $nome_usuario;
    $_SESSION['sobrenome'] = $sobrenome_usuario;
    $_SESSION['email'] = $email_usuario;
    $_SESSION['file'] = $foto_perfil_usuario;
    $_SESSION['salario'] = $salario_usuario;
    $_SESSION['data_nascimento'] = $data_nascimento_usuario;

    echo json_encode(['status' => 'success']);
} else {
    // O email não existe, cadastrar o usuário

    $novo_nome_imagem = uniqid(); // Gerar um novo nome único para a imagem 

    // Tenta salvar a imagem do Google no servidor
    $caminho_foto_perfil = salvarImagemGoogle($link_foto_perfil_google, $novo_nome_imagem);

    if ($caminho_foto_perfil) {
        // Cadastro no banco de dados com o novo caminho da imagem para o front-end
        $senha_hash = password_hash('senha_gerada_aleatoriamente', PASSWORD_DEFAULT); // Gerar uma senha aleatória
        // Codigo de inserção
        $sql_insert = "INSERT INTO usuarios (foto_perfil, nome, sobrenome, email, senha, data_nascimento, salario) VALUES (?, ?, ?, ?, ?, ?, ?)";
        // Inserção dos dados do usuário
        $stmt_insert = $mysqli->prepare($sql_insert);
        // Vincular os parâmetros
        $stmt_insert->bind_param("sssssss", $caminho_foto_perfil, $nome, $sobrenome, $email, $senha_hash, $data_nascimento, $salario);


        if ($stmt_insert->execute()) {
            // Buscar as informações do usuário no banco de dados após o cadastro
            $stmt_check_email = $mysqli->prepare("SELECT id_usuario, nome, sobrenome, email, foto_perfil, salario, data_nascimento FROM usuarios WHERE email = ?");
            $stmt_check_email->bind_param("s", $email);
            $stmt_check_email->execute();
            $stmt_check_email->store_result();

            // Salvar as informações do usuário nas variáveis de sessão
            $stmt_check_email->bind_result($id_usuario, $nome_usuario, $sobrenome_usuario, $email_usuario, $foto_perfil_usuario, $salario_usuario, $data_nascimento_usuario);
            $stmt_check_email->fetch();

            $_SESSION['id'] = $id_usuario;
            $_SESSION['nome'] = $nome_usuario;
            $_SESSION['sobrenome'] = $sobrenome_usuario;
            $_SESSION['email'] = $email_usuario;
            $_SESSION['file'] = $foto_perfil_usuario;
            $_SESSION['salario'] = $salario_usuario;
            $_SESSION['data_nascimento'] = $data_nascimento_usuario;

            echo json_encode(['status' => 'success']);
        } else {
            echo json_encode(['status' => 'error']);
        }
    } else {
        // Falha ao baixar a imagem
        echo json_encode(['status' => 'error', 'message' => 'Falha ao salvar a imagem de perfil.']);
    }
}
?>
