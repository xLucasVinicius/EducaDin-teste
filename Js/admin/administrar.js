window.addEventListener('DOMContentLoaded', () => {
    exibirInfos();
    atualizarGrafico();
    buscarUsuarios(searchInput.value);
    carregarPremios();
});

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
                let buttom = '';
                if (usuario.status_atividade == '1') {
                            buttom = `<button class="btn-banir" onclick="banirUsuario(${usuario.id_usuario})" title="Banir"><i class="bi bi-ban"></i></button>`;
                } else if (usuario.status_atividade == '0') {
                    buttom = `<button class="btn-desbanir" onclick="desbanirUsuario(${usuario.id_usuario})" title="Desbanir"><i class="bi bi-arrow-clockwise"></i></button>`
                } 

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
                    <td style="color: ${usuario.status_atividade == '1' ? 'green' : 'red'};">${usuario.status_atividade == '1' ? 'Ativo' : 'Banido'}</td>
                    <td>${buttom}</td>
                `;
                tabelaBody.appendChild(tr);
            });
    })
    .catch(error => console.error('Erro ao carregar dados:', error));
}

function banirUsuario(id) {
    document.querySelector('.conteudo').style.overflowY = 'clip';
    window.scrollTo(0, 0);
    const modalConfirmarBanir = document.getElementById("modalConfirmarBanir");

    const nomeUsuario = document.querySelector(`#tabela-corpo tr:nth-child(${id}) td:nth-child(2)`).textContent;
    modalConfirmarBanir.querySelector("p").innerHTML = `Deseja realmente banir o usuário <br> <span>${nomeUsuario}</span> ? <br> Tenha certeza dessa decisão.`;
    modalConfirmarBanir.style.display = "flex";

    const botaoConfirmarBanir = document.getElementById("btnModalBanir");

    const novoBotao = botaoConfirmarBanir.cloneNode(true);
    botaoConfirmarBanir.parentNode.replaceChild(novoBotao, botaoConfirmarBanir);

    novoBotao.addEventListener("click", () => {
        fetch(`../Paginas/administrador/banir-usuario.php?id_usuario=${id}&acao=banir`, {
            method: "GET"
        })
        .then(response => response.json())
        .then(data => {
            modalConfirmarBanir.style.display = "none";

            if (data.status === "success") {
                const modalSucesso = document.getElementById("modalSucessoBanirUsuario");
                modalSucesso.style.display = "flex";
            } else {
                const modalErro = document.getElementById("modalErroBanirUsuario");
                modalErro.style.display = "flex";
            }
        })
        .catch(error => {
            console.error('Erro ao banir o usuário:', error);
            modalConfirmarBanir.style.display = "none";
            const modalErro = document.getElementById("modalErroBanirUsuario");
            modalErro.style.display = "flex";
        });
    });
}

function desbanirUsuario(id) {
    document.querySelector('.conteudo').style.overflowY = 'clip';
    window.scrollTo(0, 0);
    const modalConfirmarDesbanir = document.getElementById("modalConfirmarDesbanir");

    const nomeUsuario = document.querySelector(`#tabela-corpo tr:nth-child(${id}) td:nth-child(2)`).textContent;
    modalConfirmarDesbanir.querySelector("p").innerHTML = `Deseja realmente desbanir o usuário <br> <span>${nomeUsuario}</span> ? <br> Tenha certeza dessa decisão.`;
    modalConfirmarDesbanir.style.display = "flex";

    const botaoConfirmarDesbanir = document.getElementById("btnModalDesbanir");

    const novoBotao = botaoConfirmarDesbanir.cloneNode(true);
    botaoConfirmarDesbanir.parentNode.replaceChild(novoBotao, botaoConfirmarDesbanir);

    novoBotao.addEventListener("click", () => {
        fetch(`../Paginas/administrador/banir-usuario.php?id_usuario=${id}&acao=desbanir`, {
            method: "GET"
        })
        .then(response => response.json())
        .then(data => {
            modalConfirmarDesbanir.style.display = "none";

            if (data.status === "success") {
                const modalSucesso = document.getElementById("modalSucessoDesbanirUsuario");
                modalSucesso.style.display = "flex";
            } else {
                const modalErro = document.getElementById("modalErroDesbanirUsuario");
                modalErro.style.display = "flex";
            }
        })
        .catch(error => {
            console.error('Erro ao desbanir o usuário:', error);
            modalConfirmarDesbanir.style.display = "none";
            const modalErro = document.getElementById("modalErroDesbanirUsuario");
            modalErro.style.display = "flex";
        });
    });
}

function carregarPremios() {
    fetch('../Paginas/administrador/buscar-premios.php')
        .then(response => response.json())
        .then(data => {
            const premios = data.premios;
            console.log(premios);

            const premiosContainer = document.querySelector('.premios-conteiner');

            premios.forEach(premio => {
                const premioElement = `
                    <div class="premio">
                            <div class="imagem-premio">
                                <img src="${premio.imagem_premio}" alt="${premio.nome_premio}">
                            </div>
                            <div class="infos-premio">
                                <span class="nome-premio">${premio.nome_premio}</span>
                                <span class="descricao-premio">${premio.descricao_premio}</span>
                                <span class="preco-premio"><i class="bi bi-coin">${premio.valor_moedas}</i> </span>
                                <span class="limite-premio">Limite de trocas: ${premio.limite_trocas}</span>
                            </div>
                            <div class="acoes-premio">
                                <button onclick="confirmarEditarPremio(${premio.id_premio})" id="editar-premio"><i class="bi bi-pencil-square"></i></button>
                                <button onclick="confirmarExcluirPremio(${premio.id_premio})" id="excluir-premio"><i class="bi bi-trash"></i></button>
                            </div>
                        </div>
                `;
                premiosContainer.innerHTML += premioElement;
            });
        })
        .catch(error => console.error('Erro ao carregar premiços:', error));
}

