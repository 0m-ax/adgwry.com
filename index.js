if(document.location.hostname != "adgwry.com"){
	alert("stop stealing");
}
var canvas = document.getElementById('canvas')
var context = canvas.getContext('2d');

window.addEventListener('resize', resizeCanvas, false);

function resizeCanvas() {
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;
}
resizeCanvas();
var mousePos = {
  x:Math.floor(canvas.width/2),
  y:Math.floor(canvas.height/2)
};
document.addEventListener('mousemove', function(event) {
    var rect = canvas.getBoundingClientRect();
    mousePos =  {
      x: Math.round(event.clientX - rect.left),
      y: Math.round(event.clientY - rect.top)
    };
}, false);
document.addEventListener('touchmove', function(event) {
  console.log(event)
  var rect = canvas.getBoundingClientRect();
  mousePos =  {
    x: Math.round(event.touches[0].clientX - rect.left),
    y: Math.round(event.touches[0].clientY - rect.top)
  };
  event.preventDefault();
}, false);

function randomIntFromInterval(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}

var Dot = function (){
  this.lastupdate = Date.now()
  this.x =randomIntFromInterval(0,canvas.width);
  this.y =  randomIntFromInterval(0,canvas.height)
  this.color = '#'+Math.floor(Math.random()*16777215).toString(16);
}
Dot.prototype.logic = function () {
  var start =  Date.now()
  var diff = start-this.lastupdate
  this.lastupdate = Date.now()
  var radius = 20
  if(this.x > mousePos.x-radius && this.x < mousePos.x+radius &&this.y > mousePos.y-radius && this.y < mousePos.y+radius){
    return true;
  }
  var angleRadians = Math.atan2(this.y - mousePos.y, this.x - mousePos.x);
  this.y = this.y-(Math.sin(angleRadians)*Math.pow(Math.sqrt(Math.pow(this.x - mousePos.x,2)+Math.pow(this.y - mousePos.y,2)),1))*(diff/1000)
  this.x = this.x-(Math.cos(angleRadians)*Math.pow(Math.sqrt(Math.pow(this.x - mousePos.x,2)+Math.pow(this.y - mousePos.y,2)),1))*(diff/1000)
  return false;
};
Dot.prototype.draw = function (context) {
  context.beginPath();
  context.rect((this.x-5), (this.y-5),10, 10);
  context.fillStyle = this.color;
  context.fill();
};
var dots = [];
dots.push(new Dot())
var last = Date.now()
function drawLoop() {
    var start = Date.now()
    var diff = Math.round(start - last);
    //LOGIC STUFF
    var toRemove = [];
    for (var i = 0; i < dots.length; i++) {
      if(dots[i].logic()){
        toRemove.push(i)
      }
    }
    for (var i = toRemove.length -1; i >= 0; i--){
      dots.splice(toRemove[i],1);
    }
    //DRAW STUFF
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < dots.length; i++) {
      dots[i].draw(context)
    }
    var end = Date.now()

    //console.log(dots.length,(end-start))
    if((end-start) > (1000/60)){
      //document.getElementById('canvas').style["background-color"] = "#ff0000"
    }else{
      //document.getElementById('canvas').style["background-color"] = "#000000"
    }
      for (var i = 0; i < ((1000/30)-(end-start)*10); i++) {
        dots.push(new Dot())
      }
    //}
    last = Date.now()
    window.requestAnimationFrame(drawLoop)
}


window.requestAnimationFrame(drawLoop)
