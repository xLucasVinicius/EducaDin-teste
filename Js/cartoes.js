document.addEventListener("DOMContentLoaded", () => { // Adiciona um ouvinte para o evento de carregamento do DOM
  fetch('../Paginas/configs/infos-cartoes.php')
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
    localStorage.setItem('accountsData', JSON.stringify(accountsData));

    const carouselContainer = document.querySelector('.cartoes-carrossel');
    const lancamentosContainer = document.querySelector('.lancamentos');



    carouselContainer.innerHTML = '';
    lancamentosContainer.innerHTML = '';

      
    if (accountsData.length === 0) { 
      carouselContainer.innerHTML = '<z style="color: white;">Nenhum cartão encontrado.</z>';
    }

    if (lancamentosData.length === 0) {
      lancamentosContainer.style.height = '100%';
      lancamentosContainer.innerHTML = '<z style="color: white;">Nenhum lançamento encontrado.</z>'; 
    }  

    

    // Adicionar o zero à frente do mês, se necessário (exemplo: 01 para janeiro)
    function formatarMes(mes) {
      return mes < 9 ? `0${mes + 1}` : mes + 1;
    }

    // Função para garantir que o dia tenha dois algarismos
    function formatarDia(dia) {
      return dia < 10 ? `0${dia}` : dia;
    }


    // Mapeia as contas por id_conta para acesso fácil
    const contasMap = {};
    accountsData.forEach(account => {
      contasMap[account.id_conta] = account.nome_conta; // Mapeia o id_conta para o nome da conta
    });

    cartoesData.forEach((cartao, index) => {
      const nomeConta = contasMap[cartao.id_conta]; // Busca o nome da conta associado ao id_conta do cartão

      const diaFechamento = cartao.dia_fechamento;
      const diaVencimento = cartao.dia_vencimento;

      const dataAtual = new Date();
      const diaAtual = dataAtual.getDate();
      let mesAtual = dataAtual.getMonth(); 
      let anoAtual = dataAtual.getFullYear();

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

      const cartaoDiv = document.createElement('div');
      cartaoDiv.classList.add('cartao');
      if (index === 0) {
        cartaoDiv.classList.add('active');
        cartaoDiv.style.transform = 'translateX(0)';
      }

      // Calcular o limite disponível
      const limiteTotal = parseFloat(cartao.limite_total);
      
      // Filtrar lançamentos relacionados ao cartão
      const lancamentosCartao = lancamentosData.filter(lancamento => lancamento.id_cartao === cartao.id_cartao);
      
      // Somar os lançamentos (todos os lançamentos são valores positivos)
      const totalLancamentos = lancamentosCartao.reduce((acc, lancamento) => acc + parseFloat(lancamento.valor), 0);
      
      // Calcular o limite disponível
      const limiteDisponivel = limiteTotal - totalLancamentos;

      cartaoDiv.innerHTML = `
        <div class="logo">
            <img src="../imagens/cartoes/${nomeConta}.jpg" alt="Cartão de ${nomeConta}">
        </div>
        <div class="infos-cartao">
            <h1> Cartão ${nomeConta}</h1>
            <h2>Limite Total: R$ ${parseFloat(cartao.limite_total).toFixed(2).replace('.', ',')}</h2>
            <h2>Disponível: R$ ${parseFloat(limiteDisponivel).toFixed(2).replace('.', ',')}</h2>
            <span class="infos-fatura">
              <p>Fechamento: ${formatarDia(diaFechamento)}/${formatarMes(mesFechamento)}/${anoAtual}</p>
              <p>Vencimento: ${formatarDia(diaVencimento)}/${formatarMes(mesVencimento)}/${anoAtual}</p>
            </span>
        </div>
      `;

      
      carouselContainer.appendChild(cartaoDiv);
    });

    const selectConta = document.getElementById('conta'); // Seleciona o select de contas

    // Loop separado para adicionar as contas ao <select>
    accountsData.forEach(account => {
      const option = document.createElement('option');
      option.value = account.id_conta; // Valor da conta
      option.text = account.nome_conta; // Nome da conta para exibir
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
      lancamentosContainer.innerHTML = ''; 
      const lancamentos = lancamentosData.filter(l => l.id_conta === accountId);

      if (lancamentos.length === 0) { 
        lancamentosContainer.innerHTML = '<z style="color: white;">Nenhum lançamento encontrado.</z>'; 
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
                <th>Conta</th>
                <th>Subcategoria</th>
                <th>Data</th>
                <th>Parcelas</th>
            </tr>
        </thead>`;
      
      let tbody = '<tbody>';

      lancamentos.forEach(lancamento => {
        tbody += `
          <tr>
              <td>${lancamento.descricao}</td>
              <td>R$ ${parseFloat(lancamento.valor).toFixed(2).replace('.', ',')}</td>
              <td>${lancamento.tipo}</td>
              <td>${lancamento.metodo_pagamento}</td>
              <td>${lancamento.nome_conta}</td>
              <td>${lancamento.subcategoria}</td>
              <td>${new Date(lancamento.data).toLocaleDateString('pt-BR')}</td>
              <td>${lancamento.parcelas}</td>
              
          </tr>`;
      });

      tbody += '</tbody>';

      table.innerHTML = thead + tbody;
      lancamentosContainer.appendChild(table);
    }

    // Renderiza os lançamentos iniciais
    renderLancamentos(accountsData[currentIndex].id_conta);
    const lancamentosFora = document.getElementById('fora-lancamentos');
    lancamentosFora.style.display = 'flex';
  })
  .catch(error => {
    console.error('Erro ao carregar os dados:', error);
  });

  });

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

// Evento de submissão do formulário para adicionar cartao

formCartao.addEventListener('submit', function (event) {
    event.preventDefault();
    const valueSelectConta = selectConta.value;
    const limiteCartao = document.getElementById('limite').value;
    const diaFechamento = document.getElementById('fechamento').value;
    const diaVencimento = document.getElementById('vencimento').value;

    if (!valueSelectConta || !limiteCartao || !diaFechamento || !diaVencimento) {
        modalErrorPreencher.style.display = 'block';
    } else {
        const formData = new FormData(formCartao);

        fetch('../Paginas/configs/add-cartao.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'error_cartao') {
                showModalError(data); // Exibe o modal com erro
            } else if (data.status === 'success') {
                handleSuccess(data);
            }
        })
        .catch(error => console.error('Erro:', error));
    }
});

// Eventos para fechar os modais
document.getElementById('btnModalAdd').addEventListener('click', function () {
    modalSucess.style.display = 'none';
    location.reload();
});

document.getElementById('btnModalCampos').addEventListener('click', function () {
    modalErrorPreencher.style.display = 'none';
});

document.getElementById('btnModalCartao').addEventListener('click', function () {
    modalErrorAdd.style.display = 'none';
});

document.getElementById('btnModalexcluirSucesso').addEventListener('click', function () {
  modalExcluirSucesso.style.display = 'none';
  location.reload();
});

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

document.getElementById('excluir-cartao').addEventListener('click', function () {
  modalExcluir.style.display = 'block';

  window.scrollTo(0, 0); // Desloca a janela para o topo quando o formulário abre

// Carregar os dados das contas
fetch('../Paginas/configs/infos-cartoes.php')
  .then(response => response.json())
  .then(data => {
    const cartoes = data.cartoes; // Acessa a lista de contas retornada da resposta
    const accountsData = data.contas; // Dados de contas

    // Mapeia as contas por id_conta para acesso fácil
    const contasMap = {};
    accountsData.forEach(account => {
      contasMap[account.id_conta] = account.nome_conta; // Mapeia o id_conta para o nome da conta
    });

    cartoes.forEach(cartao => {

      const row = document.createElement('tr');
      row.id = cartao.id_cartao;

      const nomeConta = contasMap[cartao.id_conta]; // Busca o nome da conta associado ao id_conta do cartão

      // Coluna da imagem (logo)
      const logoCell = document.createElement('td');
      const img = document.createElement('img');
      img.src = `../imagens/cartoes/${nomeConta}.jpg`; // Caminho para a imagem
      img.alt = `Logo da ${nomeConta}`;
      img.width = 100;
      img.height = 65;
      img.style.objectFit = 'cover';
      logoCell.appendChild(img);
      row.appendChild(logoCell);

      // Coluna do nome da conta
      const nomeCell = document.createElement('td');
      nomeCell.textContent = nomeConta;
      row.appendChild(nomeCell);

      // Coluna do saldo atual (formatado como moeda)
      const saldoCell = document.createElement('td');
      saldoCell.textContent = formatarSaldo(cartao.limite_total);
      row.appendChild(saldoCell);

      // Coluna para o botão de exclusão
      const acoesCell = document.createElement('td');
      const excluirBtn = document.createElement('button');
      excluirBtn.textContent = 'Excluir';
      excluirBtn.className = 'btn-excluir'; // Adicione uma classe para estilizar se necessário
      excluirBtn.addEventListener('click', () => {
        modalConfirmarExcluir.style.display = 'block';
        console.log(cartao.id_cartao, cartao.id_usuario);
        msgConfirmarExcluir.textContent = `Tem certeza de que deseja excluir o cartão ${nomeConta}?`;
        document.getElementById('btnModalexcluir').addEventListener('click', function () {
          modalConfirmarExcluir.style.display = 'none';
          excluirCartao(cartao.id_cartao, cartao.id_usuario); // Chama a função de exclusão
        });
        document.getElementById('btnModalNao').addEventListener('click', function () {
          modalConfirmarExcluir.style.display = 'none';
        });
      });
      acoesCell.appendChild(excluirBtn);
      row.appendChild(acoesCell);

      // Adiciona a linha à tabela
      tabelaBody.appendChild(row);
    });
    

  })
  .catch(error => console.error('Erro ao carregar os dados:', error));

});
// Função para excluir o cartao
function excluirCartao(id_cartao, id_usuario) {
  // Faz uma requisição para excluir a conta com os IDs fornecidos
  fetch(`../Paginas/configs/excluir-cartao.php?id_cartao=${id_cartao}&id_usuario=${id_usuario}`, {
    method: 'DELETE', // ou 'POST', dependendo do método que você usa para exclusão
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








