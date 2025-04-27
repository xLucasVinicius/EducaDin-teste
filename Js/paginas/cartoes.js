const body = document.querySelector('body');
const selectConta = document.getElementById('conta'); //select de conta do formulário de adicionar cartao
const conteudoGeral = document.querySelector('.conteudo'); //body geral
const containerForm = document.querySelector('.add-cartoes'); //container do formulário de adicionar cartao
const formCartao = document.getElementById('form-add-cartao'); //formulário de adicionar cartao
const formCartaoEditar = document.getElementById('form-Editar-Cartao'); //formulário de editar cartao
const modalExcluir = document.getElementById('ModalexcluirCartao'); //modal de excluir cartao
const modalExcluirSucesso = document.getElementById('modalexcluirSucesso'); //modal de sucesso ao excluir cartoes
const modalSucess = document.querySelector('#modalAddCartoes'); //modal de sucesso ao adicionar cartoes
const modalErrorAdd = document.querySelector('#errorModalAddCartoes'); //modal de erro ao adicionar cartoes
const modalErrorPreencher = document.querySelector('#errorModalPreencher'); //modal de erro para preencher campos
const modalConfirmarExcluir = document.querySelector('#modalConfirmarExcluir'); //modal de confirmação de exclusão de cartoes
const msgConfirmarExcluir = document.querySelector('#modalConfirmarExcluir h2'); //mensagem de confirmação de exclusão de cartoes
const tabelaBody = document.getElementById('cartoes-tabela-body'); //tabela de cartoes para excluir
const checkboxAnuidade = document.getElementById('anuidade'); //checkbox de anuidade
const modalEditarCartao = document.getElementById('modalEditarCartao'); //modal de editar cartao
const checkboxAnuidadeEditar = document.getElementById('anuidade-editar'); //checkbox de anuidade para editar o cartão
const anuidade = document.querySelector('.digitar-anuidade'); //div do input de digitar anuidade
const anuidadeEditar = document.querySelector('.digitar-anuidade-editar'); //div do input de digitar anuidade para editar o cartão
const inputAnuidade = document.getElementById('anuidade-valor'); //input de digitar anuidade
const inputAnuidadeEditar = document.getElementById('anuidade-valor-editar'); //input de digitar anuidade para editar o cartão
const btnAddExcluirCartao = document.getElementById('adicionar-excluir-cartao'); //botão para exibir form de adicionar cartao
const modalEditarSucesso = document.getElementById('modalAlterarCartao'); //modal de sucesso ao editar cartao
const ModalNenhumaAlteracao = document.getElementById('modalNenhumaAlteracao');

