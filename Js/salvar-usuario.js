const form = document.querySelector('#form-salvar-usuario');  // Captura o formulário
const errorIcon = '<i class="bi bi-exclamation-circle"></i>';  // Icone de erro

form.addEventListener('submit', function (e) {
    e.preventDefault();  // Impede o envio do formulário inicialmente

    let isFormValid = true;  // Variável para verificar se o formulário é válido

    // Defina as regras de validação para cada campo
    const fields = [
        {
            id: 'nome',
            label: 'Nome',
            validator: nameIsValid
        },
        {
            id: 'sobrenome',
            label: 'Sobrenome',
            validator: nameIsValid
        },
        {
            id: 'email',
            label: 'Email',
            validator: emailIsValid
        },
        {
            id: 'senha',
            label: 'Senha',
            validator: passwordIsSecure
        },
        {
            id: 'confirmar-senha',
            label: 'Confirmar Senha',
            validator: passwordMatch
        },
        {
            id: 'data-nasc',
            label: 'Data de Nascimento',
            validator: dataIsValid
        },
        {
            id: 'salario',
            label: 'Salário',
            validator: salaryIsValid
        }
    ];

    fields.forEach(function (field) { // Verifica cada campo
        const input = document.getElementById(field.id); // Captura o input
        const inputBox = input.closest('.input-box'); // Captura o input-box
        const inputValue = input.value; // Captura o valor
        const errorSpan = inputBox.querySelector('.error'); // Captura o span que mostra o erro
        errorSpan.innerHTML = ''; // Limpa o span

        inputBox.classList.remove('invalid'); // Remove a classe de erro
        inputBox.classList.add('valid'); // Adiciona a classe de sucesso

        const fieldValidator = field.validator(inputValue); // Valida o campo

        if (fieldValidator && !fieldValidator.isValid) { // Se o campo for inválido
            errorSpan.innerHTML = `${errorIcon} ${fieldValidator.errorMessage}`; // atribui o texto de erro ao span
            inputBox.classList.add('invalid'); // Adiciona a classe de erro
            inputBox.classList.remove('valid'); // Remove a classe de sucesso
            isFormValid = false;  // Marca o formulário como inválido
        }
    });
    
    // Verifica se o formulário é valido
    if (isFormValid) {
        localStorage.removeItem('croppedImage'); // Remove a imagem recortada do localStorage
        // Envio via AJAX
        const formData = new FormData(form); // Cria o objeto FormData com o conteúdo do formulário
        fetch('../Paginas/configs/salvar-usuario.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => handleSuccess(data)) // Chama a função de sucesso
        .catch(error => console.error('Erro:', error));
    }
});


// Função de verificação de campo vazio
function isEmpty(value) {
    return value === '';
}

// Função para validar o nome
function nameIsValid(value) {
    const validator = { // Objeto para armazenar o resultado da validação
        isValid: true,
        errorMessage: null
    };

    if (isEmpty(value)) { // Verifica se o campo está vazio
        validator.isValid = false;
        validator.errorMessage = 'Insira um nome';
        return validator;
    }

    const min = 3; // Define o mínimo de caracteres

    if (value.length < min) { // Verifica se o nome cumpre o requisito mínimo de caracteres
        validator.isValid = false;
        validator.errorMessage = `Insira pelo menos ${min} caracteres`;
        return validator;
    }

    // Expressão regular para validar apenas letras
    const regex = /^[A-Za-z\s]+$/;

    if (!regex.test(value)) { // Verifica se o nome contém apenas letras
        validator.isValid = false;
        validator.errorMessage = 'Insira apenas letras';
        return validator;
    }

    return validator; // Retorna o resultado da validação
}

// Função para validar o email
function emailIsValid(value) {
    const validator = { // Objeto para armazenar o resultado da validação
        isValid: true,
        errorMessage: null
    };

    // Expressão regular para validar o email
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!regex.test(value)) { // Verifica se o email é valido
        validator.isValid = false;
        validator.errorMessage = 'Insira um email válido';
    }

    return validator; // Retorna o resultado da validação
}

// Função para validar a data
function dataIsValid(value) {
    const validator = { // Objeto para armazenar o resultado da validação
        isValid: true,
        errorMessage: null
    };

    // Verifica se o campo está vazio
    if (isEmpty(value)) {
        validator.isValid = false;
        validator.errorMessage = 'Insira uma data de nascimento';
        return validator;
    }

    const inputDate = new Date(value); // Converte a data para um objeto Date
    const today = new Date(); // Obtenha a data atual

    // Verifica se a data é válida
    if (isNaN(inputDate.getTime())) {
        validator.isValid = false;
        validator.errorMessage = 'Data de nascimento inválida';
        return validator;
    }

    // Verifica se a data de nascimento não é no futuro
    if (inputDate > today) {
        validator.isValid = false;
        validator.errorMessage = 'A data de nascimento não pode ser no futuro';
        return validator;
    }

    return validator; // Retorna o resultado da validação
}

// Função para validar se a senha é forte
function passwordIsSecure(value) {
    const validator = { // Objeto para armazenar o resultado da validação
        isValid: true,
        errorMessage: null
    };

    // Verifica se o campo está vazio
    if (isEmpty(value)) {
        validator.isValid = false;
        validator.errorMessage = 'Insira uma senha';
        return validator;
    }

    // Expressão regular para senha forte
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!regex.test(value)) { // Verifica se a senha atende aos requisitos
        validator.isValid = false;
        // Mantemos a mensagem HTML
        validator.errorMessage = `
            Sua senha precisa ter pelo menos:
            <br>- 8 caracteres 
            <br>- Uma letra maiúscula 
            <br>- Uma letra minúscula 
            <br>- Um número 
            <br>- E um caractere especial.
        `;
        return validator; // Retorna o resultado da validação
    }
    return validator; // Retorna o resultado da validação
}

