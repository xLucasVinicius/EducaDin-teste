<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="../Style/admin/administrar.css">
    <link rel="stylesheet" href="../Style/admin/administrar-media.css">
</head>
<body>
    <section class="conteudo-adm-total">
        <h1>Painel Administrativo</h1>
        <section class="dashboard-adm">
            <h2>Dashboard</h2>
            <section class="dashboard">
                <div class="cards usuarios">
                <i class="bi bi-people card-icon"></i>
                <div class="conteudo-card">
                    <span class="titulo-card">Usuários Cadastrados</span>
                    <span class="valor-card"></span>
                </div>
                </div>
                <div class="cards premium">
                <i class="bi bi-star-fill card-icon"></i>
                <div class="conteudo-card">
                    <span class="titulo-card">Usuários Premium</span>
                    <span class="valor-card"></span>
                </div>
                </div>
                <div class="cards trocas">
                <i class="bi bi-gift"></i>
                <div class="conteudo-card">
                    <span class="titulo-card">Média de trocas por mês</span>
                    <span class="valor-card"></span>
                </div>
                </div>
                <div class="cards contas">
                <i class="bi bi-wallet2 card-icon"></i>
                <div class="conteudo-card">
                    <span class="titulo-card">Média de contas/cartões por usuário</span>
                    <span class="valor-card"></span>
                </div>
                </div>
                <div class="cards moedas">
                <i class="bi bi-controller card-icon"></i>
                <div class="conteudo-card">
                    <span class="titulo-card">Total de moedas distribuidas</span>
                    <span class="valor-card"></span>
                </div>
                </div>
            </section>
            <div class="chart-usuarios">
                <h2>Crescimento de Usuários</h2>
                <select name="ano" id="ano">

                </select>
                <div id="chart"></div>
            </div>
        </section>

        <section class="gerenciar-usuarios">
            <h2>Gerenciar Usuários</h2>
            <section class="conteiner-tabela">
                <div class="buscar-filtro">
                    <p>Filtrar por:</p>
                    <select name="plano" id="plano">
                        <option value="todos">Plano</option>
                        <option value="gratis">Grátis</option>
                        <option value="premium">Premium</option>
                    </select>
                    <input type="text" id="busca" placeholder="Busca persoalizada">
                    </div>
                    <div class="tabela">
                        <table class="tabela-usuarios">
                            <thead>
                                <tr>
                                <th>Foto</th>
                                <th>Nome</th>
                                <th>Email</th>
                                <th>Plano</th>
                                <th>Data de Criação</th>
                                <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody id="tabela-corpo">
                                <!-- Conteúdo gerado via JavaScript -->
                            </tbody>
                        </table>
                    </div>
            </section>
        </section>
    </section>

    <script src="../Js/libs/apexcharts.min.js"></script> <!-- Biblioteca ApexCharts -->
    <script src="../Js/admin/administrar.js"></script>
</body>
</html>