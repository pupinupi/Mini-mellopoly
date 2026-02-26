// Игроки
const players = [
  {name: "Игрок 1", money: 30000, position: 0, luck: 50, sectors: {}},
  {name: "Игрок 2", money: 30000, position: 0, luck: 50, sectors: {}},
  {name: "Игрок 3", money: 30000, position: 0, luck: 50, sectors: {}},
  {name: "Игрок 4", money: 30000, position: 0, luck: 50, sectors: {}}
];

let currentPlayer = 0;

// Поле (с изображениями .jpg)
const boardData = [
  {name: "Старт", img:"Images/coin.jpg"},
  {name: "Minecraft", price:1500, sector:1, img:"Images/Minecraft.jpg"},
  {name: "Dota2", price:2000, sector:1, img:"Images/Dota2.jpg"},
  {name: "CSGO", price:2500, sector:1, img:"Images/CSGO.jpg"},
  {name: "Удача", type:"luck", img:"Images/luck.jpg"},
  {name: "Москва", price:6000, sector:3, img:"Images/Moscow.jpg"},
  {name: "Шанс", type:"chance"},
  {name: "Mellberries", price:4000, sector:2, img:"Images/Mellberries.jpg"},
  {name: "Тюрьма"},
  {name: "Mellbeer", price:4500, sector:2, img:"Images/Mellbeer.jpg"},
  {name: "Mellburger", price:5000, sector:2, img:"Images/Mellburger.jpg"},
  {name: "Гомель", price:6000, sector:3, img:"Images/Gomel.jpg"},
  {name: "Удача", type:"luck", img:"Images/luck.jpg"},
  {name: "M-Taxi", price:5500, sector:4, img:"Images/M-Taxi.jpg"},
  {name: "M-Sharing", price:6000, sector:4, img:"Images/M-Sharing.jpg"},
  {name: "+2000", type:"bonus"},
  {name: "Пропуск хода", type:"skip"},
  {name: "YouTube", price:10000, sector:5, img:"Images/YouTube.jpg"},
  {name: "Kick", price:15000, sector:5, img:"Images/Kick.jpg"},
  {name: "Удача", type:"luck", img:"Images/luck.jpg"},
  {name: "Кипр", price:6000, sector:3, img:"Images/Kipr.jpg"},
  {name: "Шанс", type:"chance"},
  {name: "Shaur-Mell", price:20000, sector:6, img:"Images/ShaurMell.jpg"},
  {name: "Тюрьма"},
  {name: "Am-Am-Am", price:25000, sector:6, img:"Images/AmAmAm.jpg"},
  {name: "Удача", type:"luck", img:"Images/luck.jpg"},
  {name: "Шанс", type:"chance"},
  {name: "Mellbank", price:30000, sector:7, img:"Images/Mellbank.jpg"},
  {name: "Mellcoin", price:35000, sector:7, img:"Images/Mellcoin.jpg"},
  {name: "Mellstroy game", price:40000, sector:7, img:"Images/MellstroyGame.jpg"},
  {name: "Пропуск хода/Старт", type:"skip"}
];

// Бонусы за сектора
const sectorBonuses = {
  1: 2000,
  2: 4000,
  3: 5000,
  4: 3000,
  5: 7000,
  6: 10000,
  7: 20000
};

// Отрисовка поля
function renderBoard() {
  const board = document.getElementById("board");
  board.innerHTML = "";
  boardData.forEach((cell, index) => {
    const div = document.createElement("div");
    div.className = "cell";
    div.id = "cell-" + index;
    div.innerHTML = `<strong>${cell.name}</strong>`;
    if(cell.img) div.innerHTML += `<br><img src="${cell.img}">`;
    board.appendChild(div);
  });
}

// Обновление панели игрока
function updateUI() {
  document.getElementById("money").textContent = players[currentPlayer].money;
  document.getElementById("luck-value").textContent = players[currentPlayer].luck + "%";
}

// Бросок кубика
document.getElementById("rollDice").addEventListener("click", () => {
  const roll = Math.floor(Math.random()*6)+1;
  document.getElementById("diceResult").textContent = `Бросок: ${roll}`;
  movePlayer(roll);
});

// Перемещение игрока
function movePlayer(steps) {
  const player = players[currentPlayer];
  player.position += steps;
  if(player.position >= boardData.length) {
    player.position -= boardData.length;
    player.money += 5000; // бонус за круг
    alert(`${player.name} прошёл круг и получил +5000₽`);
  }
  const cell = boardData[player.position];
  handleCell(cell, player);
  updateUI();
}

// Логика клетки
function handleCell(cell, player) {
  if(cell.price) {
    if(!cell.owner) {
      if(confirm(`Купить ${cell.name} за ${cell.price}₽?`)) {
        if(player.money >= cell.price) {
          player.money -= cell.price;
          cell.owner = player.name;
          player.sectors[cell.sector] = player.sectors[cell.sector] ? player.sectors[cell.sector]+1 : 1;
        } else alert("Недостаточно денег");
      } else {
        // Аукцион можно реализовать позже
      }
    } else {
      alert(`${cell.name} уже куплена`);
    }
  } else if(cell.type==="luck") alert("Карта Удачи!"); 
  else if(cell.type==="chance") alert("Карта Шанс!");
  else if(cell.type==="bonus") player.money += 2000;
  else if(cell.type==="skip") alert("Пропуск хода");
}

// Инициализация
renderBoard();
updateUI();
