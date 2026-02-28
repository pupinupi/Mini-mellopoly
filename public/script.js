const boardData = [

  // ВЕРХ (слева направо)
  "Start.jpg",
  "Minecraft.jpg",
  "Dota2.jpg",
  "CSGO.jpg",
  "Luck.jpg",
  "Moscow.jpg",
  "Chance.jpg",
  "Mellberries.jpg",
  "TM.jpg",

  // ПРАВАЯ СТОРОНА (сверху вниз)
  "Mellbeer.jpg",
  "Mellburger.jpg",
  "Gomel.jpg",
  "Luck.jpg",
  "M-Taxi.jpg",
  "M-Sharing.jpg",
  "coin2000.jpg",

  // НИЗ (справа налево)
  "Skip.jpg",
  "YouTube.jpg",
  "Kick.jpg",
  "Luck.jpg",
  "Kipr.jpg",
  "Chance.jpg",
  "ShaurMell.jpg",
  "TM.jpg",

  // ЛЕВАЯ СТОРОНА (снизу вверх)
  "AmAmAm.jpg",
  "Luck.jpg",
  "Chance.jpg",
  "Mellbank.jpg",
  "Mellcoin.jpg",
  "MellstroyGame.jpg",
  "Skip.jpg"

];

function renderBoard() {

  const board = document.getElementById("board");
  board.innerHTML = "";

  const size = 9;
  const total = 81;
  const cells = new Array(total).fill(null);

  const order = [];

  // верх
  for (let col = 0; col < 9; col++) {
    order.push(col);
  }

  // право
  for (let row = 1; row < 8; row++) {
    order.push(row * 9 + 8);
  }

  // низ
  for (let col = 8; col >= 0; col--) {
    order.push(8 * 9 + col);
  }

  // лево
  for (let row = 7; row > 0; row--) {
    order.push(row * 9);
  }

  // заполняем только 30 клеток
  for (let i = 0; i < boardData.length; i++) {
    cells[order[i]] = boardData[i];
  }

  for (let i = 0; i < total; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";

    if (cells[i]) {
      cell.innerHTML = `<img src="${cells[i]}">`;
    }

    board.appendChild(cell);
  }

  // центр
  const center = document.createElement("div");
  center.id = "center";
  board.appendChild(center);
}

function rollDice() {
  const number = Math.floor(Math.random() * 6) + 1;
  document.getElementById("dice").textContent = number;
}

renderBoard();
