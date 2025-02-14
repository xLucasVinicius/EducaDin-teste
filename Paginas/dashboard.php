<?php
include 'configs/config.php';
$categorias = "['cartao de credito','pix','debito','laser','viagem']";
$query = "SELECT descricao, valor, tipo, metodo_pagamento, parcelas, data_compra FROM lancamentos ORDER BY data_compra DESC LIMIT 5";
$result = $mysqli->query($query);
?>

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
    <div class="conteudo-flex">
      <section class="conteudo-dash">
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
                  <p>+5% ao mês anterior</p>
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
                  <p>-5% ao mês anterior</p>
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
                  <p>+5% ao mês anterior</p>
                </span>
              </div>
            </div>
          </section>
          <section class="secao2">
              <div id="chart1"></div>
          </section>
          <section class="secao3">
              <div id="chart2"></div>
          </section>
          <section class="secao4">
          <div class="table-lancamentos">
              <h1>LANÇAMENTOS</h1>
              <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>DESCRIÇÃO</th>
                            <th>VALOR</th>
                            <th>TIPO</th>
                            <th>CATEGORIA</th>
                            <th>PARCELAS</th>
                            <th>DATA</th>
                            <th>OPÇÕES</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php if ($result->num_rows > 0): ?>
                            <?php while ($lancamento = $result->fetch_assoc()): ?>
                                <tr>
                                    <td><?php echo htmlspecialchars($lancamento['descricao']); ?></td>
                                    <td>R$ <?php echo number_format($lancamento['valor'], 2, ',', '.'); ?></td>
                                    <td><?php echo htmlspecialchars($lancamento['tipo']); ?></td>
                                    <td><?php echo htmlspecialchars($lancamento['metodo_pagamento']); ?></td>
                                    <td><?php echo htmlspecialchars($lancamento['parcelas']); ?></td>
                                    <td><?php echo date('d/m/Y', strtotime($lancamento['data'])); ?></td>
                                    <td>editar/excluir</td>
                                </tr>
                            <?php endwhile; ?>
                        <?php else: ?>
                            <tr>
                                <td colspan="7">Nenhum lançamento encontrado.</td>
                            </tr>
                        <?php endif; ?>
                    </tbody>
                </table>
              </div>
          </div>
          <button id="btn-lancamentos" onclick="exibirLancamentos()">
            <i class="bi bi-plus-lg"></i>
          </button>
          </section>
        </section>
    </div>
        <section class="section-lancamentos">
          <div class="lancar">
            <h1>Lançamento</h1>
            <form action="" method="post" id="form-lancamentos">
              <span class="descricao span-flex">
                <label for="descricao">Descrição</label>
                <input type="text" name="descricao" id="descricao" placeholder="Descrição">
              </span>

              <span class="valor span-flex">
                <label for="valor">Valor</label>
                <input type="number" name="valor" id="valor" placeholder="Valor">
              </span>

              <span class="tipo span-flex">
                <label for="tipo1">Tipo</label>
                <span class="radio">
                  <input type="radio" name="tipo" id="tipo1" value="receita" onchange="ocultarParcelas()">
                  <label for="tipo1" id="label-receita">Receita</label>
                </span>
                  <span class="radio">
                    <input type="radio" name="tipo" id="tipo2" value="despesa" onchange="mostrarParcelas()">
                    <label for="tipo2" id="label-despesa">Despesa</label>
                  </span>
              </span>

              <span class="categorias span-flex">
                <label for="categoria">Categoria</label>
                <select name="categoria" id="categoria" onchange="mostrarSubcategorias()">
                <option value="">Selecione uma categoria</option>
                <option value="moradia">Moradia</option>
                <option value="alimentacao">Alimentação</option>
                <option value="transporte">Transporte</option>
                <option value="educacao">Educação</option>
                <option value="saude">Saúde</option>
                <option value="lazer">Lazer e Entretenimento</option>
                <option value="vestuario">Vestuário</option>
                <option value="impostos">Impostos e Taxas</option>
                <option value="servicos">Serviços e Assinaturas</option>
                <option value="despesas_gerais">Despesas Gerais</option>
                <option value="salario">Salário</option>
                <option value="freelance">Freelance</option>
                <option value="investimentos">Investimentos</option>
                <option value="vendas">Vendas</option>
                <option value="outros">Outros</option>
                </select>
              </span>

            <span class="subcategoria span-flex">
              <label for="subcategoria" id="label-subcategoria">Subcategoria:</label>
              <select name="subcategoria" id="subcategoria">
                <!-- As opções de subcategoria serão preenchidas dinamicamente -->
              </select>
            </span>

              <span class="data span-flex date-container">
                <label for="customDate">Data</label>
                <input type="date" name="data" placeholder="Data" id="customDate">
              </span>

              <span class="parcelas span-flex">
                <label for="parcelas" id="label-parcelas">Parcelas</label>
                <input type="number" name="parcelas" placeholder="Parcelas" id="parcelas">
              </span>

              <span class="btns span-flex">
                <button type="reset" onclick="ocultarParcelas()">Limpar</button>
                <button type="submit">Adicionar</button>
              </span>

            </form>
            <button id="btn-lancamentos-fechar" onclick="fecharLancamentos()">
              <i class="bi bi-x-lg"></i>
            </button>
          </div>
        </section>
    <script src="../Js/apexcharts.min.js"></script>
    <script src="../Js/dashboard.js"></script>

    <script>
    // Configuração para o gráfico de barras
