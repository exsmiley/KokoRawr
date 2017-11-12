const lib = require('lib')({token: process.env.STDLIB_TOKEN});

/**
* /scores
*
*   Gives the user leaderboard information
*
* @param {string} user The user id of the user that invoked this command (name is usable as well)
* @param {string} channel The channel id the command was executed in (name is usable as well)
* @param {string} text The text contents of the command
* @param {object} command The full Slack command object
* @param {string} botToken The bot token for the Slack bot you have activated
* @returns {object}
*/
module.exports = (user, channel, text = '', command = {}, botToken = null, callback) => {
  let resp = `Hi <@${user}>! Here are the current scores:`;
  lib.exsmiley.scores['@dev']({post: false}, function (err, result) {
    if(!result.hasOwnProperty('ttt')) {
      result['ttt'] = [0, 0]
    }
    if(!result.hasOwnProperty('c4')) {
      result['c4'] = [0, 0]
    }
    if(!result.hasOwnProperty('bs')) {
      result['bs'] = [0, 0]
    }
    if(!result.hasOwnProperty('duck')) {
      result['duck'] = [0, 0]
    }
    resp += `
Tic Tac Toe: Red(${result['ttt'][0]}) Blue(${result['ttt'][1]})
Connect 4: Red(${result['c4'][0]}) Blue(${result['c4'][1]})
Battleship: Red(${result['bs'][0]}) Blue(${result['bs'][1]})
Duck Duck Goose: Red(${result['duck'][0]}) Blue(${result['duck'][1]})`
    callback(null, {
      response_type: 'in_channel',
      text: resp
    });
  });
};