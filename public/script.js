const socket = io();
let roomCode = "";

const cells = [
"Старт","Москва","Шанс","Кипр","M-shering","Удача",
"M-taxi","Шаур-Mell","Mellstroy Game","Тюрьма",
"Mellbank","Mellcoin","KICK","YouTube","Шанс",
"Гомель","Mell beer","Mell burger","Minecraft",
"CS GO","Dota 2","Mell berries","Удача","Старт"
];

function renderBoard(players) {

    const board = document.getElementById("board");
    board.innerHTML = "";

    cells.forEach((cell, index) => {

        const div = document.createElement("div");
        div.className = "cell";
        div.innerHTML = `<p>${cell}</p>`;

        players.forEach(p => {
            if (p.position === index) {
                div.innerHTML += `<span>${p.name}</span>`;
            }
        });

        board.appendChild(div);
    });
}

function join(){
    const name = document.getElementById("name").value;
    roomCode = document.getElementById("room").value;

    socket.emit("joinRoom", { name, roomCode });

    document.getElementById("join").style.display="none";
    document.getElementById("game").style.display="block";
}

function start(){
    socket.emit("startGame", roomCode);
}

function roll(){
    socket.emit("rollDice", roomCode);
}

socket.on("roomUpdate", (room)=>{
    renderBoard(room.players);
});

socket.on("diceRolled", (data)=>{
    alert(data.player+" выбросил "+data.dice);
});
