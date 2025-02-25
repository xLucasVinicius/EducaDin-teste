function handleCredentialResponse(response) { // É carregado quando o botão de login do Google for clicado
    const data = jwt_decode(response.credential); // Decodifica o token JWT
}
window.onload = function () { // É carregado quando a página for carregada
  google.accounts.id.initialize({ // Inicializa o botão de login do Google
    client_id: "775969932336-cv0glea3ij3nkrhgt7d4u12s3kepddfd.apps.googleusercontent.com", // ID do aplicativo do Google
    callback: handleCredentialResponse // Função que é carregada quando o botão de login do Google for clicado
  });
  google.accounts.id.renderButton( // Renderiza o botão de login do Google
    document.getElementById("buttonDiv"), // Elemento onde o botão de login do Google será renderizado

    { theme: "outline", // atributos de personalização
      size: "large",
      type: "standard",
      shape: "pill",
      text: "continue_with",
      logo_alignment: "left",
      locale: "pt-BR"
    
    }
  );
  google.accounts.id.prompt(); // Mostra o botão de login do Google
}


function togglePassword() { // Função para alternar a visibilidade da senha
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

const input = document.querySelector('.error>.input'); // Seleciona o input
const content = document.querySelector('.error'); // Seleciona o conteúdo

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

// Adiciona a classe "focused" quando o input recebe um valor
input.addEventListener('input', () => {
content.classList.add('focused');
});


