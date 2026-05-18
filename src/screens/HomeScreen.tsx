import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Image,
} from "react-native";
import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function HomeScreen({ navigation }: any) {
  const [books, setBooks] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  async function load() {
    try {
      const res = await api.get("/books");
      setBooks(res.data);
    } catch (error) {
      console.log("Erro ao carregar livros:", error);
    }
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", load);
    return unsubscribe;
  }, [navigation]);

  const filteredBooks = books.filter((book: any) => {
    const nomeLivro = book.name || book.titulo || "";
    return nomeLivro.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <View style={styles.container}>
      <View style={styles.searchBox}>
        <Text style={styles.searchIcon}>🔍</Text>

        <TextInput
          style={styles.searchInput}
          placeholder="Procurar livros..."
          placeholderTextColor="#999"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <FlatList
        data={filteredBooks}
        keyExtractor={(item: any) => String(item.id)}
        contentContainerStyle={styles.list}
        renderItem={({ item }: any) => (
          <TouchableOpacity
            style={styles.bookCard}
            onPress={() => navigation.navigate("Review", { book: item })}
          >
            {item.cover || item.capa ? (
              <Image
                source={{ uri: item.cover || item.capa }}
                style={styles.coverImage}
              />
            ) : (
              <View style={styles.noCover}>
                <Text style={styles.noCoverText}>📖</Text>
              </View>
            )}

            <View style={{ flex: 1 }}>
              <Text style={styles.bookTitle}>{item.name || item.titulo}</Text>
              <Text style={styles.bookAuthor}>{item.author || item.autor}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhum livro encontrado</Text>
        }
      />

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.tabButton}>
          <Text style={styles.iconActive}>📖</Text>
          <Text style={styles.activeText}>Livros</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => navigation.navigate("AddBook")}
        >
          <Text style={styles.icon}>➕</Text>
          <Text style={styles.tabText}>Novo Livro</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => navigation.navigate("Library")}
        >
          <Text style={styles.icon}>☆</Text>
          <Text style={styles.tabText}>Avaliações</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4efd1",
    paddingTop: 55,
  },
  searchBox: {
    height: 65,
    backgroundColor: "#fff",
    borderRadius: 35,
    marginHorizontal: 28,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    elevation: 5,
  },
  searchIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 20,
    color: "#333",
  },
  list: {
    padding: 20,
    paddingBottom: 120,
  },
  bookCard: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 15,
    marginBottom: 12,
    elevation: 3,
    flexDirection: "row",
    alignItems: "center",
  },
  coverImage: {
    width: 55,
    height: 75,
    borderRadius: 8,
    marginRight: 12,
  },
  noCover: {
    width: 55,
    height: 75,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: "#f4a3c4",
    justifyContent: "center",
    alignItems: "center",
  },
  noCoverText: {
    fontSize: 24,
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  bookAuthor: {
    fontSize: 15,
    color: "#777",
    marginTop: 5,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    color: "#777",
  },
  bottomBar: {
    height: 95,
    backgroundColor: "#f4a3c4",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#d98aad",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  tabButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  iconActive: {
    fontSize: 30,
    color: "#d6005c",
  },
  icon: {
    fontSize: 30,
    color: "#333",
  },
  activeText: {
    marginTop: 5,
    fontSize: 15,
    color: "#d6005c",
    fontWeight: "bold",
  },
  tabText: {
    marginTop: 5,
    fontSize: 15,
    color: "#333",
    fontWeight: "bold",
  },
});