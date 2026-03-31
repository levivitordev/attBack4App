import {
  adicionarTarefa,
  atualizarTarefa,
  deletarTarefa,
  getTarefas,
} from "@/back4app";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";

export default function TarefasPage() {
  const queryClient = useQueryClient();

  const { data, isFetching } = useQuery({
    queryKey: ["tarefas"],
    queryFn: getTarefas,
  });

  const mutation = useMutation({
    mutationFn: adicionarTarefa,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tarefas"] });
    },
  });

  const atualizarMutation = useMutation({
    mutationFn: ({ objectId, dados }) => atualizarTarefa(objectId, dados),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tarefas"] });
    },
    onError: (error) => {
      console.log("Erro ao atualizar:", error);
      Alert.alert("Erro", "Não foi possível atualizar a tarefa");
    },
  });

  const deletarMutation = useMutation({
    mutationFn: deletarTarefa,
    onSuccess: () => {
      console.log("Tarefa deletada com sucesso");
      queryClient.invalidateQueries({ queryKey: ["tarefas"] });
    },
    onError: (error) => {
      console.log("Erro ao deletar:", error);
      Alert.alert("Erro", "Não foi possível excluir a tarefa");
    },
  });

  const [descricao, setDescricao] = useState("");

  function handleAdicionarTarefaPress() {
    if (descricao.trim() === "") {
      Alert.alert("Descrição inválida", "Preencha a descrição da tarefa", [
        { text: "OK", onPress: () => {} },
      ]);
      return;
    }

    mutation.mutate({ descricao });
    setDescricao("");
  }

  function handleToggleConcluida(t) {
    atualizarMutation.mutate({
      objectId: t.objectId,
      dados: {
        concluida: !t.concluida,
      },
    });
  }

  function handleDelete(objectId) {
    console.log("Tentando excluir objectId:", objectId);
    deletarMutation.mutate(objectId);
  }

  return (
    <View style={styles.container}>
      {(isFetching ||
        mutation.isPending ||
        atualizarMutation.isPending ||
        deletarMutation.isPending) && <ActivityIndicator size="large" />}

      <TextInput
        style={styles.input}
        placeholder="Descrição"
        value={descricao}
        onChangeText={setDescricao}
      />

      <Button
        title="Adicionar Tarefa"
        onPress={handleAdicionarTarefaPress}
        disabled={mutation.isPending}
      />

      <View style={styles.hr} />

      <View style={styles.tasksContainer}>
        {data?.map((t) => (
          <View key={t.objectId} style={styles.taskItem}>
            <Text style={[styles.taskText, t.concluida && styles.strikethroughText]}>
              {t.descricao}
            </Text>

            <Switch
              value={!!t.concluida}
              onValueChange={() => handleToggleConcluida(t)}
            />

            <Button
              title="Excluir"
              color="#d9534f"
              onPress={() => handleDelete(t.objectId)}
            />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 10,
  },
  tasksContainer: {
    paddingLeft: 15,
    width: "100%",
  },
  input: {
    borderColor: "black",
    borderWidth: 1,
    width: "90%",
    marginBottom: 5,
    padding: 8,
  },
  hr: {
    height: 1,
    backgroundColor: "black",
    width: "95%",
    marginVertical: 10,
  },
  taskItem: {
    width: "95%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 10,
  },
  taskText: {
    flex: 1,
    fontSize: 16,
  },
  strikethroughText: {
    textDecorationLine: "line-through",
    textDecorationStyle: "solid",
    textDecorationColor: "red",
  },
});