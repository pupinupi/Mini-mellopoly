const socket = io();

// Здесь меняешь порядок клеток — просто переставляешь объекты массива
const cellsOrder = [
  "Minecraft",
  "Dota2",
  "CS GO",
  "Гомель",
  "Mell berries",
  "«Mell beer»",
  "Mell burger",
  "Москва",
  "M-taxi",
  "M-shering",
  "YouTube",
  "Kick",
  "Кипр"
  "Шаур-Mell",
  "Ам-ам-ам",
  "Mellbank",
  "Mellcoin",
  "Mellstroy Game",

];

// Данные о клетках (не меняем)
const cellsData = {
  "Кипр": { img:"images/Kipr.jpg.jpg", price:6000, rent:{diamond:9000, spade:10000, heart:11000}, color:"yellow" },
  "M-shering": { img:"images/Msher.jpg.jpg", price:6000, rent:{diamond:2500, spade:3000}, color:"brown" },
  "M-taxi": { img:"images/Taxi.jpg.jpg", price:5500, rent:{diamond:2000, spade:2500}, color:"brown" },
  "Шаур-Mell": { img:"images/Shaurmell.jpg.jpg", price:20000, rent:{diamond:6000, spade:6500}, color:"green" },
  "Mellstroy Game": { img:"images/Game.jpg.jpg", price:40000, rent:{diamond:10000, spade:15000, heart:20000}, color:"purple" },
  "Mellbank": { img:"images/Mellbank.jpg.jpg", price:30000, rent:{diamond:8000, spade:8500, heart:9000}, color:"purple" },
  "Mellcoin": { img:"images/Mellcoin.jpg.jpg", price:35000, rent:{diamond:9000, spade:9500, heart:10000}, color:"purple" },
  "KICK": { img:"images/Kick.jpg.jpg", price:15000, rent:{diamond:3500, spade:4000, heart:4500}, color:"blue" },
  "YouTube": { img:"images/Yt.jpg.jpg", price:10000, rent:{diamond:4500, spade:5000, heart:5500}, color:"blue" },
  "Гомель": { img:"images/Gomel.jpg.jpg", price:6000, rent:{diamond:7000, spade:8000, heart:9000}, color:"yellow" },
  "Москва": { img:"images/Moscow.jpg.jpg", price:6000, rent:{diamond:5000, spade:6000, heart:7000}, color:"yellow" },
  "«Ам-ам-ам»": { img:"images/Am.jpg.jpg", price:25000, rent:{diamond:7000, spade:7500}, color:"green" },
  "Mell beer": { img:"images/Beer.jpg.jpg", price:4500, rent:{diamond:1500, spade:2000, heart:2500}, color:"green" },
  "Mell burger": { img:"images/Burger.jpg.jpg", price:5000, rent:{diamond:1000, spade:1500, heart:2000}, color:"green" },
  "Minecraft": { img:"images/Mc.jpg.jpg", price:1500, rent:{diamond:200, spade:300, heart:400}, color:"red" },
  "CS GO": { img:"images/Cg.jpg.jpg", price:2500, rent:{diamond:400, spade:500, heart:600}, color:"red" },
  "Dota 2": { img:"images/Dot.jpg.jpg", price:2000, rent:{diamond:600, spade:700, heart:800}, color:"red" },
  "Mell berries": { img:"images/Wb.jpg.jpg", price:4000, rent:{diamond:800, spade:900, heart:1000}, color:"green" }
};

// создаем массив клеток в нужном порядке
const cells = cellsOrder.map(name => ({ name, ...cellsData[name] }));

// ==================== логика игры ====================
function renderBoard(game) {
  const board = document.getElementById("board");
  board.innerHTML = "";
  cells.forEach((cell, index) => {
    const owner = game.properties[index];
    const playerOwns = game.players.find(p=>p.id===owner);
    const cellDiv = document.createElement("div");
    cellDiv.className = "cell";
    cellDiv.style.borderColor = cell.color;
    cellDiv.innerHTML = `
      <img src="${cell.img}" width="80">
      <p>${cell.name}</p>
      <p>Цена: ${cell.price}</p>
      <p>${playerOwns ? "Владелец: "+playerOwns.name : ""}</p>
    `;
    board.appendChild(cellDiv);
  });
}

function join(){
  const name = document.getElementById("name").value;
  socket.emit("joinGame", name);
  document.getElementById("join").style.display="none";
  document.getElementById("game").style.display="block";
}
function start(){ socket.emit("startGame"); }
function roll(){ socket.emit("rollDice"); }
function buy(){ socket.emit("buyProperty"); }

socket.on("updateGame", (game) => { renderBoard(game); });
socket.on("diceRolled", (data)=>{ alert(data.player+" выбросил "+data.dice); });

