import React from "react";
import Banner from "../components/Banner";
import TransactionDragNDrop from "../components/TransactionDragNDrop";
import { StyleSheet, View } from "react-native";
import { NavigationProp } from "@react-navigation/native";

interface Props {
  navigation: NavigationProp<any>;
}

interface State {
  incomeSources: string[];
  accounts: string[];
  expenseCategories: string[];
}

export class HomePage extends React.Component<Props, State> {
  state: State = {
    accounts: ["Salary A/C", "Savings", "FD", "Stocks", "Overnight Funds"],
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
    ],
    incomeSources: ["Salary", "Interest", "Rent", "Dividend", "Game Dev"],
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
    backgroundColor: "#fff",
  },
});
