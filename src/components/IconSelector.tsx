import React from "react";
import PT from "prop-types";
import { StyleSheet, Text, TouchableHighlight, View } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { Icon, icons } from "../models/icon-model";

interface Props {
  onSelect: (icon: Icon) => void;
}
export const IconSelector = ({ onSelect }: Props) => {
  return (
    <View style={styles.container}>
      {icons.map((icon) => (
        <TouchableHighlight style={styles.iconTouchable} underlayColor={"#ddd"} onPress={() => onSelect(icon)}>
          <View style={styles.icon}>
            <FontAwesomeIcon icon={icon.icon} />
          </View>
        </TouchableHighlight>
      ))}
      <Text style={styles.attribution}>Thanks to FontAwesome for the icons!</Text>
    </View>
  );
};

IconSelector.propTypes = {
  onSelect: PT.func,
};

IconSelector.defaultProps = {
  onSelect: () => {},
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "row",
    backgroundColor: "#dfdfdb",
    padding: 8,
    borderRadius: 8,
    justifyContent: "center",
  },
  icon: {
    width: 40,
    height: 40,
    backgroundColor: "#fbfbfb",
    color: "#333333",
    borderColor: "#cccccc",
    borderWidth: 1,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  iconTouchable: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  attribution: {
    color: "#999",
    marginTop: 8,
  },
});
