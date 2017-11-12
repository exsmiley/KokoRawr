const lib = require('lib')({token: process.env.STDLIB_TOKEN});

// params
let lastTeam = 0;
let winner = 'mystery';
let gameOver = false;
const xMap = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
let shipShapes = [5, 4, 3, 3, 2];
let ships = {} // maps 0: shipLocations, 1: shipLocations
let hitsLeft = {}; // maps 0/1: array of ship lives left
let boards = [];

function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateShips() {
  let shiplocs = [];
  for(let ship of shipShapes) {
    shiplocs.push(generateShip(ship, shiplocs));
  }
  return shiplocs;
}

function shipOccupied(shipSize, ship, orientation) {
  let x = ship[0];
  let y = ship[1];
  let occupied = {};
  for(let i=0; i < shipSize; i++) {
    if(orientation == 0) {
      x2 = x+i;
      y2 = y+0;
    } else {
      x2 = x+0;
      y2 = y+i;
    }
    occupied[[x2, y2]] = null;
  }
  return occupied;
}

function generateShip(newShip, others) {
  let orientation = randInt(0, 1); // 0 is right/left, 1 is up/down
  let x = randInt(0, 10-newShip);
  let y = randInt(0, 10);
  if(orientation == 1) {
    x = randInt(0, 10);
    y = randInt(0, 10-newShip);
  }
  let nextOccupied = shipOccupied(newShip, [x, y], orientation);
  let works = true;
  for(other of others) {
    // check for a collision
    for(let otherKey of Object.keys(other)) {
      if(nextOccupied.hasOwnProperty(otherKey)) {
        works = false;
      }
    }
  }
  if(works) {
    return nextOccupied;
  } else {
    return generateShip(newShip, others);
  }
}

function generateBoard() {
  board = [];
  boardRow = [];
  // cols for row
  for(let i = 0; i < 10; i++) {
    boardRow.push('~');
  }

  // add each row to board
  for(let i = 0; i < 10; i++) {
    board.push(boardRow.slice());
  }
  return board;
}


function reset() {
  ships = {0: generateShips(), 1: generateShips()};
  boards.push(generateBoard());
  boards.push(generateBoard());
  gameOver = false;
  lastTeam = Math.round(Math.random());
  hitsLeft = {0: shipShapes.slice(), 1: shipShapes.slice()};
}

function isHit(x, y, board, ships) {
  spot = [x, y]
  let hit = false;
  for(let shipInd in ships) {
    if(ships[shipInd].hasOwnProperty(spot)) {
      hit = true;
      hitsLeft[shipInd] -= 1;
      break;
    }
  }
  if(hit) {
    board[x][y] = 'H';
  } else {
    board[x][y] = 'm'
  }

  return hit;
}

function countSinks(ships) {
  let count = 0;
  for(hits of ships) {
    if(hits == 0) {
      count += 1;
    }
  }
  return count;
}

function boardToString(board) {
  s = '~'
  for(let i=0; i < 10; i++) {
    s += i
  }
  for(let i=0; i < 10; i++) {
    s += '\n' + xMap[i];
    for(let j=0; j < 10; j++) {
      s += board[i][j];
    }
  }
  return s;
}

reset();

/**
* The Battleship Game
* @param {integer} team the binary team you're on
* @param {string} x i coordinate to hit
* @param {integer} y j coordinate to hit
* @param {boolean} reset whether the board should be reset
* @param {boolean} turn asks whose turn it is
* @returns {object}
*/
module.exports = (team=0, x='C', y=5, reset=false, turn=false, context, callback) => {
  // turn into integer
  xInd = xMap.indexOf(x);

  if(turn) {
    let color = 'Red';
    if(lastTeam == 0) {
      color = 'Blue';
    }
    callback(null, {text: `It is ${color}'s turn!`, success: true});
  } else if(reset && gameOver) {
    reset();
    let color = 'Red';
    if(lastTeam == 0) {
      color = 'Blue';
    }
    exsmiley.tracker['@dev']({post: true, store: {'name': 'bs', 'info': boards}}, function (err, result) {
      callback(null, {text: `Successfully Reset! It is ${color}'s turn!`, success: true});
    });
  } else if(gameOver) {
    callback(null, {text: `Game already over! The ${winner} team won.\n` + boardToString(boards[team]), success: false})
  } else if(reset) {
    callback(null, {text: "Can't reset: game not over\n" + boardToString(boards[team]), success: false})
  } else if(lastTeam == team) {
    let color = 'Red';
      if(team != 0) {
        color = 'Blue';
      }
    callback(null, {text: `It is not ${color}'s turn.`, success: false})
  } else if (boards[team][xInd][y] != '~'){
    callback(null, {text: `Location ${x}${y} already marked!\n` + boardToString(boards[team]), success: false});
  } else {
    let text = `shot at location ${x}${y}.`;
    let hit = isHit(xInd,y, boards[team], ships[lastTeam]);
    let sunkCount = countSinks(hitsLeft[lastTeam]);
    let color = 'Red';
    if(team != 0) {
      color = 'Blue';
    }
    lastTeam = team;
    if(hit) {
      text += ' It was a hit!';
    } else {
      text += ' It was a miss :('
    }

    text += `\nNumber of ships sunk: ${sunkCount}\n` + boardToString(boards[team]);

    if(sunkCount == 5) {
      gameOver = true;
      winner = color;
      text += `\nThe ${color} team won!`
      lib.exsmiley.scores['@dev']({post: true, store: {'name': 'bs', 'team': team}}, function (err, result) {});
    }

    lib.exsmiley.tracker['@dev']({post: true, store: {'name': 'bs', 'info': boards}}, function (err, result) {
      callback(null, {text: text, success: true});
    });
  }

};
