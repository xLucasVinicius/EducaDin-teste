<?php
    $id = $_SESSION['id'];

?>

<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cartoes</title>
    <link rel="stylesheet" href="../Style/cartoes/cartoes.css">
    <link rel="stylesheet" href="../Style/cartoes/cartoes-media.css">
    <link rel="stylesheet" href="../style/globais/msg-confirmacao.css">
</head>
<body>
    <!-- Modal de Sucesso -->
    <div id="modalAddContas" class="modal">
        <div class="modal-content">
            <h2>Sucesso!</h2>
            <p>Conta adicionada com sucesso.</p>
            <button id="btnModalAdd">Ok</button>
        </div>
    </div>
    <!-- Modal de Erro -->
    <div id="errorModalPreencher" class="modal">
        <div class="modal-content error-conta">
            <h2>Erro!</h2>
            <p>Preencha todos os campos antes de enviar.</p>
            <button id="btnModalCampos">Ok</button>
        </div>
    </div>
    <!-- Modal de Erro -->
    <div id="errorModalAddContas" class="modal">
        <div class="modal-content error-conta">
            <h2>Erro!</h2>
            <p>Você já possui essa conta.</p>
            <button id="btnModalConta">Ok</button>
        </div>
    </div>
    <section class="elemento-fora">
        
        <section class="conteudo-total-contas"> <!-- Carrossel de Contas -->

            <section class="contas-carrossel">
                <!-- As divs de conta serão inseridas aqui dinamicamente -->
            </section>

            <div class="buttons"> <!-- Botoes de navegacao do carrossel -->
                <button class="prev buttom"><i class="bi bi-arrow-left"></i></button>
                <button class="next buttom"><i class="bi bi-arrow-right"></i></button>
            </div>

            <!-- Nova section para os lançamentos relacionados à conta -->
            <section class="fora-lancamentos">
                <div class="lancamentos-carrossel">
                    <!-- As divs de lançamentos serão inseridas aqui dinamicamente -->
                </div>
            </section>
        </section>

        <!-- Formulário para adicionar novas contas -->
        <section class="add-contas">
            <div class="form-content">
                <h1>Adicionar Cartão</h1>
                <form action="configs/add-cartaophp" method="POST" id="form-add-cartao">
                    <div class="form-conta">
                        <label for="conta">Instituição</label>
                        <select name="conta" id="conta" onchange="mostrarImagem()">
                            <option value="">Selecione a conta referente ao cartão</option>
                            <option value="Nubank">Nubank</option>
                            <option value="PicPay">PicPay</option>
                            <option value="Mercado Pago">Mercado Pago</option>
                            <option value="Inter">Inter</option>
                            <option value="Itaú">Itaú</option>
                            <option value="Santander">Santander</option>
                            <option value="Banco do Brasil">Banco do Brasil</option>
                            <option value="C6 Bank">C6 Bank</option>
                            <option value="Caixa">Caixa</option>
                        </select>
                    </div>
                    <div class="limite-cartao">
                        <label for="limite">Limite total do Cartão</label>
                        <input type="text" name="limite" id="limite" placeholder="R$ 0,00" oninput="formatarMoeda(this)">
                    </div>
                    <div class="data-fechamento">
                        <label for="fechamento">Dia de fechamento</label>
                        <input type="number" name="fechamento" id="fechamento" min="1" max="31" placeholder="Dia de fechamento da fatura">
                    </div>
                    
                    <div class="data-vencimento">
                        <label for="vencimento">Dia de vencimento</label>
                        <input type="number" name="vencimento" id="vencimento" min="1" max="31" placeholder="Dia de vencimento da fatura">
                    </div>
                    <button type="submit">Adicionar</button>
                    <input type="hidden" name="id_usuario" value="<?php echo $id; ?>">
                </form>
            </div>
        </section>
    </section>

    <script src="../Js/cartoes.js"></script> <!-- JS Personalizado -->
</body>
</html>
