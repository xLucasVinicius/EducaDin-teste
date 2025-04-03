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
    <div id="modalAddCartoes" class="modal">
        <div class="modal-content">
            <h2>Sucesso!</h2>
            <p>Cartão adicionado com sucesso.</p>
            <button id="btnModalAdd">Ok</button>
        </div>
    </div>
    <!-- Modal de Erro -->
    <div id="errorModalPreencher" class="modal">
        <div class="modal-content error-cartao">
            <h2 style="color: red;">Erro!</h2>
            <p>Preencha todos os campos antes de enviar.</p>
            <button id="btnModalCampos">Ok</button>
        </div>
    </div>
    <!-- Modal de Erro -->
    <div id="errorModalAddCartoes" class="modal">
        <div class="modal-content error-cartao">
            <h2>Erro!</h2>
            <p>Você já possui este cartão.</p>
            <button id="btnModalCartao">Ok</button>
        </div>
    </div>
    <!-- Modal de excluir conta -->
    <div id="ModalexcluirCartao" class="modal">
        <div class="modal-content excluir-cartao-modal">
            <i class="bi bi-x-lg" id="fecharModalExcluir"></i>
            <h2>Excluir Cartão</h2>
            <p>Selecione um cartão para excluir</p>
            <div class="tabela-cartoes">
                <table>
                    <thead>
                        <tr>
                            <th>Logo</th>
                            <th>Conta</th>
                            <th>Limite</th>
                            <th>Ação</th>
                        </tr>
                    </thead>
                    <tbody id="cartoes-tabela-body">
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
            <span class="btn-confirmar-excluir">
                <button id="btnModalexcluir">Sim</button>
                <button id="btnModalNao">Não</button>
            </span>
        </div>
    </div>
    <!-- Modal de Sucesso ao excluir conta -->
    <div id="modalexcluirSucesso" class="modal">
        <div class="modal-content">
            <h2>Sucesso!</h2>
            <p>Cartão removido com sucesso.</p>
            <button id="btnModalexcluirSucesso">Ok</button>
        </div>
    </div>
    <div class="modal" id="modalEditarCartao">
        <div class="modal-content editar-form-content">
            <span id="fecharModalEditar"><i class="bi bi-x-lg"></i></span>
            <h1>Editar Cartão</h1>
            <form action="configs/add-cartao.php" method="POST" id="form-Editar-Cartao">
                <div class="limite-cartao">
                    <label for="limite-editar">Limite total do Cartão</label>
                    <input type="text" name="limite-editar" id="limite-editar" placeholder="R$ 0,00" oninput="formatarMoeda(this)">
                </div>

                <div class="data-fechamento">
                    <label for="fechamento-editar">Dia de fechamento</label>
                    <select name="fechamento-editar" id="fechamento-editar">
                        <option value="">Selecione o dia</option>
                    </select>
                </div>
                    
                <div class="data-vencimento">
                    <label for="vencimento-editar">Dia de vencimento</label>
                    <select name="vencimento-editar" id="vencimento-editar">
                        <option value="">Selecione o dia</option>
                    </select>
                </div>

                <div class="anuidade">
                    <span>
                        <label for="anuidade-editar">Possui anuidade</label>
                        <input type="checkbox" name="anuidade-editar" id="anuidade-editar">
                    </span>
                </div>

                <div class="digitar-anuidade-editar">
                    <label for="anuidade-valor-editar">Valor da parcela</label>
                    <input type="text" name="anuidade-valor-editar" id="anuidade-valor-editar" placeholder="R$ 0,00" oninput="formatarMoeda(this)">
                </div>

                <div class="pontos">
                    <span>
                        <label for="pontos-editar">Compras geram pontos</label>
                        <input type="checkbox" name="pontos-editar" id="pontos-editar">
                    </span>
                </div>

                <div class="btn-form">
                    <button class="adicionar-excluir-cartao" id="adicionar-excluir-cartao" type="button">Add/Excluir</button>
                    <button type="submit">Salvar</button>
                </div>
                <input type="hidden" name="id_cartao" id="id-cartao-editar">
            </form>
        </div>
    </div>
    
    <section class="elemento-fora">
        
        <section class="conteudo-total-cartoes"> <!-- Carrossel de Contas -->

            <section class="cartoes-carrossel">
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
        <section class="add-cartoes">
            <div class="form-content">
                <h1>Adicionar Cartão</h1>
                <form action="configs/add-cartao.php" method="POST" id="form-add-cartao">
                    <div class="form-conta">
                        <label for="conta">Instituição</label>
                        <select name="conta" id="conta">
                            <option value="">Selecione a conta</option>
                            
                        </select>
                    </div>
                    <div class="limite-cartao">
                        <label for="limite">Limite total do Cartão</label>
                        <input type="text" name="limite" id="limite" placeholder="R$ 0,00" oninput="formatarMoeda(this)">
                    </div>
                    <div class="data-fechamento">
                        <label for="fechamento">Dia de fechamento</label>
                        <select name="fechamento" id="fechamento">
                            <option value="">Selecione o dia</option>
                        </select>
                    </div>
                    
                    <div class="data-vencimento">
                        <label for="vencimento">Dia de vencimento</label>
                        <select name="vencimento" id="vencimento">
                            <option value="">Selecione o dia</option>
                        </select>
                    </div>
                    <div class="anuidade">
                        <span>
                            <label for="anuidade">Possui anuidade</label>
                            <input type="checkbox" name="anuidade" id="anuidade">
                        </span>
                    </div>
                    <div class="digitar-anuidade">
                            <label for="anuidade-valor">Valor da parcela</label>
                            <input type="text" name="anuidade-valor" id="anuidade-valor" placeholder="R$ 0,00" oninput="formatarMoeda(this)" autocomplete="off">
                    </div>
                    <div class="pontos">
                        <span>
                            <label for="pontos">Compras geram pontos</label>
                            <input type="checkbox" name="pontos" id="pontos">
                        </span>
                    </div>
                    <div class="btn-form">
                        <button class="excluir-cartao" id="excluir-cartao" type="button">Excluir Cartão</button>
                        <button type="submit">Adicionar</button>
                    </div>
                    <input type="hidden" name="id_usuario" value="<?php echo $id; ?>">
                </form>
            </div>
        </section>
    </section>

    <script src="../Js/cartoes.js"></script> <!-- JS Personalizado -->
</body>
</html>
