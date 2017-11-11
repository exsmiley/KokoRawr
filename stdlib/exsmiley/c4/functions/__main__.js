// initialize the board
let numCols = 7;
let numRows = 6;
let board = [];
let boardRow = [];

// cols for row
for(let i = 0; i < numCols; i++) {
  boardRow.push(' ');
}

// add each row to board
for(let i = 0; i < numRows; i++) {
  board.push(boardRow.slice());
}

// the last team to make a move
let lastTeam = Math.round(Math.random());
let gameOver = false;

// gets the highest unoccupied location for each piece
function getTopLocation(location) {
  let top = -1;

  for(let i = 0; i < numRows; i++) {
    if(board[i][location] == ' ') {
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


/**
* Top level function for Connect 4
* @param {integer} team the team who is making the move
* @param {integer} location the location (1-7) to place a piece
* @returns {object}
*/
module.exports = (team=0, location=0, context, callback) => {
  let json = {};
  let top = getTopLocation(location);

  if(team == lastTeam) {
    json['success'] = false;
    json['board'] = board;
    json['err'] = 'It is not your turn.'
    callback(null, json);
  } else if(top < 0) {
    json['success'] = false;
    json['board'] = board;
    json['err'] = 'No more pieces can be placed there.'
    callback(null, json);
  } else if(gameOver) {
    json['success'] = false;
    json['board'] = board;
    json['err'] = 'The game is already over!'
    callback(null, json);
  }{
    lastTeam = team;
    let symbol = 'R';
    if(team != 0) {
      symbol = 'B';
    }

    board[top][location] = symbol;
    json['win'] = checkWin(symbol)
    json['board'] = board;

    if(json['win']) {
      gameOver = true;
    }

    callback(null, json);
  }

};
