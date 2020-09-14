import React from "react";
import { Button, ScrollView, StyleSheet, Text, TextInput, TouchableHighlight, View } from "react-native";
import { CurrencySelector } from "../components/CurrencySelector";
import { Currency } from "../models/currency-model";
import { formatBalance } from "../utils/number";
import { IconSelector } from "../components/IconSelector";
import { Icon } from "../models/icon-model";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

interface Props {}

interface State {
  name: string;
  expectedPerMonth: number | null;
  rawExpectedPerMonth: string;
  currency: Currency | null;
  currencyFilter: string;
  currencySelectEnabled: boolean;
  icon: Icon | null;
  iconSelectEnabled: boolean;
  invalidExpectedPerMonth: boolean;
}

export class AddIncomeSource extends React.Component<Props, State> {
  static propTypes = {};
  state: State = {
    name: "",
    expectedPerMonth: null,
    rawExpectedPerMonth: "",
    currency: null,
    icon: null,
    iconSelectEnabled: false,
    currencyFilter: "",
    invalidExpectedPerMonth: false,
    currencySelectEnabled: false,
  };
  constructor(props: Props) {
    super(props);
  }

  onNameChange = (name: string) => {
    this.setState({ name: name });
  };

  onExpectedAmountChange = (amount: string) => {
    const parsedAmount = +amount;

    this.setState({ rawExpectedPerMonth: amount });
    if (!Number.isNaN(parsedAmount)) {
      this.setState({ expectedPerMonth: parsedAmount, invalidExpectedPerMonth: false });
    } else {
      this.setState({ expectedPerMonth: null, invalidExpectedPerMonth: true });
    }
  };

  onCurrencyFilterChange = (filter: string) => {
    this.setState({ currencyFilter: filter, currencySelectEnabled: true });
  };

  onCurrencyFilterFocus = () => {
    this.setState({ currencySelectEnabled: true });
  };

  onCurrencyFilterBlur = () => {
    // this.setState({ currencySelectEnabled: false });
  };

  onCurrencySelect = (currency: Currency) => {
    this.setState({ currency, currencySelectEnabled: false, currencyFilter: "" });
  };

  toggleCurrencySelect = () => {
    this.setState((prevState) => ({ currencySelectEnabled: !prevState.currencySelectEnabled }));
  };

  onIconSelect = (icon: Icon) => {
    this.setState({ icon });
  };

  onSave = () => {};

  toggleIconSelect = () => {
    this.setState((prevState) => ({ iconSelectEnabled: !prevState.iconSelectEnabled }));
  };

  render() {
    const {
      currency,
      invalidExpectedPerMonth,
      expectedPerMonth,
      rawExpectedPerMonth,
      currencyFilter,
      currencySelectEnabled,
      icon,
      iconSelectEnabled,
      name,
    } = this.state;
    return (
      <ScrollView style={styles.container}>
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Name</Text>
          <TextInput placeholder={"E.g. Salary"} style={styles.field} onChangeText={this.onNameChange} value={name} />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>How much are you planning to receive from this source per month?</Text>
          <TextInput
            placeholder={"E.g. 1000"}
            value={rawExpectedPerMonth}
            style={styles.field}
            onChangeText={this.onExpectedAmountChange}
            keyboardType={"numeric"}
          />
          {invalidExpectedPerMonth ? (
            <Text>I cannot read the value. Please check</Text>
          ) : (
            <Text>{formatBalance(expectedPerMonth || 0)}</Text>
          )}
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Currency</Text>
          <TextInput
            style={styles.field}
            placeholder={"E.g. USD"}
            onChangeText={this.onCurrencyFilterChange}
            value={currencyFilter}
            onFocus={this.onCurrencyFilterFocus}
            onBlur={this.onCurrencyFilterBlur}
          />
          {currency && (
            <Text onPress={this.toggleCurrencySelect} style={styles.selectedCurrency}>
              {currency}
            </Text>
          )}
          {currencySelectEnabled && <CurrencySelector filter={currencyFilter} onSelect={this.onCurrencySelect} />}
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Choose an icon</Text>
          <TouchableHighlight onPress={this.toggleIconSelect} style={styles.iconTouchable}>
            <View style={styles.iconSelect}>{icon && <FontAwesomeIcon icon={icon.icon} />}</View>
          </TouchableHighlight>
          {iconSelectEnabled && <IconSelector onSelect={this.onIconSelect} />}
        </View>

        <View style={styles.saveBtnContainer}>
          <Button title={"Save"} onPress={this.onSave} />
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 80,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  field: {
    color: "#333",
  },
  fieldLabel: {
    color: "#999",
    fontWeight: "bold",
  },
  iconSelect: {
    height: 40,
    width: 40,
    backgroundColor: "#5bbf90",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
  iconTouchable: {
    height: 40,
    width: 40,
    borderRadius: 20,
    marginBottom: 18,
    marginTop: 4,
  },
  selectedCurrency: {
    color: "#999",
  },
  saveBtnContainer: {
    paddingBottom: 80,
  },
});
