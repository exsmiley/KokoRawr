const teammaker = require('../../helpers/teammaker.js');
const ttt = require('../../helpers/ttt.js');

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
  teammaker({name: user}, function (err, team) {

    let loc = parseInt(text);
    let turn = text.includes('turn');
    let reset = text.includes('reset');
    let state = text.includes('state');
    let help = text.includes('help');
    let color = 'Red';
    if(team != 0) {
      color = 'Blue';
    }

    if (err || (isNaN(loc) || loc < 1 || loc > 9) && !reset && !turn && !state && !help) {
      // handle it
      callback(err, {
          response_type: 'in_channel',
          text: `(Tic Tac Toe) <@${user}>:${color} ` +'location out of bounds (1->9 valid) or invalid command (location number or "reset")!'
        });
    }

    // makes sure no errors occur
    if(reset||turn||state) {
      loc = 0;
    }
    if(help) {
      let resp = `(Tic Tac Toe) <@${user}>:${color} thanks for asking for help!
In Tic Tac Toe, users attempt to get 3 in a row of their symbol. The locations in this version are specified by the numbers 1-9. 1-3 are the top row, 4-6 are the second row, and 7-9 are the final row all going horizontally. A draw is declared if all of the spaces are filled and nobody won.`
      callback(null, {
          response_type: 'in_channel',
          text: resp
        });
    } else {
      ttt({team: team, loc: loc, reset: reset, turn: turn, state: state}, function(err, result) {
        callback(null, {
          response_type: 'in_channel',
          text: `(Tic Tac Toe) <@${user}>:${color} ` + result['text']
        });
      });
    }
  });
};
