const lib = require('lib')({token: process.env.STDLIB_TOKEN});

/**
* /duck
*
*   Plays duck duck goose! :O
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

    let color = 'Red';
    if(team != 0) {
      color = 'Blue';
    }

    lib.exsmiley.duck['@dev']({team: team}, function(err, result) {
      callback(null, {
        response_type: 'in_channel',
        text: `(Duck Duck Goose) <@${user}>:${color} ` + result
      });
    });
  });
};