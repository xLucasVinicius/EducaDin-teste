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
const containerForm = document.querySelector('.add-contas'); // Seleciona o container do formulário
const conteudoGeral = document.querySelector('.conteudo'); // Seleciona o body geral
const btnAddConta = document.getElementById('adicionar-conta-icon'); // Seleciona o botão de adicionar conta

document.addEventListener("DOMContentLoaded", () => { // Adiciona um ouvinte para o evento de carregamento do DOM
  fetch('../Paginas/consultas/infos-contas.php')
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
    localStorage.setItem('accountsData', JSON.stringify(accountsData)); // Armazena os dados de contas no localStorage
    const carouselContainer = document.querySelector('.contas-carrossel'); // Carrossel de contas
    const lancamentosContainer = document.querySelector('.lancamentos'); // Container de lançamentos

    carouselContainer.innerHTML = ''; // Limpa o carrossel
    lancamentosContainer.innerHTML = ''; // Limpa o container de lançamentos
      
    if (accountsData.length === 0) { // Se nenhuma conta for encontrada
      carouselContainer.innerHTML = '<z style="color: white;">Nenhuma conta encontrada.</z>';
    }

    if (lancamentosData.length === 0) { // Se nenhum lançamento for encontrada
      lancamentosContainer.innerHTML = '<z style="color: white;">Nenhum lançamento encontrado.</z>';
    }

    // Cria as contas dinamicamente
    accountsData.forEach((account, index) => {
      const tipoContaMap = {
        0: 'Conta Corrente',
        1: 'Conta Poupança',
        2: 'Conta Salário'
      };
    
      const tipoConta = tipoContaMap[account.categoria] || 'Tipo de conta desconhecido';
      const contaDiv = document.createElement('div');
      contaDiv.classList.add('conta');
      if (index === 0) {
        contaDiv.classList.add('active');
        contaDiv.style.transform = 'translateX(0)';
      }
    
      // HTML da conta com <p> para desempenho
      contaDiv.innerHTML = `
        <div class="logo">
          <img src="../imagens/logos/${account.nome_conta}.png" alt="Logo ${account.nome_conta}">
        </div>
        <div class="infos-conta">
          <h1>${account.nome_conta}</h1>
          <h2 id="tipo-conta">${tipoConta}</h2>
          <h2>Saldo: R$ ${parseFloat(account.saldo_atual).toFixed(2).replace('.', ',')}</h2>
          <p><span id="desempenho-${account.id_conta}"></span>ao mês anterior</p>
        </div>
      `;
    
      // Adiciona a conta ao carrossel
      carouselContainer.appendChild(contaDiv);
    
      // Faz a requisição do desempenho ANUAL dessa conta
      fetch(`../Paginas/consultas/infos-desempenho-anual.php?id_conta=${account.id_conta}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro ao carregar desempenho: ' + response.statusText);
        }
        return response.json();
      })
      .then(dados => {
        const p = document.getElementById(`desempenho-${account.id_conta}`);

        const receitasAnterior = parseFloat(dados.total_receitas_anterior) || 0;
        const despesasAnterior = parseFloat(dados.total_despesas_anterior) || 0;
        const receitasAtual = parseFloat(dados.total_receitas_atual) || 0;
        const despesasAtual = parseFloat(dados.total_despesas_atual) || 0;

        const saldoAnterior = receitasAnterior - despesasAnterior;
        const saldoAtual = receitasAtual - despesasAtual;

        let desempenho;

        if (saldoAnterior === 0) {
          if (saldoAtual > 0) {
            desempenho = 100;
          } else if (saldoAtual < 0) {
            desempenho = -100;
          } else {
            desempenho = 0;
          }
        } else {
          desempenho = ((saldoAtual - saldoAnterior) / Math.abs(saldoAnterior)) * 100;
        }

        const desempenhoFormatado = desempenho.toFixed(2).replace('.', ',');

        if (desempenho >= 0) {
          p.textContent = `+${desempenhoFormatado}% `;
          p.style.color = 'green';
        } else if (desempenho < 0) {
          p.textContent = `-${desempenhoFormatado}% `;
          p.style.color = 'red';
        }
      })
      .catch(error => {
        const p = document.getElementById(`desempenho-${account.id_conta}`);
        p.textContent = 'Erro ao carregar desempenho';
        console.error(error);
      });
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
      lancamentosContainer.innerHTML = '';  // Limpa o container de lançamentos
      const lancamentos = lancamentosData.filter(l => l.id_conta === accountId); // Filtra os lançamentos da conta selecionada

      if (lancamentos.length === 0) { // Se nenhum lançamento for encontrado
        lancamentosContainer.innerHTML = '<z style="color: white; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">Nenhum lançamento encontrado.</z>'; 
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
                <th>Categoria</th>
                <th>Subcategoria</th>
                <th>Data</th>
            </tr>
        </thead>`;
      
      // Cria as linhas da tabela
      let tbody = '<tbody>';

      // Cria as linhas da tabela
      lancamentos.forEach(lancamento => {
        let lancamentoTipo = parseInt(lancamento.tipo) === 1 ? 'Despesa' : 'Receita';
        let classeValor = lancamentoTipo === 'Despesa' ? 'despesa' : 'receita';

        tbody += `
          <tr>
              <td>${lancamento.descricao}</td>
              <td>R$ ${parseFloat(lancamento.valor).toFixed(2).replace('.', ',')}</td>
              <td class="${classeValor}">${lancamentoTipo}</td>
              <td>${lancamento.metodo_pagamento}</td>
              <td>${lancamento.categoria}</td>
              <td>${lancamento.subcategoria}</td>
              <td>${new Date(lancamento.data).toLocaleDateString('pt-BR')}</td>
          </tr>`;
      });

      // Finaliza o corpo da tabela
      tbody += '</tbody>';

      table.innerHTML = thead + tbody; // Insere o cabeçalho e o corpo na tabela
      lancamentosContainer.appendChild(table); // Adiciona a tabela ao container
    }

    // Renderiza os lançamentos iniciais
    renderLancamentos(accountsData[currentIndex].id_conta);
    const lancamentosFora = document.getElementById('fora-lancamentos'); // Seleciona o container de lançamentos
    lancamentosFora.style.display = 'block'; // Exibe o container de lançamentos
  })
  .catch(error => {
    console.error('Erro ao carregar os dados:', error);
  });
});

