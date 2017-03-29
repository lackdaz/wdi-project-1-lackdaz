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
  gameState: 0,
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
  this.bush = new Image()
  // 	this.bullet = new Image()

  // Ensure all images have loaded before starting the game
  var numImages = 3;
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
  this.bush.onload = function() {
    imageLoaded()
  }

  // Set images src
  this.background.src = "assets/images/background.png";
  this.runner.src = "assets/images/avatar.png"
  this.bush.src = "assets/images/bush3.png"
  // adding obstacles for LATER
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
    this.bgCanvas = document.getElementById('background');
    this.runnerCanvas = document.getElementById('pangolin');

    // Test to see if canvas is supported by browser. Only need to
    // check one canvas
    if (this.bgCanvas.getContext) {
      this.bgContext = this.bgCanvas.getContext('2d');
      this.runnerContext = this.runnerCanvas.getContext('2d');

      // Prototypal Inheritance
      Background.prototype.context = this.bgContext;
      Background.prototype.canvasWidth = this.bgCanvas.width;
      Background.prototype.canvasHeight = this.bgCanvas.height;
      runner.prototype.context = this.runnerContext;
      runner.prototype.canvasWidth = this.runnerCanvas.width;
      runner.prototype.canvasHeight = this.runnerCanvas.height;


      // Initialize the background object
      this.background = new Background(1);
      this.background.init(0, 0); // Set draw point to 0,0


      // Initialize the runner object
      this.runner = new runner();
      this.runner.init(10, 100, imageRepository.runner.width,
        imageRepository.runner.height);

      // Initializiling obstacles in background
      this.obstacle = new Background(4);
      this.obstacle.init(-200, 0, imageRepository.bush.width / 3, imageRepository.bush.height / 3)


      return true;
    } else {
      return false;
    }
  };

  /***************************************************
   * Creates the Background object which will become a child of
   * the Drawable object. The background is drawn on the "background"
   * canvas and creates the illusion of moving by panning the image.
   ***************************************************/
  function Background(speed) {
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
      if (para.pool.length === 0) {
        this.y = getRandomArbitrary(0, 93)
        para.pool.push(this.y)
        // console.log('spawned: '+this.y)
        // console.log('obstacle pool: '+para.pool.length)
      }
      this.speed += para.speedMultiplier
      this.canvasWidth += 1
      $('background').css("width", this.canvasWidth)
      console.log(this.canvasWidth)
      this.x -= this.speed; //reverse this to move left
      this.context.drawImage(imageRepository.bush, this.x, this.y);
      console.log(this.y)

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
      this.context.fillStyle = '#80FFFFFF'
      this.context.fillRect(this.x + this.width, this.y + this.height, this.width, this.height);
      // console.log(pool,this.x)
      // If the image scrolled off the screen, reset
      if (this.x <= -(this.width) - 50) {
        this.x = getRandomArbitrary(900, 1500)
        para.pool.pop()
        console.log('obstacle pool:' + para.pool.length)
      }

    };

  }
  // Set Background to inherit properties from Drawable
  Background.prototype = new Drawable();
  runner.prototype = new Drawable();

  /***************************************************
  Avatar Constructor, Child of Game Constructor
  ***************************************************/
  function runner() {
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
      // this.context.fillRect(this.x,this.y,this.width,this.height);
      this.context.drawImage(imageRepository.runner, this.x, this.y);
      // console.log(this.y)
    };
    this.update = function() {
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
      // // change animation if falling
      // if (this.dy > 0) {
      //   this.anim = this.fallAnim;
      // }
      // // change animation is jumping
      // else if (this.dy < 0) {
      //   this.anim = this.jumpAnim;
      // }
      // else {
      //   this.anim = this.walkAnim;
      // }

      // this.anim.update();

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



  // Start the animation loop
  this.start = function() {
    this.runner.draw();
    animate();
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
    game.obstacle.x = 1000
    game.obstacle.speed = 4
  }

  $('.restart').click(function() {
    $('#game-over').hide();
    game.reset()
    game.start()
    game.runner.clear();
  });
}



/***********************************************
 * The animation loop. Calls the requestAnimationFrame shim to
 * optimize the game loop and draws all game objects. This is a global function
 **********************************************/

function animate() {
  if (!game.over()) {
    requestAnimFrame(animate); // This allows me to use frames!
    game.background.draw();
    game.obstacle.spawn();
    game.runner.update();
    game.runner.clear();
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
      window.setTimeout(callback, 1000 / 60);
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
