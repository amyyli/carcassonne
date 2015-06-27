var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var utils = require('./server/utils');

app.set('port', (process.env.PORT || 3000));
app.use(express.static(__dirname + '/client'));

// object holds player username, socket id, and password
var players = {};

io.on('connection', function(socket) {

  // emit this so color choices will be limited to what's available
  // upon connection
  utils.emitNumReady(io, players);

  // Accept a login event with user's data
  socket.on('login', function(userdata) {
    utils.handleLogin(socket, players, userdata);
    utils.emitNumReady(io, players);
  });

  // currently unused on the client side
  socket.on('logout', function(userdata) {
    utils.handleLogout(socket, players, userdata);
  });

  // data arg will be the tile they placed
  socket.on('endTurn', function(data) { 
   utils.handleEndTurn(io, socket, players, data);
  });

  // indicates that socket is ready to play
  // data arg is an obj with 
  socket.on('playerReady', function(data){
    utils.onPlayersReady(io, players, data);
    utils.emitNumReady(io, players);
  });

  // resets the game if someone disconnects. this is necessary until
  // reconnects are implemented. server side support for reconnect was removed
  // because client side support was not achieved
  socket.on('disconnect', function(data){
    utils.handleDisconnect(io, players, function(){
      players = {};
    });
  });

  socket.on('placeMeeple', function(data) {
    // Notify all clients to place a meeple based on 'data'
    io.emit('placeMeeple', data);
  });

  socket.on('removeMeeple', function(data) {
    // Notify all clients to remove a meeple based on 'data'
    io.emit('removeMeeple', data);
  });

  socket.on('placeTile', function(data) {
    // Notify all clients to place a tile based on 'data'
    io.emit('placeTile', data);
  });
});

server.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

exports.app = app;
exports.io = io;
exports.players = players;
