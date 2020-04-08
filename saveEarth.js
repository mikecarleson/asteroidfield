var cvs = document.getElementById("canvas");
var ctx = cvs.getContext("2d");


cvs.width = window.innerWidth;
cvs.height = window.innerHeight;

// load images

var earth = new Image();
var bg = new Image();
var genAstroid = new Image();
var missile = new Image();
var bigMissile = new Image();

bg.width = window.innerWidth;
bg.height = window.innerHeight;
earth.src = "images/earth.png";
bg.src = "images/background.jpg";
genAstroid.src = "images/astroid.png";
missile.src = "images/missile.png";
bigMissile.src = "images/bigMissile.png";

// some variables

var eX = 100;
var eY = window.innerHeight / 2;
var missiles = [];
var missileCount = 3;
var score = 0;


var ammo = [];

ammo[0] = {
  x: cvs.width,
  y: Math.floor(Math.random() * cvs.height),
};

// audio files

var fly = new Audio();
var scor = new Audio();
var theme = new Audio();
var explode = new Audio();
var impact = new Audio();
var launch = new Audio();


fly.src = "sounds/fly.mp3";
scor.src = "sounds/score.mp3";
theme.src = "sounds/theme.mp3";
explode.src = "sounds/explode.wav";
impact.src = "sounds/impact.wav";
launch.src = "sounds/launch.wav";

// astroid coordinates

var astroid = [];

astroid[0] = {
  x: cvs.width,
  y: Math.floor(Math.random() * cvs.height),
};

document.addEventListener("keydown", function (e) {
  if (e.keyCode === 38) {
    moveUp();
  } else if (e.keyCode === 40) {
    moveDown();
  } else if (e.keyCode === 32 && missiles.length < 1 && missileCount > 0) {
    launch.play();
    missileCount--;
    missiles.push({
      x: eX + 40,
      y: eY + 35,
    });
    requestAnimationFrame(fireMissile);
  }
});


// on key down

function moveUp() {
  if (eY > 0) {
    eY -= 10;
    fly.play();
  }
}

function moveDown() {
  if (eY < cvs.height - 100) {
    eY += 10;
    fly.play();
  }
}

function fireMissile() {
    for (var m = 0; m < missiles.length; m++) {
      ctx.drawImage(missile, missiles[m].x, missiles[m].y);
      missiles[m].x += 10;
      requestAnimationFrame(fireMissile);
  
      if (missiles[m].x > 1000) {
        missiles.splice(missiles[m], 1);
      }
    }
}

function missileHit() {
  for (var i = 0; i < astroid.length; i++) {
    for (var m = 0; m < missiles.length; m++) {

      if (
        missiles[m].x + 40 > astroid[i].x &&
        missiles[m].x < astroid[i].x + 50 &&
        missiles[m].y + 15 > astroid[i].y &&
        missiles[m].y + 15 < astroid[i].y + 100
      ) {
        impact.play();
        astroid.splice(i, 1);
        missiles.splice(m, 1);
        console.log('hit');
        
      }
      }
  }
}

function gameStart() {
  var conf = confirm(
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

function draw() {
  ctx.drawImage(bg, 0, 0, window.innerWidth, window.innerHeight);
  theme.play();
  for (var i = 0; i < astroid.length; i++) {
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

  for (var a = 0; a < ammo.length; a++) {
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
}

draw();
