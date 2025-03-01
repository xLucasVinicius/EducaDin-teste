<?php
include('config.php');

// Verifique se o formulário foi enviado
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // Verifique se a imagem foi enviada como base64
    if (isset($_POST['base64-image']) && !empty($_POST['base64-image'])) {
        $base64Image = $_POST['base64-image'];

        // Detecta o tipo de imagem (png, jpg, jpeg)
        if (preg_match('/^data:image\/(\w+);base64,/', $base64Image, $tipoImagem)) {
            $extensao = $tipoImagem[1]; // Obtém a extensão do arquivo (png, jpg, etc.)

            // Remove o prefixo do base64
            $imageData = preg_replace('/^data:image\/\w+;base64,/', '', $base64Image);
            $imageData = base64_decode($imageData);

            // Definir o caminho para salvar a imagem no servidor
            $pasta_relativa = "../foto-perfil/";
            $pasta_absoluta = $_SERVER['DOCUMENT_ROOT'] . '/EducaDin-teste/foto-perfil/';
            $novoNomeDoArquivo = uniqid();

            // Caminho absoluto e relativo
            $path_absoluto = $pasta_absoluta . $novoNomeDoArquivo . "." . $extensao;
            $path_relativo = $pasta_relativa . $novoNomeDoArquivo . "." . $extensao;

            // Verificar se o diretório existe, se não, criar
            if (!is_dir($pasta_absoluta)) {
                mkdir($pasta_absoluta, 0777, true);
            }

            // Salvar a imagem no diretório
            if (file_put_contents($path_absoluto, $imageData) === false) {
                die("Erro ao salvar a imagem.");
            }
        } else {
            die("Formato de imagem inválido.");
        }

    } else {
        // Caso não tenha imagem, atribua a imagem padrão
        $path_relativo = "../foto-perfil/default.png"; // Caminho padrão
    }

    // Informações do usuário
    $nome = $_POST['nome'];
    $sobrenome = $_POST['sobrenome'];
    $email = $_POST['email'];
    $salario = $_POST['salario'];  // Pegando o salário do formulário
    $data_nascimento = $_POST['data_nascimento'];  // Pegando a data de nascimento
    $senha = $_POST['senha'];
    $senha_hash = password_hash($senha, PASSWORD_DEFAULT);  // Hash da senha para segurança

    // Verificar se o email já existe no banco de dados
    $stmt_check_email = $mysqli->prepare("SELECT id_usuario FROM usuarios WHERE email = ?");
    $stmt_check_email->bind_param("s", $email);
    $stmt_check_email->execute();
    $stmt_check_email->store_result();

    if ($stmt_check_email->num_rows > 0) {
        die("Este e-mail já está registrado.");
    }

    // Insira os dados do usuário no banco
    $sql_insert = "INSERT INTO usuarios (foto_perfil, nome, sobrenome, email, senha, data_nascimento, salario) 
                   VALUES (?, ?, ?, ?, ?, ?, ?)";

    $stmt_insert = $mysqli->prepare($sql_insert);
    $stmt_insert->bind_param("sssssss", $path_relativo, $nome, $sobrenome, $email, $senha_hash, $data_nascimento, $salario);  // Alterado para incluir salário e data

    // Verifique se a execução foi bem-sucedida
    if ($stmt_insert->execute()) {
        echo "<script>alert('Cadastro realizado com sucesso!')</script>";
        echo "<script>location.href='http://localhost:3000/EducaDin-teste/index.html'</script>"; // Redireciona para página de login
    } else {
        // Exibir mensagem de erro específica do MySQL
        echo "Erro ao cadastrar: " . $stmt_insert->error;
    }
}
?>
