
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
	if (ball.y + ball.r > _height * .5){
		ball.y = _height * .5 - ball.r;
		ball.yv *= -1;
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