// Função para carregar os dados iniciais dos cartões quando a página for carregada
document.addEventListener("DOMContentLoaded", () => {
  // requisição ajax
  fetch('../Paginas/consultas/infos-cartoes.php')
  .then(response => {
    if (!response.ok) {
      throw new Error('Erro ao carregar dados: ' + response.statusText);
    }
    return response.json();
  })
  .then(data => {
    if (!Array.isArray(data.contas)) {
      throw new Error('Dados de contas inválidos ou não encontrados.');
    }
    
    const accountsData = data.contas; // Dados de contas
    const cartoesData = data.cartoes; // Dados de cartões
    const lancamentosCreditoData = data.lancamentos_credito; // Dados de lançamentos de crédito
    const lancamentosDebitoData = data.lancamentos_debito; // Dados de lançamentos de debito
    const lancamentosData = [...lancamentosCreditoData, ...lancamentosDebitoData]; // Dados de lançamentos
    localStorage.setItem('accountsData', JSON.stringify(accountsData)); // Armazena os dados de contas no localStorage
    const carouselContainer = document.querySelector('.cartoes-carrossel'); // Carrossel de cartões
    const lancamentosContainer = document.querySelector('.lancamentos'); // Container de lançamentos
    let tipoContaMap = {
      0: 'Corrente',
      1: 'Poupança',
      2: 'Salário',
      3: 'Digital'
    };

    carouselContainer.innerHTML = ''; // Limpa o carrossel
    lancamentosContainer.innerHTML = ''; // Limpa o container de lançamentos

    if (cartoesData.length === 0) { // Se nenhum cartão for encontrado
      carouselContainer.innerHTML = '<z style="color: white;">Nenhum cartão encontrado.</z>';
    }

    if (lancamentosCreditoData.length === 0 || lancamentosDebitoData.length === 0) { // Se nenhum lançamento for encontrada
      lancamentosContainer.style.height = '100%';
      lancamentosContainer.innerHTML = '<z style="color: white;">Nenhum lançamento encontrado.</z>'; 
    }

    // Mapeia as contas por id_conta para acesso fácil
    const contasMap = {};
    accountsData.forEach(account => {
      contasMap[account.id_conta] = account.nome_conta; // Mapeia o id_conta para o nome da conta
    });

    cartoesData.forEach((cartao, index) => {
      const nomeConta = contasMap[cartao.id_conta]; // Busca o nome da conta associado ao id_conta do cartão
      const account = accountsData.find(account => account.id_conta === cartao.id_conta); // Encontra a conta correspondente ao cartão
      const tipoConta = tipoContaMap[account.categoria];
      const diaFechamento = cartao.dia_fechamento; // Busca o dia de fechamento do cartão
      const diaVencimento = cartao.dia_vencimento; // Busca o dia de vencimento do cartão
      const respPontos = cartao.pontos; // Busca o dia de vencimento do cartão
      const dataAtual = new Date(); // Obtem a data atual
      const diaAtual = dataAtual.getDate(); // Obtem o dia atual
      let mesAtual = dataAtual.getMonth(); // Obtem o mês atual
      let anoAtual = dataAtual.getFullYear(); // Obtem o ano atual

      // Verifica se o dia de vencimento já passou e ajusta o mês de vencimento
      let mesVencimento = mesAtual;
      if (diaAtual > diaVencimento) {
        mesVencimento = mesAtual + 1;
        if (mesVencimento > 11) { // Se o mês ultrapassar dezembro
          mesVencimento = 0;
          anoAtual += 1;
        }
      }

      // Verifica se o dia de fechamento já passou
      let mesFechamento = mesAtual;
      if (diaAtual > diaFechamento && diaAtual > diaVencimento) {
        mesFechamento = mesAtual + 1;
        if (mesFechamento > 11) { // Se o mês ultrapassar dezembro
          mesFechamento = 0;
          anoAtual += 1;
        }
      }

      const cartaoDiv = document.createElement('div'); // Cria uma div para o cartão
      cartaoDiv.classList.add('cartao'); // Adiciona a classe 'cartao'
      if (index === 0) { // Se for o primeiro cartão
        cartaoDiv.classList.add('active'); // Adiciona a classe 'active'
        cartaoDiv.style.transform = 'translateX(0)'; // Define a transformação para o primeiro cartão
      }

      const limiteTotal = parseFloat(cartao.limite_total); // Calcular o limite disponível
      const totalLancamentos = lancamentosCreditoData.reduce((acc, lancamentos_credito) => acc + parseFloat(lancamentos_credito.valor), 0); // Somar os lançamentos (todos os lançamentos são valores positivos)
      const limiteDisponivel = limiteTotal - totalLancamentos; // Calcular o limite disponível

      if (cartao.tipo == 1) {
        // Renderizar o cartão crédito
        cartaoDiv.innerHTML = `
        <span class="info-icon" id="infoIcon${cartao.id_cartao}">
          <i class="bi bi-question"></i>
          <p class="txt-pontos disable" id="txtPontos${cartao.id_cartao}"></p>
        </span>
        <div class="logo">
          <img src="../imagens/cartoes/${nomeConta}.jpeg" alt="Cartão de ${nomeConta}">
        </div>
        <div class="infos-cartao">
          <h1> Cartão ${nomeConta}</h1>
          <h2 id="tipo-conta">Conta: ${nomeConta} (${tipoConta})</h2>
          <h2>Limite Total: R$ ${parseFloat(cartao.limite_total).toFixed(2).replace('.', ',')}</h2>
          <h2>Disponível: R$ ${parseFloat(limiteDisponivel).toFixed(2).replace('.', ',')}</h2>
          <span class="infos-fatura">
            <p>Fechamento: ${formatarDia(diaFechamento)}/${formatarMes(mesFechamento)}/${anoAtual}</p>
            <p>Vencimento: ${formatarDia(diaVencimento)}/${formatarMes(mesVencimento)}/${anoAtual}</p>
          </span>
        </div>
        <button class="btn-editar-cartao" data-id-cartao="${cartao.id_cartao}"><i class="bi bi-gear"></i></button>
      `;
      } else {
        // Renderizar o cartão de débito
        cartaoDiv.innerHTML = `
        <span class="info-icon" id="infoIcon${cartao.id_cartao}">
          <i class="bi bi-question"></i>
          <p class="txt-pontos disable" id="txtPontos${cartao.id_cartao}"></p>
        </span>
        <div class="logo">
          <img src="../imagens/cartoes/${nomeConta}.jpeg" alt="Cartão de ${nomeConta}">
        </div>
        <div class="infos-cartao">
          <h1> Cartão ${nomeConta}</h1>
          <h2 id="tipo-conta">Conta: ${nomeConta} (${tipoConta})</h2>
          <h2>Apenas débito</h2>
        </div>
      `;
      }
      
      
      carouselContainer.appendChild(cartaoDiv); // Adiciona o cartão ao carrossel
      const txtPontos = document.getElementById(`txtPontos${cartao.id_cartao}`); //
      if (respPontos == 0) {
        txtPontos.innerHTML = 'Usar este cartão em compras pode gerar benefícios, entenda mais pesquisando sobre as vantagens proporcionadas pela sua bandeira.';
      } else {
        txtPontos.innerHTML = 'Este cartão não possui beneficios ao realizar compras, usar outro cartão pode ser a melhor opção.';
        txtPontos.style.height = '60px';
      }

      const infoIcon = document.getElementById(`infoIcon${cartao.id_cartao}`);
      infoIcon.addEventListener('click', () => {
      txtPontos.classList.toggle('disable'); // Alterna a visibilidade do parágrafo
    });
    });

    const selectConta = document.getElementById('conta'); // Seleciona o select de contas

    // Loop separado para adicionar as contas ao select
    accountsData.forEach(account => {
      // Se o nome da conta for "carteira", não adiciona
      if (account.nome_conta.toLowerCase() === "carteira") {
        return; // pula para o próximo item do forEach
      }
      let tipoContaMap = {
        0: 'C',
        1: 'P',
        2: 'S',
        3: 'D'
      };
    
      const tipoConta = tipoContaMap[account.categoria];
      const option = document.createElement('option');
      option.value = account.id_conta; // Valor da conta
      option.text = `${account.nome_conta} ${tipoConta} `; // Nome da conta para exibir
      selectConta.appendChild(option);
    });

    // Seleciona todas as slides de contas após a criação dinâmica
    const slides = document.querySelectorAll('.cartao');
    let currentIndex = 0;
    const totalSlides = slides.length;

    // Função para realizar a transição entre slides
    function goToSlide(newIndex, direction = 'next') {
      if (newIndex === currentIndex) return; // Nada a fazer se for o mesmo slide

      const currentSlide = slides[currentIndex]; // Slide atual
      const nextSlide = slides[newIndex]; // Próximo slide

      // Define a posição inicial do próximo slide conforme a direção
      if (direction === 'next') {
        nextSlide.style.transform = 'translateX(100%)'; // Translada para a direita
      } else {
        nextSlide.style.transform = 'translateX(-100%)'; // Translada para a esquerda
      }

      // Força o reflow para garantir que a posição inicial seja aplicada
      nextSlide.offsetHeight; // Forçar reflow

      // Anima o slide atual para fora e o próximo para dentro
      if (direction === 'next') {
        currentSlide.style.transform = 'translateX(-100%)'; // Translada para a esquerda
      } else {
        currentSlide.style.transform = 'translateX(100%)'; // Translada para a direita
      }
      nextSlide.style.transform = 'translateX(0)'; // Move o próximo slide para a posição correta

      // Atualiza as classes para controle visual
      currentSlide.classList.remove('active');
      nextSlide.classList.add('active');

      currentIndex = newIndex;

      // Atualiza os lançamentos de acordo com a conta selecionada
      renderLancamentos(cartoesData[newIndex].id_cartao);
    }

    // Função para aplicar efeito bounce quando não houver mudança
    function applyBounce(slide, direction) {
      slide.classList.remove('bounce-left', 'bounce-right'); // Remove os efeitos anteriores

      if (direction === 'prev') {
        slide.classList.add('bounce-right'); // Efeito bounce para a direita
      } else if (direction === 'next') {
        slide.classList.add('bounce-left'); // Efeito bounce para a esquerda
      }

      // Remove os efeitos depois de 300ms
      setTimeout(() => {
        slide.classList.remove('bounce-left', 'bounce-right');
      }, 300);
    }

    // Eventos para os botões de navegação
    document.querySelector('.next.buttom').addEventListener('click', () => {
      if (currentIndex === totalSlides - 1) {
        applyBounce(slides[currentIndex], 'next'); // Aplica o efeito
        return;
      }
      goToSlide(currentIndex + 1, 'next'); // Realiza a transição
    });

    document.querySelector('.prev.buttom').addEventListener('click', () => {
      if (currentIndex === 0) {
        applyBounce(slides[currentIndex], 'prev'); // Aplica o efeito
        return;
      }
      goToSlide(currentIndex - 1, 'prev'); // Realiza a transição
    });

    // Função para renderizar os lançamentos em formato de tabela
    function renderLancamentos(accountId) {
      lancamentosContainer.innerHTML = ''; // Limpa o container de lançamentos
      const lancamentos = lancamentosData.filter(l => l.id_cartao === accountId); // Filtra os lançamentos da conta selecionada
      if (lancamentos.length === 0) { // Se nenhuma conta foi encontrada
        lancamentosContainer.innerHTML = '<z style="color: white;">Nenhum lançamento encontrado.</z>'; 
        return;
      }

      const table = document.createElement('table'); // Cria uma tabela

      // Cria o cabeçalho da tabela
      const thead = `
        <thead>
            <tr>
                <th>Descrição</th>
                <th>Valor</th>
                <th>Método</th>
                <th>Categoria</th>
                <th>Subcategoria</th>
                <th>Data</th>
                <th>Parcelas</th>
            </tr>
        </thead>`;
      
      let tbody = '<tbody>';

      // Cria as linhas da tabela
      lancamentos.forEach(lancamento => {
        let lancamentoParcela = parseInt(lancamento.parcelas) === 0 ? 'A vista' : lancamento.parcelas;

        tbody += `
          <tr>
              <td>${lancamento.descricao}</td>
              <td>R$ ${parseFloat(lancamento.valor).toFixed(2).replace('.', ',')}</td>
              <td>${lancamento.metodo_pagamento}</td>
              <td>${lancamento.categoria}</td>
              <td>${lancamento.subcategoria}</td>
              <td>${new Date(lancamento.data).toLocaleDateString('pt-BR')}</td>
              <td>${lancamentoParcela}</td>
              
          </tr>`;
      });

      // Fecha o corpo da tabela
      tbody += '</tbody>';

      table.innerHTML = thead + tbody; // Insere o cabeçalho e o corpo na tabela
      lancamentosContainer.appendChild(table); // Adiciona a tabela ao container
    }

    // Renderiza os lançamentos iniciais
    renderLancamentos(cartoesData[currentIndex].id_cartao);
    // Formatando exibição da tabela corretamente
    const lancamentosFora = document.getElementById('fora-lancamentos');
    lancamentosFora.style.display = 'flex';

    // Evento de clique no botão de edição
    document.querySelectorAll('.btn-editar-cartao').forEach(botao => {
      botao.addEventListener('click', function () {
          const idCartao = this.dataset.idCartao;
          const cartaoSelecionado = cartoesData.find(cartao => cartao.id_cartao == idCartao);
          if (cartaoSelecionado) {
            abrirModalEdicaoCartao(cartaoSelecionado);
          }
      });
    });

  })
  .catch(error => {
    console.error('Erro ao carregar os dados:', error);
  });
});

