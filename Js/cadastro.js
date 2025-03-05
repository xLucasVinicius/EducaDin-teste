const errorIcon = '<i class="bi bi-exclamation-circle"></i>';

window.onpageshow = function(event) {
  if (event.persisted) {
    window.location.reload();
  }
};

const form = document.querySelector('#form-cadastro');

form.addEventListener('submit', function (e) {
    e.preventDefault();  // Impede o envio do formulário inicialmente

    let isFormValid = true;  // Variável para verificar se o formulário é válido

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

    fields.forEach(function (field) {
        const input = document.getElementById(field.id);
        const inputBox = input.closest('.input-box');
        const inputValue = input.value;
        const errorSpan = inputBox.querySelector('.error');
        errorSpan.innerHTML = '';

        inputBox.classList.remove('invalid');
        inputBox.classList.add('valid');

        const fieldValidator = field.validator(inputValue);

        if (fieldValidator && !fieldValidator.isValid) {
            errorSpan.innerHTML = `${errorIcon} ${fieldValidator.errorMessage}`;
            inputBox.classList.add('invalid');
            inputBox.classList.remove('valid');
            isFormValid = false;  // Marca o formulário como inválido
            console.log(document.getElementById('data-nasc').value);
        }
    });

    if (isFormValid) {
        localStorage.removeItem('croppedImage');
        // Envio via AJAX
        const formData = new FormData(form); // Cria o objeto FormData com o conteúdo do formulário

        fetch('../Paginas/configs/salvar-usuario.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'error_email') {
                // Se o status for 'error_email', exibe a mensagem de erro no modal
                showModalError(data); // Função para exibir o modal com erro
            } else if (data.status === 'success2') {
                handleSuccess(data);
            } else {
                // Em caso de outro erro
                console.log('Erro desconhecido', data);
            }
        })
        .catch(error => console.error('Erro:', error));
    }
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

// Função para validar o campo de salário
function salaryIsValid(value) {
    const validator = {
        isValid: true,
        errorMessage: null
    };

    // Remove os símbolos de formatação para validar apenas números
    const cleanedValue = value.replace(/\D/g, '');

    if (isEmpty(cleanedValue)) {
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

    return validator;
}

// Formatação automática do campo salário
document.getElementById('salario').addEventListener('input', function (e) {
    let value = e.target.value.replace(/\D/g, ''); // Remove qualquer caractere que não seja número
    value = (value / 100).toFixed(2).replace('.', ','); // Adiciona a vírgula para separação de centavos
    value = value.replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // Adiciona pontos para milhares
    e.target.value = `R$ ${value}`; // Adiciona o símbolo R$
});

// Função para habilitar/desabilitar o botão de salvar e adicionar/remover a classe "disable"
document.getElementById("termos").addEventListener("change", function() {
    const btnSalvar = document.getElementById("btn-salvar");
    if (this.checked) {
        btnSalvar.disabled = false;
        btnSalvar.classList.remove("disabled");
        btnSalvar.classList.add("enable");
    } else {
        btnSalvar.disabled = true;
        btnSalvar.classList.remove("enable");
        btnSalvar.classList.add("disabled");
    }
});


document.addEventListener('DOMContentLoaded', function () {
    const profilePic = document.querySelector('#imagem-perfil');

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

document.querySelector('#form-cadastro').addEventListener('submit', function (e) {
    const base64ImageInput = document.querySelector('#base64-image');
    const croppedImage = localStorage.getItem('croppedImage');

    if (croppedImage) {
        // Se houver uma imagem, enviamos ela em base64
        base64ImageInput.value = croppedImage;
    } else {
        // Caso contrário, enviamos o valor padrão
        base64ImageInput.value = '';
    }
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

document.getElementById('btn-input1').addEventListener('click', function () {
    window.location.href = 'http://localhost:3000/EducaDin-teste/index.html';
});

function handleSuccess(response) {
    var modal2 = document.getElementById("successModal2");
    var closeModalBtn = document.getElementById("closeModalBtn");

    // Mostrar o modal se a resposta for de sucesso
    if (response.status === 'success2') {
        modal2.style.display = "block"; // Exibe o modal
        // Quando o usuário clicar no botão, redireciona para a página inicial
        closeModalBtn.onclick = function() {
            window.location.href = "login.php"; // Redireciona para a página inicial
        };
    }
}

const errorSpanEmail = document.querySelector('.email-error');
const inputEmailBox = document.querySelector('.login-email');

function showModalError(data) {
    var modalerror = document.getElementById("errorModal");
    var closeModalBtn2 = document.getElementById("closeModalBtn2");

    if (data.status === 'error_email') {
        modalerror.style.display = "block";
        errorSpanEmail.innerHTML = `${errorIcon} Insira um email válido`;
        errorSpanEmail.style.display = "block";
        inputEmailBox.classList.remove('valid');
        inputEmailBox.classList.add('invalid');

        closeModalBtn2.onclick = function() {
            modalerror.style.display = "none";
        };
    }
}

inputEmailBox.addEventListener('input', function() {
    errorSpanEmail.style.display = "none";
    inputEmailBox.classList.remove('invalid');
});

