import React from "react";
import { GestureResponderEvent, LayoutChangeEvent, StyleSheet, Text, View } from "react-native";
import { NavigationProp } from "@react-navigation/native";

import Coin, { CoinType } from "./Coin";
import { buildLayoutTree, detectDropTarget, LayoutTree } from "../utils/window";
import { Dictionary } from "../utils/types";
import HScrollableGrid from "./HScrollableGrid";
import { AccountRecord, ExpenseCategoryRecord, IncomeSourceRecord } from "../utils/sqlite-model";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

interface Props {
  incomeSources: IncomeSourceRecord[];
  accounts: AccountRecord[];
  expenseCategories: ExpenseCategoryRecord[];
  navigation: NavigationProp<any>;
}

interface State {
  numTargetCoins: number;
  numCoinsLaidOut: number;
  accountLayoutTree: LayoutTree;
  expenseLayoutTree: LayoutTree;
  dropTarget: number | null;
  dropTargetType: CoinType | null;
  draggingCategory: CoinType | null;
}

export default class TransactionDragNDrop extends React.Component<Props, State> {
  layoutConfig = {
    incomeSources: 4,
    accounts: 4,
    expenses: [2, 4],
  };
  accountCoinRefs: Dictionary<View> = {};
  expenseCoinRefs: Dictionary<View> = {};

  state: State = {
    numTargetCoins: this.calcNumTargetCoins(),
    numCoinsLaidOut: 0,
    accountLayoutTree: {},
    expenseLayoutTree: {},
    dropTarget: null,
    draggingCategory: null,
    dropTargetType: null,
  };

