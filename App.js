import React, { PureComponent } from "react";
import { AppRegistry, StyleSheet, Dimensions, View, StatusBar, TouchableOpacity} from "react-native";
import { ButtonToolbar } from 'react-bootstrap';
import { GameEngine, GameLoop } from "react-native-game-engine";
import { Tetromino } from "./app/tetromino.js"
import { FallingTiles, ControlHandler } from "./app/systems.js"
import { Joystick } from "./app/joystick.js"
import Icon from 'react-native-vector-icons/FontAwesome';

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

  _getRandomColor() {
    var letters = ["red", "green", "cyan", "blue", "yellow"];
    var color = 'blue';
    for (var i = 0; i < 6; i++) {
      color = letters[Math.floor(Math.random() * 5)];
    }
    return color;
  }

  getStartPos(type, grid_width){
    var start_positions = []
    mid_width = Math.floor(grid_width/2);
    top_hight = 0;
    switch(type) {
      case "I":
          start_positions.push({x: mid_width, y: top_hight})
          start_positions.push({x: mid_width, y: top_hight+1})
          start_positions.push({x: mid_width, y: top_hight+2})
          start_positions.push({x: mid_width, y: top_hight+3})
          break;
      case "Z":
          start_positions.push({x: mid_width-1, y: top_hight})
          start_positions.push({x: mid_width, y: top_hight})
          start_positions.push({x: mid_width, y: top_hight+1})
          start_positions.push({x: mid_width+1, y: top_hight+1})
          break;
      case "L":
          start_positions.push({x: mid_width, y: top_hight})
          start_positions.push({x: mid_width, y: top_hight+1})
          start_positions.push({x: mid_width, y: top_hight+2})
          start_positions.push({x: mid_width+1, y: top_hight+2})
          break;
      case "O":
          start_positions.push({x: mid_width, y: top_hight})
          start_positions.push({x: mid_width, y: top_hight+1})
          start_positions.push({x: mid_width+1, y: top_hight+1})
          start_positions.push({x: mid_width+1, y: top_hight})
          break;
      case "T":
          start_positions.push({x: mid_width-1, y: top_hight})
          start_positions.push({x: mid_width, y: top_hight})
          start_positions.push({x: mid_width+1, y: top_hight})
          start_positions.push({x: mid_width, y: top_hight+1})
          break;
      default:
          console.error("Tetromino type not found!");
    }

    return start_positions;
  }

  onLeftButtonPressed = async ev =>{
    console.log("App.js onLeftButtonPressed");
    this.refs.engine.publishEvent({
        type: "button-pressed",
        action: "left"
      })
  };

  onRotateButtonPressed = async ev =>{
    console.log("App.js onRotateButtonPressed");
    this.refs.engine.publishEvent({
      type: "button-pressed",
      action: "rotate"
    })
  };

  onRightButtonPressed = async ev =>{
    console.log("App.js onRotateButtonPressed");
    this.refs.engine.publishEvent({
      type: "button-pressed",
      action: "right"
    })
  };

  render() {
    const screen = Dimensions.get("window");
    // game screen dimensions
    const game_screen_width = screen.width;
    const game_screen_height = screen.height*0.90;
    // joysticks dimensions
    const joystick_width = screen.width;
    const joystick_height = screen.height*0.12;
    const joystick_x = 0;
    const joystick_y = screen.height*0.88;

    const tile_size = {width: 40, height:40};
    const grid_width  = Math.floor(game_screen_width/40);
    const grid_height = Math.floor(game_screen_height/40);

    var grid = new Array(grid_width);
    for (var i = 0; i < grid_width; i++) {
      grid[i] = new Array(grid_height);
      for(var j = 0; j < grid_height; j++) {
        grid[i][j] = {occupied: false, moving: false, tetromino_id: -1};
      }
    }
    
    // test set
    var tetromino_types = ["Z", "I", "L", "O", "T", "T", "O", "L", "Z", "I", "T", "Z", "I", "L"]
    var tetrominos_input = new Array(5);
    for (var y = 0; y < 5; y++) {
      var type = tetromino_types[y];
      // states: ready, moving, landed
      tetrominos_input[y] = {id: y.toString() ,type: type, position: this.getStartPos(type, grid_width), state: "ready", color: this._getRandomColor()};
    }

    // entities cannot be object with deep structure as the do not get deep copied
    // stringify as a work around for now
    tetrominos_input = JSON.stringify(tetrominos_input);

    // array of button handlers
    const buttonsHandlers = [this.onLeftButtonPressed, this.onRotateButtonPressed, this.onRightButtonPressed];
    return (
      <GameEngine
        ref={"engine"}
        style={styles.container} 
        systems={[FallingTiles, ControlHandler]}
        entities={{ 
          // game_states: ongoing, finished
          Tiles: { grid: grid, size: tile_size, inputs: tetrominos_input, game_state: "ongoing", renderer: Tetromino}
          //Controller: {size: [joystick_width, joystick_height], buttonController: buttonsHandlers, position: [joystick_x, joystick_y], renderer: Joystick} 
        }}>
        <StatusBar hidden={true} />

        <View key="joystickView" style={[styles.joystick, {left: 100, top: game_screen_height}]}>
            <TouchableOpacity onPress={this.onLeftButtonPressed} style={[styles.button]}>
              <Icon name="arrow-left" size={50} color="black"/>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.onRotateButtonPressed} style={[styles.button, {paddingLeft: 25, paddingRight: 25 }]}>
              <Icon name="rotate-right" size={50} color="black"/>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.onRightButtonPressed} style={[styles.button]}>
              <Icon name="arrow-right" size={50} color="black"/>
            </TouchableOpacity>
        </View>
      </GameEngine>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF"
  },
  joystick: {
    borderColor: "#ffcc99",
    backgroundColor: "#ffcc99",
    borderWidth: 5,
    position: "absolute",
    flexDirection: "row",
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
  }
});

AppRegistry.registerComponent("BestGameEver", () => BestGameEver);