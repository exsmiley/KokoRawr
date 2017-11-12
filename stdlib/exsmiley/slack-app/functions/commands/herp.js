const lib = require('lib')({token: process.env.STDLIB_TOKEN});

/**
* /herp
*
*   Gives the user helpful information
*
* @param {string} user The user id of the user that invoked this command (name is usable as well)
* @param {string} channel The channel id the command was executed in (name is usable as well)
* @param {string} text The text contents of the command
* @param {object} command The full Slack command object
* @param {string} botToken The bot token for the Slack bot you have activated
* @returns {object}
*/
module.exports = (user, channel, text = '', command = {}, botToken = null, callback) => {
  let resp = `Hi <@${user}>!
Welcome to KokoRawr, the chaotic cooperative experience! We have several games that you can play together. You are automatically assigned a team through your Slack username.
  
Commands:
  - /herp brings up this help text
  - /team tells you which team you're on
  - /ttt lets you play Tic Tac Toe
    valid input: location to place 1-9 (/ttt 3), reset (/ttt reset), turn (/ttt turn)
  - /c4 lets you play Connect 4
    valid input: location to place 1-7 (/ttt 6), reset (/ttt reset), turn (/ttt turn)
  - /bs lets you play Battleship
    valid input: coordinate to fire A0-J9 (/ttt C5), reset (/ttt reset), turn (/ttt turn)

Thanks for playing KokoRawr!`;

  callback(null, {
    response_type: 'in_channel',
    text: resp
  });
};