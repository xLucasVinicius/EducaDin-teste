const body = document.querySelector('body');
const selectConta = document.getElementById('conta'); //select de conta do formulário de adicionar cartao
const formCartao = document.getElementById('form-add-cartao'); //formulário de adicionar cartao
const modalExcluir = document.getElementById('ModalexcluirCartao'); //modal de excluir cartao
const modalExcluirSucesso = document.getElementById('modalexcluirSucesso'); //modal de sucesso ao excluir cartoes
const modalSucess = document.querySelector('#modalAddCartoes'); //modal de sucesso ao adicionar cartoes
const modalErrorAdd = document.querySelector('#errorModalAddCartoes'); //modal de erro ao adicionar cartoes
const modalErrorPreencher = document.querySelector('#errorModalPreencher'); //modal de erro para preencher campos
const modalConfirmarExcluir = document.querySelector('#modalConfirmarExcluir'); //modal de confirmação de exclusão de cartoes
const msgConfirmarExcluir = document.querySelector('#modalConfirmarExcluir h2'); //mensagem de confirmação de exclusão de cartoes
const tabelaBody = document.getElementById('cartoes-tabela-body'); //tabela de cartoes para excluir
const checkboxAnuidade = document.getElementById('anuidade'); //checkbox de anuidade
const anuidade = document.querySelector('.digitar-anuidade'); //div do input de digitar anuidade
const inputAnuidade = document.getElementById('anuidade-valor'); //input de digitar anuidade

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
    const lancamentosData = data.lancamentos; // Dados de lançamentos
    localStorage.setItem('accountsData', JSON.stringify(accountsData)); // Armazena os dados de contas no localStorage
    const carouselContainer = document.querySelector('.cartoes-carrossel'); // Carrossel de cartões
    const lancamentosContainer = document.querySelector('.lancamentos'); // Container de lançamentos
    let tipoContaMap = {
      0: 'Corrente',
      1: 'Poupança',
      2: 'Salário'
    };

    carouselContainer.innerHTML = ''; // Limpa o carrossel
    lancamentosContainer.innerHTML = ''; // Limpa o container de lançamentos

    if (cartoesData.length === 0) { // Se nenhum cartão for encontrado
      carouselContainer.innerHTML = '<z style="color: white;">Nenhum cartão encontrado.</z>';
    }

    if (lancamentosData.length === 0) { // Se nenhum lançamento for encontrada
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
      const lancamentosCartao = lancamentosData.filter(lancamento => lancamento.id_cartao === cartao.id_cartao); // Filtrar lançamentos relacionados ao cartão 
      const totalLancamentos = lancamentosCartao.reduce((acc, lancamento) => acc + parseFloat(lancamento.valor), 0); // Somar os lançamentos (todos os lançamentos são valores positivos)
      const limiteDisponivel = limiteTotal - totalLancamentos; // Calcular o limite disponível

      // Renderizar o cartão
      cartaoDiv.innerHTML = `
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
      `;
      
      carouselContainer.appendChild(cartaoDiv); // Adiciona o cartão ao carrossel
    });

    const selectConta = document.getElementById('conta'); // Seleciona o select de contas

    // Loop separado para adicionar as contas ao select
    accountsData.forEach(account => {
      let tipoContaMap = {
        0: 'C',
        1: 'P',
        2: 'S'
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
      renderLancamentos(accountsData[newIndex].id_conta);
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
      const lancamentos = lancamentosData.filter(l => l.id_conta === accountId); // Filtra os lançamentos da conta selecionada
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
                <th>Tipo</th>
                <th>Método</th>
                <th>Subcategoria</th>
                <th>Data</th>
                <th>Parcelas</th>
            </tr>
        </thead>`;
      
      let tbody = '<tbody>';

      // Cria as linhas da tabela
      lancamentos.forEach(lancamento => {
        tbody += `
          <tr>
              <td>${lancamento.descricao}</td>
              <td>R$ ${parseFloat(lancamento.valor).toFixed(2).replace('.', ',')}</td>
              <td>${lancamento.tipo}</td>
              <td>${lancamento.metodo_pagamento}</td>
              <td>${lancamento.subcategoria}</td>
              <td>${new Date(lancamento.data).toLocaleDateString('pt-BR')}</td>
              <td>${lancamento.parcelas}</td>
              
          </tr>`;
      });

      // Fecha o corpo da tabela
      tbody += '</tbody>';

      table.innerHTML = thead + tbody; // Insere o cabeçalho e o corpo na tabela
      lancamentosContainer.appendChild(table); // Adiciona a tabela ao container
    }

    // Renderiza os lançamentos iniciais
    renderLancamentos(accountsData[currentIndex].id_conta);
    // Formatando exibição da tabela corretamente
    const lancamentosFora = document.getElementById('fora-lancamentos');
    lancamentosFora.style.display = 'flex';
  })
  .catch(error => {
    console.error('Erro ao carregar os dados:', error);
  });
});

// Evento de submissão do formulário para adicionar cartao
formCartao.addEventListener('submit', function (event) {
    event.preventDefault();
    console.log(inputAnuidade.value);
    let respAnuidade = null;
    if (!checkboxAnuidade.checked) {
      respAnuidade = 0;
    } else {
      respAnuidade = inputAnuidade.value;
    }
    const pontosCheck = document.getElementById('pontos');
    let respPontos = null;
    if (pontosCheck.checked) {
      respPontos = 0;
    } else {
      respPontos = 1;
    }
    
    const valueSelectConta = selectConta.value; // Obtenha a conta selecionada
    const limiteCartao = document.getElementById('limite').value; // Obtenha o limite do cartão
    const diaFechamento = document.getElementById('fechamento').value; // Obtenha o dia de fechamento
    const diaVencimento = document.getElementById('vencimento').value; // Obtenha o dia de vencimento

    if (!valueSelectConta || !limiteCartao || !diaFechamento || !diaVencimento) { // Verifique se todos os campos foram preenchidos
        modalErrorPreencher.style.display = 'block'; // Exiba o modal de erro de preenchimento de campos
    } else {
      if (checkboxAnuidade.checked && !inputAnuidade.value) {
        modalErrorPreencher.style.display = 'block'; // Exiba o modal de erro de preenchimento de campos
      } else {
        const formData = new FormData(formCartao); // Cria o objeto FormData com o conteúdo do formulário
        formData.append('pontos', respPontos);

        fetch('../Paginas/configs/add-cartao.php', {
            method: 'POST',
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'error_cartao') {
                showModalError(data); // Exibe o modal com erro
            } else if (data.status === 'success') {
                handleSuccess(data); // Exibe o modal de sucesso
            }
        })
        .catch(error => console.error('Erro:', error));
    }
  }
});


// Evento de alteração do checkbox para exibir ou ocultar o campo de anuidade
checkboxAnuidade.addEventListener('change', function() {
  if (checkboxAnuidade.checked) {
    anuidade.style.display = 'block';
  } else {
    anuidade.style.display = 'none';
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

// Função para tratar o sucesso
function handleSuccess(data) {
  modalSucess.style.display = 'block';
}

// Função para mostrar modal de erro
function showModalError(data) {
    modalErrorAdd.style.display = 'block';
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
          2: 'S'
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









