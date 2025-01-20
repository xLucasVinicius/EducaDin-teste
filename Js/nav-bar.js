const navbar = document.getElementById('navbar');
const navbarTop = document.getElementById('navbarTop');
const toggleBtn = document.getElementById('toggleBtn');
const logo = document.getElementById('navbar-logo');
const content = document.querySelector('.conteudo');

toggleBtn.addEventListener('click', () => {
    navbar.classList.toggle('collapsed');
    navbarTop.classList.toggle('collapsed');

    // Alterar logo quando a navbar estiver recolhida
    if (navbar.classList.contains('collapsed')) {
        logo.src = '../imagens/logos/favicon.ico'; // Altere para o caminho da logo recolhida
        content.classList.add('collapsed');
    } else {
        logo.src = '../imagens/logos/logo.png'; // Altere para o caminho da logo expandida
        content.classList.remove('collapsed');
    }
});

// Adiciona um ouvinte para o evento de redimensionamento da janela
window.addEventListener('resize', verificarLarguraTela);

function verificarLarguraTela() {
    const larguraTela = window.innerWidth;

    if (larguraTela < 850) {
        navbar.classList.add('collapsed');
        navbarTop.classList.add('collapsed');
        content.classList.add('collapsed');
        logo.src = '../imagens/logos/favicon.ico'; 
    } else {
        navbar.classList.remove('collapsed');
        navbarTop.classList.remove('collapsed');
        content.classList.remove('collapsed');
        logo.src = '../imagens/logos/logo.png';
    }
}

// Verifica a largura da tela assim que a página é carregada
verificarLarguraTela();

// Seleciona todos os links da navbar
const navLinks = document.querySelectorAll('.nav-link');

// Função para ativar o link correto após a recarga da página
function setActiveLink() {
    const currentPage = new URLSearchParams(window.location.search).get('page');
    navLinks.forEach(link => {
        if (link.getAttribute('href') === `?page=${currentPage}`) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
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


