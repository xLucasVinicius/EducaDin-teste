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

document.querySelector('#file').addEventListener('change', function(event) {
    const file = event.target.files[0];
    const profilePic = document.querySelector('#imagem-perfil');

    if (file) {
        const reader = new FileReader();

        reader.onload = function(e) {
            profilePic.src = e.target.result;
        };

        reader.readAsDataURL(file);
    }
});

document.querySelector('#btn-input1').addEventListener('click', function(event) {
    window.location.href = 'http://localhost/EducaDin-teste/index.php';
});
