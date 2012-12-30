
var _tilt = 0, _height = null, _width = null;

var ball = {x: 100, y: 100, xv: 10, yv: 0, r: 30, g: 1};

function resize(){
	var ctx = $('#c')[0].getContext('2d');
	_width = ctx.canvas.width  = $('html').width();
	_height = ctx.canvas.height = $('html').height();
}

function step(){
	physics();
	render();
}

function render(){
	var ctx = $('#c')[0].getContext('2d');
	
	var topLeft = Math.round(_height * .5 - _tilt * 8), topRight = Math.round(_height * .5 + _tilt * 8);
	
	ctx.clearRect(0, 0, _width, _height);
	
	// ground
	ctx.beginPath();
	ctx.moveTo(0, topLeft);
	ctx.lineTo(_width, topRight);
	ctx.lineTo(_width, _height);
	ctx.lineTo(0, _height);
	ctx.lineTo(0, topLeft);
	ctx.closePath();
	ctx.fillStyle = "#00ff00";
	ctx.fill();
	
	// ball
	ctx.beginPath();
	ctx.arc(ball.x, ball.y, ball.r, 0 , 2 * Math.PI, false);
	ctx.closePath();
	ctx.fillStyle = "#ff2222";
	ctx.fill();
}

function physics(){
	ball.x += ball.xv;
	if (ball.x + ball.r > _width){
		ball.x = _width - ball.r;
		ball.xv *= -1;
	}
	if (ball.x - ball.r < 0){
		ball.x = ball.r;
		ball.xv *= -1;
	}
	
	ball.yv += ball.g;
	ball.y += ball.yv;
	
	// for ground collision, first we get the ground rotation angle
	var ga = Math.atan2(_tilt * 16, _width);
	// now rotate the ball position as if the ground should be the x-axis
	var oldX = ball.x;
	var oldY = ball.y - Math.round(_height * .5 - _tilt * 8); // minus topLeft
	var newX = Math.cos(ga) * oldX + Math.sin(ga) * oldY;
	var newY = -Math.sin(ga) * oldX + Math.cos(ga) * oldY;
	if (newY > -ball.r){
		// now unembed the rotated ball coords, reverse rotate them, and apply them
		ga *= -1;
		oldX = newX;
		oldY = -1 - ball.r;
		newX = Math.cos(ga) * oldX + Math.sin(ga) * oldY;
		newY = -Math.sin(ga) * oldX + Math.cos(ga) * oldY;
		ball.x = newX;
		ball.y = newY + Math.round(_height * .5 - _tilt * 8); // plus topLeft
		ga *= -1;
		
		// adjust ball velocity angle
		var oldXV = ball.xv;
		var oldYV = ball.yv;
		var newXV = Math.cos(ga) * oldXV + Math.sin(ga) * oldYV;
		var newYV = -(-Math.sin(ga) * oldXV + Math.cos(ga) * oldYV);
		oldXV = newXV;
		oldYV = newYV;
		ga *= -1;
		ball.xv = newXV = Math.cos(ga) * oldXV + Math.sin(ga) * oldYV;
		ball.yv = newYV = -Math.sin(ga) * oldXV + Math.cos(ga) * oldYV;
		
		// adjust ball speed
		var oldVS = Math.sqrt(ball.xv * ball.xv + ball.yv * ball.yv);
		var oldVA = Math.atan2(ball.yv, ball.xv);
		var newVS = oldVS * .8 + 6;
		ball.xv = Math.cos(oldVA) * newVS;
		ball.yv = Math.sin(oldVA) * newVS;
	}
}

$(document).ready(function (){
	window.ondeviceorientation = function(event) {
		_tilt = Math.max(-30, Math.min(30, Math.round(event.beta * 1 / 1)));
	}
	
	window.addEventListener('resize', resize, false);
	resize();
	
	setInterval(step, 60);
});
