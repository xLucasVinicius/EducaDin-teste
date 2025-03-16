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
            <button id="btnModalexcluir">Sim</button>
            <button id="btnModalNao">Não</button>
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
                            <option value="01">01</option>
                            <option value="02">02</option>
                            <option value="03">03</option>
                            <option value="04">04</option>    
                            <option value="05">05</option>
                            <option value="06">06</option>
                            <option value="07">07</option>
                            <option value="08">08</option>    
                            <option value="09">09</option>
                            <option value="10">10</option>
                            <option value="11">11</option>
                            <option value="12">12</option>    
                            <option value="13">13</option>
                            <option value="14">14</option>
                            <option value="15">15</option>
                            <option value="16">16</option>    
                            <option value="17">17</option>
                            <option value="18">18</option>
                            <option value="19">19</option>
                            <option value="20">20</option>    
                            <option value="21">21</option>
                            <option value="22">22</option>
                            <option value="23">23</option>
                            <option value="24">24</option>    
                            <option value="25">25</option>
                            <option value="26">26</option>
                            <option value="27">27</option>
                            <option value="28">28</option>    
                            <option value="29">29</option>
                            <option value="30">30</option>
                            <option value="31">31</option>
                        </select>
                    </div>
                    
                    <div class="data-vencimento">
                        <label for="vencimento">Dia de vencimento</label>
                        <select name="vencimento" id="vencimento">
                            <option value="">Selecione o dia</option>
                            <option value="01">01</option>
                            <option value="02">02</option>
                            <option value="03">03</option>
                            <option value="04">04</option>    
                            <option value="05">05</option>
                            <option value="06">06</option>
                            <option value="07">07</option>
                            <option value="08">08</option>    
                            <option value="09">09</option>
                            <option value="10">10</option>
                            <option value="11">11</option>
                            <option value="12">12</option>    
                            <option value="13">13</option>
                            <option value="14">14</option>
                            <option value="15">15</option>
                            <option value="16">16</option>    
                            <option value="17">17</option>
                            <option value="18">18</option>
                            <option value="19">19</option>
                            <option value="20">20</option>    
                            <option value="21">21</option>
                            <option value="22">22</option>
                            <option value="23">23</option>
                            <option value="24">24</option>    
                            <option value="25">25</option>
                            <option value="26">26</option>
                            <option value="27">27</option>
                            <option value="28">28</option>    
                            <option value="29">29</option>
                            <option value="30">30</option>
                            <option value="31">31</option>
                        </select>
                    </div>
                    <button type="submit">Adicionar</button>
                    <input type="hidden" name="id_usuario" value="<?php echo $id; ?>">
                </form>
                <button class="excluir-cartao" id="excluir-cartao">Excluir Cartão</button>
            </div>
        </section>
    </section>

    <script src="../Js/cartoes.js"></script> <!-- JS Personalizado -->
</body>
</html>
