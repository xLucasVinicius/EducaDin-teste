document.addEventListener("DOMContentLoaded", () => { // Adiciona um ouvinte para o evento de carregamento do DOM
  fetch('../Paginas/configs/infos-contas.php')
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
    
    const accountsData = data.contas; // Atribuir os dados de contas da resposta
    const lancamentosData = data.lancamentos; // Atribuir os dados de lançamentos da resposta
    localStorage.setItem('accountsData', JSON.stringify(accountsData));

    const carouselContainer = document.querySelector('.contas-carrossel');
    const lancamentosContainer = document.querySelector('.lancamentos');



    carouselContainer.innerHTML = '';
    lancamentosContainer.innerHTML = '';

      
    if (accountsData.length === 0) { 
      carouselContainer.innerHTML = '<z style="color: white;">Nenhuma conta encontrada.</z>';
    }

    if (lancamentosData.length === 0) {
      lancamentosContainer.innerHTML = '<z style="color: white;">Nenhum lançamento encontrado.</z>';
    }


    accountsData.forEach((account, index) => {
      const contaDiv = document.createElement('div');
      contaDiv.classList.add('conta');
      if (index === 0) {
        contaDiv.classList.add('active');
        contaDiv.style.transform = 'translateX(0)';
      }

      contaDiv.innerHTML = `
        <div class="logo">
            <img src="../imagens/logos/${account.nome_conta}.png" alt="Logo ${account.nome_conta}">
        </div>
        <div class="infos-conta">
            <h1>${account.nome_conta}</h1>
            <h2>Saldo: R$ ${parseFloat(account.saldo_atual).toFixed(2).replace('.', ',')}</h2>
            <p>+5% ao mês anterior</p>
        </div>
        `;
      carouselContainer.appendChild(contaDiv);
    });

    // Seleciona todas as slides de contas após a criação dinâmica
    const slides = document.querySelectorAll('.conta');
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
        lancamentosContainer.innerHTML = '<z style="color: white; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">Nenhum lançamento encontrado.</z>'; 
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
    lancamentosFora.style.display = 'block';
  })
  .catch(error => {
    console.error('Erro ao carregar os dados:', error);
  });

  });

  const body = document.querySelector('body');
const selectConta = document.getElementById('conta'); //select de conta do formulário de adicionar conta
const imagemContent = document.querySelector('.imagem-conta'); //div da imagem da conta
const imgConta = document.querySelector('.imagem-conta img'); //imagem da conta
const formConta = document.getElementById('form-add-conta'); //formulário de adicionar conta
const modalExcluir = document.getElementById('ModalexcluirContas'); //modal de excluir conta
const modalExcluirSucesso = document.getElementById('modalexcluirSucesso'); //modal de sucesso ao excluir conta
const modalSucess = document.querySelector('#modalAddContas'); //modal de sucesso ao adicionar conta
const modalErrorAdd = document.querySelector('#errorModalAddContas'); //modal de erro ao adicionar conta
const modalErrorPreencher = document.querySelector('#errorModalPreencher'); //modal de erro para preencher campos
const modalConfirmarExcluir = document.querySelector('#modalConfirmarExcluir'); //modal de confirmação de exclusão de conta
const msgConfirmarExcluir = document.querySelector('#modalConfirmarExcluir h2'); //mensagem de confirmação de exclusão de conta
const tabelaBody = document.getElementById('contas-tabela-body'); //tabela de contas para excluir

// Função para mostrar a imagem da conta selecionada no formulário
function mostrarImagem() {
    const valueSelect = selectConta.value;
    if (valueSelect) {
        imagemContent.style.display = 'block';
        imgConta.src = `../imagens/logos/${valueSelect}.png`;
    } else {
        imagemContent.style.display = 'none';
        imgConta.src = '';
    }
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

// Evento de submissão do formulário para adicionar conta

formConta.addEventListener('submit', function (event) {
    event.preventDefault();
    const valueSelect = selectConta.value;
    const saldoInicial = document.getElementById('saldo').value;

    if (!valueSelect || !saldoInicial || saldoInicial <= 0) {
        modalErrorPreencher.style.display = 'block';
    } else {
        const formData = new FormData(formConta);

        fetch('../Paginas/configs/add-conta.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'error_conta') {
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

document.getElementById('btnModalConta').addEventListener('click', function () {
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

document.getElementById('excluir-conta').addEventListener('click', function () {
  modalExcluir.style.display = 'block';

  window.scrollTo(0, 0); // Desloca a janela para o topo quando o formulário abre

// Carregar os dados das contas
fetch('../Paginas/configs/infos-contas.php')
  .then(response => response.json())
  .then(data => {
    const contas = data.contas; // Acessa a lista de contas retornada da resposta

    contas.forEach(conta => {
        const row = document.createElement('tr');
        row.id = conta.id_conta;

        // Coluna da imagem (logo)
        const logoCell = document.createElement('td');
        const img = document.createElement('img');
        img.src = `../imagens/logos/${conta.nome_conta}.png`; // Caminho para a imagem
        img.alt = `Logo da ${conta.nome_conta}`;
        img.width = 50;
        img.height = 50;
        img.style.borderRadius = '50%';
        img.style.objectFit = 'cover';
        logoCell.appendChild(img);
        row.appendChild(logoCell);

        // Coluna do nome da conta
        const nomeCell = document.createElement('td');
        nomeCell.textContent = conta.nome_conta;
        row.appendChild(nomeCell);

        // Coluna do saldo atual (formatado como moeda)
        const saldoCell = document.createElement('td');
        saldoCell.textContent = formatarSaldo(conta.saldo_atual);
        row.appendChild(saldoCell);

        // Coluna para o botão de exclusão
        const acoesCell = document.createElement('td');
        const excluirBtn = document.createElement('button');
        excluirBtn.textContent = 'Excluir';
        excluirBtn.className = 'btn-excluir'; // Adicione uma classe para estilizar se necessário
        excluirBtn.addEventListener('click', () => {
          modalConfirmarExcluir.style.display = 'block';
          msgConfirmarExcluir.textContent = `Tem certeza de que deseja excluir a conta ${conta.nome_conta}?`;
          document.getElementById('btnModalexcluir').addEventListener('click', function () {
            modalConfirmarExcluir.style.display = 'none';
            excluirConta(conta.id_conta, conta.id_usuario); // Chama a função de exclusão
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
// Função para excluir a conta
function excluirConta(id_conta, id_usuario) {
  // Faz uma requisição para excluir a conta com os IDs fornecidos
  fetch(`../Paginas/configs/excluir-conta.php?id_conta=${id_conta}&id_usuario=${id_usuario}`, {
    method: 'DELETE', // ou 'POST', dependendo do método que você usa para exclusão
  })
  .then(response => response.json())
  .then(result => {
    if (result.sucesso) {
      modalExcluirSucesso.style.display = 'block';
      //modalExcluir.style.display = 'none';
    } else {
      console.error('Erro ao excluir a conta:', result);
    }
  })
  .catch(error => console.error('Erro ao excluir a conta:', error));
}








