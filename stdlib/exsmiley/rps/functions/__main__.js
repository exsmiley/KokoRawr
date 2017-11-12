const lib = require('lib')({token: process.env.STDLIB_TOKEN});

let waiting = [];
let waitingTeam = -1;
let options = ['rock', 'paper', 'scissors']

/**
* Rock Paper Scissors!
* @param {string} user the user trying to perform the operation
* @param {integer} team team of the user
* @param {string} option rock, paper, or scissors
* @returns {string}
*/
module.exports = (user='Bob', team=1, option='rock', context, callback) => {

  let index = options.indexOf(option.toLowerCase());
  let color = 'Red';
  let otherColor = 'Blue';
  if(team != 0) {
    color = 'Blue';
    otherColor = 'Red';
  }

  if(index == -1) {
    callback(null, `<@${user}>:${color}, ${option} is not a valid option`);
  } else if(waitingTeam == team || waitingTeam == -1) {
    // enque the user
    waiting.push([user, index]);
    waitingTeam = team;
    callback(null, `<@${user}>:${color} is waiting for a match...`);
  } else {
    // deque and do the result
    let other = waiting.shift();
    let otherTeam = waitingTeam+0;
    if(waiting.length == 0) {
      waitingTeam = -1;
    }

    let otherUser = other[0];
    let otherIndex = other[1];

    if(index == otherIndex+1 || (index == 1 && otherIndex == 3)) {
      // user wins
      lib.exsmiley.scores['@dev']({post: true, store: {'name': 'rps', 'team': team}}, function (err, result) {
        callback(null, `<@${user}>:${color} beat <@${otherUser}>:${otherColor}'s ${options[otherIndex]} with ${options[index]}`);
      });
    } 
    else if(index == otherIndex) {
      // tie
      callback(null, `<@${user}>:${color} and <@${otherUser}>:${otherColor} both chose ${options[index]}...`);
    } else {
      // other user wins
      lib.exsmiley.scores['@dev']({post: true, store: {'name': 'rps', 'team': otherTeam}}, function (err, result) {
        callback(null, `<@${otherUser}>:${otherColor} beat <@${user}>:${color}'s ${options[index]} with ${options[otherIndex]}`);
      });
    }
  }
};
