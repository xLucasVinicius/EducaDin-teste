document.querySelector('#file').addEventListener('change', function(event) {
    const file = event.target.files[0];
    const profilePic = document.querySelector('#imagem-perfil');

    if (file) {
        const reader = new FileReader();
        
        // Quando a imagem é carregada, a URL é gerada e exibida
        reader.onload = function(e) {
            profilePic.src = e.target.result; // Atualiza a imagem
        };
        
        reader.readAsDataURL(file); // Converte o arquivo para uma URL
    }
});

document.querySelector('#btn-input1').addEventListener('click', function(event){
    window.location.href = 'http://localhost/EducaDin/Paginas/index.php'; 
});