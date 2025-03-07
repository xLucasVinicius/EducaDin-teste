<?php
    $id = $_SESSION['id'];

?>

<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contas e Lançamentos</title>
    <link rel="stylesheet" href="../Style/contas/contas.css">
    <link rel="stylesheet" href="../Style/contas/contas-media.css">
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
            <section class="fora-lancamentos" id="fora-lancamentos">
                <div class="lancamentos">
                    <!-- Os lançamentos serão inseridas aqui dinamicamente -->
                </div>
            </section>
        </section>

        <!-- Formulário para adicionar novas contas -->
        <section class="add-contas">
            <div class="form-content">
                <h1>Adicionar Conta</h1>
                <form action="configs/add-conta.php" method="POST" id="form-add-conta">
                    <div class="form-conta">
                        <label for="conta">Nome da Conta</label>
                        <select name="conta" id="conta" onchange="mostrarImagem()">
                            <option value="">Selecione uma conta</option>
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
                    <div class="imagem-conta"> <!-- Div para mostrar a imagem da conta (só será mostrada se uma conta for selecionada) -->
                        <p>Imagem da Conta</p>
                        <span>
                            <img src="../imagens/logos/Nubank.png" alt="Imagem da Conta">
                        </span>
                    </div>

                    <div class="form-saldo"> <!-- Div para o campo de saldo da conta -->
                        <label for="saldo">Saldo Inicial</label>
                        <input type="text" name="saldo" id="saldo" placeholder="R$ 0,00" oninput="formatarMoeda(this)">
                    </div>
                    <button type="submit">Adicionar</button>
                    <input type="hidden" name="id_usuario" value="<?php echo $id; ?>">
                </form>
            </div>
        </section>
    </section>

    <script src="../Js/contas.js"></script> <!-- JS Personalizado -->
</body>
</html>
