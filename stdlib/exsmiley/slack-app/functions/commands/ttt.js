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
    let reset = text.includes('reset');

    if (err || (isNaN(loc) || loc < 1 || loc > 9) && !reset) {
      // handle it
      callback(err, {
          response_type: 'in_channel',
          text: 'location out of bounds (1->9 valid) or invalid command (location number or "reset")!'
        });
    }

    // makes sure no errors occur
    if(reset) {
      loc = 0;
    }

    lib.exsmiley.ttt['@dev']({team: team, loc: loc, reset: reset}, function(err, result) {

      if (!result['success']) {
        // handle it
        callback(null, {
          response_type: 'in_channel',
          text: '(Tic Tac Toe) ' + result['text']
        });
      } else {
        let text = result['text'];

        if(text.includes('|')) {
          let color = 'Red';
          if(team != 0) {
            color = 'Blue';
          }
          text = `(Tic Tac Toe) <@${user}>:${color}` + text;
        } else {
          text = '(Tic Tac Toe) ' + text;
        }

        callback(null, {
          response_type: 'in_channel',
          text: text
        });
      }
    });
    

  });

};
