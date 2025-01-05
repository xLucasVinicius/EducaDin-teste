function togglePassword() {
    var passwordInput = document.getElementById("senha");
    var toggleIcon = document.querySelector(".toggle-password");

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        toggleIcon.innerHTML = '<i class="bi bi-eye-slash"></i>';
    } else {
        passwordInput.type = "password";
        toggleIcon.innerHTML = '<i class="bi bi-eye"></i>';
    }
}

const input = document.querySelector('.error>.input');
const content = document.querySelector('.error');

// Adiciona a classe "focused" quando o input recebe foco
input.addEventListener('focus', () => {
content.classList.add('focused');
});

// Remove a classe "focused" ao perder o foco, somente se o campo estiver vazio
input.addEventListener('blur', () => {
if (input.value === '') {
content.classList.remove('focused');
}
});

input.addEventListener('input', () => {
content.classList.add('focused');
});
