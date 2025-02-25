<?php
    // definindo as variaveis com as credenciais do banco
    $host = "localhost";
    $user = "root";
    $pass = "";
    $bd = "educadin-teste";

    $mysqli = new mysqli($host, $user, $pass, $bd); //criando a conexao

    if ($mysqli->connect_errno) { //verificando se a conexao falhou
        echo "Connect failed: " . $mysqli->connect_error; 
        exit();
    }
?>
