let players=[];
let current=0;

const boardData=[
"Старт","Minecraft 1500","Dota 2 2000","CS GO 2500","Удача","Москва 6000","Шанс","Mellberries 4000","Тюрьма",
"Mellbeer 4500","Mellburger 5000","Гомель 6000","Удача","М-такси 5500","М-шеринг 6000","+2000",
"Пропуск хода","YouTube 10000","Kick 15000","Удача","Кипр 6000","Шанс","Shaur-Mell 20000","Тюрьма",
"Am-Am-Am 25000","Удача","Шанс","Mellbank 30000","Mellcoin 35000","Mellstroy game 40000","Вернуться"
];

function startGame(){
  const count=parseInt(document.getElementById("playerCount").value);
  players=[];
  for(let i=0;i<count;i++){
    players.push({
      name:"Игрок "+(i+1),
      money:30000,
      position:0
    });
  }

  document.getElementById("lobby").classList.add("hidden");
  document.getElementById("game").classList.remove("hidden");

  renderBoard();
  updateInfo();
}

function renderBoard(){
  const board=document.getElementById("board");
  board.innerHTML="";
  let index=0;

  for(let r=0;r<9;r++){
    for(let c=0;c<9;c++){

      if(r>=1 && r<=7 && c>=1 && c<=7){
        if(r===1 && c===1){
          const center=document.createElement("div");
          center.className="center";
          center.innerHTML=`<img src="center.jpg">`;
          board.appendChild(center);
        }
        continue;
      }

      const cell=document.createElement("div");
      cell.className="cell";
      cell.innerText=boardData[index]||"";
      board.appendChild(cell);
      index++;
    }
  }
}

function rollDice(){
  const roll=Math.floor(Math.random()*6)+1;
  document.getElementById("dice").innerText=roll;

  const player=players[current];
  player.position+=roll;

  if(player.position>=boardData.length){
    player.position=0;
    player.money+=5000;
  }

  current=(current+1)%players.length;
  updateInfo();
}

function updateInfo(){
  const p=players[current];
  document.getElementById("info").innerText=
  p.name+" | Деньги: "+p.money;
}
