import React from "react";
import PT from "prop-types";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Currency, CurrencyList } from "../models/currency-model";

interface Props {
  filter: string;
  onSelect: (currency: Currency) => void;
}

export const CurrencySelector = ({ filter, onSelect }: Props) => {
  // If no filter specified, render all icons
  const filteredCurrencyList = !filter
    ? CurrencyList
    : CurrencyList.filter((c) => {
        const { name, code } = c;
        return (
          name.toLocaleLowerCase().match(filter.toLocaleLowerCase()) ||
          code.toLocaleLowerCase().match(filter.toLowerCase())
        );
      });

  return (
    <View style={styles.container}>
      {filteredCurrencyList.map((currency) => (
        <Text key={currency.code} onPress={() => onSelect(currency.code)} style={styles.option}>
          {currency.name}
        </Text>
      ))}
    </View>
  );
};

CurrencySelector.propTypes = {
  filter: PT.string,
  onSelect: PT.func,
};

CurrencySelector.defaultProps = {
  onSelect: () => {},
};

const styles = StyleSheet.create({
  option: {
    padding: 12,
  },
  container: {
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#dfdfdb",
  },
});
