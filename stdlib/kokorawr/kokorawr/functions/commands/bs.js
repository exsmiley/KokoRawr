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
module.exports = (user, channel, text = '', command = {}, botToken = null, context, callback) => {
  lib[`${context.service.identifier}.services.team`](user, undefined, function (err, teamr) {

    let reset = text.includes('reset');
    let turn = text.includes('turn');
    let state = text.includes('state');
    let help = text.includes('help');
    let color = 'Red';
    if(teamr != 0) {
      color = 'Blue';
    }

    let x = 'A';
    let y = 0;
    if(!reset) {
      x = text[0].toUpperCase();
      y = parseInt(text[1]);
    }

    if (err || (isNaN(y) || y < 0 || y > 9 || xMap.indexOf(x) == -1) && !reset && !turn && !state && !help) {
      // handle it
      callback(err, {
          response_type: 'in_channel',
          text: `(Battleship) <@${user}>:${color} ` +'location out of bounds (1->9 valid) or invalid command (location number or "reset")!'
        });
    }

    // makes sure no errors occur
    if(reset||turn||state) {
      x = 'A';
      y = 0;
    }

    if(help) {
      let resp = `(Battleship) <@${user}>:${color} thanks for asking for help!
Battleship is a game in which two teams each have a series of 5 ships of length 5, 4, 3, 3, and 2 units hidden on a 10x10 board. The goal of each team is to sink all of the ships of the other team before they sink yours.

Gameplay involves choosing a coordinate in the range of A0-J9 to specify a location to fire at. The response to that will be an indication of a hit or miss. A hit means that you hit one of the locations of one of the ships. In order to sink a ship, every location that a ship occupies must be hit.

The first team to sink the other team's ships wins.`
      callback(null, {
          response_type: 'in_channel',
          text: resp
        });
      } else {
      lib[`${context.service.identifier}.services.bs`](teamr, x, y, reset, turn, state, undefined, function(err, result) {
          callback(null, {
            response_type: 'in_channel',
            text: `(Battleship) <@${user}>:${color} ` + result['text']
          });
        });
      }    
    });
  }
