const players = [
  {name:"Игрок 1", money:30000, position:0, properties:[]},
  {name:"Игрок 2", money:30000, position:0, properties:[]},
  {name:"Игрок 3", money:30000, position:0, properties:[]},
  {name:"Игрок 4", money:30000, position:0, properties:[]}
];

let current = 0;

const chanceCards = [
  {text:"Получите 1000₽", action:(p)=>p.money+=1000},
  {text:"Получите 2000₽", action:(p)=>p.money+=2000},
  {text:"Заплатите 2000₽", action:(p)=>p.money=Math.max(0,p.money-2000)},
  {text:"Пройдите на старт +5000₽", action:(p)=>{p.position=0;p.money+=5000}}
];

const luckCards = [
  {text:"Наследство 10000₽", action:(p)=>p.money+=10000},
  {text:"День рождения +1500₽", action:(p)=>p.money+=1500},
  {text:"Получите 2000₽", action:(p)=>p.money+=2000}
];

const boardData = [
  {name:"Старт"},
  {name:"Minecraft", price:1500, img:"/Minecraft.jpg"},
  {name:"Dota2", price:2000, img:"/Dota2.jpg"},
  {name:"CSGO", price:2500, img:"/CSGO.jpg"},
  {name:"Удача", type:"luck", img:"/Luck.jpg"},
  {name:"Москва", price:6000, img:"/Moscow.jpg"},
  {name:"Шанс", type:"chance", img:"/Chance.jpg"},
  {name:"Mellberries", price:4000, img:"/Mellberries.jpg"},
  {name:"Тюрьма"},
  {name:"Mellbeer", price:4500, img:"/Mellbeer.jpg"},
  {name:"Mellburger", price:5000, img:"/Mellburger.jpg"},
  {name:"Гомель", price:6000, img:"/Gomel.jpg"},
  {name:"M-Taxi", price:5500, img:"/M-Taxi.jpg"},
  {name:"M-Sharing", price:6000, img:"/M-Sharing.jpg"},
  {name:"YouTube", price:10000, img:"/YouTube.jpg"},
  {name:"Kick", price:15000, img:"/Kick.jpg"},
  {name:"Кипр", price:6000, img:"/Kipr.jpg"},
  {name:"Shaur-Mell", price:20000, img:"/ShaurMell.jpg"},
  {name:"Am-Am-Am", price:25000, img:"/AmAmAm.jpg"},
  {name:"Mellbank", price:30000, img:"/Mellbank.jpg"},
  {name:"Mellcoin", price:35000, img:"/Mellcoin.jpg"},
  {name:"Mellstroy", price:40000, img:"/MellstroyGame.jpg"}
];

function log(text){
  document.getElementById("log").innerHTML = text;
}

function renderBoard(){
  const board = document.getElementById("board");
  board.innerHTML = "";

  const perimeter = [];

  const size = 8;
  const totalCells = size*size;

  for(let i=0;i<totalCells;i++){
    perimeter.push(null);
  }

  let index=0;

  // верх
  for(let i=0;i<size;i++) perimeter[i]=boardData[index++] || null;
  // право
  for(let i=1;i<size;i++) perimeter[i*size + (size-1)] = boardData[index++] || null;
  // низ
  for(let i=size-2;i>=0;i--) perimeter[(size-1)*size + i] = boardData[index++] || null;
  // лево
  for(let i=size-2;i>0;i--) perimeter[i*size] = boardData[index++] || null;

  for(let i=0;i<totalCells;i++){
    const div = document.createElement("div");
    div.className="cell";

    const cell = perimeter[i];

    if(cell){
      div.innerHTML = `<strong>${cell.name}</strong>`;
      if(cell.img){
        div.innerHTML += `<img src="${cell.img}">`;
      }
      players.forEach((p,pi)=>{
        if(p.position===boardData.indexOf(cell)){
          div.innerHTML+=`<div class="player-token">🎲${pi+1}</div>`;
        }
      });
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
  checkWin(player);
  current = (current+1)%players.length;
  updateUI();
  renderBoard();
}

function handleCell(cell, player){

  if(cell.price){
    if(!cell.owner){
      if(confirm(`Купить ${cell.name} за ${cell.price}?`)){
        if(player.money>=cell.price){
          player.money-=cell.price;
          cell.owner=player.name;
          player.properties.push(cell);
        }
      } else {
        startAuction(cell);
      }
    } else {
      log("Компания уже куплена");
    }
  }

  if(cell.type==="chance"){
    const card = chanceCards[Math.floor(Math.random()*chanceCards.length)];
    log("Шанс: "+card.text);
    card.action(player);
  }

  if(cell.type==="luck"){
    const card = luckCards[Math.floor(Math.random()*luckCards.length)];
    log("Удача: "+card.text);
    card.action(player);
  }
}

function startAuction(cell){
  let highest = cell.price;
  let winner = null;

  players.forEach(p=>{
    const bid = prompt(`${p.name}, ставка выше ${highest} или 0 чтобы отказаться`);
    const num = parseInt(bid);
    if(num>highest && num<=p.money){
      highest=num;
      winner=p;
    }
  });

  if(winner){
    winner.money-=highest;
    cell.owner=winner.name;
    winner.properties.push(cell);
    log(`${winner.name} выиграл аукцион за ${highest}`);
  } else {
    log("Аукцион без ставок");
  }
}

function checkWin(player){
  if(player.money>=200000){
    alert(player.name+" победил!");
  }
}

function updateUI(){
  document.getElementById("currentPlayer").innerText=players[current].name;
  document.getElementById("money").innerText=players[current].money;
}

updateUI();
renderBoard();
