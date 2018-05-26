import { Dimensions } from "react-native";
import React from "react";

var prev_time_refresh = 0;
var tetromino_fall_delay = 400;
// none, right, left, rotate 
var next_action = "none";

const isMoveValid = (position, grid, input_id, direction="down") => {
  var isValid = {valid: true, stuck: false};
  var grid_width = grid.length;
  var grid_height = grid[0].length;
  for (var i = 0; i < position.length; ++i) {
    var x = position[i].x;
    var y = position[i].y;
    // check if reached bottom
    if(y < 0 | y >= grid_height){
      isValid.valid = false;
      isValid.stuck = true;
      break;
    }

    // check if reached edges, continue other tiles maybe stuck
    if(x < 0 || x >= grid_width) {
      isValid.valid = false;
      isValid.stuck = false;
      continue;
    }


    var tile = grid[x][y];
    if (tile.occupied && tile.tetromino_id !== input_id){

      // if it is not a down direction we 
      // are hitting another tetromino but we are not stuck to go down
      if(direction !== "down"){
        isValid.valid = false;
        isValid.stuck = false;
        continue;
      }

      isValid = false;
      isValid.stuck = true;
      break;
    }
  }
  return isValid;
}

const moveDownOne = (tetromino_position) => {
  var temp_tetromino_position = [];

  for (var i = 0; i < tetromino_position.length; ++i) {
    var x = tetromino_position[i].x;
    var y = tetromino_position[i].y;

    temp_tetromino_position.push({x: x, y: y})
    temp_tetromino_position[i].y += 1;
  }

  return temp_tetromino_position;
}

const updateGrid = (prev_position, new_position, grid, input_id) => {
  for (var i = 0; i < prev_position.length; ++i) {
    // free previous position
    var prev_x = prev_position[i].x;
    var prev_y = prev_position[i].y;

    grid[prev_x][prev_y].occupied = false;
    grid[prev_x][prev_y].moving = false;
    grid[prev_x][prev_y].tetromino_id = -1;
  }

  for (var i = 0; i < new_position.length; ++i) {
    // occupiy new position
    var new_x = new_position[i].x;
    var new_y = new_position[i].y;

    grid[new_x][new_y].occupied = true;
    grid[new_x][new_y].moving = true;
    grid[new_x][new_y].tetromino_id = input_id;
  }

  return grid;
}

const updateTetrominoPosition = (tetromino, new_position) => {
  for (var i = 0; i < tetromino.position.length; ++i){
    tetromino.position[i].x = new_position[i].x;
    tetromino.position[i].y = new_position[i].y;
  }
}

const printGrid = (grid) => {
  for(var x = 0; x < grid.length; x++){
    var row = x.toString() + ": ";
    for(var y = 0; y < grid[x].length; y++){
      row += (grid[x][y].occupied? "1":"0") + ","
    }
    console.log(row);
  }

  console.log("===================================================================");
}

// TODO: make a generic rotation based on matrix, requires structure of postions to be changed
// rotating is hardcoded to clockwise
const rotate = (positions, type) => {
  var center_position = positions[1];

  // skip rotating square
  if(type == "O") {
    return positions;
  }

  if(type == "I") {
    let tile_position = positions[0];
    var isHorizontal = false;
    // check if horizontal
    if(tile_position.y === center_position.y){
      isHorizontal = true;
    }

    for(var i = 0; i < positions.length; ++i){      
      // skip rotating center tile, everything is rotated
      // in relation to the center tile
      if(i === 1) {
        continue;
      }

      tile_position = positions[i];

      if (isHorizontal){
        tile_position.y += tile_position.x - center_position.x;
        tile_position.x = center_position.x;
      } else {
        tile_position.x += tile_position.y - center_position.y;
        tile_position.y = center_position.y;
      }
    }
  } else {
    for(var i = 0; i < positions.length; ++i){      
      // skip rotating center tile, everything is rotated
      // in relation to the center tile
      if(i === 1) {
        continue;
      }

      tile_position = positions[i];
      if(tile_position.x === center_position.x){
        if(tile_position.y < center_position.y){ // below
          tile_position.y = center_position.y;
          tile_position.x -= 1;
        } 
        else { // above
          tile_position.y = center_position.y;
          tile_position.x += 1;
        }
        continue;
      }

      if(tile_position.y === center_position.y){
        if(tile_position.x < center_position.x){ // left
          tile_position.x = center_position.x;
          tile_position.y += 1;
        } 
        else { // right
          tile_position.x = center_position.x;
          tile_position.y -= 1;
        }
        continue;
      }

      if(tile_position.x > center_position.x){ // right
        if(tile_position.y > center_position.y){ // above
          tile_position.y -= 2;
        } else { // below
          tile_position.x -= 2;
        }
      } else { // left
        if(tile_position.y > center_position.y){ // above
          tile_position.x += 2;
        } else { // below
          tile_position.y += 2;
        }
      }
    }
  }
  return positions;
}

