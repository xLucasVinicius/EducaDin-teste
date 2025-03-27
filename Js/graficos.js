// Configuração para o gráfico de barras

const mesAtual = new Date().toLocaleString('pt-BR', { month: 'short' }).replace('.', '').toLowerCase(); // Obtenha o mês atual abreviado no formato correto

const labels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']; // Rotulos do gráfico
const values = [125, 129, 365, 235, 322, 563, 56, 134, 245, 232, 245, 245]; // Valores para cada mês(exemplo)

// Converte os rótulos para o mesmo formato do mês atual (tudo em minúsculo)
const labelsFormatados = labels.map(label => label.toLowerCase());

// Defina a cor branca para todas as barras e uma cor destacada para o mês atual
const barColors = labelsFormatados.map(label => {
  return label === mesAtual ? '#F2A900' : 'rgb(255, 255, 255)';
});

const chartElement = document.querySelector('#chart1'); // Selecione o elemento do gráfico

const options = { // Configuração do gráfico
    chart: {
        type: 'bar', // Tipo do gráfico
        height: '100%', // Altura do gráfico
        width: '100%'  // Largura do gráfico
    },
    series: [{
        name: 'Sobra no Mês em Reais', // Nome da série
        data: values  // Valores para cada mês
    }],
    plotOptions: {
        bar: {
            borderRadius: 3,  // Arredonda as barras
            columnWidth: '65%',  // Largura das barras
            distributed: true  // Distribui as cores para cada barra
        }
    },
    dataLabels: {
        enabled: false  // Desativa os números dentro das barras
    },
    colors: barColors,  // Aplica as cores nas barras
    xaxis: {
        categories: labels,  // Rotulos do eixo X
        labels: {
            style: {
                colors: 'white'  // Cor dos rotulos
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
        enabled: true  // Exibe o tooltip ao passar o mouse sobre as barras
    }
};

const chart = new ApexCharts(chartElement, options);  // Cria o gráfico
chart.render();  // Renderiza o gráfico




    // Gráfico de Rosca (Doughnut)
    const categorias = ['cartao de credito','pix','debito','laser','viagem']; // Categorias do gráfico
    const chartElement2 = document.querySelector('#chart2'); // Selecione o elemento do gráfico

    const optionsDoughnut = { // Configuração do gráfico
        chart: {
            type: 'donut', // Tipo do gráfico
            height: 250, // Altura do gráfico
            width: 350  // Largura do gráfico
        },
        series: [5, 5, 5, 5, 5, 5],  // Valores para cada categoria
        labels: categorias,  // Rotulos do gráfico
        legend: {
            position: 'bottom', // Posição da legenda
            labels: {
                colors: 'white'  // Cor das legendas
            }
        },
        plotOptions: {
            pie: {
                donut: {
                    size: '30%'  // Tamanho do gráfico
                }
            }
        }
    };

    const chartDoughnut = new ApexCharts(chartElement2, optionsDoughnut);  // Cria o gráfico
    chartDoughnut.render();  // Renderiza o gráfico