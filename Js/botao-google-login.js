function handleCredentialResponse(response) {
    const data = jwt_decode(response.credential); // Decodifica o token JWT

    // Extraindo as informações do usuário
    const nome = data.given_name;
    const sobrenome = data.family_name || '';
    const email = data.email;
    const foto_perfil = data.picture;
    const data_nascimento = data.birthday || '';
    const salario = '';

    // Enviar os dados para o backend
    fetch('../Paginas/configs/usuario-google.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            nome: nome,
            sobrenome: sobrenome,
            email: email,
            foto_perfil: foto_perfil,
            salario: salario,
            data_nascimento: data_nascimento
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            window.location.href = '?page=dashboard'; // Redireciona para o dashboard
        } else if (data.status === 'error_email') {
            window.location.href = '?page=dashboard'; // Caso o email já exista
        } else {
            //outro erro
        }
    })
    .catch(error => console.error('Erro:', error));
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