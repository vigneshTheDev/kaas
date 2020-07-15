import React from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";

import Logo from "../../assets/logo.svg";
import BannerBottom from "../../assets/banner-bottom.svg";
import { formatBalance } from "../utils/number";

const dimensions = Dimensions.get("window");
const imageHeight = Math.round((dimensions.width * 57) / 375);
const imageWidth = Math.ceil(dimensions.width);

export default function Banner({ balance }: { balance: number }) {
  return (
    <React.Fragment>
      <View style={styles.banner}>
        <Logo style={styles.logo} height={24} width={91} />
        <Text style={styles.tagLine}>A Penny Saved is a Penny Earned</Text>
        <Text style={styles.balanceLabel}>BALANCE</Text>
        <Text style={styles.balanceValue}>₹ {formatBalance(balance)}</Text>
      </View>
      <BannerBottom height={imageHeight} width={imageWidth} style={styles.bannerBottom} />
    </React.Fragment>
  );
}

const styles = StyleSheet.create({
  banner: {
    position: "relative",
    backgroundColor: "#FACD79", // "linear-gradient(170deg, #FDE6BC 0, #FACD79 60%, #FACD79 100%)",
    zIndex: 99,
  },
  bannerBottom: {
    marginTop: -1,
    position: "relative",
    zIndex: 99,
  },
  logo: {
    marginTop: 45,
    marginLeft: 25,
  },
  tagLine: {
    fontSize: 12,
    fontFamily: "Roboto",
    color: "#777777",
    marginLeft: 25,
    marginTop: 4,
  },
  balanceLabel: {
    textAlign: "right",
    marginRight: 8,
    marginTop: 16,
    fontSize: 13,
    fontWeight: "bold",
    fontFamily: "Roboto",
    color: "#777777",
  },
  balanceValue: {
    textAlign: "right",
    marginRight: 8,
    marginBottom: 2,
    fontSize: 24,
    color: "#555",
    fontFamily: "Roboto",
  },
});
