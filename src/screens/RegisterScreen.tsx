import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { useState } from "react";
import { api } from "../services/api";

export default function RegisterScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function register() {
    if (!email || !password) {
      Alert.alert("Erro", "Preencha e-mail e senha.");
      return;
    }

    if (password.length < 4) {
      Alert.alert("Erro", "A senha precisa ter pelo menos 4 caracteres.");
      return;
    }

    try {
      const existingUser = await api.get(`/users?email=${email}`);

      if (existingUser.data.length > 0) {
        Alert.alert("Erro", "Este e-mail já está cadastrado.");
        return;
      }

     await api.post("/users", {
  id: Date.now(),
  email: email.trim(),
  password: password.trim()
});

      

      Alert.alert("Sucesso", "Cadastro realizado! Agora faça login.");
      navigation.navigate("Login");
    } catch (error: any) {
      console.log("ERRO CADASTRO:", error.message);
      console.log("DETALHES:", error.response?.data);

      Alert.alert(
        "Erro",
        "Não foi possível cadastrar. Veja o erro no terminal do Expo."
      );
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro</Text>

      <TextInput
        placeholder="E-mail"
        placeholderTextColor="#bbb"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        style={styles.input}
      />

      <TextInput
        placeholder="Senha"
        placeholderTextColor="#bbb"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <TouchableOpacity onPress={register} style={styles.button}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>Voltar para login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    justifyContent: "center",
    backgroundColor: "#fff"
  },
  title: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#f3a4c4",
    textAlign: "center",
    marginBottom: 35
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    marginBottom: 15
  },
  button: {
    backgroundColor: "#f7a9c8",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10
  },
  buttonText: {
    fontWeight: "bold",
    fontSize: 18
  },
  backText: {
    textAlign: "center",
    marginTop: 20,
    fontWeight: "bold",
    color: "#555"
  }
});