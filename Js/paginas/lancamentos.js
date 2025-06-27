const containerParcelas = document.getElementById('parcelas-container'); //Seleciona o container de parcelas
const containerParcelasEditar = document.getElementById('parcelas-container-editar'); //Seleciona o container de parcelas
const formLancamento = document.getElementById('form-add-lancamento'); // Seleciona o formulário de lançamentos
const formLancamentoEditar = document.getElementById('form-edit-lancamento'); // Seleciona o formulário de lançamentos
const formEditar = document.getElementById('form-edit-container'); // Seleciona o container do formulário de edição

// Categorias/Subcategorias
const subcategorias = {
    Moradia: ["Aluguel", "Prestação do imóvel", "Condomínio", "Água", "Luz", "Internet/TV"],
    Alimentação: ["Supermercado", "Refeições fora de casa", "Delivery"],
    Transporte: ["Aplicativos de transporte", "Combustível", "Transporte público", "Manutenção de veículo", "Pedágios/estacionamento"],
    Educação: ["Mensalidade escolar/faculdade", "Cursos e workshops", "Material escolar"],
    Saúde: ["Plano de saúde", "Medicamentos", "Consultas médicas", "Tratamentos odontológicos"],
    Lazer: ["Cinema", "Shows", "Viagens", "Assinaturas de streaming"],
    Vestuário: ["Roupas", "Acessórios", "Calçados"],
    Impostos: ["IPVA", "Imposto de Renda", "Multas", "Anuidade"],
    Serviços: ["Celular", "Assinaturas de software", "Apps"],
    Despesas_Gerais: ["Presentes", "Doações", "Outros"],
    Salário: ["Salário fixo", "13º salário", "Bônus/PLR"],
    Freelance: ["Serviços eventuais", "Consultorias"],
    Investimentos: ["Juros de poupança", "Renda de ações", "Aluguéis recebidos"],
    Vendas: ["Venda de bens", "Venda de produtos"],
    Outros: ["Reembolsos", "Prêmios", "Doações recebidas"]
};

const selectSubcategoriaEditar = document.getElementById("subcategoria-editar");
const selectCategoriaEditar = document.getElementById("categoria-editar");
const containerSubcategoriasEditar = document.getElementById("subcategoria-container-editar");

