import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Banner from "./src/components/Banner";
import TransactionDragNDrop from "./src/components/TransactionDragNDrop";

export default function App() {
  return (
    <View style={styles.container}>
      <Banner balance={100000} />
      <TransactionDragNDrop />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