  constructor(props: Props) {
    super(props);
  }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>) {
    if (
      prevProps.accounts.length !== this.props.accounts.length ||
      prevProps.expenseCategories.length !== this.props.expenseCategories.length
    ) {
      this.setState({
        numTargetCoins: this.calcNumTargetCoins(),
      });
    }

    if (
      prevState.numTargetCoins !== this.state.numTargetCoins ||
      prevState.numCoinsLaidOut !== this.state.numCoinsLaidOut
    ) {
      this.refreshLayoutTree();
    }
  }

  calcNumTargetCoins() {
    const { accounts, expenseCategories } = this.props;
    return accounts.length + expenseCategories.length;
  }

  refreshLayoutTree = async () => {
    const { numTargetCoins, numCoinsLaidOut } = this.state;
    const { accountCoinRefs, expenseCoinRefs } = this;

    // Only accounts and expenses can be drop destinations. So, we maintain the position of only those coins.
    const numRequiredCoins = numTargetCoins;

    if (numRequiredCoins && numRequiredCoins <= numCoinsLaidOut && accountCoinRefs) {
      const accountLayoutTree = await buildLayoutTree(accountCoinRefs);
      const expenseLayoutTree = await buildLayoutTree(expenseCoinRefs);
      this.setState({
        accountLayoutTree,
        expenseLayoutTree,
      });
    }
  };

  onCoinLayout = (id: number, event: LayoutChangeEvent, ref: View, coinType: CoinType) => {
    this.setState((oldState) => ({
      numCoinsLaidOut: oldState.numCoinsLaidOut + 1,
    }));

    if (coinType === "account") {
      this.accountCoinRefs = {
        ...this.accountCoinRefs,
        [id]: ref,
      };
    } else {
      this.expenseCoinRefs = {
        ...this.expenseCoinRefs,
        [id]: ref,
      };
    }
  };

  getCoinName(id: number, type: CoinType) {
    const { incomeSources, accounts, expenseCategories } = this.props;
    const coinArray: any[] =
      type === "incomeSource" ? incomeSources : type === "account" ? accounts : expenseCategories;

    const coin = coinArray.find((c) => c.id === id);

    return coin && coin.name;
  }

  onDrop = (sourceId: number, sourceType: CoinType) => {
    const { navigation } = this.props;
    const { dropTarget, dropTargetType } = this.state;
    this.setState({
      dropTarget: null,
    });

    const droppedIntoSelf = sourceId === dropTarget && sourceType === dropTargetType;

    if (dropTarget != null && !droppedIntoSelf) {
      navigation.navigate("AddTransaction", {
        from: sourceId,
        fromName: this.getCoinName(sourceId, sourceType),
        fromType: sourceType,
        to: dropTarget,
        toName: this.getCoinName(dropTarget, dropTargetType as CoinType),
        toType: dropTargetType,
      });
    }
  };

  onAddIncomeSource = () => {
    this.navigate("AddIncomeSource");
  };

  onAddAccount = () => {
    this.navigate("AddAccount");
  };

  onAddExpenseCategory = () => {
    this.navigate("AddExpenseCategory");
  };

  navigate(screen: string) {
    const { navigation } = this.props;
    navigation.navigate(screen);
  }

  onFingerMove = (event: GestureResponderEvent | null, coinId: number, sourceType: CoinType) => {
    const { accountLayoutTree, expenseLayoutTree } = this.state;

    if (!event) {
      this.setState({
        dropTarget: null,
      });
      return;
    }

    this.setState({ draggingCategory: sourceType });

    const { pageX: x, pageY: y } = event.nativeEvent;

    if (sourceType === "incomeSource") {
      const coinOver = detectDropTarget({ x, y }, accountLayoutTree as LayoutTree, 64);
      this.setState({
        dropTarget: coinOver ? +coinOver[0] : null,
        dropTargetType: "account",
      });
    } else {
      const coinOver = detectDropTarget({ x, y }, expenseLayoutTree as LayoutTree, 64);
      const accountCoinOver = !coinOver && detectDropTarget({ x, y }, accountLayoutTree, 64);

      this.setState({
        dropTarget: coinOver ? +coinOver[0] : accountCoinOver ? +accountCoinOver[0] : null,
        dropTargetType: coinOver ? "expenseCategory" : accountCoinOver ? "account" : null,
      });
    }
  };

  render() {
    const { incomeSources, accounts, expenseCategories } = this.props;
    const { draggingCategory, dropTarget, dropTargetType } = this.state;
    return (
      <View style={styles.container}>
        <React.Fragment>
          {/* Income Sources */}
          <Text style={styles.sectionTitle}>Income Sources</Text>
          <HScrollableGrid
            numColumns={this.layoutConfig.incomeSources}
            numRows={1}
            onScroll={this.refreshLayoutTree}
            elevated={draggingCategory === "incomeSource"}
          >
            {[
              ...incomeSources.map((s, i) => (
                <Coin
                  key={i}
                  size={65}
                  color="#5bbf90"
                  label={s.name}
                  id={s.id}
                  type={"incomeSource"}
                  isDraggable
                  onFingerMove={this.onFingerMove}
                  onDrop={this.onDrop}
                />
              )),
              <Coin
                key={-1}
                size={65}
                color="#76c9a2"
                label="Add"
                type={"incomeSource"}
                icon={faPlus}
                onClick={this.onAddIncomeSource}
              />,
            ]}
          </HScrollableGrid>

          {/* Accounts */}
          <Text style={styles.sectionTitle}>Accounts</Text>
          <HScrollableGrid
            numRows={1}
            numColumns={this.layoutConfig.accounts}
            onScroll={this.refreshLayoutTree}
            elevated={draggingCategory === "account"}
          >
            {[
              ...accounts.map((a, i) => (
                <Coin
                  key={i}
                  size={65}
                  color="#f9d173"
                  label={a.name}
                  id={a.id}
                  type={"account"}
                  isDraggable
                  onFingerMove={this.onFingerMove}
                  onLayout={this.onCoinLayout}
                  onDrop={this.onDrop}
                  isTargeted={dropTarget === a.id && dropTargetType === "account"}
                />
              )),
              <Coin
                key={-1}
                size={65}
                color="#fad98a"
                label="Add"
                type={"account"}
                onClick={this.onAddAccount}
                icon={faPlus}
              />,
            ]}
          </HScrollableGrid>

          {/* Expense Categories */}
          <Text style={styles.sectionTitle}>Expenses</Text>
          <HScrollableGrid
            numRows={this.layoutConfig.expenses[0]}
            numColumns={this.layoutConfig.expenses[1]}
            onScroll={this.refreshLayoutTree}
          >
            {[
              ...expenseCategories.map((coin, k) => (
                <Coin
                  key={k}
                  size={65}
                  color="#ffba75"
                  label={coin.name}
                  id={coin.id}
                  type={"expenseCategory"}
                  onLayout={this.onCoinLayout}
                  isTargeted={dropTarget === coin.id && dropTargetType === "expenseCategory"}
                />
              )),
              <Coin
                key={-1}
                size={65}
                color="#ffca95"
                label="Add"
                type={"expenseCategory"}
                onClick={this.onAddExpenseCategory}
                icon={faPlus}
              />,
            ]}
          </HScrollableGrid>
        </React.Fragment>
      </View>
    );
  }
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
