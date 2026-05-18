import { View, Text } from "react-native";
import { useEffect } from "react";

export default function SplashScreen({ navigation }: any) {
  useEffect(() => {
    setTimeout(() => {
      navigation.replace("Login");
    }, 1500);
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f7a9c8" }}>
      <Text style={{ fontSize: 40, fontWeight: "bold" }}>NoteBook</Text>
    </View>
  );
}