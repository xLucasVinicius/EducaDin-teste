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
        <p>Alguma dúvida ou sugestão? Entre em contato conosco!</p>
        <div class="redes-contato">
          <a href="mailto:educadin.contact@gmail.com" target="_blank">
            <i class="bi bi-envelope-at"></i> educadin.contact@gmail.com
          </a>
          <a href="https://www.instagram.com/educadin__" target="_blank">
            <i class="bi bi-instagram"></i> @educadin__
          </a>
          <a href="https://www.facebook.com/educa.din" target="_blank">
            <i class="bi bi-facebook"></i> @educadin__
          </a>
        </div>
      </div>   
    </section>

    <section class="form-contato">
      <form id="form-contato" action="https://api.staticforms.xyz/submit" method="post">

        <!-- StaticForms accessKey -->
        <input type="hidden" name="accessKey" value="9043c0d8-f2d5-410a-8614-52252954f318">

        <!-- Nome -->
        <label for="nome">Nome</label>
        <input type="text" name="nome" id="nome" placeholder="Digite seu nome" required>

        <!-- Email -->
        <label for="email">Email</label>
        <input type="email" name="email" id="email" placeholder="Digite seu email" required>

        <!-- Mensagem -->
        <label for="mensagem">Mensagem</label>
        <textarea name="mensagem" id="mensagem" cols="30" rows="5" placeholder="Digite sua mensagem" required></textarea>

        <!-- Honeypot -->
        <input type="text" name="honeypot" style="display: none;">

        <!-- Redirect -->
        <input type="hidden" name="redirectTo" value="http://educadin.ct.ws/Paginas/navbar.php?page=contato">

        <!-- Campo do reCAPTCHA (vai ser preenchido pelo JS) -->
        <input type="hidden" name="g-recaptcha-response" id="g-recaptcha-response">

        <!-- Botão -->
        <button type="submit">Enviar</button>
      </form>
    </section>
  </section>

  <!-- reCAPTCHA v3 -->
  <script src="https://www.google.com/recaptcha/api.js?render=6LdDZWErAAAAADeeQeYnA3Q0Ez9FNo7vJ-jJeCQF"></script>
  <script>
    document.getElementById('form-contato').addEventListener('submit', function (e) {
      e.preventDefault();

      grecaptcha.ready(function () {
        grecaptcha.execute('6LdDZWErAAAAADeeQeYnA3Q0Ez9FNo7vJ-jJeCQF', { action: 'submit' }).then(function (token) {
          document.getElementById('g-recaptcha-response').value = token;

          // Espera o input ser preenchido e envia o formulário
          document.getElementById('form-contato').submit();
        });
      });
    });
  </script>
</body>
</html>
