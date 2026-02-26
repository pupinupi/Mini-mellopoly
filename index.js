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
const MAX_PLAYERS = 4;

io.on("connection", (socket) => {

    socket.on("joinRoom", ({ name, roomCode }) => {

        if (!rooms[roomCode]) {
            rooms[roomCode] = {
                players: [],
                host: socket.id,
                started: false,
                turn: 0
            };
        }

        const room = rooms[roomCode];

        if (room.players.length >= MAX_PLAYERS) {
            socket.emit("roomFull");
            return;
        }

        const player = {
            id: socket.id,
            name,
            position: 0,
            money: 20000,
            jail: false,
            skip: 0
        };

        room.players.push(player);
        socket.join(roomCode);

        io.to(roomCode).emit("roomUpdate", room);
    });

    socket.on("startGame", (roomCode) => {

        const room = rooms[roomCode];
        if (!room) return;

        if (socket.id !== room.host) return;
        if (room.players.length < 2) return;

        room.started = true;

        io.to(roomCode).emit("gameStarted", room);
    });

    socket.on("rollDice", (roomCode) => {

        const room = rooms[roomCode];
        if (!room || !room.started) return;

        const player = room.players[room.turn];

        if (player.id !== socket.id) return;

        if (player.skip > 0) {
            player.skip--;
            nextTurn(room, roomCode);
            return;
        }

        const dice = Math.floor(Math.random() * 6) + 1;
        player.position = (player.position + dice) % 24;

        io.to(roomCode).emit("diceRolled", {
            dice,
            player: player.name,
            players: room.players
        });

        nextTurn(room, roomCode);
    });

    socket.on("disconnect", () => {
        for (const code in rooms) {
            rooms[code].players =
                rooms[code].players.filter(p => p.id !== socket.id);
        }
    });

});

function nextTurn(room, code) {
    room.turn++;
    if (room.turn >= room.players.length)
        room.turn = 0;

    io.to(code).emit("roomUpdate", room);
}

server.listen(3000, () => {
    console.log("Server running");
});