const move = (entities, direction) => {
  parsed_inputs = JSON.parse(entities["Tiles"].inputs);
  grid = entities["Tiles"].grid;
  for(var i = 0; i < parsed_inputs.length; ++i){
    input = parsed_inputs[i];
    // ignore the none moving ones
    if(input.state !== "moving"){
      continue;
    }

    var temp_tetromino_position = [];
    if(direction == "rotate"){
      for (var j = 0; j < input.position.length; ++j) {
        var x = input.position[j].x;
        var y = input.position[j].y;

        temp_tetromino_position.push({x: x, y: y})
      }

      temp_tetromino_position = rotate(temp_tetromino_position, input.type);
    } else {
      // move all the tiles of the moving tetromino in temp position
      for (var j = 0; j < input.position.length; ++j) {
        var x = input.position[j].x;
        var y = input.position[j].y;

        temp_tetromino_position.push({x: x, y: y})
        if(direction === "right"){
          temp_tetromino_position[j].x += 1;
        } else {
          temp_tetromino_position[j].x -= 1;        
        }
      }
    }

    // check validiting of tmp position
    var resValidation = isMoveValid(temp_tetromino_position, grid, input.id, direction)
    if(resValidation.valid && resValidation.stuck === false){
      updateGrid(input.position, temp_tetromino_position, grid, input.id);
      input.position = temp_tetromino_position;
    } else if (resValidation.valid === false && resValidation.stuck === false){
      // we are at the edge do nothing
    } else {
      input.state = "landed";
    }

    // other tetromino will not be in moving state
    break;
  }

  entities["Tiles"].inputs = JSON.stringify(parsed_inputs);
  return entities;
}

const ControlHandler = (entities, {events, touches, time}) => {
  events.filter(e => e.type === "button-pressed").forEach(e => {
    console.log("event button-pressed");
    next_action = e.action;
    return entities;
  })

  // save temporarily in case event publish changes it in the middle of action
  tmp_action = next_action;
  switch(tmp_action) {
    case "right":
      entities = move(entities, "right");
      break;
    case "rotate":
      entities = move(entities, "rotate");
      break;
    case "left":
      entities = move(entities, "left");
      break;
    default:
  }

  // actione consumed
  next_action = "none";
  return entities;
}

const FallingTiles = (entities, { touches, time }) => {
  let screen = Dimensions.get("window")
  let screen_height = screen.height
  
  // only refresh tiles falling every second
  if(prev_time_refresh === 0) {
    prev_time_refresh = time.current;
  } else if(time.current - prev_time_refresh < tetromino_fall_delay) {
    return entities;    
  } else {
    prev_time_refresh = time.current;
  }

  // slide the tiles down vertically
  let entity = entities["Tiles"];
  if (entity && entity.grid && entity.inputs) {
    // no changes after game is finished
    if(entity.game_state === "finished") {
      return entities;
    }
    // find the next input
    let next_tetromino = null
    let tetrominos_input_updated = JSON.parse(entity.inputs);
    
    for (var ix = 0; ix < tetrominos_input_updated.length; ++ix) {
      let tetrominos_input = tetrominos_input_updated[ix];
      if(tetrominos_input.state !== "landed") {
        next_tetromino = tetrominos_input
        break;
      }
    }
    printGrid(entity.grid)
    // inputs finished return
    if (next_tetromino == null) {
      return entities;
    }

    let grid_updated = entity.grid;

    // if no space to come into screen game is over
    var validationRes = isMoveValid(next_tetromino.position, grid_updated, next_tetromino.id);
    if(validationRes.valid === false){
      entity.game_state = "finished";
      return entities;
    }

    // slide down th moving tetromino
    var new_position = null;
    if(next_tetromino.state === "moving"){
      new_position = moveDownOne(next_tetromino.position);
    } else { // state ready
      next_tetromino.state = "moving"
      new_position = next_tetromino.position;
    }

    // if no to slide down set as landed
    var resValidation = isMoveValid(new_position, grid_updated, next_tetromino.id)
    if(resValidation.valid && resValidation.stuck === false){
      // update the occupied tiles with the new move
      grid_updated = updateGrid(next_tetromino.position, new_position, grid_updated, next_tetromino.id);
      updateTetrominoPosition(next_tetromino, new_position);
    } else if (resValidation.valid === false && resValidation.stuck === false){
      // we are at the edge do nothing
    } else {
      next_tetromino.state = "landed"
    }

    entity.inputs = JSON.stringify(tetrominos_input_updated);
  }

  return entities;
};

export { FallingTiles, ControlHandler };