const count = parseInt(prompt("Сколько игроков? (2-5)"));
const players = [];

for(let i=1;i<=count;i++){
  players.push({
    name:"Игрок "+i,
    money:30000,
    position:0
  });
}

let current = 0;

const boardData = [
  {name:"Старт"},

  {name:"Minecraft", price:1500, img:"/Minecraft.jpg"},
  {name:"Dota 2", price:2000, img:"/Dota2.jpg"},
  {name:"CS GO", price:2500, img:"/CSGO.jpg"},
  {name:"Удача", type:"luck", img:"/Luck.jpg"},
  {name:"Москва", price:6000, img:"/Moscow.jpg"},
  {name:"Шанс", type:"chance", img:"/Chance.jpg"},
  {name:"Mellberries", price:4000, img:"/Mellberries.jpg"},

  {name:"Тюрьма"},

  {name:"Mellbeer", price:4500, img:"/Mellbeer.jpg"},
  {name:"Mellburger", price:5000, img:"/Mellburger.jpg"},
  {name:"Гомель", price:6000, img:"/Gomel.jpg"},
  {name:"Удача", type:"luck", img:"/Luck.jpg"},
  {name:"M-Taxi", price:5500, img:"/M-Taxi.jpg"},
  {name:"M-Sharing", price:6000, img:"/M-Sharing.jpg"},
  {name:"+2000", type:"bonus", img:"/coin2000.jpg"},

  {name:"Пропуск хода", type:"skip"},
  {name:"YouTube", price:10000, img:"/YouTube.jpg"},
  {name:"Kick", price:15000, img:"/Kick.jpg"},
  {name:"Удача", type:"luck", img:"/Luck.jpg"},
  {name:"Кипр", price:6000, img:"/Kipr.jpg"},
  {name:"Шанс", type:"chance", img:"/Chance.jpg"},
  {name:"Shaur-Mell", price:20000, img:"/ShaurMell.jpg"},

  {name:"Тюрьма"},

  {name:"Am-Am-Am", price:25000, img:"/AmAmAm.jpg"},
  {name:"Удача", type:"luck", img:"/Luck.jpg"},
  {name:"Шанс", type:"chance", img:"/Chance.jpg"},
  {name:"Mellbank", price:30000, img:"/Mellbank.jpg"},
  {name:"Mellcoin", price:35000, img:"/Mellcoin.jpg"},
  {name:"Mellstroy game", price:40000, img:"/MellstroyGame.jpg"},

  {name:"Вернуться к старту", type:"start"}
];

const chanceCards = [
  {text:"Получите 2000₽", action:p=>p.money+=2000},
  {text:"Заплатите 3000₽", action:p=>p.money=Math.max(0,p.money-3000)},
  {text:"Вернитесь на старт +5000₽", action:p=>{p.position=0;p.money+=5000}}
];

const luckCards = [
  {text:"Наследство 10000₽", action:p=>p.money+=10000},
  {text:"Получите 2000₽", action:p=>p.money+=2000}
];

function renderBoard(){
  const board = document.getElementById("board");
  board.innerHTML = "";

  const size = 9;
  board.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
  board.style.gridTemplateRows = `repeat(${size}, 95px)`;

  const total = size*size;
  const cells = new Array(total).fill(null);

  let i = 0;

  for(let col=0; col<size; col++){
    cells[col] = boardData[i++] || null;
  }

  for(let row=1; row<size; row++){
    cells[row*size + (size-1)] = boardData[i++] || null;
  }

  for(let col=size-2; col>=0; col--){
    cells[(size-1)*size + col] = boardData[i++] || null;
  }

  for(let row=size-2; row>0; row--){
    cells[row*size] = boardData[i++] || null;
  }

  for(let n=0; n<total; n++){
    const div = document.createElement("div");
    div.className="cell";
    const cell = cells[n];

    if(cell){
      div.innerHTML = `<strong>${cell.name}</strong>`;
      if(cell.img){
        div.innerHTML += `<img src="${cell.img}">`;
      }
    }

    board.appendChild(div);
  }
}

function rollDice(){
  const roll = Math.floor(Math.random()*6)+1;
  const player = players[current];

  player.position += roll;

  if(player.position >= boardData.length){
    player.position -= boardData.length;
    player.money += 5000;
  }

  handleCell(boardData[player.position], player);

  if(player.money >= 200000){
    alert(player.name + " победил!");
  }

  current = (current+1)%players.length;
  updateUI();
  renderBoard();
}

function handleCell(cell, player){

  if(cell.price && !cell.owner){
    if(confirm(`Купить ${cell.name} за ${cell.price}?`)){
      if(player.money >= cell.price){
        player.money -= cell.price;
        cell.owner = player.name;
      }
    } else {
      startAuction(cell);
    }
  }

  if(cell.type==="bonus"){
    player.money += 2000;
  }

  if(cell.type==="chance"){
    const card = chanceCards[Math.floor(Math.random()*chanceCards.length)];
    document.getElementById("log").innerText = "Шанс: "+card.text;
    card.action(player);
  }

  if(cell.type==="luck"){
    const card = luckCards[Math.floor(Math.random()*luckCards.length)];
    document.getElementById("log").innerText = "Удача: "+card.text;
    card.action(player);
  }

  if(cell.type==="start"){
    player.position=0;
    player.money+=5000;
  }
}

function startAuction(cell){
  let highest = cell.price;
  let winner = null;

  players.forEach(p=>{
    const bid = prompt(`${p.name}, ставка выше ${highest} или 0`);
    const num = parseInt(bid);
    if(num>highest && num<=p.money){
      highest=num;
      winner=p;
    }
  });

  if(winner){
    winner.money-=highest;
    cell.owner=winner.name;
  }
}

function updateUI(){
  document.getElementById("currentPlayer").innerText=players[current].name;
  document.getElementById("money").innerText=players[current].money;
}

updateUI();
renderBoard();
