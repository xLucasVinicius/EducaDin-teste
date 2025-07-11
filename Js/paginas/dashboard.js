const lancamentosContainer = document.querySelector('.table-container');





//===============================================================================================
fetch('../Paginas/consultas/infos-dashboard.php')
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
            height: '85%',
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
                formatter: (value) => `R$ ${value.toFixed(0).replace('.', '')}`,
                show: true,
                style: {
                    colors: 'white',
                    fontSize: '12px'
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
            enabled: true,
            theme: 'dark'
        }
    };

    const chart = new ApexCharts(chartElement, options);
    chart.render();

    // ----- GRÁFICO DE ROSCA -----
    const categorias = data.categorias || [];

const chartElement2 = document.querySelector('#chart2');
chartElement2.innerHTML = ''; // Limpa gráfico anterior, se existir

let categoriasNomes = [];
let categoriasValores = [];
let semDados = false;

if (categorias.length > 0) {
    categoriasNomes = categorias.map(c => c.nome);
    categoriasValores = categorias.map(c => c.quantidade);
} else {
    categoriasNomes = [''];
    categoriasValores = [1]; // Dado fictício para exibir o gráfico
    semDados = true;
}

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
                size: '30%',
                labels: {
                    show: false // Oculta texto no centro
                }
            }
        }
    },
    colors: semDados ? ['#444'] : undefined, // Cor neutra caso não tenha dados
    tooltip: {
        enabled: !semDados
    },
    dataLabels: {
        enabled: !semDados
    }
};

const chartDoughnut = new ApexCharts(chartElement2, optionsDoughnut);
chartDoughnut.render();
})
.catch(error => console.error('Erro ao carregar gráficos:', error));
//===============================================================================================





//===============================================================================================
fetch('../Paginas/consultas/infos-pagina-lancamentos.php')
.then(response => response.json())
.then(data => {
    renderLancamentos(data.lancamentos);
})
.catch(error => console.error('Erro ao carregar lançamentos:', error));
//===============================================================================================

//===============================================================================================
fetch('../Paginas/consultas/desempenho-geral-anterior-atual.php')
.then(response => response.json())
.then(data => {
    const txtEntradas = document.getElementById('txtEntradas');
    const txtSaidas = document.getElementById('txtSaidas');
    const txtSaldo = document.getElementById('txtSaldo');
    const porcentagemEntradas = document.getElementById('porcentagemEntradas');
    const porcentagemSaidas = document.getElementById('porcentagemSaidas');
    const porcentagemSaldo = document.getElementById('porcentagemSaldo');

    let saldoFinal = data.saldo_final_anterior + data.saldo_final_atual;

    // Cálculo das porcentagens
    let valorPorcentagemEntradas = data.total_receitas_anterior !== 0
        ? ((data.total_receitas_atual - data.total_receitas_anterior) / data.total_receitas_anterior) * 100
        : (data.total_receitas_atual > 0 ? 100 : 0);

    let valorPorcentagemSaidas = data.total_despesas_anterior !== 0
        ? ((data.total_despesas_atual - data.total_despesas_anterior) / data.total_despesas_anterior) * 100
        : (data.total_despesas_atual > 0 ? 100 : 0);

    let valorPorcentagemSaldo;
        if (data.saldo_final_anterior !== 0) {
            if (data.saldo_final_atual == 0) {
                valorPorcentagemSaldo = 0;
            } else {
                valorPorcentagemSaldo = ((saldoFinal - data.saldo_final_anterior) / Math.abs(data.saldo_final_anterior)) * 100;
            }
        } else {
            valorPorcentagemSaldo = data.saldo_final_atual > 0 ? 100 : 0;
        }
        

    // Arredondar com duas casas
    valorPorcentagemEntradas = Math.round(valorPorcentagemEntradas);
    valorPorcentagemSaidas = Math.round(valorPorcentagemSaidas);
    valorPorcentagemSaldo = Math.round(valorPorcentagemSaldo);

    // Adiciona o sinal '+' se for positivo
    const sinal = valor => (valor > 0 ? `+${valor}` : `${valor}`);

    // Cores das porcentagens
    const corPorcentagemE = valorPorcentagemEntradas >= 0 ? 'rgb(0, 190, 0)' : 'rgb(255, 0, 0)';
    const corPorcentagemS = valorPorcentagemSaidas >= 0 ? 'rgb(255, 0, 0)' : 'rgb(0, 190, 0)';
    const corPorcentagemT = valorPorcentagemSaldo >= 0 ? 'rgb(0, 190, 0)' : 'rgb(255, 0, 0)';

    // Preenche os valores nos elementos
    txtEntradas.textContent = `R$ ${data.total_receitas_atual.toFixed(2).replace('.', ',')}`;
    txtSaidas.textContent = `R$ ${data.total_despesas_atual.toFixed(2).replace('.', ',')}`;
    txtSaldo.textContent = `R$ ${saldoFinal.toFixed(2).replace('.', ',')}`;

    porcentagemEntradas.innerHTML = `<span style="color: ${corPorcentagemE};">${sinal(valorPorcentagemEntradas)}%</span> ao mês anterior`;
    porcentagemSaidas.innerHTML = `<span style="color: ${corPorcentagemS};">${sinal(valorPorcentagemSaidas)}%</span> ao mês anterior`;
    porcentagemSaldo.innerHTML = `<span style="color: ${corPorcentagemT};">${sinal(valorPorcentagemSaldo)}%</span> ao mês anterior`;
})

