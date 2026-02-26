const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

const BOARD_SIZE = 20;
const START_MONEY = 1000;

let game = {
  players: [],
  currentTurn: 0,
  started: false,
  properties: Array(BOARD_SIZE).fill(null)
};

function createPlayer(id, name) {
  return {
    id,
    name,
    position: 0,
    money: START_MONEY,
    properties: []
  };
}

function rollDice() {
  return Math.floor(Math.random() * 6) + 1;
}

function nextTurn() {
  if (game.players.length === 0) return;
  game.currentTurn = (game.currentTurn + 1) % game.players.length;
}

io.on("connection", (socket) => {

  socket.on("joinGame", (name) => {
    if (game.started) return;
    const player = createPlayer(socket.id, name);
    game.players.push(player);
    io.emit("updateGame", game);
  });

  socket.on("startGame", () => {
    if (game.players.length >= 2) {
      game.started = true;
      io.emit("updateGame", game);
    }
  });

  socket.on("rollDice", () => {
    if (!game.started) return;

    const player = game.players[game.currentTurn];
    if (!player || player.id !== socket.id) return;

    const dice = rollDice();
    player.position = (player.position + dice) % BOARD_SIZE;

    const owner = game.properties[player.position];

    if (owner && owner !== player.id) {
      const rent = 100;
      player.money -= rent;
      const ownerPlayer = game.players.find(p => p.id === owner);
      if (ownerPlayer) ownerPlayer.money += rent;
    }

    io.emit("diceRolled", { player: player.name, dice });
    io.emit("updateGame", game);

    nextTurn();
  });

  socket.on("buyProperty", () => {
    const player = game.players[game.currentTurn];
    if (!player || player.id !== socket.id) return;

    const pos = player.position;

    if (!game.properties[pos] && player.money >= 200) {
      player.money -= 200;
      player.properties.push(pos);
      game.properties[pos] = player.id;
      io.emit("updateGame", game);
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("Server started on port " + PORT);
});
