<?php
include('config.php'); // Certifique-se de que está incluindo o arquivo de configuração

// Recebe os dados enviados via POST
$data = json_decode(file_get_contents('php://input'), true);

// Dados do usuário
$nome = $data['nome'];
$sobrenome = $data['sobrenome'];
$email = $data['email'];
$foto_perfil = $data['foto_perfil'];
$salario = null;  
$data_nascimento = null;

// Inicia a sessão
session_start();

// Verificar se o email já está cadastrado
$stmt_check_email = $mysqli->prepare("SELECT id_usuario, nome, sobrenome, email, foto_perfil, salario, data_nascimento FROM usuarios WHERE email = ?");
$stmt_check_email->bind_param("s", $email);
$stmt_check_email->execute();
$stmt_check_email->store_result();

if ($stmt_check_email->num_rows > 0) {
    // O email já existe no banco de dados, logar o usuário
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
    // O email não existe, vamos cadastrar o usuário
    // Como não temos a senha, vamos gerar uma senha aleatória ou deixar em branco, dependendo da sua lógica
    $senha_hash = password_hash('senha_gerada_aleatoriamente', PASSWORD_DEFAULT);  

    // Inserir no banco de dados
    $sql_insert = "INSERT INTO usuarios (foto_perfil, nome, sobrenome, email, senha, data_nascimento, salario) 
                   VALUES (?, ?, ?, ?, ?, ?, ?)";
    $stmt_insert = $mysqli->prepare($sql_insert);
    $stmt_insert->bind_param("sssssss", $foto_perfil, $nome, $sobrenome, $email, $senha_hash, $data_nascimento, $salario);

    if ($stmt_insert->execute()) {
        // Cadastro realizado com sucesso, fazer login e redirecionar para o dashboard

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
}
?>
