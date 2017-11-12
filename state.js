var canvasSize = document.documentElement.clientHeight / 2 - 80;
var lineWidth = 10;



// PLACE TIC TAC TOE PEICES
var canvas = document.getElementById('tic-tac-toe-board');
var context = canvas.getContext('2d');
var sectionSize = canvasSize / 3;

var position = canvas.getBoundingClientRect();

function drawTTT (arr) {
	for (i = 0; i < arr.length; i++) {
		updateTTT(arr[i], i);
	}
}

function updateTTT (team, loc) {
	var x = position.left + 0.5;
	var y = position.top + 0.5;

	switch(loc % 3) {
		case 0:
			x += - 8;
			break;
		case 1:
			x += sectionSize - 8;
			break;
		case 2:
			x += 2 * sectionSize - 8;
			break;
	}

	switch(Math.floor(loc / 3)) {
		case 0:
			y += - 8;
			break;
		case 1:
			y += sectionSize - 8;
			break;
		case 2:
			y += 2 * sectionSize- 8;
			break;
	}

	clear(x,y, sectionSize);
	if (team == 0) {
		drawX(x, y);
	} else if (team == 1) {
		drawO(x,y);
	}
}

function drawO (x, y) {
	var halfSectionSize = (0.5 * sectionSize);
	var centerX = x + halfSectionSize;
	var centerY = y + halfSectionSize;
	var sizeOfO = 50;					// <<--- change this to change size of O
	var radius = (sectionSize - sizeOfO) / 2;
	var startAngle = 0 * Math.PI; 
	var endAngle = 2 * Math.PI;

	context.lineWidth = lineWidth;
	context.strokeStyle = "#01bBC2";		// blue
	context.beginPath();
	context.arc(centerX, centerY, radius, startAngle, endAngle);
	context.stroke();
}

function drawX (x, y) {
	context.strokeStyle = "#f1be32";		// yellow
	context.beginPath();
	  
	var sizeOfX = sectionSize - 25;		// <<--- change this to change size of X
	context.moveTo(x + sizeOfX, y + sizeOfX);
	context.lineTo(x + sectionSize - sizeOfX, y + sectionSize - sizeOfX);

	context.moveTo(x + sizeOfX, y + sectionSize - sizeOfX);
	context.lineTo(x + sectionSize - sizeOfX, y + sizeOfX);

	context.stroke();
}





// PLACE CONNECT FOUR PIECES
var canvas2 = document.getElementById('connect-four-board');
var context2 = canvas2.getContext('2d');
var sectionSize2 = (canvasHeight - 12) / 6;

var position2 = canvas2.getBoundingClientRect();
console.log("sectionSize = " + sectionSize2);

function drawC4 (arrlist) {
	for (r = 0; r < arrlist.length; r++) {
		for (c = 0; c < arrlist[0].length; c++) {
			console.log(arrlist[r][c] + " " + r +" " + c);
			updateC4(arrlist[r][c], r, c);

		}
	}
}

function updateC4 (team, row, col) {
	// var x = position2.left - 8;
	// var y = position2.top - 8;
	// x += col * sectionSize2;
	// y += row * sectionSize2;
	var x = col * sectionSize2;
	var y = row * sectionSize2 + 200;
	console.log("Xnew = " + x);
	console.log("YNew = " + y);

	clear(x, y, sectionSize);
	if (team == 'B') {						// yellow
		drawToken('#fbc500', x, y);
	} else if (team == 'R') {				// red
		drawToken('#cd1a30', x, y);
	}
}

function drawToken (color, x, y) {
	var halfSectionSize = (0.5 * sectionSize2);
	var centerX = x + halfSectionSize;
	var centerY = y + halfSectionSize;
	var sizeOfO = (sectionSize2 - 7.83)  / 2;					// <<--- change this to change size of O
	var radius = (sectionSize2 - sizeOfO) / 2;
	var startAngle = 0 * Math.PI; 
	var endAngle = 2 * Math.PI;

	context2.lineWidth = lineWidth;
	context2.strokeStyle = color;
	context2.beginPath();
	context2.arc(centerX, centerY, radius, startAngle, endAngle);
	context2.fillStyle = color;
    context2.fill();
	context2.stroke();

	console.log("drawn");
}


var c4 = [["R","~","~","~","~","~","~"],["~","~","~","~","~","~","~"],["~","~","~","~","~","~","~"],["~","~","~","~","~","~","~"],["~","~","~","~","B","~","~"],["~","~","B","R","R","~","B"]];

drawC4(c4);


// UNIVERSAL FUNCTIONS
function clear (x, y, secSize) {
  context.fillStyle = "#fff";
  x += lineWidth / 2;
  y += lineWidth /2
  context.clearRect(x, y, secSize - lineWidth, secSize - lineWidth); 
}


function updateBoards () {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			todo = JSON.parse(this.responseText);
			for (var k in todo) {
				switch (k) {
					case 'ttt':
						drawTTT(todo['ttt']);
						break;
					// case 'c4':
					// 	drawC4(todo['c4']);
				}
			}
		}
	};
	xhttp.open("GET", "https://exsmiley.lib.id/tracker@dev", true);
	xhttp.send();
	// setTimeout(updateBoards, 1000);
}

updateBoards();