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
    if(text === 'help') {
      let resp = `(Duck Duck Goose) <@${user}>:${color} thanks for asking for help!
In this version of Duck Duck Goose, users simply call the /duck command and will get a reply saying that either they are a duck or that they are a goose. One team point is awarded for a duck, but 5 points are deducted for a goose.`
      callback(null, {
          response_type: 'in_channel',
          text: resp
        });
    } else {
      lib.exsmiley.duck['@dev']({team: team}, function(err, result) {
        callback(null, {
          response_type: 'in_channel',
          text: `(Duck Duck Goose) <@${user}>:${color} ` + result
        });
      });
    }
  });
};