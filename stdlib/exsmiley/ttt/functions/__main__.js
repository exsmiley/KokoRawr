let marked = [null, null, null, null, null, null, null, null, null];
let win = false;
/**
* A basic Hello World function
* @param {integer} team What token is placed for that team
* @param {integer} loc Where the token is placed
* @returns {String}
*/
module.exports = (team, loc, context, callback) => {
	if (marked[loc]){
		callback(null, `invalid`);
	}
	marked[loc] = team;

	marked[0] == marked[1] && marked[1] == marked[2] ? win = true: "N/A";
	marked[3] == marked[4] && marked[4] == marked[5] ? win = true: "N/A";
	marked[6] == marked[7] && marked[7] == marked[8] ? win = true: "N/A";

	marked[0] == marked[3] && marked[3] == marked[6] ? win = true: "N/A";
	marked[1] == marked[4] && marked[4] == marked[7] ? win = true: "N/A";
	marked[2] == marked[5] && marked[5] == marked[8] ? win = true: "N/A";

	marked[0] == marked[4] && marked[4] == marked[8] ? win = true: "N/A";
	marked[2] == marked[4] && marked[4] == marked[6] ? win = true: "N/A";

	callback(null, 'valid');
};
