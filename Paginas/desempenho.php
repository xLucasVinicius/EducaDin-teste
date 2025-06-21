<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EducaDin</title>
    <link rel="stylesheet" href="../Style/desempenho/desempenho.css">
    <link rel="stylesheet" href="../Style/desempenho/media-desempenho.css">
</head>
<body>
    <section class="container-total-desempenho">
        <h1>Desempenho Geral</h1>
        <section class="conteudo-total">
            <div class="grafico-desempenho chart1">
                Desempenho Anual
                <h2 id="faturamento-geral"></h2>
                <div class="seletor-ano">
                    <select id="ano" name="ano">
                        <!-- Os anos serão populados dinamicamente -->
                    </select>
                </div>
                <div id="chart1"></div>
            </div>
            <div class="grafico-desempenho chart2">
                Contas
                <table id="tabela-contas">
                    
                </table>
            </div>
            <div class="grafico-desempenho chart3">
                <h3>Gasto Mensal</h3>
                <div id="checkbox-categorias"></div>
                <select id="select-ano"></select>
                <div id="chart2"></div>
            </div>
            <div class="grafico-desempenho chart4">
                Despesas por Categoria
                <div class="seletor-data">
                    <select id="data-selecionada" name="data-selecionada">
                        <!-- Os dados serão populados dinamicamente -->
                    </select>
                </div>
                <div id="chart3"></div>
            </div>
            <div class="grafico-desempenho chart5">
                Controle de Gastos
                <select name="data-essencial" id="data-essencial"></select>
                <div id="grafico-categorias">
                    <div class="barra-container">
                        <span style="color: rgb(0, 255, 0);">Gastos Essenciais</span>
                        <div class="progress-bar">
                        <div id="barra-essenciais" class="progresso"></div>
                        </div>
                        <span id="porcentagem-essenciais" style="color:rgb(0, 255, 0)">0%</span>
                    </div>

                    <div class="barra-container">
                        <span style="color: rgb(255, 0, 0);">Gastos Desnecessárias</span>
                        <div class="progress-bar">
                        <div id="barra-desnecessarias" class="progresso"></div>
                        </div>
                        <span id="porcentagem-desnecessarias" style="color:rgb(255, 0, 0)">0%</span>
                    </div>
                </div>
            </div>
        </section>
    </section>



    <script src="../Js/libs/apexcharts.min.js"></script> <!-- Biblioteca ApexCharts -->
    <script src="../Js/paginas/desempenho.js"></script> <!-- JS Personalizado -->
</body>
</html>