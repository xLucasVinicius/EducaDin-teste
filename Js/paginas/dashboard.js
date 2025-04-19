fetch('../Paginas/consultas/infos-lancamentos-total.php')
.then(response => response.json())
.then(data => {
    // ----- GRÁFICO DE BARRAS -----
    const labels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const mesAtual = new Date().getMonth(); // índice do mês atual (0-11)

    const values = data.valoresMensais || Array(12).fill(0); // garante que tenha 12 valores
    const barColors = labels.map((_, index) => index === mesAtual ? '#F2A900' : 'rgb(255, 255, 255)');

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
                distributed: true
            }
        },
        dataLabels: {
            enabled: false
        },
        colors: barColors,
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
                show: true,
                style: {
                    colors: 'white'
                }
            }
        },
        grid: {
            show: true,
            borderColor: 'rgba(255, 255, 255, 0.1)',
            strokeDashArray: 2
        },
        legend: {
            show: false
        },
        tooltip: {
            enabled: true
        }
    };

    const chart = new ApexCharts(chartElement, options);
    chart.render();

    // ----- GRÁFICO DE ROSCA -----
    const categorias = data.categorias || [];

    const chartElement2 = document.querySelector('#chart2');
    const categoriasNomes = categorias.map(c => c.nome);
    const categoriasValores = categorias.map(c => c.quantidade);

    const optionsDoughnut = {
        chart: {
            type: 'donut',
            height: 250,
            width: 350
        },
        series: categoriasValores,
        labels: categoriasNomes,
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
})
.catch(error => console.error('Erro ao carregar gráficos:', error));


fetch('../Paginas/consultas/infos-lancamentos-pagina.php')
.then(response => response.json())
.then(data => {
    console.log(data);
})
.catch(error => console.error('Erro ao carregar gráficos:', error));