// Evento de submissão do formulário para adicionar conta
formConta.addEventListener('submit', function (event) {
    event.preventDefault();
    const valueSelect = selectConta.value; // Obtenha a conta selecionada
    const saldoInicial = document.getElementById('saldo').value; // Obtenha o saldo inicial
    const tipoContaRadio = document.getElementsByName('tipo');

    let tipoContaSelecionado = false;

    tipoContaRadio.forEach((radio) => {
      if (radio.checked) {
        tipoContaSelecionado = true;
      }
    });

    if (!valueSelect || !saldoInicial || saldoInicial <= 0 || !tipoContaSelecionado) { // Verifique se todos os campos foram preenchidos
        modalErrorPreencher.style.display = 'block'; // Exiba o modal de erro de preenchimento de campos
    } else {
        const formData = new FormData(formConta); // Cria o objeto FormData com o conteúdo do formulário

        fetch('../Paginas/configs/add-conta.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'error_conta') {
                showModalError(data); // Exibe o modal com erro
            } else if (data.status === 'success') {
                handleSuccess(data); // Exibe o modal de sucesso
            }
        })
        .catch(error => console.error('Erro:', error));
    }
});

// Eventos para fechar o modal de sucesso ao adicionar conta
document.getElementById('btnModalAdd').addEventListener('click', function () {
    modalSucess.style.display = 'none';
    location.reload();
});

// Evento para fechar o modal de erro de preenchimento de campos
document.getElementById('btnModalCampos').addEventListener('click', function () {
    modalErrorPreencher.style.display = 'none';
});

// Evento para fechar o modal de erro de conta existente
document.getElementById('btnModalConta').addEventListener('click', function () {
    modalErrorAdd.style.display = 'none';
});

// Evento para fechar o modal de sucesso
document.getElementById('btnModalexcluirSucesso').addEventListener('click', function () {
  modalExcluirSucesso.style.display = 'none';
  location.reload();
});

// Evento para cancelar a exclusão
document.getElementById('fecharModalExcluir').addEventListener('click', function () {
  modalExcluir.style.display = 'none';
  location.reload();
});

