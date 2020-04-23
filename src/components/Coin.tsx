import React from "react";
import PT from "prop-types";
import { Audio } from "expo-av";
import { View, GestureResponderEvent, StyleSheet, Text, Animated, LayoutChangeEvent } from "react-native";

interface Props {
  size: number;
  color: string;
  label: string;
  isDraggable: boolean;
  onFingerMove: Function;
  onLayout: Function;
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
    isDraggable: PT.bool,
    onFingerMove: PT.func,
    onLayout: PT.func,
  };

  static defaultProps = {
    isDraggable: false,
    onFingerMove: () => {},
    onLayout: () => {},
  };

  state = {
    inDrag: false,
    startPos: { x: 0, y: 0 },
  };

  pos = new Animated.ValueXY();

  popOutSound = new Audio.Sound();
  popInSound = new Audio.Sound();

  constructor(props: Props) {
    super(props);
  }

  componentDidMount() {
    this.loadSounds();
  }

  loadSounds() {
    this.popOutSound
      .loadAsync(require("../../assets/sounds/Tab2.m4a"))
      .catch((err) => console.error("Error loading pop out sound", err));

    this.popInSound
      .loadAsync(require("../../assets/sounds/Tab1.m4a"))
      .catch((err) => console.error("Error loading pop in sound", err));
  }

  async playSound(sound: Audio.Sound) {
    await sound.stopAsync();
    await sound.playAsync();
  }

  onResponderGrant = async (evt: GestureResponderEvent) => {
    const startPos = { x: evt.nativeEvent.pageX, y: evt.nativeEvent.pageY };
    this.setState({ startPos, inDrag: true });

    Animated.event([{ x: this.pos.x, y: this.pos.y }])({ x: 0, y: 0 });
    await this.playSound(this.popOutSound);
  };

  onResponderRelease = async () => {
    this.setState({ inDrag: false });

    Animated.event([{ x: this.pos.x, y: this.pos.y }])({ x: 0, y: 0 });
    await this.playSound(this.popInSound);
  };

  onResponderMove = (evt: GestureResponderEvent) => {
    const { startPos } = this.state;
    const { onFingerMove } = this.props;

    Animated.event([{ x: this.pos.x, y: this.pos.y }])({
      x: evt.nativeEvent.pageX - startPos.x,
      y: evt.nativeEvent.pageY - startPos.y,
    });

    onFingerMove(evt);
  };

  onLayout = (evt: LayoutChangeEvent) => {
    this.props.onLayout(this.props.label, evt);
  };

  isDraggable = () => this.props.isDraggable;

  render() {
    const { inDrag } = this.state;
    const { size, color, label, onLayout } = this.props;

    const halfSize = size / 2;
    return (
      <View style={[styles.coinContainer, { zIndex: inDrag ? 2 : 1 }]}>
        <View
          style={[
            {
              width: size,
              height: size,
              borderRadius: halfSize,
              backgroundColor: inDrag ? "gray" : color,
            },
            styles.coin,
          ]}
          onResponderGrant={this.onResponderGrant}
          onResponderMove={this.onResponderMove}
          onResponderRelease={this.onResponderRelease}
          onResponderTerminate={this.onResponderRelease}
          onStartShouldSetResponder={this.isDraggable}
          onLayout={this.onLayout}
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
