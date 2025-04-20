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
            <h2 style="color: red;">Erro!</h2>
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
    <!-- Modal de excluir conta -->
    <div id="ModalexcluirContas" class="modal">
        <div class="modal-content excluir-conta-modal">
            <i class="bi bi-x-lg" id="fecharModalExcluir"></i>
            <h2>Excluir Conta</h2>
            <p>Selecione uma conta para excluir</p>
            <div class="tabela-contas">
                <table>
                    <thead>
                        <tr>
                            <th>Logo</th>
                            <th>Nome</th>
                            <th>Tipo</th>
                            <th>Saldo Atual</th>
                            <th>Ação</th>
                        </tr>
                    </thead>
                    <tbody id="contas-tabela-body">
                        <!-- As linhas serão inseridas dinamicamente aqui -->
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    <!-- Modal de Confirmação de exclusão conta -->
    <div id="modalConfirmarExcluir" class="modal">
        <div class="modal-content">
            <h2></h2>
            <p>Esta operaçao nao pode ser desfeita.</p>
            <span class="btns-operacoes">
                <button id="btnModalexcluir">Sim</button>
                <button id="btnModalNao">Não</button>
            </span>
        </div>
    </div>
    <!-- Modal de Sucesso ao excluir conta -->
    <div id="modalexcluirSucesso" class="modal">
        <div class="modal-content">
            <h2>Sucesso!</h2>
            <p>Conta removida com sucesso.</p>
            <button id="btnModalexcluirSucesso">Ok</button>
        </div>
    </div>
    
    <section class="elemento-fora">
        <section class="conteudo-total-contas"> <!-- Carrossel de Contas -->
            <span id="adicionar-conta-icon" title="Adicionar Conta">
                <i class="bi bi-gear"></i>
            </span>

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
                <span class="fechar-form-icon">
                <i class="bi bi-x-lg" id="fecharForm"></i>
                </span>
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
                    <div class="tipo-conta"> <!-- Div para o campo de tipo da conta -->
                        <label for="tipo">Tipo de Conta</label>
                        <div class="opcoes-conta">
                            <div class="opcao">
                            <label for="corrente">Corrente</label>
                            <input type="radio" name="tipo" value="0" id="corrente">
                            </div>
                            <div class="opcao">
                            <label for="poupanca">Poupanca</label>
                            <input type="radio" name="tipo" value="1" id="poupanca">
                            </div>
                            <div class="opcao">
                            <label for="salario">Salario</label>
                            <input type="radio" name="tipo" value="2" id="salario">
                            </div>
                        </div>
                    </div>
                    <div class="btn-form">
                        <button class="excluir-conta" id="excluir-conta" type="button">Excluir Conta</button>
                        <button type="submit">Adicionar</button>
                    </div>
                    <input type="hidden" name="id_usuario" value="<?php echo $id; ?>">
                </form>
            </div>
        </section>
    </section>

    <script src="../Js/paginas/contas.js"></script> <!-- JS Personalizado -->
</body>
</html>
