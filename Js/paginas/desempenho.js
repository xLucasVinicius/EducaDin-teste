document.addEventListener("DOMContentLoaded", () => {
    const selectAno = document.getElementById("ano");
    const selectData = document.getElementById("data-selecionada");
    const contasTable = document.getElementById("tabela-contas");

    // Obtendo o ano atual
    const currentYear = new Date().getFullYear();
    const now = new Date();
    const currentMonth = now.getMonth() + 1; // Janeiro = 0, por isso +1

    // Populando o seletor com os últimos 10 anos
    for (let i = currentYear; i > currentYear - 10; i--) {
        const option = document.createElement("option");
        option.value = i;
        option.textContent = i;
        selectAno.appendChild(option);
    }

    // Função para buscar dados do ano selecionado
    function fetchDadosDoAno(ano) {
        document.getElementById("chart1").textContent = "";
        fetch(`../Paginas/consultas/desempenho-geral-anual.php?ano=${ano}`)
            .then(response => response.json())
            .then(data => {
                const meses = [];
                const receitas = [];
                const despesas = [];

                // Acessando os dados de cada mês no ano selecionado
                Object.keys(data).forEach(ano => {
                    // Acessa os meses do ano
                    const mesesAno = data[ano];
                    Object.keys(mesesAno).forEach(mes => {
                        meses.push(mes); // Ex: "Jan/2025"
                        receitas.push(mesesAno[mes].total_receitas);
                        despesas.push(mesesAno[mes].total_despesas);
                    });
                });

                // Calcular o faturamento geral
                const totalReceitas = receitas.reduce((acc, val) => acc + val, 0);
                const totalDespesas = despesas.reduce((acc, val) => acc + val, 0);
                const faturamentoGeral = totalReceitas - totalDespesas;

                // Exibir o faturamento geral
                document.getElementById("faturamento-geral").textContent =
                    `R$ ${faturamentoGeral.toFixed(2).replace('.', ',')}`;

                // Configuração do gráfico
                const options = {
                    chart: {
                        type: 'bar',
                        height: 350,
                        toolbar: {show: false},
                        background: 'transparent'
                    },
                    series: [
                        {name: 'Receitas', data: receitas},
                        {name: 'Despesas', data: despesas}
                    ],
                    colors: ['#00ff00', '#ff0000'],
                    xaxis: {
                        categories: meses,
                        title: {style: {color: 'white'}},
                        labels: {style: {colors: 'white'}},
                        axisBorder: {color: 'white'},
                        axisTicks: {color: 'white'}
                    },
                    yaxis: {
                        title: {style: {color: 'white'}},
                        labels: {formatter: val => `R$ ${val.toFixed(2).replace('.', ',')}`, style: {colors: 'white'}}
                    },
                    grid: {borderColor: 'rgba(255, 255, 255, 0.1)' }, // linhas guias quase transparentes
                    plotOptions: {
                        bar: {horizontal: false, columnWidth: '60%', endingShape: 'rounded', borderRadius: 3}
                    },
                    legend: {position: 'bottom', labels: {colors: 'white'}},
                    tooltip: {theme: 'dark', y: {formatter: val => `R$ ${val.toFixed(2).replace('.', ',')}`}}
                };
                
                // Renderizar o gráfico
                const chart = new ApexCharts(document.querySelector('#chart1'), options);
                chart.render();
            })
            .catch(error => console.error('Erro ao carregar desempenho geral:', error));
    }

    // Evento para quando o usuário selecionar um ano
    selectAno.addEventListener("change", () => {
        const anoSelecionado = selectAno.value;
        fetchDadosDoAno(anoSelecionado);
    });

    // Buscar dados do ano atual ao carregar a página
    fetchDadosDoAno(currentYear);
    //===============================================================================================

    fetch('../Paginas/consultas/infos-contas.php')
    .then(response => response.json())
    .then(data => {
        const contas = data.contas; // Acessa a lista de contas retornada da resposta

        contas.forEach(conta => {
        
        const tipoContaMap = {
            0: 'Corrente',
            1: 'Poupança',
            2: 'Salário',
            3: 'Digital'
        };
        
        const tipoConta = tipoContaMap[conta.categoria];
        const row = document.createElement('tr'); // Cria uma nova linha

        // Coluna da imagem (logo)
        const logoCell = document.createElement('td');
        const img = document.createElement('img');
        img.src = `../imagens/logos/${conta.nome_conta}.png`; // Caminho para a imagem
        img.alt = `Logo da ${conta.nome_conta}`; // Texto alternativo
        img.width = 50; // Largura da imagem
        img.height = 50; // Altura da imagem
        img.style.borderRadius = '50%'; // Borda arredondada
        img.style.objectFit = 'cover'; // Ajusta a imagem para cobrir o conteúdo
        logoCell.appendChild(img); // Adiciona a imagem à celula
        row.appendChild(logoCell); // Adiciona a celula à linha

        // Coluna do nome da conta
        const nomeCell = document.createElement('td');
        nomeCell.textContent = conta.nome_conta;
        row.appendChild(nomeCell);

        // Coluna com o tipo de conta
        const tipoCell = document.createElement('td');
        tipoCell.textContent = tipoConta;
        row.appendChild(tipoCell);

        // Coluna do saldo atual (formatado como moeda)
        const saldoCell = document.createElement('td');
        saldoCell.textContent = formatarSaldo(conta.saldo_atual);
        row.appendChild(saldoCell);


        contasTable.appendChild(row); // Adiciona a linha à tabela
    });

    const lastYear = currentYear - 1;

    // Adiciona os meses do ano atual até o mês atual (em ordem decrescente)
    for (let month = currentMonth; month >= 1; month--) {
        const option = document.createElement("option");
        option.value = `${String(month).padStart(2, '0')}/${currentYear}`;
        option.textContent = `${String(month).padStart(2, '0')}/${currentYear}`;
        selectData.appendChild(option);
    }

    // Adiciona os meses do ano passado (de Dezembro a Janeiro)
    for (let month = 12; month >= 1; month--) {
        const option = document.createElement("option");
        option.value = `${String(month).padStart(2, '0')}/${lastYear}`;
        option.textContent = `${String(month).padStart(2, '0')}/${lastYear}`;
        selectData.appendChild(option);
    }

    // Evento para quando o usuário selecionar uma data para categorias
    selectData.addEventListener("change", () => {
        fetchDadosCategorias(selectData.value);
    });

    // Buscar dados do ano atual ao carregar a página
    function fetchDadosCategorias(data) {
        fetch (`../Paginas/consultas/infos-dashboard.php?data=${data}`)
        .then(response => response.json())
        .then(data => {
            const categoriasData = data.categorias;
            console.log(categoriasData);
            const chartElement2 = document.querySelector('#chart3');
            chartElement2.innerHTML = '';
            const categoriasNomes = categoriasData.map(c => c.nome);
            const categoriasValores = categoriasData.map(c => c.quantidade);

            const optionsDoughnut = {
                chart: {
                    type: 'donut',
                    height: 200,
                    width: 300
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
        .catch(error => console.error('Erro ao carregar os dados:', error));
    }

    fetchDadosCategorias(`${currentMonth}/${currentYear}`);


    








    function formatarSaldo(valor) {
        return `R$ ${parseFloat(valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    }
  })
  .catch(error => console.error('Erro ao carregar os dados:', error));
});
