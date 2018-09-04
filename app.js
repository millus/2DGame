var express = require('express');
var app = express();
var serv = require('http').Server(app);

app.get('/',function(req,res){
  res.sendFile(__dirname + '/client/index.html');
});

app.use('/client',express.static(__dirname + '/client'));

serv.listen(2000);
console.log("Server started.");

var SOCKET_LIST = {};
var PLAYER_LIST = {};
var frameIndex = 0;
var tickCount = 0;
var ticksPerFrame = 2;
var numberOfFrames = 4;
var upVal = 210;
var downVal = 0;
var leftVal = 70;
var rightVal = 140;

var Player = function(id){
  var self = {
    x:0,
    y:0,
    id:id,
    pic:"client/img/sprites.png",
    direction:0,
    frameIndex:0,
    number: "" + Math.floor(10 * Math.random()),
    pressingRight:false,
    pressingLeft:false,
    pressingUp:false,
    pressingDown:false,
    maxSpd:10,
  }
  self.updatePosition = function() {
    if(self.pressingRight)
      self.x +=self.maxSpd;
    if(self.pressingLeft)
      self.x -=self.maxSpd;
    if(self.pressingUp)
      self.y -=self.maxSpd;
    if(self.pressingDown)
      self.y +=self.maxSpd;
  }
  return self;
}

var io = require('socket.io') (serv,{});
io.sockets.on('connection', function(socket){
socket.id = Math.random();
socket.x = 0;
socket.y = 0;
socket.number = "" + Math.floor(10 * Math.random());
SOCKET_LIST[socket.id] = socket;
var player = Player(socket.id);
PLAYER_LIST[socket.id] = player;

socket.on('disconnect', function(){
  delete SOCKET_LIST[socket.id];
  delete PLAYER_LIST[socket.id];
});

socket.on('newColor', function(data){
  player.pic = data.pic;
});

  socket.on('keyPress', function(data){
    if(data.inputId === 'left'){
      player.pressingLeft = data.state;
      if(data.state){
        player.direction = leftVal;
      }
    }else if (data.inputId === 'right'){
      player.pressingRight = data.state;
      if(data.state){
        player.direction = rightVal;
      }
    }else if (data.inputId === 'up'){
      player.pressingUp = data.state;
      if(data.state){
        player.direction = upVal;
      }
    }else if (data.inputId === 'down'){
      player.pressingDown = data.state;
      if(data.state){
        player.direction = downVal;
      }
    }
  });

});

setInterval(function(){
    var pack = [];
    tickCount += 1;

    for(var i in PLAYER_LIST){
     
      var player = PLAYER_LIST[i];
      player.updatePosition();
      if(player.pressingUp || player.pressingDown || player.pressingLeft || player.pressingRight){
        
        if(player.pressingUp){
          player.direction = upVal;
        }else if(player.pressingDown){
          player.direction = downVal;
        }else if(player.pressingLeft){
          player.direction = leftVal;
        }else if(player.pressingRight){
          player.direction = rightVal;
        }

        if (tickCount > ticksPerFrame) {
          tickCount = 0;
          if(player.frameIndex < numberOfFrames - 1){
            player.frameIndex += 1; 
          }else{
            player.frameIndex = 0; 
          }
        }
      }
      pack.push({
        x:player.x,
        y:player.y,
        pic:player.pic,
        frameIndex:player.frameIndex,
        direction:player.direction,
        number:player.number
      });
    }
    /*
    
    */
    for(var i in SOCKET_LIST){
      var socket = SOCKET_LIST[i];
      socket.emit('newPosition',pack);
    }

},1000/25);
