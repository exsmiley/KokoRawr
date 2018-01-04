const lib = require('lib')({token: process.env.STDLIB_TOKEN});

// initialize the board
let numCols = 7;
let numRows = 6;
const EMPTY = '~';

// gets the highest unoccupied location for each piece
function getTopLocation(board, location) {
  let top = -1;

  for(let i = 0; i < numRows; i++) {
    if(board[i][location-1] == EMPTY) {
      top = i;
    }
  }

  return top;
}

// checks if a team has won the game
// thanks based ferdelOlmo (https://stackoverflow.com/questions/32770321/connect-4-check-for-a-win-algorithm)
function checkWin(board, player) {
    // horizontalCheck 
    for (let j = 0; j<numCols-3 ; j++ ){
        for (let i = 0; i<numRows; i++){
            if (board[i][j] == player && board[i][j+1] == player && board[i][j+2] == player && board[i][j+3] == player){
                return true;
            }           
        }
    }
    // verticalCheck
    for (let i = 0; i<numRows-3 ; i++ ){
        for (let j = 0; j<numCols; j++){
            if (board[i][j] == player && board[i+1][j] == player && board[i+2][j] == player && board[i+3][j] == player){
                return true;
            }           
        }
    }
    // ascendingDiagonalCheck 
    for (let i=3; i<numRows; i++){
        for (let j=0; j<numCols-3; j++){
            if (board[i][j] == player && board[i-1][j+1] == player && board[i-2][j+2] == player && board[i-3][j+3] == player)
                return true;
        }
    }
    // descendingDiagonalCheck
    for (let i=3; i<numRows; i++){
        for (let j=3; j<numCols; j++){
            if (board[i][j] == player && board[i-1][j-1] == player && board[i-2][j-2] == player && board[i-3][j-3] == player)
                return true;
        }
    }
    return false;
}

function checkTie(board) {
  let tie = true;
  for(let i = 0; i < numCols; i++) {
    if(board[0][i] == EMPTY) {
      tie = false;
    }
  }
  return tie;
}

function boardToText(board) {
  let s = '';
  for(let i = 0; i < numRows; i++) {
    s += '|';
    for(let j = 0; j < numCols; j++) {
      s += board[i][j];
    }
    s += '|\n';
  }
  return s;
}


/**
* Top level function for Connect 4
* @param {integer} team the team who is making the move
* @param {integer} location the location (1-7) to place a piece
* @param {boolean} reset whether the game should be restarted
* @param {boolean} turn asks whose turn it is
* @param {boolean} state gets the state of the board
* @returns {object}
*/
module.exports = (team=0, location=0, reset=false, turn=false, state=false, context, callback) => {
  lib.utils.storage.get('c4', (err, gameInfo) => {
    if (err) {
      utils.log.error("error with /c4 command", new Error("Accepts error objects"), (err) => {
        return callback(null, 'An error has occurred with your command'.);
      });
    }
    if (gameInfo == null) {
      gameInfo = {};
    }
    if (!gameInfo.hasOwnProperty('board')) {
      gameInfo['board'] = [];
      let boardRow = [];
      // cols for row
      for(let i = 0; i < 7; i++) {
        boardRow.push(EMPTY);
      }
      // add each row to board
      for(let i = 0; i < 6; i++) {
        gameInfo['board'].push(boardRow.slice());
      }
    }
    if (!gameInfo.hasOwnProperty('lastTeam')) {
      gameInfo['lastTeam'] = Math.round(Math.random());
    }
    if (!gameInfo.hasOwnProperty('gameOver')) {
      gameInfo['gameOver'] = false;
    }
  })
  let board = gameInfo['board'];
  let lastTeam = gameInfo['lastTeam'];
  let gameOver = gameInfo['gameOver'];

  let json = {};
  let top = getTopLocation(board, location);

  if(turn) {
    let color = 'Red';
    if(lastTeam == 0) {
      color = 'Blue';
    }
    callback(null, {text: `It is ${color}'s turn!`, success: true});
  } else if(state) {
    callback(null, {text: '\n'+boardToText(board), success: true});
  } else if(gameOver && reset) {
    json['success'] = true;
    gameInfo = {};
    json['text'] = 'Successfully reset the game!\n' + boardToText(board);
    lib.utils.storage.set('c4', gameInfo, (err, result) => {
      callback(null, json);
    });
  } else if(reset) {
    json['success'] = false;
    json['text'] = 'The game cannot be reset: it is not over!\n' + boardToText(board)
    callback(null, json);
  } else if(gameOver) {
    json['success'] = false;
    json['text'] = 'The game is already over!\n' + boardToText(board)
    callback(null, json);
  } else if(team == lastTeam) {
    json['success'] = false;
    json['text'] = 'It is not your turn.\n' + boardToText(board)
    callback(null, json);
  } else if(top < 0) {
    json['success'] = false;
    json['text'] = `No more pieces can be placed at location ${location}.\n` + boardToText(board)
    callback(null, json);
  } else {
    gameInfo['lastTeam'] = team;
    json['success'] = true;
    let symbol = 'R';
    if(team != 0) {
      symbol = 'B';
    }
    gameInfo['board'][top][location-1] = symbol;
    json['text'] = ` played at location ${location}.\n` + boardToText(board);

    if(checkWin(board, symbol)) {
      let teamName = 'Red';
      if(team != 0) {
        teamName = 'Blue';
      }
      gameInfo['gameOver'] = true;
      json['text'] += `\n${teamName} won!`
      lib[`${context.service.identifier}.services.scores`](true, {'name': 'c4', 'team': team}, undefined, function (err, result) {});
    } else if(checkTie(board)) {
      json['text'] += "\nIt's a tie!";
      gameInfo['gameOver'] = true;
    }
    lib.utils.storage.set('c4', gameInfo, (err, result) => {
      callback(null, json);
    });
  }
};
