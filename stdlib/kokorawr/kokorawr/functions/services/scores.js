const lib = require('lib')({token: process.env.STDLIB_TOKEN});

const pointInc = {'bs': 31, 'c4': 23, 'ddg': [1, -5], 'mm': 37, 'rps': 3, 'ttt': 11};
const NO_INCREMENT = 3;

// ~~~~~~~~ FOR DEBUGGING PURPOSES ONLY ~~~~~~~~
// function reset() {
//   reset = {};
//   lib.utils.storage.set('scores', reset, (err, scores) => {
//     lib.utils.storage.get('scores', (err, s) => {
//       return s;
//     });
//   });
// }

/**
* Leaderboard information for teams!!!
* @param {boolean} post if you're trying to store information
* @param {integer} team which team should increase their score
* @param {string} game which game was just played
* @param {integer} pointIndex index of which point to use if >1 point is possible for a game ('ddg')
* @returns {object} {<game_name>: [red_score, blue_score]}
*/
module.exports = (post=false, team=0, game='ddg', pointIndex=3, context, callback) => {
  lib.utils.storage.get('scores', (err, scores) => {
    if (err) {
      utils.log.error("error with /scores command", new Error("Accepts error objects"), (err) => {
        return callback(null, 'An error has occurred with your command');
      });
    }

    if(scores == null || scores == 0) {
      scores = {};
    }
    if(!post) {
      return callback(null, scores);
    } else {
      if (!scores.hasOwnProperty(game)) {
        scores[game] = [0,0];
      }
      if (pointIndex != NO_INCREMENT) {
        scores[game][team] += pointInc[game][pointIndex]; 
      } else {
        scores[game][team] += pointInc[game]; 
      }
      
      lib.utils.storage.set('scores', scores, (err, result) => {
        return callback(null, {'success': true});
      });
    }
  });
};