import React, { useCallback, useEffect, useState } from "react";
import {
  GestureResponderEvent,
  LayoutChangeEvent,
  LayoutRectangle,
  ScrollView,
  StyleSheet,
  Text,
  UIManager,
  View
} from "react-native";
import { chunk } from "lodash";

import Coin from "./Coin";
import { buildLayoutTree, detectDropTarget, LayoutTree } from "../utils/window";
import { Dictionary } from "../utils/types";
import HScrollableGrid from "./HScrollableGrid";

interface Props {
  incomeSources: string[];
  accounts: string[];
  expenseCategories: string[];
}

export default function TransactionDragNDrop({ incomeSources, accounts, expenseCategories }: Props) {
  const layoutConfig = {
    incomeSources: 4,
    accounts: 4,
    expenses: [2, 4],
  };
  const [coinLayouts, setCoinLayouts] = useState<Dictionary<LayoutRectangle>>();

  const [numTargetCoins, setNumTargetCoins] = useState(0);
  const [numCoinsLaidOut, setNumCoinsLaidOut] = useState(0);
  const [layoutTree, setLayoutTree] = useState<LayoutTree>();
  const [dropTarget, setDropTarget] = useState<string>();

  useEffect(() => {
    setNumTargetCoins(accounts.length + expenseCategories.length);
  }, [accounts.length, expenseCategories.length]);

  useEffect(() => {
    const maxTargetCoins = layoutConfig.accounts + layoutConfig.expenses[0] * layoutConfig.expenses[1];
    const numRequiredCoins = Math.min(numTargetCoins, maxTargetCoins);
    if (numRequiredCoins && numRequiredCoins === numCoinsLaidOut) {
      const layout = buildLayoutTree(coinLayouts as Dictionary<LayoutRectangle>);
      setLayoutTree(layout);
    }
  }, [numTargetCoins, numCoinsLaidOut, coinLayouts, layoutConfig.accounts, layoutConfig.expenses[0], layoutConfig.expenses[1]]);

  const onCoinLayout = useCallback((id, event: LayoutChangeEvent, ref: View) => {
    console.log(ref, id);
    ref.measure((x, y, width, height, pageX, pageY) => {
      console.log("direct", id, pageX, pageY);
      setNumCoinsLaidOut((oldCount) => oldCount + 1);
      setCoinLayouts((oldCoinLayouts) => ({
        ...oldCoinLayouts,
        [id]: { x: pageX, y: pageY, width, height },
      }));
    });

    UIManager.measureInWindow((event as any).target, (x, y, width, height) => {
      console.log("Coin layout", id, x, y, width, height);
    });
  }, []);

  const onFingerMove = useCallback(
    (event: GestureResponderEvent | null) => {
      if (!event) {
        setDropTarget(undefined);
        return;
      }

      const { pageX: x, pageY: y } = event.nativeEvent;
      console.log("finger pos", x, y);
      const coinOver = detectDropTarget({ x, y }, layoutTree as LayoutTree, 64);
      coinOver ? setDropTarget(coinOver[0]) : setDropTarget(undefined);
    },
    [layoutTree, dropTarget]
  );

  const onDrop = useCallback(
    (id) => {
      const dropIn = dropTarget;
      setDropTarget(undefined);
      console.log("from", id, "to", dropIn);
    },
    [dropTarget]
  );

  return (
    <View style={styles.container}>
      <React.Fragment>
        <Text style={styles.sectionTitle}>Income Sources</Text>
        <HScrollableGrid numColumns={layoutConfig.incomeSources} numRows={1}>
          {incomeSources.map((s, i) => (
            <Coin
              key={i}
              size={65}
              color="#3FA173"
              label={s}
              isDraggable
              onFingerMove={onFingerMove}
              isTargeted={dropTarget === s}
              onDrop={onDrop}
            />
          ))}
        </HScrollableGrid>

        <Text style={styles.sectionTitle}>Accounts</Text>
        <HScrollableGrid numRows={1} numColumns={layoutConfig.accounts}>
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
        </HScrollableGrid>

        <Text style={styles.sectionTitle}>Expenses</Text>
        <HScrollableGrid numRows={layoutConfig.expenses[0]} numColumns={layoutConfig.expenses[1]}>
          {expenseCategories.map((coin, k) => (
            <Coin key={k} size={65} color="#ffaf60" label={coin} onLayout={onCoinLayout} isTargeted={dropTarget === coin} />
          ))}
        </HScrollableGrid>
      </React.Fragment>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  singleRow: {
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
