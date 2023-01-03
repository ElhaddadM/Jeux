// dak lfri3 nta3 ila 5sr ola rb7 itl3 xi 7aja
let start = document.querySelector("#start");
let btnRegle = document.querySelector("#btnRegle");
let regles = document.querySelector("#regles");
let btnCloseRegle = document.querySelector("#btnCloseRegle");
let Rejouer = document.querySelector("#Rejouer");
let Guest = document.querySelector("#Guest");
let login = document.querySelector("#login");
let acount = document.querySelector("#acount");
let createAcount = document.querySelector("#createAcount");
let sing_in = document.querySelector("#sing_in");
let login_form = document.querySelector("#login_form");
let back = document.querySelector("#back");
let back2 = document.querySelector("#back2");

// ADD User

let userName = document.querySelector("#userName");
let password = document.querySelector("#password");
let btnAdd = document.querySelector("#btnAdd");

// Varibales Login 

let btnLogin = document.querySelector("#btnLogin");
let user_name = document.querySelector("#user_name");
let user_pass = document.querySelector("#user_pass");





start.addEventListener("click", () => {
    
  start.style.display = "none";
});

// Canvas
const img = document.getElementById("img");
// let gameOver = document.querySelector('#gameOver')
const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");
//   ctx.lineWidth = 2

function load() {
  let container = document.querySelector("#container");
  container?.classList.add("d-none");
  console.log("load");
  canvas.style.backgroundColor = "whitesmoke";
  canvas?.classList.add("d-none");
}

// Declare les constantes pour la planche

const planche_Width = 100;
const planche_Height = 10;
const planche_Margin_Bas = 20;
const ball_radius = 5;

// Propriétés  de La planche

const planche = {
  x: canvas.width / 2 - planche_Width / 2,
  y: canvas.height - planche_Margin_Bas - planche_Height,
  w: planche_Width,
  h: planche_Height,
  dx: 8,
};

// Varibale de controle
let user = sessionStorage.getItem('user')



let ArrowRight = false;
let ArrowLeft = false;
let vie = 3;
let Score = 0;
let level = parseInt( sessionStorage.getItem('level') );
let isWin = false;
let Pause = false;


// SessionStorage

// 
// canvas.style.opacity = '.9'

// Dessiner La placnhe

function DessinePlanche() {
  ctx.beginPath();
  ctx.fillStyle = "red";
  ctx.fillRect(planche.x, planche.y, planche.w, planche.h);
  ctx.strokeStyle = "red";
  ctx.strokeRect(planche.x, planche.y, planche.w, planche.h);
  ctx.closePath();
}

// Animer La planche

function movePlanche() {
  if (ArrowRight && planche.x + planche.w < canvas.width)
    planche.x += planche.dx;
  if (ArrowLeft && planche.x > 0) planche.x -= planche.dx;
}

// Propriétés de ballon

let ball = {
  x: canvas.width / 2,
  y: planche.y - ball_radius,
  radius: ball_radius,
  vitesse: 4,
  dx: 3 * (Math.random() * 2 - 1),
  dy: -3,
};

//Dessiner La ball

function DessinBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = "blue";
  ctx.fill();
  ctx.strokeStyle = "blue";
  ctx.stroke();
  ctx.closePath();
}

function resetPlanche() {
  planche.x = canvas.width / 2 - planche_Width / 2;
  planche.y = canvas.height - planche_Margin_Bas - planche_Height;
}
// Animer La ball

function moveBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;
}

// Interaction de ball avec Les murs

function bmCollision() {
  // collision sur les Axe  de X
  if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
    ball.dx *= -1;
  }

  // collision sur L'axe Superieure
  if (ball.y - ball.radius < 0) {
    ball.dy *= -1;
  }
  // collision sur axe bas qui entraine de pert
  if (ball.y + ball.radius > canvas.height) {
    // Decrement lif vie
    vie -= 1;
    resetBall();
    resetPlanche();
  }
}

// Interaction de balle avec la planche

