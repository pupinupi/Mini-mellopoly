let players=[];
let current=0;

const boardData=[
"Start.jpg",
"Minecraft.jpg",
"Dota2.jpg",
"CSGO.jpg",
"Luck.jpg",
"Moscow.jpg",
"Chance.jpg",
"Mellberries.jpg",
"TM.jpg",

"Mellbeer.jpg",
"Mellburger.jpg",
"Gomel.jpg",
"Luck.jpg",
"M-Taxi.jpg",
"M-Sharing.jpg",
"coin2000.jpg",

"Skip.jpg",
"YouTube.jpg",
"Kick.jpg",
"Luck.jpg",
"Kipr.jpg",
"Chance.jpg",
"ShaurMell.jpg",
"TM.jpg",

"AmAmAm.jpg",
"Luck.jpg",
"Chance.jpg",
"Mellbank.jpg",
"Mellcoin.jpg",
"MellstroyGame.jpg",
"Skip.jpg"
];

function addPlayer(){
  if(players.length>=4) return;
  const id=players.length;
  players.push({
    name:"Игрок "+(id+1),
    money:30000,
    pos:0,
    color:["red","blue","green","yellow"][id]
  });
  renderLobby();
}

function renderLobby(){
  const div=document.getElementById("playersSetup");
  div.innerHTML="";
  players.forEach(p=>{
    div.innerHTML+=`<p>${p.name}</p>`;
  });
}

function startGame(){
  if(players.length<2) return alert("Минимум 2 игрока");
  document.getElementById("lobby").style.display="none";
  document.getElementById("game").style.display="block";
  renderBoard();
  updatePlayersInfo();
}

function renderBoard() {
  const board = document.getElementById("board");
  board.innerHTML = "";

  const size = 9;
  const total = size * size;

  board.style.display = "grid";
  board.style.gridTemplateColumns = "repeat(9, 1fr)";
  board.style.gridTemplateRows = "repeat(9, 1fr)";

  // создаём пустой массив 81 клетка
  const grid = new Array(total).fill(null);

  let i = 0;

  // ВЕРХ
  for (let col = 0; col < 9; col++) {
    grid[col] = boardData[i++] || null;
  }

  // ПРАВО
  for (let row = 1; row < 9; row++) {
    grid[row * 9 + 8] = boardData[i++] || null;
  }

  // НИЗ
  for (let col = 7; col >= 0; col--) {
    grid[72 + col] = boardData[i++] || null;
  }

  // ЛЕВО
  for (let row = 7; row > 0; row--) {
    grid[row * 9] = boardData[i++] || null;
  }

  // Рисуем поле
  for (let n = 0; n < total; n++) {

    const cell = document.createElement("div");
    cell.className = "cell";

    // центр 7x7
    const row = Math.floor(n / 9);
    const col = n % 9;

    if (row > 0 && row < 8 && col > 0 && col < 8) {
      if (row === 1 && col === 1) {
        const center = document.createElement("div");
        center.id = "center";
        center.style.gridColumn = "2 / span 7";
        center.style.gridRow = "2 / span 7";
        board.appendChild(center);
      }
      continue;
    }

    if (grid[n]) {
      cell.innerHTML = `<img src="${grid[n]}">`;
    }

    board.appendChild(cell);
  }

  renderTokens();
}
  renderTokens();
}

function renderTokens(){
  const cells=document.querySelectorAll(".cell");
  players.forEach(p=>{
    const token=document.createElement("div");
    token.className="playerToken";
    token.style.background=p.color;
    cells[p.pos].appendChild(token);
  });
}

function rollDice(){
  const dice=document.getElementById("dice3d");
  dice.classList.add("roll");

  const roll=Math.floor(Math.random()*6)+1;

  setTimeout(()=>{
    dice.classList.remove("roll");

    const player=players[current];
    player.pos+=roll;

    if(player.pos>=31){
      player.pos-=31;
      player.money+=2000;
    }

    handleCell(player);

    if(player.money>=200000){
      alert(player.name+" победил!");
    }

    current=(current+1)%players.length;
    renderBoard();
    updatePlayersInfo();
  },500);
}

function handleCell(player){
  const cellName=boardData[player.pos];

  if(cellName==="Luck.jpg"){
    showPopup("УДАЧА +2000");
    player.money+=2000;
  }

  if(cellName==="Chance.jpg"){
    showPopup("ШАНС -1000");
    player.money=Math.max(0,player.money-1000);
  }

  if(cellName==="coin2000.jpg"){
    player.money+=2000;
  }

  if(cellName==="Skip.jpg"){
    showPopup("Пропуск хода");
    current=(current+1)%players.length;
  }

  if(cellName==="TM.jpg"){
    player.pos=8;
  }
}

function showPopup(text){
  const pop=document.getElementById("cardPopup");
  pop.innerHTML=text;
  pop.style.display="block";
  setTimeout(()=>pop.style.display="none",2000);
}

function updatePlayersInfo(){
  const div=document.getElementById("playersInfo");
  div.innerHTML="";
  players.forEach(p=>{
    div.innerHTML+=`<p style="color:${p.color}">
      ${p.name} : ${p.money} ₽
    </p>`;
  });
}
