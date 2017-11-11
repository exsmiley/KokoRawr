const lib = require('lib')({token: process.env.STDLIB_TOKEN});

/**
* /team
*
*   Tells the user what time he/she is on.
*
* @param {string} user The user id of the user that invoked this command (name is usable as well)
* @param {string} channel The channel id the command was executed in (name is usable as well)
* @param {string} text The text contents of the command
* @param {object} command The full Slack command object
* @param {string} botToken The bot token for the Slack bot you have activated
* @returns {object}
*/
module.exports = (user, channel, text = '', command = {}, botToken = null, callback) => {
  lib.exsmiley.teammaker['@dev']({name: user}, function (err, result) {

    if (err) {
      // handle it
      callback(err, null);
    }

    let color = 'Red';
    if(result != 0) {
      color = 'Blue';
    }

    // do something with result
    callback(null, {
      response_type: 'in_channel',
      text: `<@${user}> is on the ${color} team!`
    });

  });

};
