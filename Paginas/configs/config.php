<?php
    // definindo as variaveis com as credenciais do banco
    $host = "localhost";
    $user = "u921758680_lucas_admin";
    $pass = "Luca$09112003";
    $bd = "u921758680_educadin";

    $mysqli = new mysqli($host, $user, $pass, $bd); //criando a conexao

    if ($mysqli->connect_errno) { //verificando se a conexao falhou
        echo "Connect failed: " . $mysqli->connect_error; 
        exit();
    }
?>
