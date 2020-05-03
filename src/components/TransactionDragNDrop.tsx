import React, { useState, useCallback, useEffect, useRef } from "react";
import { View, Text, StyleSheet, LayoutChangeEvent, GestureResponderEvent, findNodeHandle, UIManager, LayoutRectangle } from "react-native";
import { chunk } from "lodash";

import Coin from "./Coin";
import { getWindowSize, Size, getDraggableArea, Position, buildLayoutTree, detectDropTarget, LayoutTree } from "../utils/window";
import { Dictionary } from "../utils/types";

interface Props {
  incomeSources: string[];
  accounts: string[];
  expenseCategories: string[];
}

export default function TransactionDragNDrop({ incomeSources, accounts, expenseCategories }: Props) {
  const [containerLayout, setContainerLayout] = useState<LayoutRectangle>();
  const [coinLayouts, setCoinLayouts] = useState<Dictionary<LayoutRectangle>>();

  const [numTargetCoins, setNumTargetCoins] = useState(0);
  const [numCoinsLaidOut, setNumCoinsLaidOut] = useState(0);
  const [layoutTree, setLayoutTree] = useState<LayoutTree>();
  const [dropTarget, setDropTarget] = useState<string>();

  const [pagedIncomeSources, setPagedIncomeSources] = useState<string[][]>();
  const [pagedAccounts, setPagedAccounts] = useState<string[][]>();
  const [pagedExpenses, setPagedExpenses] = useState<string[][][]>();

  const containerRef = useRef<View>(null);

  useEffect(() => {
    setNumTargetCoins(accounts.length + expenseCategories.length);
  }, [accounts.length, expenseCategories.length]);

  useEffect(() => {
    setPagedIncomeSources(chunk(incomeSources, 4));
    setPagedAccounts(chunk(accounts, 4));
    setPagedExpenses(chunk(chunk(expenseCategories, 4), 2));
  }, [incomeSources, accounts, expenseCategories]);

  useEffect(() => {
    if (numTargetCoins && numTargetCoins === numCoinsLaidOut) {
      const layout = buildLayoutTree(coinLayouts as Dictionary<LayoutRectangle>);
      setLayoutTree(layout);
    }
  }, [numTargetCoins, numCoinsLaidOut, coinLayouts]);

  const onContainerLayout = useCallback(
    (evt: LayoutChangeEvent) => {
      setContainerLayout({
        ...evt.nativeEvent.layout,
      });
    },
    [containerLayout]
  );

  const onCoinLayout = useCallback(
    (id, event: LayoutChangeEvent) => {
      containerRef.current != null &&
        UIManager.measureLayout(
          (event as any).target,
          findNodeHandle(containerRef.current) as number,
          () => {
            console.error("Failed to measure layout of coin");
          },
          (x, y, width, height) => {
            setNumCoinsLaidOut((oldCount) => oldCount + 1);
            setCoinLayouts((oldCoinLayouts) => ({
              ...oldCoinLayouts,
              [id]: { x, y, width, height },
            }));
          }
        );
    },
    [containerRef.current]
  );

  const onFingerMove = useCallback(
    (event: GestureResponderEvent | null) => {
      if (!event) {
        setDropTarget(undefined);
        return;
      }

      const { pageX: x, pageY: y } = event.nativeEvent;
      const coinOver = detectDropTarget({ x, y: y - (containerLayout?.y || 0) }, layoutTree as LayoutTree, 64);
      coinOver ? setDropTarget(coinOver[0]) : setDropTarget(undefined);
    },
    [containerLayout, layoutTree, dropTarget]
  );

  const onDrop = useCallback((id) => {
    const dropIn = dropTarget;
    setDropTarget(undefined);
    console.log('from', id, 'to', dropIn)
  }, [dropTarget]);

  return (
    <View style={styles.container} onLayout={onContainerLayout} ref={containerRef}>
      <React.Fragment>
        <Text style={styles.sectionTitle}>Income Sources</Text>
        <View style={styles.singlRow}>
          {incomeSources.map((s, i) => (
            <Coin key={i} size={65} color="#3FA173" label={s} isDraggable onFingerMove={onFingerMove} isTargeted={dropTarget === s} onDrop={onDrop} />
          ))}
        </View>

        <Text style={styles.sectionTitle}>Accounts</Text>
        <View style={styles.singlRow}>
          {accounts.map((a, i) => (
            <Coin
              key={i}
              size={65}
              color="#F8C650"
              label={a}
              isDraggable
              onFingerMove={onFingerMove}
              onLayout={onCoinLayout}
              onDrop={onDrop}
              isTargeted={dropTarget === a}
            />
          ))}
        </View>

        <Text style={styles.sectionTitle}>Expenses</Text>
        <View style={styles.pages}>
          {pagedExpenses?.map((rows, i) => (
            <View style={styles.page} key={`page-${i}`}>
              {rows.map((row, j) => (
                <View style={styles.singlRow} key={`page-${i}-row-${j}`}>
                  {row.map((coin, k) => (
                    <Coin
                      key={`page-${i}-row-${j}-col-${k}`}
                      size={65}
                      color="#FFAF60"
                      label={coin}
                      onLayout={onCoinLayout}
                      isTargeted={dropTarget === coin}
                    />
                  ))}
                </View>
              ))}
            </View>
          ))}
        </View>
      </React.Fragment>
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
    width: "100%",
  },
  pages: {
    flexDirection: "row",
  },
  page: {
    flexShrink: 0,
    width: "100%",
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
