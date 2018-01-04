const lib = require('lib')({token: process.env.STDLIB_TOKEN});

const EMPTY = '~';

function markedToBoard(marked) {
	let marked2 = [];
	for(m of marked) {
		if(m == 0) {
			marked2.push('R');
		} else if(m == 1) {
			marked2.push('B');
		} else {
			marked2.push(EMPTY);
		}
	}
	return `|${marked2[0]}${marked2[1]}${marked2[2]}|\n|${marked2[3]}${marked2[4]}${marked2[5]}|\n|${marked2[6]}${marked2[7]}${marked2[8]}|\n`
}

// returns false if there is still an empty location or a team won
function isTie(marked, gameOver) {
	if(gameOver) {
		return false;
	} else {
		let tie = true;
		for(let i = 0; i < marked.length; i++) {
			if(marked[i] == EMPTY) {
				tie = false;
			}
		}
		return tie;
	}
}

/**
* The tic tac toe game
* @param {integer} team What token is placed for that team
* @param {integer} loc Where the token is placed
* @param {boolean} reset if the game should be reset
* @param {boolean} turn asks whose turn it is
* @param {boolean} state gets the state of the board
* @returns {object} {text: str, success: bool}
*/
module.exports = (team, loc, reset=false, turn=false, state=false, context, callback) => {
	lib.utils.storage.get('ttt', (err, gameInfo) => {
		if (err) {
			utils.log.error("error with /ttt command", new Error("Accepts error objects"), (err) => {
				return callback(null, 'An error has occurred with your command');
			});
		}
		if (gameInfo == null) {
			gameInfo = {};
		}
		if (!gameInfo.hasOwnProperty('marked')) {
			gameInfo['marked'] = [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY];
		}
		if (!gameInfo.hasOwnProperty('gameOver')) {
			gameInfo['gameOver'] = false;
		}
		if (!gameInfo.hasOwnProperty('lastTeam')) {
			gameInfo['lastTeam'] = Math.round(Math.random());
		}
		let marked = gameInfo['marked'];
		let gameOver = gameInfo['gameOver'];
		let lastTeam = gameInfo['lastTeam'];

		if(turn) {
		    let color = 'Red';
		    if(lastTeam == 0) {
		      color = 'Blue';
		    }
		    return callback(null, {text: `It is ${color}'s turn!`, success: true});
	  	} else if(state) {
	  		return callback(null, {text: '\n'+markedToBoard(marked), success: true});
	  	} else if(reset && gameOver) {
			gameInfo = {};
			let color = 'Red';
		    if(lastTeam == 0) {
		      color = 'Blue';
		    }
		    lib.utils.storage.set('ttt', gameInfo, (err, result) => {
		    	return callback(null, {text: `Successfully Reset! It is ${color}'s turn!`, success: true});
		    });
		} else if(gameOver) {
			return callback(null, {text: 'Game already over\n' + markedToBoard(marked), success: false})
		} else if(reset) {
			return callback(null, {text: "Can't reset: game not over\n" + markedToBoard(marked), success: false})
		} else if(lastTeam == team) {
			let color = 'Red';
		    if(team != 0) {
		      color = 'Blue';
		    }
			return callback(null, {text: `It is not ${color}'s turn.`, success: false})
		} else if (marked[loc-1] != EMPTY){
			return callback(null, {text: `Location ${loc} already marked!\n` + markedToBoard(marked), success: false});
		} else {
			gameInfo['marked'][loc-1] = team;
			gameInfo['lastTeam'] = team;

			let winLoc = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]]

			for(loc in winLoc) {
				if (gameInfo['marked'][loc[0]] == gameInfo['marked'][loc[1]] && gameInfo['marked'][loc[1]] == gameInfo['marked'][loc[2]] && gameInfo['marked'][1] != EMPTY) {
					gameInfo['gameOver'] = true;
				}
			}

			let color = 'Red';
		    if(team != 0) {
		      color = 'Blue';
		    }

		    let text = `played at location: ${loc}\n` + markedToBoard(gameInfo['marked']);
		    if(gameInfo['gameOver']) {
		    	text += `${color} won the game!`
		    	lib[`${context.service.identifier}.services.scores`](true, {'name': 'ttt', 'team': team}, undefined, function (err, result) {});
		    }

		    if(isTie(gameInfo['marked'], gameInfo['gameOver'])) {
		    	gameInfo['gameOver'] = true;
		    	text += 'Tie game!'
		    }
		    
		    lib.utils.storage.set('ttt', gameInfo, (err, result) => {
		    	return callback(null, {text: text, success: true});
		    });
		}
	})
};
