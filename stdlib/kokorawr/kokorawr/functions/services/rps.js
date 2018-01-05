const lib = require('lib')({token: process.env.STDLIB_TOKEN});

const options = ['rock', 'paper', 'scissors', 'r', 'p', 's'];

/**
* Rock Paper Scissors!
* @param {string} user the user trying to perform the operation
* @param {integer} team team of the user
* @param {string} option rock, paper, or scissors
* @returns {string}
*/
module.exports = (user, team, option, context, callback) => {
  lib.utils.storage.get('rps', (err, gameInfo) => {
    if (err) {
      utils.log.error("error with /rps command", new Error("Accepts error objects"), (err) => {
        return callback(null, 'An error has occurred with your command');
      });
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
    let waiting = gameInfo['waiting'];
    let waitingTeam = gameInfo['waitingTeam'];

    let index = options.indexOf(option.toLowerCase()) % 3;
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
        return callback(null, `<@${user}>:${color} is waiting for a match...` + JSON.stringify(gameInfo));
      })
    } else {
      // deque and do the result
      let other = waiting.shift();
      let otherTeam = (team+1) % 2;
      let otherUser = other[0];
      let otherIndex = other[1];

      if(waiting.length == 0) {
        gameInfo['waitingTeam'] = -1;
      }
      gameInfo['waiting'] = waiting;

      lib.utils.storage.set('rps', gameInfo, function (err, result) {
        if(index == otherIndex+1 || (index == 1 && otherIndex == 3)) {
          // user wins
          lib[`${context.service.identifier}.services.scores`]({post: true, team: team, game: 'rps'}, function (err, result) {
            return callback(null, `<@${user}>:${color} beat <@${otherUser}>:${otherColor}'s ${options[otherIndex]} with ${options[index]}` + JSON.stringify(gameInfo));
          });
        } 
        else if(index == otherIndex) {
          // tie
          return callback(null, `<@${user}>:${color} and <@${otherUser}>:${otherColor} both chose ${options[index]}...` + JSON.stringify(gameInfo));
        } else {
          // other user wins
          lib[`${context.service.identifier}.services.scores`]({post: true, team: otherTeam, game: 'rps'}, function (err, result) {
            return callback(null, `<@${otherUser}>:${otherColor} beat <@${user}>:${color}'s ${options[index]} with ${options[otherIndex]}` + JSON.stringify(gameInfo));
          });
        }
      });
    }
  })
};
