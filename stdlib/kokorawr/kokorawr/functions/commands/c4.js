const team = require('../services/team.js');
const c4 = require('../services/c4.js');

/**
* /c4
*
*   Tells the user Connect 4 information.
*
* @param {string} user The user id of the user that invoked this command (name is usable as well)
* @param {string} channel The channel id the command was executed in (name is usable as well)
* @param {string} text The text contents of the command
* @param {object} command The full Slack command object
* @param {string} botToken The bot token for the Slack bot you have activated
* @returns {object}
*/
module.exports = (user, channel, text = '', command = {}, botToken = null, callback) => {
  team(user, undefined, function (err, teamr) {

    let loc = parseInt(text);
    let reset = text.includes('reset');
    let turn = text.includes('turn');
    let state = text.includes('state');
    let help = text.includes('help');
    let color = 'Red';
    if(teamr != 0) {
      color = 'Blue';
    }

    if (err || (isNaN(loc) || loc < 1 || loc > 7) && !reset && !turn && !state && !help) {
      // handle it
      callback(err, {
          response_type: 'in_channel',
          text: `(Connect 4) <@${user}>:${color} ` +'location out of bounds (1->7 valid) or invalid command (location number or "reset")!'
        });
    }

    // makes sure no errors occur
    if(reset||turn||state) {
      loc = 0;
    }

    if(help) {
      let resp = `(Connect 4) <@${user}>:${color} thanks for asking for help!
In Connect 4, players take turns placing a piece in columns 1-7. Once a piece is placed, it drops to the bottom of the column. The goal of the game is to get 4 pieces in a row, whether it be horizontally, vertically, or diagonally.`
      callback(null, {
          response_type: 'in_channel',
          text: resp
        });
    } else {
      c4(teamr, loc, reset, turn, state, undefined, function(err, result) {
        callback(null, {
          response_type: 'in_channel',
          text: `(Connect 4) <@${user}>:${color} ` + result['text']
        });
      });
    }
  });
}
