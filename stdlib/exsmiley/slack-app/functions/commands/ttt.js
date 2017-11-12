const lib = require('lib')({token: process.env.STDLIB_TOKEN});

/**
* /ttt
*
*   Tells the user tic tac toe information.
*
* @param {string} user The user id of the user that invoked this command (name is usable as well)
* @param {string} channel The channel id the command was executed in (name is usable as well)
* @param {string} text The text contents of the command
* @param {object} command The full Slack command object
* @param {string} botToken The bot token for the Slack bot you have activated
* @returns {object}
*/
module.exports = (user, channel, text = '', command = {}, botToken = null, callback) => {
  lib.exsmiley.teammaker['@dev']({name: user}, function (err, team) {

    let loc = parseInt(text);
    let turn = text.includes('turn');
    let reset = text.includes('reset');
    let color = 'Red';
    if(team != 0) {
      color = 'Blue';
    }

    if (err || (isNaN(loc) || loc < 1 || loc > 9) && !reset && !turn) {
      // handle it
      callback(err, {
          response_type: 'in_channel',
          text: `(Tic Tac Toe) <@${user}>:${color} ` +'location out of bounds (1->9 valid) or invalid command (location number or "reset")!'
        });
    }

    // makes sure no errors occur
    if(reset||turn) {
      loc = 0;
    }

    lib.exsmiley.ttt['@dev']({team: team, loc: loc, reset: reset, turn: turn}, function(err, result) {
        callback(null, {
          response_type: 'in_channel',
          text: `(Tic Tac Toe) <@${user}>:${color} ` + result['text']
        });
      });
    });
  };
