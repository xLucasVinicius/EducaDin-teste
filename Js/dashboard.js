function exibirLancamentos() {
    const lancamentos = document.querySelector(".section-lancamentos");
    const body = document.querySelector("body");

    lancamentos.style.display = "flex";
    window.scrollTo(0, 0);
    body.style.overflow = "hidden";
}

function fecharLancamentos() {
    const lancamentos = document.querySelector(".section-lancamentos");
    const body = document.querySelector("body");

    lancamentos.style.display = "none";
    body.style.overflow = "auto";
  }


















const subcategorias = {
    moradia: [
      "Aluguel", 
      "Prestação do imóvel", 
      "Condomínio", 
      "Água", 
      "Luz", 
      "Internet/TV"
    ],
    alimentacao: [
      "Supermercado", 
      "Refeições fora de casa", 
      "Delivery"
    ],
    transporte: [
      "Combustível", 
      "Transporte público", 
      "Manutenção de veículo", 
      "Pedágios/estacionamento"
    ],
    educacao: [
      "Mensalidade escolar/faculdade", 
      "Cursos e workshops", 
      "Material escolar"
    ],
    saude: [
      "Plano de saúde", 
      "Medicamentos", 
      "Consultas médicas", 
      "Tratamentos odontológicos"
    ],
    lazer: [
      "Cinema", 
      "Shows", 
      "Viagens", 
      "Assinaturas de streaming"
    ],
    vestuario: [
      "Roupas", 
      "Acessórios", 
      "Calçados"
    ],
    impostos: [
      "IPVA", 
      "Imposto de Renda", 
      "Multas"
    ],
    servicos: [
      "Celular", 
      "Assinaturas de software", 
      "Apps"
    ],
    despesas_gerais: [
      "Presentes", 
      "Doações", 
      "Outros"
    ],
    salario: [
      "Salário fixo", 
      "13º salário", 
      "Bônus/PLR"
    ],
    freelance: [
      "Serviços eventuais", 
      "Consultorias"
    ],
    investimentos: [
      "Juros de poupança", 
      "Renda de ações", 
      "Aluguéis recebidos"
    ],
    vendas: [
      "Venda de bens", 
      "Venda de produtos"
    ],
    outros: [
      "Reembolsos", 
      "Prêmios", 
      "Doações recebidas"
    ]
  };

  function mostrarSubcategorias() {
    const categoriaSelect = document.getElementById("categoria");
    const subcategoriaSelect = document.getElementById("subcategoria");
    const subcategoriaLabel = document.getElementById("label-subcategoria");
    const categoriaSelecionada = categoriaSelect.value;

    subcategoriaLabel.style.display = "block";
    subcategoriaSelect.style.display = "block";

    // Limpa as opções anteriores
    subcategoriaSelect.innerHTML = "";

    if (categoriaSelecionada === "") {
      // Se nenhuma categoria estiver selecionada, oculta as subcategorias
      subcategoriaLabel.style.display = "none";
      subcategoriaSelect.style.display = "none";
      return;
    }

    if (categoriaSelecionada && subcategorias[categoriaSelecionada]) {
      // Adiciona as novas opções de subcategorias
      subcategorias[categoriaSelecionada].forEach(subcategoria => {
        const option = document.createElement("option");
        option.value = subcategoria;
        option.textContent = subcategoria;
        subcategoriaSelect.appendChild(option);
      });
    }
  }

  function mostrarParcelas() {
    const parcelas = document.getElementById("parcelas");
    const labelParcelas = document.getElementById("label-parcelas");
    parcelas.style.display = "block";
    labelParcelas.style.display = "block";
  }

  function ocultarParcelas() {
    const parcelas = document.getElementById("parcelas");
    const labelParcelas = document.getElementById("label-parcelas");
    parcelas.style.display = "none";
    labelParcelas.style.display = "none";
  }


  