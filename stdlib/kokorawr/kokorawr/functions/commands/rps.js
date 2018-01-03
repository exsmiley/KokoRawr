const lib = require('lib')({token: process.env.STDLIB_TOKEN});

/**
* /rps
*
*   Plays rock paper scissors! :D
*
* @param {string} user The user id of the user that invoked this command (name is usable as well)
* @param {string} channel The channel id the command was executed in (name is usable as well)
* @param {string} text The text contents of the command
* @param {object} command The full Slack command object
* @param {string} botToken The bot token for the Slack bot you have activated
* @returns {object}
*/
module.exports = (user, channel, text = '', command = {}, botToken = null, context, callback) => {
  if(text[0] == 'r') {
    text = 'rock';
  } else if(text[0] == 'p') {
    text = 'paper';
  } else if(text[0] == 's'){
    text = 'scissors'
  }

  if(text.includes('help')) {
    let resp = `(Rock Paper Scissors) <@${user}>:${color} thanks for asking for help!
In this version of Rock Paper Scissors, users call the /rps command followed by one of rock, paper, and scissors. Once the user is paired with another, the duel begins. In this duel paper beats rock, scissors beats paper, and rock beats scissors. If the same tool is picked by both users, then it is a draw.`
      callback(null, {
          response_type: 'in_channel',
          text: resp
        });
  } else {
    lib[`${context.service.identifier}.services.team`](user, undefined, function (err, teamr) {
      lib[`${context.service.identifier}.services.rps`](user, teamr, text, undefined, function(err, result) {
        callback(null, {
          response_type: 'in_channel',
          text: `(Rock Paper Scissors) ` + result
        });
      });
    });
  }
};