// Evento de submissão do formulário para adicionar cartao
formCartao.addEventListener('submit', function (event) {
  event.preventDefault();

  const valueSelectConta = selectConta.value;
  const inputDebito = document.getElementById('debito');
  const inputCredito = document.getElementById('credito');
  const limiteCartao = document.getElementById('limite').value;
  const diaFechamento = document.getElementById('fechamento').value;
  const diaVencimento = document.getElementById('vencimento').value;
  const checkboxAnuidade = document.getElementById('checkbox-anuidade');
  const inputAnuidade = document.getElementById('anuidade');
  const pontosCheck = document.getElementById('pontos');

  // Primeiro: verificar se selecionou uma conta
  if (!valueSelectConta) {
      modalErrorPreencher.style.display = 'block';
      return;
  }

  let respPontos = pontosCheck.checked ? 0 : 1;
  let respAnuidade = 0; // Inicializa

  if (inputDebito.checked) {
      // Débito: não valida nada extra
      enviarFormulario(respPontos, respAnuidade);
  } else if (inputCredito.checked) {
      // Crédito: valida os campos obrigatórios
      if (!limiteCartao || !diaFechamento || !diaVencimento) {
          modalErrorPreencher.style.display = 'block';
          return;
      }

      if (checkboxAnuidade.checked) {
          if (!inputAnuidade.value) {
              modalErrorPreencher.style.display = 'block';
              return;
          } else {
              respAnuidade = inputAnuidade.value;
          }
      }

      // Se passou todas validações
      enviarFormulario(respPontos, respAnuidade);
  }

  // Função de envio do formulário
  function enviarFormulario(respPontos, respAnuidade) {
      const formData = new FormData(formCartao);
      formData.append('pontos', respPontos);
      formData.append('anuidade-valor', respAnuidade);

      fetch('../Paginas/configs/add-cartao.php', {
          method: 'POST',
          body: formData,
      })
      .then(response => response.json())
      .then(data => {
          if (data.status === 'error_cartao') {
              exibirModalErro(data);
          } else if (data.status === 'success') {
              exibirSucessoAdd(data);
          }
      })
      .catch(error => console.error('Erro:', error));
  }
});



