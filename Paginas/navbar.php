<?php

session_start();
include("../Paginas/configs/config.php");
// Verificar se o usuário está logado
if (!isset($_SESSION['email'])) {
    header("Location:../index.php"); // Redirecionar para a página de login caso o usuário não esteja logado
} 

$sql_code = "SELECT * FROM usuarios WHERE email = '{$_SESSION['email']}' LIMIT 1";
$result = $mysqli->query($sql_code);
$usuario = $result->fetch_assoc();
$plano = $usuario['plano'];
$poder = $usuario['poder'];
$status_atividade = $usuario['status_atividade'];

if ($status_atividade == 0) {
    header("Location:../Paginas/configs/logout.php");
}

?>
<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EducaDin</title>
    <link rel="shortcut icon" href="../imagens/logos/favicon.ico" type="image/x-icon">
    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Icons (Opcional) -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet">
    <!-- Estilo Personalizado -->
    <link rel="stylesheet" href="../Style/navbar/navbar.css">
    <!-- Bootstrap-Icons -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">


</head>

<body>
    <!-- Navbar Vertical -->
    <nav class="navbar navbar-vertical d-flex flex-column p-0" id="navbar">

        <!-- Logo do Projeto -->
        <a href="?page=dashboard" class="navbar-brand mb-0 mt-2 p-0">
            <img src="../imagens/logos/logo.png" alt="Logo" id="navbar-logo">
        </a>

        <!-- Links das Páginas -->
        <ul class="nav flex-column w-100">
            <!-- link Dashboard -->
            <li class="nav-item">
                <a href="?page=dashboard" class="nav-link">
                    <i class="bi bi-house-door"></i>
                    <span class="nav-text">Dashboard</span>
                </a>
            </li>
            <!-- link Lançamentos -->
            <li class="nav-item">
                <a href="?page=lancamentos" class="nav-link">
                    <i class="bi bi-card-checklist"></i> <span class="nav-text">Lançamentos</span>
                </a>
            </li>
            <!-- link Desempenho -->
            <li class="nav-item">
                <a href="?page=desempenho" class="nav-link">
                    <i class="bi bi-graph-up-arrow"></i> <span class="nav-text">Desempenho</span>
                </a>
            </li>
            <!-- link Contas -->
            <li class="nav-item">
                <a href="?page=contas" class="nav-link">
                    <i class="bi bi-bank"></i> <span class="nav-text">Contas</span>
                </a>
            </li>
            <!-- link Cartões -->
            <li class="nav-item">
                <a href="?page=cartoes" class="nav-link">
                    <i class="bi bi-credit-card-2-back"></i> <span class="nav-text">Cartões</span>
                </a>
            </li>
            <!-- link Minigames -->
            <li class="nav-item">
                <a href="?page=minigames" class="nav-link">
                    <i class="bi bi-controller"></i> <span class="nav-text">Mini Games</span>
                </a>
            </li>
            <!-- link Planos -->
            <li class="nav-item">
                <a href="?page=planos" class="nav-link">
                    <i class="bi bi-currency-dollar"></i> <span class="nav-text">Planos</span>
                </a>
            </li>
            <!-- link Investimentos -->
            <!-- <li class="nav-item">
                <a href="?page=investimentos" class="nav-link">
                <i class="bi bi-cash-coin"></i> <span class="nav-text">Investimentos</span>
                </a>
            </li> -->
            <!-- link Estudos -->
            <li class="nav-item">
                <a href="?page=estudos" class="nav-link">
                    <i class="bi bi-book"></i> <span class="nav-text">Estude Finanças</span>
                </a>
            </li>
            <!-- link Sobre nós -->
            <li class="nav-item">
                <a href="?page=sobre" class="nav-link">
                    <i class="bi bi-person-raised-hand"></i> <span class="nav-text">Sobre nós</span>
                </a>
            </li>

        </ul>
        <!-- Links Inferiores -->
        <ul class="nav flex-column w-100 bottom-links">
            <?php 
                if ($poder == 1) {
                    echo '
                        <!-- link Admin -->
                        <li class="nav-item">
                            <a href="?page=admin" class="nav-link">
                            <i class="bi bi-code-slash"></i> <span class="nav-text">Admin</span>
                            </a>
                        </li>
                    ';
                }
            ?>
            <!-- link Suporte -->
            <li class="nav-item">
                <a href="?page=contato" class="nav-link">
                    <i class="bi bi-question-circle"></i> <span class="nav-text">Suporte</span>
                </a>
            </li>
            <!-- link Editar Perfil -->
            <li class="nav-item">
                <a href="?page=alterar" class="nav-link">
                    <i class="bi bi-person-gear"></i> <span class="nav-text">Editar Perfil</span>
                </a>
            </li>
            <!-- link Logout -->
            <li class="nav-item">
                <a href="configs/logout.php" class="nav-link">
                    <i class="bi bi-box-arrow-right"></i> <span class="nav-text">Logout</span>
                </a>
            </li>
        </ul>
    </nav>

    <!-- Navbar Superior -->
    <nav class="navbar-top" id="navbarTop">
        <!-- Botão de fechar a navbar -->
        <button class="toggle-btn" id="toggleBtn">
            <i class="fas fa-angle-double-left"></i>
        </button>
        <div class="user-info">
            <!-- Informações do usuário -->
            <a href="?page=alterar" class="link-perfil">
                <img src='<?php echo $_SESSION['foto_perfil'] ?>' alt="">
                <?php 
                    $nomeCompleto = $_SESSION['nome'] . ' ' . $_SESSION['sobrenome'];

                    if ($plano == 1) {
                        echo "<h1 style='color: #F2A900;'> <i class='fas fa-crown' style='margin-right: 5px;'></i> $nomeCompleto</h1>";
                    } else {
                        echo "<h1>$nomeCompleto</h1>";
                    }
                ?>

            </a>
        </div>
    </nav>

    <section class="conteudo">
        <!-- section conteúdo -->
        <?php
            include("configs/config.php");
            switch(@$_REQUEST["page"]){ // switch para verificar qual pagina deve ser carregada
                case "dashboard":
                    include("dashboard.php");
                break;
                case "lancamentos":
                    include("lancamentos.php");
                break;
                case "desempenho":
                    include("desempenho.php");
                break;
                case "cartoes":
                    include("cartoes.php");
                break;
                case "contas":
                    include("contas.php");
                break;
                case "minigames":
                    include("minigames.php");
                break;
                case "loja":
                    include("resgate.php");
                break;
                case "letreco":
                    include("minigames/letreco.php");
                break;
                case "snake":
                    include("minigames/snake.php");
                break;
                case "forca":
                    include("minigames/forca.php");
                break;
                case "jogo4":
                    include("minigames/jogo4.php");
                break;
                case "planos":
                    include("planos.html");
                break;
                case "investimentos":
                    include("investimentos.php");
                break;
                case "estudos":
                    include("estudos.html");
                break;
                case "admin":
                    include("administrador/administrar.php");
                break;
                case "contato":
                    include("contato.php");
                break;
                case "sobre":
                    include("sobre-nos.html");
                break;
                case "alterar":
                    include("alterar.php");
                break;
                case "salvar":
                    include("salvar-usuario.php");
                break;
                default:
                include("dashboard.php");       
            }
        ?>
    </section> <!-- section conteúdo -->

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>

    <!-- JS Personalizado -->
    <script src="../Js/paginas/nav-bar.js"></script>

</body>

</html>