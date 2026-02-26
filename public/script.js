const socket = io();
let roomCode = "";

function join(){
  const name = document.getElementById("name").value;
  roomCode = document.getElementById("room").value;

  socket.emit("joinRoom", {
    name,
    roomCode,
    color: "red"
  });

  document.getElementById("join").style.display="none";
  document.getElementById("game").style.display="block";
}

function start(){
  socket.emit("startGame", roomCode);
}

function roll(){
  socket.emit("rollDice", roomCode);
}

socket.on("updateGame", (game) => {
  render(game);
});

socket.on("diceRolled", (data)=>{
  alert(data.player + " выбросил " + data.dice);
});

function render(game){
  const board = document.getElementById("board");
  board.innerHTML = "";

  game.players.forEach(p=>{
    const div = document.createElement("div");
    div.className="player";
    div.innerHTML = `
      <h3>${p.name}</h3>
      <p>Позиция: ${p.position}</p>
      <p>Деньги: ${p.money}</p>
    `;
    board.appendChild(div);
  });
}