// Evento de alteração do checkbox para exibir ou ocultar o campo de anuidade
checkboxAnuidade.addEventListener('change', function() {
  if (checkboxAnuidade.checked) {
    anuidade.style.display = 'flex';
  } else {
    anuidade.style.display = 'none';
  }
});

// Evento de alteração do checkbox para exibir ou ocultar o campo de anuidade para editar o cartão
checkboxAnuidadeEditar.addEventListener('change', function() {
  if (checkboxAnuidadeEditar.checked) {
    anuidadeEditar.style.display = 'flex';
  } else {
    anuidadeEditar.style.display = 'none';
  }
});

// Fechar modal de sucesso ao clicar no botão
document.getElementById('btnModalAdd').addEventListener('click', function () {
    modalSucess.style.display = 'none';
    location.reload();
});

// Fechar modal de erro de preenchimento de campos ao clicar no botão
document.getElementById('btnModalCampos').addEventListener('click', function () {
    modalErrorPreencher.style.display = 'none';
});

// Fechar modal de cartão existente ao clicar no botão
document.getElementById('btnModalCartao').addEventListener('click', function () {
    modalErrorAdd.style.display = 'none';
});

// Fechar modal de sucesso ao atualizar cartão ao clicar no botão
document.getElementById('btnModalAlterarSucesso').addEventListener('click', function () {
  modalEditarSucesso.style.display = 'none';
  location.reload();
});