// Obtenha o mês atual abreviado no formato correto
const mesAtual = new Date().toLocaleString('pt-BR', { month: 'short' }).replace('.', '').toLowerCase();

const labels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
const values = [125, 129, 365, 235, 322, 563, 56, 134, 245, 232, 245, 245];

// Converta os rótulos para o mesmo formato do mês atual (tudo em minúsculo)
const labelsFormatados = labels.map(label => label.toLowerCase());

// Defina a cor branca para todas as barras e uma cor destacada para o mês atual
const barColors = labelsFormatados.map(label => {
  return label === mesAtual ? '#F2A900' : 'rgb(255, 255, 255)';
});

const chartElement = document.querySelector('#chart1');

const options = {
    chart: {
        type: 'bar',
        height: '100%',
        width: '100%'
    },
    series: [{
        name: 'Sobra no Mês em Reais',
        data: values
    }],
    plotOptions: {
        bar: {
            borderRadius: 3,
            columnWidth: '65%',
            distributed: true  // Distribui as cores para cada barra
        }
    },
    dataLabels: {
        enabled: false  // Desativa os números dentro das barras
    },
    colors: barColors,  // Aplica as cores nas barras
    xaxis: {
        categories: labels,
        labels: {
            style: {
                colors: 'white'
            }
        }
    },
    yaxis: {
        labels: {
            show: true,  // Mostra os números no eixo Y
            style: {
                colors: 'white'  // Cor dos números do lado esquerdo
            }
        }
    },
    grid: {
        show: true,  // Exibe as linhas de grade
        borderColor: 'rgba(255, 255, 255, 0.1)',  // Cor quase invisível para a grade
        strokeDashArray: 2  // Torna as linhas tracejadas
    },
    legend: {
        show: false  // Remove os quadrados de legenda
    },
    tooltip: {
        enabled: true
    }
};

const chart = new ApexCharts(chartElement, options);
chart.render();




    // Gráfico de Rosca (Doughnut)
    const categorias = <?php echo $categorias; ?>;
    const chartElement2 = document.querySelector('#chart2');

    const optionsDoughnut = {
        chart: {
            type: 'donut',
            height: 250,
            width: 350
        },
        series: [5, 5, 5, 5, 5, 5],  // Substitua os dados conforme necessário
        labels: categorias,
        legend: {
            position: 'bottom',
            labels: {
                colors: 'white'
            }
        },
        plotOptions: {
            pie: {
                donut: {
                    size: '30%'
                }
            }
        }
    };

    const chartDoughnut = new ApexCharts(chartElement2, optionsDoughnut);
    chartDoughnut.render();
</script>

</body>
</html>
