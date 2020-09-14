import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { HomePage } from "./src/screens/HomePage";
import { AddTransactionPage } from "./src/screens/AddTransactionPage";
import { AddIncomeSource } from "./src/screens/AddIncomeSource";
import { AddAccount } from "./src/screens/AddAccount";
import { AddExpenseCategory } from "./src/screens/AddExpenseCategory";
import { StyleSheet } from "react-native";
import { LaunchScreen } from "./src/screens/LaunchScreen";

const Stack = createStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerStyle: style.header }}>
        <Stack.Screen name={"Launch"} component={LaunchScreen} options={{ title: "Launching..." }} />
        <Stack.Screen name={"Home"} component={HomePage} options={{ headerShown: false }} />
        <Stack.Screen name={"AddTransaction"} component={AddTransactionPage} options={{ title: "Add Transaction" }} />
        <Stack.Screen name={"AddIncomeSource"} component={AddIncomeSource} options={{ title: "Add Income Source" }} />
        <Stack.Screen name={"AddAccount"} component={AddAccount} options={{ title: "Add Account" }} />
        <Stack.Screen
          name={"AddExpenseCategory"}
          component={AddExpenseCategory}
          options={{ title: "Add Expense Category" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const style = StyleSheet.create({
  header: {
    backgroundColor: "#facd79",
  },
});
