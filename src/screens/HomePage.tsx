import React from "react";
import { StyleSheet, View } from "react-native";

import Banner from "../components/Banner";
import TransactionDragNDrop from "../components/TransactionDragNDrop";
import { NavigationProp } from "@react-navigation/native";
import { AccountRecord, ExpenseCategoryRecord, IncomeSourceRecord } from "../utils/sqlite-model";
import { Currency } from "../models/currency-model";

interface Props {
  navigation: NavigationProp<any>;
}

interface State {
  incomeSources: IncomeSourceRecord[];
  accounts: AccountRecord[];
  expenseCategories: ExpenseCategoryRecord[];
}

export class HomePage extends React.Component<Props, State> {
  state: State = {
    accounts: ["Salary A/C", "Savings", "FD", "Stocks", "Overnight Funds"].map((s, i) => ({
      name: s,
      currency: Currency.AUD,
      icon: "",
      id: i,
      includeInTotal: false,
      initialBalance: 0,
      isDebtAccount: false,
    })),
    expenseCategories: [
      "Tuition Fees",
      "Groceries",
      "Water",
      "Cable TV",
      "Streaming Fee",
      "Fuel",
      "Gadgets",
      "Eat out",
      "Books",
      "Grooming",
      "Grooming1",
      "Grooming2",
      "Grooming3",
      "Grooming4",
      "Grooming5",
      "Grooming6",
      "Grooming7",
      "Grooming8",
      "Grooming9",
      "Grooming10",
      "Hello",
    ].map((s, i) => ({ id: i, name: s, currency: Currency.AUD, expectedPerMonth: 100, icon: "" })),
    incomeSources: ["Salary", "Interest", "Rent", "Dividend", "Game Dev"].map((s, i) => ({
      id: i,
      name: s,
      currency: Currency.AUD,
      expectedPerMonth: 100,
      icon: "",
    })),
  };
  constructor(props: Props) {
    super(props);
  }

  render() {
    const { incomeSources, expenseCategories, accounts } = this.state;
    const { navigation } = this.props;
    return (
      <View style={styles.container}>
        <Banner balance={100000} />
        <TransactionDragNDrop
          incomeSources={incomeSources}
          expenseCategories={expenseCategories}
          accounts={accounts}
          navigation={navigation}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fbfbfb",
  },
});