function exibirSucessoAdd() {
    document.querySelector('.conteudo').style.overflowY = 'clip';
    const modalSucesso = document.getElementById("modalSucessoAddPremio");
    modalSucesso.style.display = "flex";
}

function exibirErroAdd() {
    document.querySelector('.conteudo').style.overflowY = 'clip';
    const modalErro = document.getElementById("modalErroAddPremio");
    modalErro.style.display = "flex";
}

function confirmarExcluirPremio(id) {
    document.querySelector('.conteudo').style.overflowY = 'clip';
    const modalConfirmarExcluirPremio = document.getElementById("modalConfirmarExcluirPremio");
    modalConfirmarExcluirPremio.style.display = "flex";
    const botaoConfirmarExcluirPremio = document.getElementById("btnExcluirPremio");
    const novoBotao = botaoConfirmarExcluirPremio.cloneNode(true);
    botaoConfirmarExcluirPremio.parentNode.replaceChild(novoBotao, botaoConfirmarExcluirPremio);
    novoBotao.addEventListener("click", () => {
        excluirPremio(id);
        modalConfirmarExcluirPremio.style.display = "none";
    });
}

function excluirPremio(id) {
    fetch(`../Paginas/administrador/excluir-premio.php?id_premio=${id}`, {
        method: "GET"
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            document.querySelector('.conteudo').style.overflowY = 'clip';
            document.getElementById("modalSucessoExcluirPremio").style.display = "flex";
        } else {
            const modalErro = document.getElementById("modalErroExcluirPremio");
            modalErro.style.display = "flex";
        }
    })
    .catch(error => {
        console.error('Erro ao excluir o premio:', error);
        const modalErro = document.getElementById("modalErroExcluirPremio");
        modalErro.style.display = "flex";
    });
}
            

searchInput.addEventListener('input', () => {
    buscarUsuarios(searchInput.value);
});

searchSelect.addEventListener('change', () => {
    buscarUsuarios(searchSelect.value);
});

document.getElementById('ano').addEventListener('change', () => {
    const anoSelecionado = document.getElementById('ano').value;
    atualizarGrafico(anoSelecionado);
});

document.getElementById('btnModalNaoBanir').addEventListener('click', () => {
    const modalConfirmarBanir = document.getElementById("modalConfirmarBanir");
    modalConfirmarBanir.style.display = "none";
    document.querySelector('.conteudo').style.overflowY = 'scroll';
});

document.getElementById('btnModalBanirSucesso').addEventListener('click', () => {
    location.reload();
});

document.getElementById('btnModalBanirErro').addEventListener('click', () => {
    location.reload();
});

document.getElementById('btnModalNaoDesbanir').addEventListener('click', () => {
    const modalConfirmarDesbanir = document.getElementById("modalConfirmarDesbanir");
    modalConfirmarDesbanir.style.display = "none";
    document.querySelector('.conteudo').style.overflowY = 'scroll';
});

document.getElementById('btnModalDesbanirSucesso').addEventListener('click', () => {
    location.reload();
});

document.getElementById('btnModalDesbanirErro').addEventListener('click', () => {
    location.reload();
});

document.getElementById('foto-premio').addEventListener('change', function(event) {
    const arquivo = event.target.files[0];

    if (arquivo) {
        const leitor = new FileReader();

        leitor.onload = function(e) {
            const imgPreview = document.querySelector('.imagem-premio');
            const img = document.createElement('img');
            imgPreview.appendChild(img);
            img.id = 'preview-imagem';
            img.src = e.target.result;
            img.style.display = 'block';
            img.style.width = '100%';
            img.style.height = 'auto';
            img.style.borderRadius = '50%';
            img.style.objectFit = 'cover';
        };

        leitor.readAsDataURL(arquivo); // converte para base64
    }
});

document.getElementById('form-adicionar-premio').addEventListener('submit', function(event) {
    event.preventDefault();

    const formData = new FormData(this);
    fetch('../Paginas/administrador/adicionar-premio.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            exibirSucessoAdd();
        } else {
            exibirErroAdd();
        }
    })
    .catch(error => console.error('Erro ao adicionar o premio:', error));
});

document.getElementById('btnModalPremioAdd').addEventListener('click', () => {
    location.reload();
});

document.getElementById('btnModalErroPremioAdd').addEventListener('click', () => {
    location.reload();
});

document.getElementById('btnNaoExcluirPremio').addEventListener('click', () => {
    location.reload();
});

document.getElementById('btnModalSucessoExcluirPremio').addEventListener('click', () => {
    location.reload();
});

document.getElementById('btnModalErroExcluirPremio').addEventListener('click', () => {
    location.reload();
});

