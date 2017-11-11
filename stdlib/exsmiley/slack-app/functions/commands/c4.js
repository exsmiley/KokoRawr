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

    if (err || (isNaN(loc) || loc < 1 || loc > 7) && !reset) {
      // handle it
      callback(err, {
          response_type: 'in_channel',
          text: 'location out of bounds (1->7 valid) or invalid command (location number or "reset")!'
        });
    }

    // makes sure no errors occur
    if(reset) {
      loc = 0;
    }
    console.log(`location: ${loc}, team: ${team}, reset: ${reset}`);

    lib.exsmiley.c4['@dev']({team: team, location: loc, reset: reset}, function(err, result) {

      if (!result['success']) {
        // handle it
        callback(null, {
          response_type: 'in_channel',
          text: '(Connect 4) ' + result['text']
        });
      } else {
        console.log(result)
        let text = result['text'];

        if(text.includes('|')) {
          let color = 'Red';
          if(team != 0) {
            color = 'Blue';
          }
          text = `(Connect 4) <@${user}>:${color}` + text;
        } else {
          text = '(Connect 4) ' + text;
        }

        callback(null, {
          response_type: 'in_channel',
          text: text
        });
      }
    });
  });

};
