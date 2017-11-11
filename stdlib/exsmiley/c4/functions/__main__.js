// initialize the board
let numCols = 7;
let numRows = 6;
let board = [];
let boardRow = [];

// the last team to make a move
let lastTeam = Math.round(Math.random());
let gameOver = false;

function resetBoard() {
  board = [];
  boardRow = [];
  // cols for row
  for(let i = 0; i < numCols; i++) {
    boardRow.push('~');
  }

  // add each row to board
  for(let i = 0; i < numRows; i++) {
    board.push(boardRow.slice());
  }
  lastTeam = Math.round(Math.random());
  gameOver = false;
}

resetBoard();


// gets the highest unoccupied location for each piece
function getTopLocation(location) {
  let top = -1;

  for(let i = 0; i < numRows; i++) {
    if(board[i][location-1] == '~') {
      top = i;
    }
  }

  return top;
}

// checks if a team has won the game
// thanks based ferdelOlmo (https://stackoverflow.com/questions/32770321/connect-4-check-for-a-win-algorithm)
function checkWin(player) {
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
    if(board[0][i] == '~') {
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
* @returns {object}
*/
module.exports = (team=0, location=0, reset=false, context, callback) => {
  let json = {};
  let top = getTopLocation(location);

  if(gameOver && reset) {
    json['success'] = true;
    resetBoard()
    json['text'] = 'Successfully reset the game!\n' + boardToText(board)
    callback(null, json);
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
    lastTeam = team;
    json['success'] = true;
    let symbol = 'R';
    if(team != 0) {
      symbol = 'B';
    }
    board[top][location-1] = symbol;
    json['text'] = ` played at location ${location}.\n` + boardToText(board);

    if(checkWin(symbol)) {
      let teamName = 'Red';
      if(team != 0) {
        teamName = 'Blue';
      }
      gameOver = true;
      json['text'] += `\n${teamName} won!`
    } else if(checkTie(board)) {
      json['text'] += "\nIt's a tie!";
      gameOver = true;
    }

    callback(null, json);
  }

};