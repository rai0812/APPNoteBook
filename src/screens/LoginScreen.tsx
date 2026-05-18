import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { useState } from "react";
import { api } from "../services/api";

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function login() {
  try {
    const res = await api.get("/users");

    const user = res.data.find(
      (u: any) =>
        u.email.trim().toLowerCase() === email.trim().toLowerCase() &&
        u.password.trim() === password.trim()
    );

    if (user) {
      navigation.navigate("Home");
    } else {
      Alert.alert("Falha no login", "E-mail ou senha incorretos.");
    }
  } catch (error) {
    Alert.alert("Erro", "Erro ao conectar com servidor.");
  }
}
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

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

      <TouchableOpacity onPress={login} style={styles.button}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={styles.registerText}> Cadastrar</Text>
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
  registerText: {
    textAlign: "center",
    marginTop: 20,
    fontWeight: "bold",
    color: "#555"
  },
  help: {
    textAlign: "center",
    marginTop: 20,
    color: "#999"
  }
});