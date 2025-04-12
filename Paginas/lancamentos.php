<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EducaDin</title>
    <link rel="stylesheet" href="../Style/lancamentos/lancamentos.css">
</head>
<body>
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
                <p>Novembro</p>
                <button class="next buttom"><i class="bi bi-chevron-right"></i></button>
            </div>
        </div>
        <div class="lancamentos">

        </div>
    </section>
    <div class="form-container">
        <div class="form-add-lancamento">
            <span class="fechar-form-icon">
                <i class="bi bi-x-lg" id="fecharForm"></i>
            </span>
            <h1>Adicionar Lançamento</h1>
            <form action="" method="post">
                <span class="input-box">
                    <label for="descricao">Descrição</label>
                    <input type="text" name="descricao" id="descricao" placeholder="Digite a descrição">
                </span>
                <span class="input-box">
                    <label for="valor">Valor</label>
                    <input type="number" name="valor" id="valor" placeholder="Digite o valor">
                </span>
                <span class="input-box">
                    <label for="tipo">Tipo</label>
                    <span class="tipo-lancamento">
                        <input type="radio" name="tipo" id="receita">
                        <label for="receita">Receita</label>
                    </span>
                    <span class="tipo-lancamento">
                        <input type="radio" name="tipo" id="despesa">
                        <label for="despesa">Despesa</label>
                    </span>
                </span>
                <span class="input-box">
                    <label for="metodo">Metodo de Pagamento</label>
                    <select name="metodo" id="metodo">
                        <option value="">Selecione o metodo</option>
                        <optgroup label="Contas">
                        </optgroup>
                        <optgroup label="Cartões">
                        </optgroup>
                    </select>
                </span>
                <span class="input-box">
                    <label for="categoria">Categoria</label>
                    <input type="text" name="categoria" id="categoria" placeholder="Digite a categoria">
                </span>
                <span class="input-box">
                    <label for="subcategoria">Subcategoria</label>
                    <input type="text" name="subcategoria" id="subcategoria" placeholder="Digite a subcategoria">
                </span>
                <span class="input-box">
                    <label for="data">Data</label>
                    <input type="date" name="data" id="data">
                </span>
                <span class="input-box">
                    <label for="parcelas">Parcelas</label>
                    <input type="number" name="parcelas" id="parcelas">
                </span>
                <input type="submit" value="Adicionar">
            </form>
        </div>
    </div>
</body>
</html>