const form = document.querySelector('#form-cadastro');

form.addEventListener('submit', function (e) {
    e.preventDefault(); // Impede o envio do formulário

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
            label: 'data-nasc',
            validator: dataIsValid
        },
        {
            id: 'telefone',
            label: 'Telefone',
            validator: phoneIsValid
        }
    ];

    const errorIcon = '<i class="bi bi-exclamation-circle"></i>';

    fields.forEach(function (field) {
        const input = document.getElementById(field.id);
        const inputBox = input.closest('.input-box'); // buscar o .input-box mais próximo
        const inputValue = input.value;
        const errorSpan = inputBox.querySelector('.error'); // Busca o .error dentro do inputBox
        errorSpan.innerHTML = '';

        inputBox.classList.remove('invalid');
        inputBox.classList.add('valid');

        const fieldValidator = field.validator(inputValue);

        // Verifica se a validação falhou
        if (fieldValidator && !fieldValidator.isValid) {
            errorSpan.innerHTML = `${errorIcon} ${fieldValidator.errorMessage}`;
            inputBox.classList.add('invalid');
            inputBox.classList.remove('valid');
        }
    });
});

// Função de verificação de campo vazio
function isEmpty(value) {
    return value === '';
}

function nameIsValid(value) {
    const validator = {
        isValid: true,
        errorMessage: null
    };

    if (isEmpty(value)) {
        validator.isValid = false;
        validator.errorMessage = 'Insira um nome';
        return validator;
    }

    const min = 3;
    if (value.length < min) {
        validator.isValid = false;
        validator.errorMessage = `Insira pelo menos ${min} caracteres`;
        return validator;
    }

    const regex = /^[A-Za-z\s]+$/;
    if (!regex.test(value)) {
        validator.isValid = false;
        validator.errorMessage = 'Insira apenas letras';
        return validator;
    }

    return validator;
}

function emailIsValid(value) {
    const validator = {
        isValid: true,
        errorMessage: null
    };

    // Adicione a validação do email aqui (exemplo simples)
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!regex.test(value)) {
        validator.isValid = false;
        validator.errorMessage = 'Insira um email válido';
    }

    return validator;
}

function dataIsValid(value) {
    const validator = {
        isValid: true,
        errorMessage: null
    };

    // Verifica se o campo está vazio
    if (isEmpty(value)) {
        validator.isValid = false;
        validator.errorMessage = 'Insira uma data de nascimento';
        return validator;
    }

    const inputDate = new Date(value);
    const today = new Date();

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

    return validator;
}

function passwordIsSecure(value) {
    const validator = {
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
    if (!regex.test(value)) {
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
        return validator;
    }
    return validator;
}

function passwordMatch(value) {
    const validator = {
        isValid: true,
        errorMessage: null
    };

    const passwordValue = document.getElementById('senha').value;

    if (value === '' || passwordValue !== value) {
        validator.isValid = false;
        validator.errorMessage = 'As senhas devem ser iguais';
    }

    return validator;
}

function phoneIsValid(value) {
    const validator = {
        isValid: true,
        errorMessage: null
    };

    // Remove formatação para validar apenas números
    const cleanedValue = value.replace(/\D/g, '');

    if (isEmpty(cleanedValue)) {
        validator.isValid = false;
        validator.errorMessage = 'Insira um número de telefone';
        return validator;
    }

    // Verifica se o número tem 11 dígitos (formato (XX) XXXXX-XXXX)
    if (cleanedValue.length !== 11) {
        validator.isValid = false;
        validator.errorMessage = 'Insira um número válido com 11 dígitos';
        return validator;
    }

    return validator;
}







document.getElementById('telefone').addEventListener('input', function (e) {
    let value = e.target.value.replace(/\D/g, ''); // Remove qualquer caractere que não seja número
    if (value.length > 11) value = value.slice(0, 11); // Limita a 11 caracteres

    if (value.length > 10) {
        // Formato para (XX) XXXXX-XXXX
        value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (value.length > 5) {
        // Formato para (XX) XXXX-XXXX
        value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    } else if (value.length > 2) {
        // Formato para (XX) XXXX
        value = value.replace(/(\d{2})(\d{0,5})/, '($1) $2');
    } else if (value.length > 0) {
        // Formato para (XX
        value = value.replace(/(\d{0,2})/, '($1');
    }
    e.target.value = value;
});

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
document.querySelector('.file-label').addEventListener('change', function(event) {
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

// Evento de clique no botão de exibir senha
function mostrarSenha() {
    var senhaInput = document.getElementById("senha");
    var senhaIcon = document.getElementById("senha-icon");

    if (senhaInput.type === "password") {
        senhaInput.type = "text";
        senhaIcon.classList.remove("bi-eye");
        senhaIcon.classList.add("bi-eye-slash");
    } else {
        senhaInput.type = "password";
        senhaIcon.classList.remove("bi-eye-slash");
        senhaIcon.classList.add("bi-eye");
    }
}

function mostrarConfirmarSenha() {
    var confirmarSenhaInput = document.getElementById("confirmar-senha");
    var confirmarSenhaIcon = document.getElementById("confirmarsenha-icon");

    if (confirmarSenhaInput.type === "password") {
        confirmarSenhaInput.type = "text";
        confirmarSenhaIcon.classList.remove("bi-eye");    
        confirmarSenhaIcon.classList.add("bi-eye-slash");
    } else {
        confirmarSenhaInput.type = "password";
        confirmarSenhaIcon.classList.remove("bi-eye-slash");
        confirmarSenhaIcon.classList.add("bi-eye");
    }
}

btnTermos = document.getElementById('termos');

function aceitarTermos() {
    console.log("checked");
}