// Fechar modal de nenhuma alteração ao editar o cartão ao clicar no botão
document.getElementById('btnModalNenhumaAlteracao').addEventListener('click', function () {
  ModalNenhumaAlteracao.style.display = 'none';
  location.reload();
})

// Fechar o modal de sucesso ao clicar no botão
document.getElementById('btnModalexcluirSucesso').addEventListener('click', function () {
  modalExcluirSucesso.style.display = 'none';
  location.reload();
});

// Eventos para cancelar a exclusão
document.getElementById('fecharModalExcluir').addEventListener('click', function () {
  modalExcluir.style.display = 'none';
  location.reload();
});

// Eventos para cancelar a edição
document.getElementById('fecharModalEditar').addEventListener('click', function () {
  modalEditarCartao.style.display = 'none';
  location.reload();
});

// Evento de edição do cartão
formCartaoEditar.addEventListener('submit', function (event) {
  event.preventDefault();
  let respAnuidade = null;
    if (!checkboxAnuidadeEditar.checked) {
      respAnuidade = null;
    } else {
      respAnuidade = inputAnuidadeEditar.value;
    }
  const pontosCheck = document.getElementById('pontos-editar');
    let respPontos = null;
    if (pontosCheck.checked) {
      respPontos = 0;
    } else {
      respPontos = 1;
    }
  const formData = new FormData(formCartaoEditar);
  formData.append('pontos-editar', respPontos);
  formData.append('anuidade-valor-editar', respAnuidade);

  fetch('../Paginas/configs/add-cartao.php', {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    if (data.status === 'updated') {
      exibirSucessoEditar(data);
    } else if (data.status === 'no_changes') {
      exibirNenhumaAlteracao(data);
    }
  })
  .catch(error => console.error('Erro:', error))
});

