import React, { useCallback, useEffect, useState } from "react";
import { GestureResponderEvent, LayoutChangeEvent, LayoutRectangle, StyleSheet, Text, View } from "react-native";
import { NavigationProp } from "@react-navigation/native";

import Coin from "./Coin";
import { buildLayoutTree, detectDropTarget, LayoutTree } from "../utils/window";
import { Dictionary } from "../utils/types";
import HScrollableGrid from "./HScrollableGrid";

interface Props {
  incomeSources: string[];
  accounts: string[];
  expenseCategories: string[];
  navigation: NavigationProp<any>;
}

export default function TransactionDragNDrop({ incomeSources, accounts, expenseCategories, navigation }: Props) {
  const layoutConfig = {
    incomeSources: 4,
    accounts: 4,
    expenses: [2, 4],
  };
  const [coinRefs, setCoinRefs] = useState<Dictionary<View>>();

  const [numTargetCoins, setNumTargetCoins] = useState(0);
  const [numCoinsLaidOut, setNumCoinsLaidOut] = useState(0);
  const [layoutTree, setLayoutTree] = useState<LayoutTree>();
  const [dropTarget, setDropTarget] = useState<string>();
  const [draggingCategory, setDraggingCategory] = useState<string>();

  const refreshLayoutTree = useCallback(async () => {
    // Only accounts and expenses can be drop destinations. So, we maintain the position of only those coins.
    const maxTargetCoins = layoutConfig.accounts + layoutConfig.expenses[0] * layoutConfig.expenses[1];
    const numRequiredCoins = Math.min(numTargetCoins, maxTargetCoins);

    if (numRequiredCoins && numRequiredCoins <= numCoinsLaidOut && coinRefs) {
      const layout = await buildLayoutTree(coinRefs);
      setLayoutTree(layout);
    }
  }, [numTargetCoins, numCoinsLaidOut, layoutConfig.accounts, layoutConfig.expenses[0], layoutConfig.expenses[1]]);

  useEffect(() => {
    setNumTargetCoins(accounts.length + expenseCategories.length);
  }, [accounts.length, expenseCategories.length]);

  useEffect(() => {
    refreshLayoutTree();
  }, [numTargetCoins, numCoinsLaidOut, layoutConfig.accounts, layoutConfig.expenses[0], layoutConfig.expenses[1]]);

  const onCoinLayout = useCallback((id, event: LayoutChangeEvent, ref: View) => {
    setNumCoinsLaidOut((oldCount) => oldCount + 1);
    setCoinRefs((oldCoinRefs) => ({
      ...oldCoinRefs,
      [id]: ref,
    }));
  }, []);

  const onFingerMove = useCallback(
    (event: GestureResponderEvent | null, coinId) => {
      if (!event) {
        setDropTarget(undefined);
        return;
      }

      if (incomeSources.includes(coinId)) {
        setDraggingCategory("income");
      } else {
        setDraggingCategory("account");
      }

      const { pageX: x, pageY: y } = event.nativeEvent;
      console.log("finger pos", x, y);
      const coinOver = detectDropTarget({ x, y }, layoutTree as LayoutTree, 64);
      coinOver ? setDropTarget(coinOver[0]) : setDropTarget(undefined);
    },
    [layoutTree, dropTarget, draggingCategory, incomeSources]
  );

  const onDrop = useCallback(
    (id) => {
      const dropIn = dropTarget;
      setDropTarget(undefined);

      if (dropIn) {
        navigation.navigate("AddTransaction", {
          from: id,
          to: dropIn,
        });
      }
    },
    [dropTarget]
  );

  return (
    <View style={styles.container}>
      <React.Fragment>
        <Text style={styles.sectionTitle}>Income Sources</Text>
        <HScrollableGrid
          numColumns={layoutConfig.incomeSources}
          numRows={1}
          onScroll={refreshLayoutTree}
          elevated={draggingCategory === "income"}
        >
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
        <HScrollableGrid
          numRows={1}
          numColumns={layoutConfig.accounts}
          onScroll={refreshLayoutTree}
          elevated={draggingCategory === "account"}
        >
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
        <HScrollableGrid numRows={layoutConfig.expenses[0]} numColumns={layoutConfig.expenses[1]} onScroll={refreshLayoutTree}>
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
