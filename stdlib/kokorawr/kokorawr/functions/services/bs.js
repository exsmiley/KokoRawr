const lib = require('lib')({token: process.env.STDLIB_TOKEN});

let shipShapes = [5, 4, 3, 3, 2];

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

function isHit(x, y, board, ships, hitsLeft) {
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

function boardToString(xMap, board) {
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

/**
* The Battleship Game
* @param {integer} team the binary team you're on
* @param {string} x i coordinate to hit
* @param {integer} y j coordinate to hit
* @param {boolean} reset whether the board should be reset
* @param {boolean} turn asks whose turn it is
* @param {boolean} state gets the state of the board
* @returns {object}
*/
module.exports = (team=0, x='C', y=5, reset=false, turn=false, state=false, context, callback) => {
  lib.utils.storage.get('bs', (err, bs) => {
    if (err) {
      return callback(null, 'An error has occurred with your command.');
    }
    if (bs == null) {
      bs = {};
    }
    if (!bs.hasOwnProperty('lastTeam')) {
      bs['lastTeam'] = Math.round(Math.random());
    }
    if (!bs.hasOwnProperty('winner')) {
      bs['winner'] = 'mystery';
    }
    if (!bs.hasOwnProperty('gameOver')) {
      bs['gameOver'] = false;
    }
    if (!bs.hasOwnProperty('ships')) {
      bs['ships'] = {0: generateShips(), 1: generateShips()};;
    }
    if (!bs.hasOwnProperty('hitsLeft')) {
      bs['hitsLeft'] = {0: shipShapes.slice(), 1: shipShapes.slice()};;
    }
    if (!bs.hasOwnProperty('boards')) {
      bs['boards'] = [];
      bs['boards'].push(generateBoard());
      bs['boards'].push(generateBoard());
    }
    let lastTeam = bs['lastTeam'];
    let winner = bs['winner'];
    let gameOver = bs['gameOver'];
    const xMap = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    let ships = bs['ships'] // maps 0: shipLocations, 1: shipLocations
    let hitsLeft = bs['hitsLeft']; // maps 0/1: array of ship lives left
    let boards = bs['boards'];

    // turn into integer
    xInd = xMap.indexOf(x);

    if(turn) {
      let color = 'Red';
      if(lastTeam == 0) {
        color = 'Blue';
      }
      return callback(null, {text: `It is ${color}'s turn!`, success: true});
    } else if(state) {
      return callback(null, {text: '\n'+boardToString(xMap, boards[team]), success: true});
    } else if(reset && gameOver) {
      bs = {};
      let color = 'Red';
      if(lastTeam == 0) {
        color = 'Blue';
      }
      lib.utils.storage.set('bs', bs, (err, result) => {
        return callback(null, {text: `Successfully Reset! It is ${color}'s turn!`, success: true});
      });
    } else if(gameOver) {
      return callback(null, {text: `Game already over! The ${winner} team won.\n` + boardToString(xMap, boards[team]), success: false})
    } else if(reset) {
      return callback(null, {text: "Can't reset: game not over\n" + boardToString(xMap, boards[team]), success: false})
    } else if(lastTeam == team) {
      let color = 'Red';
        if(team != 0) {
          color = 'Blue';
        }
      return callback(null, {text: `It is not ${color}'s turn.`, success: false})
    } else if (boards[team][xInd][y] != '~'){
      return callback(null, {text: `Location ${x}${y} already marked!\n` + boardToString(xMap, boards[team]), success: false});
    } else {
      let text = `shot at location ${x}${y}.`;
      let hit = isHit(xInd,y, boards[team], ships[lastTeam], hitsLeft);
      let sunkCount = countSinks(hitsLeft[lastTeam]);
      let color = 'Red';
      if(team != 0) {
        color = 'Blue';
      }
      bs['lastTeam'] = team;
      if(hit) {
        text += ' It was a hit!';
      } else {
        text += ' It was a miss :('
      }

      text += `\nNumber of ships sunk: ${sunkCount}\n` + boardToString(xMap, boards[team]);

      if(sunkCount == 5) {
        bs['gameOver'] = true;
        bs['winner'] = color;
        text += `\nThe ${color} team won!`
        lib[`${context.service.identifier}.services.scores`](true, {'name': 'bs', 'team': team}, undefined, function (err, result) {});
      }

      lib.utils.storage.set('bs', bs, (err, result) => {
        return callback(null, {text: text, success: true});
      });
    }
  })
};