window.addEventListener('DOMContentLoaded', function () {
    const btnAbrirForm = document.querySelector('.abrir-form-icon');
    const btnFecharForm = document.querySelector('.fechar-form-icon');
    const containerForm = document.querySelector('.form-container');

    fetch('../Paginas/consultas/infos-cartoes.php')
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao carregar dados: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        if (!Array.isArray(data.contas) || !Array.isArray(data.cartoes)) {
            throw new Error('Dados inválidos ou não encontrados.');
        }
    
        const metodoSelect = document.getElementById("metodo");
        const meioPagamento = document.getElementById("meio-pagamento");
    
        const categoriaMap = {
            "0": "C", // Corrente
            "1": "P", // Poupança
            "2": "S",  // Salário
            "3": "D"  // Digital
        };
    
        const contasMap = new Map();
    
        data.contas.forEach(conta => {
            const sigla = categoriaMap[conta.categoria] || "?";
            const nomeComCategoria = `${conta.nome_conta} ${sigla}`;
            contasMap.set(conta.id_conta, nomeComCategoria);
        });
    
        metodoSelect.addEventListener("change", () => {
            const metodoSelecionado = metodoSelect.value;
            meioPagamento.innerHTML = ""; // Limpa o campo extra
    
            if (metodoSelecionado === "Crédito" || metodoSelecionado === "Débito") {
                const label = document.createElement("label");
                label.textContent = "Selecione o cartão";
    
                const select = document.createElement("select");
                select.name = "cartao";
                select.id = "cartao";
    
                const defaultOption = document.createElement("option");
                defaultOption.value = "";
                defaultOption.textContent = "Selecione o cartão";
                select.appendChild(defaultOption);
    
                data.cartoes.forEach(cartao => {
                    const nomeConta = contasMap.get(cartao.id_conta) || "Conta desconhecida";
    
                    const option = document.createElement("option");
                    option.value = cartao.id_cartao;
                    option.textContent = `${nomeConta} - ${cartao.nome_cartao || "Cartão"}`;
                    select.appendChild(option);
                });
    
                meioPagamento.appendChild(label);
                meioPagamento.appendChild(select);
    
            } else if (metodoSelecionado === "Transferência" || metodoSelecionado === "Boleto" || metodoSelecionado === "Pix") {
                const label = document.createElement("label");
                label.textContent = "Selecione a conta";
    
                const select = document.createElement("select");
                select.name = "conta";
                select.id = "conta";
    
                const defaultOption = document.createElement("option");
                defaultOption.value = "";
                defaultOption.textContent = "Selecione a conta";
                select.appendChild(defaultOption);
    
                data.contas.forEach(conta => {
                    // Se o nome da conta for "carteira", não adiciona
                    if (conta.nome_conta.toLowerCase() == "carteira") {
                        return; // pula para o próximo item do forEach
                    }
                    const sigla = categoriaMap[conta.categoria] || "?";
                    const nomeComCategoria = `${conta.nome_conta} ${sigla}`;
    
                    const option = document.createElement("option");
                    option.value = conta.id_conta;
                    option.textContent = nomeComCategoria;
                    select.appendChild(option);
                });
    
                meioPagamento.appendChild(label);
                meioPagamento.appendChild(select);
            }
        });
    })  
    .catch(error => {
        console.error('Erro ao carregar os dados:', error);
    });

    

    // Carrossel de meses
    const mesesContainer = document.querySelector(".meses");
    const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    let mesAtual = new Date().getMonth();
    let anoAtual = new Date().getFullYear();
    let animando = false;

    // Botões e elementos
    const btnPrev = document.createElement("button");
    btnPrev.className = "prev buttom";
    btnPrev.innerHTML = `<i class="bi bi-chevron-left"></i>`;

    const mesWrapper = document.createElement("div");
    mesWrapper.className = "mes-wrapper";
    mesWrapper.innerHTML = `<p class="mes-atual">${meses[mesAtual]} ${anoAtual}</p>`;

    const btnNext = document.createElement("button");
    btnNext.className = "next buttom";
    btnNext.innerHTML = `<i class="bi bi-chevron-right"></i>`;

    mesesContainer.innerHTML = "";
    mesesContainer.appendChild(btnPrev);
    mesesContainer.appendChild(mesWrapper);
    mesesContainer.appendChild(btnNext);

    // Função de troca de mês
    function trocarMes(direcao) {
        if (animando) return;
        animando = true;

        const mesAnterior = document.querySelector(".mes-atual");
        const novoMes = document.createElement("p");
        novoMes.className = "mes-atual";

        mesAtual += direcao;

        if (mesAtual < 0) {
            mesAtual = 11;
            anoAtual--;
        } else if (mesAtual > 11) {
            mesAtual = 0;
            anoAtual++;
        }

        novoMes.textContent = `${meses[mesAtual]} ${anoAtual}`;
        novoMes.style.position = "absolute";
        novoMes.style.opacity = 0;
        novoMes.style.transition = "all 0.3s ease";
        mesWrapper.appendChild(novoMes);

        if (direcao === 1) {
            novoMes.style.transform = "translateX(100%)";
            requestAnimationFrame(() => {
                novoMes.style.transform = "translateX(0)";
                novoMes.style.opacity = 1;
                mesAnterior.style.transform = "translateX(-100%)";
                mesAnterior.style.opacity = 0;
            });
        } else {
            novoMes.style.transform = "translateX(-100%)";
            requestAnimationFrame(() => {
                novoMes.style.transform = "translateX(0)";
                novoMes.style.opacity = 1;
                mesAnterior.style.transform = "translateX(100%)";
                mesAnterior.style.opacity = 0;
            });
        }

        setTimeout(() => {
            mesWrapper.removeChild(mesAnterior);
            novoMes.style.position = "static";
            animando = false;
            renderLancamentos(); // Atualiza os lançamentos após trocar o mês
        }, 300);
    }

    // Listeners dos botões
    btnPrev.addEventListener("click", () => trocarMes(-1));
    btnNext.addEventListener("click", () => trocarMes(1));

    // Função para buscar lançamentos via fetch
    function renderLancamentos() {
        const lancamentosContainer = document.querySelector('.lancamentos');
        lancamentosContainer.innerHTML = '';

        const mesCorrigido = (mesAtual + 1).toString().padStart(2, '0'); // "01" a "12"
        const mesAno = `${anoAtual}-${mesCorrigido}`; // "2025-01", por exemplo

        fetch('../Paginas/consultas/infos-pagina-lancamentos.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `mes=${mesAno}`
        })
        .then(response => response.json())
        .then(data => {
            fetch('../Paginas/consultas/infos-cartoes.php')
            .then(response => response.json())
            .then(dataContasCartoes => {
                const contasData = dataContasCartoes.contas;
                const cartoesData = dataContasCartoes.cartoes;
        
                atualizarTotais(data.total_receitas, data.total_despesas);
                
                if (data.lancamentos.length === 0 && data.status == "limite_gratis") {
                    lancamentosContainer.innerHTML = `
                        <z style="color: white; width: 100%; text-align: center; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">
                            Obtenha o Plano Premium para ter acesso sem limite de meses.
                        </z>`;
                    return;
                } else if (data.lancamentos.length === 0) {
                    lancamentosContainer.innerHTML = `
                        <z style="color: white; width: 100%; text-align: center; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">
                            Nenhum lançamento encontrado.
                        </z>`;
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
                            <th>Opções</th>
                        </tr>
                    </thead>`;
        
                let tbody = '<tbody>';
                data.lancamentos.forEach(lancamento => {
                    const tipo = lancamento.tipo === 0 ? 'Receita' : 'Despesa';
                    const classeValor = tipo === 'Despesa' ? 'despesa' : 'receita';
                    let lancamentoParcela = parseInt(lancamento.parcelas) === 0 ? 'A vista' : lancamento.parcelas;
        
                    let instituicao = '';
        
                    if (lancamento.id_cartao) {
                        // Quando o lançamento tem id_cartao, buscamos a conta associada ao cartão
                        const cartao = cartoesData.find(c => c.id_cartao == lancamento.id_cartao);
                        if (cartao) {
                            const conta = contasData.find(conta => conta.id_conta == cartao.id_conta);
                            if (conta) {
                                instituicao = `Cartão ${conta.nome_conta}`;
                                // Verifica a categoria e adiciona a inicial correspondente
                                const categoriaConta = conta.categoria; // 0=conta corrente, 1=conta poupança, 2=conta salário
                                const inicialCategoria = categoriaConta == 0 ? 'Corrente' : categoriaConta == 1 ? 'Poupança' : categoriaConta == 2 ? 'Salário' : '';
                                instituicao += ` (${inicialCategoria})`;
                            } else {
                                instituicao = 'Conta desconhecida';
                            }
                        } else {
                            instituicao = 'Cartão desconhecido';
                        }
                    } else {
                        // Quando não tem id_cartao, buscamos diretamente na lista de contas
                        const conta = contasData.find(c => c.id_conta == lancamento.id_conta);
                        if (conta) {
                            instituicao = conta.nome_conta;
                            // Verifica a categoria e adiciona a inicial correspondente
                            const categoriaConta = conta.categoria; // 0=conta corrente, 1=conta poupança, 2=conta salário
                            const inicialCategoria = categoriaConta == 0 ? 'Corrente' : categoriaConta == 1 ? 'Poupança' : categoriaConta == 2 ? 'Salário' : categoriaConta == 3 ? 'Digital' : '';
                            instituicao +=` (${inicialCategoria})`;
                        } else {
                            instituicao = 'Conta desconhecida';
                        }
                    }
        
                    tbody += `
                        <tr>
                            <td>${lancamento.descricao}</td>
                            <td>R$ ${parseFloat(lancamento.valor).toFixed(2).replace('.', ',')}</td>
                            <td class="${classeValor}">${tipo}</td>
                            <td>${lancamento.metodo_pagamento}</td>
                            <td>${instituicao}</td>
                            <td>${lancamento.categoria}</td>
                            <td>${lancamento.subcategoria}</td>
                            <td>${new Date(lancamento.data).toLocaleDateString('pt-BR')}</td>
                            <td>${lancamentoParcela}</td>
                            <td>
                                <button id="editar" onclick="editarLancamento(${lancamento.id_lancamento})"><i class="fas fa-edit"></i></button>
                                <button id="excluir" onclick="excluirLancamento(${lancamento.id_lancamento})"><i class="fas fa-trash"></i></button>
                            </td>
                        </tr>`;
                });
        
                tbody += '</tbody>';
                table.innerHTML = thead + tbody;
                lancamentosContainer.appendChild(table);
        
                function atualizarTotais(receitas, despesas) {
                    const totalReceitasContainer = document.querySelector('.receita p');
                    const totalDespesasContainer = document.querySelector('.despesa p');
        
                    if (totalReceitasContainer && totalDespesasContainer) {
                        totalReceitasContainer.innerHTML = `R$ ${parseFloat(receitas).toFixed(2).replace('.', ',')}`;
                        totalDespesasContainer.innerHTML = `R$ ${parseFloat(despesas).toFixed(2).replace('.', ',')}`;
                    } else {
                        console.warn("Elementos de receita/despesa não encontrados no DOM.");
                    }
                }
            })
            .catch(error => {
                console.error('Erro ao carregar os dados:', error);
            });
        })
        .catch(error => {
            console.error('Erro ao carregar os dados:', error);
            lancamentosContainer.innerHTML = `<z style="color: white; width: 100%; text-align: center; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">Erro ao carregar lançamentos.</z>`;
        });
    }

    // Carrega lançamentos ao abrir a página
    renderLancamentos();

    btnAbrirForm.addEventListener('click', () => containerForm.style.display = 'flex');
    btnFecharForm.addEventListener('click', () => containerForm.style.display = 'none');

    const selectCategoria = document.getElementById("categoria");
    const selectSubcategoria = document.getElementById("subcategoria");
    const containerSubcategorias = document.getElementById("subcategoria-container");
    
    // Preenche categorias ao carregar
    for (const categoria in subcategorias) {
        const option = document.createElement("option");
        option.value = categoria;
        option.textContent = categoria.charAt(0).toUpperCase() + categoria.slice(1);
        selectCategoria.appendChild(option);
    }

    // Preenche categorias ao carregar form de editar
    for (const categoria in subcategorias) {
        const option = document.createElement("option");
        option.value = categoria;
        option.textContent = categoria.charAt(0).toUpperCase() + categoria.slice(1);
        selectCategoriaEditar.appendChild(option);
    }

    // Atualiza subcategorias ao selecionar categoria
    selectCategoria.addEventListener("change", mostrarSubcategorias);

    // Atualiza subcategorias ao selecionar categoria no form de editar
    selectCategoriaEditar.addEventListener("change", mostrarSubcategoriasEditar);

    function mostrarSubcategorias() {
        const categoriaSelecionada = selectCategoria.value;
        selectSubcategoria.innerHTML = `<option value="">Selecione a subcategoria</option>`;

        if (categoriaSelecionada === "") {
            containerSubcategorias.style.display = "none";
            return;
        }

        subcategorias[categoriaSelecionada].forEach(subcat => {
            const option = document.createElement("option");
            option.value = subcat.toLowerCase();
            option.textContent = subcat;
            selectSubcategoria.appendChild(option);
        });

        containerSubcategorias.style.display = "flex";
    }
    
});

mostrarParcelasEditar();

function mostrarSubcategoriasEditar() {
    const categoriaSelecionada = selectCategoriaEditar.value;
    selectSubcategoriaEditar.innerHTML = `<option value="">Selecione a subcategoria</option>`;

    if (categoriaSelecionada === "") {
        containerSubcategoriasEditar.style.display = "none";
        return;
    }

    subcategorias[categoriaSelecionada].forEach(subcat => {
        const option = document.createElement("option");
        option.value = subcat.toLowerCase();
        option.textContent = subcat;
        selectSubcategoriaEditar.appendChild(option);
    });

    containerSubcategoriasEditar.style.display = "flex";
}

function ocultarParcelas() {
    containerParcelas.style.display = "none";
}

function ocultarParcelasEditar() {
    containerParcelasEditar.style.display = "none";
}

function mostrarParcelas() {
    containerParcelas.style.display = "flex";
}

function mostrarParcelasEditar() {
    const inputDespesa = document.getElementById("despesa-editar");
    if (inputDespesa.checked) {
        containerParcelasEditar.style.display = "flex";
    }
}

function formatarMoeda(input) {
    // Remove todos os caracteres que não são dígitos
    let valor = input.value.replace(/\D/g, '');
  
    // Adiciona os centavos
    valor = (valor / 100).toFixed(2) + '';
  
    // Substitui o ponto por uma vírgula (para casas decimais)
    valor = valor.replace(".", ",");
  
    // Adiciona um ponto a cada três números antes da vírgula
    valor = valor.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  
    // Adiciona o símbolo R$
    input.value = 'R$ ' + valor;
}

formLancamento.addEventListener("submit", (event) => {
event.preventDefault();

const inputDescricao = document.getElementById("descricao");
const inputValor = document.getElementById("valor");
const inputRadioReceita = document.getElementById("receita");
const inputRadioDespesa = document.getElementById("despesa");
const inputMetodo = document.getElementById("metodo");
const inputConta = document.getElementById("conta");
const inputCartao = document.getElementById("cartao");
const inputCategoria = document.getElementById("categoria");
const inputSubcategoria = document.getElementById("subcategoria");
const inputData = document.getElementById("data");
const inputParcelas = document.getElementById("parcelas");
const modalErroPreencher = document.getElementById("modalErroCampos");

if (!inputDescricao.value || !inputValor.value || !inputCategoria.value || !inputSubcategoria.value || !inputData.value) {
    modalErroPreencher.style.display = "flex";
    return;
}

if (inputRadioDespesa.checked) {
    if (!inputParcelas.value) {
        modalErroPreencher.style.display = "flex";
        return;
    }
}

if (!inputRadioReceita.checked && !inputRadioDespesa.checked) {
    modalErroPreencher.style.display = "flex";
    return;
}

if (inputMetodo.value === "Débito" || inputMetodo.value === "Crédito") {
    if (!inputCartao.value) {
        modalErroPreencher.style.display = "flex";
        return;
    }
}

if (inputMetodo.value === "Transferência" || inputMetodo.value === "Boleto" || inputMetodo.value === "Pix") {
    if (!inputConta.value) {
        modalErroPreencher.style.display = "flex";
        return;
    }
}

if (!inputMetodo.value) {
    modalErroPreencher.style.display = "flex";
    return;
}




const formData = new FormData(formLancamento);
fetch("../Paginas/configs/add-lancamento.php", {
    method: "POST",
    body: formData
})
.then(response => response.json())
.then(data => {
    if (data.status === "success") {
        exibirSucessoAdd(data);
    } else {
        exibirErroAdd(data);
    }
})
.catch(error => console.error("Erro:", error));

});

function exibirSucessoAdd(data) {
    const modalSucesso = document.getElementById("modalAddLancamento");
    modalSucesso.style.display = "flex";
}

function exibirErroAdd(data) {
    const modalErro = document.getElementById("modalErroLancamento");
    modalErro.style.display = "flex";
}

function formatarSaldo(valor) {
    return `R$ ${parseFloat(valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
}

function editarLancamento(id) {
    const inputIdLancamento = document.getElementById(`id-lancamento-editar`);
    inputIdLancamento.value = id;

    // Form editar
    fetch('../Paginas/consultas/infos-cartoes.php')
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao carregar dados (editar): ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {

        formEditar.style.display = "flex";
        fetch(`../paginas/consultas/infos-lancamento-unico.php?id_lancamento=${id}`)
        .then(response => response.json())
        .then(data => {
            const inputDescricao = document.getElementById("descricao-editar");
            const inputValor = document.getElementById("valor-editar");
            const inputReceita = document.getElementById("receita-editar");
            const inputDespesa = document.getElementById("despesa-editar");
            const selectMetodo = document.getElementById("metodo-editar");
            const inputCategoria = document.getElementById("categoria-editar");
            const inputSubcategoria = document.getElementById("subcategoria-editar");
            const inputData = document.getElementById("data-editar");
            const inputParcelas = document.getElementById("parcelas-editar");

            inputDescricao.value = data.descricao;
            inputValor.value = formatarSaldo(data.valor);

            if (data.tipo == 1) {
                inputDespesa.checked = true;
                mostrarParcelasEditar();
            } else {
                inputReceita.checked = true;
            }

            selectMetodo.value = data.metodo_pagamento;

        
            inputCategoria.value = data.categoria;
            mostrarSubcategoriasEditar();
            inputSubcategoria.value = data.subcategoria;

            setTimeout(() => {
                atualizarMeioPagamentoEditar();
                if (data.id_cartao != null) {
                    const selectMeioPagamento = document.getElementById("cartao-editar");
                    selectMeioPagamento.value = data.id_cartao;
                } else {
                    const selectMeioPagamento = document.getElementById("conta-editar");
                    selectMeioPagamento.value = data.id_conta;
                }
            }, 100);

            inputData.value = data.data;
            inputParcelas.value = data.parcelas;
        })
        .catch(error => console.error("Erro:", error));


        if (!Array.isArray(data.contas) || !Array.isArray(data.cartoes)) {
            throw new Error('Dados inválidos ou não encontrados (editar).');
        }

        const metodoSelectEditar = document.getElementById("metodo-editar");
        const meioPagamentoEditar = document.getElementById("meio-pagamento-editar");

        const categoriaMapEditar = {
            "0": "C", // Corrente
            "1": "P", // Poupança
            "2": "S"  // Salário
        };

        const contasMapEditar = new Map();

        data.contas.forEach(conta => {
            const sigla = categoriaMapEditar[conta.categoria] || "?";
            const nomeComCategoria = `${conta.nome_conta} ${sigla}`;
            contasMapEditar.set(conta.id_conta, nomeComCategoria);
        });

        function atualizarMeioPagamentoEditar() {
            const metodoSelecionado = metodoSelectEditar.value;
            meioPagamentoEditar.innerHTML = ""; // Limpa o campo extra
        
            if (metodoSelecionado === "Crédito" || metodoSelecionado === "Débito") {
                const label = document.createElement("label");
                label.textContent = "Selecione o cartão";
        
                const select = document.createElement("select");
                select.name = "cartao-editar";
                select.id = "cartao-editar";
        
                const defaultOption = document.createElement("option");
                defaultOption.value = "";
                defaultOption.textContent = "Selecione o cartão";
                select.appendChild(defaultOption);
        
                data.cartoes.forEach(cartao => {
                    const nomeConta = contasMapEditar.get(cartao.id_conta) || "Conta desconhecida";
        
                    const option = document.createElement("option");
                    option.value = cartao.id_cartao;
                    option.textContent = `${nomeConta} - ${cartao.nome_cartao || "Cartão"}`;
                    select.appendChild(option);
                });
        
                meioPagamentoEditar.appendChild(label);
                meioPagamentoEditar.appendChild(select);
        
            } else if (metodoSelecionado === "Transferência" || metodoSelecionado === "Boleto" || metodoSelecionado === "Pix") {
                const label = document.createElement("label");
                label.textContent = "Selecione a conta";
        
                const select = document.createElement("select");
                select.name = "conta-editar";
                select.id = "conta-editar";
        
                const defaultOption = document.createElement("option");
                defaultOption.value = "";
                defaultOption.textContent = "Selecione a conta";
                select.appendChild(defaultOption);
        
                data.contas.forEach(conta => {
                    const sigla = categoriaMapEditar[conta.categoria] || "?";
                    const nomeComCategoria = `${conta.nome_conta} ${sigla}`;
        
                    const option = document.createElement("option");
                    option.value = conta.id_conta;
                    option.textContent = nomeComCategoria;
                    select.appendChild(option);
                });
        
                meioPagamentoEditar.appendChild(label);
                meioPagamentoEditar.appendChild(select);
            }
        };

        metodoSelectEditar.addEventListener("change", atualizarMeioPagamentoEditar);
        
    })
    .catch(error => {
        console.error('Erro ao carregar os dados (editar):', error);
    });
}

function exibirSucessoEditar() {
    const modalSucesso = document.getElementById("modalSucessoEditarLancamento");
    modalSucesso.style.display = "flex";
}

function exibirErroEditar() {
    const modalErro = document.getElementById("modalErroEditarLancamento");
    modalErro.style.display = "flex";
}

function excluirLancamento(id) {
    const modalConfirmar = document.getElementById("modalConfirmarExcluir");
    modalConfirmar.style.display = "flex";

    const botaoConfirmar = document.getElementById("btnModalExcluirLancamento");

    const novoBotao = botaoConfirmar.cloneNode(true);
    botaoConfirmar.parentNode.replaceChild(novoBotao, botaoConfirmar);

    novoBotao.addEventListener("click", () => {
        fetch(`../Paginas/configs/excluir-lancamento.php?id_lancamento=${id}`, {
            method: "GET"
        })
        .then(response => response.json())
        .then(data => {
            modalConfirmar.style.display = "none";

            if (data.status === "success") {
                const modalSucesso = document.getElementById("modalSucessoExcluirLancamento");
                modalSucesso.style.display = "flex";
            } else {
                const modalErro = document.getElementById("modalErroExcluirLancamento");
                modalErro.style.display = "flex";
            }
        })
        .catch(error => {
            console.error('Erro ao excluir o lançamento:', error);
            modalConfirmar.style.display = "none";
            const modalErro = document.getElementById("modalErroExcluirLancamento");
            modalErro.style.display = "flex";
        });
    });
}

document.getElementById("btnModalAdd").addEventListener("click", () => {
    const modalSucesso = document.getElementById("modalAddLancamento");
    modalSucesso.style.display = "none";
    location.reload();
});

document.getElementById("btnModalEditar").addEventListener("click", () => {
    const modalSucesso = document.getElementById("modalSucessoEditarLancamento");
    modalSucesso.style.display = "none";
    location.reload();
});

document.getElementById("btnModalErro").addEventListener("click", () => {
    const modalErro = document.getElementById("modalErroLancamento");
    modalErro.style.display = "none";
    location.reload();
});

document.getElementById("btnModalErroEditar").addEventListener("click", () => {
    const modalErro = document.getElementById("modalErroEditarLancamento");
    modalErro.style.display = "none";
    location.reload();
});

document.querySelector("#form-edit-container .fechar-form-icon").addEventListener("click", () => {
    formEditar.style.display = "none";
    location.reload();
});

formLancamentoEditar.addEventListener("submit", (event) => {

    event.preventDefault();
    const formData = new FormData(formLancamentoEditar);

    fetch("../Paginas/configs/add-lancamento.php", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            exibirSucessoEditar(data);
        } else {
            exibirErroEditar(data);
        }
    })
    .catch(error => console.error("Erro:", error));
});

document.getElementById("btnModalCancelarExcluir").addEventListener("click", () => {
    const modalConfirmar = document.getElementById("modalConfirmarExcluir");
    modalConfirmar.style.display = "none";
});

document.getElementById("btnModalSucessoExcluir").addEventListener("click", () => {
    location.reload();
});

document.getElementById("btnModalErroExcluir").addEventListener("click", () => {
    const modalErro = document.getElementById("modalErroExcluirLancamento");
    modalErro.style.display = "none";
    location.reload();
});

document.getElementById("btnModalErroPreencher").addEventListener("click", () => {
    document.getElementById("modalErroCampos").style.display = "none";
});