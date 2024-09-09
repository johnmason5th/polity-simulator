var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
//Canvas Functions
function line(x1,y1,x2,y2) {
  ctx.beginPath();
  ctx.moveTo(x1,y1);
  ctx.lineTo(x2,y2);
  ctx.stroke();
}
// function circle(x,y,r) {
//   ctx.beginPath();
//   ctx.arc(x,y,r,0,2*Math.PI);
//   ctx.fill();
//   ctx.stroke();
// }
function rect(x,y,w,h) {
  ctx.fillRect(x,y,w,h);
}
function fontSize(size) {
  ctx.font = size+"px Arial";
}
function text(text,x,y) {
  fill("black");
  ctx.fillText(text,x,y);
}
function fill(color) {
  ctx.fillStyle = color;
}
function stroke(color) {
  ctx.strokeStyle = color;
}
function strokeWeight(weight) {
  ctx.lineWidth = weight;
}
function clear() {
  const transform = ctx.getTransform();
  const { x, y } = transform.transformPoint(new DOMPoint(0, 0));

  ctx.clearRect(-x, -y, canvas.width, canvas.height);
}
function save() {
  ctx.save();
}
function translate(x,y) {
  ctx.translate(x,y);
}
function zoom(scale) {
  ctx.scale(scale,scale);
}
function restore() {
  ctx.restore();
}

//User Input Functions
// var keyCode = "";
// var keyDown = false;
// canvas.addEventListener("keydown", function(e) {
//   keyCode = e.key;
//   keyDown = true;
//   keyDownMap[e.key] = true;
// });
// canvas.addEventListener("keyup", function(e) {
//   keyDown = false;
//   keyDownMap[e.key] = false;
// });
// var keyDownMap = {
//   "ArrowUp":false,
//   "ArrowDown":false,
//   "ArrowLeft":false,
//   "ArrowRight":false,
//   "1":false,
//   "2":false,
//   "3":false,
//   "4":false,
//   "5":false,
//   "6":false,
//   "7":false,
//   "8":false,
//   "9":false,
//   "0":false,
//   " ":false
// };

// function keyIsDown(key) {
//   return keyDownMap[key];
// }
// function keyPressed() {
  
// }

//Mouse
let mouseX = 0;
let mouseY = 0;
let pMouseX = 0;
let pMouseY = 0;

let mouseIsDown = false;
let mousePressed = false;

function  getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect(),
    scaleX = canvas.width / rect.width,
    scaleY = canvas.height / rect.height;

  return {
    x: (evt.clientX - rect.left) * scaleX,
    y: (evt.clientY - rect.top) * scaleY
  };
}

canvas.addEventListener("mousemove", function(e) {
	if (typeof mouseMove === "function") {
		mouseMove(e);
	}
	
  var pos = getMousePos(canvas, e);
  var matrix = ctx.getTransform();
  var imatrix = matrix.invertSelf();
  // apply to point:
	pMouseX = mouseX;
	pMouseY = mouseY;
  mouseX = pos.x * imatrix.a + pos.y * imatrix.c + imatrix.e;
  mouseY = pos.x * imatrix.b + pos.y * imatrix.d + imatrix.f;
});

canvas.addEventListener("mousedown", function(e) {
  mouseIsDown = true;
	mousePressed = true;
});

canvas.addEventListener("mouseup", function(e) {
  mouseIsDown = false;
});

canvas.addEventListener("wheel", function(e) {
  if (typeof mouseWheel === "function") {
		mouseWheel(e);
	}
});

//My functions
function randInt(start,end) {
  return start+Math.floor(Math.random() * (end-start));
}

function printToElement(element, text) {
	document.getElementById(element).innerHTML = text;
}

//Debug display
function printToDebug(text) {
	if (document.getElementById("debug-display") === null) return;
  printToElement("debug-display", text+"<br>"+document.getElementById("debug-display").innerHTML);
}