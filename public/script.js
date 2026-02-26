// Подключаемся к серверу Render
const socket = io(); // если нужно, можно указать: io("https://ТВОЙ_СЕРВЕР.onrender.com")

let myRoomCode = "";
let myColor = "";

// Порядок клеток
const cellsOrder = [
  "Москва","Кипр","M-shering","M-taxi",
  "Шаур-Mell","«Ам-ам-ам»","Mellstroy Game",
  "Mellbank","Mellcoin","KICK","YouTube",
  "Гомель","Mell beer","Mell burger",
  "Minecraft","CS GO","Dota 2","Mell berries"
];

const cellsData = {
  "Кипр": { img:"images/cyprus.jpg", color:"yellow", price:6000 },
  "M-shering": { img:"images/m-shering.jpg", color:"brown", price:6000 },
  "M-taxi": { img:"images/m-taxi.jpg", color:"brown", price:5500 },
  "Шаур-Mell": { img:"images/mellstroy.jpg", color:"green", price:20000 },
  "Mellstroy Game": { img:"images/mellstroy.jpg", color:"purple", price:40000 },
  "Mellbank": { img:"images/mellbank.jpg", color:"purple", price:30000 },
  "Mellcoin": { img:"images/mellcoin.jpg", color:"purple", price:35000 },
  "KICK": { img:"images/kick.jpg", color:"blue", price:15000 },
  "YouTube": { img:"images/youtube.jpg", color:"blue", price:10000 },
  "Гомель": { img:"images/gomel.jpg", color:"yellow", price:6000 },
  "Москва": { img:"images/moscow.jpg", color:"yellow", price:6000 },
  "«Ам-ам-ам»": { img:"images/am-am-am.jpg", color:"green", price:25000 },
  "Mell beer": { img:"images/mellbeer.jpg", color:"green", price:4500 },
  "Mell burger": { img:"images/mellburger.jpg", color:"green", price:5000 },
  "Minecraft": { img:"images/minecraft.jpg", color:"red", price:1500 },
  "CS GO": { img:"images/csgo.jpg", color:"red", price:2500 },
  "Dota 2": { img:"images/dota2.jpg", color:"red", price:2000 },
  "Mell berries": { img:"images/mellberries.jpg", color:"green", price:4000 }
};

const cells = cellsOrder.map(name => ({ name, ...cellsData[name] }));

// ==================== Вход в комнату ====================
function joinRoom() {
  const name = document.getElementById("name").value.trim();
  const roomCode = document.getElementById("roomCode").value.trim();
  const color = document.getElementById("color").value;

  if(!name || !roomCode) return alert("Введите имя и код комнаты");

  myRoomCode = roomCode;
  myColor = color;

  socket.emit("joinRoom", { name, roomCode, color });
}

// ==================== Кнопки игры ====================
function startGame() {
  socket.emit("startGame", myRoomCode);
}

function rollDice() {
  socket.emit("rollDice", myRoomCode);
}

// ==================== Обработка событий ====================
socket.on("colorTaken", () => alert("Этот цвет занят"));
socket.on("roomFull", () => alert("Комната полна"));
socket.on("notEnoughPlayers", () => alert("Недостаточно игроков"));

// Когда игрок успешно присоединился — показываем интерфейс
socket.on("roomUpdate", room => {
  document.getElementById("join").style.display="none";
  document.getElementById("game").style.display="block";
  renderBoard(room);
});

socket.on("gameStarted", room => renderBoard(room));

socket.on("diceRolled", data => {
  alert(`Бросок кубика: ${data.dice}`);
  renderBoard({
    players: data.players,
    turn: data.turn,
    started: true,
    properties: Array(20).fill(null)
  });
});

// ==================== Отрисовка доски ====================
function renderBoard(room) {
  const board = document.getElementById("board");
  board.innerHTML = "";

  cells.forEach((cell, idx) => {
    const cellDiv = document.createElement("div");
    cellDiv.className = "cell";
    cellDiv.style.borderColor = cell.color;

    // Игроки на этой клетке
    const playersHere = room.players?.filter(p=>p.position === idx) || [];

    cellDiv.innerHTML = `
      <img src="${cell.img}" width="80">
      <p>${cell.name}</p>
      <p>Цена: ${cell.price}</p>
      ${playersHere.map(p=>`<p style="color:${p.color}">${p.name}</p>`).join("")}
    `;

    board.appendChild(cellDiv);
  });
}

// ==================== Проверка подключения ====================
socket.on("connect", () => console.log("Подключено, Socket ID:", socket.id));
socket.on("connect_error", err => alert("Ошибка подключения к серверу!"));
