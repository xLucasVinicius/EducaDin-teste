const navbar = document.getElementById('navbar'); // Seleciona a navbar
const navbarTop = document.getElementById('navbarTop'); // Seleciona a navbar superior
const toggleBtn = document.getElementById('toggleBtn'); // Seleciona o botão de alternar
const logo = document.getElementById('navbar-logo'); // Seleciona a logo
const content = document.querySelector('.conteudo'); // Seleciona o conteúdo

toggleBtn.addEventListener('click', () => { // Adiciona um ouvinte para o evento de clique no botão
    navbar.classList.toggle('collapsed'); // Alterna a classe "collapsed"
    navbarTop.classList.toggle('collapsed'); // Alterna a classe "collapsed"

    // Alterar logo quando a navbar estiver recolhida
    if (navbar.classList.contains('collapsed')) {
        logo.src = '../imagens/logos/favicon.ico'; // Altere para o caminho da logo recolhida
        content.classList.add('collapsed'); // Adiciona a classe "collapsed" ao conteúdo
    } else {
        logo.src = '../imagens/logos/logo.png'; // Altere para o caminho da logo expandida
        content.classList.remove('collapsed'); // Remove a classe "collapsed" do conteúdo
    }
});

// Adiciona um ouvinte para o evento de redimensionamento da janela
window.addEventListener('resize', verificarLarguraTela);

function verificarLarguraTela() { // Função para verificar a largura da tela
    const larguraTela = window.innerWidth; // Obtem a largura da tela

    if (larguraTela < 850) { // Verifica se a largura da tela é menor que 850
        navbar.classList.add('collapsed'); // Adiciona a classe "collapsed" a navbar
        navbarTop.classList.add('collapsed'); // Adiciona a classe "collapsed" a navbar superior
        content.classList.add('collapsed'); // Adiciona a classe "collapsed" ao conteúdo
        logo.src = '../imagens/logos/favicon.ico'; // Altere para o caminho da logo recolhida
    } else {
        navbar.classList.remove('collapsed'); // Remove a classe "collapsed" da navbar
        navbarTop.classList.remove('collapsed'); // Remove a classe "collapsed" da navbar superior
        content.classList.remove('collapsed'); // Remove a classe "collapsed" do conteúdo
        logo.src = '../imagens/logos/logo.png'; // Altere para o caminho da logo expandida
    }
}

// Verifica a largura da tela assim que a página é carregada
verificarLarguraTela();

// Seleciona todos os links da navbar
const navLinks = document.querySelectorAll('.nav-link'); 

// Função para ativar o link correto após a recarga da página
function setActiveLink() {
    const currentPage = new URLSearchParams(window.location.search).get('page'); // Obtem o nome da página atual
    navLinks.forEach(link => { // Percorre todos os links
        if (link.getAttribute('href') === `?page=${currentPage}`) { // Verifica se o href do link corresponde ao nome da página atual
            link.classList.add('active'); // Adiciona a classe "active"
        } else {
            link.classList.remove('active'); // Remove a classe "active"
        }
    });
}

// Adiciona o listener de evento para cada link
navLinks.forEach(link => {
    link.addEventListener('click', function(event) {
        // Previne o comportamento padrão do link
        event.preventDefault();

        // Remove a classe "active" de todos os links
        navLinks.forEach(item => item.classList.remove('active'));

        // Adiciona a classe "active" ao link clicado
        this.classList.add('active');

        // Redireciona para a nova página
        window.location.href = this.href;
    });
});

// Configura o link ativo na carga da página
window.onload = setActiveLink;


