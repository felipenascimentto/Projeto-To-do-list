const campoItem = document.querySelector(".campo-item");
const campoData = document.querySelector(".campo-data");
const botaoAdicionar = document.querySelector(".botao-adicionar");
const listaItens = document.querySelector(".lista-itens");

// Adiciona uma tarefa à lista da tela (ainda não é salva no navegador).
botaoAdicionar.addEventListener("click", () => {
    const texto = campoItem.value.trim();
    const data = campoData.value;

    if (!texto || !data) {
        alert("Preencha a tarefa e a data.");
        return;
    }

    const [ano, mes, dia] = data.split("-");

    const item = document.createElement("li");
    item.className = "item-salvo";

    const detalhes = document.createElement("div");
    detalhes.className = "detalhes-item";

    const nome = document.createElement("span");
    nome.textContent = texto;

    const dataVisivel = document.createElement("span");
    dataVisivel.textContent = `${dia}/${mes}/${ano}`;

    detalhes.append(nome, dataVisivel);

    const concluir = document.createElement("button");
    concluir.className = "botao-concluir";
    concluir.type = "button";
    concluir.setAttribute("aria-label", "Concluir item");
    concluir.textContent = "✓";

    const excluir = document.createElement("button");
    excluir.className = "botao-excluir";
    excluir.type = "button";
    excluir.setAttribute("aria-label", "Excluir item");
    excluir.textContent = "×";

    item.append(detalhes, concluir, excluir);
    listaItens.append(item);

    campoItem.value = "";
    campoData.value = "";
    campoItem.focus();
});

// Concluir e excluir: um único clique na lista, vale para itens novos também.
listaItens.addEventListener("click", (evento) => {
    const item = evento.target.closest(".item-salvo");
    if (!item) return;

    if (evento.target.closest(".botao-excluir")) {
        item.remove();
    }

    if (evento.target.closest(".botao-concluir")) {
        item.classList.toggle("concluido");
    }
});
