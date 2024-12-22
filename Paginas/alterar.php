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

<style>

</style>

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

        <label for="telefone">Número</label>
        <input type="tel" name="telefone" value="<?php echo $row->num_tel?>" id="telefone" placeholder="11 99999-9999" >
    </div>
    <div class="input-outras-infos">
        <span>
            <label for="data-nasc">Data de Nascimento</label>
            <input type="date" name="data-nasc" value="<?php echo $row->data_nasc?>" id="data-nasc">
        </span>

        <span>
            <label for="estado">Estado</label>
            <select name="estado" id="estado">
                <option value="Acre" <?php if ($row->estado == "Acre") echo 'selected'; ?>>Acre</option>
                <option value="Alagoas" <?php if ($row->estado == "Alagoas") echo 'selected'; ?>>Alagoas</option>
                <option value="Amapá" <?php if ($row->estado == "Amapá") echo 'selected'; ?>>Amapá</option>
                <option value="Amazonas" <?php if ($row->estado == "Amazonas") echo 'selected'; ?>>Amazonas</option>
                <option value="Bahia" <?php if ($row->estado == "Bahia") echo 'selected'; ?>>Bahia</option>
                <option value="Ceará" <?php if ($row->estado == "Ceará") echo 'selected'; ?>>Ceará</option>
                <option value="Distrito Federal" <?php if ($row->estado == "Distrito Federal") echo 'selected'; ?>>Distrito Federal</option>
                <option value="Espírito Santo" <?php if ($row->estado == "Espirito Santo") echo 'selected'; ?>>Espírito Santo</option>
                <option value="Goiás" <?php if ($row->estado == "Goiás") echo 'selected'; ?>>Goiás</option>
                <option value="Maranhão" <?php if ($row->estado == "Maranhão") echo 'selected'; ?>>Maranhão</option>
                <option value="Mato Grosso" <?php if ($row->estado == "Mato Grosso") echo 'selected'; ?>>Mato Grosso</option>
                <option value="Mato Grosso do Sul" <?php if ($row->estado == "Mato Grosso do Sul") echo 'selected'; ?>>Mato Grosso do Sul</option>
                <option value="Minas Gerais" <?php if ($row->estado == "Minas Gerais") echo 'selected'; ?>>Minas Gerais</option>
                <option value="Pará" <?php if ($row->estado == "Pará") echo 'selected'; ?>>Pará</option>
                <option value="Paraíba" <?php if ($row->estado == "Paraíba") echo 'selected'; ?>>Paraíba</option>
                <option value="Paraná" <?php if ($row->estado == "Paraná") echo 'selected'; ?>>Paraná</option>
                <option value="Pernambuco" <?php if ($row->estado == "Pernambuco") echo 'selected'; ?>>Pernambuco</option>
                <option value="Piauí" <?php if ($row->estado == "Piauí") echo 'selected'; ?>>Piauí</option>
                <option value="Rio de Janeiro" <?php if ($row->estado == "Rio de Janeiro") echo 'selected'; ?>>Rio de Janeiro</option>
                <option value="Rio Grande do Norte" <?php if ($row->estado == "Rio Grande do Norte") echo 'selected'; ?>>Rio Grande do Norte</option>
                <option value="Rio Grande do Sul" <?php if ($row->estado == "Rio Grande do Sul") echo 'selected'; ?>>Rio Grande do Sul</option>
                <option value="Rondônia" <?php if ($row->estado == "Rondônia") echo 'selected'; ?>>Rondônia</option>
                <option value="Roraima" <?php if ($row->estado == "Roraima") echo 'selected'; ?>>Roraima</option>
                <option value="Santa Catarina" <?php if ($row->estado == "Santa Catarina") echo 'selected'; ?>>Santa Catarina</option>
                <option value="São Paulo" <?php if ($row->estado == "São Paulo") echo 'selected'; ?>>São Paulo</option>
                <option value="Sergipe" <?php if ($row->estado == "Sergipe") echo 'selected'; ?>>Sergipe</option>
                <option value="Tocantins" <?php if ($row->estado == "Tocantins") echo 'selected'; ?>>Tocantins</option>
            </select>
        </span>
    </div>
    <div class="btn-form">
        <span id="btn-input1"><button>Cancelar</button></span>
        <span id="btn-input2"><input id="btn-salvar" type="submit" value="Salvar"></span>
    </div>
</form>
</body>
</html>

