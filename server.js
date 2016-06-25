//
// # ese_artist game
//
//server using Socket.IO, Express
//
var http = require('http');
var path = require('path');
var fs = require('fs');
var socketio = require('socket.io');
var express = require('express');

var router = express();
var server = http.createServer(router);
var io = socketio.listen(server);

router.use(express.static(path.resolve(__dirname, 'client')));

var users = [];

io.on('connection', function (socket) {
  //Identify
  console.log("ID: "+socket.id.substring(2)+" has connected");

  //Add new user to Client map
  socket.on('inRoomCtoS',function(data){
    console.log(data);
    console.log(data.name + " entered room");
    users.push(data);
    io.sockets.emit('inRoomStoC', users);
  });
  
  socket.on('startGame',function(data){
    var eseID = Math.floor(Math.random() * users.length);
    data[eseID].ese = true;
    io.socket.emit('startGame', users);
  });
  
  
  //Disconncting action
  socket.on('disconnect',function(){
    console.log(users);
    var id = searchIndex(socket.id.substring(2));
    if(typeof users[id] !== "undefined"){
      console.log(users[id].name + " leave room");
    }
    console.log("ID: " + socket.id.substring(2) + " has disconnected");
    users.splice(id, 1);
    console.log(users);
    io.sockets.emit('disconnect', users);
  });

  function searchIndex(socketID){
    for(var i=0; i < users.length; i++){
      if(users[i].id == socketID) return i; 
    }
  }
  
});


server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("App server listening at", addr.address + ":" + addr.port);
});