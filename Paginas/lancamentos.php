<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EducaDin</title>
    <link rel="stylesheet" href="../Style/lancamentos/lancamentos.css">
    <link rel="stylesheet" href="../Style/lancamentos/lancamentos-media.css">
    <link rel="stylesheet" href="../Style/globais/msg-confirmacao.css">
</head>
<body>
    <div class="modal" id="modalAddLancamento">
        <div class="modal-content">
            <h1>Sucesso!</h1>
            <p id="msg-modal">Lançamento adicionado com sucesso.</p>
            <button id="btnModalAdd">Ok</button>
        </div>
    </div>
    <div class="modal" id="modalErroLancamento">
        <div class="modal-content">
            <h1>Erro!</h1>
            <p id="msg-modal">Erro ao adicionar lançamento.</p>
            <button id="btnModalErro">Ok</button>
        </div>
    </div>
    <section class="conteudo-total">
        <div class="infos-topo">
            <h1>LANÇAMENTOS</h1>
            <div class="desempenho-mes">
                <span class="receita">
                    Receita:
                    <p>R$ 0000</p>
                </span>
                <span class="despesa">
                    Despesa:
                    <p>R$ 0000</p>
                </span>
            </div>
            <div class="meses">
                <button class="prev buttom"><i class="bi bi-chevron-left"></i></button>
                <p></p>
                <button class="next buttom"><i class="bi bi-chevron-right"></i></button>
            </div>
        </div>
        <span class="abrir-form-icon">Adicionar Lançamento</span>
        <div class="lancamentos">

        </div>
    </section>
    <div class="form-container">
        <div class="form-add-lancamento">
            <span class="fechar-form-icon">
                <i class="bi bi-x-lg" id="fecharForm"></i>
            </span>
            <h1>Adicionar Lançamento</h1>
            <form action="" method="post" id="form-add-lancamento">
                <span class="input-box">
                    <label for="descricao">Descrição</label>
                    <input type="text" name="descricao" id="descricao" placeholder="Digite a descrição">
                </span>
                <span class="input-box">
                    <label for="valor">Valor</label>
                    <input type="text" name="valor" id="valor" placeholder="R$ 0,00" oninput="formatarMoeda(this)">
                </span>
                <span class="input-box">
                    <label for="tipo">Tipo</label>
                    <span class="tipo-lancamento">
                        <input type="radio" name="tipo" id="receita" value="0" onchange="ocultarParcelas()">
                        <label for="receita">Receita</label>
                    </span>
                    <span class="tipo-lancamento">
                        <input type="radio" name="tipo" id="despesa" value="1" onchange="mostrarParcelas()">
                        <label for="despesa">Despesa</label>
                    </span>
                </span>
                <span class="input-box">
                    <label for="metodo">Método de Pagamento</label>
                    <select name="metodo" id="metodo">
                        <option value="">Selecione o metodo</option>
                        <option value="Dinheiro">Dinheiro</option>
                        <option value="Crédito">Crédito</option>
                        <option value="Débito">Débito</option>
                        <option value="Transferência">Transferência</option>
                        <option value="Boleto">Boleto</option>
                        <option value="Pix">Pix</option>
                    </select>
                </span>
                <span class="input-box" id="meio-pagamento"></span>
                <span class="input-box">
                    <label for="categoria">Categoria</label>
                    <select name="categoria" id="categoria">
                        <option value="">Selecione a categoria</option>
                    </select>
                </span>
                <span class="input-box" id="subcategoria-container">
                    <label for="subcategoria">Subcategoria</label>
                    <select name="subcategoria" id="subcategoria">
                        <option value="">Selecione a subcategoria</option>
                    </select>
                </span>
                <span class="input-box">
                    <label for="data">Data</label>
                    <input type="date" name="data" id="data">
                </span>
                <span class="input-box" id="parcelas-container">
                    <label for="parcelas">Parcelas</label>
                    <input type="number" name="parcelas" id="parcelas" placeholder="Quantidade de parcelas" value="0">
                </span>
                <input type="submit" value="Adicionar" id="adicionar-lancamento">
                <input type="hidden" name="id_usuario" value="<?php echo $_SESSION['id']; ?>">
            </form>
        </div>
    </div>

    <script src="../Js/paginas/lancamentos.js"></script>
</body>
</html>