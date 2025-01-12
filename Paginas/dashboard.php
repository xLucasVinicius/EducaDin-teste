<?php
$labels = "['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']";
$categorias = "['cartao de credito','pix','debito','laser','viagem']";
?>

<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EducaDin</title>
    <link rel="stylesheet" href="../Style/dashboard.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
</head>
<body>
    <section class="container">
        <section class="secao1">
          <div class="desempenho-fluxo">
            <div>
              <span class="icon">
                <i class="bi bi-coin" style="color: green"></i>
                <span class="arrow">
                  <i class="bi bi-arrow-down-left-circle" style="color: green"></i>
                </span>
              </span>
              <span class="infos">
                <h1>Entradas</h1>
                <h2>R$ 1.000</h2>
                <p>+5% este mês</p>
              </span>
              <span class="barra"></span>
            </div>

            <div>
              <span class="icon">
                <i class="bi bi-coin" style="color: red"></i>
                <span class="arrow">
                  <i class="bi bi-arrow-up-right-circle" style="color: red"></i>
                </span>
              </span>
              <span class="infos">
                <h1>Saidas</h1>
                <h2>R$ 1.000</h2>
                <p>-5% este mês</p>
              </span>
              <span class="barra"></span>
            </div>
            <div>
              <span class="icon">
                <i class="bi bi-cash-coin" style="color: skyblue"></i>
              </span>
              <span class="infos">
                <h1>Total</h1>
                <h2>R$ 1.000</h2>
                <p>+5% este mês</p>
              </span>
            </div>
          </div>
        </section>
        <section class="secao2">
            <canvas id="chart1"></canvas>
        </section>
        <section class="secao3">
            <canvas id="chart2"></canvas>
        </section>
        <section class="secao4">
        <div class="table-lancamentos">
          <h1>LANÇAMENTOS</h1>
          <table>
          <th>DESCRICAO</th>
          <th>VALOR</th>
          <th>TIPO</th>
          <th>MÉTODO</th>
          <th>PARCELAS</th>
          <th>DATA</th>
          <th>OPÇÕES</th>
          <tr>
              <td>emprestimo</td>
              <td>R$ 1.000</td>
              <td>despeza</td>
              <td>conta</td>
              <td>10x</td>
              <td>21/10/2024</td>
              <td>editar/excluir</td>
          </tr>
          <tr>
              <td>sd</td>
              <td>4</td>
              <td>4</td>
              <td>4</td>
              <td>4</td>
              <td>4</td>
              <td>editar/excluir</td>
          </tr>
          <tr>
              <td>5</td>
              <td>5</td>
              <td>5</td>
              <td>5</td>
              <td>5</td>
              <td>5</td>
              <td>editar/excluir</td>
          </tr>
          <tr>
              <td>6</td>
              <td>6</td>
              <td>6</td>
              <td>6</td>
              <td>6</td>
              <td>6</td>
              <td>editar/excluir</td>
          </tr>
          <tr>
              <td>7</td>
              <td>7</td>
              <td>7</td>
              <td>7</td>
              <td>7</td>
              <td>7</td>
              <td>editar/excluir</td>
          </tr>
              </table>
        </div>
        <button id="btn-lancamentos">
        <!-- <i class="bi bi-database-add" title="Adicionar Lançamento" ></i> -->Adicionar Lançamento
        </button>
        </section>
    </section>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

    <script>
  const ctx = document.getElementById('chart1');
  const ctx2 = document.getElementById('chart2');


  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: <?php echo $labels; ?>,
      datasets: [{
        label: 'Sobra no Mês em Reais',
        data: [125, 129, 365,235, 322,563, 56, 134, 245, 232, 245, 245],
        backgroundColor: 'rgb(78, 75, 75)',
        borderColor: '#F2A900',
        borderWidth: 2,
        maxBarThickness: 30,
        borderRadius: 5
      }]
    },
    options: {
      scales: {
          x: {
              ticks: {
                  color: 'white', // Cor dos labels do eixo X
              }
          },
          y: {
              beginAtZero: true,
              ticks: {
                  display: false, // Cor dos labels do eixo Y
              }
          }
      },
      plugins: {
          legend: {
              labels: {
                  color: 'white' // Cor dos labels da legenda
              }
          }
      }
    }
  });

  new Chart(ctx2, {
    type: 'doughnut',
    data: {
      labels: <?php echo $categorias; ?>,
      datasets: [{
        label: 'Vezes que utilizou a categoria',
        data: [12, 19, 3, 5, 2, 3],
        borderWidth: 1
      }]
    },
    options: {
      plugins: {
          legend: {
            position: 'right',
            labels: {
                boxWidth: 10,
                color: 'white'
            }
          }
      }
    }
  });


</script>
</body>
</html>