// Funcionalidade para excluir um cartão
document.getElementById('excluir-cartao').addEventListener('click', function () {
  const bodyGeral = document.querySelector('.conteudo') // Seleciona o body geral
  const elementoFora = document.querySelector('.elemento-fora') // Seleciona o elemento fora dos lancamentos
  bodyGeral.style = ' overflow-y: initial;';  // Desativa a rolagem vertical
  window.scrollTo(0, 0); // Desloca a janela para o topo quando o formulário abre
  elementoFora.style = 'overflow: hidden; height: 100%;'; // Desativa a rolagem horizontal
  modalExcluir.style.display = 'block'; // Exibe o modal

  // Carregar os dados das contas
  fetch('../Paginas/consultas/infos-cartoes.php')
    .then(response => response.json())
    .then(data => {
      const cartoes = data.cartoes; // Acessa a lista de contas retornada da resposta
      const accountsData = data.contas; // Dados de contas

      // Mapeia as contas por id_conta para acesso fácil
      const contasMap = {};
      accountsData.forEach(account => {
        contasMap[account.id_conta] = account.nome_conta; // Mapeia o id_conta para o nome da conta
      });

      // Exibe os cartões na tabela
      cartoes.forEach(cartao => {

        const row = document.createElement('tr');
        row.id = cartao.id_cartao;
        const tipoContaMap = {
          0: 'C',
          1: 'P',
          2: 'S',
          3: 'D'
        };
        const nomeConta = contasMap[cartao.id_conta]; // Busca o nome da conta associado ao id_conta do cartão
        const account = accountsData.find(account => account.id_conta === cartao.id_conta); // Encontra a conta correspondente ao cartão
        const tipoConta = tipoContaMap[account.categoria];

        // Coluna da imagem (logo)
        const logoCell = document.createElement('td');
        const img = document.createElement('img');
        img.src = `../imagens/cartoes/${nomeConta}.jpeg`; // Caminho para a imagem
        img.alt = `Logo da ${nomeConta}`; // Texto alternativo
        img.width = 100; // Largura da imagem
        img.height = 65; // Altura da imagem
        img.style.objectFit = 'cover'; // Ajusta a imagem para cobrir o conteúdo
        logoCell.appendChild(img); // Adiciona a imagem à celula
        row.appendChild(logoCell); // Adiciona a celula à linha

        // Coluna do nome da conta
        const nomeCell = document.createElement('td');
        nomeCell.textContent = nomeConta + ` ${tipoConta}`;
        row.appendChild(nomeCell);

        // Coluna do saldo atual (formatado como moeda)
        const saldoCell = document.createElement('td');
        saldoCell.textContent = formatarSaldo(cartao.limite_total);
        row.appendChild(saldoCell);

        // Coluna para o botão de exclusão
        const acoesCell = document.createElement('td');
        const excluirBtn = document.createElement('button');
        excluirBtn.textContent = 'Excluir'; // Texto do botão
        excluirBtn.className = 'btn-excluir'; // Adicione uma classe para estilizar se necessário
        
        // Exibe o modal de exclusão ao clicar no botão de excluir
        excluirBtn.addEventListener('click', () => {
          modalConfirmarExcluir.style.display = 'block';
          msgConfirmarExcluir.textContent = `Tem certeza de que deseja excluir o cartão ${nomeConta}?`;

          // Confirma a exclusão ao clicar no botão "Sim"
          document.getElementById('btnModalexcluir').addEventListener('click', function () {
            modalConfirmarExcluir.style.display = 'none';
            excluirCartao(cartao.id_cartao, cartao.id_usuario); // Chama a função de exclusão
          });

          // Cancela a exclusão ao clicar no botão "Nao"
          document.getElementById('btnModalNao').addEventListener('click', function () {
            modalConfirmarExcluir.style.display = 'none';
          });

        });
        acoesCell.appendChild(excluirBtn); // Adiciona o botão de exclusão à linha
        row.appendChild(acoesCell); // Adiciona a linha à tabela
        tabelaBody.appendChild(row); // Adiciona a linha à tabela
      });
    })
    .catch(error => console.error('Erro ao carregar os dados:', error));
});

// Evento para exibir formulario de adicionar cartao em telas menores
btnAddExcluirCartao.addEventListener('click', function () {
  containerForm.style = 'display: flex; opacity: 1;';
  modalEditarCartao.style.display = 'none';
  conteudoGeral.style = ' overflow: hidden;';
});

