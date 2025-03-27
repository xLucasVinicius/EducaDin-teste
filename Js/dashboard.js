const lancamentos = document.querySelector(".section-lancamentos"); // Seleciona o formulário
const body = document.querySelector("body"); // Seleciona o body
const parcelas = document.getElementById("parcelas"); // Seleciona o select de parcelas
const labelParcelas = document.getElementById("label-parcelas"); // Seleciona o label de parcelas
const subcategorias = { // Objeto com as subcategorias para cada categoria
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
    "Aplicativos de transporte",
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

// Abre o formulário de lançamentos
function exibirLancamentos() { 
    lancamentos.style.display = "flex"; // Exibe o formulário
    window.scrollTo(0, 0); // Desloca a janela para o topo quando o formulário abre
    body.style.overflow = "hidden"; // Bloqueia a rolagem da janela
}

// Fecha o formulário de lançamentos
function fecharLancamentos() { 
    lancamentos.style.display = "none";
    body.style.overflow = "auto";
  }

  function mostrarSubcategorias() { // Função para mostrar as subcategorias
    const categoriaSelect = document.getElementById("categoria"); // Seleciona o select de categoria
    const subcategoriaSelect = document.getElementById("subcategoria"); // Seleciona o select de subcategoria
    const subcategoriaLabel = document.getElementById("label-subcategoria"); // Seleciona o label de subcategoria
    const categoriaSelecionada = categoriaSelect.value; // Obtem o valor da categoria selecionada

    subcategoriaLabel.style.display = "block"; // Exibe o label
    subcategoriaSelect.style.display = "block"; // Exibe o select

    // Limpa as opções anteriores
    subcategoriaSelect.innerHTML = ""; 

    if (categoriaSelecionada === "") {
      // Se nenhuma categoria estiver selecionada, oculta as subcategorias
      subcategoriaLabel.style.display = "none";
      subcategoriaSelect.style.display = "none";
      return;
    }

    if (categoriaSelecionada && subcategorias[categoriaSelecionada]) { // Verifica se a categoria selecionada possui subcategorias
      
      subcategorias[categoriaSelecionada].forEach(subcategoria => { // Adiciona as novas opções de subcategorias
        const option = document.createElement("option"); // Cria uma nova opção
        option.value = subcategoria; // Define o valor da opção
        option.textContent = subcategoria; // Define o texto da opção
        subcategoriaSelect.appendChild(option); // Adiciona a opção ao select
      });
    }
  }

  // Função para mostrar as parcelas
  function mostrarParcelas() { 
    parcelas.style.display = "block"; // Exibe o select
    labelParcelas.style.display = "block"; // Exibe o label
  }

  // Função para ocultar as parcelas
  function ocultarParcelas() { 
    parcelas.style.display = "none"; // Oculta o select
    labelParcelas.style.display = "none"; // Oculta o label
  }
  