function bpcollision() {
  if (
    ball.x + ball.radius > planche.x &&
    ball.x - ball.radius < planche.x + planche.w &&
    ball.y + ball.radius > planche.y
  ) {
    let collidePoint = ball.x - (planche.x + planche.w / 2);
    collidePoint = collidePoint / (planche.w / 2);
    let angle = (collidePoint * Math.PI) / 3;
    ball.dx = ball.vitesse * Math.sin(angle);
    ball.dy = -ball.vitesse * Math.cos(angle);
  }
}

function resetBall() {
  ball.x = canvas.width / 2;
  ball.y = planche.y - ball_radius;
  ball.dx = 3 * (Math.random() * 2 - 1);
  ball.dy = -3;
}

// Les propriétére de brick

let brickProps = {
  row: level + 1,
  column: 13,
  w: 35,
  h: 10,
  padding: 3,
  offsetX: 5,
  offsetY: 50,
  fillColor: "green",
  visible: true,
};

// Creation de toutes les bricks

let bricks = [];

function createBricks() {
  for (let i = 0; i < brickProps.row; i++) {
    bricks[i] = [];
    for (let j = 0; j < brickProps.column; j++) {
      bricks[i][j] = {
        x: j * (brickProps.w + brickProps.padding) + brickProps.offsetX,
        y: i * (brickProps.h + brickProps.padding) + brickProps.offsetY,
        status: true,
        ...brickProps,
      };
    }
  }
}

createBricks();

// Dessiner Les bricks

function DessineBricks() {
  bricks.forEach((column) => {
    column.forEach((brick) => {
      if (brick.status) {
        ctx.beginPath();
        ctx.rect(brick.x, brick.y, brick.w, brick.h);
        ctx.fillStyle = brick.fillColor;
        ctx.fill();
        ctx.closePath();
      }
    });
  });
}

// collision entre balle et bricks

function bcCollision() {
  bricks.forEach((column) => {
    column.forEach((brick) => {
      if (brick.status) {
        if (
          ball.x + ball.radius > brick.x &&
          ball.x - ball.radius < brick.x + brick.w &&
          ball.y + ball.radius > brick.y &&
          ball.y - ball.radius < brick.y + brick.h
        ) {
          ball.dy *= -1;
          brick.status = false;
          // increment Score ici
          Score += 10;
        }
      }
    });
  });
}

// Show Status

function AfficheStatus(vie, score, level) {
let img1 =document.querySelector('#vie1')
let img2 =document.querySelector('#vie2')
let img3 =document.querySelector('#vie3')


  ctx.fillStyle = "green";
  ctx.font = "20px arial";
  // Status Vie
  ctx.drawImage(img1, 10, 15, 20, 20);
  ctx.fillText(vie, 40, 30);
  // Status Score
  ctx.drawImage(img2, 100, 15, 20, 20);
  ctx.fillText(score, 130, 30);
  ctx.drawImage(img3, canvas.width / 2 - 30, 15, 20, 20);
  ctx.fillText(user, canvas.width / 2, 30);
  // ctx.fillText('level',canvas.width -100,30)
  ctx.drawImage(img, canvas.width - 80, 15, 20, 20);
  ctx.font = "25px arial";
  ctx.fillText(level, canvas.width - 50, 32);
}

// Next level

function IncrementLevel() {
  let levelUp = true;
  for (let i = 0; i < brickProps.row; i++) {
    for (let j = 0; j < brickProps.column; j++) {
      levelUp = levelUp && !bricks[i][j].status;
    }
  }
  if (levelUp) {
    level++;
    brickProps.row += 2;
    // sessionStorage.setItem('level')
    ball.vitesse += 1.5;
    createBricks();
    resetBall();
    resetPlanche();
  }
}

function Dessine() {
  DessinePlanche();
  DessinBall();
  DessineBricks();
}
function Update() {
  movePlanche();
  moveBall();
  bmCollision();
  bpcollision();
  bcCollision();
  IncrementLevel();
  
//   ctx.clearRect(0, 0, canvas.width, canvas.height, true);
  if (user !=null) AfficheStatus(vie, Score, level,user); 
}

