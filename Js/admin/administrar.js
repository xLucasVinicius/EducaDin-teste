const searchInput = document.getElementById('busca');
const searchSelect = document.getElementById('plano');
let anosJaPopulados = false; // Flag para garantir que só populamos uma vez

function exibirInfos() {
    fetch('../Paginas/administrador/infos-adm.php')
        .then(response => response.json())
        .then(data => {
            document.querySelector('.usuarios .valor-card').textContent = data.estatisticas.total_usuarios;
            document.querySelector('.moedas .valor-card').textContent = data.estatisticas.total_moedas;
            document.querySelector('.premium .valor-card').textContent = data.estatisticas.total_premium;
            document.querySelector('.trocas .valor-card').textContent = data.estatisticas.media_trocas_por_mes;
            document.querySelector('.contas .valor-card').textContent = data.estatisticas.media_contas_cartoes;
        })
        .catch(error => console.error('Erro ao buscar informações:', error));
}

function atualizarGrafico(anoSelecionado) {
    fetch('../Paginas/administrador/infos-adm.php')
        .then(response => response.json())
        .then(data => {
            const usuariosPorMes = data.estatisticas.usuarios_por_mes;
            const anosDisponiveis = new Set();

            for (const key in usuariosPorMes) {
                const [ano] = key.split("-");
                anosDisponiveis.add(ano);
            }

            const selectAno = document.getElementById('ano');

            if (!anosJaPopulados) {
                selectAno.innerHTML = "";
                [...anosDisponiveis].sort().forEach(ano => {
                    const option = document.createElement('option');
                    option.value = ano;
                    option.textContent = ano;
                    selectAno.appendChild(option);
                });
                anosJaPopulados = true;

                // Se nenhum ano estiver selecionado, selecione o mais recente
                if (!anoSelecionado) {
                    anoSelecionado = Math.max(...[...anosDisponiveis].map(Number));
                    selectAno.value = anoSelecionado;
                }
            }

            // Caso ainda não tenha sido definido o ano, usa o valor atual do select
            if (!anoSelecionado) {
                anoSelecionado = selectAno.value;
            }

            // Gera os dados do gráfico
            const meses = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
            const dadosPorMes = meses.map(mes => {
                const chave = `${anoSelecionado}-${mes}`;
                return usuariosPorMes[chave] || 0;
            });

            const options = {
                chart: { type: 'line', height: 350 },
                series: [{
                    name: 'Usuários',
                    data: dadosPorMes,
                    color: '#F2A900'
                }],
                xaxis: {
                    categories: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
                    labels: { style: { colors: 'white' } }
                },
                yaxis: { labels: { style: { colors: 'white' } } },
                grid: { borderColor: 'rgba(255, 255, 255, 0.1)' },
                legend: { position: 'bottom', labels: { colors: 'white' } },
                tooltip: { theme: 'dark' }
            };

            const chartContainer = document.querySelector("#chart");
            chartContainer.innerHTML = ''; // limpa gráfico anterior
            const chart = new ApexCharts(chartContainer, options);
            chart.render();
        })
        .catch(error => console.error('Erro ao carregar dados:', error));
}

function buscarUsuarios(txtBusca) {

    fetch('../Paginas/administrador/infos-adm.php?search=' + txtBusca)
    .then(response => response.json())
    .then(data => {
            const tabelaBody = document.getElementById('tabela-corpo');
            tabelaBody.innerHTML = '';
            const usuarios = data.usuarios;

            usuarios.forEach(usuario => {
                // Transforma o texto da data em objeto Date
                const data = new Date(usuario.data_cadastro);

                // Formata no padrão brasileiro: DD/MM/AAAA
                const dataFormatada = data.toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                });

                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><img src="${usuario.foto_perfil}" alt="Foto do usuário"></td>
                    <td>${usuario.nome} ${usuario.sobrenome}</td>
                    <td>${usuario.email}</td>
                    <td>${usuario.plano == '0' ? 'Gratis' : 'Premium'}</td>
                    <td>${dataFormatada}</td>
                    <td>
                        <button class="btn-editar" data-id="${usuario.id_usuario}"><i class="bi bi-pencil-square"></i></button>
                        <button class="btn-excluir" data-id="${usuario.id_usuario}"><i class="bi bi-trash"></i></button>
                    </td>
                `;
                tabelaBody.appendChild(tr);
            });
    })
    .catch(error => console.error('Erro ao carregar dados:', error));
}

searchInput.addEventListener('input', () => {
    buscarUsuarios(searchInput.value);
});

searchSelect.addEventListener('change', () => {
    buscarUsuarios(searchSelect.value);
});

window.addEventListener('DOMContentLoaded', () => {
    exibirInfos();
    atualizarGrafico();
    buscarUsuarios(searchInput.value);
});

document.getElementById('ano').addEventListener('change', () => {
    const anoSelecionado = document.getElementById('ano').value;
    atualizarGrafico(anoSelecionado);
});