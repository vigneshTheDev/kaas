import React, { useState, useCallback, useEffect } from "react";
import { View, Text, StyleSheet, LayoutChangeEvent, GestureResponderEvent } from "react-native";
import Coin from "./Coin";
import { getWindowSize, Size, LayoutProps, getDraggableArea, Position } from "../utils/window";
import { Dictionary } from "../utils/types";

export default function TransactionDragNDrop() {
  const [initialLayout, setInitialLayout] = useState<LayoutProps | null>(null);
  const [useableArea, setUseableArea] = useState<Size>();
  const [fingerPos, setFingerPos] = useState<Position>();
  const [coinLayouts, setCoinLayouts] = useState<Dictionary<LayoutProps>>();

  const calcUseableArea = useCallback((layout: LayoutProps | null) => {
    if (layout) {
      const windowSize = getWindowSize();

      const area = getDraggableArea(layout, windowSize);
      setUseableArea(area);
    }
  }, []);

  const onLayoutChange = useCallback((evt: LayoutChangeEvent) => {
    if (initialLayout) {
      return;
    }

    setInitialLayout({
      ...evt.nativeEvent.layout,
    });
  }, []);

  const onFingerMove = useCallback((event: GestureResponderEvent) => {
    setFingerPos({
      x: event.nativeEvent.pageX,
      y: event.nativeEvent.pageY,
    });
  }, []);

  const onCoinLayout = useCallback((id, event: LayoutChangeEvent) => {
    const layout = { ...event.nativeEvent.layout };
    setCoinLayouts((oldCoinLayouts) => ({
      ...oldCoinLayouts,
      [id]: {
        ...layout,
      },
    }));
  }, []);

  useEffect(() => {
    calcUseableArea(initialLayout);
  }, [initialLayout?.x, initialLayout?.y]);

  console.log(coinLayouts);

  return (
    <View style={styles.container} onLayout={onLayoutChange}>
      {useableArea && (
        <React.Fragment>
          <Text style={styles.sectionTitle}>Income Sources</Text>
          <View style={styles.singlRow}>
            <Coin size={65} color="#3FA173" label="Hellooooooooooooo" isDraggable onFingerMove={onFingerMove}></Coin>
            <Coin size={65} color="#3FA173" label="Helloo" isDraggable onFingerMove={onFingerMove}></Coin>
            <Coin size={65} color="#3FA173" label="Helloo" isDraggable onFingerMove={onFingerMove}></Coin>
            <Coin size={65} color="#3FA173" label="Helloo" isDraggable onFingerMove={onFingerMove}></Coin>
          </View>

          <Text style={styles.sectionTitle}>Accounts</Text>
          <View style={styles.singlRow}>
            <Coin
              size={65}
              color="#F8C650"
              label="Bank 1"
              isDraggable
              onFingerMove={onFingerMove}
              onLayout={onCoinLayout}
            ></Coin>
            <Coin
              size={65}
              color="#F8C650"
              label="Bank 1"
              isDraggable
              onFingerMove={onFingerMove}
              onLayout={onCoinLayout}
            ></Coin>
            <Coin
              size={65}
              color="#F8C650"
              label="Bank 1"
              isDraggable
              onFingerMove={onFingerMove}
              onLayout={onCoinLayout}
            ></Coin>
            <Coin
              size={65}
              color="#F8C650"
              label="Bank 1"
              isDraggable
              onFingerMove={onFingerMove}
              onLayout={onCoinLayout}
            ></Coin>
            <Coin
              size={65}
              color="#F8C650"
              label="Bank 1"
              isDraggable
              onFingerMove={onFingerMove}
              onLayout={onCoinLayout}
            ></Coin>
          </View>

          <Text style={styles.sectionTitle}>Expenses</Text>
          <View style={[styles.singlRow, styles.multipleSingleRows]}>
            <Coin size={65} color="#FFAF60" label="Eat out" onLayout={onCoinLayout}></Coin>
            <Coin size={65} color="#FFAF60" label="Eat out" onLayout={onCoinLayout}></Coin>
            <Coin size={65} color="#FFAF60" label="Eat out" onLayout={onCoinLayout}></Coin>
            <Coin size={65} color="#FFAF60" label="Eat out" onLayout={onCoinLayout}></Coin>
          </View>
          <View style={[styles.singlRow, styles.multipleSingleRows]}>
            <Coin size={65} color="#FFAF60" label="Groceries" onLayout={onCoinLayout}></Coin>
            <Coin size={65} color="#FFAF60" label="Groceries" onLayout={onCoinLayout}></Coin>
            <Coin size={65} color="#FFAF60" label="Groceries" onLayout={onCoinLayout}></Coin>
            <Coin size={65} color="#FFAF60" label="Groceries" onLayout={onCoinLayout}></Coin>
          </View>
        </React.Fragment>
      )}
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
    // justifyContent: "space-between",
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
