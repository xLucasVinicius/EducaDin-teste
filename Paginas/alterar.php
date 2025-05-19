<?php
// Verifica se o 'id' foi fornecido via GET ou POST
if (isset($_SESSION['id_usuario'])) {
    $id = $_SESSION['id_usuario'];

    // Verifica se o valor do 'id' é numérico para evitar SQL injection
    if (is_numeric($id)) {

        // Usa uma prepared statement para maior segurança
        $stmt = $mysqli->prepare("SELECT * FROM usuarios WHERE id_usuario = ?");
        $stmt->bind_param("i", $id); // 'i' indica que o parâmetro é um inteiro
        $stmt->execute();
        $res = $stmt->get_result();

        // Verifica se há algum resultado
        if ($res->num_rows > 0) {
            $row = $res->fetch_object();
            $salario = 'R$ '.number_format($row->salario, 2, ',', '.');
            $data_cadastro = date("d/m/Y", strtotime($row->data_cadastro));
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
<!DOCTYPE html>
<html lang="pt-br">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>EducaDin</title>
        <link rel="stylesheet" href="../Style/editar-perfil/alterar.css">
        <link rel="stylesheet" href="../Style/globais/msg-confirmacao.css">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
</head>
<body>
<!-- Modal de Sucesso -->
<div id="successModal" class="modal">
    <div class="modal-content">
        <h2>Sucesso!</h2>
        <p>O cadastro foi atualizado com sucesso.</p>
        <button id="closeModalBtn">Iniciar sessão</button>
    </div>
</div>

<form action="configs/salvar-usuario.php" method="POST" enctype="multipart/form-data" id="form-salvar-usuario">
    <h1>Editar <e style="color: #F5A900; font-family:orbitron">perfil</e></h1>
    <p id="data-cadastro">Conta criada em: <?php echo $data_cadastro; ?></p>
    <div class="input-img-perfil">
        <div class="img-perfil">
            <img id="imagem-perfil" src="<?php echo $_SESSION['foto_perfil']; ?>" alt="">
        </div>
        <a href="editar-imagem.html" class="file-label">
            <i class="bi bi-pencil"></i>
        </a>
    </div>
    
    <div class="input-name">
        <span class="input-box">
            <label for="nome">Nome</label>
            <input type="text" name="nome" value="<?php echo $row->nome; ?>" id="nome" placeholder="Digite seu nome">
            <span class="error"></span>
        </span>

        <span class="input-box">
            <label for="sobrenome">Sobrenome</label>
            <input type="text" name="sobrenome"  id="sobrenome" value="<?php echo $row->sobrenome; ?>" placeholder="Digite seu sobrenome">
            <span class="error"></span>
        </span>
    </div>
    <div class="input-login">
        <span class="input-box">
            <label for="email">Email</label>
            <input type="email" name="email" value="<?php echo $row->email; ?>" id="email" placeholder="exemplo@gmail.com">
            <span class="error"></span>
        </span>

        <span class="input-box" id="span-senha">
            <label for="senha">Senha</label>
            <input type="password" name="senha" id="senha" placeholder="digite sua senha">
            <i class="bi bi-eye" id="senha-icon" onclick="mostrarSenha()"></i>
            <span class="error"></span>
        </span>

        <span class="input-box" id="span-confirmarsenha">
            <label for="confirmar-senha">Confirmar Senha</label>
            <input type="password" name="confirmar-senha" id="confirmar-senha" placeholder="digite sua senha novamente">
            <i class="bi bi-eye" id="confirmarsenha-icon" onclick="mostrarConfirmarSenha()"></i>
            <span class="error"></span>
        </span>
    </div>
    <div class="input-outras-infos">
        <span class="input-box">
            <label for="data-nasc">Data de Nascimento</label>
            <input type="date" name="data-nascimento" value="<?php echo $row->data_nascimento; ?>" id="data-nasc">
            <span class="error"></span>
            <i class="bi bi-calendar3"></i>
        </span>

        <span class="input-box">
                <label for="salario">Salário</label>
                <input type="text" name="salario" value=" <?php echo $salario; ?>" id="salario" placeholder="R$ 0,00">
                <span class="error"></span>
            </span>
    </div>
    <div class="btn-form">
        <span id="btn-input1"><button type="button" id="btn-cancelar">Cancelar</button></span>
        <span id="btn-input2"><input id="btn-salvar" type="submit" value="Salvar"></span>
    </div>

    <!-- Campo oculto para enviar a imagem em base64 -->
    <input type="hidden" name="base64-image" id="base64-image">
    <!-- Campo oculto para enviar o ID do usuário -->
    <input type="hidden" name="id_usuario" value="<?php echo $id; ?>">

</form>


<script src="../Js/login/salvar-usuario.js"></script>

</body>
</html>
