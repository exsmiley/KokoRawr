var lineWidth = 10;
var canvasHeight = document.documentElement.clientHeight / 2 - 80;



// TIC TAC TOE BOARD
var lineColor = "#ddd";
var canvas = document.getElementById('tic-tac-toe-board');
var context = canvas.getContext('2d');

var sectionSize = canvasHeight / 3;
canvas.width = canvasHeight;
canvas.height = canvasHeight;
context.translate(0.5, 0.5);

function drawTTTLines (lineWidth, strokeStyle) {
  var lineStart = 4;
  var lineLength = canvasHeight - 5;
  context.lineWidth = lineWidth;
  context.lineCap = 'round';
  context.strokeStyle = strokeStyle;
  context.beginPath();

  // Horizontal lines 
  for (var y = 1;y <= 2;y++) {  
    context.moveTo(lineStart, y * sectionSize);
    context.lineTo(lineLength, y * sectionSize);
  }

  // Vertical lines 
  for (var x = 1;x <= 2;x++) {
    context.moveTo(x * sectionSize, lineStart);
    context.lineTo(x * sectionSize, lineLength);
  }

  context.stroke();
}

drawTTTLines(lineWidth, lineColor);



//CONNECT FOUR BOARD
var lineColor = "#1b62f0";
var canvas = document.getElementById('connect-four-board');
var context = canvas.getContext('2d');

var sectionSize = (canvasHeight - 12) / 6;
canvas.width = sectionSize * 7 + (lineWidth*1.2);
canvas.height = canvasHeight;
context.translate(6, 6);


function drawC4Lines (linewidth, strokeStyle) {
  var lineLengthX = canvas.width - (lineWidth*1.2);
  var lineLengthY = canvas.height - (lineWidth*1.2);
  context.lineWidth = lineWidth;
  context.lineCap = 'round';
  context.strokeStyle = strokeStyle;
  context.beginPath();

  // Horizontal lines 
  for (var y = 0; y <= 6; y++) {  
    context.moveTo(0, y * sectionSize);
    context.lineTo(lineLengthX, y * sectionSize);
  }

  // Vertical lines 
  for (var x = 0; x <= 7; x++) {
    context.moveTo(x * sectionSize, 0);
    context.lineTo(x * sectionSize, lineLengthY);
  }
  context.stroke();
}

drawC4Lines(lineWidth, lineColor);

drawTTTLines(lineWidth, lineColor);
