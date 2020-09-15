import React from "react";
import { View, Text } from "react-native";
import { createAllTables } from "../utils/sqlite-create";
import { NavigationProp } from "@react-navigation/native";
import { StackActions } from "@react-navigation/core";
import { dropAllTables } from "../utils/sqlite-delete";

interface Props {
  navigation: NavigationProp<any>;
}

interface State {
  completed: number;
  failed: number;
  total: number;
}

export class LaunchScreen extends React.Component<Props, State> {
  state: State = {
    completed: 0,
    failed: 0,
    total: 0,
  };
  constructor(props: Props) {
    super(props);
  }
  componentDidMount() {
    const { navigation } = this.props;

    // dropAllTables((completed, failed, total) => {
    //   if (completed === total) {
    //     navigation.dispatch(StackActions.replace("Home"));
    //   }
    // });

    createAllTables((completed: number, failed: number, total: number) => {
      this.setState({ completed, failed, total });
      console.log(`Completed: ${completed} / ${total}. Failed: ${failed}`);
      if (completed === total) {
        navigation.dispatch(StackActions.replace("Home"));
      }
    })
      .then(() => console.log("Done create"))
      .catch((ex) => console.log("Error creating", ex));
  }

  render() {
    const { total, failed, completed } = this.state;
    return (
      <View style={{ padding: 16 }}>
        <Text>
          {completed} / {total} completed
        </Text>
        {failed !== 0 && (
          <Text>
            {failed} / {total} failed
          </Text>
        )}
      </View>
    );
  }
}
