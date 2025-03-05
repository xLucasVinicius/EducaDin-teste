document.addEventListener("DOMContentLoaded", () => { // Adiciona um ouvinte para o evento de carregamento do DOM
    fetch('../Paginas/configs/infos-contas.php')
  .then(response => {
    if (!response.ok) {
      throw new Error('Erro ao carregar dados: ' + response.statusText);
    }
    return response.json();
  })
  .then(data => {
    // Aqui, alteramos de 'data.accounts' para 'data.contas', conforme o JSON retornado
    if (!Array.isArray(data.contas)) {
      throw new Error('Dados de contas inválidos ou não encontrados.');
    }

    const accountsData = data.contas; // Atribuir os dados de contas da resposta
    const lancamentosData = data.lancamentos; // Atribuir os dados de lançamentos da resposta

    const carouselContainer = document.querySelector('.contas-carrossel');
    const lancamentosContainer = document.querySelector('.lancamentos-carrossel');

    carouselContainer.innerHTML = '';
    lancamentosContainer.innerHTML = '';

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
    console.log(`slides: ${slides}`);
    let currentIndex = 0;
    const totalSlides = slides.length;
    console.log(`totalSlides: ${totalSlides}`);

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
        lancamentosContainer.innerHTML = '<tr><td colspan="7">Nenhum lançamento encontrado.</td></tr>'; 
        return;
      }

      const table = document.createElement('table');

      const thead = `
        <thead>
            <tr>
                <th>DESCRIÇÃO</th>
                <th>VALOR</th>
                <th>TIPO</th>
                <th>CATEGORIA</th>
                <th>PARCELAS</th>
                <th>DATA</th>
                <th>OPÇÕES</th>
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
              <td>${lancamento.parcelas}</td>
              <td>${new Date(lancamento.data).toLocaleDateString('pt-BR')}</td>
              <td>
                  <button id="btn-editar"><i class="bi bi-pencil"></i></button>
                  <button id="btn-excluir"><i class="bi bi-x"></i></button>
              </td>
          </tr>`;
      });

      tbody += '</tbody>';

      table.innerHTML = thead + tbody;
      lancamentosContainer.appendChild(table);
    }

    renderLancamentos(accountsData[0].id_conta);
  })
  .catch(error => {
    console.error('Erro ao carregar os dados:', error);
  });

  });

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

// Função para mostrar a imagem da conta selecionada no formulário
const selectConta = document.getElementById('conta');
const imagemContent = document.querySelector('.imagem-conta');
const imgConta = document.querySelector('.imagem-conta img');

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

// Evento de submissão do formulário para adicionar conta
const formConta = document.getElementById('form-add-conta');

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

// Modais de sucesso e erro
const modalSucess = document.querySelector('#modalAddContas');
const modalErrorAdd = document.querySelector('#errorModalAddContas');
const modalErrorPreencher = document.querySelector('#errorModalPreencher');

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

// Função para tratar o sucesso
function handleSuccess(data) {
    modalSucess.style.display = 'block';
}

// Função para mostrar modal de erro
function showModalError(data) {
    modalErrorAdd.style.display = 'block';
}




