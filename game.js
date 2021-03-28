/*
  Code modified from:
  http://www.lostdecadegames.com/how-to-make-a-simple-html5-canvas-game/
  using graphics purchased from vectorstock.com
*/

/* Initialization.
Here, we create and add our "canvas" to the page.
We also load all of our images.
*/

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
canvas.width = 700;
canvas.height = 700;
document.getElementById("canvas").appendChild(canvas);

let background = {};

/**
 * Setting up our characters.
 *
 * Note that hero.x represents the X position of our hero.
 * hero.y represents the Y position.
 * We'll need these values to know the status where to "draw" the hero.
 * The same goes for the monsters
 *
 */

let hero = { x: canvas.width / 2, y: canvas.height / 2, size: 79 }; // hero position x,y

let monsters = [
  { x: 100, y: 100 }, //monster 1 position x,y
  { x: 200, y: 200 }, //monster 2 position x,y
  { x: 460, y: 460 }, //monster 3 position x,y
];
let startTime = Date.now(); // Record the starting time
let SECONDS_PER_ROUND = 5; // set limit of how long a round SHOULD run
let elapsedTime = 0; // keep track of how long game is run
let keysPressed = {}; //keep track of what key is pressing !!!!!

let score = 0;
let highcore=0;

let dx = 5;
let dy = -5;
let singleMonster1 = monsters[0];

//END of declaration

function inputname() {
  let yourname = document.getElementById("YourName").value; 
  let welcomeF = `Hello ${yourname}`;
  document.getElementById('display').innerHTML= welcomeF;
}
function hidetag() {
  document.getElementById("YourName").style.display = "none";
  document.getElementById("submit").style.display = "none";
}

function loadImages() {
  background.image = new Image(); //tellinng that we are preparing an image

  background.image.onload = function () {
    // show the background image
    background.ready = true; ///////// to change the check that image is now ready
  };

  background.image.src = "images/background2.png"; //the src of
  
  hero.image = new Image();
  hero.image.onload = function () {
    // show the hero image
    hero.ready = true;
  };
  hero.image.src = "images/hero.png";

  for (let index = 0; index < monsters.length; index++) {
    const monster = monsters[index];
    monster.image = new Image();
    monster.image.onload = function () {
      // show the monster image
      monster.ready = true;
    };
    monster.image.src = `images/monster${index + 1}.png`;
  }
}

/**
 * Keyboard Listeners
 * You can safely ignore this part, for now.
 *
 * This is just to let JavaScript know when the user has pressed a key.
 */

function setupKeyboardListeners() {
  // Check for keys pressed where key represents the keycode captured
  // For now, do not worry too much about what's happening here.
  document.addEventListener(
    "keydown",
    function (e) {
      keysPressed[e.key] = true;
    },
    false
  );

  document.addEventListener(
    "keyup",
    function (e) {
      keysPressed[e.key] = false;
    },
    false
  );
}

/**
 *  Update game objects - change player position based on key pressed
 *  and check to see if the monster has been caught!
 *
 *  If you change the value of 5, the player will move at a different rate.
 */
let update = function () {
  // Update the time.
  elapsedTime = Math.floor((Date.now() - startTime) / 1000);
  if (score > highcore) {
    highcore = score;
  }

  if (keysPressed["ArrowUp"]) {
    hero.y -= 5;
  }
  if (keysPressed["ArrowDown"]) {
    hero.y += 5;
  }
  if (keysPressed["ArrowLeft"]) {
    hero.x -= 5;
  }
  if (keysPressed["ArrowRight"]) {
    hero.x += 5;
  }
  //monster conllion
  for (let index = 0; index < monsters.length; index++) {
    let singleMonster = monsters[index];
    if (
      hero.x <= singleMonster.x + hero.size &&
      singleMonster.x <= hero.x + hero.size &&
      hero.y <= singleMonster.y + hero.size &&
      singleMonster.y <= hero.y + hero.size
    ) {
      // Pick a new location for the singleMonster.
      // Note: Change this to place the singleMonster at a new, random location.
      score += 1;
      singleMonster.x = 79 + Math.floor(Math.random() * (canvas.width-158)) ;
      singleMonster.y = 79 + Math.floor(Math.random() * (canvas.height-158)) ;
    }
  }

  //top and bottom collision detection //left and right collision detection
  if (hero.y > canvas.height - hero.size) {
    hero.y = 0;
  } else if (hero.y < 0) {
    hero.y = canvas.height - hero.size;
  }
  if (hero.x > canvas.width - hero.size) {
    hero.x = 0;
  } else if (hero.x < 0) {
    hero.x = canvas.width - hero.size;
  } 
  document.getElementById("highscore").innerHTML = ` highscore: ${highcore}`
  document.getElementById("score").innerHTML = ` score: ${score}`;
}

