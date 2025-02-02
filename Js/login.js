function handleCredentialResponse(response) {
    const data = jwt_decode(response.credential);
}
window.onload = function () {
  google.accounts.id.initialize({
    client_id: "775969932336-cv0glea3ij3nkrhgt7d4u12s3kepddfd.apps.googleusercontent.com",
    callback: handleCredentialResponse
  });
  google.accounts.id.renderButton(
    document.getElementById("buttonDiv"),
    { theme: "outline", 
      size: "large",
      type: "standard",
      shape: "pill",
      text: "continue_with",
      logo_alignment: "left",
      locale: "pt-BR"
    
    }  // customization attributes
  );
  google.accounts.id.prompt(); // also display the One Tap dialog
}


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