// Evento para fechar formulario de adicionar cartao em telas menores
document.getElementById('fecharForm').addEventListener('click', function () {
  containerForm.style.display = 'none';
  location.reload();
});

window.addEventListener('resize', formularioCartoes);

window.addEventListener('load', formularioCartoes);

// Função para tratar o sucesso
function exibirSucessoAdd(data) {
  modalSucess.style = 'display: block; z-index: 3;';
}

// Função para mostrar modal de erro
function exibirModalErro(data) {
    modalErrorAdd.style.display = 'block';
}

// Função para exibir modal de sucesso ao editar o cartão
function exibirSucessoEditar(data) {
  modalEditarSucesso.style.display = 'flex';
}

// Função para exibir modal de nenhuma alteração ao editar o cartão
function exibirNenhumaAlteracao(data) {
  ModalNenhumaAlteracao.style.display = 'flex';
}

// Função para formatar o saldo como moeda
function formatarSaldo(valor) {
  return `R$ ${parseFloat(valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
}

// Função para formatar moeda
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

// Função para excluir o cartao
function excluirCartao(id_cartao, id_usuario) {
  // Faz uma requisição para excluir a conta com os IDs fornecidos
  fetch(`../Paginas/configs/excluir-cartao.php?id_cartao=${id_cartao}&id_usuario=${id_usuario}`, {
    method: 'DELETE',
  })
  .then(response => response.json())
  .then(result => {
    if (result.sucesso) {
      modalExcluirSucesso.style.display = 'block';
    } else {
      console.error('Erro ao excluir o cartao:', result);
    }
  })
  .catch(error => console.error('Erro ao excluir o cartao:', error));
}

// Adicionar o zero à frente do mês, se necessário (exemplo: 01 para janeiro)
function formatarMes(mes) {
  return mes < 9 ? `0${mes + 1}` : mes + 1;
}

// Função para garantir que o dia tenha dois algarismos
function formatarDia(dia) {
  return dia < 10 ? `0${dia}` : dia;
}

// Preencher os selects com os dias de 1 a 31 dinamicamente
function preencherSelectDias(id) {
  let select = document.getElementById(id);
  for (let i = 1; i <= 31; i++) {
      let option = document.createElement("option");
      option.value = i.toString().padStart(2, '0');
      option.textContent = i.toString().padStart(2, '0');
      select.appendChild(option);
  }
}

function abrirModalEdicaoCartao(cartao) {
  const inputLimite = document.getElementById('limite-editar');
  document.querySelector('.conteudo').style = 'overflow: hidden;';

  modalEditarCartao.style.display = 'block';

  // Preencher os inputs com os dados do cartão
  inputLimite.value = cartao.limite_total;
  formatarMoeda(inputLimite);
  document.getElementById('fechamento-editar').value = formatarDia(cartao.dia_fechamento);
  document.getElementById('vencimento-editar').value = formatarDia(cartao.dia_vencimento);
  if (cartao.anuidade !== null) {
    checkboxAnuidadeEditar.checked = true;
    inputAnuidadeEditar.value = cartao.anuidade;
    formatarMoeda(inputAnuidadeEditar);
    anuidadeEditar.style.display = 'flex';
  }
  if (cartao.pontos == 0) {
    document.getElementById('pontos-editar').checked = true;
  }
  document.getElementById('id-cartao-editar').value = cartao.id_cartao;
}

function formularioCartoes() { 
  const larguraTela = window.innerWidth; // Obtem a largura da tela

  if (larguraTela <= 1560) { // Verifica se a largura da tela é menor que 1560
    containerForm.classList.add('collapsed'); // Adiciona a classe "collapsed"
    btnAddExcluirCartao.style.display = 'block';
  } else {
    containerForm.classList.remove('collapsed'); // Remove a classe "collapsed"
    containerForm.style = 'opacity: 1;';
    btnAddExcluirCartao.style.display = 'none';
  }
}

function mostrarCamposCredito() {
  const camposCredito = document.querySelector('.opcoes-credito');
  camposCredito.style.display = 'flex';
}

function ocultarCamposCredito() {
  const camposCredito = document.querySelector('.opcoes-credito');
  camposCredito.style.display = 'none';
}

preencherSelectDias("fechamento");
preencherSelectDias("vencimento");
preencherSelectDias("fechamento-editar");
preencherSelectDias("vencimento-editar");