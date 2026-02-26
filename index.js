const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

const rooms = {};
const BOARD_SIZE = 20;

const chanceCards = [
  { type: "money", amount: 1000 },
  { type: "money", amount: 2000 },
  { type: "money", amount: 5000 },
  { type: "move", step: -2 },
  { type: "jail" },
  { type: "skip", turns: 2 }
];

const luckCards = [
  { type: "money", amount: 2000 },
  { type: "money", amount: 1000 },
  { type: "money", amount: 10000 },
  { type: "freeJail" }
];

io.on("connection", (socket) => {

  socket.on("joinRoom", ({ name, roomCode, color }) => {

    if (!rooms[roomCode]) {
      rooms[roomCode] = {
        players: [],
        turn: 0,
        started: false
      };
    }

    const room = rooms[roomCode];

    const player = {
      id: socket.id,
      name,
      color,
      position: 0,
      money: 20000,
      skip: 0,
      inJail: false
    };

    room.players.push(player);
    socket.join(roomCode);

    io.to(roomCode).emit("updateGame", room);
  });

  socket.on("startGame", (roomCode) => {
    const room = rooms[roomCode];
    if (!room) return;

    room.started = true;
    io.to(roomCode).emit("updateGame", room);
  });

  socket.on("rollDice", (roomCode) => {
    const room = rooms[roomCode];
    if (!room || !room.started) return;

    const player = room.players[room.turn];
    if (!player || player.id !== socket.id) return;

    if (player.skip > 0) {
      player.skip--;
      nextTurn(room, roomCode);
      return;
    }

    const dice = Math.floor(Math.random() * 6) + 1;
    player.position = (player.position + dice) % BOARD_SIZE;

    if (player.position === 5) {
      const card = chanceCards[Math.floor(Math.random() * chanceCards.length)];
      applyCard(card, player);
    }

    if (player.position === 10) {
      const card = luckCards[Math.floor(Math.random() * luckCards.length)];
      applyCard(card, player);
    }

    io.to(roomCode).emit("diceRolled", {
      player: player.name,
      dice
    });

    nextTurn(room, roomCode);
  });

  socket.on("disconnect", () => {
    for (const code in rooms) {
      rooms[code].players = rooms[code].players.filter(p => p.id !== socket.id);
      io.to(code).emit("updateGame", rooms[code]);
    }
  });

});

function applyCard(card, player) {
  if (card.type === "money") player.money += card.amount;
  if (card.type === "move") player.position += card.step;
  if (card.type === "jail") player.inJail = true;
  if (card.type === "skip") player.skip = card.turns;
}

function nextTurn(room, roomCode) {
  room.turn++;
  if (room.turn >= room.players.length) room.turn = 0;
  io.to(roomCode).emit("updateGame", room);
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log("Server started"));
