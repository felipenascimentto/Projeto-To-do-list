const listasSalvasElemento = document.querySelector(".listas-salvas");
const mensagemListas = document.querySelector(".mensagem-listas");

// Uma lista com itens só está concluída quando todos os itens foram marcados.
function listaEstaConcluida(lista) {
    return lista.itens.length > 0
        ? lista.itens.every((item) => Boolean(item.concluido))
        : Boolean(lista.concluida);
}

// Concluídos vão para o final; os ativos ficam antes deles.
function atualizarOrdemCartao(cartao, concluida) {
    cartao.classList.toggle("lista-concluida", concluida);

    if (concluida) {
        listasSalvasElemento.append(cartao);
        return;
    }

    const primeiraConcluida = listasSalvasElemento.querySelector(".lista-concluida");
    if (primeiraConcluida) {
        listasSalvasElemento.insertBefore(cartao, primeiraConcluida);
    } else {
        listasSalvasElemento.append(cartao);
    }
}

// Lê as listas do localStorage e monta um cartão para cada uma.
try {
    const dadosSalvos = localStorage.getItem("vp-listas");
    const listas = dadosSalvos ? JSON.parse(dadosSalvos) : [];

    if (!Array.isArray(listas)) {
        throw new Error("Os dados salvos não estão no formato esperado.");
    }

    if (listas.length === 0) {
        mensagemListas.textContent = "Você ainda não salvou nenhuma lista.";
    } else {

        const listasOrdenadas = [...listas].sort((listaA, listaB) =>
            Number(listaEstaConcluida(listaA)) - Number(listaEstaConcluida(listaB))
        );

        listasOrdenadas.forEach((lista) => {

            const cartao = document.createElement("article");
            cartao.className = "lista-salva";
            cartao.classList.toggle("lista-concluida", listaEstaConcluida(lista));

            const titulo = document.createElement("h2");
            titulo.textContent = lista.nome;

            const data = document.createElement("p");
            const [ano, mes, dia] = lista.data.split("-");
            data.textContent = `Data: ${dia}/${mes}/${ano}`;

            const detalhesLista = document.createElement("div");
            detalhesLista.className = "detalhes-lista";
            detalhesLista.append(titulo, data);

            const conteudo = document.createElement("div");
            conteudo.className = "conteudo-lista";
            conteudo.append(detalhesLista);

            if (lista.itens.length > 0) {

                const itens = document.createElement("ul");
                itens.className = "itens-salvos";

                lista.itens.forEach((itemSalvo) => {
                    const item = document.createElement("li");
                    const textoItem = document.createElement("span");
                    textoItem.textContent = itemSalvo.texto;

                    const controleItem = document.createElement("label");
                    controleItem.className = "controle-item";

                    const marcarItemConcluido = document.createElement("input");
                    marcarItemConcluido.type = "checkbox";
                    marcarItemConcluido.checked = Boolean(itemSalvo.concluido);

                    const textoControle = document.createElement("span");
                    textoControle.textContent = "Concluir";

                    controleItem.append(marcarItemConcluido, textoControle);
                    item.append(textoItem, controleItem);

                    marcarItemConcluido.addEventListener("change", () => {
                        const concluidoAnterior = Boolean(itemSalvo.concluido);
                        itemSalvo.concluido = marcarItemConcluido.checked;

                        try {
                            localStorage.setItem("vp-listas", JSON.stringify(listas));
                            atualizarOrdemCartao(cartao, listaEstaConcluida(lista));
                            mensagemListas.textContent = "";
                        } catch (erro) {
                            itemSalvo.concluido = concluidoAnterior;
                            marcarItemConcluido.checked = concluidoAnterior;
                            console.error("Não foi possível concluir o item da lista.", erro);
                            mensagemListas.textContent = "Não foi possível salvar a alteração neste navegador.";
                        }
                    });

                    itens.append(item);
                });

                detalhesLista.append(itens);
            } else {

                const controleConclusao = document.createElement("label");
                controleConclusao.className = "controle-conclusao";

                const marcarConcluida = document.createElement("input");
                marcarConcluida.type = "checkbox";
                marcarConcluida.checked = Boolean(lista.concluida);

                const textoConclusao = document.createElement("span");
                textoConclusao.textContent = "Concluir";

                controleConclusao.append(marcarConcluida, textoConclusao);
                conteudo.append(controleConclusao);

                marcarConcluida.addEventListener("change", () => {
                    const concluidaAnterior = Boolean(lista.concluida);
                    lista.concluida = marcarConcluida.checked;

                    try {
                        localStorage.setItem("vp-listas", JSON.stringify(listas));
                        atualizarOrdemCartao(cartao, marcarConcluida.checked);
                        mensagemListas.textContent = "";
                    } catch (erro) {
                        lista.concluida = concluidaAnterior;
                        marcarConcluida.checked = concluidaAnterior;
                        console.error("Não foi possível concluir a responsabilidade.", erro);
                        mensagemListas.textContent = "Não foi possível salvar a alteração neste navegador.";
                    }
                });
            }

            cartao.append(conteudo);
            // Excluir: tira a lista do array, grava de novo e remove o cartão.
            const excluirLista = document.createElement("button");
            excluirLista.type = "button";
            excluirLista.className = "botao-excluir-lista";
            excluirLista.textContent = "Excluir";

            excluirLista.addEventListener("click", () => {
            const posicao = listas.indexOf(lista);
            listas.splice(posicao, 1);
            localStorage.setItem("vp-listas", JSON.stringify(listas));
            cartao.remove();
        });

            cartao.append(excluirLista);
            listasSalvasElemento.append(cartao);
        });
    }
} catch (erro) {

    console.error("Não foi possível carregar as listas salvas.", erro);
    mensagemListas.textContent = "Não foi possível carregar as listas salvas neste navegador.";
}
