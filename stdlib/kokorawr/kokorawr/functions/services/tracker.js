
gameInfo = {};

/**
* Tracks game state!
* @param {boolean} post if you're trying to store information
* @param {object} store information to store. Format should be {name: str, info: gameInfo}
* @returns {object}
*/
module.exports = (post=false, store={}, context, callback) => {
  if(!post) {
    return callback(null, gameInfo);
  } else {
    if('name' in store && 'info' in store) {
      gameInfo[store['name']] = store['info'];
      return callback(null, {'success': true});
    } else {
      return callback(null, {'success': false});
    }
  }
};
