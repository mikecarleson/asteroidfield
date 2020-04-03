var cvs = document.getElementById("canvas");
var ctx = cvs.getContext("2d");

cvs.width = window.innerWidth;
cvs.height = window.innerHeight;

// load images

var earth = new Image();
var bg = new Image();
var genAstroid = new Image();

bg.width = window.innerWidth;
bg.height = window.innerHeight;
earth.src = "images/earth.png";
bg.src = "images/background.jpg";
genAstroid.src = "images/astroid.png";

// some variables

var eX = 100;
var eY = 150;

var score = 0;

// audio files

var fly = new Audio();
var scor = new Audio();
var theme = new Audio();
var explode = new Audio();



fly.src = "sounds/fly.mp3";
scor.src = "sounds/score.mp3";
theme.src = "sounds/theme.mp3";
explode.src = "sounds/explode.wav";

// astroid coordinates

var astroid = [];

astroid[0] = {
  x: cvs.width,
  y: Math.floor(Math.random() * cvs.height) 
};


// on key down

function moveUp() {
  if(eY > 0){
    eY -= 10;
    fly.play();
  }
  
}

function moveDown() {
  if(eY < cvs.height - 100){
    eY += 10;
    fly.play();
  }
}

// function moveLeft() {
//   if(eX > 0){
//     eX -= 10;
//     fly.play();
//   }
  
// }

// function moveRight() {
//   if(eX < cvs.width){
//     eX += 10;
//     fly.play();
//   }
  
// }

function gameStart() {
  var conf = confirm("THE EARTH HAS BEEN DESTROYED! Let's hope you have a Planet B! Your score is: " + score + " Play Again?");
        if (conf == true) {
          location.reload();
        } else if (conf == false) {
          close();
        }
}

document.addEventListener("keydown", function(e) {
  if (e.keyCode === 38) {
    moveUp();
  } else if (e.keyCode === 40) {
    moveDown();
  } 
  // else if (e.keyCode === 37) {
  //   moveLeft();
  // } else if (e.keyCode === 39) {
  //   moveRight();
  // }
});



// draw images

function draw() {
  ctx.drawImage(bg, 0, 0, window.innerWidth, window.innerHeight);
  theme.play();


  for (var i = 0; i < astroid.length; i++) {
    ctx.drawImage(genAstroid, astroid[i].x, astroid[i].y);

    astroid[i].x-=2;

    if (astroid[i].x == cvs.width - 100) {
      astroid.push({
        x: cvs.width,
        y: Math.floor(Math.random() * cvs.height)
      });
    }

    // detect collision

    if (
      (eX + 40 > astroid[i].x - 40 && eX - 40 < astroid[i].x + 40) && (eY + 30 > astroid[i].y - 30 && eY - 30 < astroid[i].y + 30 )) {

        explode.play();
        gameStart();
        astroid[i].x-=10;
        astroid[i].delete();


    }

    if (astroid[i].x == 6) {
      score++;
      scor.play();
    }

  }

  ctx.drawImage(earth, eX, eY);

  ctx.fillStyle = "#fff";
  ctx.font = "20px Verdana";
  ctx.fillText("Score : " + score, 10, cvs.height - 20);


  requestAnimationFrame(draw);
}

draw();

