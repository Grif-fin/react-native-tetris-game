import React, { PureComponent } from "react";
import { StyleSheet, View } from "react-native";

class Tetromino extends PureComponent {
  getWidth() {
    return styles.width;
  }

  _getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  render() {
    const tile_width = this.props.size.width;
    const tile_height = this.props.size.height;

    const grid =  this.props.grid;
    let view = [];
    const inputs = JSON.parse(this.props.inputs);

    var keys = []

    for(var i = 0; i < inputs.length; i++){
      for(var t = 0; t < inputs[i].position.length; t++){
        const x_draw_pos = (inputs[i].position[t].x*tile_width);
        const y_draw_pos = (inputs[i].position[t].y*tile_height);
        const hide = (inputs[i].state === "ready"? true: false);

        // find unqie key
        var exists = 1;
        var candidateKey = null;
        while(exists !== -1){
          candidateKey = this._getRandomArbitrary(1, 5000).toString();
          exists = keys.indexOf(candidateKey)
        }
        keys.push(candidateKey);

        var color = inputs[i].color;
        if(hide === false){
          view.push(<View key={candidateKey} style={[styles.tile, { left: x_draw_pos, top: y_draw_pos },
                                                         {width: tile_width, height: tile_height},
                                                         {backgroundColor: color}]}
                                                         />);
        }
      }
    }

    return view;
  }
}

const styles = StyleSheet.create({
  tile: {
    borderColor: "black",
    borderWidth: 2,
    position: "absolute"
  }
});

export { Tetromino };