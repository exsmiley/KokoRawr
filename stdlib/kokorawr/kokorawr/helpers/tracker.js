
gameInfo = {};

/**
* Tracks game state!
* @param {boolean} post if you're trying to store information
* @param {object} store information to store. Format should be {name: str, info: gameInfo}
* @returns {object}
*/
module.exports = function tracker(post=false, store={}, context, callback) => {
  if(!post) {
    callback(null, gameInfo);
  } else {
    if('name' in store && 'info' in store) {
      gameInfo[store['name']] = store['info'];
      callback(null, {'success': true});
    } else {
      callback(null, {'success': false});
    }
  }
};
