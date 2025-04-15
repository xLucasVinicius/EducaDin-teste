const containerParcelas = document.getElementById('parcelas-container'); // Seleciona o container de parcelas
const formLancamento = document.getElementById('form-add-lancamento'); // Seleciona o formulário de lançamentos


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
            "2": "S"  // Salário
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
                // Cartões
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
    
            } else if (
                metodoSelecionado === "Transferência" ||
                metodoSelecionado === "Boleto" ||
                metodoSelecionado === "Pix"
            ) {
                // Contas
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




    fetch('../Paginas/consultas/infos-lancamentos.php')
        .then(response => {})
        .then(data => {})
        .catch(error => {
            console.error('Erro ao carregar os dados:', error);
        });

    // Carrossel de meses
    const mesesContainer = document.querySelector(".meses");
    const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    let mesAtual = new Date().getMonth();
    let animando = false;

    const btnPrev = document.createElement("button");
    btnPrev.className = "prev buttom";
    btnPrev.innerHTML = `<i class="bi bi-chevron-left"></i>`;

    const mesWrapper = document.createElement("div");
    mesWrapper.className = "mes-wrapper";
    mesWrapper.innerHTML = `<p class="mes-atual">${meses[mesAtual]}</p>`;

    const btnNext = document.createElement("button");
    btnNext.className = "next buttom";
    btnNext.innerHTML = `<i class="bi bi-chevron-right"></i>`;

    mesesContainer.innerHTML = "";
    mesesContainer.appendChild(btnPrev);
    mesesContainer.appendChild(mesWrapper);
    mesesContainer.appendChild(btnNext);

    function trocarMes(direcao) {
        if (animando) return;
        animando = true;

        const mesAnterior = document.querySelector(".mes-atual");
        const novoMes = document.createElement("p");
        novoMes.className = "mes-atual";

        mesAtual = (mesAtual + direcao + 12) % 12;
        novoMes.textContent = meses[mesAtual];

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
        }, 300);
    }

    btnPrev.addEventListener("click", () => trocarMes(-1));
    btnNext.addEventListener("click", () => trocarMes(1));

    btnAbrirForm.addEventListener('click', () => containerForm.style.display = 'flex');
    btnFecharForm.addEventListener('click', () => containerForm.style.display = 'none');

    // Categorias/Subcategorias
    const subcategorias = {
        moradia: ["Aluguel", "Prestação do imóvel", "Condomínio", "Água", "Luz", "Internet/TV"],
        alimentação: ["Supermercado", "Refeições fora de casa", "Delivery"],
        transporte: ["Aplicativos de transporte", "Combustível", "Transporte público", "Manutenção de veículo", "Pedágios/estacionamento"],
        educação: ["Mensalidade escolar/faculdade", "Cursos e workshops", "Material escolar"],
        saúde: ["Plano de saúde", "Medicamentos", "Consultas médicas", "Tratamentos odontológicos"],
        lazer: ["Cinema", "Shows", "Viagens", "Assinaturas de streaming"],
        vestuário: ["Roupas", "Acessórios", "Calçados"],
        impostos: ["IPVA", "Imposto de Renda", "Multas", "Anuidade"],
        serviços: ["Celular", "Assinaturas de software", "Apps"],
        despesas_gerais: ["Presentes", "Doações", "Outros"],
        salário: ["Salário fixo", "13º salário", "Bônus/PLR"],
        freelance: ["Serviços eventuais", "Consultorias"],
        investimentos: ["Juros de poupança", "Renda de ações", "Aluguéis recebidos"],
        vendas: ["Venda de bens", "Venda de produtos"],
        outros: ["Reembolsos", "Prêmios", "Doações recebidas"]
    };

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

    // Atualiza subcategorias ao selecionar categoria
    selectCategoria.addEventListener("change", mostrarSubcategorias);

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

function ocultarParcelas() {
    containerParcelas.style.display = "none";
}

function mostrarParcelas() {
    containerParcelas.style.display = "flex";
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
    const formData = new FormData(formLancamento);
    console.log(formData);
    fetch("../paginas/configs/add-lancamento.php", {
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

document.getElementById("btnModalAdd").addEventListener("click", () => {
    const modalSucesso = document.getElementById("modalAddLancamento");
    modalSucesso.style.display = "none";
    location.reload();
});

document.getElementById("btnModalErro").addEventListener("click", () => {
    const modalErro = document.getElementById("modalErroLancamento");
    modalErro.style.display = "none";
    location.reload();
});