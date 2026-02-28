let players = [];
let currentPlayer = 0;
const maxPlayers = 4;
const startMoney = 30000;
const winMoney = 200000;

const colors = ["red","blue","lime","yellow"];

const boardData = [
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
  if(players.length >= maxPlayers){
    alert("Максимум 4 игрока");
    return;
  }

  players.push({
    name: "Игрок " + (players.length + 1),
    money: startMoney,
    position: 0,
    color: colors[players.length]
  });

  renderLobby();
}

function renderLobby(){
  const div = document.getElementById("playersList");
  div.innerHTML = "";
  players.forEach(p=>{
    div.innerHTML += `<p style="color:${p.color}">${p.name}</p>`;
  });
}

function startGame(){
  if(players.length < 2){
    alert("Минимум 2 игрока");
    return;
  }

  document.getElementById("lobby").style.display = "none";
  document.getElementById("game").style.display = "block";

  renderBoard();
  updatePlayersInfo();
}

function renderBoard(){
  const board = document.getElementById("board");
  board.innerHTML = "";

  const size = 9;
  const cells = new Array(81).fill(null);
  let i = 0;

  // верх
  for(let col=0; col<9; col++){
    cells[col] = boardData[i++];
  }

  // право
  for(let row=1; row<9; row++){
    cells[row*9 + 8] = boardData[i++];
  }

  // низ
  for(let col=7; col>=0; col--){
    cells[72 + col] = boardData[i++];
  }

  // лево
  for(let row=7; row>0; row--){
    cells[row*9] = boardData[i++];
  }

  for(let n=0; n<81; n++){
    const div = document.createElement("div");

    if(n === 10){
      div.id = "center";
      board.appendChild(div);
      continue;
    }

    div.className = "cell";

    if(cells[n]){
      div.innerHTML = `<img src="${cells[n]}">`;
    }

    board.appendChild(div);
  }

  renderTokens();
}

function renderTokens(){
  const cells = document.querySelectorAll(".cell");
  players.forEach(p=>{
    const token = document.createElement("div");
    token.className = "playerToken";
    token.style.background = p.color;
    cells[p.position].appendChild(token);
  });
}

function rollDice(){
  const dice = document.getElementById("dice");
  dice.classList.add("roll");

  const roll = Math.floor(Math.random()*6)+1;

  setTimeout(()=>{
    dice.classList.remove("roll");

    const player = players[currentPlayer];
    player.position += roll;

    if(player.position >= 31){
      player.position -= 31;
      player.money += 2000;
    }

    handleCell(player);

    if(player.money >= winMoney){
      alert(player.name + " победил!");
      location.reload();
    }

    currentPlayer = (currentPlayer + 1) % players.length;

    renderBoard();
    updatePlayersInfo();

  },600);
}

function handleCell(player){
  const cell = boardData[player.position];

  if(cell === "Luck.jpg"){
    showPopup("УДАЧА +2000 ₽");
    player.money += 2000;
  }

  if(cell === "Chance.jpg"){
    showPopup("ШАНС -1000 ₽");
    player.money = Math.max(0, player.money - 1000);
  }

  if(cell === "coin2000.jpg"){
    showPopup("+2000 ₽");
    player.money += 2000;
  }

  if(cell === "Skip.jpg"){
    showPopup("Пропуск хода");
    currentPlayer = (currentPlayer + 1) % players.length;
  }

  if(cell === "TM.jpg"){
    showPopup("Тюрьма → возврат на старт");
    player.position = 0;
  }
}

function showPopup(text){
  const popup = document.getElementById("popup");
  popup.innerHTML = text;
  popup.style.display = "block";
  setTimeout(()=>{
    popup.style.display = "none";
  },2000);
}

function updatePlayersInfo(){
  const div = document.getElementById("playersInfo");
  div.innerHTML = "";
  players.forEach(p=>{
    div.innerHTML += `<p style="color:${p.color}">
      ${p.name}: ${p.money} ₽
    </p>`;
  });
}
