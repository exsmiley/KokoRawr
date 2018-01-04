const lib = require('lib')({token: process.env.STDLIB_TOKEN});

function calculateStats(guess, actual) {
  countsGuess = {};
  countsActual = {};
  for(let num of new Set(guess)) {
    countsGuess[num] = 0;
    for(let num2 of guess) {
      if(num == num2) {
        countsGuess[num] += 1;
      }
    }
  }
  for(let num of new Set(actual)) {
    countsActual[num] = 0;
    for(let num2 of actual) {
      if(num == num2) {
        countsActual[num] += 1;
      }
    }
  }

  let pegs = [0, 0];

  // now use counts to see white pegs
  for(let num in countsGuess) {
    if(num in countsActual) {
      pegs[0] += Math.min(countsGuess[num], countsActual[num]);
    }
  }

  // now count red pegs
  for(let i = 0; i < 4; i++) {
    if(guess[i] === actual[i]) {
      pegs[1] += 1;
    }
  }

  return pegs
}

/**
* Emulates the game of Mastermind among multiple people
* @param {string} user person making the guess
* @param {integer} team team of the user
* @param {string} guess 4-digit number to guess
* @returns {string}
*/
module.exports = (user='bob', team=0, guess='', context, callback) => {
  lib.utils.storage.get('mm', (err, gameInfo) => {
    if (err) {
      return callback(null, 'An error has occurred with your command.');
    }
    if (gameInfo == null) {
      gameInfo = {};
    }
    if (!gameInfo.hasOwnProperty('storedUser')) {
      gameInfo['storedUser'] = null;
    }
    if (!gameInfo.hasOwnProperty('storedNumber')) {
      gameInfo['storedNumber'] = null;
    }
    let storedUser = gameInfo['storedUser'];
    let storedNumber = gameInfo['storedNumber'];

    if(guess.length != 4 || isNaN(parseInt(guess))) {
      return callback(null, `${guess} is not a 4-digit number`);
    } else if(storedNumber == null) {
      gameInfo['storedUser'] = user;
      gameInfo['storedNumber'] = guess;
      lib.utils.storage.set('mm', gameInfo, (err, result) => {
        return callback(null, `had a number selected as the number to guess!`);
      });
    } else if(user == storedUser) {
      return callback(null, `is not supposed to try guessing his/her own number!`);
    } else {
      let pegs = calculateStats(guess, storedNumber);
      if(pegs[1] == 4) {
        // won the game
        gameInfo = {};
        lib.utils.storage.set('mm', gameInfo, (err, result) => {
          lib[`${context.service.identifier}.services.scores`](true, {'name': 'mind', 'team': team}, undefined, function (err, result) {
            return callback(null, `correctly guessed the number ${guess}`);
          });
        });
      } else {
        // continue playing
        return callback(null, `guessed ${guess} and got ${pegs[0]} white pegs and ${pegs[1]} red pegs!`);
      }
    }
  })
};
