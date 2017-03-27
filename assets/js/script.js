/***************
 Setting up the structure of the game and variables, CAPS for static variables
 ***************/
/**
 * Initialize the Game and starts it.
 */
var game = new Game();

function init() {
	if(game.init())
		game.start();
}

KEY_CODES = {
  32: 'space',
  38: 'up',
  40: 'down',
}

// Create an object to check true/false. Initialize all values to false
KEY_STATUS = {};
for (code in KEY_CODES) {
  KEY_STATUS[ KEY_CODES[ code ]] = false;
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

document.onkeyup = function(e) {
  var keyCode = (e.keyCode) ? e.keyCode : e.charCode;
  if (KEY_CODES[keyCode]) {
    e.preventDefault();
    KEY_STATUS[KEY_CODES[keyCode]] = false;
  }
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
 // 	this.bullet = new Image()

 	// Ensure all images have loaded before starting the game
 	var numImages = 2;
 	var numLoaded = 0;
 	function imageLoaded() {
 		numLoaded++;
 		if (numLoaded === numImages) {
 			window.init()
 		}
 	}
 	this.background.onload = function() {
 		imageLoaded()
 	}
 	this.runner.onload = function() {
 		imageLoaded()
 	}

 	// Set images src
  this.background.src = "assets/images/bg.png";
  this.runner.src= "assets/images/avatar.png"

// adding obstacles for LATER
 // 	this.obstacle.src = "imgs/bullet.png";
 }

/**
 * Creates the Drawable object which will be the base class for
 * all drawable objects in the game. Sets up default variables
 * that all child objects will inherit, as well as the defualt
 * functions.
 */

function Drawable() {
	this.init = function(x, y, width, height) {
		// Default variables
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}
}
/**
 * Creates the Background object which will become a child of
 * the Drawable object. The background is drawn on the "background"
 * canvas and creates the illusion of moving by panning the image.
 */




function Background() {
	this.speed = 1; // Redefine speed of the background for panning

	// Implement abstract function
	this.draw = function() {
		// Pan background
		this.x -= this.speed; //reverse this to move left

		this.context.drawImage(imageRepository.background, this.x, this.y);

		// Draw another image at the right edge of the first image
		this.context.drawImage(imageRepository.background, this.x - this.canvasWidth, this.y);

		// If the image scrolled off the screen, reset
		if (this.x <= -(this.canvasWidth))
			this.x = 0;
	};
}
// Set Background to inherit properties from Drawable
Background.prototype = new Drawable();


/**
 * Creates the Game object which will hold all objects and data for
 * the game.
 */



 function runner() {
 // perhaps needed later
 // 	this.speed = 3
 	  this.draw = function() {
 		this.context.drawImage(imageRepository.runner, this.x, this.y);
 	};

 	this.move = function() {
 		// Determine if the action is move action
 			// The runner moved, so erase it's current image so it can
 			// be redrawn in it's new location
 		// 	this.context.clearRect(this.x, this.y, this.width, this.height);
    if (KEY_STATUS.up || KEY_STATUS.space) {
      console.log("up or space pressed")
          // jump code goes here
		} else if (KEY_STATUS.down) {
      console.log("duck!!")
      // duck code goes here
		}
 	}
 	};

 runner.prototype = new Drawable();

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
 		this.obsCanvas = document.getElementById('obstacles');
 		// Test to see if canvas is supported. Only need to
 		// check one canvas
 		if (this.bgCanvas.getContext) {
 			this.bgContext = this.bgCanvas.getContext('2d');
 			this.runnerContext = this.runnerCanvas.getContext('2d');
 			this.obsContext = this.obsCanvas.getContext('2d');

 			// Prototypal Inheritance
 			Background.prototype.context = this.bgContext;
 			Background.prototype.canvasWidth = this.bgCanvas.width;
 			Background.prototype.canvasHeight = this.bgCanvas.height;
 			runner.prototype.context = this.runnerContext;
 			runner.prototype.canvasWidth = this.runnerCanvas.width;
 			runner.prototype.canvasHeight = this.runnerCanvas.height;
 		// 	obstacles.prototype.context = this.obsContext;
      // obstacles.prototype.canvasWidth = this.obsCanvas.width;
 		// 	obstacles.prototype.canvasHeight = this.obsCanvas.height;

 			// Initialize the background object
 			this.background = new Background();
 			this.background.init(0,0); // Set draw point to 0,0
 			// Initialize the runner object
 			this.runner = new runner();
 			this.runner.init(0, 0, imageRepository.runner.width,
 			               imageRepository.runner.height);
 			return true;
 		} else {
 			return false;
 		}
 	};
 	// Start the animation loop
 	this.start = function() {
 		this.runner.draw();
 		animate();
 	};
 }
 /**
  * The animation loop. Calls the requestAnimationFrame shim to
  * optimize the game loop and draws all game objects. This
  * function must be a gobal function and cannot be within an
  * object.
  */
 function animate() {
 	requestAnimFrame( animate );
 	game.background.draw();
 	game.runner.move();
 }

 window.requestAnimFrame = (function(){
	return  window.requestAnimationFrame       ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame    ||
			window.oRequestAnimationFrame      ||
			window.msRequestAnimationFrame     ||
			function(/* function */ callback, /* DOMElement */ element){
				window.setTimeout(callback, 1000 / 60);
			};
})();