// Função para validar se o campo de confirmação de senha é igual ao de senha
function passwordMatch(value) {
    const validator = { // Objeto para armazenar o resultado da validação
        isValid: true,
        errorMessage: null
    };

    const passwordValue = document.getElementById('senha').value; // Obtenha o valor do campo de senha

    if (value === '' || passwordValue !== value) { // Verifique se os valores são iguais
        validator.isValid = false;
        validator.errorMessage = 'As senhas devem ser iguais';
    }

    return validator; // Retorna o resultado da validação
}

// Função para validar o campo de salário
function salaryIsValid(value) {
    const validator = { // Objeto para armazenar o resultado da validação
        isValid: true,
        errorMessage: null
    };

    // Remove os símbolos de formatação para validar apenas números
    const cleanedValue = value.replace(/\D/g, '');

    if (isEmpty(cleanedValue)) { // Verifica se o campo está vazio
        validator.isValid = false; 
        validator.errorMessage = 'Insira seu salário';
        return validator;
    }

    // Verifica se o salário é um número válido (mínimo de 3 dígitos para um valor razoável)
    if (cleanedValue.length < 3) {
        validator.isValid = false;
        validator.errorMessage = 'Insira um valor de salário válido';
        return validator;
    }

    return validator; // Retorna o resultado da validação
}

// Função para alternar a visibilidade da senha e confirmar senha
function mostrarSenha() {
    // captura o input e o icone
    var senhaInput = document.getElementById("senha");
    var senhaIcon = document.getElementById("senha-icon");

    if (senhaInput.type === "password") { // se o input estiver oculto
        senhaInput.type = "text"; // alterna para exibir a senha
        senhaIcon.classList.remove("bi-eye"); // remove o icone de ocultar senha
        senhaIcon.classList.add("bi-eye-slash"); // adiciona o icone de senha visivel
    } else {
        senhaInput.type = "password"; // alterna o input para ocultar a senha
        senhaIcon.classList.remove("bi-eye-slash"); // remove o icone de senha visivel
        senhaIcon.classList.add("bi-eye"); // adiciona o icone de ocultar senha
    }
}
function mostrarConfirmarSenha() {
    // captura o input e o icone
    var confirmarSenhaInput = document.getElementById("confirmar-senha");
    var confirmarSenhaIcon = document.getElementById("confirmarsenha-icon");

    if (confirmarSenhaInput.type === "password") { // se o input estiver oculto
        confirmarSenhaInput.type = "text"; // alterna para exibir a senha
        confirmarSenhaIcon.classList.remove("bi-eye"); // remove o icone de ocultar senha
        confirmarSenhaIcon.classList.add("bi-eye-slash"); // adiciona o icone de senha visivel
    } else {
        confirmarSenhaInput.type = "password"; // alterna o input para ocultar a senha
        confirmarSenhaIcon.classList.remove("bi-eye-slash"); // remove o icone de senha visivel
        confirmarSenhaIcon.classList.add("bi-eye"); // adiciona o icone de ocultar senha
    }
}

function handleSuccess(response) {
    var modal = document.getElementById("successModal"); // Modal de sucesso
    var closeModalBtn = document.getElementById("closeModalBtn"); // Botão para fechar o modal

    // Mostrar o modal se a resposta for de sucesso
    if (response.status === 'success') {
        modal.style.display = "block";
    }

    // Quando o usuário clicar no botão, redireciona para a página inicial
    closeModalBtn.onclick = function() {
        window.location.href = "../index.html";
    };
}

// Formatação automática do campo salário
document.getElementById('salario').addEventListener('input', function (e) {
    let value = e.target.value.replace(/\D/g, ''); // Remove qualquer caractere que não seja número
    value = (value / 100).toFixed(2).replace('.', ','); // Adiciona a vírgula para separação de centavos
    value = value.replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // Adiciona pontos para milhares
    e.target.value = `R$ ${value}`; // Adiciona o símbolo R$
});

// Evento de envio do formulário
document.querySelector('#form-salvar-usuario').addEventListener('submit', function (e) {
    const base64ImageInput = document.querySelector('#base64-image'); // Campo oculto para armazenar a imagem
    const croppedImage = localStorage.getItem('croppedImage'); // Recupera a imagem recortada

    if (croppedImage) {
        // Se houver uma imagem, enviamos ela em base64
        base64ImageInput.value = croppedImage;
    } else {
        // Caso contrário, enviamos o valor padrão
        base64ImageInput.value = '';
    }
});

// Evento de clique no botão de cancelar
document.querySelector('#btn-cancelar').addEventListener('click', function () {
    window.location.href = "navbar.php?page=dashboard";
});

// Função para atualizar a preview da imagem de perfil
document.addEventListener('DOMContentLoaded', function () {
    const profilePic = document.querySelector('#imagem-perfil'); // área da imagem de perfil

    // Recupera a imagem recortada do localStorage
    const croppedImage = localStorage.getItem('croppedImage');

    if (croppedImage) {
        // Se houver uma imagem recortada no localStorage, atualize a preview do perfil
        profilePic.src = croppedImage;

        // Se a imagem foi recortada, enviamos ela via form
        const base64ImageInput = document.querySelector('#base64-image');
        base64ImageInput.value = croppedImage; // Adiciona a imagem base64 no campo oculto
    }
});

