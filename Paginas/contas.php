<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contas e Lançamentos</title>
    <link rel="stylesheet" href="../Style/contas/contas.css">
    <link rel="stylesheet" href="../Style/contas/contas-media.css">
</head>
<body>
    <section class="elemento-fora">
        <!-- Carrossel de Contas -->
        <section class="conteudo-total-contas">
            <section class="contas-carrossel">
                <!-- As divs de conta serão inseridas aqui dinamicamente -->
            </section>
            <div class="buttons">
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
                <h1>Adicionar Conta</h1>
                <form action="configs/add-conta.php" method="POST">
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
                    <div class="imagem-conta">
                        <p>Imagem da Conta</p>
                        <span>
                            <img src="../imagens/logos/Nubank.png" alt="Imagem da Conta">
                        </span>
                    </div>
                    <div class="form-saldo">
                        <label for="saldo">Saldo Inicial</label>
                        <input type="text" name="saldo" id="saldo" placeholder="R$ 0,00" oninput="formatarMoeda(this)">
                    </div>
                    <button type="submit">Adicionar</button>
                </form>
            </div>
        </section>
    </section>

    <script src="../Js/contas.js"></script>
</body>
</html>
