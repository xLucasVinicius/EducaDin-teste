<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EducaDin</title>
    <link rel="stylesheet" href="../Style/desempenho/desempenho.css">
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
                Gráfico 3
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
                Gráfico 5
                <div id="chart4"></div>
            </div>
        </section>
    </section>



    <script src="../Js/libs/apexcharts.min.js"></script> <!-- Biblioteca ApexCharts -->
    <script src="../Js/paginas/desempenho.js"></script> <!-- JS Personalizado -->
</body>
</html>