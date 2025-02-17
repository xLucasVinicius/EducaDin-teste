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
    const categorias = ['cartao de credito','pix','debito','laser','viagem'];
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