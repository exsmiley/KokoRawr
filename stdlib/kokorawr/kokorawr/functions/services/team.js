/**
* Creates a hashcode from a string. Thank you based lordvlad <3
* (https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript-jquery)
* @returns {integer} hashcode
*/
function hashCode(s) {
    return s.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);              
}

/**
* Maps usernames to a binary team number (0/1)
* @param {string} name user who we are finding the name of
* @returns {integer} number of team
*/
module.exports = function team(name = 'Bob', context, callback) {
    return callback(null, Math.abs(hashCode(name)) % 2);
};
