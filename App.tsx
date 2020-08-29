import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { HomePage } from "./src/screens/HomePage";
import { AddTransactionPage } from "./src/screens/AddTransactionPage";

const Stack = createStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name={"Home"} component={HomePage} options={{ headerShown: false }}></Stack.Screen>
        <Stack.Screen name={"AddTransaction"} component={AddTransactionPage}></Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
