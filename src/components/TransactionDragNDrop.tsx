import React, { useRef, useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, useWindowDimensions, LayoutChangeEvent } from "react-native";
import Coin from "./Coin";

export default function TransactionDragNDrop() {
  const onLayoutChange = useCallback((evt) => {
    console.log("layout", evt.nativeEvent.layout.y);
  }, []);

  return (
    <View style={styles.container} onLayout={onLayoutChange}>
      <Text style={styles.sectionTitle}>Income Sources</Text>
      <View style={styles.singlRow}>
        <Coin size={65} color="#3FA173" label="Hellooooooooooooo"></Coin>
        <Coin size={65} color="#3FA173" label="Helloo"></Coin>
        <Coin size={65} color="#3FA173" label="Helloo"></Coin>
        <Coin size={65} color="#3FA173" label="Helloo"></Coin>
      </View>

      <Text style={styles.sectionTitle}>Accounts</Text>
      <View style={styles.singlRow}>
        <Coin size={65} color="#F8C650" label="Bank 1"></Coin>
        <Coin size={65} color="#F8C650" label="Bank 1"></Coin>
        <Coin size={65} color="#F8C650" label="Bank 1"></Coin>
        <Coin size={65} color="#F8C650" label="Bank 1"></Coin>
      </View>

      <Text style={styles.sectionTitle}>Expenses</Text>
      <View style={[styles.singlRow, styles.multipleSingleRows]}>
        <Coin size={65} color="#FFAF60" label="Eat out"></Coin>
        <Coin size={65} color="#FFAF60" label="Eat out"></Coin>
        <Coin size={65} color="#FFAF60" label="Eat out"></Coin>
        <Coin size={65} color="#FFAF60" label="Eat out"></Coin>
      </View>
      <View style={[styles.singlRow, styles.multipleSingleRows]}>
        <Coin size={65} color="#FFAF60" label="Groceries"></Coin>
        <Coin size={65} color="#FFAF60" label="Groceries"></Coin>
        <Coin size={65} color="#FFAF60" label="Groceries"></Coin>
        <Coin size={65} color="#FFAF60" label="Groceries"></Coin>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  singlRow: {
    flexShrink: 0,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  multipleSingleRows: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#888888",
    lineHeight: 19,
    textTransform: "uppercase",
    marginBottom: 8,
    marginTop: 20,
  },
});
