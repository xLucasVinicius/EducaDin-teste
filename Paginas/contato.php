<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EducaDin</title>
    <link rel="stylesheet" href="../Style/contato/contato.css">
    <link rel="stylesheet" href="../Style/contato/contato-media.css">
</head>
<body>
    <section class="conteudo-contato"> <!-- section com todo o conteudo de contato -->
        <section class="infos-contato"> <!-- section com informacoes de contato -->
            <div class="texto-infos"> <!-- div com texto de informacoes de contato -->
                <h1>Contato</h1>
                <p>Alguma duvida ou sugestão? Entre em contato conosco!</p>
                <div class="redes-contato">
                    <a href="mailto:educadin.contact@gmail.com" target="_blank">
                        <i class="bi bi-envelope-at"></i>
                        educadin.contact@gmail.com
                    </a>
                    <a href="https://www.instagram.com/educadin__" target="_blank">
                        <i class="bi bi-instagram"></i>
                        @educadin__
                    </a>
                    <a href="https://www.facebook.com/educa.din" target="_blank">
                        <i class="bi bi-facebook"></i>
                        @educadin__
                    </a>
                </div>
            </div>   
        </section>
        <section class="form-contato"> <!-- section com formulario de contato -->
            <form action="https://api.staticforms.xyz/submit" method="post">

                <input type="hidden" name="accessKey" value="9043c0d8-f2d5-410a-8614-52252954f318">

                <!-- Campo de Nome -->
                <label for="nome">Nome</label>
                <input type="text" name="nome" id="nome" placeholder="Digite seu nome">

                <!-- Campo de Email -->
                <label for="email">Email</label>
                <input type="email" name="email" id="email" placeholder="Digite seu email">

                <!-- Campo da Mensagem -->
                <label for="mensagem">Mensagem</label>
                <textarea name="mensagem" id="mensagem" cols="30" rows="10" placeholder="Digite sua mensagem"></textarea>

                <!-- Campo de enviar -->
                <input type="submit" value="Enviar">
                <input type="text" name="honeypot" style="display: none;">
                <input type="hidden" name="redirectTo" value="http://localhost:3000/EducaDin-teste/Paginas/navbar.php?page=contato">
            </form>
        </section>
    </section>
</body>
</html>
