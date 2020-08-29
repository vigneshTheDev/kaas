import React from "react";
import { Text, View } from "react-native";
import { RouteProp } from "@react-navigation/native";

interface Props {
  route: RouteProp<any, any>;
}

interface State {}

export class AddTransactionPage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    const { from, to } = this.props.route.params as any;
    return (
      <View>
        <Text>
          Add your transaction please. {from} to {to}
        </Text>
      </View>
    );
  }
}
