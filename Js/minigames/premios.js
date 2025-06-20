function carregarPremios() {
    fetch('../Paginas/administrador/buscar-premios.php')
        .then(response => response.json())
        .then(data => {
            const premios = data.premios;
            console.log(premios);

            const premiosContainer = document.querySelector('.premios-loja-conteiner');

            premios.forEach(premio => {
                const premioElement = `
                    <div class="premio">
                            <div class="imagem-premio">
                                <img src="${premio.imagem_premio}" alt="${premio.nome_premio}">
                            </div>
                            <div class="infos-premio">
                                <span class="nome-premio">${premio.nome_premio}</span>
                                <span class="descricao-premio">${premio.descricao_premio}</span>
                                <span class="preco-premio"><i class="bi bi-coin">${premio.valor_moedas}</i> </span>
                                <span class="limite-premio">${premio.quantidade_resgates}/${premio.limite_trocas}</span>
                            </div>
                            <button onclick="resgatarPremio(${premio.id_premio})" ${premio.quantidade_resgates >= premio.limite_trocas ? 'disabled' : ''} ${premio.quantidade_resgates >= premio.limite_trocas ? 'class="disabled"' : ''} >Resgatar</button>
                        </div>
                `;
                premiosContainer.innerHTML += premioElement;
            });
        })
        .catch(error => console.error('Erro ao carregar premiços:', error));
}

window.addEventListener('DOMContentLoaded', () => {
    carregarPremios();
});