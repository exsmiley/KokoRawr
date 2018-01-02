
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
Welcome to KokoRawr, the chaotic cooperative gaming experience! We have several games that you can play together. You are automatically assigned a team through your Slack username.
  
Commands:
  - /herp brings up this help text
  - /team tells you which team you're on
  - /scores the team scores across all games

  All of the following games also accept help as valid input (ie. /ttt help):
  - /ttt lets you play Tic Tac Toe
    valid input: location to place 1-9 (/ttt 3), reset (/ttt reset), turn (/ttt turn), board state (/ttt state)
  - /c4 lets you play Connect 4
    valid input: location to place 1-7 (/c4 6), reset (/c4 reset), turn (/c4 turn), board state (/c4 state)
  - /bs lets you play Battleship
    valid input: coordinate to fire A0-J9 (/bs C5), reset (/bs reset), turn (/bs turn), board state (/bs state)
  - /duck lets you know if you're a duck or a goose
  - /rps plays rock paper scissors with the other team
    valid input: rock, paper, or scissors: the choice is yours! (/rps rock)
  - /mind plays Mastermind
    valid input: a 4-digit number (/mind 0264)

Games can be viewed at https://kokorawr.herokuapp.com/
Thanks for playing KokoRawr!`;

  callback(null, {
    response_type: 'in_channel',
    text: resp
  });
};