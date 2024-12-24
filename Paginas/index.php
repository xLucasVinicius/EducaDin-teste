<?php
session_start();
// Verificar se o usuário está logado
if (!isset($_SESSION['nome'])) {
    header("Location:inicio.php");
}
?>

<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EducaDin</title>
    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Icons (Opcional) -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet">
    <!-- Estilo Personalizado -->
    <link rel="stylesheet" href="../padrao.css">
      <!-- Bootstrap-Icons -->
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
      <script src="../jS/nav-bar.js" async></script>
</head>
<body>
    <!-- Navbar Vertical -->
    <nav class="navbar navbar-vertical d-flex flex-column p-0" id="navbar">
        <!-- Logo do Projeto -->
        <a href="?page=dashboard" class="navbar-brand mb-0 mt-2 p-0">
            <img src="../imagens/logo.png" alt="Logo" id="navbar-logo">
        </a>
        
        <!-- Links das Páginas -->
        <ul class="nav flex-column w-100">
            <li class="nav-item">
                <a href="?page=dashboard" class="nav-link">
                    <i class="bi bi-house-door"></i>
                    <span class="nav-text">Dashboard</span>
                </a>
            </li>
            <li class="nav-item">
                <a href="?page=lancamentos" class="nav-link">
                <i class="bi bi-card-checklist"></i> <span class="nav-text">Lançamentos</span>
                </a>
            </li>
            <li class="nav-item">
                <a href="?page=desempenho" class="nav-link">
                <i class="bi bi-graph-up-arrow"></i> <span class="nav-text">Desempenho</span>
                </a>
                <li class="nav-item">
                <a href="?page=cartoes" class="nav-link">
                <i class="bi bi-credit-card-2-back"></i> <span class="nav-text">Meus Cartões</span>
                </a>
            </li>    
            </li>
            <li class="nav-item">
                <a href="?page=minigames" class="nav-link">
                    <i class="bi bi-controller"></i> <span class="nav-text">Mini Games</span>
                </a>
            </li>
            <li class="nav-item">
                <a href="?page=planos" class="nav-link">
                <i class="bi bi-currency-dollar"></i> <span class="nav-text">Planos</span>
                </a>
            </li>
            <li class="nav-item">
                <a href="?page=investimentos" class="nav-link">
                <i class="bi bi-cash-coin"></i> <span class="nav-text">Investimentos</span>
                </a>
            </li>
            <li class="nav-item">
                <a href="?page=estudos" class="nav-link">
                    <i class="bi bi-book"></i> <span class="nav-text">Estude Finanças</span>
                </a>
            </li>
            <li class="nav-item">
                <a href="#" class="nav-link">
                    <i class="bi bi-house-door"></i> <span class="nav-text">#</span>
                </a>
            </li>
            <li class="nav-item">
                <a href="#" class="nav-link">
                    <i class="bi bi-house-door"></i> <span class="nav-text">#</span>
                </a>
            </li>
            <li class="nav-item">
                <a href="#" class="nav-link">
                    <i class="bi bi-house-door"></i> <span class="nav-text">#</span>
                </a>
            </li>
        </ul>
        <!-- Links Inferiores -->
        <ul class="nav flex-column w-100 bottom-links">
            <li class="nav-item">
                <a href="?page=contato" class="nav-link">
                <i class="bi bi-question-circle"></i> <span class="nav-text">Suporte</span>
                </a>
            </li>
            <li class="nav-item">
                <a href="?page=alterar" class="nav-link">
                <i class="bi bi-person-gear"></i> <span class="nav-text">Editar Perfil</span>
                </a>
            </li>
            <li class="nav-item">
                <a href="logout.php" class="nav-link">
                    <i class="bi bi-box-arrow-right"></i> <span class="nav-text">Logout</span>
                </a>
            </li>
        </ul>
    </nav>

        <!-- Navbar Superior -->
        <nav class="navbar-top" id="navbarTop">
        <!-- Botão de Toggle -->
        <button class="toggle-btn" id="toggleBtn">
            <i class="fas fa-angle-double-left"></i>
        </button>
        <div class="user-info">
        <a href="?page=alterar" class="link-perfil">
                <img src="<?php echo $_SESSION['file'] ?>" alt="">
                <h1>Lucas Vinicius<!--<?php echo $_SESSION['nome']. ' ' .$_SESSION['sobrenome'] ?> --></h1>
            </a>
        </div>
    </nav>

    <section class="conteudo">  <!-- section conteúdo -->
        <?php
            include("config.php");
            switch(@$_REQUEST["page"]){
                case "dashboard":
                    include("dashboard.php");
                break;
                case "lancamentos":
                    include("lancamentos.php");
                break;
                case "desempenho":
                    include("desempenho.php");
                break;
                case "minigames":
                    include("mingames.php");
                break;
                case "planos":
                    include("planos.php");
                break;
                case "investimentos":
                    include("investimentos.php");
                break;
                case "estudos":
                    include("estudos.php");
                break;
                case "contato":
                    include("contato.php");
                break;
                case "alterar":
                    include("alterar.php");
                break;
                case "logout":
                    include("logout.php");
                break;
                case "login":
                    include("login.php");
                break;
                case "cadastrar":
                    include("cadastro.php");
                break;
                case "salvar":
                    include("salvar-usuario.php");
                break;
                default:
                include("dashboard.php");       
            }
        ?>
    </section> <!-- section conteúdo -->

    <!-- Bootstrap JS (Opcional) -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>

</body>
</html>
