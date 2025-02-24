const extensoes = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
};

let cropperInstance = null;

function createButton(textContent, id) {
    const button = document.createElement('button');
    button.textContent = textContent;
    button.id = id;
    return button;
}

function crop(image) {
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

const avatarImagem = document.querySelector('#avatar-img');
const h2Avatar = document.querySelector('#h2-avatar');

avatarImagem.addEventListener('change', event => {
    const previousPreview = document.querySelector('#preview-img');
    const previousRemoveButton = document.querySelector('#remove-button');
    const previousUploadButton = document.querySelector('#upload-button');
    const previewCrop = document.querySelector('#preview-crop');

    if (cropperInstance) {
        cropperInstance.destroy();
        cropperInstance = null;
    }

    if (previousPreview) previousPreview.remove();
    if (previousRemoveButton) previousRemoveButton.remove();
    if (previousUploadButton) previousUploadButton.remove();
    if (previewCrop) previewCrop.style.display = 'none';

    const previewImg = document.createElement('img');
    const reader = new FileReader();

    reader.onload = function(event) {
        previewImg.id = 'preview-img';
        previewImg.src = event.target.result;
        h2Avatar.insertAdjacentElement('afterend', previewImg);

        cropperInstance = crop(previewImg);
        previewCrop.style.display = 'block';

        const removeButton = createButton('Remover Crop', 'remove-button');
        const uploadButton = createButton('Confirmar Imagem', 'upload-button');

        h2Avatar.insertAdjacentElement('afterend', removeButton);
        h2Avatar.insertAdjacentElement('afterend', uploadButton);

        removeButton.addEventListener('click', () => {
            cropperInstance.destroy();
            previewImg.remove();
            removeButton.remove();
            uploadButton.remove();
            previewCrop.style.display = 'none';
        });

        uploadButton.addEventListener('click', () => {
            // Obtém a imagem recortada como Data URL
            const dataUrl = cropperInstance.getCroppedCanvas().toDataURL('image/jpeg');

            // Salva a Data URL da imagem recortada no localStorage
            localStorage.setItem('croppedImage', dataUrl);

            // Redireciona para a tela de cadastro
            window.location.href = 'http://localhost:3000/EducaDin-teste/Paginas/cadastro.php'; // Altere para a URL da sua tela de cadastro
        });
    };

    reader.readAsDataURL(avatarImagem.files[0]);
});
