const lib = require('lib')({token: process.env.STDLIB_TOKEN});

/**
* Rock Paper Scissors!
* @param {string} user the user trying to perform the operation
* @param {integer} team team of the user
* @param {string} option rock, paper, or scissors
* @returns {string}
*/
module.exports = (user='Bob', team=1, option='rock', context, callback) => {
  lib.utils.storage.get('rps', (err, gameInfo) => {
    console.log(gameInfo)
    if (err) {
      return callback(null, 'An error has occurred with your command.');
    }
    if (gameInfo == null) {
      gameInfo = {};
    }
    if (!gameInfo.hasOwnProperty('waiting')) {
      gameInfo['waiting'] = [];
    }
    if (!gameInfo.hasOwnProperty('waitingTeam')) {
      gameInfo['waitingTeam'] = -1;
    }
    if (!gameInfo.hasOwnProperty('options')) {
      gameInfo['options'] = ['rock', 'paper', 'scissors'];
    }
    let waiting = gameInfo['waiting'];
    let waitingTeam = gameInfo['waitingTeam'];
    let options = gameInfo['options'];

    let index = options.indexOf(option.toLowerCase());
    let color = 'Red';
    let otherColor = 'Blue';
    if(team != 0) {
      color = 'Blue';
      otherColor = 'Red';
    }

    if(index == -1) {
      return callback(null, `<@${user}>:${color}, ${option} is not a valid option`);
    } else if(waitingTeam == team || waitingTeam == -1) {
      // enque the user
      waiting.push([user, index]);
      gameInfo['waitingTeam'] = team;
      gameInfo['waiting'] = waiting;
      lib.utils.storage.set('rps', gameInfo, (err, result) => {
        return callback(null, `<@${user}>:${color} is waiting for a match...`);
      })
    } else {
      // deque and do the result
      let other = waiting.shift();
      let otherTeam = waitingTeam+0;
      if(waiting.length == 0) {
        gameInfo['waitingTeam'] = -1;
      }
      gameInfo['waiting'] = waiting;

      let otherUser = other[0];
      let otherIndex = other[1];

      lib.utils.storage.set('rps', gameInfo, function (err, result) {});

      if(index == otherIndex+1 || (index == 1 && otherIndex == 3)) {
        // user wins
        lib[`${context.service.identifier}.services.scores`](true, {'name': 'rps', 'team': team}, undefined, function (err, result) {
          return callback(null, `<@${user}>:${color} beat <@${otherUser}>:${otherColor}'s ${options[otherIndex]} with ${options[index]}`);
        });
      } 
      else if(index == otherIndex) {
        // tie
        return callback(null, `<@${user}>:${color} and <@${otherUser}>:${otherColor} both chose ${options[index]}...`);
      } else {
        // other user wins
        lib[`${context.service.identifier}.services.scores`](true, {'name': 'rps', 'team': otherTeam}, undefined, function (err, result) {
          return callback(null, `<@${otherUser}>:${otherColor} beat <@${user}>:${color}'s ${options[index]} with ${options[otherIndex]}`);
        });
      }
    }
  })
};
