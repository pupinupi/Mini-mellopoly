const players = [
  {name: "Игрок 1", money: 30000, position: 0, sectors: {}},
  {name: "Игрок 2", money: 30000, position: 0, sectors: {}},
  {name: "Игрок 3", money: 30000, position: 0, sectors: {}},
  {name: "Игрок 4", money: 30000, position: 0, sectors: {}}
];

let currentPlayer = 0;

const boardData = [
  {name: "Старт", img:"/coin2000.jpg"},
  {name: "Minecraft", price:1500, sector:1, img:"/Minecraft.jpg"},
  {name: "Dota2", price:2000, sector:1, img:"/Dota2.jpg"},
  {name: "CSGO", price:2500, sector:1, img:"/CSGO.jpg"},
  {name: "Удача", type:"luck", img:"/Luck.jpg"},
  {name: "Москва", price:6000, sector:3, img:"/Moscow.jpg"},
  {name: "Шанс", type:"chance", img:"/Chance.jpg"},
  {name: "Mellberries", price:4000, sector:2, img:"/Mellberries.jpg"},
  {name: "Тюрьма"},
  {name: "Mellbeer", price:4500, sector:2, img:"/Mellbeer.jpg"},
  {name: "Mellburger", price:5000, sector:2, img:"/Mellburger.jpg"},
  {name: "Гомель", price:6000, sector:3, img:"/Gomel.jpg"},
  {name: "Удача", type:"luck", img:"/Luck.jpg"},
  {name: "M-Taxi", price:5500, sector:4, img:"/M-Taxi.jpg"},
  {name: "M-Sharing", price:6000, sector:4, img:"/M-Sharing.jpg"},
  {name: "+2000", type:"bonus", img:"/coin2000.jpg"},
  {name: "Пропуск хода", type:"skip"},
  {name: "YouTube", price:10000, sector:5, img:"/YouTube.jpg"},
  {name: "Kick", price:15000, sector:5, img:"/Kick.jpg"},
  {name: "Удача", type:"luck", img:"/Luck.jpg"},
  {name: "Кипр", price:6000, sector:3, img:"/Kipr.jpg"},
  {name: "Шанс", type:"chance", img:"/Chance.jpg"},
  {name: "Shaur-Mell", price:20000, sector:6, img:"/ShaurMell.jpg"},
  {name: "Тюрьма"},
  {name: "Am-Am-Am", price:25000, sector:6, img:"/AmAmAm.jpg"},
  {name: "Удача", type:"luck", img:"/Luck.jpg"},
  {name: "Шанс", type:"chance", img:"/Chance.jpg"},
  {name: "Mellbank", price:30000, sector:7, img:"/Mellbank.jpg"},
  {name: "Mellcoin", price:35000, sector:7, img:"/Mellcoin.jpg"},
  {name: "Mellstroy game", price:40000, sector:7, img:"/MellstroyGame.jpg"},
  {name: "Вернуться к старту", type:"start"}
];

const sectorBonuses = {
  1: 2000,
  2: 4000,
  3: 5000,
  4: 3000,
  5: 7000,
  6: 10000,
  7: 20000
};

function renderBoard() {
  const board = document.getElementById("board");
  board.innerHTML = "";
  boardData.forEach((cell, index) => {
    const div = document.createElement("div");
    div.className = "cell";
    div.innerHTML = `<strong>${cell.name}</strong>`;
    if(cell.img) div.innerHTML += `<br><img src="${cell.img}">`;
    board.appendChild(div);
  });
}

function updateUI() {
  document.getElementById("money").textContent = players[currentPlayer].money;
}

document.getElementById("rollDice").addEventListener("click", () => {
  const roll = Math.floor(Math.random()*6)+1;
  movePlayer(roll);
});

function movePlayer(steps) {
  const player = players[currentPlayer];
  player.position += steps;

  if(player.position >= boardData.length) {
    player.position -= boardData.length;
    player.money += 5000;
    alert("Прошёл круг +5000₽");
    checkSectorBonus(player);
  }

  handleCell(boardData[player.position], player);
  updateUI();

  if(player.money >= 200000){
    alert(player.name + " победил!");
  }

  currentPlayer = (currentPlayer + 1) % players.length;
}

function handleCell(cell, player){
  if(cell.price && !cell.owner){
    if(confirm("Купить " + cell.name + " за " + cell.price + "₽?")){
      if(player.money >= cell.price){
        player.money -= cell.price;
        cell.owner = player.name;
        player.sectors[cell.sector] = (player.sectors[cell.sector] || 0) + 1;
      }
    }
  }

  if(cell.type === "bonus"){
    player.money += 2000;
  }

  if(cell.type === "start"){
    player.position = 0;
    player.money += 5000;
  }
}

function checkSectorBonus(player){
  const sectorCounts = {
    1:3, 2:3, 3:3,
    4:2, 5:2, 6:2, 7:3
  };

  for(let s in sectorCounts){
    if(player.sectors[s] === sectorCounts[s]){
      player.money += sectorBonuses[s];
      alert("Бонус сектора +" + sectorBonuses[s]);
    }
  }
}

renderBoard();
updateUI();
