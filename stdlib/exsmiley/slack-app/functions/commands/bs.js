const lib = require('lib')({token: process.env.STDLIB_TOKEN});
const xMap = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

/**
* /bs
*
*   Tells the user Battleship information.
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

    let reset = text.includes('reset');
    let turn = text.includes('turn');
    let color = 'Red';
    if(team != 0) {
      color = 'Blue';
    }

    let x = 'A';
    let y = 0;
    if(!reset) {
      x = text[0].toUpperCase();
      y = parseInt(text[1]);
    }

    if (err || (isNaN(y) || y < 0 || y > 9 || xMap.indexOf(x) == -1) && !reset && !turn) {
      // handle it
      callback(err, {
          response_type: 'in_channel',
          text: `(Battleship) <@${user}>:${color} ` +'location out of bounds (1->9 valid) or invalid command (location number or "reset")!'
        });
    }

    // makes sure no errors occur
    if(reset||turn) {
      x = 'A';
      y = 0;
    }

    lib.exsmiley.bs['@dev']({team: team, x: x, y: y, reset: reset, turn: turn}, function(err, result) {
        callback(null, {
          response_type: 'in_channel',
          text: `(Battleship) <@${user}>:${color} ` + result['text']
        });
      });
    });
  }
