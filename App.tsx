import React from "react";
import { StyleSheet, Image, Text, View, Dimensions } from "react-native";
import { default as Logo } from "./assets/logo.svg";
import { default as BannerBottom } from "./assets/banner-bottom.svg";

const dimensions = Dimensions.get("window");
const imageHeight = Math.round((dimensions.width * 57) / 375);
const imageWidth = Math.ceil(dimensions.width);

export default function App() {
  return (
    <View style={styles.container}>
      <View style={styles.banner}>
        <Logo style={styles.logo} height={24} width={91} />
        <Text style={styles.tagLine}>A Penny Saved is a Penny Earned</Text>
        <Text style={styles.balanceLabel}>BALANCE</Text>
        <Text style={styles.balanceValue}>₹ 1, 00, 000</Text>
      </View>
      <BannerBottom height={imageHeight} width={imageWidth} style={styles.bannerBottom} />
      <Text>Hello</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  banner: {
    position: "relative",
    backgroundColor: "#FACD79", // "linear-gradient(170deg, #FDE6BC 0, #FACD79 60%, #FACD79 100%)",
  },
  bannerBottom: {
    marginTop: -1,
  },
  logo: {
    marginTop: 45,
    marginLeft: 25,
  },
  tagLine: {
    fontSize: 11,
    fontFamily: "Roboto",
    color: "#777777",
    marginLeft: 25,
    marginTop: 4,
  },
  balanceLabel: {
    textAlign: "right",
    marginRight: 8,
    marginTop: 16,
    fontSize: 10,
    fontWeight: "bold",
    fontFamily: "Roboto",
    color: "#777777",
  },
  balanceValue: {
    textAlign: "right",
    marginRight: 8,
    marginBottom: 2,
    fontSize: 24,
    color: "#549788",
    fontFamily: "Roboto",
  },
});
