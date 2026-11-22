const campoItem = document.querySelector(".campo-item");
const campoData = document.querySelector(".campo-data");
const botaoAdicionar = document.querySelector(".botao-adicionar");
const botaoSalvar = document.querySelector(".botao-salvar");
const botaoLimpar = document.querySelector(".botao-limpar");
const listaItens = document.querySelector(".lista-itens");
const campoNomeLista = document.querySelector(".campo-nome-lista");
const linkVerLista = document.querySelector(".ver-lista");
const CHAVE_LISTAS = "vp-listas";
let podeVerLista = false;

// Impede abrir "Ver minhas listas" com dados ainda não salvos.
linkVerLista.addEventListener("click", (evento) => {
    const camposVazios = !campoNomeLista.value.trim()
        && !campoData.value
        && !campoItem.value.trim()
        && listaItens.children.length === 0;

    if (!podeVerLista && !camposVazios) {
        evento.preventDefault();
        alert("Clique em Salvar ou Limpar antes de ver suas listas.");
    }
});

function liberarLinkVerLista() {
    podeVerLista = true;
    linkVerLista.removeAttribute("aria-disabled");
}

// Adiciona um item à lista que está sendo montada (ainda não salva).
botaoAdicionar.addEventListener("click", () => {
    const nomeLista = campoNomeLista.value.trim();
    const texto = campoItem.value.trim();
    const data = campoData.value;

    if (!nomeLista || !data || !texto) {
        alert("Preencha o nome da lista, a data e o item ou ação.");
        return;
    }

    const item = document.createElement("li");
    item.className = "item-salvo";

    const detalhes = document.createElement("div");
    detalhes.className = "detalhes-item";

    const nome = document.createElement("span");
    nome.textContent = texto;

    detalhes.append(nome);

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
    campoItem.focus();
});

// Grava a lista completa no localStorage.
botaoSalvar.addEventListener("click", () => {
    const nomeLista = campoNomeLista.value.trim();
    const data = campoData.value;

    if (!nomeLista || !data) {
        alert("Preencha o nome da lista e a data antes de salvar.");
        return;
    }

    const itens = Array.from(listaItens.querySelectorAll(".item-salvo")).map((item) => ({
        texto: item.querySelector(".detalhes-item").textContent,
        concluido: item.classList.contains("concluido")
    }));

    try {
        const listasSalvas = localStorage.getItem(CHAVE_LISTAS);
        const listas = listasSalvas ? JSON.parse(listasSalvas) : [];

        if (!Array.isArray(listas)) {
            throw new Error("Os dados salvos não estão no formato esperado.");
        }

        listas.push({ nome: nomeLista, data, itens });
        localStorage.setItem(CHAVE_LISTAS, JSON.stringify(listas));
    } catch (erro) {
        console.error("Não foi possível salvar a lista.", erro);
        alert("Não foi possível salvar a lista neste navegador.");
        return;
    }

    alert("Lista salva! Você pode encontrá-la em “Ver minhas listas”.");
    campoNomeLista.value = "";
    campoData.value = "";
    while (listaItens.firstChild) {
        listaItens.firstChild.remove();
    }
    document.querySelector(".secao-itens").open = false;
    liberarLinkVerLista();
});

botaoLimpar.addEventListener("click", () => {
    campoNomeLista.value = "";
    campoData.value = "";
    campoItem.value = "";
    while (listaItens.firstChild) {
        listaItens.firstChild.remove();
    }
    document.querySelector(".secao-itens").open = false;
    liberarLinkVerLista();
    campoNomeLista.focus();
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
