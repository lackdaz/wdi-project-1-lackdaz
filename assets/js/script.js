/***************
 Setting up the structure of the game and variables, CAPS for static variables
 ***************/
/**
 * Initialize a new Game instance and starts it.
 */
var game = new Game();

function init() {
  if (game.init()) // game constructor init method

    $("#main-message").hide();
  game.start();
}

/***************************************************
 * Creates the Game Variables
 ***************************************************/
var para = {
	debugger: 0,
  gameState: 0,
  obstacleType:
  ['garbage',
  'drone',
  'bigbus'],
  pool: [],
  speedMultiplier: 0.01,
  score: 0,
  hscore: 0
}

/**
 * Define an object to hold all our images for the game so images
 * are only ever created once. This type of object is known as a
 * singleton.
 */
var imageRepository = new function() {
  // Define images

  this.background = new Image()
  this.runner = new Image()
  this.drone = new Image()
	this.burrow = new Image()
  this.garbage = new Image()
  this.bigbus = new Image()

  // 	this.bullet = new Image()

  // Ensure all images have loaded before starting the game
  var numImages = 4;
  var numLoaded = 0;

  function imageLoaded() {
    numLoaded++;
    if (numLoaded === numImages) {
      window.init()
      console.log("images loaded!")
    }
  }
  this.background.onload = function() {
    imageLoaded()
  }
  this.runner.onload = function() {
    imageLoaded()
  }
  this.drone.onload = function() {
    imageLoaded()
	}
	this.burrow.onload = function() {
		imageLoaded()
  }
  this.garbage.onload = function() {
    imageLoaded()
  }
  this.bigbus.onload = function() {
    imageLoaded()
  }
  // Set images src
  this.background.src = "assets/images/background.png";
  this.runner.src = "assets/images/avatar.png"
  this.drone.src = "assets/images/drone.png"
	this.burrow.src = "assets/images/burrow.png"
  this.garbage.src = "assets/images/garbage.gif"
  this.bigbus.src = "assets/images/bigbus.gif"
}
/***************************************************
 * Creates the Drawable object which will be the base class for
 * all drawable objects in the game. Sets up default variables
 * that all child objects will inherit, as well as the defualt
 * functions.
 ***************************************************/
