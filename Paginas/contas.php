<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contas e Lançamentos</title>
    <link rel="stylesheet" href="../Style/contas/contas.css">
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
                <form action="">
                    <input type="text" placeholder="Conta" name="conta">
                    <input type="password" placeholder="Senha" name="senha">
                    <button type="submit">Adicionar</button>
                </form>
            </div>
        </section>
    </section>

    <script src="../Js/contas.js"></script>
</body>
</html>
