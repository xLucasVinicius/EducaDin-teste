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




