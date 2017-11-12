var canvasSize = document.documentElement.clientHeight / 2 - 80;
var lineWidth = 10;



// PLACE TIC TAC TOE PEICES
function drawTTT (arr) {
	var canvas = document.getElementById('tic-tac-toe-board');
	var context = canvas.getContext('2d');
	var secSize = canvasSize / 3;

	for (i = 0; i < arr.length; i++) {
		updateTTT(canvas, context, arr[i], i, secSize);
	}
}

function updateTTT (canvas, context, team, loc, secSize) {
	var x = (loc % 3) * secSize;
	var y = Math.floor(loc / 3) * secSize;

	clear(context, x, y, secSize);
	if (team == 0) {
		drawX(context, x, y, secSize);
	} else if (team == 1) {
		drawO(context, x, y, secSize);
	}
}

function drawO (context, x, y, secSize) {
	var halfSectionSize = (0.5 * secSize);
	var centerX = x + halfSectionSize;
	var centerY = y + halfSectionSize;
	var sizeOfO = 50;					// <<--- change this to change size of O
	var radius = (secSize - sizeOfO) / 2;
	var startAngle = 0 * Math.PI; 
	var endAngle = 2 * Math.PI;

	context.lineWidth = lineWidth;
	context.strokeStyle = "#01bBC2";		// blue
	context.beginPath();
	context.arc(centerX, centerY, radius, startAngle, endAngle);
	context.stroke();
}

function drawX (context, x, y, secSize) {
	context.strokeStyle = "#f1be32";		// yellow
	context.beginPath();
	  
	var sizeOfX = secSize - 25;		// <<--- change this to change size of X
	context.moveTo(x + sizeOfX, y + sizeOfX);
	context.lineTo(x + secSize - sizeOfX, y + secSize - sizeOfX);

	context.moveTo(x + sizeOfX, y + secSize - sizeOfX);
	context.lineTo(x + secSize - sizeOfX, y + sizeOfX);

	context.stroke();
}





// PLACE CONNECT FOUR PIECES
function drawC4 (arrlist) {
	var canvas = document.getElementById('connect-four-board');
	var context = canvas.getContext('2d');
	var secSize = (canvasHeight - 12) / 6;

	for (r = 0; r < arrlist.length; r++) {
		for (c = 0; c < arrlist[0].length; c++) {
			console.log(arrlist[r][c] + " " + r +" " + c);
			updateC4(context, arrlist[r][c], r, c, secSize);
		}
	}
}

function updateC4 (context, team, row, col, secSize) {
	var x = col * secSize;
	var y = row * secSize;

	clear(context, x, y, secSize);
	if (team == 'B') {						// yellow
		drawToken(context, '#fbc500', x, y,secSize);
	} else if (team == 'R') {				// red
		drawToken(context, '#cd1a30', x, y, secSize);
	}
}

function drawToken (context, color, x, y, secSize) {
	var halfSectionSize = (0.5 * secSize);
	var centerX = x + halfSectionSize;
	var centerY = y + halfSectionSize;
	var sizeOfO = (secSize - 10)  / 2;					// <<--- change this to change size of O
	var radius = (secSize - sizeOfO) / 2;
	var startAngle = 0 * Math.PI; 
	var endAngle = 2 * Math.PI;

	context.lineWidth = lineWidth;
	context.strokeStyle = color;
	context.beginPath();
	context.arc(centerX, centerY, radius, startAngle, endAngle);
	context.fillStyle = color;
    context.fill();
	context.stroke();

	console.log("drawn");
}



// UNIVERSAL FUNCTIONS
function clear (context, x, y, secSize) {
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
					case 'c4':
						drawC4(todo['c4']);
						break;
				}
			}
		}
	};
	xhttp.open("GET", "https://exsmiley.lib.id/tracker@dev", true);
	xhttp.send();
	// setTimeout(updateBoards, 1000);
}

updateBoards();