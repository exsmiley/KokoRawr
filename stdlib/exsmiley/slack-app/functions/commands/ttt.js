const lib = require('lib')({token: process.env.STDLIB_TOKEN});
/**
* 
*   Plays Tic Tac Toe
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
		lib.exsmiley.ttt['@dev']({team: result}, function (err, result) {

			if (result == 'valid'){
				callback(null,  {
			    	response_type: 'in_channel',
			    	text: `<@${user}> called an invalid location`
			   	});
			}

			callback(null, {
		    	response_type: 'in_channel',
		    	text: `<@${user}> placed ` + team + ` in location ` + loc
		   	});
		});
    
  });

};
