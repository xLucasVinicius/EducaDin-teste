window.addEventListener('DOMContentLoaded', () => {
    carregarPremios();
});

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
                            <button onclick="resgatarPremio(${premio.id_premio}, '${premio.nome_premio}', ${premio.valor_moedas})" ${premio.quantidade_resgates >= premio.limite_trocas ? 'disabled' : ''} ${premio.quantidade_resgates >= premio.limite_trocas ? 'class="disabled"' : ''} >Resgatar</button>
                        </div>
                `;
                premiosContainer.innerHTML += premioElement;
            });
        })
        .catch(error => console.error('Erro ao carregar premiços:', error));
}

function resgatarPremio(id_premio, premio_nome, valor_moedas) {
    fetch('../Paginas/administrador/resgate-premium.php?premio_id=' + id_premio + '&premio_nome=' + premio_nome + '&valor_moedas=' + valor_moedas, {
        method: 'POST'
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            exibirSucessoResgate(data);
        } else {
            exibirErroResgate(data);
        }
    })
    .catch(error => console.error('Erro ao resgatar o premio:', error));
}

function exibirSucessoResgate(data) {
    const modal = document.getElementById('modalSucesso');
    const mensagem = document.querySelector('#modalSucesso p');

    modal.style.display = 'flex';
    mensagem.textContent = 'O ' + data.premio + ' ' + data.mensagem;
}

document.getElementById('btnModalSucesso').addEventListener('click', () => {
    location.reload();
});