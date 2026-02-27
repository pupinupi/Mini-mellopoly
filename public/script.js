const players = [
  {name:"Игрок 1", money:30000, position:0},
  {name:"Игрок 2", money:30000, position:0},
  {name:"Игрок 3", money:30000, position:0},
  {name:"Игрок 4", money:30000, position:0}
];

let current = 0;

const boardData = [
  {name:"Старт", type:"start", img:"/Start.jpg"},
  {name:"Minecraft", price:1500, img:"/Minecraft.jpg"},
  {name:"Dota 2", price:2000, img:"/Dota2.jpg"},
  {name:"CS GO", price:2500, img:"/CSGO.jpg"},
  {name:"Удача", type:"luck", img:"/Luck.jpg"},
  {name:"Москва", price:6000, img:"/Moscow.jpg"},
  {name:"Шанс", type:"chance", img:"/Chance.jpg"},
  {name:"Mellberries", price:4000, img:"/Mellberries.jpg"},
  {name:"Тюрьма", type:"jail", img:"/TM.jpg"},

  {name:"Mellbeer", price:4500, img:"/Mellbeer.jpg"},
  {name:"Mellburger", price:5000, img:"/Mellburger.jpg"},
  {name:"Гомель", price:6000, img:"/Gomel.jpg"},
  {name:"Удача", type:"luck", img:"/Luck.jpg"},
  {name:"M-Taxi", price:5500, img:"/M-Taxi.jpg"},
  {name:"M-Sharing", price:6000, img:"/M-Sharing.jpg"},
  {name:"+2000", type:"bonus", img:"/coin2000.jpg"},

  {name:"Пропуск хода", type:"skip", img:"/Skip.jpg"},
  {name:"YouTube", price:10000, img:"/YouTube.jpg"},
  {name:"Kick", price:15000, img:"/Kick.jpg"},
  {name:"Удача", type:"luck", img:"/Luck.jpg"},
  {name:"Кипр", price:6000, img:"/Kipr.jpg"},
  {name:"Шанс", type:"chance", img:"/Chance.jpg"},
  {name:"Shaur-Mell", price:20000, img:"/ShaurMell.jpg"},

  {name:"Тюрьма", type:"jail", img:"/TM.jpg"},
  {name:"Am-Am-Am", price:25000, img:"/AmAmAm.jpg"},
  {name:"Удача", type:"luck", img:"/Luck.jpg"},
  {name:"Шанс", type:"chance", img:"/Chance.jpg"},
  {name:"Mellbank", price:30000, img:"/Mellbank.jpg"},
  {name:"Mellcoin", price:35000, img:"/Mellcoin.jpg"},
  {name:"Mellstroy game", price:40000, img:"/MellstroyGame.jpg"},

  {name:"Вернуться к старту", type:"start", img:"/Start.jpg"}
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

  let i=0;

  // Верх
  for(let col=0; col<size; col++) cells[col] = boardData[i++] || null;
  // Правая сторона вниз
  for(let row=1; row<size; row++) cells[row*size + (size-1)] = boardData[i++] || null;
  // Низ влево
  for(let col=size-2; col>=0; col--) cells[(size-1)*size + col] = boardData[i++] || null;
  // Левая сторона вверх
  for(let row=size-2; row>0; row--) cells[row*size] = boardData[i++] || null;

  // Центральная картинка (5x5)
  const center = document.createElement("div");
  center.className="center";
  center.innerHTML=`<img src="/IMG_8941.jpeg">`;
  board.appendChild(center);

  for(let n=0; n<total; n++){
    // пропускаем центральные клетки
    const row = Math.floor(n/size);
    const col = n%size;
    if(row>=2 && row<=6 && col>=2 && col<=6) continue;

    const div = document.createElement("div");
    div.className="cell";
    const cell = cells[n];

    if(cell){
      div.innerHTML = `<strong>${cell.name}</strong>`;
      if(cell.img) div.innerHTML+=`<img src="${cell.img}">`;
    }
    board.appendChild(div);
  }
}

function rollDice(){
  const roll = Math.floor(Math.random()*6)+1;
  const player = players[current];

  // Пропуск хода
  if(player.skipNext){
    player.skipNext=false;
    alert(player.name+" пропускает ход!");
    current=(current+1)%players.length;
    updateUI();
    return;
  }

  player.position += roll;
  if(player.position >= boardData.length){
    player.position -= boardData.length;
    player.money += 5000;
  }

  handleCell(boardData[player.position], player);

  if(player.money>=200000){
    alert(player.name+" победил!");
  }

  current=(current+1)%players.length;
  updateUI();
  renderBoard();
}

function handleCell(cell, player){
  if(cell.price && !cell.owner){
    if(confirm(`Купить ${cell.name} за ${cell.price}?`)){
      if(player.money>=cell.price){
        player.money-=cell.price;
        cell.owner=player.name;
      }
    } else startAuction(cell);
  }

  if(cell.type==="bonus") player.money+=2000;
  if(cell.type==="chance"){
    const c = chanceCards[Math.floor(Math.random()*chanceCards.length)];
    document.getElementById("log").innerText="Шанс: "+c.text;
    c.action(player);
  }
  if(cell.type==="luck"){
    const c = luckCards[Math.floor(Math.random()*luckCards.length)];
    document.getElementById("log").innerText="Удача: "+c.text;
    c.action(player);
  }
  if(cell.type==="skip") player.skipNext=true;
  if(cell.type==="jail") player.inJail=true;
  if(cell.type==="start") {player.position=0; player.money+=5000;}
}

function startAuction(cell){
  let highest=cell.price, winner=null;
  players.forEach(p=>{
    const bid=parseInt(prompt(`${p.name}, ставка выше ${highest} или 0`));
    if(bid>highest && bid<=p.money){highest=bid; winner=p;}
  });
  if(winner){winner.money-=highest; cell.owner=winner.name;}
}

function updateUI(){
  document.getElementById("currentPlayer").innerText=players[current].name;
  document.getElementById("money").innerText=players[current].money;
}

updateUI();
renderBoard();
