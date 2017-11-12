const lib = require('lib')({token: process.env.STDLIB_TOKEN});

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
  lib.exsmiley.teammaker['@dev']({name: user}, function (err, team) {

    let loc = parseInt(text);
    let reset = text.includes('reset');
    let turn = text.includes('turn');
    let state = text.includes('state');
    let color = 'Red';
    if(team != 0) {
      color = 'Blue';
    }

    if (err || (isNaN(loc) || loc < 1 || loc > 7) && !reset && !turn && !state) {
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

    lib.exsmiley.c4['@dev']({team: team, location: loc, reset: reset, turn: turn, state: state}, function(err, result) {
        callback(null, {
          response_type: 'in_channel',
          text: `(Connect 4) <@${user}>:${color} ` + result['text']
        });
      });
    });
  }
