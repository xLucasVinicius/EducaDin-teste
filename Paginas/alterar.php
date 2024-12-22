<?php 
// Verifica se o 'id' foi fornecido via GET ou POST
if (isset($_SESSION['id'])) {
    $id = $_SESSION['id'];

    // Verifica se o valor do 'id' é numérico para evitar SQL injection
    if (is_numeric($id)) {

        // Usa uma prepared statement para maior segurança
        $stmt = $mysqli->prepare("SELECT * FROM usuarios WHERE id = ?");
        $stmt->bind_param("i", $id); // 'i' indica que o parâmetro é um inteiro
        $stmt->execute();
        $res = $stmt->get_result();

        // Verifica se há algum resultado
        if ($res->num_rows > 0) {
            $row = $res->fetch_object();
            // Agora você pode acessar os dados do $row
        } else {
            echo "Nenhum usuário encontrado com esse ID.";
        }

    } else {
        echo "ID inválido.";
    }
} else {
    echo "ID não fornecido.";
    exit;
}
?>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">


<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EducaDin</title>
    <link rel="stylesheet" href="../Style/alterar.css">
</head>
<body>
<form action="salvar-usuario.php" method="post" enctype="multipart/form-data">
    <input type="hidden" name="id" value="<?php echo $row->id?>">
    <h1>Editar perfil</h1>
    <div class="input-img-perfil">
        <div class="img-perfil">
            <img src="<?php echo $_SESSION['file'] ?>" alt="">
        </div>
        <label for="file" class="file-label">
        <i class="bi bi-pencil"></i>
        </label>
        <input type="file" name="file" id="file">
    </div>
    
    <div class="input-name">
        <span>
            <label for="nome">Nome</label>
            <input type="text" name="nome" value="<?php echo $row->nome?>" id="nome" placeholder="Digite seu nome">
        </span>

        <span>
            <label for="sobrenome">Sobrenome</label>
            <input type="text" name="sobrenome"  id="sobrenome" value="<?php echo $row->sobrenome?>" placeholder="Digite seu sobrenome">
        </span>
    </div>
    <div class="input-login">
        <label for="email">Email</label>
        <input type="email" name="email" value="<?php echo $row->email?>" id="email" placeholder="exemplo@gmail.com">

        <label for="senha">Senha</label>
        <input type="password" name="senha" id="senha" placeholder="digite sua senha" required>

        <label for="senha">Confirmar Senha</label>
        <input type="password" name="senha" id="confirmarsenha" placeholder="digite sua senha novamente" required>
    </div>
    <div class="input-outras-infos">
        <span>
            <label for="data-nasc">Data de Nascimento</label>
            <input type="date" name="data-nasc" value="<?php echo $row->data_nasc?>" id="data-nasc">
        </span>

        <span>
        <label for="telefone">Número</label>
        <input type="tel" name="telefone" value="<?php echo $row->num_tel?>" id="telefone" placeholder="11 99999-9999" >
        </span>
    </div>
    <div class="btn-form">
        <span id="btn-input1"><button>Cancelar</button></span>
        <span id="btn-input2"><input id="btn-salvar" type="submit" value="Salvar"></span>
    </div>
</form>
</body>
</html>

