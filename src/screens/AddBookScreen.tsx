import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Image,
} from "react-native";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { api } from "../services/api";

export default function AddBookScreen({ navigation }: any) {
  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");
  const [cover, setCover] = useState("");

  async function pickImage() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Permissão necessária",
        "Permita acesso à galeria para escolher uma capa."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setCover(result.assets[0].uri);
    }
  }

  async function save() {
    if (!name || !author) {
      Alert.alert("Atenção", "Preencha o nome e o autor do livro.");
      return;
    }

    try {
      await api.post("/books", {
        name,
        author,
        cover,
      });

      Alert.alert("Sucesso", "Livro cadastrado!");
      navigation.navigate("Home");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar o livro.");
      console.log(error);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastrar Livro</Text>

      <TouchableOpacity style={styles.coverBox} onPress={pickImage}>
        {cover ? (
          <Image source={{ uri: cover }} style={styles.coverImage} />
        ) : (
          <Text style={styles.coverText}>+ Importar foto da capa</Text>
        )}
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Nome do livro"
        placeholderTextColor="#999"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Autor"
        placeholderTextColor="#999"
        value={author}
        onChangeText={setAuthor}
      />

      <TouchableOpacity style={styles.saveButton} onPress={save}>
        <Text style={styles.saveText}>Salvar Livro</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate("Home")}
      >
        <Text style={styles.backText}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4efd1",
    padding: 25,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#d6005c",
    textAlign: "center",
    marginBottom: 30,
  },
  coverBox: {
    width: 170,
    height: 230,
    backgroundColor: "#fff",
    borderRadius: 18,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
    elevation: 5,
    borderWidth: 2,
    borderColor: "#f4a3c4",
    overflow: "hidden",
  },
  coverImage: {
    width: "100%",
    height: "100%",
  },
  coverText: {
    color: "#d6005c",
    fontWeight: "bold",
    textAlign: "center",
    paddingHorizontal: 15,
    fontSize: 16,
  },
  input: {
    backgroundColor: "#fff",
    height: 55,
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 17,
    marginBottom: 18,
    elevation: 3,
  },
  saveButton: {
    backgroundColor: "#d6005c",
    height: 55,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
    elevation: 4,
  },
  saveText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  backButton: {
    marginTop: 18,
    alignItems: "center",
  },
  backText: {
    color: "#d6005c",
    fontSize: 16,
    fontWeight: "bold",
  },
});