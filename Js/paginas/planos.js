document.getElementById("btn-premium").addEventListener("click", () => {
  fetch("../Paginas/configs/criar-preferencia.php")
    .then(res => res.json())
    .then(data => {
      if (data.init_point) {
        window.location.href = data.init_point;
      } else {
        console.error("Erro ao gerar link de pagamento.");
      }
    })
    .catch(err => console.error("Erro:", err));
});

document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const status = urlParams.get("status");

  if (status === "success") {
    abrirModal("Pagamento realizado com sucesso!");
  } else if (status === "failure") {
    abrirModal("O pagamento falhou. Tente novamente.");
  } else if (status === "pending") {
    abrirModal("Pagamento pendente. Aguarde a confirmação.");
  }
});

document.getElementById("fechar-modal").addEventListener("click", () => {
    const modal = document.getElementById("modalCompraMensagem");
    modal.style.display = "none";
    window.location.href = "https://2c46-2804-1b3-a341-73b-c041-3fcd-9882-26e6.ngrok-free.app/EducaDin-teste/Paginas/navbar.php?page=planos";
})

function abrirModal(mensagem) {
  const modal = document.getElementById("modalCompraMensagem");
  const mensagemBox = document.getElementById("mensagem-modal");
  mensagemBox.textContent = mensagem;
  modal.style.display = "flex";
}
