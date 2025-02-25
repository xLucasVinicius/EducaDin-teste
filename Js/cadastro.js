document.addEventListener('DOMContentLoaded', function() {
    const profilePic = document.querySelector('#imagem-perfil');

    // Recupera a imagem recortada do localStorage
    const croppedImage = localStorage.getItem('croppedImage');

    if (croppedImage) {
        // Se houver uma imagem recortada no localStorage, atualize a preview do perfil
        profilePic.src = croppedImage;

        // Remova a imagem do localStorage após o uso, se desejar
        localStorage.removeItem('croppedImage');
    }
});

// Evento de mudança de imagem
document.querySelector('#file').addEventListener('change', function(event) {
    const file = event.target.files[0]; // Obtenha o arquivo selecionado
    const profilePic = document.querySelector('#imagem-perfil'); // Selecione a imagem de perfil

    if (file) { // Verifique se um arquivo foi selecionado
        const reader = new FileReader(); // Crie um leitor de arquivos

        reader.onload = function(e) { // Quando o arquivo for carregado
            profilePic.src = e.target.result; // Atualize a preview do perfil
        };

        reader.readAsDataURL(file); // Leia o arquivo como Data URL
    }
});

// Evento de clique no botão
document.querySelector('#btn-input1').addEventListener('click', function(event) {
    window.location.href = 'http://localhost/EducaDin-teste/index.php'; // Redireciona para a tela de login
});
