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
</head>
<body>
    <section class="container">
        <section class="secao1">Seção 1</section>
        <section class="secao2">
            <canvas id="chart1"></canvas>
        </section>
        <section class="secao3">
            <canvas id="chart2"></canvas>
        </section>
        <section class="secao4">Seção 4</section>   
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
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        borderWidth: 1,
        maxBarThickness: 10,
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });

  new Chart(ctx2, {
    type: 'doughnut',
    data: {
      labels: <?php echo $categorias; ?>,
      datasets: [{
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        borderWidth: 1
      }]
    },
    options: {
      plugins: {
          legend: {
            position: 'right',
            labels: {
                boxWidth: 10
            }
          }
      }
    }
  });


</script>
</body>
</html>
