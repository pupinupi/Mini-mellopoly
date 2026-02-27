let players=[];
let current=0;

const cellImages=[
"Start.jpg","Minecraft.jpg","Dota2.jpg","CSGO.jpg","Luck.jpg",
"Moscow.jpg","Chance.jpg","Mellberries.jpg","TM.jpg",
"Mellbeer.jpg","Mellburger.jpg","Gomel.jpg","Luck.jpg",
"M-Taxi.jpg","M-Sharing.jpg","coin2000.jpg",
"Skip.jpg","YouTube.jpg","Kick.jpg","Luck.jpg",
"Kipr.jpg","Chance.jpg","ShaurMell.jpg","TM.jpg",
"AmAmAm.jpg","Luck.jpg","Chance.jpg","Mellbank.jpg",
"Mellcoin.jpg","MellstroyGame.jpg","Skip.jpg"
];

function startGame(){
  const count=parseInt(document.getElementById("playerCount").value);

  const colors=["red","blue","lime","yellow"];

  players=[];
  for(let i=0;i<count;i++){
    players.push({
      name:"Игрок "+(i+1),
      money:30000,
      position:0,
      color:colors[i]
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

      // центр
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

      if(cellImages[index]){
        cell.innerHTML=`<img src="${cellImages[index]}">`;
      }

      // фишки игроков
      players.forEach(p=>{
        if(p.position===index){
          const token=document.createElement("div");
          token.className="token";
          token.style.background=p.color;
          cell.appendChild(token);
        }
      });

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

  if(player.position>=cellImages.length){
    player.position=0;
    player.money+=5000;
  }

  current=(current+1)%players.length;

  renderBoard();
  updateInfo();
}

function updateInfo(){
  const p=players[current];
  document.getElementById("info").innerText=
  p.name+" | Деньги: "+p.money;
}
