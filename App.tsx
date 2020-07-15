import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import Banner from "./src/components/Banner";
import TransactionDragNDrop from "./src/components/TransactionDragNDrop";

export default function App() {
  const [incomeSources] = useState(["Salary", "Interest", "Rent", "Dividend", "Game Dev"]);
  const [accounts] = useState(["Salary A/C", "Savings", "FD", "Stocks", "Overnight Funds"]);
  const [expenseCategories] = useState([
    "Tuition Fees",
    "Groceries",
    "Water",
    "Cable TV",
    "Streaming Fee",
    "Fuel",
    "Eat out",
    "Gadgets",
    "Books",
    "Grooming",
    "Grooming",
    "Grooming",
    "Grooming",
    "Grooming",
    "Grooming",
    "Grooming",
    "Grooming",
    "Grooming",
    "Grooming",
    "Grooming",
    "Hello"
  ]);

  return (
    <View style={styles.container}>
      <Banner balance={100000} />
      <TransactionDragNDrop incomeSources={incomeSources} expenseCategories={expenseCategories} accounts={accounts} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
