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

var users = {};

io.on('connection', function (socket) {
  //Identify
  console.log("ID: "+socket.id.substring(2)+" has connected");

  //Add new user to Client map
  socket.on('inRoomCtoS',function(data){
    console.log(data);
    console.log(data.user.name + " entered room");
    users[data.id] = data.user;
    io.sockets.emit('inRoomStoC', users);
  });
  
  //Update user to Client
  socket.on('updateUserCtoS',function(data){
//    users[data.id] = data.center;
//    io.sockets.emit('updateUserStoC',data);
  });
  
  
  //Disconncting action
  socket.on('disconnect',function(){
    var id = socket.id.substring(2);
    console.log(users);
    //Send socket "ID" which was disconnected for Clients
    io.sockets.emit('removeuserStoC', id);
    // console.log(users[id].name + " leave room");
    console.log("ID: " + id + " has disconnected");
    delete users[id];
  });
  
});


server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("App server listening at", addr.address + ":" + addr.port);
});