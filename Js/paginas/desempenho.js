document.addEventListener("DOMContentLoaded", () => {
    const selectAnoBarra = document.getElementById("ano");
    const selectDataCategorias = document.getElementById("data-selecionada");
    const contasTable = document.getElementById("tabela-contas");

    // Obtendo o ano atual
    const currentYear = new Date().getFullYear();
    const now = new Date();
    const currentMonth = now.getMonth() + 1; // Janeiro = 0, por isso +1

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
                        height: 330,
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
                    grid: {borderColor: 'rgba(255, 255, 255, 0.1)' },
                    dataLabels: {enabled: false},
                    plotOptions: {
                        bar: {horizontal: false, columnWidth: '65%', endingShape: 'rounded', borderRadius: 3}
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
    selectAnoBarra.addEventListener("change", () => {
        const anoSelecionado = selectAnoBarra.value;
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
            img.src = `../imagens/contas/${conta.nome_conta}.png`; // Caminho para a imagem
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

        function formatarSaldo(valor) {
            return `R$ ${parseFloat(valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
        }
    })
    .catch(error => console.error('Erro ao carregar os dados:', error));

    //===============================================================================================

    // Função para inicializar e renderizar o gráfico
    function renderGrafico(data, categoriasSelecionadas, anoSelecionado) {
        const chartElement = document.querySelector("#chart2");
        chartElement.innerHTML = '';

        const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        const series = [];

        categoriasSelecionadas.forEach(categoria => {
            let valoresCategoria = Array(12).fill(0);

            if (data.dados[anoSelecionado]) {
                for (const mes in data.dados[anoSelecionado]) {
                    if (data.dados[anoSelecionado][mes][categoria]) {
                        const valor = data.dados[anoSelecionado][mes][categoria];
                        valoresCategoria[mes - 1] = valor;
                    }
                }
            }

            series.push({
                name: categoria,
                data: valoresCategoria
            });
        });

        const options = {
            chart: { type: 'line', height: 250 },
            series: series,
            xaxis: { categories: meses, labels: { style: { colors: 'white' } } },
            yaxis: { labels: { style: { colors: 'white' } } },
            grid: { borderColor: 'rgba(255, 255, 255, 0.1)' },
            stroke: { curve: 'smooth' },
            legend: { position: 'bottom', labels: { colors: 'white' } },
            tooltip: { theme: 'dark', y: { formatter: val => `R$ ${val.toFixed(2).replace('.', ',')}` } }
        };

        const chart = new ApexCharts(chartElement, options);
        chart.render();
    }


    // Função para capturar as categorias selecionadas
    function obterCategoriasSelecionadas() {
        const checkboxes = document.querySelectorAll('input[name="categoria"]:checked');
        const categoriasSelecionadas = [];
        
        checkboxes.forEach(checkbox => {
            categoriasSelecionadas.push(checkbox.value);
        });
        
        return categoriasSelecionadas;
    }

    // Função para carregar os dados e renderizar o gráfico
    let dadosDesempenho = null;

    fetch('../Paginas/consultas/desempenho-categorias.php')
    .then(response => response.json())
    .then(data => {
        dadosDesempenho = data;
    
        const container = document.getElementById('checkbox-categorias');
        const selectAno = document.getElementById('select-ano');
    
        const anosUnicos = Object.keys(data.dados).sort(); // ordena os anos
    
        // Preenche o select de anos
        anosUnicos.forEach(ano => {
            const option = document.createElement('option');
            option.value = ano;
            option.textContent = ano;
            selectAno.appendChild(option);
        });

        // Populando o seletor de anos do grafico de barra com os anos do array retornado
        const anos = Object.keys(data.dados).sort().reverse();
        anos.forEach(ano => {
            const option = document.createElement("option");
            option.value = ano;
            option.textContent = ano;
            selectAnoBarra.appendChild(option);
        });
    
        // Define ano atual como padrão, se disponível
        const anoAtual = new Date().getFullYear().toString();
        let anoSelecionado = anosUnicos.includes(anoAtual) ? anoAtual : anosUnicos[0];
        selectAno.value = anoSelecionado;
    
        // Função para renderizar checkboxes com base no ano
        function renderCheckboxesPorAno(ano) {
            container.innerHTML = ''; // limpa os checkboxes existentes
            const categoriasUnicas = new Set();
    
            if (data.dados[ano]) {
                for (const mes in data.dados[ano]) {
                    for (const categoria in data.dados[ano][mes]) {
                        categoriasUnicas.add(categoria);
                    }
                }
            }
    
            categoriasUnicas.forEach(categoria => {
                const checkboxWrapper = document.createElement('label');
                checkboxWrapper.style.display = 'flex';
    
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.name = 'categoria';
                checkbox.value = categoria;
                checkbox.checked = true;
    
                checkboxWrapper.appendChild(checkbox);
                checkboxWrapper.appendChild(document.createTextNode(' ' + categoria));
                container.appendChild(checkboxWrapper);
            });
    
            // Adiciona evento de mudança nas novas checkboxes
            container.addEventListener('change', () => {
                const categoriasSelecionadas = obterCategoriasSelecionadas();
                renderGrafico(data, categoriasSelecionadas, ano);
            });
        }
    
        // Renderiza checkboxes e gráfico inicialmente
        renderCheckboxesPorAno(anoSelecionado);
        const categoriasSelecionadas = obterCategoriasSelecionadas();
        renderGrafico(data, categoriasSelecionadas, anoSelecionado);
    
        // Atualiza gráfico e checkboxes ao mudar ano
        selectAno.addEventListener('change', () => {
            anoSelecionado = selectAno.value;
            renderCheckboxesPorAno(anoSelecionado);
    
            const categoriasSelecionadas = obterCategoriasSelecionadas();
            renderGrafico(data, categoriasSelecionadas, anoSelecionado);
        });
    })
    
    .catch(error => console.error('Erro ao carregar categorias:', error));


        // ===============================================================================

        const lastYear = currentYear - 1;

        // Adiciona os meses do ano atual até o mês atual (em ordem decrescente)
        for (let month = currentMonth; month >= 1; month--) {
            const option = document.createElement("option");
            option.value = `${String(month).padStart(2, '0')}/${currentYear}`;
            option.textContent = `${String(month).padStart(2, '0')}/${currentYear}`;
            selectDataCategorias.appendChild(option);
        }

        // Adiciona os meses do ano passado (de Dezembro a Janeiro)
        for (let month = 12; month >= 1; month--) {
            const option = document.createElement("option");
            option.value = `${String(month).padStart(2, '0')}/${lastYear}`;
            option.textContent = `${String(month).padStart(2, '0')}/${lastYear}`;
            selectDataCategorias.appendChild(option);
        }

        // Evento para quando o usuário selecionar uma data para categorias
        selectDataCategorias.addEventListener("change", () => {
            fetchDadosCategorias(selectDataCategorias.value);
        });

        // Buscar dados do ano atual ao carregar a página
        function fetchDadosCategorias(data) {
            fetch (`../Paginas/consultas/infos-dashboard.php?data=${data}`)
            .then(response => response.json())
            .then(data => {
                const categoriasData = data.categorias;
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
                        labels: {colors: 'white'}
                    },
                    plotOptions: {pie: {donut: {size: '30%'}}}
                };

                const chartDoughnut = new ApexCharts(chartElement2, optionsDoughnut);
                chartDoughnut.render();
            })
            .catch(error => console.error('Erro ao carregar os dados:', error));
        }

        fetchDadosCategorias(`${currentMonth}/${currentYear}`);

        // ===============================================================================

        const seletorMesAno = document.getElementById('data-essencial');
        const barraEssenciais = document.getElementById('barra-essenciais');
        const barraDesnecessarias = document.getElementById('barra-desnecessarias');
        const textoEssenciais = document.getElementById('porcentagem-essenciais');
        const textoDesnecessarias = document.getElementById('porcentagem-desnecessarias');
        
        // Função que atualiza as barras com base na resposta
        function atualizarBarras(dataSelecionada) {
            fetch(`../Paginas/consultas/desempenho-categoria-essencial.php?data=${dataSelecionada}`)
                .then(response => response.json())
                .then(data => {
                    if (data.erro) {
                        alert(data.erro);
                        return;
                    }
        
                    const essenciais = data.essenciais || 0;
                    const desnecessarias = data.desnecessarias || 0;
                    const total = essenciais + desnecessarias;
        
                    const percEssenciais = total > 0 ? (essenciais / total) * 100 : 0;
                    const percDesnecessarias = total > 0 ? (desnecessarias / total) * 100 : 0;
        
                    // Atualiza visualmente
                    barraEssenciais.style.width = `${percEssenciais}%`;
                    barraDesnecessarias.style.width = `${percDesnecessarias}%`;
        
                    textoEssenciais.textContent = `${percEssenciais.toFixed(1)}%`;
                    textoDesnecessarias.textContent = `${percDesnecessarias.toFixed(1)}%`;
                })
                .catch(error => {
                    console.error('Erro ao carregar os dados:', error);
                });
        }
        
        // Popular o seletor
        fetch('../Paginas/consultas/desempenho-categoria-essencial.php')
            .then(response => response.json())
            .then(data => {
                const datas = data.seletor || [];
                seletorMesAno.innerHTML = '';
        
                datas.reverse().forEach(dataItem => {
                    const option = document.createElement('option');
                    option.value = dataItem;
                    option.textContent = dataItem;
                    seletorMesAno.appendChild(option);
                });
        
                if (datas.length > 0) {
                    atualizarBarras(datas[0]);
                }
            });
        
        // Atualiza ao mudar o mês
        seletorMesAno.addEventListener('change', () => {
            const dataSelecionada = seletorMesAno.value;
            atualizarBarras(dataSelecionada);
        });
        

});
