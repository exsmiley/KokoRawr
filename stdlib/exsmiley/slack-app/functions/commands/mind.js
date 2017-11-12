const lib = require('lib')({token: process.env.STDLIB_TOKEN});

/**
* /mind
*
*   Plays Mastermind!
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
      let resp = `(Mastermind) <@${user}>:${color} thanks for asking for help!
Mastermind is a game in which one user picks a 4-digit number (with each digit in the range 0-9). Then every other user is trying to guess what that number is.

A user guesses their own 4-digit number and will get a response to help them crack the code. The response consists of white pegs which tell you how many numbers exist in the solution from the guess and red pegs which are the number of numbers in the guess that match the solution exactly.

The guesser wins when they guess the solution correctly!`
      callback(null, {
          response_type: 'in_channel',
          text: resp
        });
    } else {
      lib.exsmiley.mastermind['@dev']({user: user, team: team, guess: text}, function(err, result) {
        callback(null, {
          response_type: 'in_channel',
          text: `(Mastermind) <@${user}>:${color} ` + result
        });
      });
    }    
  });
};