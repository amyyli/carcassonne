var Tile = require('./tile');
var Deck = require('./deck');
var Meeples = require('./meeples');
var spec = require('./deckSpec');

// players argument should be `players` from app.js
var Game = function(boardSize, deckSpec, players){
  this.ongoing = true; // indicates that game is or is not in session 
  this.boardSize = boardSize;
  this.board = []; // probably don't even need this anymore
    for( var i = 0; i < boardSize; i++ ) {
      this.board.push( new Array(boardSize) );
    }
  this.deck = new Deck(deckSpec);
  this.meeples = new Meeples();
  this.players = Object.keys(players);
  this.currentPlayer = 0;
};

// TODO: decide where to place start tile on the board;

// arg should be a parsed tile from the client post request
Game.prototype.placeTile = function(tile) {
  //tile = new Tile(tile.id, tile.x, tile.y, tile.meeple);
  this.board[tile.x][tile.y] = tile;
};

Game.prototype.nextPlayer = function() {
  if (this.currentPlayer === this.players.length - 1) {
    this.currentPlayer = 0;
  } else {
    this.currentPlayer++;
  }
  return this.players[ this.currentPlayer ];
};

// generates game state for next turn
Game.prototype.update = function(tile) {
  var gameState = {};
  this.placeTile(tile);
  gameState.lastTile = tile;
  gameState.nextPlayer = this.nextPlayer();
  gameState.nextTile = this.deck.pop();
  return gameState;
};

module.exports = Game;
