<?php
include('config.php');

// Função para formatar o salário
function formatarSalario($salario) {
    $salario = str_replace("R$", "", $salario); 
    $salario = str_replace(".", "", $salario); 
    $salario = str_replace(",", ".", $salario); 
    $salario = floatval($salario); 
    return $salario;
}

// Verifique se o formulário foi enviado
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // Informações do usuário
    $nome = $_POST['nome'];
    $sobrenome = $_POST['sobrenome'];
    $email = $_POST['email'];
    $salario = $_POST['salario'];  
    $data_nascimento = $_POST['data-nascimento'];  
    $senha = $_POST['senha'];
    $senha_hash = password_hash($senha, PASSWORD_DEFAULT);

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

    // Formatar corretamente o salário
    $salario = formatarSalario($salario);  

    // Verificar e formatar a data de nascimento
    $data_nascimento_obj = DateTime::createFromFormat('Y-m-d', $data_nascimento);
    if ($data_nascimento_obj) {
        $data_nascimento = $data_nascimento_obj->format('Y-m-d'); 
    } else {
        die("Formato de data inválido.");
    }

    // Verificar se é uma atualização ou um cadastro
    if (isset($_POST['id_usuario']) && !empty($_POST['id_usuario'])) {
        // Atualização de cadastro
        $id_usuario = $_POST['id_usuario'];

        // Verificar se uma nova imagem foi enviada
        if (isset($_POST['base64-image']) && !empty($_POST['base64-image'])) {
            $base64Image = $_POST['base64-image']; // Salvar o base64 da nova imagem

            // Detecta o tipo de imagem (png, jpg, jpeg)
            if (preg_match('/^data:image\/(\w+);base64,/', $base64Image, $tipoImagem)) {
                $extensao = $tipoImagem[1]; 

                // Remove o prefixo do base64
                $imageData = preg_replace('/^data:image\/\w+;base64,/', '', $base64Image);
                $imageData = base64_decode($imageData);

                // Definir o caminho para salvar a nova imagem no servidor
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

                // Salvar a nova imagem no diretório
                if (file_put_contents($path_absoluto, $imageData) === false) {
                    die("Erro ao salvar a nova imagem.");
                }

                // Apagar a imagem antiga se ela não for a imagem padrão
                $stmt_check_image = $mysqli->prepare("SELECT foto_perfil FROM usuarios WHERE id_usuario = ?");
                $stmt_check_image->bind_param("i", $id_usuario);
                $stmt_check_image->execute();
                $stmt_check_image->store_result();
                $stmt_check_image->bind_result($foto_antiga);
                $stmt_check_image->fetch();

                if ($foto_antiga && $foto_antiga != "../foto-perfil/default.png") {
                    $caminho_imagem_antiga = $_SERVER['DOCUMENT_ROOT'] . "/EducaDin-teste" . substr($foto_antiga, 2);
                    if (file_exists($caminho_imagem_antiga)) {
                        unlink($caminho_imagem_antiga); // Apaga a imagem antiga
                    }
                }
            } else {
                die("Formato de imagem inválido.");
            }
        } else {
            // Se nenhuma imagem nova foi enviada, manter a imagem atual
            $stmt_check_image = $mysqli->prepare("SELECT foto_perfil FROM usuarios WHERE id_usuario = ?");
            $stmt_check_image->bind_param("i", $id_usuario);
            $stmt_check_image->execute();
            $stmt_check_image->store_result();
            $stmt_check_image->bind_result($path_relativo);
            $stmt_check_image->fetch();
        }

        // Gerar a query SQL para atualização
        $sql_update = "UPDATE usuarios SET foto_perfil = ?, nome = ?, sobrenome = ?, email = ?, senha = ?, data_nascimento = ?, salario = ? WHERE id_usuario = ?";
        $stmt_update = $mysqli->prepare($sql_update);
        $stmt_update->bind_param("sssssssi", $path_relativo, $nome, $sobrenome, $email, $senha_hash, $data_nascimento, $salario, $id_usuario);

        // Executar a query
        if ($stmt_update->execute()) {
            echo json_encode(['status' => 'success']);
        } else {
            echo json_encode(['status' => 'error']);
        }
    } else {
        // Verificar se o email já está cadastrado antes de salvar a imagem
        $stmt_check_email = $mysqli->prepare("SELECT id_usuario FROM usuarios WHERE email = ?");
        $stmt_check_email->bind_param("s", $email);
        $stmt_check_email->execute();
        $stmt_check_email->store_result();

        if ($stmt_check_email->num_rows > 0) {
            echo json_encode(['status' => 'error_email']);
            exit;
        }

        // Verifique se a imagem foi enviada como base64
        if (isset($_POST['base64-image']) && !empty($_POST['base64-image'])) {
            $base64Image = $_POST['base64-image'];

            // Detecta o tipo de imagem (png, jpg, jpeg)
            if (preg_match('/^data:image\/(\w+);base64,/', $base64Image, $tipoImagem)) {
                $extensao = $tipoImagem[1]; 

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
            $path_relativo = "../foto-perfil/default.png"; 
        }

        // Inserção dos dados do usuário
        $sql_insert = "INSERT INTO usuarios (foto_perfil, nome, sobrenome, email, senha, data_nascimento, salario) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt_insert = $mysqli->prepare($sql_insert);
        $stmt_insert->bind_param("sssssss", $path_relativo, $nome, $sobrenome, $email, $senha_hash, $data_nascimento, $salario);

        if ($stmt_insert->execute()) {
            
            // Recuperar o ID do usuário inserido
            $id_usuario = $mysqli->insert_id;

            // E agora inserção na tabela contas
            $sql_insert2 = "INSERT INTO contas (id_usuario, nome_conta, categoria) VALUES (?, 'Carteira', 3)";
            $stmt_insert2 = $mysqli->prepare($sql_insert2);
            $stmt_insert2->bind_param("i", $id_usuario);
            $stmt_insert2->execute();

            echo json_encode(['status' => 'success2']);
        } else {
            echo json_encode(['status' => 'error']);
        }

    }
}
?>