function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height, true);
  Dessine();
  Update();
  if (vie > 0 && !Pause ) {
    requestAnimationFrame(loop);
  } else if (!Pause) {
    gameOver.style.display = "block";
    Rejouer.style.display = "block";
    canvas.style.backgroundColor = "black";
    canvas.style.opacity = ".8";
    AddStatus()
  }
}
loop();

document.addEventListener("keydown", (e) => {
  console.log(e.key);

  if (e.key == "Right" || e.key == "ArrowRight") {
    ArrowRight = true;
  }
  if (e.key == "Left" || e.key == "ArrowLeft") {
    ArrowLeft = true;
  }
});

document.addEventListener("keyup", (e) => {
  if (e.key == "Right" || e.key == "ArrowRight") {
    ArrowRight = false;
  }
  if (e.key == "Left" || e.key == "ArrowLeft") {
    ArrowLeft = false;
  }
});

// Guest.addEventListener("click", () => {
//   login.style.display = "none";
//   Rejouer.style.display = "block";
// });

if (user === null){
        // canvas.style.opacity = '0'
        ctx.clearRect(0, 0, canvas.width, canvas.height, true);
        login.classList.remove('d-none')
        login.classList.add('d-block')
        Pause = true;
    } 

btnRegle.addEventListener("click", () => {
  regles.style.display = "block";
  Pause = true;
});
btnCloseRegle.addEventListener("click", () => {
  regles.style.display = "none";
  Pause = false;
  loop();
});
Rejouer.addEventListener("click", () => {
  window.location.reload();
});

acount.addEventListener("click", () => {
  console.log("clicked");
  ctx.clearRect(0, 0, canvas.width, canvas.height, true);

  createAcount?.classList.remove("d-none");

  createAcount?.classList.add("d-block");
  login.setAttribute("class", "d-none");
});

sing_in?.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height, true);

    login_form?.classList.remove('d-none')
    login_form?.classList.add('d-block')
});

Guest.addEventListener('click',()=>{
    console.log('clcik'); 
    let a = Math.floor(Math.random() * 1000)
    sessionStorage.setItem('user','Guset' + a.toString() )
    sessionStorage.setItem('level', '1' )





























    console.log('Random number => ' , 'Guset' + a.toString() );
    window.location.reload()
})

// back1.addEventListener('click',()=>{
//   console.log('ook');
  
// })
// let a = Math.floor(Math.random() * 1000)
// console.log('Random number => ' , 'Guset' + a.toString() );

btnAdd?.addEventListener('click',()=>{
  fetch('http://localhost/Game_API/Add_user.php', {
    method: 'POST',
    body: JSON.stringify({ email: email.value, user : userName.value , password :password.value })
}
).then(response => response.json()).then(data => {
  console.log('hna',data.mesg);
 })

})

//LoginFunction

btnLogin.addEventListener('click',()=>{
  
  fetch('http://localhost/Game_API/Verify_user.php', {
    method: 'POST',
    body: JSON.stringify({user : user_name.value , password1 : user_pass.value})
}
).then(response => response.json()).then(data => {
  const USER = data[0].length > 0 ? data[0][0].User : false
  console.log('hna',data[0] );
  console.log('hna',USER );
  if ( USER != false) {
    level = data[0][0].level
    sessionStorage.setItem('user', USER )
    sessionStorage.setItem('level', level )
    sessionStorage.setItem('id', data[0][0].idAccount )

    window.location.reload()
  }

 
 })

})

function AddStatus(){
  console.log('close',level,Score,sessionStorage.getItem('id'));
  fetch('http://localhost/Game_API/Add_Score.php', {
    method: 'POST',
    body: JSON.stringify({ID : sessionStorage.getItem('id') , LEVEL : level ,SCORE :Score })
}
).then(response => response.json()).then(data => {
  console.log(data);
  
})
  
} 