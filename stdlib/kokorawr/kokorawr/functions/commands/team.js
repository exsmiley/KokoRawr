const lib = require('lib')({token: process.env.STDLIB_TOKEN});

function hashCode(s) {
    return s.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);              
}

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

  let result = Math.abs(hashCode(name)) % 2;

  let color = 'Red';
  if(result != 0) {
    color = 'Blue';
  }

  // do something with result
  callback(null, {
    response_type: 'in_channel',
    text: `<@${user}> is on the ${color} team!`
  });
};
