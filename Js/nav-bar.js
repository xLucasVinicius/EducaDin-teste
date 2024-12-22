const navbar = document.getElementById('navbar');
const toggleBtn = document.getElementById('toggleBtn');
const logo = document.getElementById('navbar-logo');
const content = document.querySelector('.conteudo');

toggleBtn.addEventListener('click', () => {
    navbar.classList.toggle('collapsed');
    navbarTop.classList.toggle('collapsed');

    // Alterar logo quando a navbar estiver recolhida
    if (navbar.classList.contains('collapsed')) {
        logo.src = '../imagens/favicon.ico'; // Altere para o caminho da logo recolhida
        content.classList.add('collapsed');
    } else {
        logo.src = '../imagens/logo.png'; // Altere para o caminho da logo expandida
        content.classList.remove('collapsed');
    }
});

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
