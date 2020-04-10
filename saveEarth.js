let cvs = document.getElementById("canvas");
let ctx = cvs.getContext("2d");


cvs.width = window.innerWidth;
cvs.height = window.innerHeight;

// load images

let earth = new Image();
let bg = new Image();
let genAstroid = new Image();
let missile = new Image();
let bigMissile = new Image();
let exploding = new Image();

bg.width = window.innerWidth;
bg.height = window.innerHeight;
earth.src = "images/earth.png";
bg.src = "images/background.jpg";
genAstroid.src = "images/astroid.png";
missile.src = "images/missile.png";
bigMissile.src = "images/bigMissile.png";
exploding.src = "images/explodingEarth.jpg";

// some letiables

let eX = 100;
let eY = window.innerHeight / 2;
let missiles = [];
let missileCount = 3;
let score = 0;


let ammo = [];

ammo[0] = {
  x: cvs.width,
  y: Math.floor(Math.random() * cvs.height),
};

// audio files

let fly = new Audio();
let scor = new Audio();
let theme = new Audio();
let explode = new Audio();
let impact = new Audio();
let launch = new Audio();


fly.src = "sounds/fly.mp3";
scor.src = "sounds/score.mp3";
theme.src = "sounds/theme.mp3";
explode.src = "sounds/explode.wav";
impact.src = "sounds/impact.wav";
launch.src = "sounds/launch.wav";

// astroid coordinates

let astroid = [];

astroid[0] = {
  x: cvs.width,
  y: Math.floor(Math.random() * cvs.height),
};

document.addEventListener("keydown", function (e) {
 
    if (e.keyCode === 32 && missiles.length < 1 && missileCount > 0) {
    launch.play();
    missileCount--;
    missiles.push({
      x: eX + 40,
      y: eY + 35,
    });
    requestAnimationFrame(fireMissile);
  }
});

var UP = false; 
var DOWN = false;

function move() {
	
	if(UP && eY > 0) { 
		eY -= 5;
	}
	if(DOWN && eY < cvs.height - 100) {
		eY += 5;	
	}
	
}

document.onkeydown = function(e) {
	if(e.keyCode == 38) UP = true;
	if(e.keyCode == 40) DOWN = true;
}

document.onkeyup = function(e) {
	if(e.keyCode == 38) UP = false;
	if(e.keyCode == 40) DOWN = false;
}


function fireMissile() {
    for (let m = 0; m < missiles.length; m++) {
      ctx.drawImage(missile, missiles[m].x, missiles[m].y);
      missiles[m].x += 10;
      requestAnimationFrame(fireMissile);
  
      if (missiles[m].x > 1000) {
        missiles.splice(missiles[m], 1);
      }
    }
}

function missileHit() {
  for (let i = 0; i < astroid.length; i++) {
    for (let m = 0; m < missiles.length; m++) {

      if (
        missiles[m].x + 40 > astroid[i].x &&
        missiles[m].x < astroid[i].x + 50 &&
        missiles[m].y + 15 > astroid[i].y &&
        missiles[m].y + 15 < astroid[i].y + 100
      ) {
        impact.play();
        astroid.splice(i, 1);
        missiles.splice(m, 1);
        
      }
      }
  }
}

function gameStart() {
  let conf = confirm(
    "THE EARTH HAS BEEN DESTROYED! Let's hope you have a Planet B! Your score is: " +
      score +
      " Play Again?"
  );
  if (conf == true) {
    location.reload();
  } else if (conf == false) {
    close();
  }
}


// draw images

// function startPage(){
//   ctx.drawImage(bg, 0, 0, window.innerWidth, window.innerHeight);
//   theme.play();
//   requestAnimationFrame(startPage);
//   document.addEventListener("keydown", function (e) {
//   if (e.keyCode === 83) {
//     ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
//     draw();
    

//   }
// });
// }



function draw() {
  ctx.drawImage(bg, 0, 0, window.innerWidth, window.innerHeight);
  theme.play();
  for (let i = 0; i < astroid.length; i++) {
    ctx.drawImage(genAstroid, astroid[i].x, astroid[i].y);

    astroid[i].x -= 4;

    if (astroid[i].x == cvs.width - 100) {
      astroid.push({
        x: cvs.width,
        y: Math.floor(Math.random() * cvs.height),
      });
    }

    // detect collision

    if (
      eX + 40 > astroid[i].x - 40 &&
      eX - 40 < astroid[i].x + 40 &&
      eY + 30 > astroid[i].y - 30 &&
      eY - 30 < astroid[i].y + 30
    ) {
      explode.play();
      astroid = 0;
      gameStart();
    }

    if (astroid[i].x == 0) {
      score++;
      scor.play();
    }
  }

  for (let a = 0; a < ammo.length; a++) {
    ctx.drawImage(bigMissile, ammo[a].x, ammo[a].y);
    ammo[a].x -= 2;

    if (ammo[a].x == 150) {
      ammo.push({
        x: cvs.width,
        y: Math.floor(Math.random() * 500),
      });
    }

    // detect collision

    if (
      eX > ammo[a].x - 40 &&
      eY + 30 > ammo[a].y - 30 &&
      eY - 30 < ammo[a].y + 30
    ) {
        if (missileCount < 3) {
          ammo.splice(a, 1);
          missileCount = 3;

        }
      
    }

  }

  ctx.drawImage(earth, eX, eY);

  ctx.fillStyle = "#fff";
  ctx.font = "20px Verdana";
  ctx.fillText("Score : " + score, 10, cvs.height - 20);
  ctx.fillText("Missiles : " + missileCount, 300, cvs.height - 20);

  requestAnimationFrame(draw);
  missileHit();
  move();
}
// startPage();
draw();
