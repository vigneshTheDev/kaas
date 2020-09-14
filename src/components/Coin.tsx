import React from "react";
import PT from "prop-types";
import { Audio } from "expo-av";
import {
  View,
  GestureResponderEvent,
  StyleSheet,
  Text,
  Animated,
  LayoutChangeEvent,
  TouchableWithoutFeedback,
} from "react-native";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

export type CoinType = "incomeSource" | "account" | "expenseCategory";

interface Props {
  size: number;
  color: string;
  label: string;
  isDraggable?: boolean;
  isTargeted?: boolean;
  onFingerMove: (evt: GestureResponderEvent, id: number, type: CoinType) => void;
  onDrop: (id: number, type: CoinType) => void;
  onClick: () => void;
  onLayout: (id: number, evt: LayoutChangeEvent, coinRef: View, type: CoinType) => void;
  type: CoinType;
  id?: number;
  icon?: IconDefinition;
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
    isTargeted: PT.bool,
    onFingerMove: PT.func,
    onDrop: PT.func,
    onLayout: PT.func,
    onClick: PT.func,
    id: PT.number,
    type: PT.string.isRequired,
    children: PT.arrayOf(PT.element),
  };

  static defaultProps = {
    isDraggable: false,
    isTargeted: false,
    onFingerMove: () => {},
    onDrop: () => {},
    onLayout: () => {},
    onClick: () => {},
  };

  state = {
    inDrag: false,
    startPos: { x: 0, y: 0 },
  };

  pos = new Animated.ValueXY();

  popOutSound = new Audio.Sound();
  popInSound = new Audio.Sound();

  coinRef: View | null = null;

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
    this.props.onDrop(this.props.id as number, this.props.type);
  };

  onResponderMove = (evt: GestureResponderEvent) => {
    const { startPos } = this.state;
    const { onFingerMove, id, type } = this.props;

    Animated.event([{ x: this.pos.x, y: this.pos.y }])({
      x: evt.nativeEvent.pageX - startPos.x,
      y: evt.nativeEvent.pageY - startPos.y,
    });

    onFingerMove(evt, id as number, type);
  };

  onLayout = (evt: LayoutChangeEvent) => {
    this.props.onLayout(this.props.id as number, evt, this.coinRef as View, this.props.type);
  };

  isDraggable = () => !!this.props.isDraggable;

  render() {
    const { inDrag } = this.state;
    const { size, color, label, isTargeted, onClick, isDraggable, icon } = this.props;

    const halfSize = size / 2;
    return (
      <View style={[styles.coinContainer, { zIndex: inDrag ? 2 : 1 }]}>
        <View
          style={[
            {
              width: size,
              height: size,
              borderRadius: halfSize,
              backgroundColor: inDrag || isTargeted ? "gray" : color,
            },
            styles.coin,
          ]}
          onResponderGrant={this.onResponderGrant}
          onResponderMove={this.onResponderMove}
          onResponderRelease={this.onResponderRelease}
          onResponderTerminate={this.onResponderRelease}
          onStartShouldSetResponder={this.isDraggable}
          onLayout={this.onLayout}
          ref={(coinRef: View) => (this.coinRef = coinRef)}
          onTouchEnd={onClick}
        >
          {icon && <FontAwesomeIcon icon={icon} style={{ color: "#374140" }}></FontAwesomeIcon>}
        </View>
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
    alignItems: "center",
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
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 24,
    color: "white",
  },
  ghost: {
    position: "absolute",
    elevation: 50,
    zIndex: 40,
  },
});
