scores = {}

/**
* Leaderboard information for teams!!!
* @param {boolean} post if you're trying to store information
* @param {object} store information to store. Format should be {name: str, info: gameInfo}
* @returns {object} {<game_name>: [red_score, blue_score]}
*/
module.exports = (post=false, store={}, context, callback) => {
  if(!post) {
    callback(null, scores);
  } else {
    if('name' in store && 'team' in store) {
      if(!scores.hasOwnProperty(store['name'])) {
        scores[store['name']] = [0, 0];
      }
      scores[store['name']][store['team']]++;
      callback(null, {'success': true});
    } else {
      callback(null, {'success': false});
    }
  }
};