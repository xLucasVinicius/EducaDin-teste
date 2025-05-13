const avatarImagem = document.querySelector('#avatar-img'); // input de imagem
const h2Avatar = document.querySelector('#h2-avatar'); // h2 de avatar
const extensoes = {'image/png': 'png', 'image/jpeg': 'jpeg', 'image/jpg': 'jpg'}; // array com as extensões permitidas
const form = document.querySelector('form'); // form de envio de imagem
let cropperInstance = null; // variável para armazenar a instância do Cropper

function createButton(textContent, id) { // função para criar um botão
    const button = document.createElement('button');
    button.textContent = textContent;
    button.id = id;
    return button;
}

function crop(image) { // função para criar uma instância do Cropper
    return new Cropper(image, {
        dragMode: 'move',
        aspectRatio: 1,
        preview: '#preview-crop',
        data: {
            width: 900,
            height: 900
        }
    });
}

avatarImagem.addEventListener('change', event => { // evento de mudança de imagem
    const previousPreview = document.querySelector('#preview-img'); // preview anterior
    const previousRemoveButton = document.querySelector('#remove-button'); // botão de remover
    const previousUploadButton = document.querySelector('#upload-button'); // botão de upload
    const previewCrop = document.querySelector('#preview-crop'); // preview de recorte

    if (cropperInstance) {  // verifica se a instância do Cropper foi criada
        cropperInstance.destroy(); // destroi a instância do Cropper
        cropperInstance = null; // limpa a variável
    }

    if (previousPreview) previousPreview.remove(); // remove o preview anterior
    if (previousRemoveButton) previousRemoveButton.remove(); // remove o botão de remover
    if (previousUploadButton) previousUploadButton.remove(); // remove o botão de upload
    if (previewCrop) previewCrop.style.display = 'none'; // oculta o preview de recorte

    const previewImg = document.createElement('img'); // cria uma nova imagem
    const reader = new FileReader(); // cria um leitor de arquivos

    reader.onload = function(event) { // evento de carregamento de imagem
        previewImg.id = 'preview-img'; // id da nova imagem
        previewImg.src = event.target.result; // src da nova imagem
        form.insertAdjacentElement('afterend', previewImg); // insere a nova imagem

        cropperInstance = crop(previewImg); // cria uma instância do Cropper
        previewCrop.style.display = 'block'; // mostra o preview de recorte

        const removeButton = createButton('Remover', 'remove-button'); // cria o botão de remover
        const uploadButton = createButton('Enviar', 'upload-button'); // cria o botão de upload

        previewImg.insertAdjacentElement('afterend', removeButton); // insere o botão de remover
        previewImg.insertAdjacentElement('afterend', uploadButton); // insere o botão de upload

        removeButton.addEventListener('click', () => { // evento de clique no botão de remover
            cropperInstance.destroy(); // destroi a instância do Cropper
            previewImg.remove(); // remove a imagem
            removeButton.remove(); // remove o botão
            uploadButton.remove(); // remove o botão
            previewCrop.style.display = 'none'; // oculta o preview de recorte
        });

        uploadButton.addEventListener('click', () => { // evento de clique no botão de upload
            const dataUrl = cropperInstance.getCroppedCanvas().toDataURL('image/jpeg'); // Obtém a imagem recortada como Data URL
            localStorage.setItem('croppedImage', dataUrl); // Salva a Data URL da imagem recortada no localStorage
            history.back(); // Volta para a tela anterior
        });
    };
    reader.readAsDataURL(avatarImagem.files[0]); // leitura da imagem
});
