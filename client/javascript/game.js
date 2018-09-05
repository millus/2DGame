var ctx = document.getElementById('ctx').getContext("2d");
ctx.font = '30px Arial'

var numberOfFrames = 4;
var numberOfRows = 4;
var imageSizeX = 112;
var imageSizeY = 140; 

var socket = io();

function redrawCanvas(){
    ctx.clearRect(0,0,ctx.canvas.width, ctx.canvas.height);
    if(ctx.canvas.width  !== Math.round(window.innerWidth*0.8)){
        ctx.canvas.width  = window.innerWidth*0.8;
    }
    if(ctx.canvas.height !== Math.round(window.innerHeight*0.9)){
        ctx.canvas.height = window.innerHeight*0.9;
    }
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

socket.on('newPosition',function(data){
    redrawCanvas();
    for(var i = 0; i < data.length; i++){
    var pic = new Image();
    pic.src = data[i].pic;
    ctx.fillStyle = "black";
    ctx.fillText(data[i].number,data[i].x+7,data[i].y+7);
    ctx.drawImage(
        pic,
        data[i].frameIndex * pic.width / numberOfFrames, 
        data[i].direction, 
        pic.width / numberOfFrames, 
        pic.height / numberOfRows,
        data[i].x, 
        data[i].y, 
        imageSizeX, 
        imageSizeY
        );
    }
});

document.onkeydown = function (event) {
  if(event.keyCode === 68){//d
    socket.emit('keyPress',{inputId:'right', state:true});
  }else if(event.keyCode === 83){ //s
    socket.emit('keyPress',{inputId:'down', state:true});
  }else if(event.keyCode === 65){ //a
    socket.emit('keyPress',{inputId:'left', state:true});
  }else if(event.keyCode === 87){ //w
    socket.emit('keyPress',{inputId:'up', state:true});
  }
  if(event.keyCode === 16){ //shift
    socket.emit('keyPress',{inputId:'run', state:true});
  }
}

document.onkeyup = function (event) {
  if(event.keyCode === 68){ //d
    socket.emit('keyPress',{inputId:'right', state:false});
  }else if(event.keyCode === 83){ //s
    socket.emit('keyPress',{inputId:'down', state:false});
  }else if(event.keyCode === 65){ //a
    socket.emit('keyPress',{inputId:'left', state:false});
  }else if(event.keyCode === 87){ //w
    socket.emit('keyPress',{inputId:'up', state:false});
  }
  if(event.keyCode === 16){ //shift
    socket.emit('keyPress',{inputId:'run', state:false});
  }
}

function pickPlayer (color){
  var pic = "";
  if(color === "pink"){
    pic = "client/img/spriteshurt.png";
  }else if(color === "pink clean"){
    pic = "client/img/sprites.png";
  }else if(color === "blue"){
    pic = "client/img/spritesblue.png";
  }else {
    console.log("Unknown color");
  }
  socket.emit('newColor',{pic:pic});
}