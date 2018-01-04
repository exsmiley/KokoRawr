const lib = require('lib')({token: process.env.STDLIB_TOKEN});

/**
* Leaderboard information for teams!!!
* @param {boolean} post if you're trying to store information
* @param {object} store information to store. Format should be {name: str, info: gameInfo}
* @returns {object} {<game_name>: [red_score, blue_score]}
*/
module.exports = (post=false, store={}, context, callback) => {
  lib.utils.storage.get('scores', (err, scores) => {
    if (err) {
      utils.log.error("error with /scores command", new Error("Accepts error objects"), (err) => {
        return callback(null, 'An error has occurred with your command'.);
      });
    }
    if(scores == null) {
      scores = {};
    }
    if(!post) {
      return callback(null, scores);
    } else {
      if('name' in store && 'team' in store) {
        if(!scores.hasOwnProperty(store['name'])) {
          scores[store['name']] = [0, 0];
        }
        if('diff' in store) {
          scores[store['name']][store['team']] += store['diff'];
        } else {
          scores[store['name']][store['team']]++;
        }
        lib.utils.storage.set('scores', scores, (err, scores) => {
          return callback(null, {'success': true});
        });
      } else {
        return callback(null, {'success': false, 'info': store});
      }
    }
  })
};