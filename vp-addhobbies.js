const campoItem = document.querySelector(".campo-item");
const campoData = document.querySelector(".campo-data");
const botaoAdicionar = document.querySelector(".botao-adicionar");
const listaItens = document.querySelector(".lista-itens");
const campoNomeLista = document.querySelector(".campo-nome-lista");
const botaoSalvar = document.querySelector(".botao-salvar");
const botaoLimpar = document.querySelector(".botao-limpar");

// Adiciona um hobbie à lista da tela (só é guardado ao clicar em Salvar).
botaoAdicionar.addEventListener("click", () => {
    const texto = campoItem.value.trim();
    const data = campoData.value;

    if (!texto || !data) {
        alert("Preencha a responsabilidade e a data.");
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

listaItens.addEventListener("click", (evento) => {
    if (!(evento.target instanceof Element)) return;

    const item = evento.target.closest(".item-salvo");
    if (!item) return;

    if (evento.target.closest(".botao-excluir")) {
        item.remove();
        return;
    }

    const botaoConcluir = evento.target.closest(".botao-concluir");
    if (botaoConcluir) {
        const concluido = item.classList.toggle("concluido");
        botaoConcluir.setAttribute("aria-pressed", String(concluido));
        botaoConcluir.setAttribute(
            "aria-label",
            concluido ? "Reabrir item" : "Concluir item"
        );
    }
});
// Abre e fecha a pasta "Lista de hobbies".
const botaPasta = document.querySelector(".botao-pasta");

botaPasta.addEventListener("click", () => {
    listaItens.hidden = !listaItens.hidden;
});

// Salva a lista de hobbies no navegador, na mesma chave das responsabilidades.
function salvaHobbie() {
    const nomeLista = campoNomeLista.value.trim();

    const itens = Array.from(listaItens.querySelectorAll(".item-salvo")).map((item) => {
        const textos = item.querySelectorAll("span");
        return {
            texto: textos[0].textContent + " - " + textos[1].textContent,
            concluido: item.classList.contains("concluido")
        };
    });

    if (!nomeLista || itens.length === 0) {
        alert("Dê um nome à lista e adicione pelo menos um hobbie.");
        return;
    }

    const hoje = new Date();
    const mes = String(hoje.getMonth() + 1).padStart(2, "0");
    const dia = String(hoje.getDate()).padStart(2, "0");
    const data = hoje.getFullYear() + "-" + mes + "-" + dia;

    try {
        const salvas = localStorage.getItem("vp-listas");
        const listas = salvas ? JSON.parse(salvas) : [];
        listas.push({ nome: nomeLista, data, itens });
        localStorage.setItem("vp-listas", JSON.stringify(listas));
    } catch (erro) {
        alert("Não foi possível salvar a lista neste navegador.");
        return;
    }

    alert("Lista salva! Você pode encontrá-la em “Ver minhas listas”.");
    campoNomeLista.value = "";
    listaItens.innerHTML = "";
}

botaoSalvar.addEventListener("click", salvaHobbie);

botaoLimpar.addEventListener("click", () => {
    campoNomeLista.value = "";
    campoItem.value = "";
    campoData.value = "";
    listaItens.innerHTML = "";
    campoNomeLista.focus();
});
