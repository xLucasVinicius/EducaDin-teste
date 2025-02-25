document.addEventListener("DOMContentLoaded", () => { // Adiciona um ouvinte para o evento de carregamento do DOM
    // Simulação dos dados retornados do banco de dados para contas e lançamentos
    const accountsData = [
        { id: 1, nome: "Nubank" },
        { id: 2, nome: "PicPay" },
        { id: 3, nome: "Mercado Pago" },
        { id: 4, nome: "Inter" },
        { id: 5, nome: "Itaú" },
        { id: 6, nome: "Santander" },
        { id: 7, nome: "Banco do Brasil" },
        { id: 8, nome: "C6 Bank" },
        { id: 9, nome: "Caixa" }
    ];

    const lancamentosData = {
        1: [
            { descricao: "Lançamento 1.1", valor: 100, tipo: "Receita", metodo_pagamento: "Dinheiro", parcelas: 1, data: "2025-02-10" },
            { descricao: "Lançamento 1.1", valor: 100, tipo: "Receita", metodo_pagamento: "Dinheiro", parcelas: 1, data: "2025-02-10" },
            { descricao: "Lançamento 1.1", valor: 100, tipo: "Receita", metodo_pagamento: "Dinheiro", parcelas: 1, data: "2025-02-10" },
            { descricao: "Lançamento 1.1", valor: 100, tipo: "Receita", metodo_pagamento: "Dinheiro", parcelas: 1, data: "2025-02-10" },
            { descricao: "Lançamento 1.1", valor: 100, tipo: "Receita", metodo_pagamento: "Dinheiro", parcelas: 1, data: "2025-02-10" },
            { descricao: "Lançamento 1.1", valor: 100, tipo: "Receita", metodo_pagamento: "Dinheiro", parcelas: 1, data: "2025-02-10" },
            { descricao: "Lançamento 1.1", valor: 100, tipo: "Receita", metodo_pagamento: "Dinheiro", parcelas: 1, data: "2025-02-10" },
            { descricao: "Lançamento 1.1", valor: 100, tipo: "Receita", metodo_pagamento: "Dinheiro", parcelas: 1, data: "2025-02-10" },
            { descricao: "Lançamento 1.1", valor: 100, tipo: "Receita", metodo_pagamento: "Dinheiro", parcelas: 1, data: "2025-02-10" },
            { descricao: "Lançamento 1.1", valor: 100, tipo: "Receita", metodo_pagamento: "Dinheiro", parcelas: 1, data: "2025-02-10" },
            { descricao: "Lançamento 1.1", valor: 100, tipo: "Receita", metodo_pagamento: "Dinheiro", parcelas: 1, data: "2025-02-10" },
            { descricao: "Lançamento 1.1", valor: 100, tipo: "Receita", metodo_pagamento: "Dinheiro", parcelas: 1, data: "2025-02-10" },
            { descricao: "Lançamento 1.1", valor: 100, tipo: "Receita", metodo_pagamento: "Dinheiro", parcelas: 1, data: "2025-02-10" },
            { descricao: "Lançamento 1.1", valor: 100, tipo: "Receita", metodo_pagamento: "Dinheiro", parcelas: 1, data: "2025-02-10" },
            { descricao: "Lançamento 1.1", valor: 100, tipo: "Receita", metodo_pagamento: "Dinheiro", parcelas: 1, data: "2025-02-10" },
            { descricao: "Lançamento 1.1", valor: 100, tipo: "Receita", metodo_pagamento: "Dinheiro", parcelas: 1, data: "2025-02-10" },
            { descricao: "Lançamento 1.2", valor: 200, tipo: "Despesa", metodo_pagamento: "Cartão", parcelas: 2, data: "2025-02-11" }
        ],
        2: [
            { descricao: "Lançamento 2.1", valor: 150, tipo: "Receita", metodo_pagamento: "Transferência", parcelas: 1, data: "2025-02-12" }
        ],
        3: [
            { descricao: "Lançamento 3.1", valor: 250, tipo: "Despesa", metodo_pagamento: "Cartão", parcelas: 3, data: "2025-02-13" }
        ],
        4: [
            { descricao: "Lançamento 4.1", valor: 300, tipo: "Receita", metodo_pagamento: "Dinheiro", parcelas: 1, data: "2025-02-14" },
            { descricao: "Lançamento 4.2", valor: 400, tipo: "Despesa", metodo_pagamento: "Boleto", parcelas: 4, data: "2025-02-15" }
        ]
    };

    // Seleciona o container do carrossel de contas e de lançamentos
    const carouselContainer = document.querySelector('.contas-carrossel');
    const lancamentosContainer = document.querySelector('.lancamentos-carrossel');

    // Limpa o conteúdo existente (se houver)
    carouselContainer.innerHTML = '';
    lancamentosContainer.innerHTML = '';

    // Cria as divs de contas dinamicamente com base nos dados
    accountsData.forEach((account, index) => {
        const contaDiv = document.createElement('div'); // Cria uma div para cada conta
        contaDiv.classList.add('conta'); // Adiciona a classe "conta"
        if (index === 0) { // Se for a primeira conta
            contaDiv.classList.add('active'); // Adiciona a classe "active"
            contaDiv.style.transform = 'translateX(0)'; // Define o transform para exibir a primeira conta
        }

        // Cria o HTML para a div da conta
        contaDiv.innerHTML = `
        <div class="logo">
            <img src="../imagens/logos/${account.nome}.png" alt="Logo ${account.nome}">
        </div>
        <div class="infos-conta">
            <h1>${account.nome}</h1>
            <h2>Saldo: R$ 1000,00</h2>
            <p>+5% ao mês anterior</p>
        </div>
        `;
        carouselContainer.appendChild(contaDiv); // Adiciona a div da conta ao container
    });

    // Função para renderizar os lançamentos em formato de tabela
    function renderLancamentos(accountId) {
        lancamentosContainer.innerHTML = ''; // Limpar lançamentos antigos
        const lancamentos = lancamentosData[accountId] || []; // Obter lançamentos da conta atual

        if (lancamentos.length === 0) { // Se nenhuma lançamento, exibir mensagem
            lancamentosContainer.innerHTML = '<tr><td colspan="7">Nenhum lançamento encontrado.</td></tr>'; 
            return;
        }

        const table = document.createElement('table'); // Cria uma tabela

        // Cria o cabeçalho da tabela
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
        
        let tbody = '<tbody>'; // Inicia o corpo da tabela

        lancamentos.forEach((lancamento) => { // Itera sobre os lançamentos

            // Cria uma linha da tabela com os dados do lançamento
            tbody += `
                <tr>
                    <td>${lancamento.descricao}</td>
                    <td>R$ ${lancamento.valor.toFixed(2).replace('.', ',')}</td>
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

        table.innerHTML = thead + tbody; // Adiciona o cabeçalho e o corpo ao HTML
        lancamentosContainer.appendChild(table); // Adiciona a tabela ao container
    }

    // Inicializa os lançamentos para a primeira conta
    renderLancamentos(accountsData[0].id);

    // Seleciona todas as slides de contas
    const slides = document.querySelectorAll('.conta');
    // Inicializa o slide atual
    let currentIndex = 0;
    // Total de slides
    const totalSlides = slides.length;

    // Função para realizar a transição entre slides
    function goToSlide(newIndex, direction = 'next') {
        if (newIndex === currentIndex) return; // Nada a fazer se for o mesmo slide

        const currentSlide = slides[currentIndex]; // Slide atual
        const nextSlide = slides[newIndex]; // Proximo slide

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
        nextSlide.style.transform = 'translateX(0)'; // Translada para a direita

        // Atualiza as classes para controle visual
        currentSlide.classList.remove('active');
        nextSlide.classList.add('active');

        currentIndex = newIndex;

        // Atualiza os lançamentos de acordo com a conta selecionada
        renderLancamentos(accountsData[newIndex].id);
    }

    // Função para aplicar efeito bounce quando não houver mudança
    function applyBounce(slide, direction) { // slide: slide que recebe o efeito, direction: direção do efeito
        slide.classList.remove('bounce-left', 'bounce-right'); // Remove os efeitos anteriores

        if (direction === 'prev') { // Aplica o efeito conforme a direção
            slide.classList.add('bounce-right');
        } else if (direction === 'next') {
            slide.classList.add('bounce-left');
        }

        setTimeout(() => { // Remove os efeitos depois de 300ms
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
            applyBounce(slides[currentIndex], 'prev');
            return;
        }
        goToSlide(currentIndex - 1, 'prev');
    });
});


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


// Função para mostrar a imagem da conta selecionada no formulário para adicionar contas
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
