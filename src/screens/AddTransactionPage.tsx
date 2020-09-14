import React from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { RouteProp, NavigationProp } from "@react-navigation/native";
import { cleanNumber, formatBalance } from "../utils/number";

interface Props {
  route: RouteProp<any, any>;
  navigation: NavigationProp<any>;
}

interface State {
  rawAmount: string;
  parsedAmount: number;
  formattedAmount: string;
  description: string;
}

export class AddTransactionPage extends React.Component<Props, State> {
  state: State = {
    rawAmount: "",
    parsedAmount: 0,
    formattedAmount: "",
    description: "",
  };
  thousandSeparator = /,/;
  decimalSeparator = /\./;
  amountElementRef: TextInput | null = null;
  constructor(props: Props) {
    super(props);
  }

  onAmountChange = (text: string) => {
    const parsedAmount = cleanNumber(text, {
      thousandSeparator: this.thousandSeparator,
      decimalSeparator: this.decimalSeparator,
    });
    const formattedAmount = !Number.isNaN(parsedAmount) ? formatBalance(parsedAmount) : "";
    this.setState({
      rawAmount: text,
      parsedAmount,
      formattedAmount,
    });
  };

  onDescriptionChange = (text: string) => {
    this.setState({
      description: text,
    });
  };

  onSubmit = () => {
    const { description, parsedAmount } = this.state;
    if (parsedAmount) {
      console.log({ description, parsedAmount });
      this.props.navigation.navigate("Home");
    }
  };

  render() {
    const { fromName, toName } = this.props.route.params as any;
    const { formattedAmount, parsedAmount, rawAmount, description } = this.state;
    return (
      <View>
        <Text style={styles.title}>
          {fromName} to {toName}
        </Text>
        <TextInput
          placeholder={"Description"}
          autoCompleteType={"off"}
          value={description}
          onChangeText={this.onDescriptionChange}
          style={styles.descriptionInput}
          returnKeyType={"next"}
          onSubmitEditing={() => this.amountElementRef && this.amountElementRef.focus()}
        />
        <TextInput
          style={styles.amountInput}
          autoCompleteType={"off"}
          placeholder={"Amount"}
          keyboardType={"number-pad"}
          onChangeText={this.onAmountChange}
          onSubmitEditing={this.onSubmit}
          value={rawAmount}
          ref={(ref) => (this.amountElementRef = ref)}
        />
        {Number.isNaN(parsedAmount) ? (
          <Text style={[styles.amountOutput, { color: "red" }]}>Invalid Amount!</Text>
        ) : (
          <Text style={styles.amountOutput}>{formattedAmount}</Text>
        )}
        <View style={styles.saveButton}>
          <Button title={"Save"} onPress={this.onSubmit} disabled={!parsedAmount} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    textAlign: "center",
    margin: 20,
  },
  amountInput: {
    fontSize: 30,
    paddingHorizontal: 16,
  },
  descriptionInput: {
    paddingHorizontal: 16,
    fontSize: 18,
  },
  amountOutput: {
    fontSize: 14,
    paddingHorizontal: 16,
    marginBottom: 8,
    fontFamily: "Roboto",
  },
  saveButton: {
    padding: 8,
    margin: 8,
  },
});
