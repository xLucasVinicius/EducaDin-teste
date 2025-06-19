const navbar = document.getElementById('navbar'); // Seleciona a navbar lateral
const navbarTop = document.getElementById('navbarTop'); // Seleciona a navbar superior
const toggleBtn = document.getElementById('toggleBtn'); // Seleciona o botão de alternar entre a navbar lateral e a navbar superior
const logo = document.getElementById('navbar-logo'); // Seleciona a logo
const content = document.querySelector('.conteudo'); // Seleciona o conteúdo

toggleBtn.addEventListener('click', () => { // Adiciona um ouvinte para o evento de clique no botão
    navbar.classList.toggle('collapsed'); // Alterna a classe "collapsed"
    navbarTop.classList.toggle('collapsed'); // Alterna a classe "collapsed"

    // Alterar logo quando a navbar estiver recolhida
    if (navbar.classList.contains('collapsed')) {
        logo.src = '../imagens/logos/moeda.png'; // Altere para o caminho da logo recolhida
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
        logo.src = '../imagens/logos/moeda.png'; // Altere para o caminho da logo recolhida
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

// Função para ativar o link correto com base no parâmetro da URL
function setActiveLink() {
    const urlParams = new URLSearchParams(window.location.search);
    const currentPage = urlParams.get('page');

    let found = false;

    if (currentPage) {
        // Verifica se algum link corresponde ao parâmetro 'page'
        navLinks.forEach(link => {
            const hrefPage = new URL(link.href).searchParams.get('page');
            if (hrefPage === currentPage) {
                link.classList.add('active');
                found = true;
            } else {
                link.classList.remove('active');
            }
        });

        // Se nenhum link corresponde ao page da URL, ativa o link de minigame
        if (!found) {
            const minigameLink = Array.from(navLinks).find(link => {
                const hrefPage = new URL(link.href).searchParams.get('page');
                return hrefPage === 'minigames';
            });

            if (minigameLink) {
                minigameLink.classList.add('active');
            }
        }

    } else {
        // Se não há parâmetro 'page', ativa o dashboard por padrão
        const dashboardLink = Array.from(navLinks).find(link => link.getAttribute('href').includes('dashboard'));
        if (dashboardLink) {
            dashboardLink.classList.add('active');
        } else if (navLinks.length > 0) {
            navLinks[0].classList.add('active');
        }
    }
}

// Verifica qual link corresponde ao link clicado
navLinks.forEach(link => {
    link.addEventListener('click', function(event) {
        event.preventDefault();
        navLinks.forEach(item => item.classList.remove('active'));
        this.classList.add('active');
        window.location.href = this.href;
    });
});

// Configura o link ativo na carga da página
window.onload = setActiveLink;

