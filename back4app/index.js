import axios from "axios";

const urlBase = "https://parseapi.back4app.com/classes/tarefa";
const headers = {
  "X-Parse-Application-Id": "7XwcX0TvwmiYZW7Fn2lRAnPW1w1UyDfs5NA66eQF",
  "X-Parse-JavaScript-Key": "bLwvOtWnchlJPlFt3wDKf9xhHqUtJnml5SGnlpfn",
};
const headersJson = {
  ...headers,
  "Content-Type": "application/json",
};

export async function getTarefas() {
  const response = await axios.get(urlBase, {
    headers,
  });

  return response.data.results;
}

export async function adicionarTarefa(novaTarefa) {
  const response = await axios.post(
    urlBase,
    {
      descricao: novaTarefa.descricao,
      concluida: false,
    },
    {
      headers: headersJson,
    }
  );

  return response.data;
}

export async function atualizarTarefa(objectId, dadosAtualizados) {
  const response = await axios.put(
    `${urlBase}/${objectId}`,
    dadosAtualizados,
    {
      headers: headersJson,
    }
  );

  return response.data;
}

export async function deletarTarefa(objectId) {
  const response = await axios.delete(`${urlBase}/${objectId}`, {
    headers,
  });

  return response.data;
}