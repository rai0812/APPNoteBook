import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SplashScreen from "./screens/SplashScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import HomeScreen from "./screens/HomeScreen";
import AddBookScreen from "./screens/AddBookScreen";
import ReviewScreen from "./screens/ReviewScreen";
import LibraryScreen from "./screens/LibraryScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      
      <Stack.Navigator initialRouteName="Splash"
       screenOptions={{ headerShown: false }}>
        
        <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ title: "Cadastro" }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: "Livros", headerBackVisible: false }} />
        <Stack.Screen name="AddBook" component={AddBookScreen} options={{ title: "Cadastrar Livro" }} />
        <Stack.Screen name="Review" component={ReviewScreen} options={{ title: "Avaliar Livro" }} />
        <Stack.Screen name="Library" component={LibraryScreen} options={{ title: "Minha Biblioteca" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}