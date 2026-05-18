import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from "react-native";
import { useState } from "react";
import { api } from "../services/api";

export default function ReviewScreen({ route, navigation }: any) {
  const { book } = route.params;

  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);

  const bookName = book.name || book.titulo;
  const bookAuthor = book.author || book.autor;
  const bookCover = book.cover || book.capa;

  async function save() {
    if (rating === 0) {
      Alert.alert("Atenção", "Escolha uma nota de 1 a 5 estrelas.");
      return;
    }

    if (!comment.trim()) {
      Alert.alert("Atenção", "Escreva um comentário.");
      return;
    }

    try {
      await api.post("/reviews", {
        bookId: book.id,
        bookName,
        bookAuthor,
        bookCover,
        rating,
        comment,
      });

      Alert.alert("Sucesso", "Avaliação salva!");
      navigation.navigate("Library");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar a avaliação.");
      console.log(error);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.keyboardView}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Avaliar Livro</Text>

          <View style={styles.bookBox}>
            {bookCover ? (
              <Image source={{ uri: bookCover }} style={styles.coverImage} />
            ) : (
              <View style={styles.noCover}>
                <Text style={styles.noCoverText}>📖</Text>
              </View>
            )}

            <Text style={styles.bookName}>{bookName}</Text>
            <Text style={styles.bookAuthor}>{bookAuthor}</Text>
          </View>

          <Text style={styles.label}>Sua nota</Text>

          <View style={styles.starsBox}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => setRating(star)}>
                <Text style={styles.star}>{star <= rating ? "★" : "☆"}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.ratingText}>{rating} de 5 estrelas</Text>

          <Text style={styles.label}>Comentário</Text>

          <TextInput
            style={styles.commentInput}
            placeholder="Escreva sua opinião sobre o livro..."
            placeholderTextColor="#999"
            value={comment}
            onChangeText={setComment}
            multiline
            textAlignVertical="top"
            returnKeyType="done"
            blurOnSubmit={true}
          />

          <TouchableOpacity style={styles.saveButton} onPress={save}>
            <Text style={styles.saveText}>Salvar Avaliação</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate("Home")}
          >
            <Text style={styles.backText}>Voltar</Text>
          </TouchableOpacity>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
    backgroundColor: "#f5efc8",
  },
  container: {
    flex: 1,
    backgroundColor: "#f5efc8",
  },
  content: {
    padding: 25,
    paddingTop: 55,
    paddingBottom: 80,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#d6005c",
    textAlign: "center",
    marginBottom: 20,
  },
  bookBox: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 18,
    alignItems: "center",
    marginBottom: 20,
    elevation: 4,
  },
  coverImage: {
    width: 115,
    height: 160,
    borderRadius: 12,
    marginBottom: 12,
  },
  noCover: {
    width: 115,
    height: 160,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: "#f4a3c4",
    justifyContent: "center",
    alignItems: "center",
  },
  noCoverText: {
    fontSize: 45,
  },
  bookName: {
    fontSize: 21,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  bookAuthor: {
    fontSize: 15,
    color: "#777",
    marginTop: 4,
    textAlign: "center",
  },
  label: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#d6005c",
    marginBottom: 8,
  },
  starsBox: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 5,
  },
  star: {
    fontSize: 42,
    color: "#d6005c",
    marginHorizontal: 4,
  },
  ratingText: {
    textAlign: "center",
    color: "#555",
    marginBottom: 18,
    fontWeight: "bold",
  },
  commentInput: {
    backgroundColor: "#fff",
    minHeight: 130,
    borderRadius: 18,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
    elevation: 3,
  },
  saveButton: {
    backgroundColor: "#d6005c",
    height: 55,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
  saveText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  backButton: {
    marginTop: 16,
    alignItems: "center",
  },
  backText: {
    color: "#d6005c",
    fontSize: 16,
    fontWeight: "bold",
  },
});