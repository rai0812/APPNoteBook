import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function LibraryScreen({ navigation }: any) {
  const [reviews, setReviews] = useState<any[]>([]);

  async function loadReviews() {
    try {
      const res = await api.get("/reviews");
      setReviews(res.data);
    } catch (error) {
      console.log("Erro ao carregar avaliações:", error);
    }
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", loadReviews);
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Avaliações</Text>

      <FlatList
        data={reviews}
        keyExtractor={(item: any) => String(item.id)}
        contentContainerStyle={styles.list}
        renderItem={({ item }: any) => (
          <View style={styles.card}>
            {item.bookCover ? (
              <Image source={{ uri: item.bookCover }} style={styles.cover} />
            ) : (
              <View style={styles.noCover}>
                <Text style={styles.noCoverText}>📖</Text>
              </View>
            )}

            <View style={styles.info}>
              <Text style={styles.bookName}>{item.bookName}</Text>

              <Text style={styles.rating}>
                {"★".repeat(item.rating)}{"☆".repeat(5 - item.rating)}
              </Text>

              <Text style={styles.comment}>{item.comment}</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhuma avaliação cadastrada</Text>
        }
      />

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate("Home")}
      >
        <Text style={styles.backText}>Voltar para livros</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5efc8",
    paddingTop: 55,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#d6005c",
    textAlign: "center",
    marginBottom: 20,
  },
  list: {
    paddingBottom: 90,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 12,
    marginBottom: 14,
    flexDirection: "row",
    elevation: 4,
  },
  cover: {
    width: 70,
    height: 100,
    borderRadius: 10,
    marginRight: 12,
  },
  noCover: {
    width: 70,
    height: 100,
    borderRadius: 10,
    marginRight: 12,
    backgroundColor: "#f4a3c4",
    justifyContent: "center",
    alignItems: "center",
  },
  noCoverText: {
    fontSize: 30,
  },
  info: {
    flex: 1,
  },
  bookName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  rating: {
    fontSize: 22,
    color: "#d6005c",
    marginVertical: 4,
  },
  comment: {
    fontSize: 15,
    color: "#555",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    color: "#777",
    fontSize: 16,
  },
  backButton: {
    backgroundColor: "#d6005c",
    height: 52,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 25,
  },
  backText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
  },
});