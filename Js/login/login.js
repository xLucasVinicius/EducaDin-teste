document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form');
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const email = document.getElementById('email').value.trim();
        const senha = document.getElementById('senha').value.trim();
        const remember = document.getElementById('remember').checked ? 1 : 0;

        fetch('../Paginas/consultas/infos-login.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `email=${encodeURIComponent(email)}&senha=${encodeURIComponent(senha)}&remember=${remember}`
        })
        .then(res => res.json())
        .then(data => {
            if (data.status === 'banido') {
                const modal = document.getElementById('errorModalEmailBanido');
                const closeBtn = document.getElementById('closeModalBtnBanido');
                modal.style.display = 'block';
                closeBtn.addEventListener('click', () => {
                    modal.style.display = 'none';
                });
            } else if (data.status === 'success') {
                window.location.href = 'navbar.php?page=dashboard';
            } else if (data.status === 'email_error') {
                document.querySelector('.form-span.email').classList.add('error');
            } else if (data.status === 'senha_error') {
                document.querySelector('.form-span.senha').classList.add('error');
            }
        })
        .catch(err => {
            console.error('Erro na requisição:', err);
        });
    });

});



const input = document.querySelector('.error input'); // Seleciona o input
const content = document.querySelector('.error'); // Seleciona o conteúdo

// Função para alternar a visibilidade da senha
function togglePassword() { 
    var passwordInput = document.getElementById("senha"); // Seleciona o input de senha
    var toggleIcon = document.querySelector(".toggle-password"); // Seleciona o botão de alternar visibilidade

    if (passwordInput.type === "password") { // Se a senha estiver oculta
        passwordInput.type = "text"; // Alterna para visibilidade
        toggleIcon.innerHTML = '<i class="bi bi-eye-slash"></i>'; // Alterna o icone
    } else {
        passwordInput.type = "password"; // Alterna para oculta
        toggleIcon.innerHTML = '<i class="bi bi-eye"></i>'; // Alterna o icone
    }
}

// Adiciona a classe "focused" quando o input recebe foco
input.addEventListener('focus', () => {
    content.classList.add('focused'); 
});

// Adiciona a classe "focused" quando o input recebe um valor
input.addEventListener('input', () => {
    content.classList.add('focused');
});

// Remove a classe "focused" ao perder o foco, somente se o campo estiver vazio
input.addEventListener('blur', () => {
if (input.value === '') {
    content.classList.remove('focused');
}
});