/**
 * This function, render, runs as often as possible.
 */
// function rendermonster() {
//   monsters.forEach((monster) => {
//     if (monster.ready) {
//       ctx.drawImage(monster.image, monster.x, monster.y);
//     }
//   });
// }

function render() {
  if (background.ready) {
    ctx.drawImage(background.image, 0, 0);
  }
  if (hero.ready) {
    ctx.drawImage(hero.image, hero.x, hero.y);
  }
  monsters.forEach((monster) => {
    if (monster.ready) {
      ctx.drawImage(monster.image, monster.x, monster.y);
    }
  });
  for (let index = 0; index < monsters.length; index++) {
    let singleMonster = monsters[index];
    if(singleMonster.x + dx > canvas.width - 79|| singleMonster.x + dx < 0) {
      dx = -dx;
    }
    if(singleMonster.y + dy > canvas.height- 79 || singleMonster.y + dy < 0) {
      dy = -dy;
    }
  }
  
  

  // let singleMonster2 = monsters[1];
  singleMonster1.x+=dx;
  singleMonster1.y+=dy;
  // singleMonster2.x+=dx1;
  // singleMonster2.y+=dy2;
  
  ctx.font = "15px Helvetica";
  ctx.fillStyle = "rgb(250, 250, 250)";
  ctx.fillText(`Seconds Remaining: ${SECONDS_PER_ROUND}`,20,20 );
  ctx.fillText("Monsters caught: " + score, 550, 20);
  if(finished==true){
    ctx.fillText("Game over!", 350, 650);}
      
}



//
let finished = false;
function counter(){
  SECONDS_PER_ROUND = SECONDS_PER_ROUND -1;
    if (SECONDS_PER_ROUND  <= 0) {
       clearInterval(counter);
       finished = true;
       SECONDS_PER_ROUND=0;
       document.addEventListener("keydown",function (e) {keysPressed[e.key] = false;},false);
       singleMonster1.x= 100;
       singleMonster1.y= 100;
       dx = 0;
       dy = 0;
       
    }
}



/**
 * The main game loop. Most every game will have two distinct parts:
 * update (updates the state of the game, in this case our hero and monster)
 * render (based on the state of our game, draw the right things)
 */
function main() {
  update();
  render();

  // Request to do this again ASAP. This is a special method
  // for web browsers.
  requestAnimationFrame(main); // keep the browser update IF THERE IS ANIMATION
}

// Cross-browser support for requestAnimationFrame.
// Safely ignore this line. It's mostly here for people with old web browsers.
// enable the function (to keep the browser update IF THERE IS ANIMATION)
var w = window;
requestAnimationFrame =
  w.requestAnimationFrame ||
  w.webkitRequestAnimationFrame ||
  w.msRequestAnimationFrame ||
  w.mozRequestAnimationFrame;

// Let's play this game!
document.getElementById('resetgame').addEventListener('click',function () {
  SECONDS_PER_ROUND=15;
  dx = 5;
  dy = -5;
  document.addEventListener("keydown",function (e) {keysPressed[e.key] = true;},false);
  finished = false;
  score = 0;
})

// document.getElementById('startgame').addEventListener('click', function(){
//   setInterval(counter, 1000);
// })
document.getElementById('submit').addEventListener('click',function () {
setInterval(counter, 1000);
hidetag()
inputname()
loadImages();
setupKeyboardListeners();
main();
})
