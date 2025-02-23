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
    <section class="conteudo-contato">
        <section class="infos-contato">
            <div class="texto-infos">
                <h1>Contato</h1>
                <p>Alguma duvida ou sugestão? Entre em contato conosco!</p>
                <div class="redes-contato">
                    <a href="" target="_blank">
                        <i class="bi bi-envelope-at"></i>
                        educadin.contact@gmail.com
                    </a>
                    <a href="https://www.instagram.com/educa_din/" target="_blank">
                        <i class="bi bi-instagram"></i>
                        @educa_din
                    </a>
                    <a href="https://www.facebook.com/educa.din" target="_blank">
                        <i class="bi bi-facebook"></i>
                        @educa.din
                    </a>
                    <a href="" target="_blank">
                        <i class="bi bi-telephone"></i>
                        (11) 99999-9999
                    </a>
                </div>
            </div>
                
        </section>
        <section class="form-contato">
            <form action="https://api.staticforms.xyz/submit" method="post">
                <input type="hidden" name="accessKey" value="9043c0d8-f2d5-410a-8614-52252954f318">
                <label for="nome">Nome</label>
                <input type="text" name="nome" id="nome" placeholder="Digite seu nome">

                <label for="email">Email</label>
                <input type="email" name="email" id="email" placeholder="Digite seu email">

                <label for="mensagem">Mensagem</label>
                <textarea name="mensagem" id="mensagem" cols="30" rows="10" placeholder="Digite sua mensagem"></textarea>

                <input type="submit" value="Enviar">
                <input type="text" name="honeypot" style="display: none;">
                <input type="hidden" name="redirectTo" value="http://localhost:3000/EducaDin-teste/Paginas/navbar.php?page=contato">
            </form>
        </section>
    </section>
</body>
</html>
