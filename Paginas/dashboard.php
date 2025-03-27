<?php
include 'configs/config.php';

//declarações para teste
$categorias = "['cartao de credito','pix','debito','laser','viagem']";
$query = "SELECT * FROM lancamentos WHERE id_usuario = " . $_SESSION['id'] . " ORDER BY data DESC LIMIT 5";
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
                  <h2>R$ 1.000</h2>
                  <p>+5% ao mês anterior</p>
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
                  <h2>R$ 1.000</h2>
                  <p>-5% ao mês anterior</p>
                </span>
                <span class="barra"></span>
              </div>
              <div> <!-- div com as informacoes -->
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
          <section class="secao2"> <!-- section com o grafico 1 -->
              <div id="chart1"></div> <!-- div que armazena o grafico -->
          </section>
          <section class="secao3"> <!-- section com o grafico 2 -->
              <div id="chart2"></div> <!-- div que armazena o grafico -->
          </section>
          <section class="secao4"> <!-- section com a tabela de lancamentos -->
          <div class="table-lancamentos"> <!-- div que armazena tudo relativo a tabela -->
              <h1>LANÇAMENTOS</h1>
              <div class="table-container"> <!-- div que armazena a tabela -->
                <table>
                    <thead>
                        <tr>
                            <th>DESCRIÇÃO</th>
                            <th>VALOR</th>
                            <th>TIPO</th>
                            <th>METODO DE PAGAMENTO</th>
                            <th>CONTA</th>
                            <th>SUBCATEGORIA</th>
                            <th>DATA</th>
                            <th>PARCELAS</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php if ($result->num_rows > 0): ?> <!-- Verifica se houve resultados -->
                            <?php while ($lancamento = $result->fetch_assoc()): ?> <!-- Itera sobre os resultados -->
                                <tr>
                                    <td><?php echo htmlspecialchars($lancamento['descricao']); ?></td> <!-- Exibe a descrição -->
                                    <td>R$ <?php echo number_format($lancamento['valor'], 2, ',', '.'); ?></td> <!-- Exibe o valor formatado -->
                                    <td><?php echo htmlspecialchars($lancamento['tipo']); ?></td> <!-- Exibe o tipo -->
                                    <td><?php echo htmlspecialchars($lancamento['metodo_pagamento']); ?></td> <!-- Exibe o metodo de pagamento -->
                                    <td><?php echo htmlspecialchars($lancamento['nome_conta']); ?></td> <!-- Exibe o nome da conta -->
                                    <td><?php echo htmlspecialchars($lancamento['subcategoria']); ?></td> <!-- Exibe a subcategoria -->
                                    <td><?php echo date('d/m/Y', strtotime($lancamento['data'])); ?></td> <!-- Exibe a data formatada -->
                                    <td><?php echo htmlspecialchars($lancamento['parcelas']); ?></td> <!-- Exibe o numero de parcelas -->
                                </tr>
                            <?php endwhile; ?>
                        <?php else: ?>
                            <tr>
                                <td colspan="7">Nenhum lançamento encontrado.</td> <!-- Mensagem de nenhum lançamento encontrado -->
                            </tr>
                        <?php endif; ?>
                    </tbody>
                </table>
              </div>
          </div>
          <button id="btn-lancamentos" onclick="exibirLancamentos()"> <!-- div que armazena o botão de exibir lançamentos -->
            <i class="bi bi-plus-lg"></i> <!-- icone do botão -->
          </button>
          </section>
        </section>
    </div>
        <section class="section-lancamentos"> <!-- section com o formulário de lançamentos -->
          <div class="lancar"> <!-- div que armazena tudo relativo ao formulário -->
            <h1>Lançamento</h1>
            <form action="" method="post" id="form-lancamentos"> <!-- formulário -->
              
              <span class="descricao span-flex"> <!-- span referentes a descrição -->
                <label for="descricao">Descrição</label>
                <input type="text" name="descricao" id="descricao" placeholder="Descrição">
              </span>

              <span class="valor span-flex"> <!-- span referentes ao valor -->
                <label for="valor">Valor</label>
                <input type="number" name="valor" id="valor" placeholder="Valor">
              </span>
              
              <span class="conta span-flex"> <!-- span referentes a conta -->
                <label for="conta-select">Conta</label>
                <select name="conta-selected" id="conta-selected">
                  <option value="">Selecione uma conta</option>
                </select>
              </span>

              <span class="tipo span-flex"> <!-- span referentes ao tipo -->
                <label for="tipo1">Tipo</label>
                <span class="radio">
                  <input type="radio" name="tipo" id="tipo1" value="receita" onchange="ocultarParcelas()">
                  <label for="tipo1" id="label-receita">Receita</label>
                </span>
                  <span class="radio">
                    <input type="radio" name="tipo" id="tipo2" value="despesa" onchange="mostrarParcelas(), mostarCartoes()">
                    <label for="tipo2" id="label-despesa">Despesa</label>
                  </span>
              </span>

              <span class="categorias span-flex"> <!-- span referentes as categorias -->
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

            <span class="subcategoria span-flex"> <!-- span referentes as subcategorias -->
              <label for="subcategoria" id="label-subcategoria">Subcategoria:</label>
              <select name="subcategoria" id="subcategoria">
                <!-- As opções de subcategoria serão preenchidas dinamicamente -->
              </select>
            </span>

              <span class="data span-flex date-container"> <!-- span referentes a data -->
                <label for="customDate">Data</label>
                <input type="date" name="data" placeholder="Data" id="customDate">
              </span>

              <span class="parcelas span-flex"> <!-- span referentes as parcelas -->
                <label for="parcelas" id="label-parcelas">Parcelas</label>
                <input type="number" name="parcelas" placeholder="Parcelas" id="parcelas">
              </span>

              <span class="btns span-flex"> <!-- span referentes aos botões -->
                <button type="reset" onclick="ocultarParcelas()">Limpar</button> <!-- Botão de limpar -->
                <button type="submit">Adicionar</button> <!-- Botão de adicionar -->
              </span>

            </form>
            <button id="btn-lancamentos-fechar" onclick="fecharLancamentos()"> <!-- Botão de fechar a div de lançamentos -->
              <i class="bi bi-x-lg"></i>
            </button>
          </div>
        </section>
    <script src="../Js/apexcharts.min.js"></script> <!-- Biblioteca ApexCharts -->
    <script src="../Js/dashboard.js"></script> <!-- JS Personalizado -->
    <script src="../Js/graficos.js"></script> <!-- JS Personalizado -->
</body>
</html>