document.getElementById('excluir-conta').addEventListener('click', function () {
  const bodyGeral = document.querySelector('.conteudo'); // Seleciona o body geral
  const elementoFora = document.querySelector('.elemento-fora'); // Seleciona o elemento fora dos lancamentos
  bodyGeral.style = ' overflow-y: initial;';  // Desativa a rolagem vertical
  window.scrollTo(0, 0); // Desloca a janela para o topo quando o formulário abre
  elementoFora.style = 'overflow: hidden; height: 100%;'; // Desativa a rolagem horizontal
  modalExcluir.style.display = 'block'; // Exibe o modal
  containerForm.style.display = 'none'; // Oculta o formulário

// Carregar os dados das contas
fetch('../Paginas/consultas/infos-contas.php')
  .then(response => response.json())
  .then(data => {
    const contas = data.contas; // Acessa a lista de contas retornada da resposta

    contas.forEach(conta => {
      const tipoContaMap = {
        0: 'C',
        1: 'P',
        2: 'S'
      };
    
      const tipoConta = tipoContaMap[conta.categoria];
      const row = document.createElement('tr'); // Cria uma nova linha
      row.id = conta.id_conta; // Define o ID da linha como o ID da conta

      // Coluna da imagem (logo)
      const logoCell = document.createElement('td');
      const img = document.createElement('img');
      img.src = `../imagens/logos/${conta.nome_conta}.png`; // Caminho para a imagem
      img.alt = `Logo da ${conta.nome_conta}`; // Texto alternativo
      img.width = 50; // Largura da imagem
      img.height = 50; // Altura da imagem
      img.style.borderRadius = '50%'; // Borda arredondada
      img.style.objectFit = 'cover'; // Ajusta a imagem para cobrir o conteúdo
      logoCell.appendChild(img); // Adiciona a imagem à celula
      row.appendChild(logoCell); // Adiciona a celula à linha

      // Coluna do nome da conta
      const nomeCell = document.createElement('td');
      nomeCell.textContent = conta.nome_conta;
      row.appendChild(nomeCell);

      // Coluna com o tipo de conta
      const tipoCell = document.createElement('td');
      tipoCell.textContent = tipoConta;
      row.appendChild(tipoCell);

      // Coluna do saldo atual (formatado como moeda)
      const saldoCell = document.createElement('td');
      saldoCell.textContent = formatarSaldo(conta.saldo_atual);
      row.appendChild(saldoCell);

      // Coluna para o botão de exclusão
      const acoesCell = document.createElement('td');
      const excluirBtn = document.createElement('button');
      excluirBtn.textContent = 'Excluir'; // Texto do botão
      excluirBtn.className = 'btn-excluir'; // Adicione uma classe para estilizar se necessário
      
      // Exibe o modal de exclusão ao clicar no botão de excluir
      excluirBtn.addEventListener('click', () => {
        modalConfirmarExcluir.style.display = 'block'; // Abre o modal
        msgConfirmarExcluir.textContent = `Tem certeza de que deseja excluir a conta ${conta.nome_conta}?`; // Define o texto do modal
        
        // Confirma a exclusão ao clicar no botão "Sim"
        document.getElementById('btnModalexcluir').addEventListener('click', function () {
          modalConfirmarExcluir.style.display = 'none'; // Fecha o modal
          excluirConta(conta.id_conta, conta.id_usuario); // Chama a função de exclusão
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

window.addEventListener('resize', formularioContas);

window.addEventListener('load', formularioContas);

btnAddConta.addEventListener('click', function () {
  containerForm.style.display = 'flex';
  conteudoGeral.style = ' overflow: hidden;';
});

document.getElementById('fecharForm').addEventListener('click', function () {
  containerForm.style.display = 'none';
  conteudoGeral.style = ' overflow-y: initial;';
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

// Função para mostrar a imagem da conta selecionada no formulário
function mostrarImagem() {
  const valueSelect = selectConta.value; // Obtenha a conta selecionada
  if (valueSelect) {
      imagemContent.style.display = 'block'; // Exibe a imagem
      imgConta.src = `../imagens/logos/${valueSelect}.png`; // Define o caminho da imagem
  } else {
      imagemContent.style.display = 'none'; // Oculta a imagem
      imgConta.src = ''; // Limpa o caminho da imagem
  }
}

// Função para excluir a conta
function excluirConta(id_conta, id_usuario) {
  // Faz uma requisição para excluir a conta com os IDs fornecidos
  fetch(`../Paginas/configs/excluir-conta.php?id_conta=${id_conta}&id_usuario=${id_usuario}`, {
    method: 'DELETE',
  })
  .then(response => response.json())
  .then(result => {
    if (result.sucesso) {
      modalExcluirSucesso.style.display = 'block'; // Exibe o modal de sucesso ao excluir
    } else {
      console.error('Erro ao excluir a conta:', result);
    }
  })
  .catch(error => console.error('Erro ao excluir a conta:', error));
}

// Função para exibir ou ocultar form de adicionar contas
function formularioContas() { 
  const larguraTela = window.innerWidth; // Obtem a largura da tela

  if (larguraTela <= 1560) { // Verifica se a largura da tela é menor que 1560
    containerForm.classList.add('collapsed'); // Adiciona a classe "collapsed"
    btnAddConta.style.display = 'flex';
  } else {
    containerForm.classList.remove('collapsed'); // Remove a classe "collapsed"
    btnAddConta.style.display = 'none';
    containerForm.style = 'opacity: 1;';
  }
}








