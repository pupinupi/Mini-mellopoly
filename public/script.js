const players = [
  {name:"Игрок 1", money:30000, position:0},
  {name:"Игрок 2", money:30000, position:0},
  {name:"Игрок 3", money:30000, position:0},
  {name:"Игрок 4", money:30000, position:0}
];

let current = 0;

const boardData = [
  // ВЕРХ (слева направо)
  {name:"Старт", type:"start", img:"/Start.jpg"},
  {name:"Minecraft", price:1500, img:"/Minecraft.jpg"},
  {name:"Dota 2", price:2000, img:"/Dota2.jpg"},
  {name:"CS GO", price:2500, img:"/CSGO.jpg"},
  {name:"Удача", type:"luck", img:"/Luck.jpg"},
  {name:"Москва", price:6000, img:"/Moscow.jpg"},
  {name:"Шанс", type:"chance", img:"/Chance.jpg"},
  {name:"Mellberries", price:4000, img:"/Mellberries.jpg"},
  {name:"Тюрьма", type:"jail", img:"/TM.jpg"},

  // ПРАВО (сверху вниз)
  {name:"Mellbeer", price:4500, img:"/Mellbeer.jpg"},
  {name:"Mellburger", price:5000, img:"/Mellburger.jpg"},
  {name:"Гомель", price:6000, img:"/Gomel.jpg"},
  {name:"Удача", type:"luck", img:"/Luck.jpg"},
  {name:"M-Taxi", price:5500, img:"/M-Taxi.jpg"},
  {name:"M-Sharing", price:6000, img:"/M-Sharing.jpg"},
  {name:"+2000", type:"bonus", img:"/coin2000.jpg"},

  // НИЗ (справа налево)
  {name:"Пропуск хода", type:"skip", img:"/Skip.jpg"},
  {name:"YouTube", price:10000, img:"/YouTube.jpg"},
  {name:"Kick", price:15000, img:"/Kick.jpg"},
  {name:"Удача", type:"luck", img:"/Luck.jpg"},
  {name:"Кипр", price:6000, img:"/Kipr.jpg"},
  {name:"Шанс", type:"chance", img:"/Chance.jpg"},
  {name:"Shaur-Mell", price:20000, img:"/ShaurMell.jpg"},
  {name:"Тюрьма", type:"jail", img:"/TM.jpg"},

  // ЛЕВО (снизу вверх)
  {name:"Am-Am-Am", price:25000, img:"/AmAmAm.jpg"},
  {name:"Удача", type:"luck", img:"/Luck.jpg"},
  {name:"Шанс", type:"chance", img:"/Chance.jpg"},
  {name:"Mellbank", price:30000, img:"/Mellbank.jpg"},
  {name:"Mellcoin", price:35000, img:"/Mellcoin.jpg"},
  {name:"Mellstroy game", price:40000, img:"/MellstroyGame.jpg"},
  {name:"Вернуться к старту", type:"start", img:"/Start.jpg"}
];

function renderBoard(){
  const board = document.getElementById("board");
  board.innerHTML = "";

  const size = 9;
  board.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
  board.style.gridTemplateRows = `repeat(${size}, 95px)`;

  let cellIndex = 0;

  for(let row = 0; row < size; row++){
    for(let col = 0; col < size; col++){

      // Центр 7x7
      if(row >=1 && row <=7 && col >=1 && col <=7){
        if(row ===1 && col ===1){
          const center = document.createElement("div");
          center.style.gridColumn = "2 / span 7";
          center.style.gridRow = "2 / span 7";
          center.style.borderRadius = "15px";
          center.style.overflow = "hidden";
          center.innerHTML = `<img src="/IMG_8954.jpeg" 
              style="width:100%;height:100%;object-fit:cover;">`;
          board.appendChild(center);
        }
        continue;
      }

      const cell = document.createElement("div");
      cell.className = "cell";

      const data = boardData[cellIndex];

      if(data){
        cell.innerHTML = `
          <strong>${data.name}</strong>
          ${data.img ? `<img src="${data.img}">` : ""}
        `;
      }

      board.appendChild(cell);
      cellIndex++;
    }
  }
}

function updateUI(){
  document.getElementById("currentPlayer").innerText = players[current].name;
  document.getElementById("money").innerText = players[current].money;
}

updateUI();
renderBoard();
