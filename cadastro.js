const formularioSugestao = document.querySelector("#contato form");
const mensagemContato = document.querySelector("#mensagem-contato");

// Mostra o agradecimento e limpa o formulário quando ele é enviado.
formularioSugestao.addEventListener("submit", (evento) => {
  evento.preventDefault();
  mensagemContato.innerText = "Obrigado pelo seu cadastro!";
  formularioSugestao.reset();
});
