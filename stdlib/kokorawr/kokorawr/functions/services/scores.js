const lib = require('lib')({token: process.env.STDLIB_TOKEN});

const winInc = {'bs': 31, 'c4': 23, 'ddg': [1, -5], 'mm': 37, 'rps': 3, 'ttt': 11}

/**
* Leaderboard information for teams!!!
* @param {boolean} post if you're trying to store information
* @param {integer} team which team should increase their score
* @param {string} game which game was just played
* param {integer} index which score to use
* @returns {object} {<game_name>: [red_score, blue_score]}
*/
module.exports = (post=false, team, game, index=3, context, callback) => {
  lib.utils.storage.get('scores', 0, (err, scores) => {
    if (err) {
      utils.log.error("error with /scores command", new Error("Accepts error objects"), (err) => {
        return callback(null, 'An error has occurred with your command');
      });
    }

    if(scores == 0) {
      scores = {};
    }
    if(!post) {
      return callback(null, scores);
    } else {
      if (!scores.hasOwnProperty(game)) {
        scores[game] = [0,0];
      }
      if (index != 3) {
        scores[game][team] += winInc[game][index]; 
      } else {
        scores[game][team] += winInc[game]; 
      }
      
      lib.utils.storage.set('scores', scores, (err, result) => {
        return callback(null, {'success': true});
      });
    }
  });
};