import React, { PureComponent } from "react";
import { StyleSheet, View, TouchableOpacity  } from "react-native";
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';

class Joystick extends PureComponent {
  constructor() {
    super();
  }

  _getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  render() {
    // joystick layout config
    const width = this.props.size[0];
    const height = this.props.size[1];
    const left = this.props.position[0];
    const top = this.props.position[1];

    return (
      <View key="joystickView" style={[styles.joystick,{ left: left, top: top }, {width: width, height: height}]}>
          <TouchableOpacity onPress={this.props.buttonController[0]} style={[styles.button]}>
            <Icon name="arrow-left" size={50} color="black"/>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.props.buttonController[1]} style={[styles.button, {paddingLeft: 25, paddingRight: 25 }]}>
            <Icon name="rotate-left" size={50} color="black"/>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.props.buttonController[2]} style={[styles.button]}>
            <Icon name="arrow-right" size={50} color="black"/>
          </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
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

export { Joystick };