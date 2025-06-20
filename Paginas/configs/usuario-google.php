<?php
include('config.php'); // Incluindo o arquivo de configuração
date_default_timezone_set('America/Sao_Paulo');
// Recebe os dados enviados via POST
$data = json_decode(file_get_contents('php://input'), true);

// Dados do usuário
$nome = $data['nome'];
$sobrenome = $data['sobrenome'];
$email = $data['email'];
$link_foto_perfil_google = $data['foto_perfil']; // Link da foto de perfil retornado pelo Google
$salario = null;
$data_nascimento = null;
$data_cadastro = date('Y-m-d H:i:s');


$sql_verificacao = "SELECT status_atividade FROM usuarios WHERE email = ?";
$stmt_verificacao = $mysqli->prepare($sql_verificacao);
$stmt_verificacao->bind_param("s", $email);
$stmt_verificacao->execute();
$result_verificacao = $stmt_verificacao->get_result();
if ($result_verificacao->num_rows > 0 && $result_verificacao->fetch_assoc()['status_atividade'] == 0) {
    echo json_encode(['status' => 'banido']);
    exit;
}
$stmt_verificacao->close();

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
$stmt_check_email = $mysqli->prepare("SELECT id_usuario, foto_perfil, nome, sobrenome, email, salario, plano, poder, moedas, data_nascimento, data_cadastro FROM usuarios WHERE email = ?");
$stmt_check_email->bind_param("s", $email);
$stmt_check_email->execute();
$stmt_check_email->store_result();

if ($stmt_check_email->num_rows > 0) { // O email já existe no banco de dados, logar o usuário
    
    $stmt_check_email->bind_result($id_usuario, $foto_perfil_usuario, $nome_usuario, $sobrenome_usuario, $email_usuario, $salario_usuario, $plano_usuario, $poder_usuario, $moedas_usuario, $data_nascimento_usuario, $data_cadastro_usuario);
    $stmt_check_email->fetch();

    // Salvar as informações do usuário nas variáveis de sessão
    $_SESSION['id_usuario'] = $id_usuario;
    $_SESSION['foto_perfil'] = $foto_perfil_usuario;
    $_SESSION['nome'] = $nome_usuario;
    $_SESSION['sobrenome'] = $sobrenome_usuario;
    $_SESSION['email'] = $email_usuario;
    $_SESSION['salario'] = $salario_usuario;
    $_SESSION['plano'] = $plano_usuario;
    $_SESSION['poder'] = $poder_usuario;
    $_SESSION['moedas'] = $moedas_usuario;
    $_SESSION['data_nascimento'] = $data_nascimento_usuario;
    $_SESSION['data_cadastro'] = $data_cadastro_usuario;


    // Definir um cookie com tempo de expiração de 30 dias
    setcookie('user', $_SESSION['email'], time() + (86400 * 30), "/");

    echo json_encode(['status' => 'success']);
} else {
    // O email não existe, cadastrar o usuário

    $novo_nome_imagem = uniqid(); // Gerar um novo nome único para a imagem 

    // Tenta salvar a imagem do Google no servidor
    $caminho_foto_perfil = salvarImagemGoogle($link_foto_perfil_google, $novo_nome_imagem);

    if ($caminho_foto_perfil) {
        // Cadastro no banco de dados com o novo caminho da imagem para o front-end
        $senha_hash = password_hash(date('Y-m-d H:i'), PASSWORD_DEFAULT); // Gerar uma senha aleatória
        // Codigo de inserção
        $sql_insert = "INSERT INTO usuarios (foto_perfil, nome, sobrenome, email, senha, data_nascimento, salario, data_cadastro) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        // Inserção dos dados do usuário
        $stmt_insert = $mysqli->prepare($sql_insert);
        // Vincular os parâmetros
        $stmt_insert->bind_param("ssssssss", $caminho_foto_perfil, $nome, $sobrenome, $email, $senha_hash, $data_nascimento, $salario, $data_cadastro);


        if ($stmt_insert->execute()) {
            // Buscar as informações do usuário no banco de dados após o cadastro
            $stmt_check_email = $mysqli->prepare("SELECT id_usuario, foto_perfil, nome, sobrenome, email, salario, plano, poder, moedas, data_nascimento, data_cadastro FROM usuarios WHERE email = ?");
            $stmt_check_email->bind_param("s", $email);
            $stmt_check_email->execute();
            $stmt_check_email->store_result();

            // Salvar as informações do usuário nas variáveis de sessão
            $stmt_check_email->bind_result($id_usuario, $foto_perfil_usuario, $nome_usuario, $sobrenome_usuario, $email_usuario, $salario_usuario, $plano_usuario, $poder_usuario, $moedas_usuario, $data_nascimento_usuario, $data_cadastro_usuario);
            $stmt_check_email->fetch();

            $_SESSION['id_usuario'] = $id_usuario;
            $_SESSION['foto_perfil'] = $foto_perfil_usuario;
            $_SESSION['nome'] = $nome_usuario;
            $_SESSION['sobrenome'] = $sobrenome_usuario;
            $_SESSION['email'] = $email_usuario;
            $_SESSION['salario'] = $salario_usuario;
            $_SESSION['plano'] = $plano_usuario;
            $_SESSION['poder'] = $poder_usuario;
            $_SESSION['moedas'] = $moedas_usuario;
            $_SESSION['data_nascimento'] = $data_nascimento_usuario;
            $_SESSION['data_cadastro'] = $data_cadastro_usuario;
            // Definir um cookie com tempo de expiração de 30 dias
            setcookie('user', $_SESSION['email'], time() + (86400 * 30), "/");

            // E agora inserção na tabela contas
            $sql_insert2 = "INSERT INTO contas (id_usuario, nome_conta, categoria) VALUES (?, 'Carteira', 3)";
            $stmt_insert2 = $mysqli->prepare($sql_insert2);
            $stmt_insert2->bind_param("i", $id_usuario);
            $stmt_insert2->execute();

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