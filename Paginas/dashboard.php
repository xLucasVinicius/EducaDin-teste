<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EducaDin</title>
    <link rel="stylesheet" href="../Style/dashboard/dashboard.css">
    <link rel="stylesheet" href="../Style/dashboard/dashboard-media.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
</head>
<body>
    <div class="conteudo-flex"> <!-- section flex -->
      <section class="conteudo-dash"> <!-- section com todo o conteudo -->
          <section class="secao1"> <!-- section com resumo do mes -->
            <div class="desempenho-fluxo"> <!-- div que armazena as outras divs -->
              <div> <!-- div com as informacoes -->
                <span class="icon">
                  <i class="bi bi-coin" style="color: green"></i>
                  <span class="arrow">
                    <i class="bi bi-arrow-down-left-circle" style="color: green"></i>
                  </span>
                </span>
                <span class="infos">
                  <h1>Entradas</h1>
                  <h2 id="txtEntradas">R$ 1.000</h2>
                  <p id="porcentagemEntradas">+5% ao mês anterior</p>
                </span>
                <span class="barra"></span>
              </div>
              <div> <!-- div com as informacoes -->
                <span class="icon">
                  <i class="bi bi-coin" style="color: red"></i>
                  <span class="arrow">
                    <i class="bi bi-arrow-up-right-circle" style="color: red"></i>
                  </span>
                </span>
                <span class="infos">
                  <h1>Saidas</h1>
                  <h2 id="txtSaidas">R$ 1.000</h2>
                  <p id="porcentagemSaidas">-5% ao mês anterior</p>
                </span>
                <span class="barra"></span>
              </div>
              <div> <!-- div com as informacoes -->
                <span class="icon">
                  <i class="bi bi-cash-coin" style="color: skyblue"></i>
                </span>
                <span class="infos">
                  <h1>Total</h1>
                  <h2 id="txtSaldo">R$ 1.000</h2>
                  <p id="porcentagemSaldo">+5% ao mês anterior</p>
                </span>
              </div>
            </div>
          </section>
          <section class="secao2"> <!-- section com o grafico 1 -->
              Desempenho Mensal
              <div id="chart1"></div> <!-- div que armazena o grafico -->
          </section>
          <section class="secao3"> <!-- section com o grafico 2 -->
            Despesas por Categoria
            <div id="chart2"></div> <!-- div que armazena o grafico -->
          </section>
          <section class="secao4"> <!-- section com a tabela de lancamentos -->
          <div class="table-lancamentos"> <!-- div que armazena tudo relativo a tabela -->
              <h1>LANÇAMENTOS</h1>
              <div class="table-container">
                <!-- tabela dinâmica -->
              </div>
          </div>
          </section>
        </section>
    </div>
    <script src="../Js/libs/apexcharts.min.js"></script> <!-- Biblioteca ApexCharts -->
    <script src="../Js/paginas/dashboard.js"></script> <!-- JS Personalizado -->
</body>
</html>
