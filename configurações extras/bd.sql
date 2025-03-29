-- 1. Tabela de Cadastro (usuários)
CREATE TABLE usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    foto_perfil VARCHAR(255),         -- Caminho para a foto de perfil
    nome VARCHAR(100) NOT NULL,
    sobrenome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    data_nascimento DATE,
    salario DECIMAL(10,2),
    plano TINYINT(1) DEFAULT 0 COMMENT '0 = grátis, 1 = premium',
    poder TINYINT(1) DEFAULT 0 COMMENT '0 = comum, 1 = admin',
    moedas INT DEFAULT 0
);

-- 2. Tabela de Contas
CREATE TABLE contas (
    id_conta INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT,
    nome_conta VARCHAR(100) NOT NULL,
    saldo_atual DECIMAL(10,2) DEFAULT 0,
    categoria TINYINT(1) DEFAULT 0 COMMENT '0 = conta-corrente, 1 = conta-poupança, 2 = conta-salário',
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE ON UPDATE CASCADE
);

-- 3. Tabela de Cartões
CREATE TABLE cartoes (
    id_cartao INT AUTO_INCREMENT PRIMARY KEY,
    id_conta INT,
    id_usuario INT,
    limite_total DECIMAL(10,2),
    dia_fechamento INT,
    dia_vencimento INT,
    anuidade DECIMAL(10,2),
    pontos TINYINT(1) DEFAULT 0 COMMENT '0 = sim, 1 = nao',
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_conta) REFERENCES contas(id_conta) ON DELETE CASCADE ON UPDATE CASCADE
);

-- 4. Tabela de Lançamentos
CREATE TABLE lancamentos (
    id_lancamento INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT,
    id_conta INT,
    id_cartao INT NULL,  -- Somente se for despesa; pode ser NULL para receitas
    descricao VARCHAR(255),
    valor DECIMAL(10,2),
    tipo TINYINT(1) COMMENT '0 = receita, 1 = despesa',
    metodo_pagamento VARCHAR(50),
    categoria VARCHAR(100),
    subcategoria VARCHAR(100),
    data DATE,
    parcelas INT DEFAULT 1,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_conta) REFERENCES contas(id_conta) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_cartao) REFERENCES cartoes(id_cartao) ON DELETE CASCADE ON UPDATE CASCADE
);

-- 5. Tabela de Desempenho Anual (por mês)
CREATE TABLE desempenho_anual (
    id_desempenho INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT,
    mes TINYINT(2) NOT NULL COMMENT '1 a 12 para os meses do ano',
    total_receitas DECIMAL(10,2),
    total_despesas DECIMAL(10,2),
    sobra_mes DECIMAL(10,2),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE ON UPDATE CASCADE
);

-- 6. Tabela de Mini Games
CREATE TABLE minigames (
    id_minigame INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100)
);

-- 7. Tabela de Pontuação dos Mini Games
CREATE TABLE pontuacoes_mg (
    id_pontuacao INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT,
    id_minigame INT,
    pontuacao_rodada INT,
    moedas_ganhas INT,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_minigame) REFERENCES minigames(id_minigame) ON DELETE CASCADE ON UPDATE CASCADE
);

-- 8. Tabela de Recorde de Pontuação
CREATE TABLE recordes_mg (
    id_recorde INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT,
    id_minigame INT,
    recorde_pontos INT,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_minigame) REFERENCES minigames(id_minigame) ON DELETE CASCADE ON UPDATE CASCADE
);

-- 9. Tabela de Prêmios de Troca
CREATE TABLE premios (
    id_premio INT AUTO_INCREMENT PRIMARY KEY,
    nome_premio VARCHAR(100),
    descricao_premio TEXT,
    valor_moedas INT
);

-- 10. Tabela de Trocas de Prêmios
CREATE TABLE trocas_premios (
    id_troca INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT,
    id_premio INT,
    data_troca DATE,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_premio) REFERENCES premios(id_premio) ON DELETE CASCADE ON UPDATE CASCADE
);