.catch(error => console.error('Erro ao carregar desempenho geral:', error));
//===============================================================================================




function renderLancamentos(lancamentos) {
    // Ordena os lançamentos pela data (do mais recente para o mais antigo)
    const lancamentosOrdenados = lancamentos.sort((a, b) => new Date(b.data) - new Date(a.data));

    // Pega os 5 ultimos (os 5 mais recentes)
    const ultimosLancamentos = lancamentosOrdenados.slice(-5).reverse();

    fetch('../Paginas/consultas/infos-cartoes.php')
        .then(response => response.json())
        .then(data => {
            const contasData = data.contas;
            const cartoesData = data.cartoes;

            lancamentosContainer.innerHTML = ''; // Limpa o container

            if (ultimosLancamentos.length === 0) {
                lancamentosContainer.innerHTML = '<z style="color: white;">Nenhum lançamento encontrado.</z>';
                lancamentosContainer.style.width = '100%';
                lancamentosContainer.style.display = 'flex';
                lancamentosContainer.style.justifyContent = 'center';
                lancamentosContainer.style.alignItems = 'center';
                return;
            }

            const table = document.createElement('table');

            const thead = `
            <thead>
                <tr>
                <th>Descrição</th>
                <th>Valor</th>
                <th>Tipo</th>
                <th>Método</th>
                <th>Conta/Cartão</th>
                <th>Categoria</th>
                <th>Subcategoria</th>
                <th>Data</th>
                <th>Parcelas</th>
                </tr>
            </thead>`;

            let tbody = '<tbody>';

            ultimosLancamentos.forEach(lancamento => {
                const tipo = lancamento.tipo === 0 ? 'Receita' : lancamento.tipo === 1 ? 'Despesa' : 'Transferencia';
                const classeValor = tipo === 'Despesa' ? 'despesa' : tipo === 'Receita' ? 'receita' : 'transferencia';
                let contaCartao = '';

                if (lancamento.id_cartao) {
                    const cartao = cartoesData.find(c => c.id_cartao == lancamento.id_cartao);
                    if (cartao) {
                        const conta = contasData.find(ct => ct.id_conta == cartao.id_conta);
                        if (conta) {
                            let categoriaInicial = '';
                            switch (conta.categoria) {
                                case 0: categoriaInicial = 'C'; break;
                                case 1: categoriaInicial = 'P'; break;
                                case 2: categoriaInicial = 'S'; break;
                            }
                            contaCartao = `${conta.nome_conta} (${categoriaInicial}) - Cartão`;
                        }
                    }
                } else {
                    const conta = contasData.find(ct => ct.id_conta == lancamento.id_conta);
                    if (conta) {
                        let categoriaInicial = '';
                        switch (conta.categoria) {
                            case "0": categoriaInicial = 'C'; break;
                            case "1": categoriaInicial = 'P'; break;
                            case "2": categoriaInicial = 'S'; break;
                            case "3": categoriaInicial = 'D'; break;
                        }
                        contaCartao = `${conta.nome_conta} (${categoriaInicial})`;
                    }
                }

                let lancamentoParcela = parseInt(lancamento.parcelas) === 0 ? 'À vista' : lancamento.parcelas;

                tbody += `
                <tr>
                    <td>${lancamento.descricao}</td>
                    <td>R$ ${parseFloat(lancamento.valor).toFixed(2).replace('.', ',')}</td>
                    <td class="${classeValor}">${tipo}</td>
                    <td>${lancamento.metodo_pagamento}</td>
                    <td>${contaCartao}</td>
                    <td>${lancamento.categoria}</td>
                    <td>${lancamento.subcategoria}</td>
                    <td>${
                        (() => {
                            const partes = lancamento.data.split('-'); // ["2025", "07", "09"]
                            const dataLocal = new Date(parseInt(partes[0]), parseInt(partes[1]) - 1, parseInt(partes[2]));
                            return dataLocal.toLocaleDateString('pt-BR');
                        })()
                    }</td>
                    <td>${lancamentoParcela}</td>
                </tr>`;
            });

            tbody += '</tbody>';
            table.innerHTML = thead + tbody;
            lancamentosContainer.appendChild(table);
        })
        .catch(error => console.error('Erro ao carregar cartões:', error));
}