function Drawable() {
  this.init = function(x, y, width, height) {
    // Default variables
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
}
/***************************************************
Parent Game Constructor - Ianitializes everything once
***************************************************/
function Game() {
  /*
   * Gets canvas information and context and sets up all game
   * objects.
   * Returns true if the canvas is supported and false if it
   * is not. This is to stop the animation script from constantly
   * running on browsers that do not support the canvas.
   */
  this.init = function() {
    // Get the canvas elements
    this.canvas = document.getElementById('canvas');

    // Test to see if canvas is supported by browser. Only need to
    // check one canvas
    if (this.canvas.getContext) {
      this.canvasCtx = this.canvas.getContext('2d');

      // Prototypal Inheritance
      Background.prototype.context = this.canvasCtx;
      Background.prototype.canvasWidth = this.canvas.width;
      Background.prototype.canvasHeight = this.canvas.height;
      Runner.prototype.context = this.canvasCtx;
      Runner.prototype.canvasWidth = this.canvas.width;
      Runner.prototype.canvasHeight = this.canvas.height;


      // Initialize the background object
      this.background = new Background(1);
      this.background.init(0, 0); // Set draw point to 0,0


      // Initialize the Runner object
      this.runner = new Runner();
      this.runner.init(10, 100, imageRepository.runner.width,
        imageRepository.runner.height);

      // Initializiling obstacles in background
      this.obstacle = new Background(4);

      this.obstacle.init(-400, 0, imageRepository.drone.width / 3, imageRepository.drone.height / 3)

      return true;
    } else {
      return false;
    }
  };


  // // Set Background to inherit properties from Drawable
  Background.prototype = new Drawable();
  Runner.prototype = new Drawable();

  // Start the animation loop
  this.start = function() {
    this.runner.draw();
    animate.call(this);
  };

  this.over = function() {
    if (para.gameState) {
      $('#score').html(Math.floor(para.score));
      $('#game-over').show();
      return true
    } else return false
  }

  this.reset = function() {
    para.gameState = 0
    para.pool = []
    para.speedMultiplier = 0.01
    para.hscore = Math.max(para.hscore, Math.floor(para.score))
    para.score = 0
    game.background.speed = 1
    game.obstacle.x = -200
    game.obstacle.speed = 4
  }

  $('.restart').click(function() {
    $('#game-over').hide();
    game.reset()
    game.start()
    game.runner.clear();
  });
}

/***************************************************
Avatar Constructor
***************************************************/
function Runner() {
  // adding properties directly to runner imported object

  this.gravity = 0.5
  this.dy = 0;
  this.jumpDy = -9;
  this.isFalling = false;
  this.isJumping = false;
  this.isDucking = false;
  // this.sheet     = new SpriteSheet("---.png", this.width, this.height);
  // this.walkAnim  = new Animation(player.sheet, 4, 0, 15);
  // this.anim      = this.walkAnim;
  this.draw = function() {

    if (this.isDucking) {
    this.context.drawImage(imageRepository.burrow, this.x, this.y)
    }
    else this.context.drawImage(imageRepository.runner, this.x, this.y)
    if (para.debugger) {
      this.context.fillRect(this.x,this.y,this.width,this.height);
    }
  };
  this.keypress = function() {
    // jump if not currently jumping or falling
    if (KEY_STATUS.space && this.dy === 0 && !this.isJumping) {
      this.isJumping = true;
      this.dy = this.jumpDy;
    }

    if (KEY_STATUS.down) {
      this.isDucking = true;
      this.width = 59
      this.height = 22
      this.y = 93 + 25
    }
    if (!KEY_STATUS.down && !this.isJumping) {
      this.isDucking = false;
      this.width = 44
      this.height = 47
      this.y = 93
    }

    this.y += this.dy;

    // add gravity
    if (this.isFalling || this.isJumping) {
      this.dy += this.gravity;
    }

    if (this.y >= 93) {
      this.isJumping = false;
      this.isFalling = false;
      this.dy = 0;
    }
  };

  /***************************************************
  This is the game clearing function
  ***************************************************/
  this.clear = function() {
    this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
  }

};
/***************************************************
 * Creates the Background object which will become a child of
 * the Drawable object. The background is drawn on the "background"
 * canvas and creates the illusion of moving by panning the image.
 ***************************************************/
function Background(speed,width,height) {
  this.speed = speed; // Redefine speed of the background for panning

  // Implement abstract function
  this.draw = function() {
    // Pan background
    this.x -= this.speed; //reverse this to move left
    this.speed += para.speedMultiplier
    this.context.drawImage(imageRepository.background, this.x, this.y);

    // Draw another image at the right edge of the first image
    this.context.drawImage(imageRepository.background, this.x - this.canvasWidth, this.y);

    // If the image scrolled off the screen, reset
    if (this.x <= -(this.canvasWidth))
      this.x = 0;
  };

  this.spawn = function() {

    // spawn an obstacle

    this.speed += para.speedMultiplier
    this.canvasWidth += 1
    $('background').css("width", this.canvasWidth)
    // console.log(this.canvasWidth)
    this.x -= this.speed; //reverse this to move left
    // console.log(this.y)

    this.context.font = "20px Inconsolata";
    this.context.textAlign = "topright";
    if (para.score <= 999999) {
      var scoreWithZeros = ("00000" + Math.floor(para.score)).slice(-6)
    }
    if (para.hscore) {
      var hscoreWithZeros = ("00000" + Math.floor(para.hscore)).slice(-6)
      this.context.fillText("HI " + hscoreWithZeros, 400, 20);
    }
    this.context.fillText(scoreWithZeros, 515, 20);

    // Debugger Collision Box
    // ****************
    if (para.debugger) {
      this.context.fillStyle = '#80FFFFFF'
      this.context.fillRect(this.x + this.width, this.y + this.height, this.width, this.height);
    }


    // console.log(pool,this.x)
    // If the image scrolled off the screen, reset
    if (this.x <= -(this.width) - 50) {
      para.pool.unshift()
      var index = getRandomArbitrary(0,para.obstacleType.length-1)
      para.pool.push(para.obstacleType[index])
      if (para.obstacleType[index] === 'drone') {
        //drones fly do they?
        this.y = getRandomArbitrary(22, 93)
      }
        //garbage cans don't fly
      else this.y = getRandomArbitrary(93, 93)
      // generate random gap
      this.x = getRandomArbitrary(900, 3000)
    }

    /*
    WIP code (Bad, bad code-but-works)
    */
    console.log(para.pool[para.pool.length-1])
    switch (para.pool[para.pool.length-1]) {
      case 'drone':
      this.obstacle = new Background(4);
      this.obstacle.init(this.x, this.y,imageRepository.drone.width,imageRepository.drone.height)
      this.context.drawImage(imageRepository.drone, this.x, this.y);
      break;
      case 'garbage':
      this.obstacle = new Background(4);
      this.obstacle.init(this.x, this.y,imageRepository.garbage.width,imageRepository.garbage.height)
      this.context.drawImage(imageRepository.garbage, this.x, this.y);
      break;
    }




  };

}
/***********************************************
 * The animation loop. Calls the requestAnimationFrame shim to
 * optimize the game loop and draws all game objects. This is a global function
 **********************************************/

function animate() {
  if (!game.over()) {
    requestAnimFrame(animate); // This allows me to use frames!
    game.runner.clear();
    game.background.draw();
    game.obstacle.spawn();
    game.runner.keypress();
    game.runner.draw();
    para.score += 0.5

  }
  // console.log(game.runner.x,game.runner.y)
  // console.log(testCollision(game.runner,game.obstacle))
  if (testCollision(game.runner, game.obstacle)) {
    console.log(game.obstacle.y)
    para.gameState = 1
  } else para.gameState = 0
}

/***************************************************
A global function I use to call for random numbers
***************************************************/

function getRandomArbitrary(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

/***********************************************************************
A neater way of setting a setTimeout function by frame rates + compatibility with browsers. Executes a self-calling function
*********************************************************/

window.requestAnimFrame = (function() {
  return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function( /* function */ callback, /* DOMElement */ element) {
      window.setTimeout(this.callback.bind(this), 1000 / 60);
    };
})();


/*****************
COLLISION BOX LOGIC
******************/

testCollisionRectRect = function(rect1, rect2) {
  // Collision logic
  return rect1.x <= rect2.x + rect2.width &&
    rect2.x <= rect1.x + rect1.width &&
    rect1.y <= rect2.y + rect2.height &&
    rect2.y <= rect1.y + rect1.height;
}

function testCollision(object1, object2) {
  var rect1 = { // runner
    x: object1.x - 10, // finds top left x point
    y: object1.y, // finds top left y point
    width: object1.width,
    height: object1.height,
  }
  var rect2 = { //obstacle
    x: object2.x + object2.width,
    y: object2.y + object2.height,
    width: object2.width,
    height: object2.height,
  }
  return testCollisionRectRect(rect1, rect2);
}
/***************************************************
Keystroke Checker
**************************************************/
KEY_CODES = {
  32: 'space',
  38: 'up',
  40: 'down',
}
// Create an object to check true/false. Initialize all values to false
KEY_STATUS = {};
for (code in KEY_CODES) {
  KEY_STATUS[KEY_CODES[code]] = false;
}
document.onkeydown = function(e) {
  // Firefox and opera use charCode instead of keyCode to
  // return which key was pressed.
  var keyCode = (e.keyCode) ? e.keyCode : e.charCode;
  if (KEY_CODES[keyCode]) {
    e.preventDefault();
    KEY_STATUS[KEY_CODES[keyCode]] = true;
  }
}
// need to update to false else avatar will be permanently jumping
document.onkeyup = function(e) {
  var keyCode = (e.keyCode) ? e.keyCode : e.charCode;
  if (KEY_CODES[keyCode]) {
    e.preventDefault();
    KEY_STATUS[KEY_CODES[keyCode]] = false;
  }
}
