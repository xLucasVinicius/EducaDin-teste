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