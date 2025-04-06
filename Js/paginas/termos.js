btnVoltar = document.querySelector("button"); // Seleciona o botão

// Adiciona um ouvinte para o evento de clique no botão
btnVoltar.addEventListener("click", () => {
    history.back(); // Volta para a tela anterior
});