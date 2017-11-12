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
module.exports = (user, channel, text = '', command = {}, botToken = null, callback) => {
  if(text[0] == 'r') {
    text = 'rock';
  } else if(text[0] == 'p') {
    text = 'paper';
  } else if(text[0] == 's'){
    text = 'scissors'
  }

  lib.exsmiley.teammaker['@dev']({name: user}, function (err, team) {
    lib.exsmiley.rps['@dev']({user: user, team: team, option: text}, function(err, result) {
      callback(null, {
        response_type: 'in_channel',
        text: `(Rock Paper Scissors) ` + result
      });
    });
  });
};