import React, { PureComponent } from "react";
import { StyleSheet, View } from "react-native";

const RADIUS = 20;

class Tile extends PureComponent {
  render() {
    const x = this.props.position[0] - RADIUS / 2;
    const y = this.props.position[1] - RADIUS / 2;
    return (
      <View style={[styles.tile, { left: x, top: y }]} />
    );
  }
}

const styles = StyleSheet.create({
  tile: {
    borderColor: "black",
    borderWidth: 4,
    width: RADIUS * 2,
    height: RADIUS * 2,
    backgroundColor: "white",
    position: "absolute"
  }
});

export { Tile };