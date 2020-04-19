import React from "react";
import PT from "prop-types";
import { Audio } from "expo-av";
import { View, GestureResponderEvent, StyleSheet, Text, LayoutChangeEvent, Animated } from "react-native";

const popOutSound = new Audio.Sound();
popOutSound.loadAsync(require("../../assets/sounds/Tab2.m4a")).catch((err) => console.error(err));

const popInSound = new Audio.Sound();
popInSound.loadAsync(require("../../assets/sounds/Tab1.m4a")).catch((err) => console.error(err));

const always = () => {
  return true;
};

interface Props {
  size: number;
  color: string;
  label: string;
}

interface State {
  inDrag: boolean;
  startPos: { x: number; y: number };
}

export default class Coin extends React.PureComponent<Props, State> {
  static propTypes = {
    size: PT.number.isRequired,
    color: PT.string.isRequired,
    label: PT.string.isRequired,
  };

  state = {
    inDrag: false,
    startPos: { x: 0, y: 0 },
  };

  pos = new Animated.ValueXY();

  ghostScale = new Animated.Value(1);
  sourceScale = new Animated.Value(1);
  sourceOpacity = new Animated.Value(1);

  constructor(props: Props) {
    super(props);
  }

  onResponderGrant = async (evt: GestureResponderEvent) => {
    const startPos = { x: evt.nativeEvent.pageX, y: evt.nativeEvent.pageY };
    this.setState({ startPos, inDrag: true });

    Animated.event([{ x: this.pos.x, y: this.pos.y }])({ x: 0, y: 0 });
    await popOutSound.playAsync();
    await popOutSound.setPositionAsync(0);
  };

  onResponderRelease = async () => {
    this.setState({ inDrag: false });

    Animated.event([{ scale: this.ghostScale }])({ scale: 1 });
    Animated.spring(this.ghostScale, { toValue: 1 });
    Animated.spring(this.sourceScale, { toValue: 1 });
    Animated.spring(this.sourceOpacity, { toValue: 1 });
    await popInSound.playAsync();
    await popInSound.setPositionAsync(0);
  };

  onResponderMove = (evt: GestureResponderEvent) => {
    const { startPos } = this.state;

    Animated.spring(this.ghostScale, { toValue: 0.8, stiffness: 50 }).start();
    Animated.spring(this.sourceScale, { toValue: 0.8, stiffness: 50 });
    Animated.spring(this.sourceOpacity, { toValue: 0.4 });
    Animated.event(
      [{ x: this.pos.x, y: this.pos.y }],
      {}
    )({
      x: evt.nativeEvent.pageX - startPos.x,
      y: evt.nativeEvent.pageY - startPos.y,
    });
  };

  onLayout = (evt: LayoutChangeEvent) => {
    console.log(
      "Coin layout",
      evt.nativeEvent.layout.x,
      evt.nativeEvent.layout.y,
      evt.nativeEvent.layout.width,
      evt.nativeEvent.layout.height,
      this.props.label
    );
  };

  render() {
    const { inDrag } = this.state;
    const { size, color, label } = this.props;

    const halfSize = size / 2;
    return (
      <View style={[styles.coinContainer, { zIndex: inDrag ? 2 : 1 }]} onLayout={this.onLayout}>
        <Animated.View
          style={[
            {
              width: size,
              height: size,
              borderRadius: halfSize,
              backgroundColor: color,
              transform: [{ scale: this.sourceScale }],
              opacity: this.sourceOpacity,
            },
            styles.coin,
          ]}
          onResponderGrant={this.onResponderGrant}
          onResponderMove={this.onResponderMove}
          onResponderRelease={this.onResponderRelease}
          onResponderTerminate={this.onResponderRelease}
          onStartShouldSetResponder={always}
        />
        <Text style={[styles.label, { width: size }]} numberOfLines={1}>
          {label}
        </Text>

        {inDrag ? (
          <Animated.View
            style={[
              {
                width: size,
                height: size,
                borderRadius: halfSize,
                backgroundColor: color,
                top: this.pos.getLayout().top,
                left: this.pos.getLayout().left,
                transform: [{ scale: this.ghostScale }],
              },
              styles.coin,
              styles.ghost,
            ]}
          />
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  label: {
    textAlign: "center",
  },
  coinContainer: {
    textAlign: "center",
    justifyContent: "center",
  },
  coin: {
    shadowColor: "#000",
    shadowOffset: {
      width: 4,
      height: 4,
    },
    shadowOpacity: 0.75,
    shadowRadius: 4,
    marginHorizontal: 10,
    elevation: 4,
    zIndex: 3,
  },
  ghost: {
    position: "absolute",
    elevation: 5,
    zIndex: 4,
  },
});
