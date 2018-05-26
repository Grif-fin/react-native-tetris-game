import React, { PureComponent } from "react";
import { AppRegistry, StyleSheet, Dimensions, View } from "react-native";
import { GameEngine, GameLoop } from "react-native-game-engine";
import {Tile} from "./app/tile.js"

const { width: WIDTH, height: HEIGHT } = Dimensions.get("window");
const RADIUS = 25;

export default class BestGameEver extends PureComponent {
  constructor() {
    super();
    this.state = {
      x: WIDTH / 2 - RADIUS,
      y: HEIGHT / 2 - RADIUS
    };
  }

  updateHandler = ({ touches, screen, time }) => {
    let move = touches.find(x => x.type === "move");
    if (move) {
      this.setState({
        x: this.state.x + move.delta.pageX,
        y: this.state.y + move.delta.pageY
      });
    }
  };

  render() {
    return (
      <GameEngine 
        style={styles.container} 
        systems={[]}
        entities={{ 
          1: { position: [40,  200], renderer: <Tile />}, //-- Notice that each entity has a unique id (required)
          2: { position: [100, 200], renderer: <Tile />}
        }}>


      </GameEngine>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF"
  },
  player: {
    position: "absolute",
    backgroundColor: "pink",
    width: RADIUS * 2,
    height: RADIUS * 2
  }
});

AppRegistry.registerComponent("BestGameEver", () => BestGameEver);